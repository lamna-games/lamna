import React from 'react';
import {arabicAlphabet} from './gameCatalog';
import './LetterBoard.css';

/** A Lamna-exclusive 28-square Arabic alphabet. 
 * Exactly ONE letter is highlighted, never the whole answer.
 * Normalizes Arabic alef and ha spelling variants for reliable matching. */
const normalizeLetter=(ch:string)=>{
 if(/[إأآٱا]/.test(ch))return 'أ';
 if(/[هة]/.test(ch))return 'ه';
 if(ch==='ى')return 'ي';
 return ch;
};
const letterNames:Record<string,string>={
 'الألف':'أ','الباء':'ب','التاء':'ت','الثاء':'ث','الجيم':'ج','الحاء':'ح','الخاء':'خ',
 'الدال':'د','الذال':'ذ','الراء':'ر','الزاي':'ز','السين':'س','الشين':'ش',
 'الصاد':'ص','الضاد':'ض','الطاء':'ط','الظاء':'ظ','العين':'ع','الغين':'غ',
 'الفاء':'ف','القاف':'ق','الكاف':'ك','اللام':'ل','الميم':'م','النون':'ن',
 'الهاء':'ه','الواو':'و','الياء':'ي'
};
export function initialOfAnswer(answer:string,english=false):string{
 const clean=answer.trim().replace(/^[\\s\\u064B-\\u065F\\u0670\\u0640"«»'()]+/g,'');
 if(english)return (clean.toUpperCase().match(/[A-Z]/)||[])[0]||'';
 if(letterNames[clean])return letterNames[clean];
 const value=clean.startsWith('ال')&&clean.length>3?clean.slice(2):clean;
 return normalizeLetter(Array.from(value)[0]||'');
}
export default function LetterBoard({answer,revealed=false,category}:{answer:string;revealed?:boolean;category?:number}){
 const english=category===40;
 const alphabet=english?'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''):Array.from(arabicAlphabet);
 const initial=initialOfAnswer(answer,english);
 return <div className="lm-letter-wrapper" dir={english?'ltr':'rtl'} aria-label={english?'لوحة الحروف الإنجليزية الكاملة':'لوحة الحروف العربية الكاملة'}>
  <div className="lm-letter-label">{english?'لوحة الحروف الإنجليزية A–Z':'لوحة الحروف العربية من الألف إلى الياء'}</div>
  <div className="lm-letter-grid" role="group" aria-label={'الحروف مرتبة؛ الحرف المطلوب '+initial}>
    {alphabet.map((letter,index)=><div key={index}
      className={'lm-letter-tile'+(letter===initial?' is-letter-active':'')}
      aria-label={letter===initial?('الحرف المطلوب '+letter):('حرف '+letter)}>
      {letter}
    </div>)}
  </div>
  <p className="lm-letter-note">{revealed?'اللون البرتقالي يشير إلى الحرف المطلوب.':'المربع البرتقالي يحدد حرفًا واحدًا فقط، دون عرض الإجابة كاملة.'}</p>
 </div>;
}
