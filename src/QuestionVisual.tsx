import React from 'react';
import {
 Globe2, Compass, MapPinned, Landmark, Building2, Plane, Wallet, Ticket,
 Trophy, Goal, Dumbbell, Clapperboard, Film, Drama, Music2, Mic2,
 UtensilsCrossed, Coffee, BookOpen, ScrollText, MoonStar, History,
 Microscope, Atom, Rocket, HeartPulse, Waves, Fish, Mountain, Flag,
 Smartphone, Laptop, Gamepad2, Lightbulb, Calculator, Clock3, Puzzle,
 PawPrint, Camera, TreePalm, Languages, Sparkles, Users, PenLine
} from 'lucide-react';
import type {LucideIcon} from 'lucide-react';
import {getQuestionVisualTheme} from './questionVisualTheme.mjs';
import QuestionSpecificScene, {type SpecificScene} from './QuestionSpecificScene';
import FlagQuestion from './FlagQuestion';
import './questionVisual.css';

/**
 * In-question illustrations, NOT the QR-only secret image.
 * They are original, contextual SVG compositions: they must NEVER claim to be
 * photographic or show a specific answer that is supposed to be guessed.
 * Real, licensed question photographs can be added to a curated content
 * manifest later; no third-party artwork is scraped or embedded here.
 */
export type VisualTheme =
 'globe'|'landmark'|'city'|'travel'|'money'|'football'|'sport'|'film'|
 'music'|'food'|'faith'|'history'|'science'|'space'|'health'|'sea'|
 'technology'|'gaming'|'language'|'nature'|'math'|'ideas'|'drama'|'camera'|SpecificScene;

export const visualThemes:Record<VisualTheme,{label:string;icon:LucideIcon;colors:[string,string,string]}>={
 globe:{label:'العالم والجغرافيا',icon:Globe2,colors:['#caeef0','#83cad6','#1a8199']},
 landmark:{label:'المعالم والتراث',icon:Landmark,colors:['#fff0ca','#ebb978','#af6b43']},
 city:{label:'المدن والعمران',icon:Building2,colors:['#e2f2f9','#a6d6e8','#548dab']},
 travel:{label:'السفر والرحلات',icon:Plane,colors:['#d6eef9','#94cde5','#3988b2']},
 money:{label:'العملات والاقتصاد',icon:Wallet,colors:['#e6f4d9','#b0d29f','#4b936d']},
 football:{label:'كرة القدم',icon:Goal,colors:['#dbf4e9','#9ad1ae','#328e68']},
 sport:{label:'الرياضة',icon:Trophy,colors:['#fef1d9','#ffcc8b','#be824b']},
 film:{label:'السينما والأفلام',icon:Clapperboard,colors:['#eae6fd','#b8b1e5','#7569a8']},
 music:{label:'الأغاني والموسيقى',icon:Music2,colors:['#ffe7ef','#f8bad2','#bf7298']},
 food:{label:'الطعام والمطبخ',icon:UtensilsCrossed,colors:['#fff0d7','#f2c596','#c48750']},
 faith:{label:'الثقافة الإسلامية',icon:BookOpen,colors:['#ddf3e9','#9bd5bd','#4d957f']},
 history:{label:'التاريخ والحضارات',icon:ScrollText,colors:['#f4eadc','#dfc7a5','#a28459']},
 science:{label:'العلوم والاكتشاف',icon:Atom,colors:['#e5eefa','#b1cae8','#668cbf']},
 space:{label:'الفضاء والكواكب',icon:Rocket,colors:['#dce9f9','#9aafd4','#516baf']},
 health:{label:'جسم الإنسان',icon:HeartPulse,colors:['#ffebea','#f3bfbb','#bc747c']},
 sea:{label:'البحار والمحيطات',icon:Waves,colors:['#daf5f7','#9bdde6','#428fa3']},
 technology:{label:'التقنية والاختراعات',icon:Smartphone,colors:['#e5edf8','#b3cdea','#5d81bd']},
 gaming:{label:'ألعاب الفيديو',icon:Gamepad2,colors:['#eeeaff','#c0b4e8','#8270ba']},
 language:{label:'اللغة والكلمات',icon:Languages,colors:['#f0e9fc','#d6c4ef','#9765ac']},
 nature:{label:'الطبيعة والحياة',icon:PawPrint,colors:['#e9f5d8','#b5d9a0','#70a274']},
 math:{label:'الأرقام والرياضيات',icon:Calculator,colors:['#eef0ff','#b9c4ee','#7c8ec2']},
 ideas:{label:'المعرفة والتفكير',icon:Lightbulb,colors:['#fff1d7','#ffda99','#bf924b']},
 drama:{label:'المسرح والدراما',icon:Drama,colors:['#fff0e5','#efbbaf','#c57b75']},
 camera:{label:'التصوير والصور',icon:Camera,colors:['#e3f0f7','#bbd5e5','#5d92af']},
 penaltyarea:{label:'منطقة الحارس في الملعب',icon:Goal,colors:['#dbf4e9','#9ad1ae','#328e68']},
 midline:{label:'منتصف ملعب كرة القدم',icon:Goal,colors:['#dbf4e9','#9ad1ae','#328e68']},
 corner:{label:'زاوية ملعب كرة القدم',icon:Goal,colors:['#dbf4e9','#9ad1ae','#328e68']},
 handball:{label:'تلامس الكرة مع اليد',icon:Goal,colors:['#dbf4e9','#9ad1ae','#328e68']},
 fountain:{label:'نافورة مائية',icon:Waves,colors:['#ddf2f8','#98d2e6','#368fa8']},
 carvedrocks:{label:'آثار منحوتة في الصخر',icon:Landmark,colors:['#f6e9d7','#dfb88e','#9e7457']},
 oldtown:{label:'حي تراثي قديم',icon:Building2,colors:['#f2e7d7','#e1c7a5','#94765d']},
 oasis:{label:'واحة نخيل',icon:TreePalm,colors:['#e6f3d9','#b7d6a0','#5e936d']},
 mountains:{label:'جبال ومرتفعات',icon:Mountain,colors:['#e6f4ea','#b2d6bd','#588b78']},
 caravan:{label:'قافلة تاريخية',icon:Compass,colors:['#f8ecd9','#e6c59d','#a6815b']},
 roses:{label:'زهور الورد',icon:Sparkles,colors:['#fde7ef','#eec0d0','#b77e9b']},
 coast:{label:'ساحل وميناء',icon:Plane,colors:['#e2f2f7','#b3d9e8','#5c9aad']},
 pearldive:{label:'الغوص واللؤلؤ',icon:Fish,colors:['#d9f3f7','#9dd9e3','#508ba0']}
};

