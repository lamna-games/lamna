import React from 'react';
import './passportCover.css';

type PassportStyle={cover:string;edge:string;foil:string;design:'palm'|'flower'|'eagle'|'shield'|'leaf'|'crown'|'sun'|'laurel';script:'arabic'|'english'|'french'|'other'};
/** Styled, intentionally non-official preview artwork. Replace each cover with a
 * properly licensed photographic image using question.imageUrl in admin.
 * Country names remain masked in BOTH the placeholder and real-photo views. */
const coverStyles:Record<string,PassportStyle>={
 sa:{cover:'#063b2e',edge:'#072b24',foil:'#e6c780',design:'palm',script:'arabic'},
 ae:{cover:'#102d4b',edge:'#061e38',foil:'#d9c793',design:'eagle',script:'arabic'},
 jp:{cover:'#752634',edge:'#491825',foil:'#ddc493',design:'flower',script:'other'},
 us:{cover:'#172e55',edge:'#0c1b3d',foil:'#e2c78e',design:'eagle',script:'english'},
 gb:{cover:'#172947',edge:'#0a1a31',foil:'#edca85',design:'crown',script:'english'},
 ca:{cover:'#182c55',edge:'#0b1c3e',foil:'#e5c78b',design:'leaf',script:'english'},
 kw:{cover:'#132954',edge:'#0b1f43',foil:'#dec58b',design:'shield',script:'arabic'},
 qa:{cover:'#62283b',edge:'#41192a',foil:'#e5c994',design:'shield',script:'arabic'},
 om:{cover:'#7b2631',edge:'#521b25',foil:'#e9cf96',design:'shield',script:'arabic'},
 bh:{cover:'#6b2635',edge:'#401923',foil:'#e5be8b',design:'shield',script:'arabic'},
 fr:{cover:'#6c2732',edge:'#411823',foil:'#e5c990',design:'laurel',script:'french'},
 de:{cover:'#742334',edge:'#501629',foil:'#dfc38e',design:'eagle',script:'other'},
 it:{cover:'#71333a',edge:'#4a1f27',foil:'#dec28a',design:'laurel',script:'other'},
 es:{cover:'#7a2535',edge:'#541724',foil:'#eccb89',design:'crown',script:'other'},
 cn:{cover:'#902e3c',edge:'#641b29',foil:'#e3c88a',design:'sun',script:'other'},
 in:{cover:'#243b66',edge:'#102245',foil:'#e7ca87',design:'sun',script:'other'},
 au:{cover:'#1a2c51',edge:'#0d2040',foil:'#dec390',design:'shield',script:'english'},
 br:{cover:'#182f42',edge:'#0a2636',foil:'#e6c990',design:'sun',script:'other'}
};
function PassportEmblem({design,color}:{design:PassportStyle['design'];color:string}){
 const groupProps={stroke:color,strokeWidth:3,fill:'none',strokeLinecap:'round' as const,strokeLinejoin:'round' as const};
 if(design==='palm')return <g {...groupProps}>
  <path d="M160 79v54m0-54q-31-34-51-10m51 10q31-34 51-10m-51 10q-43-6-51 13m51-13q43-6 51 13m-51-13q-16-39 0-54m0 54q16-39 0-54" strokeWidth="7"/>
  <path d="M88 137q37-18 71 16 40-30 74-16m-145 0 16 21m129-21-16 21" strokeWidth="7"/>
  <path d="M91 168q69-30 137 0" strokeWidth="3" opacity=".65"/>
 </g>;
 if(design==='flower')return <g {...groupProps}>
  {Array.from({length:16},(_,i)=><ellipse key={i} cx="160" cy="87" rx="11" ry="35" transform={`rotate(${i*22.5} 160 125)`} strokeWidth="3" fill={color} fillOpacity=".18"/>)}
  <circle cx="160" cy="125" r="24" strokeWidth="5"/><circle cx="160" cy="125" r="8" fill={color}/>
 </g>;
 if(design==='leaf')return <g {...groupProps}>
  <path d="M160 53 178 88 197 76 200 98 229 104 206 125 213 153 180 150 160 173 140 150 107 153 114 125 91 104 120 98 123 76 142 88Z" strokeWidth="6" fill={color} fillOpacity=".18"/>
  <path d="M160 127v66" strokeWidth="6"/>
 </g>;
 if(design==='eagle')return <g {...groupProps}>
  <path d="M160 80q-22 13-37 16L75 74l12 35 47 22-30 24 56 29 56-29-30-24 47-22 12-35-48 22q-15-3-37-16Z" fill={color} fillOpacity=".15" strokeWidth="6"/>
  <path d="M160 89v85M130 138h60" strokeWidth="4"/><path d="M145 74q15-13 30 0" strokeWidth="5"/>
 </g>;
 if(design==='crown')return <g {...groupProps}>
  <path d="M89 105 110 63l28 34 22-48 22 48 28-34 21 42-13 26H102Z" strokeWidth="6" fill={color} fillOpacity=".15"/>
  <path d="M110 138v35q50 29 100 0v-35Z" strokeWidth="5"/><path d="M138 150v32m44-32v32" strokeWidth="3"/>
 </g>;
 if(design==='sun')return <g {...groupProps}>
  <circle cx="160" cy="120" r="40" strokeWidth="7"/>
  {Array.from({length:12},(_,i)=><path key={i} d="M160 56v-18" transform={`rotate(${i*30} 160 120)`} strokeWidth="7"/>)}
  <circle cx="160" cy="120" r="16" fill={color} fillOpacity=".28"/>
 </g>;
 if(design==='shield')return <g {...groupProps}>
  <path d="M160 61q32 20 57 18v65q-11 35-57 55-46-20-57-55V79q25 2 57-18Z" strokeWidth="7" fill={color} fillOpacity=".15"/>
  <path d="M160 87v85M124 131h72" strokeWidth="4"/><circle cx="160" cy="130" r="22" strokeWidth="4"/>
 </g>;
 return <g {...groupProps}>
  <path d="M109 170q-50-49 0-95m-8 12-24-9m15 25-28-3m25 25-28 6m34 11-21 19M211 170q50-49 0-95m8 12 24-9m-15 25 28-3m-25 25 28 6m-34 11 21 19" strokeWidth="5"/>
  <path d="M160 87l24 18-9 32h-30l-9-32Z" strokeWidth="6" fill={color} fillOpacity=".2"/>
 </g>;
}
export default function PassportCover({passportCode,imageUrl}:{passportCode:string;imageUrl?:string}){
 const theme=coverStyles[passportCode];const [imageFailed,setImageFailed]=React.useState(false);
 React.useEffect(()=>setImageFailed(false),[passportCode,imageUrl]);
 if(!theme)return null;
 const usePhoto=Boolean(imageUrl&&!imageFailed);
 const ar=theme.script==='arabic';
 return <figure className="lm-passport-card" role="img" aria-label="صورة غلاف جواز سفر، اسم الدولة مخفي للتحدي">
  <div className="lm-passport-frame">
   {usePhoto?<img className="lm-passport-photograph" src={imageUrl} loading="eager" decoding="async" referrerPolicy="no-referrer"
     alt="" onError={()=>setImageFailed(true)}/>:
    <svg viewBox="0 0 320 440" className="lm-passport-design" aria-hidden="true">
     <defs>
      <linearGradient id={'lamna-passport-bg-'+passportCode} x1="0" y1="0" x2="1" y2="1">
       <stop offset="0" stopColor={theme.cover}/><stop offset=".48" stopColor={theme.edge}/>
       <stop offset="1" stopColor={theme.cover}/>
      </linearGradient>
      <linearGradient id={'lamna-passport-foil-'+passportCode} x1="0" y1="0" x2="1" y2="1">
       <stop offset="0" stopColor="#ad8753"/><stop offset=".46" stopColor={theme.foil}/><stop offset="1" stopColor="#9d7749"/>
      </linearGradient>
      <filter id={'lamna-passport-name-'+passportCode}><feGaussianBlur stdDeviation="8"/></filter>
      <filter id={'lamna-passport-texture-'+passportCode}>
       <feTurbulence type="fractalNoise" baseFrequency=".23" numOctaves="2" seed="9"/>
       <feColorMatrix type="saturate" values="0"/>
       <feComponentTransfer><feFuncA type="linear" slope=".14"/></feComponentTransfer>
      </filter>
     </defs>
     <rect x="2" y="2" width="316" height="436" rx="11" fill={'url(#lamna-passport-bg-'+passportCode+')'}/>
     <rect x="6" y="5" width="308" height="430" rx="11" fill="#fff" filter={'url(#lamna-passport-texture-'+passportCode+')'} opacity=".21"/>
     <path d="M9 20v396" stroke="#ffffff" strokeOpacity=".14" strokeWidth="4"/>
     <g stroke={'url(#lamna-passport-foil-'+passportCode+')'} fill="none">
      <path d="M136 54q24-18 48 0" strokeWidth="2" opacity=".55"/>
      <path d="M92 204q68 20 136 0" strokeWidth="2" opacity=".32"/>
     </g>
     <g transform="translate(0 11)" stroke={theme.foil}><PassportEmblem design={theme.design} color={theme.foil}/></g>
     {/* The issuer label is deliberately unreadable, unlike 'PASSPORT'. */}
     <g filter={'url(#lamna-passport-name-'+passportCode+')'} opacity=".65">
      <rect x="73" y="260" width="173" height="10" rx="5" fill={theme.foil}/>
      <rect x="111" y="278" width="94" height="7" rx="4" fill={theme.foil}/>
     </g>
     {ar?<text x="160" y="346" fill={theme.foil} fontSize="29" textAnchor="middle" fontFamily="Arial,sans-serif" fontWeight="700">جواز سفر</text>:null}
     <text x="160" y={ar?'386':'368'} fill={theme.foil} fontSize="29" textAnchor="middle" fontFamily="Georgia,serif" letterSpacing="4">PASSPORT</text>
     <path d="M144 401h32m-32-9h32" fill="none" stroke={theme.foil} strokeWidth="3" opacity=".7"/>
     <rect x="5" y="5" width="310" height="430" rx="11" stroke={theme.foil} strokeOpacity=".16" strokeWidth="2" fill="none"/>
    </svg>
   }
   {usePhoto?<div className="lm-passport-name-mask" aria-hidden="true"/>:null}
  </div>
  <figcaption className="lm-passport-caption">{usePhoto?'صورة الجواز — اسم الدولة مخفي':'نموذج تجريبي — اسم الدولة مخفي'}</figcaption>
 </figure>;
}
