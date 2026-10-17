import React from 'react';
import QRCode from 'qrcode';
import './wordless.css';

const API='https://lamna-wordless-sync.onrender.com';
type Room={id:string;hostKey:string;duration:number;phoneUrl:string};
type PrivateRoom={id:string;itemIndex:number;duration:number;startedAt:number|null};
const formats=['تمثيل صامت','ارسم وخمّن','ممنوع تقولها','بالعكس','كلمة واحدة','أصوات فقط'];
const durationOf=(pts:number)=>pts===200?90:pts===400?60:40;
const remaining=(start:number,duration:number)=>Math.max(0,duration-Math.floor((Date.now()-start)/1000));
const clock=(n:number)=>String(Math.floor(n/60)).padStart(2,'0')+':'+String(n%60).padStart(2,'0');

export function SecretArt({index}:{index:number}){
 const common={stroke:'#263e50',strokeWidth:5,strokeLinecap:'round' as const,strokeLinejoin:'round' as const};
 return <svg className="wl-art" viewBox="0 0 480 300" role="img" aria-label="صورة المطلوب السري" xmlns="http://www.w3.org/2000/svg">
  <rect width="480" height="300" rx="24" fill={['#e6f3fa','#ffe9ae','#faebda','#d8e9f9','#e7e5fa','#dceff7'][index]||'#e6f3fa'}/>
  {index===0&&<><circle cx="408" cy="57" r="26" fill="#ffd87a"/><path d="M0 248H480" stroke="#aeced8" strokeWidth="10"/><path d="M70 185L115 126H313L365 185" fill="#77bdc8" {...common}/><rect x="54" y="171" width="346" height="72" rx="23" fill="#48a5b1" {...common}/><path d="M135 143h70v40H99zM229 143h64l38 40H229Z" fill="#f4ffff" {...common}/><circle cx="128" cy="240" r="28" fill="#263e50"/><circle cx="321" cy="240" r="28" fill="#263e50"/><g transform="translate(237 70) rotate(-30)"><circle cx="0" cy="0" r="14" fill="none" {...common}/><path d="M10 9h58v15H48v-9H32" stroke="#e9a34e" strokeWidth="11" fill="none"/></g><path d="M346 115a24 24 0 0 1 48 0v25h-48v-25Z" fill="#fac96d" {...common}/></>}
  {index===1&&<><circle cx="390" cy="60" r="38" fill="#ffd16b"/><path d="M0 225Q120 175 240 220T480 219V300H0Z" fill="#f0c46e"/><path d="M0 254Q152 201 290 254T480 243V300H0Z" fill="#e5aa5d"/><path d="M236 258Q237 166 257 111" fill="none" stroke="#987246" strokeWidth="27" strokeLinecap="round"/><path d="M253 108Q202 54 154 110M253 108Q262 40 214 39M254 108Q301 48 343 74M250 109Q316 106 326 146M251 110Q182 114 173 155" stroke="#3c9d59" strokeWidth="22" strokeLinecap="round" fill="none"/></>}
  {index===2&&<><ellipse cx="240" cy="257" rx="186" ry="25" fill="#c8a889"/><path d="M76 80h144v143q-4 29-72 29T76 223Z" fill="#fff4df" {...common}/><path d="M217 114q72-10 69 42q-3 45-68 37" fill="none" {...common}/><path d="M115 74q-22-24 0-45M164 74q-23-24 0-45" fill="none" stroke="#b4806c" strokeWidth="8" strokeLinecap="round"/><path d="M320 198V91h79v107" fill="#bd8d5a" {...common}/><path d="M312 94h97l-17-29h-58Z" fill="#fae2ad" {...common}/><path d="M347 93V52" stroke="#263e50" strokeWidth="6"/><path d="M92 132q54 17 111 0" fill="none" stroke="#a66948" strokeWidth="17" strokeLinecap="round"/></>}
  {index===3&&<><path d="M0 239H480" stroke="#8eaebe" strokeWidth="8"/><path d="M59 42L39 96M131 35L111 90M219 39l-21 55M343 28l-22 51M424 56l-23 52" stroke="#428fc0" strokeWidth="6" strokeLinecap="round"/><path d="M102 158Q195 35 290 153Q210 120 102 158Z" fill="#e57d86" {...common}/><path d="M198 109l15 130q4 34 35 28q25-8 15-28" fill="none" stroke="#263e50" strokeWidth="9"/><path d="M319 99q11-29 42-18q18-31 46-11q30-1 35 23q0 27-37 27h-65q-30-2-21-21Z" fill="#c3dce9"/><path d="M82 41L59 72h22L62 111l53-54H90z" fill="#f4c85b"/></>}
  {index===4&&<><path d="M0 255H480V300H0Z" fill="#b7c7d5"/><rect x="83" y="125" width="315" height="128" rx="7" fill="#fff9eb" {...common}/><path d="M104 143h60v65h-60zM176 143h60v65h-60zM251 143h60v65h-60z" fill="#b4deef" {...common}/><path d="M348 144v109" stroke="#263e50" strokeWidth="9"/><path d="M237 133V46" stroke="#263e50" strokeWidth="7"/><path d="M177 84l78-31l79 24l-66 19l-11 31h-18l-12-34Z" fill="#4ca3b3" {...common}/><path d="M47 253H433" stroke="#eed6ad" strokeWidth="12"/></>}
  {index===5&&<><path d="M0 255H480" stroke="#849fb5" strokeWidth="8"/><path d="M97 255L53 300M382 255l48 45M149 255l-30 45M335 255l32 45" stroke="#607d98" strokeWidth="9"/><rect x="107" y="59" width="270" height="189" rx="65" fill="#55a5bc" {...common}/><rect x="139" y="84" width="207" height="78" rx="22" fill="#cbeaf2" {...common}/><path d="M240 83v79" stroke="#263e50" strokeWidth="6"/><rect x="151" y="192" width="183" height="23" rx="9" fill="#f4cd7b"/><circle cx="161" cy="230" r="13" fill="#fff7d1"/><circle cx="324" cy="230" r="13" fill="#fff7d1"/></>}
 </svg>;
}
export function WordlessPhone(){
 const params=new URLSearchParams(window.location.search);
 const id=params.get('wordless')||'',token=params.get('token')||'';
 const [room,setRoom]=React.useState<PrivateRoom|null>(null);
 const [error,setError]=React.useState('');
 const [busy,setBusy]=React.useState(false);
 const [now,setNow]=React.useState(Date.now());
 React.useEffect(()=>{
  let live=true;
  const load=async()=>{
   try{const res=await fetch(API+'/api/rooms/'+encodeURIComponent(id)+'/private?token='+encodeURIComponent(token),{cache:'no-store'});
    if(!res.ok)throw new Error('الرابط منتهي أو غير صحيح');
    const info:PrivateRoom=await res.json();if(live)setRoom(info);
   }catch{if(live)setError('تعذر فتح البطاقة. اطلب رمزًا جديدًا من شاشة اللعب.');}
  };
  load();return()=>{live=false};
 },[id,token]);
 React.useEffect(()=>{
  if(!room?.startedAt)return;
  const timer=window.setInterval(()=>setNow(Date.now()),200);
  return()=>window.clearInterval(timer);
 },[room?.startedAt]);
 const ready=async()=>{
  if(busy||!room||room.startedAt)return;
  setBusy(true);
  try{
   const resp=await fetch(API+'/api/rooms/'+encodeURIComponent(id)+'/ready?token='+encodeURIComponent(token),{method:'POST'});
   if(!resp.ok)throw new Error('خطأ');
   const result=await resp.json();
   setRoom(v=>v?{...v,startedAt:result.startedAt}:v);
  }catch{setError('تعذر تشغيل العداد؛ حاول مرة أخرى');}finally{setBusy(false)}
 };
 const left=room?.startedAt?remaining(room.startedAt,room.duration):null;
 return <main className="wl-phone" dir="rtl">
   <header className="wl-phone-header"><strong>لمنا</strong><span>ولا كلمة — البطاقة السرية</span></header>
   {!room?<div className="wl-phone-message">{error||'جارٍ فتح البطاقة…'}</div>:room.startedAt===null?
    <div className="wl-phone-secret">
      <span className="wl-phone-eyebrow">هذه الصورة لك فقط، لا توريها فريقك</span>
      <div className="wl-phone-art-wrap"><SecretArt index={room.itemIndex}/></div>
      <h2>{formats[room.itemIndex]}</h2>
      <p>{[
       'مثّل الموقف دون كلام أو كتابة.',
       'ارسم المطلوب دون كتابة حروف أو أرقام.',
       'صف الصورة دون ذكر: قهوة، فنجان، بن.',
       'مثّل الصورة من نهاية الموقف إلى بدايته.',
       'قل تلميحًا واحدًا فقط.',
       'استخدم الأصوات دون كلمات مفهومة.'
      ][room.itemIndex]}</p>
      <button type="button" className="wl-phone-ready" disabled={busy} onClick={ready}>{busy?'جارٍ البدء…':'جاهز — ابدأ الوقت'}</button>
      {error&&<p role="alert">{error}</p>}
    </div>:
    <div className="wl-phone-clock-page">
      <span className="wl-phone-eyebrow">بدأ التحدي — الوقت ينقص</span>
      <div className={'wl-phone-clock'+(left!==null&&left<=10?' urgent':'')}>{clock(left||0)}</div>
      <span>{left===0?'انتهى الوقت':'العب من غير ما تكشف الصورة لفريقك'}</span>
      <div className="wl-phone-small-art"><SecretArt index={room.itemIndex}/></div>
    </div>
   }
 </main>;
}
export function WordlessTV({index,points,onStart,onTick}:{index:number;points:number;onStart:(seconds:number)=>void;onTick:(seconds:number)=>void;}){
 const [room,setRoom]=React.useState<Room|null>(null);
 const [qr,setQR]=React.useState('');
 const [error,setError]=React.useState('');
 const [started,setStarted]=React.useState<number|null>(null);
 const duration=durationOf(points);
 const startRef=React.useRef(onStart);
 const tickRef=React.useRef(onTick);
 const startedNotifiedRef=React.useRef(false);
 React.useEffect(()=>{startRef.current=onStart;tickRef.current=onTick;},[onStart,onTick]);
 React.useEffect(()=>{
  let cancelled=false;let source:EventSource|null=null;let timer:number|undefined;
  setRoom(null);setQR('');setError('');setStarted(null);startedNotifiedRef.current=false;
  const open=async()=>{
   try{
    const resp=await fetch(API+'/api/rooms',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({itemIndex:index,duration})});
    if(!resp.ok)throw new Error('لم يتم إنشاء الرمز');
    const data:Room=await resp.json();
    if(cancelled)return;
    setRoom(data);
    const img=await QRCode.toDataURL(data.phoneUrl,{width:330,margin:1,errorCorrectionLevel:'M'});
    if(!cancelled)setQR(img);
    source=new EventSource(API+'/api/rooms/'+data.id+'/events?hostKey='+data.hostKey);
    const notify=(event:MessageEvent)=>{
     if(cancelled)return;
     try{const state=JSON.parse(event.data);
      if(state.status==='running'&&typeof state.startedAt==='number'){
       if(!startedNotifiedRef.current){startedNotifiedRef.current=true;startRef.current(state.duration);}setStarted(state.startedAt);
      }
     }catch{}
    };
    source.addEventListener('room',notify as EventListener);
    timer=window.setInterval(async()=>{
     if(cancelled)return;
     try{const r=await fetch(API+'/api/rooms/'+data.id+'/state?hostKey='+data.hostKey,{cache:'no-store'});
      if(r.ok){const state=await r.json();if(state.status==='running'&&typeof state.startedAt==='number'){
       if(!startedNotifiedRef.current){startedNotifiedRef.current=true;startRef.current(state.duration);}setStarted(state.startedAt);
      }}
     }catch{}
    },3500);
   }catch{if(!cancelled)setError('تعذر الاتصال برمز السؤال. ارجع للوحة وحاول مرة أخرى.');}
  };
  open();
  return()=>{cancelled=true;source?.close();if(timer!==undefined)window.clearInterval(timer);};
 },[index,duration]);
 React.useEffect(()=>{
  if(started===null)return;
  const update=()=>tickRef.current(remaining(started,duration));
  update();const timer=window.setInterval(update,250);
  return()=>window.clearInterval(timer);
 },[started,duration]);
 return <div className="wl-tv" aria-label="ولا كلمة — رمز السؤال السري">
   <h2>ولا كلمة</h2>
   <div className="wl-tv-grid">
     <div className="wl-qr-card">
       {qr?<img src={qr} className="wl-qr" alt="رمز QR للبطاقة السرية على جوال اللاعب"/>:<div className="wl-loading">{error||'جارٍ تجهيز رمز السؤال…'}</div>}
       <span>امسح الرمز بجوال اللاعب فقط</span>
       {room&&<button type="button" className="wl-link-copy" onClick={()=>navigator.clipboard?.writeText(room.phoneUrl)}>نسخ رابط البطاقة للجوال</button>}
     </div>
     <div className="wl-tv-instructions">
       <h3>تعليمات الجولة</h3>
       <p><b>1</b> اختاروا شخصًا واحدًا يشوف البطاقة السرية.</p>
       <p><b>2</b> يصوّر QR بجواله، وما يوري الصورة لفريقه.</p>
       <p><b>3</b> يضغط «جاهز» من الجوال، ويبدأ العد على الشاشتين.</p>
       <div className="wl-tv-status">{started===null?'بانتظار جاهز من الجوال':<span>بدأ التحدي — <strong>{clock(remaining(started,duration))}</strong></span>}</div>
       <small>المطلوب لا يظهر على شاشة التلفزيون</small>
     </div>
   </div>
 </div>;
}