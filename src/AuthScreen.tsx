import React from 'react';
import { Eye, EyeOff, Mail, LockKeyhole, UserRound, Phone, AlertCircle } from 'lucide-react';
import { getCountries, getCountryCallingCode, type CountryCode } from 'libphonenumber-js';
import OfficialLogo from './OfficialLogo';
import AccountPage from './AccountPage';
import './authScreen.css';

type Mode='register'|'login';
type Props={initialMode:Mode;onReturn:()=>void};
const regions=new Intl.DisplayNames(['ar'],{type:'region'});
const countries:CountryCode[]=getCountries().sort((a,b)=>{
  if(a==='SA')return -1;
  if(b==='SA')return 1;
  return (regions.of(a)||a).localeCompare(regions.of(b)||b,'ar');
});
const flag=(code:string)=>code.toUpperCase().replace(/./g,c=>String.fromCodePoint(127397+c.charCodeAt(0)));

export default function AuthScreen({initialMode,onReturn}:Props){
 const [mode,setMode]=React.useState<Mode>(initialMode);
 const [country,setCountry]=React.useState<CountryCode>('SA');
 const [visible,setVisible]=React.useState(false);
 const [accepted,setAccepted]=React.useState(false);
 const [accountsEnabled,setAccountsEnabled]=React.useState(false);
 React.useEffect(()=>{
  let valid=true;
  fetch('https://lamna-wordless-sync.onrender.com/api/accounts/status',{cache:'no-store'})
    .then(response=>response.ok?response.json():{enabled:false})
    .then(result=>{if(valid)setAccountsEnabled(result.enabled===true)})
    .catch(()=>{if(valid)setAccountsEnabled(false)});
  return()=>{valid=false};
 },[]);

 React.useEffect(()=>setMode(initialMode),[initialMode]);
 const code=getCountryCallingCode(country);
 if(accountsEnabled)return <AccountPage initialMode={mode} onBack={onReturn}/>;
 return <section className="lm-auth-view" dir="rtl" aria-label={mode==='register'?'التسجيل في لمنا':'تسجيل دخول لمنا'}>
  <div className="lm-auth-card">
   <div className="lm-auth-head">
     <OfficialLogo/>
     <h1>{mode==='register'?'انضمّ لجمعتنا':'حيّاك من جديد!'}</h1>
     <p>{mode==='register'?'سجّل حسابًا واحدًا لعرض مبارياتك واستخدام لمنا بسهولة.':'هنا ترجع لحسابك بمجرد تفعيل تسجيل الدخول.'}</p>
   </div>
   <div className="lm-auth-tabs" role="group" aria-label="اختر نوع الحساب">
    <button className={mode==='register'?'active':''} type="button" onClick={()=>setMode('register')}>سجّل معنا</button>
    <button className={mode==='login'?'active':''} type="button" onClick={()=>setMode('login')}>تسجيل الدخول</button>
   </div>
   <div className="lm-auth-preview-note" role="status"><AlertCircle size={18}/>
    هذه معاينة للتصميم فقط. لن نطلب منك كلمة مرور أو ننشئ حسابًا حتى يكتمل ربط نظام الحسابات الآمن.
   </div>
   {mode==='register'?
    <div className="lm-auth-form" aria-label="نموذج معاينة إنشاء حساب">
     <div className="lm-auth-field-row">
      <label>الاسم الأول <input type="text" placeholder="الاسم الأول" autoComplete="off" disabled/></label>
      <label>الاسم الأخير <input type="text" placeholder="الاسم الأخير" autoComplete="off" disabled/></label>
     </div>
     <label>البريد الإلكتروني <span className="lm-auth-input-icon"><Mail size={19}/><input type="email" placeholder="example@email.com" autoComplete="off" disabled/></span></label>
     <label>الدولة <select value={country} onChange={e=>setCountry(e.target.value as CountryCode)}>
       {countries.map(c=><option value={c} key={c}>{flag(c)} {regions.of(c)||c} (+{getCountryCallingCode(c)})</option>)}
     </select></label>
     <label>رقم الجوال <div className="lm-auth-phone">
      <span>{flag(country)} +{code}</span><input type="tel" placeholder={country==='SA'?'5xxxxxxxx':'رقم الجوال'} disabled/>
     </div></label>
     <label>كلمة المرور <span className="lm-auth-input-icon"><LockKeyhole size={19}/><input type={visible?'text':'password'} placeholder="كلمة المرور" autoComplete="off" disabled/><button type="button" disabled aria-label="إظهار كلمة المرور" onClick={()=>setVisible(v=>!v)}>{visible?<EyeOff size={20}/>:<Eye size={20}/>}</button></span></label>
     <label>تأكيد كلمة المرور <input type="password" placeholder="تأكيد كلمة المرور" autoComplete="off" disabled/></label>
     <label className="lm-auth-agree"><input type="checkbox" checked={accepted} onChange={e=>setAccepted(e.target.checked)}/> أوافق على الشروط وسياسة الخصوصية عند تفعيل التسجيل.</label>
     <button type="button" className="lm-auth-submit" disabled>إنشاء حساب — قريبًا</button>
     <p className="lm-auth-switch">عندك حساب؟ <button type="button" onClick={()=>setMode('login')}>تسجيل الدخول</button></p>
    </div>:
    <div className="lm-auth-form" aria-label="نموذج معاينة تسجيل الدخول">
     <label>البريد الإلكتروني أو رقم الجوال <span className="lm-auth-input-icon"><UserRound size={19}/><input type="text" placeholder="بريدك الإلكتروني أو رقمك" disabled/></span></label>
     <label>كلمة المرور <span className="lm-auth-input-icon"><LockKeyhole size={19}/><input type="password" placeholder="كلمة المرور" disabled/></span></label>
     <p className="lm-auth-forgot">نسيت كلمة المرور؟ <span>ستتوفر خدمة الاستعادة مع تفعيل الحسابات.</span></p>
     <button type="button" className="lm-auth-submit" disabled>تسجيل الدخول — قريبًا</button>
     <p className="lm-auth-switch">ما عندك حساب؟ <button type="button" onClick={()=>setMode('register')}>سجّل معنا</button></p>
    </div>
   }
   <button type="button" className="lm-auth-home" onClick={onReturn}>الرجوع للألعاب</button>
  </div>
 </section>;
}
