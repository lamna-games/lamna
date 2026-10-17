import React from 'react';
import './CartoonCover.css';
import LamnaCoverArt from './LamnaCoverArt';
import ExpansionCoverArt from './ExpansionCoverArt';
import RealWorldCoverArt from './RealWorldCoverArt';
import RealWorldCoverScenes from './RealWorldCoverScenes';
import RealWorldCoverFinish from './RealWorldCoverFinish';
import {LAMNA_OFFICIAL_LOGO} from './brandLogo';

type CoverProps = { i: number; title: string };
const palettes = [
  ['#cce9ff','#e5f5ff','#ed7457'], ['#cfe6ff','#f3f8ff','#ffffff'],
  ['#d3f1fa','#e6f9fb','#4bc2d6'], ['#d8e6ff','#f3ebff','#7855a9'],
  ['#d9f5d8','#f0ffdf','#18884f'], ['#e9ddff','#f9e8ff','#a65bdd'],
  ['#ffe6c6','#fff3df','#a97040'], ['#c9e9f8','#edf9ff','#3e8ea1'],
  ['#fce5d8','#fff5eb','#d47942'], ['#ddd8fb','#f2ecff','#8660c3'],
  ['#def5e2','#f7ffed','#087c51'], ['#e4eafe','#fff','#3b77b9'],
  ['#cdeef5','#ebfdff','#248eae'], ['#f8ddf0','#fff0f8','#d35c95'],
  ['#dbf8df','#ffe9e7','#32a676'], ['#fff0d2','#fff8e6','#c78234'],
  ['#dcedff','#eef6ff','#4267ac'], ['#fff0dd','#fff9eb','#ce8749'],
  ['#e0e8ff','#f3efff','#4c67b3'], ['#ffe5cc','#fff7dd','#ff9145']
];
function Star({x,y,r=7,color='#ffb53e'}:{x:number;y:number;r?:number;color?:string}){
  return <path d={`M ${x} ${y-r*1.5} Q ${x+2} ${y-2} ${x+r} ${y} Q ${x+2} ${y+2} ${x} ${y+r*1.5} Q ${x-2} ${y+2} ${x-r} ${y} Q ${x-2} ${y-2} ${x} ${y-r*1.5}Z`} fill={color}/>;
}
function Person({shirt='#ffffff',pose='think',hair=true,hat=false}:{shirt?:string;pose?:'think'|'quiet'|'point'|'cheer';hair?:boolean;hat?:boolean}){
 return <g stroke="#263141" strokeWidth="5.5" strokeLinejoin="round" strokeLinecap="round">
   <path d="M108 350 Q110 259 168 251 L230 251 Q296 263 304 350Z" fill={shirt}/>
   <path d="M152 267 L130 328 M248 267 L270 328" fill="none" stroke="#263141" strokeWidth="4" opacity=".35"/>
   <rect x="179" y="224" width="42" height="49" rx="14" fill="#e69e79"/>
   <ellipse cx="150" cy="175" rx="13" ry="21" fill="#f0ad89"/>
   <ellipse cx="251" cy="175" rx="13" ry="21" fill="#f0ad89"/>
   <path d="M152 147 Q153 105 201 105 Q249 105 249 146 L247 199 Q245 245 200 250 Q155 245 153 199Z" fill="#ffbd94"/>
   {hair && !hat && <path d="M153 157 Q140 94 186 99 Q197 83 215 96 Q259 91 250 156 Q237 136 230 126 Q209 145 170 133Z" fill="#2b313a"/>}
   {hat && <g><path d="M148 125 Q154 87 197 86 Q251 88 254 126Z" fill="#ec865a"/><path d="M139 126 Q204 115 263 129 L252 141 L148 141Z" fill="#ee9c6d"/></g>}
   <path d="M174 179 l11 0 M215 179 l11 0" stroke="#29343d" strokeWidth="6"/>
   <path d="M190 206 Q202 215 214 205" stroke="#7f493c" strokeWidth="3" fill="none"/>
   {pose==='quiet' ? <g><path d="M177 339 Q169 301 185 260 L196 207 Q195 182 208 182 Q220 185 215 205 L216 252 Q250 263 244 298 L225 350Z" fill="#ffbd94"/><path d="M207 190 L207 264" strokeWidth="7"/></g>
   :pose==='cheer' ? <g><path d="M111 284 L76 231 L61 184 Q48 168 58 158 Q70 151 78 172 L93 214 L152 264" fill="#ffbd94"/><path d="M284 284 L327 221 L344 174 Q354 159 363 169 Q368 176 359 192 L348 238 L250 270" fill="#ffbd94"/></g>
   :pose==='point' ? <g><path d="M166 340 L160 287 Q144 262 158 245 L196 213 Q204 207 213 218 L213 232 L190 264 L199 340Z" fill="#ffbd94"/><path d="M209 220 L240 196" fill="none"/></g>
   : <g><path d="M176 344 L177 304 Q156 278 168 257 L189 231 Q202 220 213 232 L222 245 L206 267 L208 344Z" fill="#ffbd94"/><path d="M192 238 L204 224" strokeWidth="4"/></g>}
 </g>;
}
function FilmReel({x=290,y=148}:{x?:number;y?:number}) {return <g transform={`translate(${x} ${y})`}><circle r="50" fill="#404551" stroke="#283344" strokeWidth="6"/><circle r="13" fill="#b6d5e9"/>{[0,72,144,216,288].map(v=><ellipse key={v} cx="0" cy="-30" rx="11" ry="15" fill="#c8e7f5" transform={`rotate(${v})`}/>)}</g>;}
function Ball({x=100,y=245,r=37}:{x?:number;y?:number;r?:number}){return <g><circle cx={x} cy={y} r={r} fill="white" stroke="#283344" strokeWidth="5"/><path d={`M${x-14} ${y-7} l14 -11 14 11 -5 17 -18 0Z`} fill="#273344"/><path d={`M${x-r+5} ${y-16} l16 10 M${x+r-5} ${y-16} l-16 10 M${x-20} ${y+r-4} l9 -19 M${x+20} ${y+r-4} l-9 -19`} fill="none" stroke="#273344" strokeWidth="5"/></g>;}
function SceneExtras({i}:{i:number}){
 switch(i){
  case 0: return <g><path d="M31 225 q43 -17 74 2 v85 q-37 -19 -74 -4Z M105 227 q39 -16 65 4 v81 q-35 -18 -65 0Z" fill="#ffffff" stroke="#3a6589" strokeWidth="5"/><path d="M50 247 h40 m-40 16 h39 m30 -17 h37" stroke="#a6c9db" strokeWidth="4"/><circle cx="301" cy="140" r="33" fill="#ffdb75" stroke="#ca8d28" strokeWidth="5"/><path d="M291 165 h20 v17 h-20Z M299 94 v-16 m-48 58 -13 -6 m103 5 14 -8" stroke="#ba802c" strokeWidth="6" fill="none"/><Star x={321} y={240} r={11}/></g>;
  case 1: return <g><FilmReel x={314} y={204}/><g transform="translate(48 219) rotate(-12)"><rect width="106" height="91" rx="7" fill="#313b49"/><rect x="0" y="-14" width="106" height="27" rx="5" fill="#313b49"/><path d="M17 -14 l-13 27 M51 -14 L37 13 M88 -14 L74 13" stroke="white" strokeWidth="15"/></g><path d="M326 280 l-28 36 -29 -41" fill="#ffe0b2" stroke="#a95041" strokeWidth="5"/><Star x={57} y={103} r={9} /></g>;
  case 2: return <g><circle cx="95" cy="180" r="74" fill="#c2f0fa" fillOpacity=".8" stroke="#345d83" strokeWidth="13"/><circle cx="95" cy="180" r="40" fill="#fff" stroke="#345d83" strokeWidth="6"/><circle cx="95" cy="180" r="18" fill="#359dbb"/><circle cx="95" cy="180" r="8" fill="#162a48"/><path d="M141 237 l46 55" stroke="#345d83" strokeWidth="18" strokeLinecap="round"/><path d="M296 98 l22 -12 20 13 -5 28 -23 5 -15 -16Z" fill="#ffcd70" stroke="#345d83" strokeWidth="4"/></g>;
  case 3: return <g><FilmReel x={315} y={155}/><g transform="translate(38 213) rotate(-12)"><rect width="104" height="72" fill="#37404a" rx="8"/><path d="M0 0 h104 v19 H0Z" fill="white"/><path d="M10 0 L25 19 M43 0 L58 19 M78 0 L91 19" stroke="#37404a" strokeWidth="12"/></g><path d="M279 286 h75 l-10 66 h-54Z" fill="#f05f52" stroke="#293344" strokeWidth="5"/><path d="M304 285 v67 M330 285 v67" stroke="white" strokeWidth="11"/><circle cx="310" cy="274" r="18" fill="#fff1b9"/><circle cx="334" cy="273" r="20" fill="#fff1b9"/></g>;
  case 4: return <g><Ball x={91} y={292} r={45}/><path d="M283 160 h81 v146 h-81Z" fill="none" stroke="#429a79" strokeWidth="9"/><path d="M283 195 h81 M283 238 h81 M310 160 v146 M340 160 v146" stroke="#8dc2ab" strokeWidth="3"/><path d="M289 102 q27 -35 58 0" fill="none" stroke="#ffb63e" strokeWidth="9"/><Star x={332} y={113} r={11} color="#ffbd50"/></g>;
  case 5: return <g><g transform="translate(75 205) rotate(-17)"><rect x="-10" y="30" width="21" height="102" rx="10" fill="#42465e"/><ellipse cx="0" cy="17" rx="27" ry="37" fill="#a068be" stroke="#343048" strokeWidth="6"/><path d="M-15 6 h30 m-30 14 h30" stroke="#edd9f6" strokeWidth="4"/></g><path d="M281 159 q-14 -59 18 -71 l3 83 -20 5Z M325 201 q-16 -55 17 -72 l1 67-18 8Z" fill="#7945b5"/><circle cx="277" cy="187" r="16" fill="#7945b5"/><circle cx="319" cy="211" r="16" fill="#7945b5"/><Star x={343} y={98}/></g>;
  case 6: return <g><path d="M20 222 q75 -28 108 6 v88 q-53 -28 -108 0Z" fill="#faf5e2" stroke="#8e6f4a" strokeWidth="6"/><path d="M39 248 h59 m-61 18 h60 m-60 17 h45" stroke="#ba986e" strokeWidth="5"/><path d="M299 122 v85 M278 145 h42 l-5 47 h-34Z" fill="#ffdc99" stroke="#957247" strokeWidth="6"/><circle cx="299" cy="171" r="12" fill="#ffe870"/><path d="M272 129 l27 -25 26 25" fill="none" stroke="#957247" strokeWidth="6"/></g>;
  case 7: return <g><rect x="270" y="84" width="93" height="133" rx="14" fill="#fff" stroke="#327f9e" strokeWidth="6"/><circle cx="317" cy="131" r="24" fill="#a1d0e4"/><path d="M276 192 q12 -44 42 -44 q34 3 38 44" fill="#639eb7"/><path d="M51 118 h88 v73 H51Z" fill="#f5fdff" stroke="#4b8ca7" strokeWidth="6"/><text x="95" y="174" textAnchor="middle" fontSize="57" fontWeight="900" fill="#4b8ca7">؟</text><Star x={331} y={246}/></g>;
  case 8: return <g><rect x="28" y="196" width="118" height="118" rx="14" fill="white" stroke="#7f86b4" strokeWidth="6"/><path d="M29 235 h117" stroke="#fb945d" strokeWidth="22"/><path d="M57 185 v29 M120 185 v29" stroke="#404b70" strokeWidth="9"/><path d="M54 263 h65 m-65 22 h35" stroke="#aab2d2" strokeWidth="7"/><path d="M278 133 h84 m-25 -22 25 22 -25 22" fill="none" stroke="#eb925f" strokeWidth="11" strokeLinecap="round"/><circle cx="313" cy="257" r="35" fill="#ffe4b9" stroke="#df9144" strokeWidth="5"/></g>;
  case 9: return <g><path d="M50 178 l72 -26 25 72 -72 25Z" fill="#f2cf74" stroke="#67538f" strokeWidth="6"/><path d="M55 270 l55 -25 27 57 -57 25Z" fill="#91a5f0" stroke="#67538f" strokeWidth="6"/><text x="309" y="200" fontSize="96" fontWeight="900" textAnchor="middle" fill="#7954c0">؟</text><Star x={305} y={94}/></g>;
  case 10: return <g><path d="M275 145 h88 v67 h-88Z" fill="#14874c" stroke="#2b6550" strokeWidth="5"/><path d="M275 140 v126" stroke="#716354" strokeWidth="7"/><path d="M297 170 q18 -10 38 0" fill="none" stroke="white" strokeWidth="5"/><path d="M41 311 V233 M45 245 Q10 226 22 202 Q50 198 51 236 M45 245 Q70 196 99 211 Q85 239 45 245 M46 240 Q43 194 64 185 Q82 218 46 240" stroke="#207e50" strokeWidth="7" fill="#56b671"/><path d="M22 317 h82" stroke="#bfa46c" strokeWidth="7"/><Star x={323} y={103}/></g>;
  case 11: return <g><circle cx="97" cy="227" r="66" fill="#8ad4f1" stroke="#3d7bb4" strokeWidth="7"/><path d="M67 182 l23 15 -4 23 26 -2 14 28 -24 34 -23 -19 -13 -33 -19 -6Z" fill="#48a37a"/><path d="M95 162 q-30 60 2 130 M35 225 h126" stroke="#ebfaff" strokeWidth="4" fill="none"/><path d="M280 108 v104 M282 109 h71 v43 h-71Z" stroke="#40567c" strokeWidth="6" fill="white"/><path d="M282 109 h25 v43 h-25Z" fill="#ff6363"/><path d="M331 109 v43" stroke="#ff6363" strokeWidth="11"/></g>;
  case 12: return <g><path d="M34 174 h55 q-5 29 16 29 q21 0 16 -29 h38 v54 q-29 -6 -29 17 q0 20 29 17 v43 h-55 q6 -30 -15 -30 q-19 0 -15 30 H34Z" fill="#52b9cf" stroke="#2e7d94" strokeWidth="6"/><path d="M285 150 h73 v73 h-25 q-12 -20 -25 0 h-23Z" fill="none" stroke="#3d90aa" strokeDasharray="9 8" strokeWidth="7"/><text x="320" y="205" fontSize="58" fontWeight="900" textAnchor="middle" fill="#328fad">؟</text></g>;
  case 13: return <g><rect x="35" y="157" width="98" height="103" rx="17" fill="#fff" stroke="#cd6f9f" strokeWidth="6"/><path d="M58 231 l25 -53 26 53Z" fill="#ee946c"/><circle cx="90" cy="223" r="17" fill="#8d78ca"/><rect x="287" y="146" width="72" height="72" rx="17" fill="#fff" stroke="#c676a4" strokeWidth="5"/><circle cx="324" cy="180" r="21" fill="#55bcb1"/><path d="M284 264 h76" stroke="#d46ea4" strokeWidth="7"/><Star x={330} y={110} color="#d878ad"/></g>;
  case 14: return <g><circle cx="91" cy="218" r="54" fill="#55bc83" stroke="#2e8f69" strokeWidth="6"/><path d="M65 220 l16 17 31 -37" fill="none" stroke="white" strokeWidth="13"/><circle cx="316" cy="205" r="55" fill="#f3817a" stroke="#cd5b62" strokeWidth="6"/><path d="M292 181 l48 48 M339 181 l-48 48" stroke="white" strokeWidth="12"/><Star x={317} y={93}/></g>;
  case 15: return <g><path d="M42 264 q0 -34 45 -34 q45 0 45 34Z" fill="#e9a84f" stroke="#7f5538" strokeWidth="5"/><path d="M38 265 h99 v15 H38Z" fill="#6ab565" stroke="#7f5538" strokeWidth="4"/><path d="M49 284 h78 v12 H49Z" fill="#e96e56"/><path d="M40 302 h93" stroke="#d99454" strokeWidth="16" strokeLinecap="round"/><path d="M284 143 q-13 -48 20 -49 q18 -24 39 2 q28 0 16 46Z" fill="white" stroke="#576378" strokeWidth="6"/><rect x="289" y="137" width="64" height="20" rx="3" fill="white" stroke="#576378" strokeWidth="5"/><path d="M294 218 l51 0" stroke="#e1a65c" strokeWidth="9"/></g>;
  case 16: return <g><g transform="translate(53 188) rotate(-12)"><rect width="107" height="120" rx="7" fill="white" stroke="#5382c0" strokeWidth="6"/><rect x="11" y="11" width="85" height="78" rx="2" fill="#93c9e9"/><circle cx="42" cy="42" r="16" fill="#f4d071"/><path d="M14 89 l30 -34 22 18 17 -21 13 37" fill="#579b87"/></g><g transform="translate(286 124) rotate(9)"><rect width="79" height="96" rx="5" fill="white" stroke="#5382c0" strokeWidth="5"/><rect x="9" y="9" width="60" height="59" fill="#ffd1ba"/><path d="M13 63 l21 -30 30 30" fill="#d67798"/></g><Star x={314} y={271}/></g>;
  case 17: return <g><path d="M31 216 q50 -19 99 0 v104 q-51 -22 -99 0Z" fill="white" stroke="#bd8c59" strokeWidth="6"/><path d="M55 240 h60 m-60 19 h45 m-45 20 h49" stroke="#cfb39b" strokeWidth="5"/><path d="M304 129 l33 24 -66 110 -26 18 4 -31Z" fill="#f4ba63" stroke="#785c49" strokeWidth="6"/><path d="M273 260 l-24 -10 -4 31Z" fill="#34323d"/><circle cx="331" cy="252" r="9" fill="#f4a765"/><circle cx="348" cy="255" r="9" fill="#f4a765"/></g>;
  case 18: return <g><circle cx="77" cy="252" r="48" fill="#f2a65a" stroke="#865740" strokeWidth="6"/><path d="M30 252 h94 M77 205 v94 M43 221 q34 26 67 63 M110 223 q-41 20 -64 62" stroke="#865740" strokeWidth="4" fill="none"/><path d="M300 158 h54 v39 q-10 30 -27 36 -22 -7 -27 -36Z" fill="#f8d26f" stroke="#b88b3e" strokeWidth="6"/><path d="M301 169 h-18 q0 34 23 37 M352 169 h17 q0 34 -22 37" fill="none" stroke="#b88b3e" strokeWidth="7"/><path d="M327 234 v25 m-25 6 h51" stroke="#b88b3e" strokeWidth="9"/></g>;
  case 19: return <g><circle cx="92" cy="230" r="62" fill="#f6fbff" stroke="#557f99" strokeWidth="9"/><path d="M92 230 v-37 M92 230 l27 13" stroke="#e67c53" strokeWidth="9" strokeLinecap="round"/><path d="M70 160 h44 M92 155 v-12" stroke="#557f99" strokeWidth="10"/><path d="M322 98 l-43 78 h39 l-24 67 65 -92 h-41 l25 -53Z" fill="#ffc74e" stroke="#e6a031" strokeWidth="5"/><path d="M38 326 h80 m-67 -16 h48" stroke="#76c4db" strokeWidth="7"/></g>;
  default: return null;
 }
}
function FeaturedArt({i}:{i:number}){
 const dark = '#25354b';
 switch (i) {
  case 2: return <g strokeLinecap="round" strokeLinejoin="round">
   <circle cx="190" cy="158" r="92" fill="#dcf9ff" stroke="#377eae" strokeWidth="18"/>
   <circle cx="190" cy="158" r="71" fill="#b7e6f7" stroke="#ffffff" strokeWidth="5"/>
   <path d="M249 225 L326 304" stroke="#377eae" strokeWidth="29" strokeLinecap="round"/>
   <path d="M169 185 Q150 161 160 135 Q180 100 212 115 Q236 134 215 163Z" fill="#ffb252" stroke="#9b6c39" strokeWidth="6"/>
   <circle cx="190" cy="145" r="11" fill="#fff9dd"/>
   <path d="M122 104 Q141 82 160 83" stroke="#fff" strokeWidth="8" fill="none"/>
   <Star x={318} y={103} r={18}/>
   <Star x={78} y={234} r={12} color="#41b7db"/>
  </g>;
  case 8: return <g strokeLinecap="round" strokeLinejoin="round">
   {[0,1,2].map((n)=> <g key={n} transform={`translate(${32+n*116},${122+(n%2)*20})`}>
    <rect width="100" height="122" rx="14" fill="#fff" stroke="#7279a8" strokeWidth="6"/>
    <path d="M5 33 H95" stroke="#f48c6b" strokeWidth="23"/>
    <path d="M21 6 V32 M78 6 V32" stroke="#485c79" strokeWidth="8"/>
    <text x="50" y="95" textAnchor="middle" fontSize="44" fontWeight="900" fill="#455779">{n+1}</text>
   </g>)}
   <path d="M133 279 h27 l-10 -10 M248 279 h27 l-10 -10" fill="none" stroke="#d78261" strokeWidth="7"/>
   <Star x={304} y={85} r={15}/>
  </g>;
  case 9: return <g stroke="#665898" strokeWidth="6" strokeLinejoin="round">
   <path d="M95 99 h93 v30 q-10 -5 -18 4 q-13 19 6 27 h12 v37 h-44 q8 10 3 22 q-7 18 -26 7 q-7 -6 -5 -19 H95Z" fill="#f7c76d"/>
   <path d="M194 99 h99 v95 h-34 q6 -10 -4 -19 q-18 -15 -26 6 q-3 7 0 13 h-35 v-38 q-12 6 -22 -5 q-11 -18 10 -26 h12Z" fill="#acb2f0"/>
   <path d="M95 204 h44 q-7 11 -2 20 q10 15 23 4 q8 -7 5 -24 h29 v47 q11 -7 21 0 q15 14 0 29 q-7 6 -21 0 v17 H95Z" fill="#8bd3be"/>
   <path d="M200 204 h30 q-3 -13 7 -21 q13 -10 23 2 q5 7 0 19 h33 v93 h-93 v-19 q18 6 24 -11 q4 -17 -24 -18Z" fill="#f28b96"/>
   <Star x={327} y={88} r={16}/>
  </g>;
  case 11: return <g>
   <circle cx="200" cy="176" r="107" fill="#80d3f2" stroke="#326eb1" strokeWidth="8"/>
   <path d="M125 112 l25 -19 41 8 10 33 -29 25 1 36 -28 4 -23 -47Z M218 99 l42 10 13 24 -18 17 16 28 -35 9 -16 -25 -24 -19Z M170 214 l34 -9 19 16 -8 38 -20 24 -26 -19Z" fill="#53b983"/>
   <ellipse cx="200" cy="176" rx="51" ry="107" fill="none" stroke="#d9ffff" strokeWidth="4" opacity=".75"/>
   <path d="M96 176 H307" stroke="#d9ffff" strokeWidth="4" opacity=".7"/>
   <g stroke="#374960" strokeWidth="4"><path d="M77 92 v58 M79 93 h73 v37 h-73Z" fill="#fff"/><path d="M79 93 h26 v37 h-26Z" fill="#e86e65"/><path d="M300 230 v65 M300 231 h73 v37 h-73Z" fill="#f5fafb"/><path d="M328 231 v37" stroke="#db695d" strokeWidth="13"/></g>
   <Star x={321} y={98} r={14}/>
  </g>;
  case 12: return <g strokeLinejoin="round" strokeWidth="7">
   <path d="M73 105 h98 v40 q-13 -8 -27 1 q-16 17 0 32 q9 7 27 0 v38 h-35 q7 15 -2 27 q-18 17 -33 -2 q-5 -9 -1 -25 H73Z" fill="#ffce70" stroke="#997245"/>
   <path d="M180 105 h95 v37 q-15 -5 -26 4 q-11 17 2 29 q8 8 24 3 v38 h-37 q5 12 -3 23 q-13 13 -27 2 q-8 -10 -3 -25 h-25Z" fill="#65c5b6" stroke="#387e91" transform="translate(18 22)"/>
   <rect x="264" y="235" width="71" height="62" rx="11" fill="none" stroke="#447d9f" strokeDasharray="9 8"/>
   <text x="300" y="282" textAnchor="middle" fontWeight="900" fontSize="55" fill="#447d9f" stroke="none">؟</text>
   <Star x={330} y={92} r={14}/>
  </g>;
  case 13: return <g strokeWidth="6" strokeLinejoin="round">
   <rect x="35" y="133" width="110" height="118" rx="20" fill="#fff" stroke="#b566a2"/>
   <circle cx="90" cy="188" r="31" fill="#e77f9f"/>
   <rect x="145" y="96" width="111" height="134" rx="20" fill="#fff" stroke="#876cac"/>
   <path d="M168 193 l33 -67 32 67Z" fill="#765eb7" stroke="#765eb7"/>
   <rect x="254" y="137" width="110" height="116" rx="20" fill="#fff" stroke="#bf74a1"/>
   <path d="M307 160 q34 0 34 31 q0 34 -34 34 q-32 0 -32 -34 q0 -31 32 -31Z" fill="#60b9bd"/>
   <path d="M308 171 v41 M287 192 h42" stroke="white" strokeWidth="8"/>
   <Star x={323} y={94} r={12} color="#e48ca9"/>
  </g>;
  case 14: return <g strokeWidth="7" strokeLinejoin="round">
   <rect x="28" y="107" width="158" height="170" rx="26" fill="#e0f7e8" stroke="#369f79"/>
   <path d="M69 190 l35 33 59 -76" fill="none" stroke="#21a774" strokeWidth="21" strokeLinecap="round"/>
   <rect x="214" y="107" width="158" height="170" rx="26" fill="#ffe9e7" stroke="#d76b70"/>
   <path d="M254 153 l77 77 M332 153 l-77 77" fill="none" stroke="#e16a69" strokeWidth="19" strokeLinecap="round"/>
   <Star x={196} y={70} r={15}/>
  </g>;
  case 16: return <g strokeLinejoin="round">
   <g transform="translate(76 88) rotate(-13 95 125)"><rect x="0" y="0" width="155" height="207" rx="14" fill="white" stroke="#4b75a4" strokeWidth="7"/><rect x="12" y="13" width="132" height="142" rx="5" fill="#acd5ea"/><path d="M18 154 l46 -62 33 35 23 -22 23 49Z" fill="#64b899"/><circle cx="52" cy="51" r="18" fill="#ffce76"/></g>
   <g transform="translate(177 76) rotate(14 95 125)"><rect x="0" y="0" width="155" height="207" rx="14" fill="white" stroke="#4b75a4" strokeWidth="7"/><rect x="12" y="13" width="132" height="142" rx="5" fill="#eabdcf"/><path d="M18 154 l46 -62 33 35 23 -22 23 49Z" fill="#9871b0"/><circle cx="52" cy="51" r="18" fill="#ffcf77"/></g>
   <Star x={86} y={76} r={12}/>
  </g>;
  case 18: return <g stroke="#596277" strokeWidth="7" strokeLinejoin="round">
   <path d="M148 97 h108 v74 q-4 68 -54 77 q-50 -12 -54 -77Z" fill="#ffd36a"/>
   <path d="M150 115 h-39 q0 75 51 74 M254 115 h40 q0 75 -52 74" fill="none" stroke="#daa248" strokeWidth="13"/>
   <path d="M201 243 v31 M156 279 H246" stroke="#daa248" strokeWidth="12"/>
   <Ball x={102} y={253} r={44}/>
   <circle cx="315" cy="242" r="45" fill="#eb9e5f" stroke="#81513c"/>
   <path d="M270 242 h90 M315 197 v90 M285 210 q45 34 62 64 M346 210 q-45 34 -61 64" fill="none" stroke="#8f5d48" strokeWidth="4"/>
   <Star x={302} y={82} r={13} color="#ffe16c"/>
  </g>;
  case 19: return <g strokeLinecap="round" strokeLinejoin="round">
   <circle cx="177" cy="184" r="107" fill="#fffdf1" stroke="#567c9a" strokeWidth="14"/>
   <circle cx="177" cy="184" r="75" fill="#eaf8ff" stroke="#c2ddea" strokeWidth="5"/>
   <path d="M176 184 L176 126 M176 184 L222 204" stroke="#e77755" strokeWidth="13"/>
   <path d="M155 58 h44 M176 55 v20" stroke="#567c9a" strokeWidth="16"/>
   <path d="M281 84 l-43 95 h42 l-29 98 106 -128 h-53 l35 -65Z" fill="#ffd059" stroke="#e2a039" strokeWidth="7"/>
   <path d="M55 288 h85 M76 310 h56" stroke="#60c0d1" strokeWidth="9"/>
  </g>;
  default: return null;
 }
}

