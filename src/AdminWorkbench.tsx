import React from 'react';
import { categories } from './gameCatalog';
import { storeRequest, type QuizEntry } from './storeApi';
import AdminReports from './AdminReports';
import './adminWorkbench.css';

type Overview={
 metrics:{accounts:number;matches:number;paid_matches:number;open_reports:number;remaining_credits:number};
 audit:Array<{id:number;actor_id:string;action:string;entity:string;details:Record<string,unknown>;created_at:string}>;
};
type GameControl={game_id:number;disabled:boolean;reason:string;updated_at:string};
type QuestionSet={questions:QuizEntry[];editedIds:string[]};
export default function AdminWorkbench(){
 const [overview,setOverview]=React.useState<Overview|null>(null);
 const [controls,setControls]=React.useState<GameControl[]>([]);
 const [gameId,setGameId]=React.useState(0);
 const [kind,setKind]=React.useState<'free'|'paid'>('paid');
 const [questions,setQuestions]=React.useState<QuizEntry[]>([]);
 const [editedIds,setEditedIds]=React.useState<string[]>([]);
 const [index,setIndex]=React.useState(0);
 const [prompt,setPrompt]=React.useState('');
 const [answer,setAnswer]=React.useState('');
 const [hint,setHint]=React.useState('');
 const [reason,setReason]=React.useState('');
 const [working,setWorking]=React.useState(false);
 const [loading,setLoading]=React.useState(false);
 const [message,setMessage]=React.useState('');
 const [error,setError]=React.useState('');
 const current=questions[index];
 const suspended=controls.find(c=>c.game_id===gameId)?.disabled===true;

 const refreshMeta=React.useCallback(async()=>{
  const [report,games]=await Promise.all([
   storeRequest<Overview>('admin/overview'),
   storeRequest<{games:GameControl[]}>('admin/games')
  ]);
  setOverview(report);setControls(games.games);
 },[]);
 const refreshQuestions=React.useCallback(async()=>{
  const result=await storeRequest<QuestionSet>('admin/questions?gameId='+gameId+'&kind='+kind);
  setQuestions(result.questions);
  setEditedIds(result.editedIds);
 },[gameId,kind]);
 React.useEffect(()=>{
  let alive=true;setLoading(true);setError('');
  Promise.all([
   storeRequest<Overview>('admin/overview'),
   storeRequest<{games:GameControl[]}>('admin/games')
  ]).then(([report,games])=>{if(alive){setOverview(report);setControls(games.games);}})
   .catch(err=>{if(alive)setError(err instanceof Error?err.message:'تعذر تحميل لوحة الإدارة.')})
   .finally(()=>{if(alive)setLoading(false)});
  return()=>{alive=false};
 },[]);
 React.useEffect(()=>{
  let alive=true;setLoading(true);setError('');setMessage('');setIndex(0);
  storeRequest<QuestionSet>('admin/questions?gameId='+gameId+'&kind='+kind)
   .then(result=>{if(alive){setQuestions(result.questions);setEditedIds(result.editedIds);}})
   .catch(err=>{if(alive)setError(err instanceof Error?err.message:'تعذر تحميل الأسئلة.')})
   .finally(()=>{if(alive)setLoading(false)});
  return()=>{alive=false};
 },[gameId,kind]);
 React.useEffect(()=>{
  setPrompt(current?.prompt||'');setAnswer(current?.answer||'');setHint(current?.hint||'');
 },[current?.id,current?.prompt,current?.answer,current?.hint]);

 const changeQuestion=async(restore=false)=>{
  if(!current||working)return;
  setWorking(true);setError('');setMessage('');
  try{
   await storeRequest('admin/question','POST',{
    gameId,kind,index,restore,prompt:prompt.trim(),answer:answer.trim(),hint:hint.trim()
   });
   await Promise.all([refreshQuestions(),refreshMeta()]);
   setMessage(restore?'تمت استعادة السؤال الأصلي وتوثيق العملية.':'حُفظ تعديل السؤال وتوثّق في سجل الإدارة.');
  }catch(err){setError(err instanceof Error?err.message:'تعذر حفظ السؤال.')}
  finally{setWorking(false);}
 };
 const changeGame=async()=>{
  if(working)return;setWorking(true);setError('');setMessage('');
  try{
   await storeRequest('admin/game','POST',{gameId,disabled:!suspended,reason});
   await refreshMeta();
   setMessage(suspended?'أُعيد فتح اللعبة للمباريات الجديدة.':'أُوقفت اللعبة عن المباريات الجديدة مؤقتًا.');
  }catch(err){setError(err instanceof Error?err.message:'تعذر تحديث حالة اللعبة.')}
  finally{setWorking(false);}
 };
 return <section className="lm-admin-workbench" dir="rtl" aria-label="لوحة إدارة لمنا">
  <h2>لوحة إدارة لمنا</h2>
  <p>إدارة آمنة للأسئلة والألعاب والبلاغات. تظهر هذه الأدوات للحساب المخوّل فقط؛ التغييرات لا تعدّل المباريات المحفوظة.</p>
  {overview&&<div className="lm-admin-stats">
   <div><small>الحسابات</small><strong>{overview.metrics.accounts}</strong></div>
   <div><small>المباريات</small><strong>{overview.metrics.matches}</strong></div>
   <div><small>المدفوعة</small><strong>{overview.metrics.paid_matches}</strong></div>
   <div><small>بلاغات مفتوحة</small><strong>{overview.metrics.open_reports}</strong></div>
   <div><small>الرصيد المتبقي</small><strong>{overview.metrics.remaining_credits}</strong></div>
  </div>}
  <div className="lm-admin-edit">
   <h3>الألعاب والأسئلة</h3>
   <div className="lm-admin-row">
    <label>اللعبة
     <select value={gameId} onChange={e=>setGameId(Number(e.target.value))}>
      {categories.map((name,id)=><option key={id} value={id}>{name}</option>)}
     </select>
    </label>
    <label>بنك الأسئلة
     <select value={kind} onChange={e=>setKind(e.target.value as 'free'|'paid')}>
      <option value="paid">المدفوعة (12 سؤالًا)</option>
      <option value="free">المجانية (6 أسئلة)</option>
     </select>
    </label>
   </div>
   <div className="lm-admin-game">
    <strong>حالة اللعبة: {suspended?'موقوفة مؤقتًا':'مفتوحة'}</strong>
    <label>سبب الإيقاف (اختياري)
     <input value={reason} maxLength={200} onChange={e=>setReason(e.target.value)} placeholder="مثال: مراجعة محتوى الأسئلة"/>
    </label>
    <button type="button" disabled={working||loading} onClick={changeGame}>{suspended?'إعادة فتح اللعبة':'إيقاف اللعبة عن المباريات الجديدة'}</button>
   </div>
   {questions.length>0&&<div className="lm-admin-editor">
    <label>السؤال المراد مراجعته
     <select value={index} onChange={e=>setIndex(Number(e.target.value))}>
      {questions.map((q,i)=><option key={q.id} value={i}>السؤال {i+1} — {kind==='paid'?[200,400,600][Math.floor(i/4)]:[200,400,600][Math.floor(i/2)]} نقطة{editedIds.includes(q.id)?' (معدّل)':''}</option>)}
     </select>
    </label>
    <label>نص السؤال<textarea rows={3} maxLength={400} value={prompt} onChange={e=>setPrompt(e.target.value)} /></label>
    <label>الإجابة الصحيحة<input maxLength={180} value={answer} onChange={e=>setAnswer(e.target.value)}/></label>
    <label>التلميح<input maxLength={180} value={hint} onChange={e=>setHint(e.target.value)}/></label>
    <div className="lm-admin-actions">
     <button type="button" disabled={working||loading||!prompt.trim()||!answer.trim()||!hint.trim()} onClick={()=>changeQuestion(false)}>حفظ التعديل</button>
     <button type="button" disabled={working||loading||!current||!editedIds.includes(current.id)} onClick={()=>changeQuestion(true)}>استعادة الأصل</button>
    </div>
   </div>}
   {loading&&<p>جارٍ تحميل بيانات الإدارة…</p>}
   {error&&<p role="alert" className="lm-admin-error">{error}</p>}
   {message&&<p role="status" className="lm-admin-success">{message}</p>}
  </div>
  <AdminReports/>
  <div className="lm-admin-audit">
   <h3>آخر عمليات الإدارة</h3>
   {!overview?.audit?.length?<p>لا توجد عمليات إدارية مسجلة.</p>:
    <div className="lm-admin-audit-list">{overview.audit.map(item=>
     <div key={item.id}><strong>{item.action==='edit_question'?'تعديل سؤال':item.action==='restore_question'?'استعادة سؤال':item.action==='set_game_status'?'تغيير حالة لعبة':item.action==='resolve_report'?'مراجعة بلاغ':item.action}</strong>
      <span>{item.entity} — {new Date(item.created_at).toLocaleString('ar-SA')}</span>
     </div>
    )}</div>}
  </div>
 </section>;
}
