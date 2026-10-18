import React from 'react';
import { Eye, EyeOff, Mail, LockKeyhole, UserPlus, LogIn, PhoneCall, ArrowRight, CheckCircle2 } from 'lucide-react';
import { getCountries, getCountryCallingCode, parsePhoneNumberFromString, type CountryCode } from 'libphonenumber-js';
import OfficialLogo from './OfficialLogo';
import './account.css';

const API='https://lamna-wordless-sync.onrender.com';
const flag=(c:string)=>[...c].map(x=>String.fromCodePoint(127397+x.charCodeAt(0))).join('');
const countryNames=new Intl.DisplayNames(['ar'],{type:'region'});
const countries=getCountries().sort((a,b)=>a==='SA'?-1:b==='SA'?1:(countryNames.of(a)||a).localeCompare(countryNames.of(b)||b,'ar'));
type Screen='register'|'login';
export default function AccountPage({onBack,onAuthenticated,initialMode='login'}:{onBack:()=>void;onAuthenticated:()=>void;initialMode?:Screen}){
 const [screen,setScreen]=React.useState<Screen>(initialMode);
 React.useEffect(()=>setScreen(initialMode),[initialMode]);
 const [country,setCountry]=React.useState<CountryCode>('SA');
 const [first,setFirst]=React.useState('');
 const [last,setLast]=React.useState('');
 const [email,setEmail]=React.useState('');
 const [mobile,setMobile]=React.useState('');
 const [password,setPassword]=React.useState('');
 const [confirm,setConfirm]=React.useState('');
 const [visible,setVisible]=React.useState(false);
 const [acceptedTerms,setAcceptedTerms]=React.useState(false);
 const [busy,setBusy]=React.useState(false);
 const [error,setError]=React.useState('');
 const [success,setSuccess]=React.useState('');
 const switchTo=(next:Screen)=>{setScreen(next);setError('');setSuccess('');setPassword('');setConfirm('');};
 const submit=async(event:React.FormEvent)=>{
  event.preventDefault();if(busy)return;setError('');setSuccess('');
  const cleanEmail=email.trim().toLowerCase();
  if(!/^\S+@\S+\.\S+$/.test(cleanEmail)){setError('تأكد من صحة البريد الإلكتروني.');return;}
  let phone='';
  if(screen==='register'){
   if(!acceptedTerms){setError('يرجى الموافقة على الشروط وسياسة الخصوصية قبل التسجيل.');return;}
   if(first.trim().length<2||last.trim().length<2){setError('اكتب اسمك الأول والأخير.');return;}
   const parsed=parsePhoneNumberFromString(mobile,country);
   if(!parsed?.isValid()||parsed.country!==country){setError('تأكد من صحة رقم الجوال ورمز الدولة.');return;}
   phone=parsed.number;
   if(password.length<8){setError('كلمة المرور لازم تكون 8 أحرف على الأقل.');return;}
   if(password!==confirm){setError('تأكيد كلمة المرور غير مطابق.');return;}
  }else if(!password){setError('اكتب كلمة المرور.');return;}
  setBusy(true);
  try{
   const res=await fetch(API+'/api/accounts/'+(screen==='register'?'register':'login'),{
    method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify(screen==='register'?{firstName:first.trim(),lastName:last.trim(),email:cleanEmail,phone,country,password}:{email:cleanEmail,password})
   });
   const data=await res.json().catch(()=>({}));
   if(!res.ok){throw Error(data?.message||'تعذر الاتصال بخدمة الحسابات. حاول لاحقًا.');}
   if(!data?.token){throw Error('تعذر إنشاء جلسة آمنة للحساب. حاول تسجيل الدخول.');}
   sessionStorage.setItem('lamna-session',data.token);
   sessionStorage.setItem('lamna-account-name',data.firstName||first.trim());
   setPassword('');setConfirm('');
   onAuthenticated();
  }catch(e){setError(e instanceof Error?e.message:'تعذر إتمام العملية.');}
  finally{setBusy(false);}
 };
 return <main className="lm-account" dir="rtl">
  <div className="lm-account-shell">
   <div className="lm-account-head">
    <OfficialLogo/>
    <button type="button" onClick={onBack}><ArrowRight size={17}/> العودة للعبة</button>
   </div>
   <div className="lm-account-intro">
    <span>حسابك في لمنا</span>
    <h1>{screen==='login'?'حياك من جديد!':'سجّل معنا'}</h1>
    <p>{screen==='login'?'سجّل دخولك ببريدك وكلمة المرور.':'أنشئ حسابًا واحدًا لتحصل على مباراة مجانية محفوظة ورصيد ألعابك.'}</p>
   </div>
   <div className="lm-account-tabs" role="tablist" aria-label="التسجيل والدخول">
    <button type="button" className={screen==='login'?'selected':''} onClick={()=>switchTo('login')} role="tab" aria-selected={screen==='login'}><LogIn size={17}/> تسجيل الدخول</button>
    <button type="button" className={screen==='register'?'selected':''} onClick={()=>switchTo('register')} role="tab" aria-selected={screen==='register'}><UserPlus size={17}/> حساب جديد</button>
   </div>
   <form className="lm-account-form" onSubmit={submit}>
    {screen==='register'&&<>
     <div className="lm-form-double">
      <label><span>الاسم الأول *</span><input autoComplete="given-name" required maxLength={40} value={first} onChange={e=>setFirst(e.target.value)} placeholder="اسمك الأول"/></label>
      <label><span>الاسم الأخير *</span><input autoComplete="family-name" required maxLength={40} value={last} onChange={e=>setLast(e.target.value)} placeholder="اسم العائلة"/></label>
     </div>
    </>}
    <label><span>البريد الإلكتروني *</span><div className="lm-field-icon"><Mail size={19}/><input type="email" autoComplete="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="name@example.com"/></div></label>
    {screen==='register'&&<>
     <label><span>الدولة *</span><select aria-label="اختر الدولة" value={country} onChange={e=>{setCountry(e.target.value as CountryCode);setMobile('')}}>
      {countries.map(c=><option key={c} value={c}>{flag(c)} {countryNames.of(c)||c} (+{getCountryCallingCode(c)})</option>)}
     </select></label>
     <div className="lm-mobile-fields">
      <label><span>رمز الدولة</span><div className="lm-dial">{flag(country)} +{getCountryCallingCode(country)}</div></label>
      <label><span>رقم الجوال *</span><div className="lm-field-icon"><PhoneCall size={19}/><input type="tel" inputMode="tel" autoComplete="tel-national" required value={mobile} onChange={e=>setMobile(e.target.value)} placeholder={country==='SA'?'05xxxxxxxx':'رقم الجوال'}/></div></label>
     </div>
     <p className="lm-account-hint">يُسمح بحساب واحد لكل بريد إلكتروني ورقم جوال.</p>
    </>}
    <label><span>كلمة المرور *</span><div className="lm-field-icon"><LockKeyhole size={18}/><input type={visible?'text':'password'} minLength={screen==='register'?8:1} required autoComplete={screen==='register'?'new-password':'current-password'} value={password} onChange={e=>setPassword(e.target.value)} placeholder="كلمة المرور"/><button type="button" aria-label={visible?'إخفاء':'إظهار'} className="lm-show-password" onClick={()=>setVisible(v=>!v)}>{visible?<EyeOff size={20}/>:<Eye size={20}/>}</button></div></label>
    {screen==='register'&&<label><span>تأكيد كلمة المرور *</span><input type={visible?'text':'password'} minLength={8} required autoComplete="new-password" value={confirm} onChange={e=>setConfirm(e.target.value)} placeholder="أعد كتابة كلمة المرور"/></label>}
    {screen==='login'&&<p className="lm-account-forgot"><button type="button" onClick={()=>{window.location.hash='reset-password'}}>نسيت كلمة المرور؟</button></p>}
    {screen==='register'&&<label className="lm-account-consent">
      <input type="checkbox" required checked={acceptedTerms} onChange={e=>setAcceptedTerms(e.target.checked)}/>
      <span>أوافق على <a href="#terms">الشروط والأحكام</a> و<a href="#privacy">سياسة الخصوصية</a> الخاصة بلمنا.</span>
    </label>}
    {error&&<p className="lm-account-error" role="alert">{error}</p>}
    {success&&<p className="lm-account-success" role="status"><CheckCircle2 size={18}/>{success}</p>}
    <button className="lm-account-submit" type="submit" disabled={busy}>{busy?'جارٍ التحقق…':screen==='login'?'تسجيل الدخول':'إنشاء الحساب'}</button>
   </form>
   <p className="lm-account-bottom">{screen==='login'?'ما عندك حساب؟':'عندك حساب من قبل؟'} <button onClick={()=>switchTo(screen==='login'?'register':'login')}>{screen==='login'?'سجّل معنا':'تسجيل الدخول'}</button></p>
  </div>
 </main>;
}
