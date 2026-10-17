import crypto from 'node:crypto';
import {catalogByCategory} from './serverQuestionBank.mjs';

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
  status TEXT NOT NULL DEFAULT 'active' CHECK(status IN('active','completed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),finished_at TIMESTAMPTZ)`);
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
  UNIQUE(account_id,match_id,question_number,reason))`);
 })().catch(e=>{schema=null;throw e;});
 }
 await schema;
}
async function account(pool,req){
 const match=/^Bearer ([a-f0-9]{64})$/.exec(String(req.headers.authorization||''));
 if(!match)return null;
 const hash=crypto.createHash('sha256').update(match[1]).digest('hex');
 const r=await pool.query(`SELECT a.id,a.first_name,a.email
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
 if(!pool){send(req,res,503,{message:'نظام الحسابات والاشتراكات غير متاح حتى يتم ربط قاعدة البيانات.'});return true;}
 try{await ensureAccounts();await setup(pool);}catch{
  send(req,res,503,{message:'تعذر الوصول إلى قاعدة البيانات.'});return true;
 }
 const user=await account(pool,req).catch(()=>null);
 if(!user){send(req,res,401,{message:'سجّل دخولك لاستخدام المباريات.'});return true;}
 if(route==='/api/store/me'&&req.method==='GET'){
  send(req,res,200,{user:{id:user.id,firstName:user.first_name},...(await readMe(pool,user.id))});return true;
 }
 if(route.startsWith('/api/store/matches/')&&req.method==='GET'){
  const id=route.slice('/api/store/matches/'.length);
  if(!/^[a-f0-9-]{36}$/i.test(id)){send(req,res,400,{message:'معرف غير صحيح'});return true;}
  const record=await pool.query('SELECT id,kind,selected,questions,match_name,status FROM lamna_matches WHERE id=$1 AND account_id=$2',[id,user.id]);
  if(!record.rowCount){send(req,res,404,{message:'المباراة غير موجودة'});return true;}
  send(req,res,200,{match:record.rows[0]});return true;
 }
 if(req.method!=='POST'){send(req,res,405,{message:'العملية غير مدعومة'});return true;}
 let data;
 try{data=await readJson(req);}catch{send(req,res,400,{message:'الطلب غير صحيح'});return true;}
 if(route==='/api/store/matches'){
  const selected=data.selected;
  if(!Array.isArray(selected)||selected.length!==6||new Set(selected).size!==6||selected.some(x=>!Number.isInteger(x)||x<0||x>19)){
   send(req,res,400,{message:'اختر ست فئات مختلفة.'});return true;
  }
  const matchName=String(data.matchName||'').trim().slice(0,50);
  if(!matchName){send(req,res,400,{message:'اكتب اسم المباراة.'});return true;}
  const client=await pool.connect();
  try{
   await client.query('BEGIN');
   await client.query('INSERT INTO lamna_entitlements(account_id) VALUES ($1) ON CONFLICT DO NOTHING',[user.id]);
   const row=(await client.query('SELECT free_used,credits FROM lamna_entitlements WHERE account_id=$1 FOR UPDATE',[user.id])).rows[0];
   const active=await client.query("SELECT id,kind,selected,questions,match_name,status FROM lamna_matches WHERE account_id=$1 AND status='active' ORDER BY created_at DESC LIMIT 1",[user.id]);
   if(active.rowCount){await client.query('ROLLBACK');send(req,res,409,{code:'active_match',message:'عندك مباراة قائمة. كمّلها أولًا قبل بدء مباراة جديدة.',match:active.rows[0]});return true;}
   const kind=row.free_used?'paid':'free';
   if(kind==='paid' && row.credits===0){await client.query('ROLLBACK');send(req,res,402,{code:'no_credit',message:'انتهت المباراة المجانية. اختر باقة لإضافة رصيد.'});return true;}
   if(kind==='paid'&&selected.includes(1)){
    await client.query('ROLLBACK');send(req,res,409,{code:'image_bank_pending',message:'فئة ولا كلمة المدفوعة تحتاج صورًا جديدة قبل استخدامها؛ اختر فئة أخرى حاليًا.'});return true;
   }
   let questions=[];
   for(const c of selected){
    const poolItems=catalogByCategory(c,kind);
    if(kind==='free'){questions.push(poolItems.slice(0,6));continue;}
    const seen=await client.query('SELECT question_id FROM lamna_seen_questions WHERE account_id=$1 AND question_id LIKE $2',[user.id,'paid-'+c+'-%']);
    const blocked=new Set(seen.rows.map(v=>v.question_id));
    const available=poolItems.filter(item=>!blocked.has(item.id));
    if(available.length<6){
     await client.query('ROLLBACK');
     send(req,res,409,{code:'questions_exhausted',message:'لا توجد أسئلة جديدة كافية لإحدى الفئات المختارة. لن يُخصم من رصيدك شيء. اختر فئات أخرى أو انتظر إضافة الأسئلة.'});
     return true;
    }
    // Shuffle on the server; never reuse IDs already seen by this account.
    const shuffled=available.map(x=>({x,n:crypto.randomInt(0,0x7fffffff)})).sort((a,b)=>a.n-b.n).slice(0,6).map(y=>y.x);
    questions.push(shuffled);
   }
   const id=crypto.randomUUID();
   await client.query('INSERT INTO lamna_matches(id,account_id,kind,selected,questions,match_name) VALUES($1,$2,$3,$4,$5,$6)',[id,user.id,kind,selected,JSON.stringify(questions),matchName]);
   if(kind==='free')await client.query('UPDATE lamna_entitlements SET free_used=TRUE,updated_at=now() WHERE account_id=$1',[user.id]);
   else {
    await client.query('UPDATE lamna_entitlements SET credits=credits-1,updated_at=now() WHERE account_id=$1',[user.id]);
    for(const list of questions)for(const question of list){
     await client.query('INSERT INTO lamna_seen_questions(account_id,question_id,match_id) VALUES($1,$2,$3)',[user.id,question.id,id]);
    }
   }
   await client.query('COMMIT');send(req,res,201,{match:{id,kind,selected,questions,match_name:matchName,status:'active'},...(await readMe(pool,user.id))});return true;
  }catch{
   await client.query('ROLLBACK').catch(()=>{});
   send(req,res,503,{message:'تعذر بدء المباراة. لم يُخصم رصيدك.'});return true;
  }finally{client.release();}
 }
 if(route==='/api/store/finish'){
  const id=String(data.matchId||'');
  const r=await pool.query("UPDATE lamna_matches SET status='completed',finished_at=COALESCE(finished_at,now()) WHERE id=$1 AND account_id=$2 RETURNING id",[id,user.id]);
  if(!r.rowCount){send(req,res,404,{message:'المباراة غير موجودة'});return true;}
  send(req,res,200,{ok:true,...(await readMe(pool,user.id))});return true;
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
