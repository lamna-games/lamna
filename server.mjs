import http from 'node:http';
import crypto from 'node:crypto';

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
  res.writeHead(code, {...cors, 'Content-Type':'application/json; charset=utf-8'});
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
  if(req.method==='OPTIONS'){res.writeHead(204,cors);res.end();return;}
  const u = new URL(req.url, 'http://localhost');
  const parts = u.pathname.split('/').filter(Boolean);
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
      respond(res,201,{id,hostKey,duration,phoneUrl:'https://lamna-board-20-preview.onrender.com/secret/'+id+'?token='+token});return;
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