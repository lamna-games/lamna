import React from 'react';

const ink='#193a52';
const gold='#ffc95e';
function Star({x,y,r=12}:{x:number;y:number;r?:number}){return <path d={`M ${x} ${y-r} l${r*.26} ${r*.72} ${r*.74} ${r*.28} -${r*.74} ${r*.25} -${r*.26} ${r*.75} -${r*.27} -${r*.75} -${r*.73} -${r*.25} ${r*.73} -${r*.28}Z`} fill={gold} stroke={ink} strokeWidth="2"/>}
function T({x,y,size=22,fill=ink,children}:{x:number;y:number;size?:number;fill?:string;children:React.ReactNode}){return <text x={x} y={y} textAnchor="middle" dominantBaseline="central" fontFamily="Tajawal,Arial,sans-serif" fontSize={size} fontWeight="900" fill={fill}>{children}</text>}
function Club({x,y,base,name,accent='#fff',crest='star'}:{x:number;y:number;base:string;name:string;accent?:string;crest?:string}){
 return <g transform={`translate(${x} ${y})`}>
  <path d="M3 2Q50 -15 98 2V76Q88 108 50 119Q9 104 3 76Z" fill={base} stroke={ink} strokeWidth="6" strokeLinejoin="round"/>
  <path d="M13 14Q48 5 88 14V74Q81 93 50 103Q23 94 13 74Z" fill="none" stroke={accent} strokeWidth="3"/>
  {crest==='stripes'?<g fill={accent}><rect x="29" y="19" width="15" height="48"/><rect x="56" y="19" width="15" height="48"/></g>:crest==='sun'?<g><circle cx="50" cy="46" r="21" fill={accent}/><path d="M30 46h40M50 26v40" stroke={base} strokeWidth="7"/></g>:<path d="M50 16l8 17 19 3-14 13 4 21-17-9-17 9 4-21-14-13 19-3Z" fill={accent} stroke={ink} strokeWidth="2"/>}
  <path d="M16 74H84" stroke={accent} strokeWidth="3"/>
  <T x={50} y={87} size={20} fill={accent}>{name}</T>
 </g>
}
export default function IllustratedCoversA({i}:{i:number}){
 switch(i){
 case 20: return <g>
  <g transform="translate(75 45) rotate(-12 125 125)">
   <rect x="0" y="0" width="245" height="245" rx="27" fill="#fff0cd" stroke={ink} strokeWidth="8"/>
   <rect x="13" y="13" width="219" height="216" rx="19" fill="#ffe3a6" stroke="#d7975a" strokeWidth="3"/>
   <T x={120} y={50} size={26}>رتّب الحروف</T>
   {['ب','ا','ت','ك'].map((letter,n)=><g key={n} transform={`translate(${23+n*52} 89) rotate(${n%2?8:-7} 21 32)`}><rect width="47" height="66" rx="10" fill={['#ffad7d','#a1ddde','#e8b6dc','#a4d8a6'][n]} stroke={ink} strokeWidth="5"/><T x={23} y={32} size={35}>{letter}</T></g>)}
   <path d="M69 184Q120 218 181 183" stroke="#e67856" strokeWidth="9" strokeLinecap="round" fill="none"/>
   <path d="M174 173l17 9-11 16" stroke="#e67856" strokeWidth="8" strokeLinecap="round" fill="none"/>
  </g><Star x={75} y={90}/><Star x={332} y={259}/>
 </g>;
 case 21: return <g>
   <path d="M35 321Q90 237 157 270Q250 216 371 319Z" fill="#abd7a3" stroke="#4b9773" strokeWidth="4"/>
   <g transform="translate(32 83)" stroke={ink} strokeWidth="6" strokeLinejoin="round">
    <ellipse cx="119" cy="125" rx="93" ry="90" fill="#a3b3ae"/>
    <ellipse cx="49" cy="119" rx="50" ry="69" fill="#99aaa8"/><ellipse cx="193" cy="119" rx="49" ry="68" fill="#99aaa8"/>
    <ellipse cx="48" cy="124" rx="32" ry="44" fill="#b8c8bf"/><ellipse cx="192" cy="124" rx="32" ry="44" fill="#b8c8bf"/>
    <path d="M91 113q0 50-4 92q2 47 25 47q19-1 19-28l-13-98" fill="#aab8b2"/>
    <path d="M90 188h35m-32 20h28" fill="none" strokeWidth="4"/>
    <path d="M87 171q-22 21-31 0M142 172q17 15 29-2" stroke="#fff8de" strokeWidth="14" fill="none"/>
    <circle cx="94" cy="118" r="6"/><circle cx="145" cy="118" r="6"/>
   </g>
   <g transform="translate(216 159)" stroke={ink} strokeWidth="6" strokeLinejoin="round">
    <path d="M30 31Q56 -13 105 10Q147 -5 151 63L131 151H15L8 76Z" fill="#b87940"/>
    <path d="M24 42Q56 9 111 35Q121 102 102 140H36Q7 109 24 42Z" fill="#f7c075"/>
    <path d="M63 91l17 8 17-8-16 23Z" fill="#3b2925"/><circle cx="52" cy="74" r="5"/><circle cx="105" cy="74" r="5"/>
    <path d="M80 114q-8 14-18 10m18-10q11 14 18 9" fill="none" strokeWidth="3"/>
   </g><Star x={330} y={82}/>
 </g>;
 case 22: return <g>
   <g transform="translate(53 77)" stroke={ink} strokeWidth="7" strokeLinejoin="round">
     <path d="M17 0L242 0L245 167H15Z" fill="#314e63"/>
     <rect x="29" y="13" width="199" height="139" rx="8" fill="#bde7f2" stroke="#fff" strokeWidth="4"/>
     <path d="M39 124L97 48L141 92L170 58L219 124Z" fill="#80c9b2"/>
     <circle cx="172" cy="43" r="16" fill="#ffce70"/>
     <path d="M0 169h268l25 29H-21Z" fill="#d7dbe0"/><path d="M72 183H216" strokeWidth="4"/>
   </g>
   <g transform="translate(248 180) rotate(9 49 45)" stroke={ink} strokeWidth="6"><rect width="102" height="114" rx="15" fill="#3e596c"/><rect x="11" y="10" width="80" height="90" rx="8" fill="#f2c5e4"/><circle cx="50" cy="55" r="26" fill="#6eaec7"/><circle cx="50" cy="55" r="15" fill="#27496a"/></g>
   <g transform="translate(28 201)"><rect width="101" height="81" rx="11" fill="#ffd080" stroke={ink} strokeWidth="6"/><rect x="13" y="12" width="74" height="48" fill="#faf5db"/><T x={50} y={36} size={20}>TECH</T></g>
 </g>;
 case 23: return <g>
   <g transform="translate(42 60)" stroke={ink} strokeWidth="7" strokeLinejoin="round">
    <rect x="22" y="45" width="309" height="216" rx="29" fill="#42495d"/>
    <rect x="40" y="67" width="273" height="172" rx="17" fill="#ffe6ca"/>
    <path d="M89 246h181v18H89Z" fill="#394959"/>
    <g transform="translate(91 77)">
      <path d="M17 135Q18 75 58 75Q105 72 117 135" fill="#b8d9e4"/><circle cx="66" cy="52" r="48" fill="#e6a67e" stroke={ink} strokeWidth="5"/><path d="M17 35Q19 -8 64 0Q109 -3 116 36l-32-15-40 3Z" fill="#26272e"/><path d="M48 63q17 17 37 0M58 85q11 6 19 0" fill="none" strokeWidth="4"/>
    </g><g transform="translate(211 105)"><path d="M4 132Q8 73 68 72Q118 75 121 132" fill="#e58b8c"/><circle cx="65" cy="51" r="46" fill="#f2ba9b" stroke={ink} strokeWidth="5"/><path d="M20 70Q-4 6 60 -2Q131 -9 110 74L99 33 41 28Z" fill="#593e39"/></g>
    <path d="M21 12h207v50H21Z" fill="#2d3949"/><path d="M22 14l30 47m12-47 32 47m9-47 30 47m10-47 30 47m11-47 30 47" stroke="#fff" strokeWidth="12"/>
   </g><Star x={350} y={70}/>
 </g>;
 case 24: return <g>
   <path d="M37 295Q153 265 364 292l-8 38H33Z" fill="#a6d4a7" stroke="#46897a" strokeWidth="4"/>
   <g transform="translate(59 83)" stroke={ink} strokeWidth="6" strokeLinejoin="round">
    <path d="M22 105Q-1 29 76 25Q159 -5 167 86Q166 152 111 180L32 166Z" fill="#ffda8d"/>
    <circle cx="56" cy="73" r="24" fill="white"/><circle cx="124" cy="73" r="24" fill="white"/><circle cx="60" cy="76" r="8"/><circle cx="121" cy="76" r="8"/>
    <path d="M62 116q37 45 73-1" fill="none"/><path d="M37 33l-19-33 47 13M117 16l39-35-4 60" fill="#ffbca4"/>
    <ellipse cx="90" cy="168" rx="63" ry="44" fill="#ed8d6d"/>
   </g>
   <g transform="translate(236 97)" stroke={ink} strokeWidth="6" strokeLinejoin="round">
    <ellipse cx="68" cy="114" rx="72" ry="92" fill="#b0dfe2"/>
    <path d="M3 84L-9 49Q29 51 42 71M117 71Q141 37 159 45L130 95" fill="#86c6ce"/>
    <ellipse cx="43" cy="105" rx="20" ry="24" fill="#fff"/><ellipse cx="98" cy="106" rx="20" ry="24" fill="#fff"/>
    <circle cx="49" cy="111" r="8"/><circle cx="98" cy="113" r="8"/>
    <path d="M56 141q20 19 41 1" fill="none"/>
   </g>
 </g>;
 case 25: return <g>
   <path d="M30 293Q173 270 372 291" stroke="#4a9d7a" strokeWidth="20" strokeLinecap="round" fill="none"/>
   <g transform="translate(87 44)" stroke={ink} strokeWidth="7" strokeLinejoin="round">
    <path d="M44 73L93 34L164 35L210 72L240 219L177 235L149 169L146 282H72L66 171L42 235L-15 218Z" fill="#ffe5c5"/>
    <path d="M91 35Q110 76 165 35M115 77V274" stroke="#ed8660" strokeWidth="16"/>
    <path d="M39 79l35 23m102 0 34-23" stroke="#e6ad5d" strokeWidth="11"/>
    <path d="M160 128l-19 15-19-15 8-17h21Z" fill="#ffe7ad" strokeWidth="5"/>
    <path d="M34 139h36" stroke="#d57a58" strokeWidth="10"/>
   </g>
   <g transform="translate(255 198)"><circle cx="53" cy="53" r="53" fill="#fff" stroke={ink} strokeWidth="7"/><path d="M53 14l24 14-5 24H34l-8-24Z M31 52L13 76l11 22M74 54l22 17-6 19M34 81h37" fill="#263c53" stroke="#263c53" strokeWidth="4"/></g>
   <g transform="translate(45 78) rotate(-14 25 60)"><rect x="0" y="0" width="58" height="121" rx="15" fill="#81d0cf" stroke={ink} strokeWidth="6"/><path d="M13 30H46" stroke="#fff" strokeWidth="10"/><T x={28} y={81} size={28}>10</T></g>
 </g>;
 case 26: return <g>
  <g transform="translate(71 25)">
   <Club x={0} y={0} base="#2465a9" accent="#e9f7fe" name="الهلال"/>
   <g transform="rotate(9 55 60)"><Club x={159} y={3} base="#f8dc52" accent="#30509e" name="النصر" crest="sun"/></g>
   <g transform="rotate(-7 55 55)"><Club x={4} y={167} base="#252b32" accent="#f8c84b" name="الاتحاد" crest="stripes"/></g>
   <Club x={170} y={162} base="#27926a" accent="#fff" name="الأهلي"/>
  </g>
 </g>;
 case 27: return <g>
    <path d="M31 316Q75 237 192 246Q322 225 369 320Z" fill="#81bca9" stroke="#458d71" strokeWidth="6"/>
    <g transform="translate(113 31)" stroke="#8a5b2f" strokeWidth="5" strokeLinejoin="round">
      <path d="M67 41Q56 4 97 4Q136 4 129 40Q155 52 140 86Q135 106 113 116V171L149 192V218H49V192L81 171V117Q59 100 53 85Q38 53 67 41Z" fill="#ffcd62"/>
      <ellipse cx="99" cy="46" rx="37" ry="33" fill="#fbe9a9"/><path d="M75 38q15-22 29 4q9-10 27-2M81 78q15-5 35 0" fill="none" stroke="#c89636"/>
      <path d="M53 82Q3 91 17 41Q22 27 48 36M142 83Q196 89 183 40Q177 21 151 34" fill="none" stroke="#d4a047" strokeWidth="14"/>
      <path d="M68 198H132" strokeWidth="5"/>
    </g>
    {Array.from({length:8},(_,j)=><path key={j} d={`M ${20+j*46} 290 v17`} stroke="#f9df81" strokeWidth="11" strokeLinecap="round"/>)}
    <g transform="translate(42 168)"><path d="M0 61q33-55 65-1" fill="#ed7c60" stroke={ink} strokeWidth="5"/><path d="M9 51l47 0" stroke="#fff" strokeWidth="6"/></g>
    <g transform="translate(306 168)"><path d="M0 61q33-55 65-1" fill="#4d91c5" stroke={ink} strokeWidth="5"/><path d="M9 51h47" stroke="#fff" strokeWidth="6"/></g>
 </g>;
 case 28: return <g>
   <g transform="translate(35 35)" stroke={ink} strokeWidth="5" strokeLinejoin="round">
    <path d="M113 23L62 264H171Z" fill="#c1d7df"/>
    <path d="M100 25h25M85 92h63M70 171h89M52 264h130M99 94l49 79-89 91M148 94l-80 80 100 90" fill="none" stroke="#446e8c" strokeWidth="7"/>
    <path d="M0 245H182v32H0Z" fill="#c5ac8a"/>
   </g>
   <g transform="translate(207 78)" stroke={ink} strokeWidth="5">
     <path d="M18 37l42-35 42 35v196H18Z" fill="#f4bd75"/>
     <rect x="4" y="220" width="112" height="29" fill="#f1d5a5"/>
     <circle cx="61" cy="75" r="33" fill="#fff7de"/><path d="M61 75V56m0 19 17 8" strokeWidth="5"/>
     <path d="M19 152h83M19 184h83M15 51h91" fill="none"/>
   </g>
   <g transform="translate(129 254)" stroke={ink} strokeWidth="5"><path d="M0 52L44 0l44 52Z" fill="#e8b880"/><path d="M62 53l33-44 39 44Z" fill="#e2a667"/></g>
 </g>;
 case 29: return <g>
   <g transform="translate(43 36)">
    <circle cx="160" cy="141" r="125" fill="#87cbdc" stroke={ink} strokeWidth="8"/>
    <path d="M118 39l56 5 19 36-22 34-36-18-28 27-29-25 3-32Z M187 143l49-16 19 28-19 45-26-5-10 37-25-21Z M65 160l28-21 26 15-6 31-30 18Z" fill="#79bb76" stroke="#387b65" strokeWidth="4" strokeLinejoin="round"/>
    <path d="M40 141h239M162 16Q87 141 162 266M162 16Q235 141 162 266" stroke="#f5ffff" strokeWidth="3" fill="none" opacity=".65"/>
   </g>
   <g transform="translate(251 192) rotate(16 55 57)"><circle cx="60" cy="59" r="57" fill="#ffecba" stroke={ink} strokeWidth="6"/><path d="M60 14l19 45-19 46-19-46Z" fill="#e9735e" stroke={ink} strokeWidth="4"/><path d="M60 14v91" stroke={ink} strokeWidth="3"/></g>
   <Star x={57} y={79} r={16}/>
 </g>;
 default: return null;
 }
}
