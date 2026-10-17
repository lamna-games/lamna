import React, { useState } from 'react';
import './site.css';
import './boardLayout.css';
import CartoonCover from './CartoonCover';
import { getQuestion, wordlessModeCount } from './quizData';
const categories = [
  'معلومات عامة',
  'ولا كلمة',
  'زووم',
  'مسلسلات وأفلام',
  'كرة القدم',
  'أغاني وفنانين',
  'أمثال شعبية',
  'من أنا؟',
  'ترتيب الأحداث',
  'ألغاز وذكاء',
  'تاريخ السعودية',
  'أعلام ودول',
  'وش الناقص؟',
  'خمن الشعار',
  'صح أو خطأ',
  'أكلات ومطاعم',
  'ذاكرة الصورة',
  'أكمل العبارة',
  'رياضة منوعة',
  'تحدي السرعة',
];
const icons = [
  '🎭',
  '🔎',
  '💡',
  '🎬',
  '⚽',
  '🎵',
  '📜',
  '🕵️',
  '🔢',
  '🧩',
  '🇸🇦',
  '🌍',
  '🧠',
  '🎯',
  '⚡',
  '🍽️',
  '🖼️',
  '✍️',
  '🏆',
  '⏱️',
];
type Page = 'home' | 'categories' | 'setup' | 'game' | 'pricing' | 'account';
function Cover({i,title}:{i:number,title:string}) { return <CartoonCover i={i} title={title}/>; }
function App() {
  const [page, setPage] = useState<Page>('home');
  const [selected, setSelected] = useState<number[]>([]);
  const [teams, setTeams] = useState(['الفريق الأول', 'الفريق الثاني']);
  const [turn, setTurn] = useState(0);
  const [scores, setScores] = useState([0, 0]);
  const [used, setUsed] = useState<number[]>([]);
  const [active, setActive] = useState<number | null>(null);
  const [reveal, setReveal] = useState(false);
  const [logoOk, setLogoOk] = useState(true);
  const [help, setHelp] = useState([2, 2]);
  const [showHelp, setShowHelp] = useState(false); const [showHint,setShowHint]=useState(false); const [hydrated,setHydrated]=useState(false); const [showResult,setShowResult]=useState(false); const [history,setHistory]=useState<{team:number|null;points:number;question:number}[]>([]); const [phase,setPhase]=useState<'question'|'steal'|'var'>('question'); const [seconds,setSeconds]=useState(60); const [paused,setPaused]=useState(false); const [varUsed,setVarUsed]=useState([false,false]); const [varTeam,setVarTeam]=useState(0); const [phaseBeforeVar,setPhaseBeforeVar]=useState<'question'|'steal'>('question'); const [stealFrom,setStealFrom]=useState(0); React.useEffect(()=>{if(active===null||paused||phase==='var')return;const id=window.setInterval(()=>setSeconds(s=>Math.max(0,s-1)),1000);return()=>window.clearInterval(id)},[active,paused,phase]); React.useEffect(()=>{if(active===null||seconds!==0)return;if(phase==='question'){setStealFrom(turn);setPhase('steal');setSeconds(10)}else if(phase==='steal'){award(null)}},[seconds,active,phase]); const startSteal=()=>{setStealFrom(turn);setPhase('steal');setSeconds(10);setPaused(false)}; const openVar=(i:number)=>{if(varUsed[i])return;setVarTeam(i);setVarUsed(v=>v.map((x,j)=>j===i?true:x));setPhaseBeforeVar(phase==='steal'?'steal':'question');setPhase('var');setPaused(true)};
  React.useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('lamna-demo-match-v2') || 'null');
      if (saved && Array.isArray(saved.selected) && saved.selected.length === 6) {
        setSelected(saved.selected); setTeams(saved.teams); setTurn(saved.turn);
        setScores(saved.scores); setUsed(saved.used); setHistory(saved.history || []);
        setHelp(saved.help || [2, 2]); setVarUsed(saved.varUsed || [false, false]);
        setActive(saved.active ?? null); setPhase(saved.phase || 'question');
        setSeconds(saved.seconds ?? 60); setStealFrom(saved.stealFrom ?? 0);
        setShowResult(!!saved.showResult); setPaused(true);
      }
    } catch { /* Invalid old browser data is ignored. */ }
    setHydrated(true);
  }, []);
  React.useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem('lamna-demo-match-v2', JSON.stringify({
        selected, teams, turn, scores, used, history, help, varUsed,
        active, phase, seconds, stealFrom, showResult
      }));
    } catch { /* Private mode may block storage. */ }
  }, [hydrated, selected, teams, turn, scores, used, history, help, varUsed, active, phase, seconds, stealFrom, showResult]);
  const currentQuestion = active === null ? null : getQuestion(selected[Math.floor(active / 6)], active % 6);
  const go = (p: Page) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const choose = (i: number) =>
    setSelected(v =>
      v.includes(i) ? v.filter(x => x !== i) : v.length < 6 ? [...v, i] : v
    );
  const award = (team: number | null) => {
    if (active === null) return;
    const pts = [200, 400, 600][Math.floor((active % 6) / 2)];
    if (team !== null)
      setScores(v => v.map((x, i) => (i === team ? x + pts : x)));
    setHistory(v=>[...v,{team,points:pts,question:active}]); setUsed(v => [...v, active]);
    setActive(null);
    setReveal(false);
    setTurn(v => 1 - v);
    setShowHelp(false);setShowHint(false);setPhase('question');setSeconds(60);setPaused(false); if(used.length===35)setShowResult(true);
  };
  const brand = (
    <div className="brand">
      {logoOk ? (
        <img
          src="/resources/lamna-original.webp"
          alt="شعار لمنا"
          onError={() => setLogoOk(false)}
        />
      ) : (
        <div className="brand-fallback">
          <strong>لمنا</strong>
          <span>ألعاب تجمعنا</span>
        </div>
      )}
    </div>
  );
  return (
    <div className="site" dir="rtl">
      <header className="header">
        <div onClick={() => go('home')} className="brand-link">
          {brand}
        </div>
        <nav>
          <button onClick={() => go('home')}>الرئيسية</button>
          <button onClick={() => go('categories')}>الفئات</button>
          <button onClick={() => go('pricing')}>الباقات</button>
          <button onClick={() => go('account')}>حسابي</button>
        </nav>
      </header>
      {page === 'home' && (
        <>
          <section className="hero">
            <div className="hero-copy">
              <span className="eyebrow">تجربة مجانية • ألعاب تجمعنا</span>
              <h1>
                جمعتكم أحلى
                <br />
                <em>مع لمنا!</em>
              </h1>
              <p>
                اختاروا 6 فئات، قسموا نفسكم فريقين، وخوضوا تحدّي 36 سؤال مليان
                حماس ووناسة.
              </p>
              <div className="actions">
                {selected.length === 6 && (used.length > 0 || active !== null) && !showResult && <button className="resume-button" onClick={() => { setPaused(true); go('game'); }}>متابعة المباراة المحفوظة ({36 - used.length} سؤال متبقٍ)</button>}
                <button className="primary" onClick={() => go('categories')}>
                  ابدأ اللعب مجانًا <span>←</span>
                </button>
                <button className="outline" onClick={() => go('pricing')}>
                  شوف الباقات
                </button>
              </div>
              <div className="facts">
                <span>٢٠ فئة متنوعة</span>
                <span>٣٦ سؤال</span>
                <span>فريقان</span>
              </div>
            </div>
            <div className="hero-visual">
              <div className="shape-yellow" />
              <div className="shape-coral" />
              <div className="visual-card">
                <div className="spark">✦</div>
                <div className="visual-title">وقت الوناسة!</div>
                <div className="visual-text">سؤال • تحدّي • ضحك</div>
                <div className="score-mini">
                  <span>
                    الفريق الأول <b>٦٠٠</b>
                  </span>
                  <span>
                    الفريق الثاني <b>٤٠٠</b>
                  </span>
                </div>
              </div>
              <span className="float a">🏆</span>
              <span className="float b">🎭</span>
              <span className="float c">⚡</span>
            </div>
          </section>
          <section className="section">
            <div className="section-top">
              <div>
                <span className="kicker">اختاروا جوكم</span>
                <h2>فئات تناسب كل جمعة</h2>
              </div>
              <button className="text-btn" onClick={() => go('categories')}>
                جميع الفئات ←
              </button>
            </div>
            <div className="categories">
              {categories.slice(0, 8).map((c, i) => (
                <button
                  className="category"
                  key={c}
                  onClick={() => {
                    setSelected([i]);
                    go('categories');
                  }}
                >
                  <Cover i={i} title={c}/>
                  <strong>{c}</strong>
                  <small>اكتشف الفئة ←</small>
                </button>
              ))}
            </div>
          </section>
          <section className="steps">
            <h2>كيف تلعبون؟</h2>
            <div className="step-grid">
              {[
                ['١', 'اختاروا ٦ فئات', 'من مكتبة ألعاب متنوعة'],
                ['٢', 'سمّوا الفريقين', 'جهّزوا المنافسة بينكم'],
                ['٣', 'ابدأوا التحدّي', '٣٦ سؤال بنقاط ٢٠٠ و٤٠٠ و٦٠٠'],
              ].map(s => (
                <div className="step" key={s[0]}>
                  <span>{s[0]}</span>
                  <h3>{s[1]}</h3>
                  <p>{s[2]}</p>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
      {page === 'categories' && (
        <section className="section narrow">
          <span className="kicker">جهّز مباراتك</span>
          <h1>اختاروا ٦ فئات</h1>
          <p className="muted">
            اختاروا الفئات اللي تحبونها، ثم انتقلوا لتجهيز الفريقين.
          </p>
          <div className="progress">
            <div style={{ width: (selected.length / 6) * 100 + '%' }} />
          </div>
          <p className="selection-count">
            تم اختيار {selected.length} من ٦ فئات
          </p>
          <div className="categories">
            {categories.map((c, i) => (
              <button
                className={'category ' + (selected.includes(i) ? 'chosen' : '')}
                key={c}
                onClick={() => choose(i)}
              >
                <Cover i={i} title={c}/>
                <strong>{c}</strong>
                <small>
                  {selected.includes(i) ? '✓ تم الاختيار' : 'اضغط للاختيار'}
                </small>
              </button>
            ))}
          </div>
          <div className="sticky-actions">
            <button
              className="primary"
              disabled={selected.length !== 6}
              onClick={() => go('setup')}
            >
              التالي: تجهيز الفريقين ←
            </button>
          </div>
        </section>
      )}
      {page === 'setup' && (
        <section className="section narrow">
          <span className="kicker">قبل البداية</span>
          <h1>مين بيتحدّى مين؟</h1>
          <div className="setup-card">
            <label>
              اسم الفريق الأول
              <input
                value={teams[0]}
                maxLength={25}
                onChange={e => setTeams(v => [e.target.value, v[1]])}
              />
            </label>
            <label>
              اسم الفريق الثاني
              <input
                value={teams[1]}
                maxLength={25}
                onChange={e => setTeams(v => [v[0], e.target.value])}
              />
            </label>
            <p className="muted">
              هذه مباراة تجريبية بأسئلة نموذجية للتأكد من طريقة اللعب، وليست
              مكتبة الأسئلة النهائية.
            </p>
            <button
              className="primary"
              onClick={() => {
                setScores([0, 0]);setShowResult(false);setHistory([]);setShowHint(false);
                setUsed([]);
                setTurn(0);
                setHelp([2, 2]);setVarUsed([false,false]);setActive(null);setPhase('question');setSeconds(60);
                go('game');
              }}
            >
              ابدأ المباراة ←
            </button>
          </div>
        </section>
      )}
      {page === 'game' && (
        <section className="section game-section">
          <div className="game-heading">
            <span className="kicker">مباراة تجريبية</span>
            <h1>لوحة التحدّي</h1>
            <p className="muted">نسخة تجريبية: ٦ أسئلة مختلفة لكل فئة، و{wordlessModeCount} طرق لعب في «ولا كلمة». المحتوى المرئي والصوتي النهائي قيد التطوير.</p>
          </div>
          <div className="scoreboard">
            {teams.map((t, i) => (
              <div className={'team ' + (turn === i ? 'current' : '')} key={i}>
                <small>{turn === i ? '● الدور الحالي' : 'الفريق'}</small>
                <strong>{t || 'فريق ' + (i + 1)}</strong>
                <b>
                  {scores[i]} <small>نقطة</small>
                </b>
              </div>
            ))}
          </div>
          <div className="game-board">
            {selected.map((id, col) => (
              <div className="board-column" key={id}>
                <div className="board-cat">{categories[id]}</div>
                <div className="board-cover"><Cover i={id} title={categories[id]}/></div>
                <div className="board-points">{Array.from({ length: 6 }, (_, row) => {
                  const n = col * 6 + row;
                  return (
                    <button
                      disabled={used.includes(n)||active!==null}
                      onClick={() => {
                        setActive(n);
                        setReveal(false);setShowHelp(false);setShowHint(false);setPhase('question');setSeconds(60);setPaused(false);
                      }}
                      key={n}
                    >
                      {used.includes(n)
                        ? '✓'
                        : [200, 400, 600][Math.floor(row / 2)]}
                    </button>
                  );
                })}</div>
              </div>
            ))}
          </div>
          <div className="game-bottom"><button className="outline" disabled={!history.length||active!==null} onClick={()=>{const h=history[history.length-1];setHistory(v=>v.slice(0,-1));setUsed(v=>v.filter(x=>x!==h.question));setTurn(v=>1-v);if(h.team!==null)setScores(v=>v.map((s,i)=>i===h.team?s-h.points:s));setShowResult(false)}}>↶ تراجع عن آخر نتيجة</button>
            <span>المتبقي: {36 - used.length} سؤال</span>
            <button className="outline" onClick={() => go('home')}>
              إنهاء التجربة
            </button>
          </div>
          {showResult && active===null && <div className="modal-back"><div className="question-modal result-modal"><span className="kicker">نهاية المباراة</span><h2>{scores[0]===scores[1]?'تعادل الفريقين!':'الفائز: '+teams[scores[0]>scores[1]?0:1]+' 🏆'}</h2><p>{teams[0]}: {scores[0]} نقطة — {teams[1]}: {scores[1]} نقطة</p><p>أُنجزت 36 جولة</p><div className="modal-actions"><button className="primary" onClick={()=>{setShowResult(false);go('setup')}}>مباراة جديدة</button><button className="outline" onClick={()=>{setShowResult(false);go('home')}}>الرئيسية</button></div></div></div>}
          {active !== null && (
            <div className="modal-back">
              <div className="question-modal">
                <span className="kicker">
                  سؤال بقيمة {[200, 400, 600][Math.floor((active % 6) / 2)]}{' '}
                  نقطة
                </span>
                <div className="quiz-timer">{phase==='var'?'مراجعة VAR':phase==='steal'?'فرصة السرقة للفريق الثاني':'وقت السؤال'} — {seconds} ثانية <button className="outline" onClick={()=>setPaused(v=>!v)} disabled={phase==='var'}>{paused?'استئناف':'إيقاف'}</button></div>{currentQuestion?.mode && <div className="wordless-mode"><strong>{currentQuestion.mode}</strong><p>{currentQuestion.instructions}</p><small>بطاقة الأداء: اعرض المطلوب للمؤدي وحده، ولا تُظهر الشاشة لبقية الفريق.</small></div>}<h2>{currentQuestion?.prompt}</h2>
                <p>الفئة: {categories[selected[Math.floor(active/6)]]} — دور: {teams[phase==='steal'?1-stealFrom:turn]}</p>
                {reveal ? (
                  <div className="answer">الإجابة: {currentQuestion?.answer}</div>
                ) : (
                  <button className="outline" onClick={() => setReveal(true)}>
                    عرض الإجابة
                  </button>
                )}
                <div className="modal-actions">{phase==='var'?<div><strong>مراجعة VAR للفريق: {teams[varTeam]}</strong><button className="primary" onClick={()=>{setPhase(phaseBeforeVar);setPaused(false)}}>اعتماد المراجعة والعودة للسؤال</button></div>:null}
                  <button className="primary" disabled={phase==='var'} onClick={() => award(phase==='steal'?1-stealFrom:turn)}>
                    إجابة صحيحة ✓
                  </button>
                  <button className="outline" disabled={phase==='var'} onClick={() => phase==='question' ? startSteal() : award(null)}>{phase==='question'?'لم يجب الفريق — فرصة للخصم':'لا أحد أجاب'}</button>
                  {phase==='question'&&<button className="outline" onClick={startSteal}>إجابة خاطئة — سرقة 10 ثوانٍ</button>}{phase==='steal'&&<span>السرقة متاحة للفريق: {teams[1-stealFrom]}</span>}{teams.map((t,i)=><button key={i} className="outline" disabled={varUsed[i]} onClick={()=>openVar(i)}>VAR {t} {varUsed[i]?'(استُخدم)':''}</button>)}<button
                    className="outline"
                    onClick={() => {
                      setActive(null);
                      setReveal(false);setShowHint(false);setPaused(true);
                    }}
                  >
                    رجوع
                  </button>
                </div>
                <button className="help" onClick={() => setShowHelp(v => !v)}>
                  وسائل المساعدة ({help[phase==='steal'?1-stealFrom:turn]})
                </button>
                {showHint && <div className="answer">تلميح: {currentQuestion?.hint}</div>}
                {showHelp && <div className="help-options"><p>تلميح واحد مقابل مساعدة واحدة. لا يكشف الإجابة.</p><button className="outline" disabled={help[phase==='steal'?1-stealFrom:turn]===0||showHint} onClick={()=>{const t=phase==='steal'?1-stealFrom:turn;setHelp(v=>v.map((x,i)=>i===t?x-1:x));setShowHint(true);setShowHelp(false)}}>استخدم مساعدة — عرض تلميح</button></div>}
              </div>
            </div>
          )}
        </section>
      )}
      {page === 'pricing' && (
        <section className="section narrow">
          <span className="kicker">باقات لمنا</span>
          <h1>اختار الباقة اللي تناسب جمعتكم</h1>
          <p className="muted">
            الأسعار للعرض فقط؛ الدفع غير مفعّل في هذه النسخة.
          </p>
          <div className="plans">
            {[
              [1, 9],
              [5, 19],
              [10, 29],
            ].map(([count, price], i) => (
              <div
                className={'plan ' + (i === 2 ? 'featured' : '')}
                key={count}
              >
                <span>{i === 2 ? 'الأوفر ✨' : 'باقة اللعب'}</span>
                <h2>
                  {count} {count === 1 ? 'مباراة' : 'مباريات'}
                </h2>
                <div className="price">
                  {price} <small>ريال</small>
                </div>
                <p>اختر ٦ فئات في كل مباراة</p>
                <button disabled>الدفع قريبًا</button>
              </div>
            ))}
          </div>
        </section>
      )}
      {page === 'account' && (
        <section className="section narrow">
          <span className="kicker">حساب لمنا</span>
          <h1>حياك في لمنا</h1>
          <div className="setup-card">
            <p>
              تسجيل الدخول برقم الجوال أو البريد الإلكتروني سيكون متاحًا بعد ربط
              النظام الآمن.
            </p>
            <p className="muted">
              ما راح نطلب منك بيانات شخصية في هذه المعاينة.
            </p>
            <button className="primary" onClick={() => go('categories')}>
              جرّب اختيار الفئات ←
            </button>
          </div>
        </section>
      )}
      <footer>
        <div>{brand}</div>
        <p>لمنا — ألعاب تجمعنا</p>
        <small>نسخة مستقلة تجريبية • بدون دفع أو تسجيل حقيقي</small>
      </footer>
    </div>
  );
}
export default App;
