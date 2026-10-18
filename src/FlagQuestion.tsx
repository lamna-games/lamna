import React from 'react';
import './questionVisual.css';

export default function FlagQuestion({flagCode}:{flagCode:string}){
 const [failed,setFailed]=React.useState(false);
 React.useEffect(()=>setFailed(false),[flagCode]);
 if(!/^[A-Z]{2}$/.test(flagCode))return <p role="alert">تعذر عرض العلم</p>;
 const emoji=String.fromCodePoint(...Array.from(flagCode).map(c=>127397+c.charCodeAt(0)));
 return <figure className="lm-question-visual lm-flag-visual" aria-label="تعرف على الدولة من علمها">
  {!failed?<img className="lm-flag-image" src={'https://flagcdn.com/w320/'+flagCode.toLowerCase()+'.png'} alt="علم الدولة المطلوب التعرف عليها" loading="eager" decoding="async" onError={()=>setFailed(true)}/>:<span className="lm-flag-fallback" role="img" aria-label="العلم المطلوب التعرف عليه">{emoji}</span>}
  <figcaption className="lm-question-visual-caption">خمن الدولة من العلم</figcaption>
 </figure>;
}
