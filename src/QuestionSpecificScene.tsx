import React from 'react';

/* Original question-specific vector vignettes. They illustrate a subject
   mentioned in a particular question without printing or naming its answer.
   These are NOT photos of real places, clubs, people or trademarks. */
export type SpecificScene =
 'penaltyarea'|'midline'|'handball'|'corner'|'fountain'|'carvedrocks'|
 'oldtown'|'oasis'|'mountains'|'caravan'|'roses'|'coast'|'pearldive';

const strokes={strokeLinecap:'round' as const,strokeLinejoin:'round' as const};

function Pitch({focus}:{focus:'penaltyarea'|'midline'|'corner'}){
 return <g {...strokes}>
  <rect x="49" y="49" width="342" height="184" rx="7" fill="#86c99a" stroke="#f8ffea" strokeWidth="6"/>
  <path d="M220 49v184M49 98h57v83H49M391 98h-57v83h57" fill="none" stroke="#eefef2" strokeWidth="5"/>
  <circle cx="220" cy="141" r="34" fill="none" stroke="#effbed" strokeWidth="5"/>
  {focus==='midline'?<path d="M220 51v180" stroke="#ffb56e" strokeWidth="12" strokeDasharray="12 8"/>:null}
  {focus==='penaltyarea'?<rect x="49" y="98" width="57" height="83" fill="#f5c17c" fillOpacity=".25" stroke="#ffb56e" strokeWidth="10"/>:null}
  {focus==='corner'?<>
   <path d="M49 49v51M49 49h53" stroke="#f7b467" strokeWidth="9"/>
   <path d="M49 68q18 0 18-19" fill="none" stroke="#fff7e8" strokeWidth="4"/>
   <path d="M69 57V17l31 10-31 10" fill="#f8b96f" stroke="#9a7052" strokeWidth="5"/>
   <circle cx="91" cy="91" r="16" fill="#ffffff" stroke="#3c7287" strokeWidth="4"/>
   <path d="M90 81l7 8-7 10-8-9z" fill="#43677a"/>
  </>:null}
 </g>;
}
function Handball(){
 return <g {...strokes}>
  <circle cx="147" cy="150" r="65" fill="#fffdf6" stroke="#438ba0" strokeWidth="8"/>
  <path d="M147 119l26 19-10 31h-32l-10-31Z" fill="#426e7f"/>
  <path d="M147 119v-29M173 138l26-11M163 169l17 24M131 169l-17 24M121 138l-26-11" stroke="#426e7f" strokeWidth="7"/>
  <path d="M235 215v-77q0-8 8-9 10 0 10 11v-67q0-11 9-11t9 10v50-72q0-10 9-10t9 11v75-67q0-11 9-10t9 11v72-51q1-12 11-10 10 2 9 15v70q-1 53-41 62l-36-2q-27-17-39-53l-8-33q-2-10 7-13 8-3 12 9l16 36" fill="#eab997" stroke="#b37e65" strokeWidth="7"/>
  <path d="M222 47l-12-18M340 48l15-18M358 134h24" stroke="#de9463" strokeWidth="7"/>
 </g>;
}
function Fountain(){
 return <g {...strokes}>
  <path d="M20 210q47-18 94 0t94 0t94 0t118 0v70H20Z" fill="#83c4d4"/>
  <path d="M220 208V46M217 203Q135 114 95 177M224 203Q307 114 350 177M216 199Q175 88 142 141M228 199Q267 88 302 141" fill="none" stroke="#eefefd" strokeWidth="9"/>
  <path d="M209 203q0-35 11-75 11 40 11 75" fill="#f7f6ed"/>
  <ellipse cx="220" cy="217" rx="156" ry="15" fill="#448faf"/>
  <path d="M50 226h340" stroke="#fff5dd" strokeWidth="7" opacity=".9"/>
 </g>;
}
function CarvedRocks(){
 return <g {...strokes}>
  <path d="M59 227 78 89l60-36 43 23 60-42 62 27 67 89 27 77Z" fill="#cc9878" stroke="#a87259" strokeWidth="8"/>
  <path d="M124 226 130 110l36-36 78-7 34 35-3 124Z" fill="#e9bb8c" stroke="#9e7457" strokeWidth="6"/>
  <path d="M169 223v-75l51-39 44 39v75Z" fill="#aa725b" stroke="#916654" strokeWidth="7"/>
  <path d="M188 221v-57l30-21 27 21v57" fill="#6f534a"/>
  <path d="M145 129h130M170 107h90M155 197h24M253 197h21" stroke="#fbe3b7" strokeWidth="6"/>
  <path d="M46 237h343" stroke="#ad8062" strokeWidth="9"/>
 </g>;
}
function OldTown(){
 return <g {...strokes}>
  <path d="M59 228V73h107v155M166 228V48h110v180M276 228V90h105v138" fill="#e9c59e" stroke="#986f53" strokeWidth="7"/>
  <path d="M66 95h94M173 75h96M281 112h95" stroke="#f9e6c5" strokeWidth="7"/>
  {Array.from({length:3},(_,i)=><g key={i}>
   <rect x={89+i*94} y={i===0?121:i===1?96:139} width="46" height="61" rx="6" fill="#7d6d63" stroke="#a77d61" strokeWidth="5"/>
   <path d={`M${105+i*94} ${i===0?126:i===1?101:144}v51m12-51v51`} stroke="#d4b68b" strokeWidth="5"/>
  </g>)}
  <path d="M202 228v-60q20-31 41 0v60" fill="#8a7161"/>
  <path d="M47 234h350" stroke="#ad8668" strokeWidth="10"/>
 </g>;
}
function Oasis(){
 return <g {...strokes}>
  <path d="M20 207q80-45 158 0 63-36 125 0 54-28 117-7v80H20Z" fill="#c8bb8c"/>
  <path d="M51 226q89-31 169 5 85-38 173-7" fill="none" stroke="#7bbaa6" strokeWidth="23"/>
  {[104,219,317].map((x,i)=><g key={x}>
   <path d={`M${x} ${224-i*11}q-10-65 5-118`} fill="none" stroke="#936e51" strokeWidth="12"/>
   <path d={`M${x+5} ${106-i*3}q-60-48-85 0m85 0q65-45 80 2m-80-2q-22-75-14-78m14 78q30-72 43-65`} fill="none" stroke="#4d9c73" strokeWidth="13"/>
  </g>)}
  <path d="M30 242h382" stroke="#d9c396" strokeWidth="5"/>
 </g>;
}
function Mountains(){
 return <g {...strokes}>
  <path d="M20 221 121 88l63 73 67-107 164 168Z" fill="#6ca78b"/>
  <path d="M133 222 251 54l164 168Z" fill="#4d887e"/>
  <path d="m225 95 26-41 33 45-23-7-11 15Z" fill="#e9f1e3"/>
  <path d="m96 120 25-32 30 36-19-7-10 15Z" fill="#d8eee8"/>
  <path d="M27 229q75-29 152 0t145 0t89 0" fill="none" stroke="#9acb9b" strokeWidth="12"/>
  {[76,113,332,365].map((x,i)=><path key={x} d={`M${x} 230v-34m-19 10 19-26 19 26`} fill="none" stroke="#317c70" strokeWidth="8"/>)}
  <path d="M72 52h68M300 47h63" stroke="#fffaf1" strokeWidth="14" opacity=".9"/>
 </g>;
}
function Roses(){
 return <g {...strokes}>
  {[110,220,330].map((x,i)=><g key={x}>
   <path d={`M${x} 232v-99`} stroke="#4c9479" strokeWidth="11"/>
   <path d={`M${x} 193q-37-33-55-16 24 37 55 25M${x} 171q34-25 54-17-24 30-54 29`} fill="#82b995" stroke="#4c9479" strokeWidth="5"/>
   {[0,72,144,216,288].map(deg=><ellipse key={deg} cx={x} cy={103+i%2*8} rx="18" ry="39" fill="#f3a5b5" stroke="#b87c8f" strokeWidth="4" transform={`rotate(${deg} ${x} ${111+i%2*8})`}/>)}
   <circle cx={x} cy={111+i%2*8} r="18" fill="#f7d4aa"/>
  </g>)}
 </g>;
}
function Coast(){
 return <g {...strokes}>
  <path d="M0 177q57-23 113 0t110 0t110 0t107 0v103H0Z" fill="#82c9d5"/>
  <path d="M25 209q45-19 91 0t91 0t91 0t107 0" fill="none" stroke="#e4f6ee" strokeWidth="7"/>
  <path d="M67 147h292M92 147V88h41v59m29 0V61h40v86m33 0v-44h42v44m27 0V83h38v64" fill="#b4d4ce" stroke="#628b93" strokeWidth="6"/>
  <path d="M153 189h155l-28 33h-92Z" fill="#e7a673" stroke="#9b6e59" strokeWidth="6"/>
  <path d="M238 189V95l-58 81h58Z" fill="#fff5db" stroke="#8ba5a0" strokeWidth="6"/>
 </g>;
}
function PearlDive(){
 return <g {...strokes}>
  <path d="M20 226q75-33 150 0t134 0t116 0" fill="none" stroke="#80bfd0" strokeWidth="16"/>
  <path d="M105 222q48-80 98 0-45 39-98 0Z" fill="#e8c5a0" stroke="#ac866b" strokeWidth="7"/>
  <path d="M110 220q46-22 90 0" fill="none" stroke="#a48067" strokeWidth="6"/>
  <circle cx="153" cy="202" r="18" fill="#fffde2" stroke="#cabda5" strokeWidth="5"/>
  <circle cx="299" cy="91" r="17" fill="#f1bf95"/>
  <path d="M283 115q-31 20-26 46l47 24 44-23m-57-24-38-12m64 18 34-25M304 184l-31 30" fill="none" stroke="#f1bf95" strokeWidth="16"/>
  <path d="M285 89h29M301 73v-14" stroke="#57859c" strokeWidth="9"/>
  {[1,2,3,4].map(i=><circle key={i} cx={338+(i%2)*22} cy={60+i*22} r={3+i} fill="#edf8f7" opacity=".75"/>)}
 </g>;
}
function Caravan(){
 return <g {...strokes}>
  <path d="M15 219q105-80 215-17 72-48 199-1v79H15Z" fill="#e2bb81"/>
  <path d="M30 233q106-59 201-10t179-8" fill="none" stroke="#b68c64" strokeWidth="9" strokeDasharray="21 19"/>
  {[100,217,320].map((x,i)=><g key={x}>
   <path d={`M${x-27} ${200+i*4}l1-30 12-16 13 17 17-1 9 20 11 2-3 15h-65Z`} fill="#9e7758" stroke="#8a6a58" strokeWidth="6"/>
   <path d={`M${x-23} ${204+i*4}v21m40-21v21`} stroke="#8a6a58" strokeWidth="8"/>
  </g>)}
 </g>;
}
export default function QuestionSpecificScene({variant}:{variant:SpecificScene}){
 switch(variant){
  case 'penaltyarea':case 'midline':case 'corner':return <Pitch focus={variant}/>;
  case 'handball':return <Handball/>;
  case 'fountain':return <Fountain/>;
  case 'carvedrocks':return <CarvedRocks/>;
  case 'oldtown':return <OldTown/>;
  case 'oasis':return <Oasis/>;
  case 'mountains':return <Mountains/>;
  case 'caravan':return <Caravan/>;
  case 'roses':return <Roses/>;
  case 'coast':return <Coast/>;
  case 'pearldive':return <PearlDive/>;
 }
}
