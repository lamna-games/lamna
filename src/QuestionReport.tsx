import React from 'react';
import {Flag, X, Send} from 'lucide-react';
import {storeRequest} from './storeApi';
import './questionReport.css';
const options=[{id:'question_error',label:'خطأ في السؤال'},{id:'answer_error',label:'خطأ في الإجابة'},{id:'image_unreadable',label:'صورة غير واضحة'},{id:'other',label:'ملاحظة أخرى'}];
export default function QuestionReport({matchId,questionNumber}:{matchId:string;questionNumber:number}){
 const [open,setOpen]=React.useState(false);
 const [reason,setReason]=React.useState('question_error');
 const [comment,setComment]=React.useState('');
 const [busy,setBusy]=React.useState(false);
 const [status,setStatus]=React.useState('');
 React.useEffect(()=>{setOpen(false);setStatus('');setReason('question_error');setComment('')},[matchId,questionNumber]);
 const submit=async(e:React.FormEvent)=>{e.preventDefault();if(busy)return;setBusy(true);setStatus('');
  try{
   const result=await storeRequest<{message:string}>('report','POST',{matchId,questionNumber,reason,comment});
   setStatus(result.message);setOpen(false);
  }catch(error){setStatus(error instanceof Error?error.message:'تعذر إرسال البلاغ.');}
  finally{setBusy(false)}
 };
 return <div className="lm-report-anchor">
  <button type="button" className="lm-report-trigger" onClick={()=>setOpen(x=>!x)} aria-label="بلّغ عن خطأ في السؤال"><Flag size={17} strokeWidth={2.3}/> <span>بلّغ</span></button>
  {open&&<div className="lm-report-panel" dir="rtl" role="region" aria-label="الإبلاغ عن سؤال">
   <header><strong>بلّغ عن السؤال</strong><button type="button" aria-label="إغلاق" onClick={()=>setOpen(false)}><X size={19}/></button></header>
   <p>نراجع بلاغك لتحسين الأسئلة. لن تتغير نقاط المباراة أو المؤقت.</p>
   <form onSubmit={submit}>
    <label>نوع الملاحظة<select value={reason} onChange={e=>setReason(e.target.value)}>{options.map(o=><option key={o.id} value={o.id}>{o.label}</option>)}</select></label>
    <label>تفاصيل إضافية (اختياري)<textarea maxLength={500} rows={2} value={comment} onChange={e=>setComment(e.target.value)} placeholder="اكتب ملاحظتك باختصار"/></label>
    <button type="submit" disabled={busy}><Send size={16}/>{busy?'جارٍ الإرسال…':'إرسال البلاغ'}</button>
   </form>
  </div>}
  {status&&!open&&<div className="lm-report-status" role="status" onClick={()=>setStatus('')}>{status}</div>}
 </div>;
}