import React from 'react';
import './carQuestion.css';
const credits=[
 {key:'car-08-nissan-patrol-y62',author:'Coptic Light',source:'https://commons.wikimedia.org/wiki/File:Nissan_Patrol_Sixth_generation_Front.jpg'},
 {key:'car-09-ford-mustang-gt-2018',author:'Vauxford',source:'https://commons.wikimedia.org/wiki/File:2018_Ford_Mustang_GT_5.0_Front.jpg'},
 {key:'car-10-mercedes-g500-w463',author:'Ethan Llamas',source:'https://commons.wikimedia.org/wiki/File:Mercedes-Benz_W463_G500_V8_Arctic_White_front_left.jpg'}
] as const;


/**
 * The photo, not a generated illustration, is the car-identification puzzle.
 * Source URLs are vetted by the existing server-side Cloudinary photo policy.
 * Never show the model or make inside this component before answer reveal.
 */
export default function CarQuestion({imageUrl,view}:{imageUrl?:string;view?:string}){
 const [failed,setFailed]=React.useState(false);
 const credit=credits.find(c=>imageUrl?.includes(c.key));
 React.useEffect(()=>setFailed(false),[imageUrl]);
 if(!imageUrl||failed){
  return <figure className="lm-car-photo lm-car-photo--missing" role="status" aria-live="polite">
   <span className="lm-car-photo-placeholder" aria-hidden="true">🚘</span>
   <figcaption>{failed?'تعذر تحميل صورة السيارة الحقيقية':'بانتظار صورة السيارة الحقيقية المعتمدة'}</figcaption>
  </figure>;
 }
 return <figure className="lm-car-photo" role="img" aria-label="صورة حقيقية لسيارة، خمن اسمها">
  <img src={imageUrl} alt="صورة السيارة المطلوب معرفة اسمها"
   loading="eager" decoding="async" referrerPolicy="no-referrer" onError={()=>setFailed(true)}/>
  <figcaption>تحدّي السيارات — {view==='interior'?'الصورة من الداخل':view==='rear'?'الصورة من الخلف':view==='detail'?'تعرّف من التفاصيل':'الصورة من الأمام'}</figcaption>
  {credit&&<div className="lm-car-photo-credit" aria-label="حقوق الصورة">تصوير: {credit.author} · <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer">CC BY-SA 4.0</a> · <a href={credit.source} target="_blank" rel="noopener noreferrer">المصدر</a></div>}
 </figure>;
}
