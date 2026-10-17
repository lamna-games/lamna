import React from 'react';
import { ArrowRight, Ticket, ShieldCheck, UserRound, LogOut, LockKeyhole } from 'lucide-react';
import { storeRequest, token, type Wallet, type ServerMatch } from './storeApi';
import AdminReports from './AdminReports';
import './storeCommerce.css';
type Props={mode:'plans'|'wallet';accountsEnabled:boolean;onBack:()=>void;onLogin:()=>void;onResume?:(match:ServerMatch)=>void};
const offers=[{games:1,price:'9.99',name:'لعبة واحدة'},{games:3,price:'19.99',name:'3 ألعاب'},{games:5,price:'29.99',name:'5 ألعاب'}];
export default function StoreCommerce({mode,accountsEnabled,onBack,onLogin,onResume}:Props){
 const [wallet,setWallet]=React.useState<Wallet|null>(null);
 const [message,setMessage]=React.useState('');
 const [loading,setLoading]=React.useState(false);
 const signedIn=Boolean(token());
 React.useEffect(()=>{
  if(!accountsEnabled||!signedIn)return;
  let active=true;setLoading(true);
  storeRequest<Wallet>('me').then(w=>{if(active)setWallet(w)}).catch(e=>{if(active)setMessage(e.message)}).finally(()=>{if(active)setLoading(false)});
  return()=>{active=false};
 },[accountsEnabled,signedIn]);
 const resume=async(id:string)=>{
  if(!onResume)return;
  try{setLoading(true);const data=await storeRequest<{match:ServerMatch}>('matches/'+id);onResume(data.match);}
  catch(e){setMessage(e instanceof Error?e.message:'تعذر تحميل المباراة.');}finally{setLoading(false)}
 };
 return <main className="lm-commerce" dir="rtl">
  <div className="lm-commerce-shell">
   <button type="button" className="lm-commerce-back" onClick={onBack}><ArrowRight size={17}/> رجوع للرئيسية</button>
   {mode==='plans'?<>
    <div className="lm-commerce-heading"><span><Ticket size={17}/> باقات لمنا</span><h1>اختار باقتك</h1><p>كل لعبة في الباقة تعطيك مباراة كاملة. تختار في كل مباراة ست فئات.</p></div>
    <div className="lm-offer-list">
     {offers.map(p=><div className="lm-offer" key={p.games}>
      <div className="lm-offer-title"><strong>{p.name}</strong><span>مباراة {p.games===1?'واحدة':p.games===3?'ثلاث':'خمس'}</span></div>
      <div className="lm-offer-price"><strong>{p.price}</strong><small>ريال</small></div>
     </div>)}
    </div>
    <p className="lm-commerce-disclosure"><ShieldCheck size={17}/> الأسعار محددة، لكن الشراء الإلكتروني غير مفعّل حتى يتم ربط بوابة دفع معتمدة والتحقق من السداد. لن يتم تحصيل مبلغ أو إضافة رصيد وهمي.</p>
    {accountsEnabled&&!signedIn&&<button type="button" className="lm-commerce-main" onClick={onLogin}>تسجيل الدخول <ArrowRight size={17}/></button>}
    {wallet&&<div className="lm-commerce-wallet"><span>رصيدك الحالي</span><strong>{wallet.credits} مباراة</strong></div>}
   </>:<>
    <div className="lm-commerce-heading"><span><UserRound size={17}/> حسابك في لمنا</span><h1>مبارياتك</h1><p>هنا تشوف المباراة المجانية والرصيد الذي تملكه والمباريات السابقة.</p></div>
    {!accountsEnabled?<div className="lm-commerce-notice"><LockKeyhole size={18}/> الحسابات غير متاحة حتى يُربط نظام الحسابات الآمن.</div>:!signedIn?
     <button type="button" className="lm-commerce-main" onClick={onLogin}>سجّل دخولك للمتابعة <ArrowRight size={17}/></button>:loading?
     <div className="lm-commerce-notice">جارٍ تحميل حسابك…</div>:wallet?<div className="lm-commerce-details">
       <div className="lm-commerce-stats"><div><small>المجانية</small><strong>{wallet.freeRemaining?'متاحة':'استُخدمت'}</strong></div><div><small>رصيد المباريات</small><strong>{wallet.credits}</strong></div></div>
       <h2>مبارياتك</h2>
       {wallet.matches.length===0?<p>ما عندك مباريات سابقة بعد.</p>:wallet.matches.map(m=><div className="lm-commerce-match" key={m.id}><div><strong>{m.match_name||'مباراة لمنا'}</strong><small>{m.kind==='free'?'مجانية':'مدفوعة'} — {m.status==='active'?'لم تنتهِ':'مكتملة'}</small></div>{m.status==='active'&&<button type="button" disabled={loading} onClick={()=>resume(m.id)}>متابعة</button>}</div>)}
       {wallet.user?.isAdmin&&<AdminReports/>}
       <button className="lm-commerce-signout" onClick={async()=>{
        try{
         const sessionToken=token();
         if(sessionToken)await fetch('https://lamna-wordless-sync.onrender.com/api/accounts/logout',{
          method:'POST',headers:{Authorization:'Bearer '+sessionToken,'Content-Type':'application/json'},body:'{}'
         });
        }catch{}
        finally{
         sessionStorage.removeItem('lamna-session');sessionStorage.removeItem('lamna-account-name');
         localStorage.removeItem('lamna-current-match-id');setWallet(null);onBack();
        }
       }}><LogOut size={16}/> تسجيل الخروج</button>
      </div>:null}
    {message&&<p className="lm-commerce-error" role="alert">{message}</p>}
   </>}
  </div>
 </main>;
}
