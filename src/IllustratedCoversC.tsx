import React from 'react';
const ink='#17394f';
const T=({x,y,size=25,fill=ink,children}:{x:number;y:number;size?:number;fill?:string;children:React.ReactNode})=><text x={x} y={y} textAnchor="middle" dominantBaseline="central" fill={fill} fontFamily="Tajawal,Arial,sans-serif" fontWeight="900" fontSize={size}>{children}</text>;
function Star({x,y}:{x:number;y:number}){return <path d={`M${x} ${y-13}l5 9 10 4-10 5-5 9-5-9-10-5 10-4Z`} fill="#ffe09a" stroke="#b58253" strokeWidth="3"/>}
function Book({x=0,y=0,color='#fbdfaa',width=250}:{x?:number;y?:number;color?:string;width?:number}){return <g transform={`translate(${x} ${y}) scale(${width/250})`} stroke={ink} strokeWidth="6" strokeLinejoin="round">
  <path d="M125 232Q59 206 2 225V15Q72 -2 125 22Q185-3 248 15V225Q184 207 125 232Z" fill={color}/>
  <path d="M125 22V232" fill="none"/><path d="M17 38Q75 25 110 49M15 72Q71 60 110 81M141 48Q189 22 231 40M142 83Q184 60 235 73M15 191Q74 177 110 196M140 194Q187 175 235 190" stroke="#c4a37a" strokeWidth="4" fill="none"/>
 </g>;}
function Minaret({x,y,height=205}:{x:number;y:number;height?:number}){return <g transform={`translate(${x} ${y}) scale(1 ${height/205})`} stroke={ink} strokeWidth="5" strokeLinejoin="round">
 <path d="M26 34H77L73 205H31Z" fill="#e9c790"/><path d="M20 40H84V25H20ZM31 17h41V5H31Z" fill="#b9a286"/><path d="M53 5v-19M41 66h24M39 105h30M36 158h34" fill="none"/><path d="M44 75v17M60 75v17M44 118v19M61 118v19" stroke="#fff5df" strokeWidth="7"/>
 </g>;}
