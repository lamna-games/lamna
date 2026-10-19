import crypto from 'node:crypto';
import {catalogByCategory} from './serverQuestionBank.mjs';
import {validateMatchProgress} from './matchProgress.mjs';
import {validQuestionImageUrl} from './questionImagePolicy.mjs';

/* All entitlements and usage are server-authoritative, never localStorage.
   No successful payment, credit grant or account can be simulated client-side. */
const packages=Object.freeze([
 {games:1,halalas:999,currency:'SAR'},
 {games:3,halalas:1999,currency:'SAR'},
 {games:5,halalas:2999,currency:'SAR'}
]);
const allowed='https://lamna-board-20-preview.onrender.com';
const reasons=['question_error','answer_error','image_unreadable','other'];

function send(req,res,status,data){
 const origin=req.headers.origin;
 if(origin && (origin===allowed || /^http:\/\/localhost:\d+$/.test(origin))){
  res.setHeader('Access-Control-Allow-Origin',origin);res.setHeader('Vary','Origin');
 }
 res.setHeader('Content-Type','application/json; charset=utf-8');
 res.setHeader('Cache-Control','no-store');
 res.writeHead(status);res.end(JSON.stringify(data));
}
const validOrigin=req=>!req.headers.origin || req.headers.origin===allowed || /^http:\/\/localhost:\d+$/.test(req.headers.origin);
const readJson=req=>new Promise((resolve,reject)=>{
 let s='';req.on('data',c=>{s+=c;if(s.length>12000){reject(new Error('large'));req.destroy();}});
 req.on('end',()=>{try{resolve(JSON.parse(s||'{}'))}catch{reject(new Error('invalid_json'))}});
 req.on('error',reject);
});
let schema=null;
async function setup(pool){
 if(!schema){
 schema=(async()=>{
 await pool.query('ALTER TABLE lamna_accounts ADD COLUMN IF NOT EXISTS is_admin BOOLEAN NOT NULL DEFAULT FALSE');
 await pool.query(`CREATE TABLE IF NOT EXISTS lamna_entitlements(
  account_id BIGINT PRIMARY KEY REFERENCES lamna_accounts(id) ON DELETE CASCADE,
  free_used BOOLEAN NOT NULL DEFAULT FALSE,
  credits INTEGER NOT NULL DEFAULT 0 CHECK(credits >= 0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now())`);
 await pool.query(`CREATE TABLE IF NOT EXISTS lamna_paid_orders(
  id UUID PRIMARY KEY,account_id BIGINT NOT NULL REFERENCES lamna_accounts(id),
  games INTEGER NOT NULL CHECK (games IN (1,3,5)),
  amount_halalas INTEGER NOT NULL CHECK (amount_halalas > 0),
  status TEXT NOT NULL CHECK(status IN ('pending','paid','cancelled','failed')),
  provider TEXT, provider_reference TEXT UNIQUE,created_at TIMESTAMPTZ DEFAULT now(),
  paid_at TIMESTAMPTZ)`);
 await pool.query(`CREATE TABLE IF NOT EXISTS lamna_matches(
  id UUID PRIMARY KEY,account_id BIGINT NOT NULL REFERENCES lamna_accounts(id) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK(kind IN('free','paid')),
  selected INTEGER[] NOT NULL,questions JSONB NOT NULL,
  match_name TEXT NOT NULL DEFAULT '',
  progress JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'active' CHECK(status IN('active','completed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),finished_at TIMESTAMPTZ)`);
 await pool.query("ALTER TABLE lamna_matches ADD COLUMN IF NOT EXISTS progress JSONB NOT NULL DEFAULT '{}'::jsonb");
 await pool.query(`CREATE TABLE IF NOT EXISTS lamna_seen_questions(
  account_id BIGINT NOT NULL REFERENCES lamna_accounts(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,match_id UUID NOT NULL REFERENCES lamna_matches(id),
  PRIMARY KEY(account_id,question_id))`);
 await pool.query(`CREATE TABLE IF NOT EXISTS lamna_question_reports(
  id UUID PRIMARY KEY, account_id BIGINT NOT NULL REFERENCES lamna_accounts(id),
  match_id UUID NOT NULL REFERENCES lamna_matches(id),
  question_number INTEGER NOT NULL CHECK (question_number BETWEEN 0 AND 35),
  reason TEXT NOT NULL CHECK(reason IN ('question_error','answer_error','image_unreadable','other')),
  comment TEXT NOT NULL DEFAULT '',created_at TIMESTAMPTZ DEFAULT now(),
  resolved_at TIMESTAMPTZ,
  UNIQUE(account_id,match_id,question_number,reason))`);
 await pool.query('ALTER TABLE lamna_question_reports ADD COLUMN IF NOT EXISTS resolved_at TIMESTAMPTZ');
 await pool.query(`CREATE TABLE IF NOT EXISTS lamna_question_edits(
  question_id TEXT PRIMARY KEY,prompt TEXT NOT NULL,answer TEXT NOT NULL,hint TEXT NOT NULL,
  updated_by BIGINT NOT NULL REFERENCES lamna_accounts(id),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now())`);
 await pool.query("ALTER TABLE lamna_question_edits ADD COLUMN IF NOT EXISTS image_url TEXT NOT NULL DEFAULT ''");
 await pool.query(`CREATE TABLE IF NOT EXISTS lamna_game_controls(
  game_id INTEGER PRIMARY KEY CHECK(game_id BETWEEN 0 AND 80),
  disabled BOOLEAN NOT NULL DEFAULT FALSE,
  reason TEXT NOT NULL DEFAULT '',updated_by BIGINT NOT NULL REFERENCES lamna_accounts(id),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now())`);
 // Old installations have an automatically named CHECK for IDs 0..79.
 // Extend it in place without rewriting game IDs or stored matches.
 await pool.query('ALTER TABLE lamna_game_controls DROP CONSTRAINT IF EXISTS lamna_game_controls_game_id_check');
 await pool.query('ALTER TABLE lamna_game_controls ADD CONSTRAINT lamna_game_controls_game_id_check CHECK(game_id BETWEEN 0 AND 80)');
 await pool.query(`CREATE TABLE IF NOT EXISTS lamna_admin_audit(
  id BIGSERIAL PRIMARY KEY,actor_id BIGINT NOT NULL REFERENCES lamna_accounts(id),
  action TEXT NOT NULL,entity TEXT NOT NULL,details JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now())`);
 })().catch(e=>{schema=null;throw e;});
 }
 await schema;
}
async function account(pool,req){
 const match=/^Bearer ([a-f0-9]{64})$/.exec(String(req.headers.authorization||''));
 if(!match)return null;
 const hash=crypto.createHash('sha256').update(match[1]).digest('hex');
 const r=await pool.query(`SELECT a.id,a.first_name,a.email,a.is_admin
 FROM lamna_sessions s JOIN lamna_accounts a ON a.id=s.account_id
 WHERE s.token_hash=$1 AND s.expires_at>now() LIMIT 1`,[hash]);
 return r.rows[0]||null;
}
async function readMe(pool,id){
 await pool.query('INSERT INTO lamna_entitlements(account_id) VALUES ($1) ON CONFLICT DO NOTHING',[id]);
 const balance=await pool.query('SELECT free_used,credits FROM lamna_entitlements WHERE account_id=$1',[id]);
 const m=await pool.query('SELECT id,kind,selected,match_name,status,created_at FROM lamna_matches WHERE account_id=$1 ORDER BY created_at DESC LIMIT 12',[id]);
 return {freeRemaining:!balance.rows[0].free_used,credits:balance.rows[0].credits,matches:m.rows};
}

