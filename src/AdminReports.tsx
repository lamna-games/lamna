import React from 'react';
import { ClipboardList, CheckCircle2 } from 'lucide-react';
import { storeRequest } from './storeApi';
import './adminReports.css';
type Report={id:string;matchName:string;reason:string;comment:string;createdAt:string;resolvedAt:string|null;category:number;questionNumber:number;prompt:string;answer:string};
const reasonTitle:Record<string,string>={question_error:'خطأ في السؤال',answer_error:'خطأ في الإجابة',image_unreadable:'الصورة غير واضحة',other:'ملاحظة أخرى'};
export default function AdminReports(){
 const [reports,setReports]=React.useState<Report[]>([]);
 const [loading,setLoading]=React.useState(true);
 const [error,setError]=React.useState('');
 const [working,setWorking]=React.useState('');
 const load=()=>{setLoading(true);storeRequest<{reports:Report[]}>('admin/reports')
  .then(d=>setReports(d.reports)).catch(e=>setError(e instanceof Error?e.message:'تعذر تحميل البلاغات')).finally(()=>setLoading(false));};
 React.useEffect(()=>{load()},[]);
 const resolve=async(id:string)=>{try{setWorking(id);await storeRequest('admin/resolve','POST',{reportId:id});await load()}
  catch(e){setError(e instanceof Error?e.message:'تعذر تحديث البلاغ')}
  finally{setWorking('')}
 };
 return <section className="lm-admin-reports" dir="rtl">
  <h2><ClipboardList size={22}/> بلاغات الأسئلة — إدارة لمنا</h2>
  <p>هذه الصفحة لا تظهر إلا للحساب الذي مُنح صلاحية الإدارة في قاعدة البيانات. البلاغ لا يغير السؤال تلقائيًا؛ راجع المحتوى قبل تعديله.</p>
  {loading&&<p>جارٍ تحميل البلاغات…</p>}
  {error&&<p role="alert">{error}</p>}
  {!loading&&reports.length===0&&<p>لا توجد بلاغات حتى الآن.</p>}
  {reports.map(r=><article className="lm-admin-report" key={r.id}>
   <header><strong>{reasonTitle[r.reason]||'ملاحظة'}</strong><span>{r.resolvedAt?'تمت المراجعة':'بانتظار المراجعة'}</span></header>
   <p><b>المباراة:</b> {r.matchName}</p>
   <p><b>السؤال:</b> {r.prompt}</p><p><b>الإجابة:</b> {r.answer}</p>
   {r.comment&&<p><b>تعليق اللاعب:</b> {r.comment}</p>}
   {!r.resolvedAt&&<button type="button" disabled={working===r.id} onClick={()=>resolve(r.id)}><CheckCircle2 size={16}/> {working===r.id?'جارٍ الحفظ…':'تمت المراجعة'}</button>}
  </article>)}
 </section>;
}