const photorealSubjectCovers=new Set([4,10,11,15,25,26,30,31,33,34,48,49]);
const classicSubjectCovers=new Set([0,2,3,5,6,7,8,9,12,13,14,16,17,18,19]);
const finishingSubjectCovers=new Set([23,24,37,38,43]);

export default function CartoonCover({i,title}:CoverProps){
 const featured = [2,8,9,11,12,13,14,16,18,19].includes(i);
 const p = palettes[i%palettes.length];
 return <div className="lamna-cover" role="img" aria-label={`غلاف لعبة ${title}`}>
   <div className="lamna-cover-picture">
    <svg viewBox="0 0 400 350" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
     <defs>
      <linearGradient id={`lamna-newsky-${i}`} x1="0" x2="1" y1="0" y2="1">
       <stop stopColor="#bde9ff"/><stop offset=".55" stopColor="#def4ff"/><stop offset="1" stopColor="#b6e1fa"/>
      </linearGradient>
      <radialGradient id={`lamna-sunglow-${i}`}>
       <stop stopColor="#fffbe1" stopOpacity=".95"/><stop offset="1" stopColor="#fff0bd" stopOpacity="0"/>
      </radialGradient>
     </defs>
     <rect width="400" height="350" fill={`url(#lamna-newsky-${i})`}/>
     <circle cx="303" cy="69" r="87" fill={`url(#lamna-sunglow-${i})`}/>
     <circle cx="320" cy="61" r="32" fill="#ffdb65" opacity=".95"/>
     <path d="M30 80q5-18 25-15 9-23 32-15 18-5 28 19 26-2 31 13zM257 120q8-17 25-14 11-22 31-14 17-4 28 17 16 0 21 13z" fill="#ffffff" opacity=".85"/>
     <circle cx="47" cy="15" r="118" fill="#fff" opacity=".12"/>
     <path d="M-30 323Q85 272 160 310q112-71 265-13v80H-30Z" fill={i%3===0?"#9bdcc0":i%3===1?"#c5e8ce":"#c0e9ed"} opacity=".52"/>
     <path d="M-20 338q81-40 141-11 71-38 146-8 77-22 155-7v44H-20Z" fill="#79c2a8" opacity=".42"/>
     {photorealSubjectCovers.has(i)?<RealWorldCoverArt i={i}/>:classicSubjectCovers.has(i)?<RealWorldCoverScenes i={i}/>:finishingSubjectCovers.has(i)?<RealWorldCoverFinish i={i}/>:i>=20?<ExpansionCoverArt i={i}/>:featured?<FeaturedArt i={i}/>:<LamnaCoverArt i={i}/>}
    </svg>
    <span className="lamna-cover-info" aria-hidden="true">i</span>
    <span className="lamna-cover-symbol" aria-hidden="true">
      <img src={LAMNA_OFFICIAL_LOGO} alt="" loading="lazy" draggable={false}/>
    </span>
   </div>
   <div className="lamna-cover-label"><strong>{title}</strong></div>
 </div>;
}
