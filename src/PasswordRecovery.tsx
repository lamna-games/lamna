import React from 'react';
import {ArrowRight,Mail,LockKeyhole,ShieldCheck,Eye,EyeOff} from 'lucide-react';
import './passwordRecovery.css';
const API='https://lamna-wordless-sync.onrender.com';
export default function PasswordRecovery({onBack}:{onBack:()=>void}){
 const token=new URLSearchParams(window.location.hash.split('?')[1]||'').get('token')||'';
 const [email,setEmail]=React.useState('');
 const [password,setPassword]=React.useState('');
 const [confirm,setConfirm]=React.useState('');
 const [visible,setVisible]=React.useState(false);
 const [busy,setBusy]=React.useState(false);
 const [message,setMessage]=React.useState('');
 const [error,setError]=React.useState('');
 const [done,setDone]=React.useState(false);
 const submit=async(e:React.FormEvent)=>{
   e.preventDefault();setError('');setMessage('');
   if(token&&(password.length<8||password.length>128||password!==confirm)){setError('تأكد من كلمة المرور (8 أحرف على الأقل) وتطابق التأكيد.');return;}
   if(!token&&!/^\S+@\S+\.\S+$/.test(email.trim())){setError('اكتب بريدًا إلكترونيًا صحيحًا.');return;}
   setBusy(true);
   try{
    const path=token?'reset/confirm':'reset/request';
    const res=await fetch(API+'/api/accounts/'+path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(token?{token,password}:{email:email.trim().toLowerCase()})});
    const data=await res.json().catch(()=>({}));
    if(!res.ok)throw Error(data.message||'تعذر إتمام الطلب.');
    setMessage(data.message||'تم استلام طلبك.');setDone(Boolean(token));setPassword('');setConfirm('');
   }catch(e){setError(e instanceof Error?e.message:'حدث خطأ غير متوقع.');}
   finally{setBusy(false);}
 };
 return <main className="lm-recovery" dir="rtl"><div className="lm-recovery-card">
  <button type="button" className="lm-recovery-back" onClick={onBack}><ArrowRight size={17}/> العودة لتسجيل الدخول</button>
  <div className="lm-recovery-icon"><ShieldCheck size={34}/></div>
  <h1>{token?'تغيير كلمة المرور':'نسيت كلمة المرور؟'}</h1>
  <p>{token?'اختر كلمة مرور جديدة لحسابك. سيُطلب منك تسجيل الدخول من جديد.':'اكتب بريد الحساب المسجل، وسنرسل لك رابط استعادة إذا كانت خدمة البريد مفعلة.'}</p>
  {!done&&<form onSubmit={submit}>
   {!token?<label>البريد الإلكتروني<div className="lm-recovery-field"><Mail size={20}/><input type="email" autoComplete="email" dir="ltr" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="name@example.com"/></div></label>:<>
    <label>كلمة المرور الجديدة<div className="lm-recovery-field"><LockKeyhole size={20}/><input type={visible?'text':'password'} autoComplete="new-password" minLength={8} maxLength={128} required value={password} onChange={e=>setPassword(e.target.value)} placeholder="8 أحرف على الأقل"/><button type="button" className="lm-recovery-eye" onClick={()=>setVisible(v=>!v)} aria-label={visible?'إخفاء كلمة المرور':'إظهار كلمة المرور'}>{visible?<EyeOff size={18}/>:<Eye size={18}/>}</button></div></label>
    <label>تأكيد كلمة المرور الجديدة<div className="lm-recovery-field"><LockKeyhole size={20}/><input type={visible?'text':'password'} autoComplete="new-password" minLength={8} maxLength={128} required value={confirm} onChange={e=>setConfirm(e.target.value)}/></div></label>
   </>}
   <button className="lm-recovery-submit" disabled={busy}>{busy?'انتظر قليلًا…':token?'تغيير كلمة المرور':'إرسال رابط الاستعادة'}</button>
  </form>}
  {message&&<p className="lm-recovery-success" role="status">{message}</p>}
  {error&&<p className="lm-recovery-error" role="alert">{error}</p>}
  {done&&<button className="lm-recovery-submit" onClick={onBack}>سجّل دخولك</button>}
 </div></main>;
}