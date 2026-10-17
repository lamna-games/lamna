import React from 'react';

/* Drawn-from-life, original vector interpretations of real-world subjects.
   These illustrations are used within Lamna's existing cover template. */
const navy='#173b54';
const edge={stroke:navy,strokeWidth:6,strokeLinecap:'round' as const,strokeLinejoin:'round' as const};
function Label({x,y,children,size=21,color=navy}:{x:number;y:number;children:React.ReactNode;size?:number;color?:string}){
 return <text x={x} y={y} textAnchor="middle" dominantBaseline="middle" fontSize={size} fontWeight="900" fontFamily="Tajawal,Arial,sans-serif" fill={color}>{children}</text>;
}
function Shield({x,y,color,name,kind}:{x:number;y:number;color:string;name:string;kind:'crescent'|'sun'|'tiger'|'palm'}){
 return <g transform={'translate('+x+' '+y+')'}>
  <path d="M5 12Q52 -6 102 12L99 84Q78 117 54 128Q24 113 8 84Z" fill={color} {...edge}/>
  <path d="M18 22Q55 11 89 22L86 79Q68 102 54 107Q33 98 21 79Z" fill="none" stroke="#fffbe8" strokeWidth="3"/>
  {kind==='crescent'?<path d="M76 28A25 25 0 1 0 76 72A23 23 0 1 1 76 28Z" fill="#fff"/>:kind==='sun'?<g><circle cx="54" cy="49" r="22" fill="#f9d760"/><path d="M24 49h60M54 20v62" stroke="#fff" strokeWidth="4"/></g>:kind==='tiger'?<g fill="#ffd068"><rect x="33" y="25" width="15" height="53" rx="3"/><rect x="61" y="25" width="16" height="53" rx="3"/></g>:<g stroke="#fff" strokeWidth="5" strokeLinecap="round"><path d="M54 40v36M25 45q29-29 57 0M40 53Q25 36 38 29M67 53Q83 36 69 29M34 76h42" fill="none"/></g>}
  <Label x={54} y={96} size={19} color="#fff">{name}</Label>
 </g>;
}
function FootballShirt({x,y,fill,accent,number}:{x:number;y:number;fill:string;accent:string;number:string}){
 return <g transform={'translate('+x+' '+y+')'}>
  <path d="M35 13L61 0H130L160 17L189 79L153 97L138 66V210H51V66L36 96L-3 80Z" fill={fill} {...edge}/>
  <path d="M61 0Q94 35 130 0M51 76V194M138 76V194" stroke={accent} strokeWidth="9" fill="none"/>
  <Label x={94} y={110} color={accent} size={52}>{number}</Label>
 </g>;
}
function SaudiFlag({x=0,y=0}:{x?:number;y?:number}){
 return <g transform={'translate('+x+' '+y+')'}><path d="M0 0h123v69H0Z" fill="#178c54" {...edge}/><path d="M17 49h89" stroke="#fff" strokeWidth="5"/><Label x={61} y={30} size={16} color="#fff">السعودية</Label></g>;
}
function Masmak({x=0,y=0}:{x?:number;y?:number}){
 return <g transform={'translate('+x+' '+y+')'} strokeLinejoin="round">
   <path d="M5 92L36 80L39 55H96L104 79L156 92V239H5Z" fill="#d8ac77" {...edge}/>
   {Array.from({length:6},(_,j)=><path key={j} d={'M'+(15+j*24)+' 91v-17h13v17'} stroke={navy} strokeWidth="4" fill="#dbaf7d"/>)}
   <path d="M41 87V33l9-8V8h37v18l10 8v53" fill="#ecc78f" {...edge}/>
   {Array.from({length:4},(_,j)=><path key={j} d={'M'+(46+j*13)+' 25V11h9v14'} fill="#edc78f" stroke={navy} strokeWidth="3"/>)}
   <path d="M54 239v-68q22-24 44 0v68" fill="#6d4d3b" {...edge}/>
   <rect x="20" y="132" width="23" height="38" fill="#ffdfaa" stroke={navy} strokeWidth="4"/>
   <rect x="116" y="132" width="23" height="38" fill="#ffdfaa" stroke={navy} strokeWidth="4"/>
 </g>;
}
function Book({x=63,y=97}:{x?:number;y?:number}){
 return <g transform={'translate('+x+' '+y+')'} strokeLinejoin="round">
  <path d="M141 235Q65 206 0 221V7Q65 -8 141 24Q211 -4 281 8V223Q213 208 141 235Z" fill="#fff2ca" {...edge}/>
  <path d="M141 24V235M16 52h106M16 84h107M16 117h107M159 53h105M159 84h107M159 116h107" stroke="#acb6bb" strokeWidth="5"/>
 </g>;
}
function Plane(){
 return <g>
  <path d="M0 309h400" stroke="#82a8b4" strokeWidth="18"/>
  {Array.from({length:5},(_,j)=><path key={j} d={'M'+(9+j*91)+' 328h58'} stroke="#fff" strokeWidth="7"/>)}
  <g opacity=".72"><rect x="268" y="240" width="111" height="68" fill="#bacfd9" {...edge}/><path d="M298 239v-40l21-10 20 10v40" fill="#b7d0dd" {...edge}/><rect x="303" y="209" width="30" height="21" fill="#9ed1e1"/></g>
  <g transform="translate(20 81) rotate(-6 180 123)">
    <path d="M35 123L5 10L35 10L105 110Z" fill="#7042aa" {...edge}/>
    <path d="M5 110Q110 88 270 93Q326 96 360 111Q384 125 371 139Q331 161 282 167L80 169Q21 159 5 139Z" fill="#55318f" {...edge}/>
    <path d="M40 127Q176 110 362 125" stroke="#aa83d8" strokeWidth="8" fill="none"/>
    {Array.from({length:13},(_,j)=><ellipse key={j} cx={110+j*18} cy="125" rx="5.3" ry="4.2" fill="#e6daee"/>)}
    <path d="M80 151L192 212H266L176 141Z" fill="#a688dc" {...edge}/>
    <path d="M185 206h78" stroke="#e8dafa" strokeWidth="6"/>
    <ellipse cx="184" cy="184" rx="36" ry="26" fill="#43305d" {...edge}/>
    <ellipse cx="184" cy="184" rx="18" ry="15" fill="#c5d6e5" stroke={navy} strokeWidth="4"/>
    <ellipse cx="300" cy="184" rx="26" ry="18" fill="#43305d" {...edge}/>
    <ellipse cx="300" cy="184" rx="12" ry="9" fill="#c5d6e5"/>
    <path d="M90 165v25M302 163v27" stroke="#565269" strokeWidth="5"/>
    <circle cx="91" cy="193" r="9" fill="#303646" stroke="#e7e6e5" strokeWidth="3"/>
    <circle cx="306" cy="191" r="9" fill="#303646" stroke="#e7e6e5" strokeWidth="3"/>
    <Label x={288} y={148} size={19} color="#fff">طيران الرياض</Label>
  </g>
 </g>;
}
function RealApps(){
 const apps=[{x:70,y:56,c:'#e74d65',kind:'camera'},{x:213,y:46,c:'#e34436',kind:'play'},{x:69,y:199,c:'#2aaf75',kind:'chat'},{x:214,y:184,c:'#2d77c6',kind:'pin'}];
 return <g>
  <g transform="translate(92 12) rotate(-7 107 165)"><rect width="218" height="317" rx="30" fill="#354657" {...edge}/><rect x="16" y="20" width="186" height="279" rx="15" fill="#fff0d7"/><rect x="80" y="25" width="58" height="10" rx="5" fill="#354657"/></g>
  {apps.map((a,j)=><g key={j} transform={'translate('+a.x+' '+a.y+')'}>
   <rect x="0" y="0" width="103" height="99" rx="25" fill={a.c} stroke="#f9f5e9" strokeWidth="5"/>
   {a.kind==='camera'?<g fill="none" stroke="#fff" strokeWidth="7"><rect x="23" y="19" width="59" height="60" rx="18"/><circle cx="53" cy="48" r="16"/><circle cx="73" cy="27" r="4" fill="#fff"/></g>:a.kind==='play'?<g><rect x="16" y="25" width="70" height="48" rx="15" fill="#fff"/><path d="M43 33l26 16-26 15Z" fill={a.c}/></g>:a.kind==='chat'?<g><path d="M18 24q35-31 70 7q17 36-23 52l-41 8 9-20q-31-27-15-47Z" fill="#fff"/><path d="M35 43q16 24 36 11" fill="none" stroke={a.c} strokeWidth="7"/></g>:<g><path d="M52 15q42-2 37 42q-9 24-37 38Q24 79 15 57q-5-44 37-42Z" fill="#fff"/><circle cx="52" cy="52" r="17" fill={a.c}/></g>}
  </g>)}
 </g>;
}
export default function RealWorldCoverArt({i}:{i:number}){
 switch(i){
 case 26:return <g><Shield x={61} y={18} color="#2267ae" name="الهلال" kind="crescent"/><Shield x={229} y={24} color="#f4c83d" name="النصر" kind="sun"/><Shield x={73} y={174} color="#242931" name="الاتحاد" kind="tiger"/><Shield x={232} y={181} color="#268461" name="الأهلي" kind="palm"/></g>;
 case 48:return <Plane/>;
 case 49:return <RealApps/>;
 case 4:return <g><path d="M0 318Q192 266 401 306" fill="#80bd92" stroke="#549f7d" strokeWidth="7"/><FootballShirt x={37} y={74} fill="#f3faf0" accent="#2e9d6a" number="10"/><FootballShirt x={235} y={67} fill="#f9ce3d" accent="#218c70" number="9"/><g transform="translate(160 214)"><circle cx="40" cy="40" r="44" fill="white" {...edge}/><path d="M40 15l19 14-6 25H28l-7-25Z" fill={navy}/><path d="M19 36L0 50M61 36l17 14M27 57l-12 26M54 57l13 26" fill="none" stroke={navy} strokeWidth="5"/></g></g>;
 case 25:return <g><FootballShirt x={32} y={56} fill="#75bed4" accent="#fff" number="10"/><FootballShirt x={235} y={57} fill="#f6cf53" accent="#31956d" number="9"/><path d="M186 47l9 9M330 52l9 9" stroke="#ffc55d" strokeWidth="12"/><g transform="translate(163 212)"><path d="M12 74V43q15-29 33 0v31" fill="#eaa966" {...edge}/><rect width="96" height="33" rx="13" y="5" fill="#284e72" {...edge}/><Label x={48} y={23} size={14} color="#fff">CAPTAIN</Label></g></g>;
 case 30:return <g><g transform="translate(25 63) rotate(-12 155 110)"><rect width="303" height="174" rx="15" fill="#c0d3b4" {...edge}/><rect x="13" y="11" width="276" height="151" rx="12" fill="#e5e9bc" stroke="#638a73" strokeWidth="4"/><circle cx="151" cy="88" r="53" fill="#d9dfad" stroke="#648c70" strokeWidth="6"/><Label x={151} y={88} size={53} color="#36784b">٥٠</Label><Label x={153} y={147} size={23} color="#36784b">ريال سعودي</Label></g><g transform="translate(149 161) rotate(12 135 74)"><rect width="243" height="146" rx="13" fill="#d0d8ea" {...edge}/><rect x="10" y="11" width="222" height="124" rx="9" fill="#dce8f3" stroke="#587a9b" strokeWidth="3"/><Label x={113} y={65} size={63} color="#508275">$</Label><Label x={118} y={110} size={21} color="#526f93">DOLLARS</Label></g></g>;
 case 31:return <g><g transform="translate(39 44) rotate(-15 104 130)"><rect width="191" height="242" rx="15" fill="#195b55" {...edge}/><rect x="15" y="15" width="161" height="215" rx="8" fill="none" stroke="#f8d58e" strokeWidth="3"/><Label x={96} y={52} color="#f8d58e" size={18}>المملكة العربية</Label><Label x={96} y={75} color="#f8d58e" size={19}>السعودية</Label><path d="M95 90v58M60 110q36-37 72-1M95 144v16M67 158h57" fill="none" stroke="#f5d891" strokeWidth="6"/><Label x={96} y={191} color="#f8d58e" size={23}>جواز سفر</Label></g><g transform="translate(236 79) rotate(13 70 105)"><rect width="123" height="193" rx="14" fill="#9d304b" {...edge}/><Label x={61} y={58} size={18} color="#fff">PASSPORT</Label><circle cx="61" cy="111" r="38" fill="none" stroke="#e7bf70" strokeWidth="6"/><Label x={61} y={111} size={40} color="#e7bf70">✈</Label></g></g>;
 case 33:return <g><Masmak x={22} y={54}/><g transform="translate(220 43)"><path d="M52 0L0 252H104Z" fill="#9cb5be" {...edge}/><path d="M38 33h28M27 100h49M12 174h84M0 252h103M0 252L76 100M104 252L27 100" fill="none" stroke="#e4f2eb" strokeWidth="6"/><path d="M0 253h111" stroke="#7a8d9c" strokeWidth="12"/></g><path d="M0 321h400" stroke="#ca9867" strokeWidth="15"/></g>;
 case 34:return <g><g transform="translate(14 35)"><path d="M73 14L32 278H138Z" fill="#b9ccd0" {...edge}/><path d="M44 103h81M36 177h90M24 278h123M47 105l74 73-87 100M112 105l-77 73 105 100" stroke="#e7f4ee" strokeWidth="7" fill="none"/></g><g transform="translate(141 96)"><path d="M13 21h91v217H13Z" fill="#b7dce8" {...edge}/><path d="M22 23h74M22 57h74M22 91h74M22 125h74M22 159h74M22 193h74" stroke="#75a4b5" strokeWidth="7"/></g><g transform="translate(232 52)"><path d="M53 0l57 243H0Z" fill="#a8b5bd" {...edge}/><path d="M53 0v245M29 80h51M17 143h78M8 199h97" stroke="#e4eff5" strokeWidth="5"/></g><path d="M0 315h400" stroke="#a7bcad" strokeWidth="18"/></g>;
 case 11:return <g><g transform="translate(23 59) rotate(-8 80 70)"><SaudiFlag/></g><g transform="translate(215 49) rotate(8 80 70)"><rect width="128" height="77" fill="#fff" {...edge}/><circle cx="64" cy="40" r="25" fill="#d94d58"/></g><g transform="translate(48 211) rotate(7 80 70)"><rect width="128" height="79" fill="#fff" {...edge}/><rect width="42" height="79" fill="#315dba"/><rect x="86" width="42" height="79" fill="#df4c49"/></g><g transform="translate(224 211) rotate(-7 80 70)"><rect width="130" height="78" fill="#e6c53a" {...edge}/><rect width="130" height="27" fill="#27272c"/><rect y="27" width="130" height="26" fill="#c94040"/></g></g>;
 case 10:return <g><Masmak x={54} y={73}/><g transform="translate(230 67)"><path d="M48 0v230" stroke="#8f7056" strokeWidth="8"/><path d="M48 6h126v86H48Z" fill="#248c59" {...edge}/><path d="M65 55h89" stroke="#fff" strokeWidth="6"/><Label x={112} y={40} size={18} color="#fff">السعودية</Label></g><path d="M23 322h363" stroke="#b89a74" strokeWidth="11"/></g>;
 case 15:return <g><ellipse cx="193" cy="247" rx="163" ry="65" fill="#fff0df" {...edge}/><ellipse cx="194" cy="239" rx="139" ry="47" fill="#f9dd89" stroke="#cc9652" strokeWidth="5"/>{Array.from({length:20},(_,j)=><path key={j} d={'M'+(77+j*53%210)+' '+(223+j*11%40)+'l13 4'} stroke="#fff2c3" strokeWidth="5"/>)}<path d="M126 212q-9-83 63-104q78 19 44 101Z" fill="#a56844" {...edge}/><path d="M143 175q47-20 77 8" stroke="#f0b789" strokeWidth="8" fill="none"/><g transform="translate(276 109)"><circle cx="53" cy="53" r="48" fill="#f5d59a" {...edge}/><path d="M22 55q24-53 55-6" fill="none" stroke="#cd8d50" strokeWidth="14"/></g><path d="M92 157q-11-43 18-63M113 159q-8-50 18-83" stroke="#fbfbdf" strokeWidth="9" strokeLinecap="round" fill="none"/></g>;
 default:return null;
 }
}