function GlobeScene(){
 return <g strokeLinecap="round" strokeLinejoin="round">
  <circle cx="220" cy="134" r="92" fill="#8ed2db" stroke="#1d738d" strokeWidth="7"/>
  <ellipse cx="220" cy="134" rx="35" ry="90" fill="none" stroke="#6ab2c7" strokeWidth="4"/>
  <path d="M130 134h180M145 97h150M145 171h150" fill="none" stroke="#6ab2c7" strokeWidth="4"/>
  <path d="M163 61l32-5 12 21-8 18-25 2-8 24-19-9-9-25zm76 12 35 6 13 16-10 16-26 1-7 28-19 23-18-14 7-31 11-12zm-36 89 29-4 23 16-10 24-22 28-26-18-5-26z" fill="#68b67b" stroke="#559977" strokeWidth="3"/>
  <path d="M42 227h24v-37l14-8 14 8v37h21M323 225h19v-31h33v31h18M330 194v-18h25v18M50 190l30-30 29 30" stroke="#d89e75" strokeWidth="8" fill="none"/>
 </g>;
}
function FaithScene(){
 return <g strokeLinecap="round">
  <circle cx="325" cy="61" r="35" fill="#fae9a4"/><circle cx="338" cy="54" r="32" fill="#cfe9dc"/>
  <path d="M75 221v-84h39v-19h41v103M290 221v-97h47v97M114 118l21-35 21 35M291 124l22-35 24 35" fill="#7bb5a5" stroke="#39877c" strokeWidth="6" strokeLinejoin="round"/>
  <path d="M153 221V126c0-41 30-67 67-88 37 21 67 47 67 88v95Z" fill="#e4b887" stroke="#ae8866" strokeWidth="7"/>
  <path d="M196 221v-68c0-12 10-26 24-33 14 7 24 21 24 33v68" fill="#4d867f"/>
  <path d="M135 225h179M53 226h338" stroke="#4b847a" strokeWidth="9"/>
  <path d="M179 195h82" stroke="#e8ebbd" strokeWidth="5" strokeLinecap="round"/>
  <path d="M220 18v14" stroke="#ae8866" strokeWidth="6"/>
 </g>;
}
function SeaScene(){
 return <g>
  <path d="M0 181Q42 142 84 181T168 181T252 181T336 181T440 181V280H0Z" fill="#62aecd"/>
  <path d="M0 219q43-24 86 0t86 0t86 0t86 0t96 0" fill="none" stroke="#d2f7fa" strokeWidth="6"/>
  <path d="M117 132q16-14 31 0l-9 17 25 16q-28 25-58-3l23-13Z" fill="#f6ce94" stroke="#368aa9" strokeWidth="6"/>
  <path d="M250 106q48-28 94 0l-8 16q-39 22-84 0Z" fill="#f8bb7f" stroke="#368aa9" strokeWidth="6"/>
  <circle cx="267" cy="111" r="4" fill="#123e53"/><path d="M307 103l19-16 8 17" fill="#f8bb7f"/>
  <circle cx="82" cy="49" r="17" fill="#f6e8bc" opacity=".65"/><circle cx="378" cy="51" r="26" fill="#f6e8bc" opacity=".5"/>
 </g>;
}
function CityScene(){
 return <g strokeLinecap="round" strokeLinejoin="round">
  <path d="M49 222V109h72v113M125 222V62h74v160M207 222V94h88v128M302 222V125h79v97" fill="#8fb8cb" stroke="#487994" strokeWidth="7"/>
  <path d="M146 62v-24M169 62v-24M251 94V68M87 109V85" stroke="#487994" strokeWidth="7"/>
  {Array.from({length:15},(_,i)=><rect key={i} x={63+(i%3)*19} y={125+Math.floor(i/3)*19} width="9" height="8" rx="2" fill="#e2f6f3"/>)}
  {Array.from({length:16},(_,i)=><rect key={i} x={144+(i%4)*12} y={90+Math.floor(i/4)*28} width="7" height="12" rx="1" fill="#f8ebc6"/>)}
  <path d="M32 227h381" stroke="#618a9a" strokeWidth="10"/>
 </g>;
}
function FootballScene(){
 return <g strokeLinecap="round">
  <rect x="45" y="49" width="350" height="184" rx="24" fill="#9bd4ac" stroke="#52926c" strokeWidth="6"/>
  <path d="M220 51v180M46 142h349" stroke="#e6ffed" strokeWidth="4"/><circle cx="220" cy="142" r="38" fill="none" stroke="#e6ffed" strokeWidth="4"/>
  <path d="M46 101h52v81H46M395 101h-53v81h53" fill="none" stroke="#e6ffed" strokeWidth="4"/>
  <circle cx="222" cy="141" r="39" fill="#fffdf5" stroke="#497786" strokeWidth="5"/>
  <path d="M222 119l18 12-7 24h-22l-7-24Z" fill="#334f61"/>
  <path d="M222 119l-2-16M240 131l20-8M233 155l12 15M211 155l-10 16M204 131l-20-8" stroke="#334f61" strokeWidth="5"/>
 </g>;
}
function ArtsScene({theme}:{theme:VisualTheme}){
 return <g strokeLinecap="round" strokeLinejoin="round">
  <circle cx="109" cy="90" r="54" fill="#fff" opacity=".27"/>
  <path d="M70 221h302" stroke="#8c80a2" strokeWidth="8"/>
  <rect x="100" y="63" width="238" height="166" rx="20" fill="#f5eef8" stroke="#8f82aa" strokeWidth="7"/>
  {theme==='music'?<><circle cx="173" cy="166" r="28" fill="#d982a8"/><circle cx="263" cy="166" r="28" fill="#d982a8"/><path d="M198 166V96l97-21v91M198 102l97-21" fill="none" stroke="#9f648b" strokeWidth="12"/></>:
   <><rect x="125" y="96" width="187" height="105" rx="8" fill="#c7caea"/><path d="M125 126h187M163 97l-24 29M234 97l-24 29M304 97l-24 29" stroke="#fff9f7" strokeWidth="10"/><path d="M193 143l59 26-59 25Z" fill="#8c7bb4"/></>}
 </g>;
}
function TravelScene(){
 return <g strokeLinecap="round" strokeLinejoin="round">
  <circle cx="329" cy="66" r="37" fill="#fff2bc"/>
  <path d="M53 214q74-38 130-8 69-32 128 7 44-31 83-3" fill="none" stroke="#86b7aa" strokeWidth="20"/>
  <path d="M105 184l220-126-48 99-81 3-37 43-20-6 20-47-54 3Z" fill="#fdfdfa" stroke="#538ba6" strokeWidth="8"/>
  <path d="M69 85h84M95 106h68" stroke="#fff" strokeWidth="11"/>
  <path d="M311 208l25-47h38l24 47" fill="#e9c190" stroke="#9f836d" strokeWidth="7"/>
 </g>;
}

