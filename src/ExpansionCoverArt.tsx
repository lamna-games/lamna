import React from 'react';
import {
  ArrowLeftRight, PawPrint, MonitorSmartphone, Clapperboard, Smile, Medal, Trophy, Goal,
  Landmark, Globe2, Coins, PlaneTakeoff, MessageCircle, MapPinned, Map, CookingPot,
  PencilOff, MessagesSquare, SearchCheck, SpellCheck, Languages, Calculator,
  BookOpen, Users, ScrollText, BookHeart, NotebookText, Music2, Plane, Smartphone,
  Stars, Sparkles, CircleHelp, Triangle
} from 'lucide-react';
/* New original category artwork, distinct from screenshots or licensed media. 
   Keep symbol-only ORIGINAL store logo overlay in CartoonCover. */
const symbols=[ArrowLeftRight,PawPrint,MonitorSmartphone,Clapperboard,Smile,Medal,Trophy,Goal,
  Landmark,Globe2,Coins,PlaneTakeoff,MessageCircle,MapPinned,Map,CookingPot,
  PencilOff,MessagesSquare,SearchCheck,SpellCheck,Languages,Calculator,
  BookOpen,Users,ScrollText,BookHeart,NotebookText,Music2,Plane,Smartphone];
const fills=[
 ['#fce5bc','#ffbc72','#e27b4f'],['#b1e8ba','#75ca9f','#319f84'],
 ['#b5ecff','#6dc6e4','#378bac'],['#ffe0c6','#e99482','#b16ab0'],
 ['#f8d5ea','#ed9cbb','#ad69a9'],['#f8e6ab','#f0bc5b','#ac7443'],
 ['#d7dcff','#949fdf','#7462bd'],['#d2f1d3','#72cda3','#278c75'],
 ['#ffe5bb','#e3bf73','#a47d4d'],['#bfe9ff','#7fc0df','#459dbe'],
 ['#d3f1c7','#a8d887','#64a56e'],['#ffedbd','#f7c169','#df895d'],
 ['#c9e7f9','#80c3de','#358dab'],['#d6f1cf','#8ec9aa','#4f9984'],
 ['#cde6f8','#8ccde3','#338aab'],['#ffe3cd','#edae80','#c77a54'],
 ['#d9daff','#b2a5e7','#746bc0'],['#fbe0c1','#e9b28b','#d28169'],
 ['#bcf2e4','#84d5bf','#329e8d'],['#ffe2a8','#f6b96e','#dc855a'],
 ['#d7d6ff','#a8a1ed','#7779bb'],['#e7e8ff','#aaa5e9','#7e74c5'],
 ['#b8eedb','#6fc6ae','#289a88'],['#ffe1ac','#f3bf75','#d18356'],
 ['#f5dcbd','#e3b48a','#a37a57'],['#c3ebea','#89cbd0','#459ca9'],
 ['#ffe6b8','#f6ca72','#e39951'],['#ffe0e8','#e99fba','#c26a96'],
 ['#cee5f8','#8abfe0','#4b86c5'],['#d9e5fa','#97b5d7','#496f9d']
];
export default function ExpansionCoverArt({i}:{i:number}){
 const j=i-20;
 const Icon=symbols[j]||CircleHelp;
 const [light,mid,dark]=fills[j]||fills[0];
 return <g>
   <circle cx="205" cy="174" r="123" fill={light} stroke="#fff8" strokeWidth="5"/>
   <path d="M67 285q114 50 268-6l-6 38q-131 49-253 4z" fill={mid} opacity=".42"/>
   <g transform="translate(42 34)">
     <rect x="20" y="27" width="275" height="243" rx="48" fill={mid} stroke="#173b55" strokeWidth="5" transform="rotate(-7 158 148)"/>
     <rect x="41" y="37" width="234" height="218" rx="33" fill={light} stroke="#fff" strokeWidth="7"/>
     <Icon x={77} y={69} width={167} height={156} color="#173b55" strokeWidth={1.65} fill="none"/>
     <circle cx="283" cy="40" r="24" fill="#fff6df" stroke="#173b55" strokeWidth="4"/>
     <path d="M275 40h17m-8-8v17" stroke={dark} strokeWidth="5" strokeLinecap="round"/>
   </g>
   <g stroke={dark} strokeWidth="7" strokeLinecap="round" fill="none" opacity=".72">
     <path d="M34 88l18 11m3-32l6-16M343 261l25 14m-6-43l12-15"/>
   </g>
   <circle cx="67" cy="249" r="17" fill="#fff8da" stroke={dark} strokeWidth="5"/>
   <path d="M323 81l7-21 7 21 21 7-21 7-7 21-7-21-21-7z" fill="#ffce66" stroke={dark} strokeWidth="3"/>
 </g>;
}
