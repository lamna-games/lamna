import http from 'node:http';
import crypto from 'node:crypto';

/* Secure accounts API. Remains unavailable until DATABASE_URL is configured privately. */
import pg from 'pg';
import { handleStore } from './commerce.mjs';
const { Pool } = pg;
const accountsPool = process.env.DATABASE_URL ? new Pool({
 connectionString: process.env.DATABASE_URL,
 max: 5,
 connectionTimeoutMillis: 5000,
 idleTimeoutMillis: 12000,
 ssl: process.env.DATABASE_SSL==='true' ? { rejectUnauthorized: true } : undefined
}) : null;
let tablesReady=null;
async function ensureAccounts() {
 if(!accountsPool) return false;
 if(!tablesReady) {
  tablesReady=(async()=>{
   await accountsPool.query(`CREATE TABLE IF NOT EXISTS lamna_accounts (
     id BIGSERIAL PRIMARY KEY, first_name TEXT NOT NULL, last_name TEXT NOT NULL,
     email TEXT NOT NULL UNIQUE, phone TEXT NOT NULL UNIQUE,
     country CHAR(2) NOT NULL, password_salt TEXT NOT NULL,
     password_hash TEXT NOT NULL, created_at TIMESTAMPTZ DEFAULT NOW()
   )`);
   await accountsPool.query(`CREATE TABLE IF NOT EXISTS lamna_sessions (
     token_hash TEXT PRIMARY KEY, account_id BIGINT NOT NULL REFERENCES lamna_accounts(id) ON DELETE CASCADE,
     created_at TIMESTAMPTZ DEFAULT NOW(), expires_at TIMESTAMPTZ NOT NULL
   )`);
   await accountsPool.query(`CREATE TABLE IF NOT EXISTS lamna_password_resets(
      token_hash TEXT PRIMARY KEY,account_id BIGINT NOT NULL REFERENCES lamna_accounts(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),expires_at TIMESTAMPTZ NOT NULL,
      consumed_at TIMESTAMPTZ)`);
   await accountsPool.query('CREATE INDEX IF NOT EXISTS lamna_reset_account_idx ON lamna_password_resets(account_id,created_at DESC)');
  })().catch(e=>{tablesReady=null;throw e;});
 }
 await tablesReady;return true;
}
const allowedAuthOrigin = 'https://lamna-board-20-preview.onrender.com';
const authAttempts=new Map();
function authCors(req,res) {
 const origin=req.headers.origin;
 if(origin && origin!==allowedAuthOrigin && !/^http:\/\/localhost:\d+$/.test(origin)) {
  respond(res,403,{message:'غير مسموح'}); return false;
 }
 if(origin)res.setHeader('Access-Control-Allow-Origin',origin);
 res.setHeader('Vary','Origin');
 return true;
}
function tooManyAuth(req) {
 const ip=String(req.headers['x-forwarded-for']||req.socket.remoteAddress||'').split(',')[0].trim().slice(0,90);
 const t=Date.now(), item=authAttempts.get(ip);
 if(!item || t-item.start>15*60*1000){authAttempts.set(ip,{start:t,count:1});return false;}
 item.count++;
 return item.count>15;
}
const passwordHash=(pw,salt)=>crypto.scryptSync(pw,Buffer.from(salt,'hex'),64).toString('hex');
function validAuthPassword(password){return typeof password==='string'&&password.length>=8&&password.length<=128;}


