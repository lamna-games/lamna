import React from 'react';
import './carQuestion.css';

/**
 * The photo, not a generated illustration, is the car-identification puzzle.
 * Source URLs are vetted by the existing server-side Cloudinary photo policy.
 * Never show the model or make inside this component before answer reveal.
 */
export default function CarQuestion({imageUrl,view}:{imageUrl?:string;view?:string}){
 const [failed,setFailed]=React.useState(false);
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
 </figure>;
}
