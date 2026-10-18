import React from 'react';
import {arabicAlphabet} from './gameCatalog';
import './LetterBoard.css';

/** A Lamna-exclusive 28-square Arabic alphabet. 
 * Exactly ONE letter is highlighted, never the whole answer.
 * Normalizes Arabic alef and ha spelling variants for reliable matching. */
const normalizeLetter=(ch:string)=>{
 if(/[إأآٱا]/.test(ch))return 'أ';
 if(/[هة]/.test(ch))return 'هـ';
 if(ch==='ى')return 'ي';
 return ch;
};
export function initialOfAnswer(answer:string):string{
 const clean=answer.trim().replace(/^[\s\u064B-\u065F\u0670\u0640"«»'()]+/g,'');
 return normalizeLetter(Array.from(clean)[0]||'');
}
export default function LetterBoard({answer,revealed=false}:{answer:string;revealed?:boolean}){
 const initial=initialOfAnswer(answer);
 return <div className="lm-letter-wrapper" dir="rtl" aria-label="لوحة الحروف العربية الكاملة">
  <div className="lm-letter-label">لوحة الحروف — من الألف إلى الياء</div>
  <div className="lm-letter-grid" role="group" aria-label={'حروف عربية مرتبة؛ الحرف المطلوب '+initial}>
    {arabicAlphabet.map((letter,index)=><div key={index}
      className={'lm-letter-tile'+(letter===initial?' is-letter-active':'')}
      aria-label={letter===initial?('الحرف المطلوب '+letter):('حرف '+letter)}>
      {letter}
    </div>)}
  </div>
  <p className="lm-letter-note">{revealed?'اللون البرتقالي يشير إلى حرف بداية الإجابة.':'الحرف البرتقالي هو بداية الإجابة؛ باقي الحروف تبقى ظاهرة.'}</p>
 </div>;
}