const rooms = new Map();
const connections = new Map();
const TTL = 2 * 60 * 60 * 1000;
const random = () => crypto.randomBytes(18).toString('hex');
const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Cache-Control': 'no-store'
};
function respond(res, code, data) {
  const alreadyAllowed=res.getHeader('Access-Control-Allow-Origin');
  res.writeHead(code, {...cors,
    ...(alreadyAllowed?{'Access-Control-Allow-Origin':alreadyAllowed}:{}),
    'Content-Type':'application/json; charset=utf-8'});
  res.end(JSON.stringify(data));
}
function body(req) {
  return new Promise((resolve, reject) => {
    let text = '';
    req.on('data', c => { text += c; if (text.length > 4096) { reject(new Error('Request too large')); req.destroy(); } });
    req.on('end', () => { try { resolve(JSON.parse(text || '{}')); } catch { reject(new Error('Invalid JSON')); } });
    req.on('error',reject);
  });
}
function broadcast(id, payload) {
  const set = connections.get(id);
  for (const client of set || []) {
    try { client.write('event: room\n' + 'data: ' + JSON.stringify(payload) + '\n\n'); }
    catch { set.delete(client); }
  }
}
function clean() {
  const now = Date.now();
  for(const [id, room] of rooms) {
    if (now - room.createdAt > TTL) {
      rooms.delete(id);
      for(const res of connections.get(id) || []) res.end();
      connections.delete(id);
    }
  }
}
setInterval(clean, 60000).unref();
const server = http.createServer(async(req,res)=>{
  const u = new URL(req.url, 'http://localhost');
  if(u.pathname.startsWith('/api/store/')){
    try{await handleStore(req,res,u,accountsPool,ensureAccounts);}
    catch(e){res.writeHead(503,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(JSON.stringify({message:'خدمة المباريات غير متاحة الآن.'}));}
    return;
  }
  if(req.method==='OPTIONS'){
    if(u.pathname.startsWith('/api/accounts/')){
      if(!authCors(req,res))return;
      res.writeHead(204,{'Access-Control-Allow-Methods':'GET,POST,OPTIONS','Access-Control-Allow-Headers':'Content-Type,Authorization'});
      res.end();return;
    }
    res.writeHead(204,cors);res.end();return;
  }
  const parts = u.pathname.split('/').filter(Boolean);

  if(u.pathname.startsWith('/api/accounts/')) {
   if(!authCors(req,res))return;
   if(req.method==='OPTIONS'){res.writeHead(204,{'Access-Control-Allow-Methods':'GET,POST,OPTIONS','Access-Control-Allow-Headers':'Content-Type,Authorization'});res.end();return;}
   res.setHeader('Cache-Control','no-store');
   if(u.pathname==='/api/accounts/status'&&req.method==='GET'){
    if(!accountsPool){respond(res,200,{enabled:false});return;}
    try{await ensureAccounts();respond(res,200,{enabled:true,passwordResetAvailable:Boolean(process.env.RESEND_API_KEY&&process.env.LAMNA_MAIL_FROM)});}
    catch{respond(res,200,{enabled:false});}
    return;
   }
   if(req.method!=='POST'){respond(res,405,{error:'method_not_allowed'});return;}
   if(!accountsPool){respond(res,503,{message:'تسجيل الحسابات غير مفعّل بعد؛ يلزم ربط قاعدة البيانات الآمنة.'});return;}
   if(tooManyAuth(req)){respond(res,429,{message:'محاولات كثيرة. حاول بعد ربع ساعة.'});return;}
   try{
    await ensureAccounts();
    const data=await body(req);
    if(u.pathname==='/api/accounts/logout'){
     const bearer=/^Bearer ([a-f0-9]{64})$/.exec(String(req.headers.authorization||''));
     if(bearer){
      const hashed=crypto.createHash('sha256').update(bearer[1]).digest('hex');
      await accountsPool.query('DELETE FROM lamna_sessions WHERE token_hash=$1',[hashed]);
     }
     respond(res,200,{ok:true});return;
    }
    if(u.pathname==='/api/accounts/reset/request'){
     // Never reveal whether an email is registered. Requires a verified sender domain.
     if(!process.env.RESEND_API_KEY||!process.env.LAMNA_MAIL_FROM){
      respond(res,503,{message:'استعادة كلمة المرور قيد التجهيز حتى تفعيل البريد الإلكتروني الآمن.'});return;
     }
     const email=String(data.email||'').trim().toLowerCase();
     if(!/^\\S+@\\S+\\.\\S+$/.test(email)||email.length>254){
      respond(res,400,{message:'تأكد من صحة البريد الإلكتروني.'});return;
     }
     const neutral={ok:true,message:'إذا كان البريد مسجّلًا، ستصلك رسالة تحتوي على رابط صالح لمدة 30 دقيقة.'};
     const found=await accountsPool.query('SELECT id,first_name FROM lamna_accounts WHERE email=$1 LIMIT 1',[email]);
     if(!found.rowCount){respond(res,200,neutral);return;}
     const account=found.rows[0];
     const recent=await accountsPool.query("SELECT 1 FROM lamna_password_resets WHERE account_id=$1 AND created_at>NOW()-INTERVAL '2 minutes' LIMIT 1",[account.id]);
     if(recent.rowCount){respond(res,200,neutral);return;}
     const raw=crypto.randomBytes(32).toString('hex');
     const hashed=crypto.createHash('sha256').update(raw).digest('hex');
     await accountsPool.query("INSERT INTO lamna_password_resets(token_hash,account_id,expires_at) VALUES($1,$2,NOW()+INTERVAL '30 minutes')",[hashed,account.id]);
     const publicUrl=(process.env.LAMNA_PUBLIC_URL||allowedAuthOrigin).replace(/[/]$/,'');
     const resetLink=publicUrl+'/#reset-password?token='+raw;
     const mail=await fetch('https://api.resend.com/emails',{
      method:'POST',headers:{Authorization:'Bearer '+process.env.RESEND_API_KEY,'Content-Type':'application/json'},
      body:JSON.stringify({from:process.env.LAMNA_MAIL_FROM,to:[email],subject:'استعادة كلمة مرور لمنا',text:'وصلنا طلب استعادة كلمة المرور. استخدم الرابط التالي خلال 30 دقيقة:\\n'+resetLink+'\\nإذا لم تطلب ذلك فتجاهل الرسالة.'}),
      signal:AbortSignal.timeout(10000)
     }).catch(()=>null);
     if(!mail?.ok){
      await accountsPool.query('DELETE FROM lamna_password_resets WHERE token_hash=$1',[hashed]).catch(()=>{});
      respond(res,503,{message:'تعذر إرسال رسالة الاستعادة حاليًا. حاول لاحقًا.'});return;
     }
     respond(res,200,neutral);return;
    }
    if(u.pathname==='/api/accounts/reset/confirm'){
     const raw=String(data.token||'');
     if(!/^[a-f0-9]{64}$/.test(raw)||!validAuthPassword(data.password)){
      respond(res,400,{message:'الرابط غير صالح أو كلمة المرور غير مناسبة.'});return;
     }
     const hashed=crypto.createHash('sha256').update(raw).digest('hex');
     const client=await accountsPool.connect();
     try{
      await client.query('BEGIN');
      const token=await client.query("SELECT account_id FROM lamna_password_resets WHERE token_hash=$1 AND consumed_at IS NULL AND expires_at>now() FOR UPDATE",[hashed]);
      if(!token.rowCount){await client.query('ROLLBACK');respond(res,400,{message:'انتهت صلاحية الرابط أو استُخدم بالفعل. اطلب رابطًا جديدًا.'});return;}
      const accountId=token.rows[0].account_id;
      const salt=crypto.randomBytes(24).toString('hex');
      const hash=passwordHash(data.password,salt);
      await client.query('UPDATE lamna_accounts SET password_salt=$1,password_hash=$2 WHERE id=$3',[salt,hash,accountId]);
      await client.query('DELETE FROM lamna_sessions WHERE account_id=$1',[accountId]);
      await client.query('UPDATE lamna_password_resets SET consumed_at=now() WHERE account_id=$1 AND consumed_at IS NULL',[accountId]);
      await client.query('COMMIT');
      respond(res,200,{ok:true,message:'تم تحديث كلمة المرور. سجّل دخولك بكلمتك الجديدة.'});return;
     }catch(err){await client.query('ROLLBACK').catch(()=>{});throw err;}finally{client.release();}
    }
    if(u.pathname==='/api/accounts/register'){
     const firstName=String(data.firstName||'').trim().slice(0,60);
     const lastName=String(data.lastName||'').trim().slice(0,60);
     const email=String(data.email||'').trim().toLowerCase();
     const phone=String(data.phone||'').trim();
     const country=String(data.country||'').toUpperCase();
     if(firstName.length<2||lastName.length<2||!/^\S+@\S+\.\S+$/.test(email)||email.length>254||!/^\+[1-9]\d{7,14}$/.test(phone)||!/^[A-Z]{2}$/.test(country)||!validAuthPassword(data.password)){
      respond(res,400,{message:'تأكد من صحة الاسم والبريد ورقم الجوال وكلمة المرور.'});return;
     }
     const salt=crypto.randomBytes(24).toString('hex');
     const hash=passwordHash(data.password,salt);
     const client=await accountsPool.connect();
     try{
      await client.query('BEGIN');
      const r=await client.query('INSERT INTO lamna_accounts(first_name,last_name,email,phone,country,password_salt,password_hash) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING id',[firstName,lastName,email,phone,country,salt,hash]);
      const newToken=crypto.randomBytes(32).toString('hex');
      const tokenHash=crypto.createHash('sha256').update(newToken).digest('hex');
      await client.query("INSERT INTO lamna_sessions(token_hash,account_id,expires_at) VALUES($1,$2,NOW()+INTERVAL '7 days')",[tokenHash,r.rows[0].id]);
      await client.query('COMMIT');
      respond(res,201,{created:true,token:newToken,firstName:firstName});return;
     }catch(e){
      await client.query('ROLLBACK').catch(()=>{});
      if(e?.code==='23505'){
       respond(res,409,{message:e?.constraint?.includes('phone')?'رقم الجوال مسجّل بالفعل. سجّل دخولك.':'البريد الإلكتروني مسجّل بالفعل. سجّل دخولك.'});return;
      }
      throw e;
     }finally{client.release();}
    }
    if(u.pathname==='/api/accounts/login'){
     const email=String(data.email||'').trim().toLowerCase();
     if(email.length>254||!validAuthPassword(data.password)){respond(res,401,{message:'بيانات الدخول غير صحيحة.'});return;}
     const r=await accountsPool.query('SELECT id,first_name,password_salt,password_hash FROM lamna_accounts WHERE email=$1 LIMIT 1',[email]);
     if(!r.rowCount){respond(res,401,{message:'بيانات الدخول غير صحيحة.'});return;}
     const account=r.rows[0];const got=Buffer.from(passwordHash(data.password,account.password_salt),'hex');
     const expected=Buffer.from(account.password_hash,'hex');
     if(got.length!==expected.length||!crypto.timingSafeEqual(got,expected)){
      respond(res,401,{message:'بيانات الدخول غير صحيحة.'});return;
     }
     const token=crypto.randomBytes(32).toString('hex');
     const tokenHash=crypto.createHash('sha256').update(token).digest('hex');
     await accountsPool.query('INSERT INTO lamna_sessions (token_hash,account_id,expires_at) VALUES($1,$2,NOW()+INTERVAL \'7 days\')',[tokenHash,account.id]);
     respond(res,200,{token,firstName:account.first_name});return;
    }
    respond(res,404,{error:'not_found'});return;
   }catch(e){respond(res,503,{message:'خدمة الحسابات غير متاحة الآن. حاول لاحقًا.'});return;}
  }

  if(u.pathname==='/health' || u.pathname==='/'){
    respond(res,200,{ok:true,service:'lamna-wordless-sync'});return;
  }
  if(req.method==='POST' && u.pathname==='/api/rooms') {
    try {
      const payload=await body(req);
      const itemIndex=Number(payload.itemIndex), duration=Number(payload.duration);
      if(!Number.isInteger(itemIndex)||itemIndex<0||itemIndex>5||![90,60,40].includes(duration)) {
        respond(res,400,{error:'invalid_room'});return;
      }
      const id=random().slice(0,22), token=random(), hostKey=random();
      const room={id,token,hostKey,itemIndex,duration,createdAt:Date.now(),startedAt:null};
      rooms.set(id,room);
      respond(res,201,{id,hostKey,duration,phoneUrl:'https://lamna-board-20-preview.onrender.com/?wordless='+id+'&token='+token});return;
    }catch {respond(res,400,{error:'invalid_request'});return;}
  }
  if(parts[0]==='api'&&parts[1]==='rooms'&&parts[2]&&parts.length>=4){
    const id=parts[2],action=parts[3],room=rooms.get(id);
    if(!room){respond(res,404,{error:'room_not_found'});return;}
    const token=u.searchParams.get('token');
    const hostKey=u.searchParams.get('hostKey');
    if(req.method==='GET' && action==='private') {
      if(token!==room.token){respond(res,403,{error:'unauthorized'});return;}
      respond(res,200,{id,itemIndex:room.itemIndex,duration:room.duration,startedAt:room.startedAt});return;
    }
    if(req.method==='POST' && action==='ready') {
      if(token!==room.token){respond(res,403,{error:'unauthorized'});return;}
      if(!room.startedAt){room.startedAt=Date.now();broadcast(id,{status:'running',startedAt:room.startedAt,duration:room.duration});}
      respond(res,200,{startedAt:room.startedAt,duration:room.duration});return;
    }
    if(req.method==='GET' && action==='state') {
      if(hostKey!==room.hostKey){respond(res,403,{error:'unauthorized'});return;}
      respond(res,200,{status:room.startedAt?'running':'waiting',startedAt:room.startedAt,duration:room.duration});return;
    }
    if(req.method==='GET' && action==='events') {
      if(hostKey!==room.hostKey){respond(res,403,{error:'unauthorized'});return;}
      res.writeHead(200,{...cors,'Content-Type':'text/event-stream; charset=utf-8','Connection':'keep-alive','X-Accel-Buffering':'no'});
      const add=connections.get(id)||new Set();add.add(res);connections.set(id,add);
      res.write('event: room\n'+'data: '+JSON.stringify({status:room.startedAt?'running':'waiting',startedAt:room.startedAt,duration:room.duration})+'\n\n');
      const pulse=setInterval(()=>{try{res.write(': ping\n\n');}catch{}},25000);
      req.on('close',()=>{clearInterval(pulse);add.delete(res);if(!add.size)connections.delete(id);});
      return;
    }
  }
  respond(res,404,{error:'not_found'});
});
server.listen(Number(process.env.PORT)||10000,'0.0.0.0',()=>console.log('Lamna wordless sync listening'));