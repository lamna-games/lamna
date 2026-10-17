import React from 'react';
import { AlertCircle, ArrowRight } from 'lucide-react';
import AccountPage from './AccountPage';
import './authScreen.css';

type Mode='register'|'login';
type Props={initialMode:Mode;onReturn:()=>void;onAuthenticated:()=>void};

/** Only expose real registration after the backend confirms a working database. */
export default function AuthScreen({initialMode,onReturn,onAuthenticated}:Props){
 const [ready,setReady]=React.useState<boolean|null>(null);
 React.useEffect(()=>{
  let alive=true;
  fetch('https://lamna-wordless-sync.onrender.com/api/accounts/status',{cache:'no-store'})
   .then(r=>r.ok?r.json():{enabled:false})
   .then(data=>{if(alive)setReady(data.enabled===true)})
   .catch(()=>{if(alive)setReady(false)});
  return()=>{alive=false};
 },[]);
 if(ready===true)return <AccountPage initialMode={initialMode} onBack={onReturn} onAuthenticated={onAuthenticated}/>;
 return <main className="lm-auth-view" dir="rtl" aria-label="خدمة حسابات لمنا">
  <div className="lm-auth-card">
   <div className="lm-auth-head">
    <h1>{ready===null?'التحقق من خدمة الحسابات':'حسابات لمنا غير متاحة حاليًا'}</h1>
    <p>{ready===null?'جارٍ التحقق من اتصال الحسابات الآمن…':'نجهز اتصال الحسابات الآمن. إنشاء الحسابات الجديدة متوقف حاليًا لحماية بيانات العملاء.'}</p>
   </div>
   {ready===false&&<p className="lm-auth-preview-note"><AlertCircle size={18}/> لا تطلب لمنا منك بيانات التسجيل إلا بعد تشغيل خدمة الحسابات الآمنة.</p>}
   <button type="button" className="lm-auth-home" onClick={onReturn}><ArrowRight size={17}/> العودة للألعاب</button>
  </div>
 </main>;
}