const specificScenes=new Set<VisualTheme>([
 'penaltyarea','midline','handball','corner','fountain','carvedrocks',
 'oldtown','oasis','mountains','caravan','roses','coast','pearldive'
]);

export default function QuestionVisual({category,prompt,imageUrl}:{category:number;prompt:string;imageUrl?:string}){
 const [photoFailed,setPhotoFailed]=React.useState(false);
 React.useEffect(()=>setPhotoFailed(false),[imageUrl]);
 // Card number uniquely maps to the genuine national flag; never show country names.
 const flagCard=category===11?Number(/بطاقة\s+(\d+)/.exec(prompt)?.[1]||0):0;
 const flagCodes='SA,AE,JP,CA,PT,UY,TR,FR,DE,EG,BR,LB,SE,KR,NP,MX,ZA,NZ'.split(',');
 if(flagCard>=1&&flagCard<=flagCodes.length)return <FlagQuestion flagCode={flagCodes[flagCard-1]}/>;
 const theme=getQuestionVisualTheme(category,prompt);
 // A real photo only appears when an administrator has attached a vetted
 // image from the owner's media library. Otherwise use original illustration.
 if(imageUrl&&!photoFailed){
  return <figure className="lm-question-visual lm-question-visual--photo" role="img" aria-label="صورة أصلية مرتبطة بالسؤال">
   <img src={imageUrl} alt="صورة مرتبطة بالسؤال" loading="eager" decoding="async" referrerPolicy="no-referrer"
     onError={()=>setPhotoFailed(true)}/>
   <figcaption className="lm-question-visual-caption">صورة السؤال</figcaption>
  </figure>;
 }
 if(!theme)return null;
 const selected=visualThemes[theme];
 const Icon=selected.icon;
 const customScene=specificScenes.has(theme);
 const detailed=customScene||theme==='globe'||theme==='faith'||theme==='city'||theme==='football'||theme==='sea'||theme==='film'||theme==='music'||theme==='travel';
 return <figure className={'lm-question-visual lm-question-visual--'+theme}
   role="img" aria-label={'صورة توضيحية مرتبطة بموضوع السؤال: '+selected.label}>
  <svg className="lm-question-visual-scene" viewBox="0 0 440 280" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
   <rect width="440" height="280" rx="23" fill={selected.colors[0]}/>
   <circle cx="383" cy="40" r="82" fill={selected.colors[1]} opacity=".4"/>
   <circle cx="43" cy="254" r="125" fill={selected.colors[1]} opacity=".45"/>
   <path d="M0 237q84-50 167-15 87 35 169-6 48-24 104 10v54H0Z" fill={selected.colors[1]} opacity=".46"/>
   {customScene?<QuestionSpecificScene variant={theme as SpecificScene}/>:
    theme==='globe'?<GlobeScene/>:
    theme==='faith'?<FaithScene/>:
    theme==='city'?<CityScene/>:
    theme==='football'?<FootballScene/>:
    theme==='sea'?<SeaScene/>:
    theme==='film'||theme==='music'?<ArtsScene theme={theme}/>:
    theme==='travel'?<TravelScene/>:
    <g strokeLinecap="round"><circle cx="220" cy="137" r="94" fill="#fff" opacity=".6" stroke={selected.colors[2]} strokeWidth="5"/><circle cx="220" cy="137" r="70" fill="#fff" opacity=".45"/><path d="M60 211h76M305 211h79M64 82h45M333 75h51" stroke={selected.colors[2]} strokeWidth="9" opacity=".45"/></g>}
  </svg>
  {!detailed&&<span className="lm-question-visual-icon" aria-hidden="true"><Icon size={100} strokeWidth={1.5}/></span>}
  <figcaption className="lm-question-visual-caption">{customScene?'رسم مرتبط بالسؤال':'صورة توضيحية'}</figcaption>
 </figure>;
}