export default function IllustratedCoversC({i}:{i:number}){
 switch(i){
 case 40: return <g>
   {[[30,59,'A','#f4be84',-9],[145,42,'B','#a4d8d2',8],[253,72,'C','#e6bbcf',-6],[55,191,'D','#b5ccef',12],[190,182,'E','#f5ce85',-8],[299,193,'F','#afd9b7',7]].map(([x,y,letter,color,angle],j)=><g key={j} transform={`translate(${x} ${y}) rotate(${angle} 49 46)`}><rect width="92" height="92" rx="16" fill={color as string} stroke={ink} strokeWidth="6"/><path d="M13 15h66" stroke="#ffffffaf" strokeWidth="7"/><T x={46} y={49} size={52}>{letter as string}</T></g>)}
   <Star x={352} y={58}/>
 </g>;
 case 41: return <g>
   <g transform="translate(47 49) rotate(-5 140 120)" stroke={ink} strokeWidth="8"><rect width="299" height="244" rx="17" fill="#ad8261"/><rect x="15" y="15" width="269" height="202" rx="9" fill="#316e61" stroke="#cce1d0" strokeWidth="4"/>
     <T x={144} y={70} size={47} fill="#f8f3d5">7 × 8 = ؟</T><T x={141} y={148} size={42} fill="#ffe5b6">1 2 3</T>
     <path d="M38 104h215M39 181h215" stroke="#87b6a4" strokeWidth="4"/>
   </g>
   <g transform="translate(292 237) rotate(-30 15 36)"><rect x="0" y="0" width="29" height="74" rx="8" fill="#f5b09e" stroke={ink} strokeWidth="4"/><path d="M7 60h17" stroke="#ffde9e" strokeWidth="8"/></g>
   <Star x={39} y={80}/>
 </g>;
 case 42: return <g>
   <path d="M19 262Q87 229 142 255Q198 231 260 255Q317 225 381 248v101H19Z" fill="#71b7d4" stroke="#3c85a2" strokeWidth="6"/>
   <path d="M25 280q50-15 104 3 43-20 87 0 54-14 102 1 25-10 58-1" fill="none" stroke="#dffbff" strokeWidth="6"/>
   <g transform="translate(62 67)" stroke={ink} strokeWidth="6" strokeLinejoin="round">
     <path d="M5 165Q108 204 236 161l-35 57Q94 240 29 212Z" fill="#bd8654"/>
     <path d="M33 162V44H215v120" fill="#edc687"/>
     <path d="M24 44H222L128-14Z" fill="#a27c57"/><path d="M67 44v120M108 44v120M153 44v120M193 44v120" stroke="#855d43" strokeWidth="4"/>
     <path d="M43 174q65 22 146 0" stroke="#d8a66e" strokeWidth="7" fill="none"/>
   </g>
   <g transform="translate(277 211)"><path d="M0 29q28-45 82 0l13 31-88 0Z" fill="#5387a0" stroke={ink} strokeWidth="6"/><circle cx="49" cy="28" r="5" fill="#fff"/><path d="M25 4l-17-25" stroke="#5387a0" strokeWidth="9"/></g>
   <Star x={336} y={54}/>
 </g>;
 case 43: return <g>
   <path d="M31 296H371" stroke={ink} strokeWidth="8"/>
   <Minaret x={32} y={92} height={197}/><Minaret x={276} y={86} height={206}/>
   <g transform="translate(103 104)" stroke={ink} strokeWidth="6">
     <path d="M0 178V91Q99 -16 203 91V178Z" fill="#dfbe8e"/>
     <path d="M22 179V99Q101 27 181 99V179" fill="#fff0d7"/>
     <path d="M60 181v-73q41-45 81 0v73" fill="#82b4a5"/>
     <path d="M58 68Q101 14 145 66" stroke="#ba9265" strokeWidth="5" fill="none"/>
   </g>
   <g transform="translate(138 238) rotate(-10 71 30)" stroke={ink} strokeWidth="5"><rect width="145" height="64" rx="14" fill="#d4a87e"/><path d="M12 15h120v35H12Z" fill="#ffe2b9" strokeWidth="3"/><T x={72} y={32} size={22}>تاريخ الإسلام</T></g>
 </g>;
 case 44: return <g>
  <path d="M16 308h371" stroke="#9bc6aa" strokeWidth="10"/>
  <g transform="translate(29 149)" stroke={ink} strokeWidth="6"><rect width="149" height="157" fill="#323b41"/><path d="M0 22h149M0 72h149" stroke="#e1bf64" strokeWidth="11"/><rect x="54" y="93" width="42" height="64" fill="#ae8a5c"/></g>
  <path d="M182 288Q237 237 228 180Q224 141 271 100" fill="none" stroke="#f4c68d" strokeWidth="19" strokeLinecap="round" strokeDasharray="13 13"/>
  <g transform="translate(224 72)" stroke={ink} strokeWidth="6">
    <path d="M0 216V108Q58 24 141 108V216Z" fill="#e5d1a6"/>
    <path d="M5 107Q67 54 136 108V129H5Z" fill="#347b6a"/>
    <path d="M50 216V148q21-35 44 0v68" fill="#487c76"/>
    <Minaret x={113} y={-10} height={156}/>
  </g>
  <Star x={195} y={68}/>
 </g>;
 case 45: return <g>
   <g transform="translate(35 66)"><Book color="#fff0c6" width={331}/></g>
   <g transform="translate(150 128) rotate(-8 51 51)"><circle cx="55" cy="55" r="51" fill="#bce1d1" stroke={ink} strokeWidth="5"/><T x={55} y={52} size={40} fill="#266a65">معنى</T></g>
   <path d="M60 51l18 19M340 48l-21 22M197 23v31" stroke="#ebb66a" strokeWidth="8" strokeLinecap="round"/>
   <Star x={340} y={121}/>
 </g>;
 case 46: return <g>
   <g transform="translate(63 36) rotate(-9 135 134)" stroke={ink} strokeWidth="8"><rect width="261" height="284" rx="21" fill="#1c796b"/><rect x="13" y="14" width="233" height="257" rx="12" fill="#278f7f" stroke="#f2d58f" strokeWidth="5"/>
     <path d="M128 50q-29 21 0 39q29-18 0-39ZM75 132h107" stroke="#f1d58a" strokeWidth="7" fill="none"/>
     <T x={131} y={178} size={51} fill="#fff0c7">حديث</T>
     <path d="M78 211h110M88 232h87" stroke="#edc98e" strokeWidth="6"/>
   </g>
   <g transform="translate(249 192) rotate(18 53 49)" stroke={ink} strokeWidth="5"><rect width="108" height="109" rx="14" fill="#fff0d8"/><path d="M24 34H85M25 58h61M25 83h45" stroke="#af9178" strokeWidth="6"/></g>
   <Star x={42} y={85}/>
 </g>;
 case 47: return <g>
   <g transform="translate(48 80) rotate(-12 86 122)" stroke={ink} strokeWidth="6">
    <path d="M119 0q-21 68-36 92Q25 113 11 161q-7 86 53 100q67 7 92-69q21-60-39-99Q109 55 119 0Z" fill="#c28354"/>
    <path d="M119 1l23-5v147h-17Z" fill="#f4cb89"/>
    <path d="M31 171q45-17 101 3M42 199q40-12 80 5M115 16V176" stroke="#ffe6b7" strokeWidth="4"/>
    <circle cx="84" cy="159" r="26" fill="#724735" stroke="#edd09b" strokeWidth="4"/>
    <path d="M89 134v55" stroke="#ffe0a4" strokeWidth="5"/>
   </g>
   <g transform="translate(245 164)" stroke={ink} strokeWidth="6">
     <ellipse cx="51" cy="39" rx="48" ry="20" fill="#eeb87d"/><path d="M3 39l8 81q40 31 81 0l7-81" fill="#c47b5c"/><ellipse cx="51" cy="42" rx="43" ry="17" fill="#f3d19c"/><path d="M22 59l51 51" stroke="#a45e50" strokeWidth="5"/>
     <path d="M102-40L58 15" stroke="#9b7b65" strokeWidth="9" strokeLinecap="round"/>
   </g>
   <g transform="translate(212 62)"><path d="M6 27v58M39 6v63M70 23v58" stroke="#d88b74" strokeWidth="7" strokeLinecap="round"/><circle cx="6" cy="25" r="8" fill="#ffe0a2"/><circle cx="39" cy="6" r="8" fill="#ffe0a2"/><circle cx="70" cy="23" r="8" fill="#ffe0a2"/></g>
 </g>;
 case 48: return <g>
   <g transform="translate(24 63) rotate(-10 176 100)" stroke={ink} strokeWidth="6" strokeLinejoin="round">
     <path d="M20 150Q99 121 150 109L184 19Q194 7 208 17L223 99L345 124Q362 136 347 148L227 145L211 185L249 208V226H149V208L184 185L170 144Q85 171 21 159Z" fill="#fff6e8"/>
     <path d="M177 95l36-3M184 136l44-6" stroke="#96bfd0" strokeWidth="11"/>
     <path d="M149 209h97" stroke="#ed9666" strokeWidth="7"/>
     <path d="M21 150l62-24" stroke="#79bcce" strokeWidth="9"/>
   </g>
   <g transform="translate(258 222)" stroke={ink} strokeWidth="5"><path d="M23 15h64l-10 89H33Z" fill="#9fc3ce"/><path d="M13 15H95V0H13Z" fill="#ecb476"/><path d="M41 42h24M38 71h31" stroke="#fff" strokeWidth="5"/></g>
   <path d="M38 246q34-24 70-4M296 54q29-19 63 0" stroke="#fff" strokeWidth="15" strokeLinecap="round" fill="none"/>
 </g>;
 case 49: return <g>
   <g transform="translate(91 27) rotate(-8 109 146)" stroke={ink} strokeWidth="8">
     <rect width="210" height="293" rx="33" fill="#304a60"/><rect x="13" y="16" width="185" height="257" rx="18" fill="#f7e8d1"/>
     <rect x="74" y="22" width="65" height="12" rx="6" fill="#304a60"/>
     {[[35,55,'#81c9a3','pin'],[113,55,'#f4b073','play'],[35,137,'#bed2eb','chat'],[113,137,'#e3acc9','camera']].map(([x,y,color,shape],j)=><g key={j} transform={`translate(${x} ${y})`}>
       <rect width="61" height="62" rx="15" fill={color as string} stroke={ink} strokeWidth="5"/>
       {shape==='pin'?<path d="M31 12q-25 0-16 25l16 17 16-17q9-25-16-25ZM31 23v11" stroke={ink} strokeWidth="5" fill="none"/>:shape==='play'?<path d="M22 14l27 17-27 18Z" fill="#fff9eb" stroke={ink} strokeWidth="3"/>:shape==='chat'?<path d="M12 18h37v24H26L15 52V42h-3Z" fill="#fff" stroke={ink} strokeWidth="3"/>:<g><rect x="13" y="17" width="37" height="33" rx="8" fill="#fff7f5"/><circle cx="32" cy="33" r="11" stroke={ink} strokeWidth="4" fill="none"/></g>}
     </g>)}
     <path d="M81 251h49" stroke="#a2aab0" strokeWidth="6" strokeLinecap="round"/>
   </g>
   <g transform="translate(27 175) rotate(-13 31 34)"><rect width="70" height="74" rx="18" fill="#ffc96e" stroke={ink} strokeWidth="5"/><T x={35} y={37} size={42}>+</T></g>
   <Star x={329} y={76}/>
 </g>;
 default:return null;
 }
}
