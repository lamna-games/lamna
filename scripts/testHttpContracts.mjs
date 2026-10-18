import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';

// Local-only smoke test. Never creates real customer accounts, rooms in the
// deployed service, purchases, or database records.
const port=19000+Math.floor(Math.random()*2000);
const base='http://127.0.0.1:'+port;
const child=spawn(process.execPath,['server.mjs'],{
 cwd:new URL('..',import.meta.url).pathname,
 env:{...process.env,PORT:String(port),DATABASE_URL:'',DATABASE_SSL:'false',RESEND_API_KEY:'',LAMNA_MAIL_FROM:''},
 stdio:['ignore','pipe','pipe']
});
let stderr='';
child.stderr.on('data',b=>{stderr+=String(b).slice(0,4000)});
const delay=t=>new Promise(r=>setTimeout(r,t));
async function call(path,options={}){
 const response=await fetch(base+path,{...options,signal:AbortSignal.timeout(1600)});
 return {status:response.status,data:await response.json().catch(()=>({}))};
}
try{
 let ready=false;
 for(let n=0;n<50;n++){
  if(child.exitCode!==null)throw new Error('Server exited unexpectedly: '+stderr);
  try{const r=await call('/health');if(r.status===200&&r.data.ok){ready=true;break;}}catch{}
  await delay(120);
 }
 assert(ready,'Local server did not become ready');
 const accounts=await call('/api/accounts/status');
 assert.equal(accounts.status,200);
 assert.equal(accounts.data.enabled,false,'Smoke test must never access production DB');
 const packs=await call('/api/store/packages');
 assert.equal(packs.status,200);
 assert.equal(packs.data.checkoutAvailable,false);
 assert.deepEqual(packs.data.packages.map(x=>x.halalas),[999,1999,2999]);
 const forbiddenCheckout=await call('/api/store/checkout',{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'});
 assert.notEqual(forbiddenCheckout.status,200,'No payments may be granted by test endpoint');
 const room=await call('/api/rooms',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({itemIndex:2,duration:60})});
 assert.equal(room.status,201);
 const id=room.data.id,hostKey=room.data.hostKey;
 const phone=new URL(room.data.phoneUrl);
 const secret=phone.searchParams.get('token');
 assert(id&&hostKey&&secret,'A synchronized private QR room must have separate keys');
 const state=await call('/api/rooms/'+id+'/state?hostKey='+hostKey);
 assert.equal(state.data.status,'waiting');
 const unauthorized=await call('/api/rooms/'+id+'/private');
 assert.equal(unauthorized.status,403,'A spectator cannot see the private phone state');
 const wrongHost=await call('/api/rooms/'+id+'/state?hostKey=wrong');
 assert.equal(wrongHost.status,403,'Host state requires a private host key');
 const phoneData=await call('/api/rooms/'+id+'/private?token='+secret);
 assert.equal(phoneData.status,200);
 assert.equal(phoneData.data.itemIndex,2);
 const readyState=await call('/api/rooms/'+id+'/ready?token='+secret,{method:'POST'});
 assert.equal(readyState.status,200);
 const started=await call('/api/rooms/'+id+'/state?hostKey='+hostKey);
 assert.equal(started.data.status,'running');
 assert.equal(typeof started.data.startedAt,'number');
 console.log('LAMNA local HTTP QA OK: health, packages, disabled payments, and 7 private QR room checks.');
}finally{
 child.kill('SIGTERM');
 await delay(150);
}