async function questionPool(client,category,kind){
 const original=catalogByCategory(category,kind);
 const overrides=await client.query('SELECT question_id,prompt,answer,hint,image_url AS "imageUrl" FROM lamna_question_edits WHERE question_id=ANY($1::text[])',[original.map(x=>x.id)]);
 const edited=new Map(overrides.rows.map(x=>[x.question_id,x]));
 return original.map(q=>({...q,...(edited.get(q.id)||{})}));
}
const isValidGame=id=>Number.isInteger(id)&&id>=0&&id<81;
const validQuestionText=(s,min,max)=>typeof s==='string'&&s.trim().length>=min&&s.trim().length<=max&&!/[|\r\n]/.test(s);

export async function handleStore(req,res,url,pool,ensureAccounts){
 if(!url.pathname.startsWith('/api/store/'))return false;
 if(!validOrigin(req)){send(req,res,403,{message:'غير مسموح'});return true;}
 if(req.method==='OPTIONS'){
  res.setHeader('Access-Control-Allow-Origin',req.headers.origin||allowed);
  res.setHeader('Vary','Origin');
  res.setHeader('Access-Control-Allow-Headers','Authorization, Content-Type');
  res.setHeader('Access-Control-Allow-Methods','GET, POST, OPTIONS');
  res.writeHead(204);res.end();return true;
 }
 const route=url.pathname;
 if(route==='/api/store/packages' && req.method==='GET'){
  send(req,res,200,{packages,checkoutAvailable:false});return true;
 }
 if(route==='/api/store/demo' && req.method==='GET'){
  // Public trial content is FREE ONLY, is not a paid match, and does not
  // access the database, user accounts, saved questions, or entitlements.
  // Using an explicit selected list prevents exposing the paid question bank.
  const parts=String(url.searchParams.get('selected')||'').split(',');
  const selected=parts.map(x=>Number(x));
  if(parts.length!==6||parts.some(x=>!/^(0|[1-9][0-9]?)$/.test(x))||
    new Set(selected).size!==6||selected.some(x=>!Number.isInteger(x)||x<0||x>=80)){
    send(req,res,400,{message:'اختر ست فئات مختلفة متاحة لتجربة لمنا دون حساب.'});return true;
  }
  const questions=selected.map(category=>catalogByCategory(category,'free').slice(0,6));
  if(questions.some(set=>set.length!==6)){
    send(req,res,503,{message:'بعض أسئلة التجربة غير مكتملة؛ اختر فئات أخرى.'});return true;
  }
  send(req,res,200,{kind:'demo',selected,questions,saved:false,usesCredits:false});return true;
 }

 if(!pool){send(req,res,503,{message:'نظام الحسابات والاشتراكات غير متاح حتى يتم ربط قاعدة البيانات.'});return true;}
 try{await ensureAccounts();await setup(pool);}catch{
  send(req,res,503,{message:'تعذر الوصول إلى قاعدة البيانات.'});return true;
 }
 const user=await account(pool,req).catch(()=>null);
 if(!user){send(req,res,401,{message:'سجّل دخولك لاستخدام المباريات.'});return true;}
 if(route.startsWith('/api/store/admin/')&&!user.is_admin){
  send(req,res,403,{message:'هذه الخدمة مخصصة لإدارة لمنا فقط.'});return true;
 }
 if(route==='/api/store/admin/overview'&&req.method==='GET'){
  const metrics=await pool.query(`SELECT
   (SELECT COUNT(*)::int FROM lamna_accounts) AS accounts,
   (SELECT COUNT(*)::int FROM lamna_matches) AS matches,
   (SELECT COUNT(*)::int FROM lamna_matches WHERE kind='paid') AS paid_matches,
   (SELECT COUNT(*)::int FROM lamna_question_reports WHERE resolved_at IS NULL) AS open_reports,
   (SELECT COALESCE(SUM(credits),0)::int FROM lamna_entitlements) AS remaining_credits`);
  const actions=await pool.query(`SELECT id,actor_id,action,entity,details,created_at FROM lamna_admin_audit ORDER BY id DESC LIMIT 50`);
  send(req,res,200,{metrics:metrics.rows[0],audit:actions.rows});return true;
 }
 if(route==='/api/store/admin/games'&&req.method==='GET'){
  const r=await pool.query('SELECT game_id,disabled,reason,updated_at FROM lamna_game_controls ORDER BY game_id');
  send(req,res,200,{games:r.rows});return true;
 }
 if(route==='/api/store/admin/questions'&&req.method==='GET'){
  const gameId=Number(url.searchParams.get('gameId'));
  const kind=url.searchParams.get('kind');
  if(!isValidGame(gameId)||!['free','paid'].includes(kind)){
   send(req,res,400,{message:'حدد اللعبة ونوع الأسئلة بشكل صحيح.'});return true;
  }
  const questions=await questionPool(pool,gameId,kind);
  const edits=await pool.query('SELECT question_id FROM lamna_question_edits WHERE question_id=ANY($1::text[])',[questions.map(q=>q.id)]);
  send(req,res,200,{questions,editedIds:edits.rows.map(x=>x.question_id)});return true;
 }
 if(route==='/api/store/admin/reports'&&req.method==='GET'){
  if(!user.is_admin){send(req,res,403,{message:'هذه الصفحة مخصصة لإدارة لمنا.'});return true;}
  const r=await pool.query(`SELECT q.id,q.match_id,q.question_number,q.reason,q.comment,q.created_at,q.resolved_at,
   m.match_name,m.selected,m.questions
   FROM lamna_question_reports q JOIN lamna_matches m ON m.id=q.match_id
   ORDER BY (q.resolved_at IS NULL) DESC,q.created_at DESC LIMIT 150`);
  send(req,res,200,{reports:r.rows.map(r=>{
   const col=Math.floor(r.question_number/6),slot=r.question_number%6;
   const question=r.questions?.[col]?.[slot];
   return {id:r.id,matchId:r.match_id,matchName:r.match_name,reason:r.reason,comment:r.comment,createdAt:r.created_at,resolvedAt:r.resolved_at,
    category:r.selected?.[col],questionNumber:r.question_number,prompt:question?.prompt||'',answer:question?.answer||''};
  })});return true;
 }
 if(route==='/api/store/me'&&req.method==='GET'){
  send(req,res,200,{user:{id:user.id,firstName:user.first_name,isAdmin:Boolean(user.is_admin)},...(await readMe(pool,user.id))});return true;
 }
 if(route.startsWith('/api/store/matches/')&&req.method==='GET'){
  const id=route.slice('/api/store/matches/'.length);
  if(!/^[a-f0-9-]{36}$/i.test(id)){send(req,res,400,{message:'معرف غير صحيح'});return true;}
  const record=await pool.query('SELECT id,kind,selected,questions,match_name,status,progress FROM lamna_matches WHERE id=$1 AND account_id=$2',[id,user.id]);
  if(!record.rowCount){send(req,res,404,{message:'المباراة غير موجودة'});return true;}
  send(req,res,200,{match:record.rows[0]});return true;
 }
 if(req.method!=='POST'){send(req,res,405,{message:'العملية غير مدعومة'});return true;}
 let data;
 try{data=await readJson(req);}catch{send(req,res,400,{message:'الطلب غير صحيح'});return true;}
 if(route==='/api/store/admin/question'){
  const gameId=Number(data.gameId),kind=String(data.kind||''),index=Number(data.index);
  if(!isValidGame(gameId)||!['free','paid'].includes(kind)||!Number.isInteger(index)||index<0||index>=(kind==='free'?6:12)){
   send(req,res,400,{message:'اختر سؤالًا موجودًا لتعديله.'});return true;
  }
  const questionId=kind+'-'+gameId+'-'+index;
  const original=catalogByCategory(gameId,kind)[index];
  if(!original){send(req,res,404,{message:'السؤال غير موجود.'});return true;}
  const restore=data.restore===true;
  const prompt=restore?original.prompt:String(data.prompt||'').trim();
  const answer=restore?original.answer:String(data.answer||'').trim();
  const hint=restore?original.hint:String(data.hint||'').trim();
  const imageUrl=restore?'':String(data.imageUrl||'').trim();
  if(!validQuestionText(prompt,9,400)||!validQuestionText(answer,1,180)||!validQuestionText(hint,1,180)){
   send(req,res,400,{message:'تحقق من طول السؤال والإجابة والتلميح وتجنب فواصل الأسطر.'});return true;
  }
  if(!validQuestionImageUrl(imageUrl)){
   send(req,res,400,{message:'رابط الصورة غير معتمد؛ استخدم رابط صورة من مكتبة لمنا على Cloudinary.'});return true;
  }
  const normalize=t=>String(t).normalize('NFKC').replace(/[\u064b-\u065f\u0670\u0640\s؟?،,.!«»"'()]/g,'').toLowerCase();
  const client=await pool.connect();
  try{
   await client.query('BEGIN');
   const before=await client.query('SELECT prompt,answer,hint,image_url FROM lamna_question_edits WHERE question_id=$1 FOR UPDATE',[questionId]);
   // Prevent introducing copies across any of the 1,440 original questions
   // or their existing editorial overrides.
   const currentEdits=await client.query('SELECT question_id,prompt FROM lamna_question_edits');
   const overrides=new Map(currentEdits.rows.map(x=>[x.question_id,x.prompt]));
   if(!restore){
    const canonical=normalize(prompt);let duplicate=false;
    for(let gid=0;gid<81&&!duplicate;gid++)for(let k of ['free','paid']){
     for(const q of catalogByCategory(gid,k)){
      if(q.id!==questionId&&normalize(overrides.get(q.id)||q.prompt)===canonical){duplicate=true;break;}
     }
     if(duplicate)break;
    }
    if(duplicate){await client.query('ROLLBACK');send(req,res,409,{message:'يوجد سؤال بنفس النص في لعبة أخرى؛ غيّر الصياغة والمعلومة.'});return true;}
   }
   if(restore){
    await client.query('DELETE FROM lamna_question_edits WHERE question_id=$1',[questionId]);
   }else{
    await client.query(`INSERT INTO lamna_question_edits(question_id,prompt,answer,hint,image_url,updated_by) VALUES($1,$2,$3,$4,$5,$6)
     ON CONFLICT(question_id) DO UPDATE SET prompt=EXCLUDED.prompt,answer=EXCLUDED.answer,hint=EXCLUDED.hint,image_url=EXCLUDED.image_url,updated_by=EXCLUDED.updated_by,updated_at=now()`,[questionId,prompt,answer,hint,imageUrl,user.id]);
   }
   await client.query('INSERT INTO lamna_admin_audit(actor_id,action,entity,details) VALUES($1,$2,$3,$4::jsonb)',[
    user.id,restore?'restore_question':'edit_question',questionId,JSON.stringify({before:before.rows[0]||original,after:{prompt,answer,hint,imageUrl}})]);
   await client.query('COMMIT');
   send(req,res,200,{ok:true,questionId,question:{...original,prompt,answer,hint,imageUrl}});return true;
  }catch(e){await client.query('ROLLBACK').catch(()=>{});throw e;}finally{client.release();}
 }
 if(route==='/api/store/admin/game'){
  const gameId=Number(data.gameId),disabled=data.disabled,reason=String(data.reason||'').trim().slice(0,200);
  if(!isValidGame(gameId)||typeof disabled!=='boolean'){
   send(req,res,400,{message:'حدد اللعبة والحالة الجديدة.'});return true;
  }
  const client=await pool.connect();
  try{
   await client.query('BEGIN');
   await client.query(`INSERT INTO lamna_game_controls(game_id,disabled,reason,updated_by) VALUES($1,$2,$3,$4)
    ON CONFLICT(game_id) DO UPDATE SET disabled=EXCLUDED.disabled,reason=EXCLUDED.reason,updated_by=EXCLUDED.updated_by,updated_at=now()`,[gameId,disabled,reason,user.id]);
   await client.query('INSERT INTO lamna_admin_audit(actor_id,action,entity,details) VALUES($1,$2,$3,$4::jsonb)',[
    user.id,'set_game_status',String(gameId),JSON.stringify({disabled,reason})]);
   await client.query('COMMIT');
   send(req,res,200,{ok:true,gameId,disabled});return true;
  }catch(e){await client.query('ROLLBACK').catch(()=>{});throw e;}finally{client.release();}
 }
 if(route==='/api/store/matches'){
  const selected=data.selected;
  if(!Array.isArray(selected)||selected.length!==6||new Set(selected).size!==6||selected.some(x=>!Number.isInteger(x)||x<0||x>80)){
   send(req,res,400,{message:'اختر ست فئات مختلفة.'});return true;
  }
  const matchName=String(data.matchName||'').trim().slice(0,50);
  const teams=Array.isArray(data.teams)?data.teams.map(t=>String(t||'').trim().slice(0,25)):[];
  const aids=Array.isArray(data.chosenAids)?data.chosenAids:[];
  const validAids=['phone','two','rest','pit','trap'];
  if(!matchName||teams.length!==2||teams.some(t=>!t)||aids.length!==2||aids.some(list=>!Array.isArray(list)||list.length!==3||new Set(list).size!==3||list.some(id=>!validAids.includes(id)))){
   send(req,res,400,{message:'اكتب اسم المباراة واسم الفريقين واختر ثلاث وسائل مختلفة لكل فريق.'});return true;
  }
  const initialProgress={teams,chosenAids:aids,scores:[0,0],used:[],turn:0,usedAids:[[],[]],history:[]};
  const client=await pool.connect();
  try{
   await client.query('BEGIN');
   await client.query('INSERT INTO lamna_entitlements(account_id) VALUES ($1) ON CONFLICT DO NOTHING',[user.id]);
   const row=(await client.query('SELECT free_used,credits FROM lamna_entitlements WHERE account_id=$1 FOR UPDATE',[user.id])).rows[0];
   const active=await client.query("SELECT id,kind,selected,questions,match_name,status,progress FROM lamna_matches WHERE account_id=$1 AND status='active' ORDER BY created_at DESC LIMIT 1",[user.id]);
   if(active.rowCount){await client.query('ROLLBACK');send(req,res,409,{code:'active_match',message:'عندك مباراة قائمة. كمّلها أولًا قبل بدء مباراة جديدة.',match:active.rows[0]});return true;}
   const disabled=await client.query('SELECT game_id FROM lamna_game_controls WHERE disabled=TRUE AND game_id=ANY($1::integer[])',[selected]);
   if(disabled.rowCount){await client.query('ROLLBACK');send(req,res,409,{code:'game_unavailable',message:'إحدى الألعاب المختارة متوقفة للمراجعة. اختر لعبة أخرى ولن يُخصم أي رصيد.'});return true;}
   const kind=row.free_used?'paid':'free';
   if(kind==='paid' && row.credits===0){await client.query('ROLLBACK');send(req,res,402,{code:'no_credit',message:'انتهت المباراة المجانية. اختر باقة لإضافة رصيد.'});return true;}
   // Category 80 is a photo-identification puzzle, not a text quiz. Keep it
   // unavailable until all 18 genuine, model-checked photographs are licensed.
   // Reject before any free entitlement or paid credit can be used.
   if(selected.includes(80)){
    await client.query('ROLLBACK');
    send(req,res,409,{code:'car_photos_pending',message:'عالم السيارات قيد تجهيز الصور الحقيقية المطابقة للموديلات. لا يمكنك اختياره الآن ولن يُخصم رصيد.'});
    return true;
   }
   if(kind==='paid'&&selected.includes(1)){
    await client.query('ROLLBACK');send(req,res,409,{code:'image_bank_pending',message:'فئة ولا كلمة المدفوعة تحتاج صورًا جديدة قبل استخدامها؛ اختر فئة أخرى حاليًا.'});return true;
   }
   // Paid content must not repeat across games, even when two categories share
   // the same question text. Inspect historical match snapshots, not just IDs.
   const normalizeQuestion=(prompt)=>String(prompt||'').normalize('NFKC').replace(/[\u064B-\u065F\u0670\u0640\s؟?،,.!«»"']/g,'').toLowerCase();
   const blockedPrompts=new Set();
   if(kind==='paid'){
    // Previously viewed FREE questions count as seen too: a paid match must
    // not recycle anything revealed during the customer's single free match.
    const history=await client.query("SELECT questions FROM lamna_matches WHERE account_id=$1",[user.id]);
    for(const oldMatch of history.rows){
     for(const column of (Array.isArray(oldMatch.questions)?oldMatch.questions:[])){
      for(const q of (Array.isArray(column)?column:[])){
       if(q?.prompt)blockedPrompts.add(normalizeQuestion(q.prompt));
      }
     }
    }
   }
   let questions=[];
   for(const c of selected){
    const poolItems=await questionPool(client,c,kind);
    if(kind==='free'){questions.push(poolItems.slice(0,6));continue;}
    const seen=await client.query('SELECT question_id FROM lamna_seen_questions WHERE account_id=$1 AND question_id LIKE $2',[user.id,'paid-'+c+'-%']);
    const blocked=new Set(seen.rows.map(v=>v.question_id));
    // Each category has twelve paid questions: four candidates for each
    // difficulty tier (200, 400, 600). The board has exactly two slots per
    // tier. Never put a hard question in a 200-point slot by random shuffling.
    const selection=[];
    for(let tier=0;tier<3;tier++){
     const candidates=poolItems.slice(tier*4,tier*4+4)
       .filter(item=>!blocked.has(item.id)&&!blockedPrompts.has(normalizeQuestion(item.prompt)));
     if(candidates.length<2){
      await client.query('ROLLBACK');
      send(req,res,409,{code:'questions_exhausted',message:'لا توجد أسئلة جديدة كافية في مستوى '+[200,400,600][tier]+' لإحدى الفئات. لن يُخصم من رصيدك شيء؛ اختر فئات أخرى.'});
      return true;
     }
     const picked=candidates.map(x=>({x,n:crypto.randomInt(0,0x7fffffff)}))
       .sort((a,b)=>a.n-b.n).slice(0,2).map(y=>y.x);
     selection.push(...picked);
     picked.forEach(q=>blockedPrompts.add(normalizeQuestion(q.prompt)));
    }
    questions.push(selection);
   }
   const id=crypto.randomUUID();
   await client.query('INSERT INTO lamna_matches(id,account_id,kind,selected,questions,match_name,progress) VALUES($1,$2,$3,$4,$5,$6,$7)',[id,user.id,kind,selected,JSON.stringify(questions),matchName,JSON.stringify(initialProgress)]);
   if(kind==='free')await client.query('UPDATE lamna_entitlements SET free_used=TRUE,updated_at=now() WHERE account_id=$1',[user.id]);
   else {
    await client.query('UPDATE lamna_entitlements SET credits=credits-1,updated_at=now() WHERE account_id=$1',[user.id]);
    for(const list of questions)for(const question of list){
     await client.query('INSERT INTO lamna_seen_questions(account_id,question_id,match_id) VALUES($1,$2,$3)',[user.id,question.id,id]);
    }
   }
   await client.query('COMMIT');
   send(req,res,201,{
    match:{id,kind,selected,questions,match_name:matchName,status:'active',progress:initialProgress},
    credits:kind==='paid'?row.credits-1:row.credits,
    freeRemaining:false
   });return true;
  }catch{
   await client.query('ROLLBACK').catch(()=>{});
   send(req,res,503,{message:'تعذر تأكيد بدء المباراة. راجع مبارياتك من الحساب قبل إعادة المحاولة.'});return true;
  }finally{client.release();}
 }
 if(route==='/api/store/progress'){
  const id=String(data.matchId||'');
  const progress=data.progress;
  if(!/^[a-f0-9-]{36}$/i.test(id)||!validateMatchProgress(progress)){
   send(req,res,400,{message:'بيانات المباراة غير صحيحة'});return true;
  }
  // Only newer checkpoints may replace a stored checkpoint: older requests
  // can arrive late due to mobile connectivity or background/foreground events.
  const r=await pool.query(`UPDATE lamna_matches SET progress=$1::jsonb
   WHERE id=$2 AND account_id=$3 AND status='active'
   AND COALESCE((progress->>'revision')::bigint,0)<$4 RETURNING id`,
   [JSON.stringify(progress),id,user.id,progress.revision]);
  if(!r.rowCount){
   const existing=await pool.query("SELECT status FROM lamna_matches WHERE id=$1 AND account_id=$2",[id,user.id]);
   if(existing.rowCount&&existing.rows[0].status==='active'){
    send(req,res,409,{code:'stale_progress',message:'حُفظت نسخة أحدث من المباراة؛ افتح المباراة من حسابك لاستكمال آخر نسخة.'});return true;
   }
   send(req,res,404,{message:'المباراة غير متاحة'});return true;
  }
  send(req,res,200,{ok:true,revision:progress.revision});return true;
 }
 if(route==='/api/store/finish'){
  const id=String(data.matchId||'');
  if(!/^[a-f0-9-]{36}$/i.test(id)){
   send(req,res,400,{message:'معرف المباراة غير صحيح.'});return true;
  }
  const finalProgress=data.progress;
  if(finalProgress!==undefined&&!validateMatchProgress(finalProgress)){
   send(req,res,400,{message:'بيانات نهاية المباراة غير صحيحة.'});return true;
  }
  // Commit the final score and completed state in ONE database update.
  // An older in-flight autosave cannot overwrite a finished match.
  const r=await pool.query(`UPDATE lamna_matches SET
   progress=CASE WHEN $3::jsonb IS NOT NULL
      AND COALESCE((progress->>'revision')::bigint,0) < COALESCE(($3::jsonb->>'revision')::bigint,0)
     THEN $3::jsonb ELSE progress END,
   status='completed',finished_at=COALESCE(finished_at,now())
   WHERE id=$1 AND account_id=$2 RETURNING id`,
   [id,user.id,finalProgress===undefined?null:JSON.stringify(finalProgress)]);
  if(!r.rowCount){send(req,res,404,{message:'المباراة غير موجودة'});return true;}
  send(req,res,200,{ok:true,...(await readMe(pool,user.id))});return true;
 }
 if(route==='/api/store/admin/resolve'){
  if(!user.is_admin){send(req,res,403,{message:'هذه العملية للإدارة فقط.'});return true;}
  const id=String(data.reportId||'');
  if(!/^[a-f0-9-]{36}$/i.test(id)){send(req,res,400,{message:'معرف البلاغ غير صحيح.'});return true;}
  const client=await pool.connect();
  try{
   await client.query('BEGIN');
   const r=await client.query('UPDATE lamna_question_reports SET resolved_at=COALESCE(resolved_at,now()) WHERE id=$1 RETURNING id',[id]);
   if(!r.rowCount){await client.query('ROLLBACK');send(req,res,404,{message:'البلاغ غير موجود.'});return true;}
   await client.query('INSERT INTO lamna_admin_audit(actor_id,action,entity,details) VALUES($1,$2,$3,$4::jsonb)',[
    user.id,'resolve_report',id,JSON.stringify({reportId:id})]);
   await client.query('COMMIT');
   send(req,res,200,{ok:true});return true;
  }catch(e){await client.query('ROLLBACK').catch(()=>{});throw e;}finally{client.release();}
 }
 if(route==='/api/store/report'){
  const id=String(data.matchId||'');
  const idx=Number(data.questionNumber);
  const reason=String(data.reason||'');
  const comment=String(data.comment||'').trim().slice(0,500);
  if(!/^[a-f0-9-]{36}$/i.test(id)||!Number.isInteger(idx)||idx<0||idx>=36||!reasons.includes(reason)){
   send(req,res,400,{message:'أكمل بيانات البلاغ.'});return true;
  }
  const m=await pool.query('SELECT id FROM lamna_matches WHERE id=$1 AND account_id=$2 AND kind=$3',[id,user.id,'paid']);
  if(!m.rowCount){send(req,res,403,{message:'الإبلاغ متاح لأسئلة المباريات المدفوعة فقط.'});return true;}
  try{
   await pool.query('INSERT INTO lamna_question_reports(id,account_id,match_id,question_number,reason,comment) VALUES($1,$2,$3,$4,$5,$6)',[crypto.randomUUID(),user.id,id,idx,reason,comment]);
   send(req,res,201,{ok:true,message:'وصل بلاغك، شكرًا لتعاونك.'});
  }catch(e){send(req,res,e?.code==='23505'?409:503,{message:e?.code==='23505'?'سبق أن أرسلت بلاغًا بنفس السبب عن السؤال.':'تعذر إرسال البلاغ.'});}
  return true;
 }
 if(route==='/api/store/checkout'){
  // Never grant credits without a verified provider payment confirmation.
  send(req,res,503,{message:'تفعيل الشراء يتطلب ربط حساب بوابة الدفع والتحقق من عمليات السداد، ولا يمكن إجراء دفع الآن.'});return true;
 }
 send(req,res,404,{message:'لم يتم العثور على الخدمة'});return true;
}
