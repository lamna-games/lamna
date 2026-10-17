import React from 'react';
const ink='#173b52';
function Txt({x,y,size=24,color=ink,children}:{x:number;y:number;size?:number;color?:string;children:React.ReactNode}){return <text x={x} y={y} fill={color} textAnchor="middle" dominantBaseline="central" fontFamily="Tajawal,Arial,sans-serif" fontWeight="900" fontSize={size}>{children}</text>}
function Shine({x,y}:{x:number;y:number}){return <path d={`M${x} ${y-14}l5 9 9 5-9 5-5 9-5-9-9-5 9-5Z`} fill="#ffd66f" stroke="#ca8953" strokeWidth="2"/>}
export default function IllustratedCoversB({i}:{i:number}){
 switch(i){
 case 30: return <g>
    <g transform="translate(48 71) rotate(-11 136 103)" stroke={ink} strokeWidth="6" strokeLinejoin="round">
      <rect x="0" y="0" width="285" height="181" rx="19" fill="#d1dbbe"/><rect x="11" y="11" width="264" height="159" rx="13" fill="#e3ecd2" stroke="#689079" strokeWidth="3"/>
      <path d="M48 37h188v106H48Z" fill="#b7d3aa"/><path d="M86 36q49 60 2 107M202 36q-49 60-2 107" fill="none" stroke="#719d82" strokeWidth="3"/>
      <circle cx="142" cy="92" r="47" fill="#dce8cd" stroke="#679574" strokeWidth="6"/><Txt x={142} y={90} size={51} color="#497f66">ر.س</Txt>
      <path d="M19 28h38m166 129h40" stroke="#668e77" strokeWidth="5"/>
    </g>
    <g transform="translate(208 185) rotate(15 63 53)">
      <ellipse cx="72" cy="104" rx="86" ry="22" fill="#416a7d" opacity=".18"/>
      <circle cx="66" cy="60" r="56" fill="#ffd66c" stroke="#a57135" strokeWidth="8"/>
      <circle cx="66" cy="60" r="42" fill="#ffe9a0" stroke="#c18e40" strokeWidth="4"/><Txt x={66} y={60} size={50} color="#b58038">$</Txt>
    </g><g transform="translate(45 212)"><circle cx="46" cy="47" r="43" fill="#f4cf7b" stroke="#9e7138" strokeWidth="6"/><Txt x={46} y={47} size={37}>€</Txt></g><Shine x={349} y={65}/>
 </g>;
 case 31: return <g>
    <g transform="translate(65 46) rotate(-12 105 124)" strokeLinejoin="round" stroke={ink} strokeWidth="7">
      <rect width="214" height="252" rx="18" fill="#0c765c"/>
      <rect x="16" y="18" width="182" height="216" rx="11" fill="none" stroke="#e5c680" strokeWidth="3"/>
      <path d="M73 65q33-32 68 0M108 37v64M84 73h51" fill="none" stroke="#e4c881" strokeWidth="9" strokeLinecap="round"/>
      <Txt x={106} y={126} size={17} color="#ffe1a3">المملكة العربية السعودية</Txt>
      <Txt x={106} y={153} size={21} color="#ffe6b7">جواز سفر</Txt>
      <Txt x={106} y={181} size={15} color="#ffe4aa">PASSPORT</Txt>
    </g>
    <g transform="translate(235 107) rotate(18 64 101)" stroke={ink} strokeWidth="6">
     <rect x="11" y="13" width="99" height="154" rx="17" fill="#f1ac77"/>
     <rect x="35" y="-2" width="54" height="31" rx="9" fill="none"/>
     <path d="M24 49H98" stroke="#ffecd4" strokeWidth="6"/><path d="M24 86H98" stroke="#ffe4c8" strokeWidth="4"/>
     <circle cx="33" cy="170" r="9" fill="#253b52"/><circle cx="90" cy="170" r="9" fill="#253b52"/>
    </g>
    <g transform="translate(200 35) rotate(24 76 35)"><path d="M2 42l86-18 79 18-3 17-71-8-35 31-16-5 16-34-55 11Z" fill="#f6f9ef" stroke={ink} strokeWidth="5"/></g>
 </g>;
 case 32: return <g>
    <path d="M61 131l46-38 25-46 26 20 19-17 27 19 22-18 39 45 43 7-7 28 48 39-5 58-40 29-5 45-32 18-49-14-36 18-38-19-50-1-21-34-31-13-24-44 14-30-25-25Z" fill="#92c7a0" stroke="#285d59" strokeWidth="8" strokeLinejoin="round"/>
    <g transform="translate(18 54) rotate(-8 65 25)"><rect x="0" y="0" width="122" height="53" rx="21" fill="#fff2da" stroke={ink} strokeWidth="5"/><Txt x={61} y={25} size={24}>وش علومك؟</Txt></g>
    <g transform="translate(228 45) rotate(5 65 25)"><rect x="0" y="0" width="145" height="55" rx="19" fill="#ffe0d4" stroke={ink} strokeWidth="5"/><Txt x={72} y={27} size={27}>أبشر</Txt></g>
    <g transform="translate(182 226) rotate(9 62 30)"><rect x="0" y="0" width="153" height="61" rx="20" fill="#e9d7fa" stroke={ink} strokeWidth="5"/><Txt x={77} y={30} size={27}>الحين</Txt></g>
    <path d="M113 110l14 22-3-21M274 100l-17 25 7-25M205 218l8-29 8 24" fill="#fff2da" stroke={ink} strokeWidth="4"/>
 </g>;
 case 33: return <g>
     <path d="M20 303H382" stroke={ink} strokeWidth="9"/>
     <g transform="translate(29 102)" stroke={ink} strokeWidth="6">
       <path d="M10 13L35 0h83l21 13-18 190H30Z" fill="#bccad1"/><path d="M50 0L58 83l11 26 16-26L94 0" fill="#87b5c1"/>
       <path d="M36 154H119" stroke="#7597a4" strokeWidth="6"/>
       <path d="M48 110h26v35H48M83 110h24v35H83" stroke="#fff" strokeWidth="5" fill="#e0ecf0"/>
     </g>
     <g transform="translate(188 63)" stroke={ink} strokeWidth="5">
       <path d="M39 65h108v172H39Z" fill="#e5be8d"/>
       <path d="M29 65h128l-19-16H46Z" fill="#b9a68b"/>
       <circle cx="94" cy="104" r="37" fill="#fff3d5"/><path d="M94 104l18-11m-18 11-3-22" strokeWidth="4"/>
       <path d="M77 43V5h36v38M65 6h60" strokeWidth="6" fill="#dfc38d"/>
       <path d="M59 172h74M59 201h74" strokeWidth="5"/>
     </g>
     <g transform="translate(153 216)" stroke={ink} strokeWidth="5"><rect x="0" y="0" width="110" height="100" fill="#282d32"/><path d="M0 12h110M7 57h95" stroke="#f2d17b" strokeWidth="7"/></g>
 </g>;
 case 34: return <g>
    <path d="M8 309h383" stroke={ink} strokeWidth="8"/>
    <g transform="translate(18 96)" stroke={ink} strokeWidth="6" strokeLinejoin="round"><path d="M5 3h92L87 205H18Z" fill="#a7bed0"/><path d="M36 35h36m-36 32h36m-36 30h36m-36 30h36m-36 30h36" stroke="#e9f4fa" strokeWidth="8"/></g>
    <g transform="translate(132 49)" stroke={ink} strokeWidth="6" strokeLinejoin="round"><path d="M39 10H91L103 259H26Z" fill="#cad8d2"/><path d="M47 10L65-12 80 10M39 77h61M36 151h68" fill="none"/><path d="M64 18v239" stroke="#7dabb6" strokeWidth="7"/></g>
    <g transform="translate(254 123)" stroke={ink} strokeWidth="6"><path d="M5 35H110v159H5Z" fill="#dfc29c"/><path d="M12 26h94v20H12Z" fill="#ad927f"/><path d="M23 77h27v27H23M63 77h30v27H63M25 123h67v27H25" strokeWidth="5" fill="#e9ece6"/></g>
    <path d="M18 315q162-21 368 0" stroke="#4ea4ad" strokeWidth="11" fill="none"/>
    <g transform="translate(280 34) rotate(12 49 27)"><rect width="100" height="52" rx="14" fill="#fff3c2" stroke={ink} strokeWidth="5"/><Txt x={50} y={27} size={20}>مدننا</Txt></g>
 </g>;
 case 35: return <g>
   <ellipse cx="182" cy="256" rx="147" ry="58" fill="#eee7d8" stroke={ink} strokeWidth="7"/>
   <ellipse cx="182" cy="249" rx="127" ry="42" fill="#f9df9c" stroke="#d69d4a" strokeWidth="5"/>
   {Array.from({length:18},(_,j)=><path key={j} d={`M${75+(j*47)%212} ${227+(j*17)%39}l16 4`} stroke="#f9f2ce" strokeWidth="5" strokeLinecap="round"/>)}
   <path d="M131 222q-14-84 54-105q84 19 41 105Z" fill="#bd7141" stroke={ink} strokeWidth="7"/>
   <path d="M130 184q-16-19-30-5q-15 22 10 37l26-5" fill="#e8aa62" stroke={ink} strokeWidth="6"/>
   <path d="M170 142q27 8 42 34" stroke="#f7c176" strokeWidth="9" strokeLinecap="round"/>
   <g transform="translate(244 66) rotate(12 58 76)" stroke={ink} strokeWidth="6">
      <path d="M38 6h62l-7 130H46Z" fill="#d5af70"/><path d="M18 128h104v15H18Z" fill="#bd9054"/><path d="M43 27h52M45 53h48" strokeWidth="4"/>
      <path d="M67 10q-21-35 2-46q26 8 10 43" stroke="#a17445" strokeWidth="10" fill="none"/>
   </g>
   <g transform="translate(29 94)"><circle cx="48" cy="48" r="41" fill="#9eaa7b" stroke={ink} strokeWidth="5"/><path d="M16 53q29-27 61-1" stroke="#e8e6b4" strokeWidth="8" fill="none"/></g>
 </g>;
 case 36: return <g>
   <g transform="translate(60 54) rotate(-7 124 132)" stroke={ink} strokeWidth="6"><rect width="262" height="236" rx="23" fill="#f8e5bd"/><rect x="12" y="12" width="238" height="212" rx="16" fill="#fff6df" stroke="#e4ba82" strokeWidth="3"/>
     <Txt x={131} y={55} size={32}>بدون نقاط</Txt>
     <path d="M34 77h192" stroke="#dbbc89" strokeWidth="4"/>
     <Txt x={131} y={122} size={49} color="#db8151">سلام</Txt>
     <Txt x={131} y={182} size={45} color="#2c7d88">محمد</Txt>
   </g>
   <g transform="translate(272 211)"><circle cx="48" cy="48" r="47" fill="#a6d8d6" stroke={ink} strokeWidth="6"/><Txt x={48} y={48} size={49}>✓</Txt></g>
   <Shine x={47} y={74}/>
 </g>;
 case 37: return <g>
   <g transform="translate(34 61) rotate(-8 100 60)" stroke={ink} strokeWidth="7">
     <rect width="218" height="113" rx="34" fill="#fff0cc"/><path d="M138 111l-1 33-36-35" fill="#fff0cc" strokeLinejoin="round"/>
     <Txt x={110} y={60} size={37}>علومك؟</Txt>
   </g>
   <g transform="translate(190 145) rotate(10 82 55)" stroke={ink} strokeWidth="7">
     <rect width="172" height="102" rx="31" fill="#aedcd5"/><path d="M44 100l-23 32 58-32" fill="#aedcd5" strokeLinejoin="round"/>
     <Txt x={86} y={52} size={36}>أبشر!</Txt>
   </g>
   <g transform="translate(39 229) rotate(8 75 32)" stroke={ink} strokeWidth="5"><rect width="137" height="61" rx="27" fill="#f2c6d8"/><Txt x={68} y={30} size={29}>فزعة</Txt></g>
   <Shine x={360} y={89}/>
 </g>;
 case 38: return <g>
   <g transform="translate(55 51)" stroke={ink} strokeWidth="7">
     <path d="M13 9h257v249H13Z" fill="#faf2d2" strokeLinejoin="round"/>
     <path d="M34 32h212v206H34Z" fill="#b5d5e8" stroke="#759eb3" strokeWidth="3"/>
     <ellipse cx="143" cy="209" rx="91" ry="13" fill="#5e8b9f" opacity=".3" stroke="none"/>
     <path d="M74 169h133l-14 36H88Z" fill="#3d5d68"/>
     <path d="M97 168q-22-26-11-64q6-39 37-46l32-1q34 11 39 45q3 42-15 66Z" fill="#2a4050"/>
     <path d="M98 119h80" stroke="#405e6a" strokeWidth="8"/>
     <Txt x={144} y={129} size={89} color="#f7d781">؟</Txt>
   </g>
   <g transform="translate(247 208) rotate(-19 47 47)"><circle cx="49" cy="49" r="41" fill="#fff5df" fillOpacity=".7" stroke={ink} strokeWidth="10"/><path d="M77 83l50 45" stroke={ink} strokeWidth="14" strokeLinecap="round"/></g>
 </g>;
 case 39: return <g>
   {[
     [34,50,'أ','#f3bc89',-9],[146,42,'ب','#a4d8d4',7],[254,65,'ت','#f0cb80',-4],
     [67,180,'ج','#bfc6ee',8],[194,188,'س','#d9b7d6',-8],[292,198,'م','#bad7a3',9]
   ].map(([x,y,letter,color,rotation],j)=><g key={j} transform={`translate(${x} ${y}) rotate(${rotation} 48 49)`}><rect width="92" height="94" rx="16" fill={color as string} stroke={ink} strokeWidth="6"/><path d="M9 12h74" stroke="#ffffff9a" strokeWidth="6"/><Txt x={46} y={53} size={51}>{letter as string}</Txt></g>)}
   <Shine x={355} y={53}/>
 </g>;
 default: return null;
 }
}
