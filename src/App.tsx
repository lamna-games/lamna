import React, { useState } from 'react';
import { Phone, Hand, Repeat2, Bomb, MessageSquareText } from 'lucide-react';
import './site.css';
import './boardLayout.css';
import CartoonCover from './CartoonCover';
import { getQuestion, wordlessModeCount } from './quizData';
import { WordlessTV } from './Wordless';
import WinnerScreen from './WinnerScreen';
import OfficialLogo from './OfficialLogo';
import SocialLinks from './SocialLinks';
import AuthScreen from './AuthScreen';
import { Plus, ArrowLeft, Sparkles, UsersRound, Grid2X2, Trophy, ChevronLeft, Check, Play } from 'lucide-react';
import './landing.css';
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
type AidId = 'phone' | 'two' | 'rest' | 'pit' | 'trap';
const aidCatalog: { id: AidId; name: string; info: string }[] = [
  { id:'phone', name:'اتصال بصديق', info:'استعن بصديق 30 ثانية أثناء السؤال' },
  { id:'two', name:'جاوب جوابين', info:'يسمح للفريق بمحاولتين بدل محاولة' },
  { id:'rest', name:'استريح', info:'امنع لاعبًا من الخصم من المشاركة في هذا السؤال' },
  { id:'pit', name:'الحفرة', info:'إذا أجبت صح يُخصم مثل نقاط السؤال من الخصم' },
  { id:'trap', name:'الفخ', info:'حوّل السؤال للخصم؛ إذا لم يجب تُخصم منه نقاط السؤال' },
];
function AidGlyph({ id, size=26 }: { id:AidId; size?:number }) {
  if(id==='phone')return <Phone size={size}/>;
  if(id==='two')return <MessageSquareText size={size}/>;
  if(id==='rest')return <Hand size={size}/>;
  if(id==='pit')return <Repeat2 size={size}/>;
  return <Bomb size={size}/>;
}
function App() {
  const [page, setPage] = useState<Page>('home');
  const [authMode,setAuthMode] = useState<'register'|'login'>('register');
  const [selected, setSelected] = useState<number[]>([]);
  const [teams, setTeams] = useState(['الفريق الأول', 'الفريق الثاني']);
  const [matchName,setMatchName] = useState('');
  const [chosenAids,setChosenAids] = useState<AidId[][]>([[],[]]);
  const [usedAids,setUsedAids] = useState<AidId[][]>([[],[]]);
  const [aidEffect,setAidEffect] = useState<AidId|null>(null);
  const [aidOwner,setAidOwner] = useState<number|null>(null);
  const [twoAttemptsLeft,setTwoAttemptsLeft] = useState(2);
  const [restingPlayer,setRestingPlayer] = useState('');
  const [turn, setTurn] = useState(0);
  const [scores, setScores] = useState([0, 0]);
  const [used, setUsed] = useState<number[]>([]);
  const [active, setActive] = useState<number | null>(null);
  const [reveal, setReveal] = useState(false);
  const [pickWinner, setPickWinner] = useState(false);
  const [logoOk, setLogoOk] = useState(true);
  const [help, setHelp] = useState([2, 2]);
  const [showHelp, setShowHelp] = useState(false); const [showHint,setShowHint]=useState(false); const [hydrated,setHydrated]=useState(false); const [showResult,setShowResult]=useState(false); const [history,setHistory]=useState<{team:number|null;points:number;question:number;changes?:number[]}[]>([]); const [phase,setPhase]=useState<'question'|'steal'|'var'>('question'); const [seconds,setSeconds]=useState(60); const [paused,setPaused]=useState(false); const [varUsed,setVarUsed]=useState([false,false]); const [varTeam,setVarTeam]=useState(0); const [phaseBeforeVar,setPhaseBeforeVar]=useState<'question'|'steal'>('question'); const [stealFrom,setStealFrom]=useState(0); React.useEffect(()=>{if(active===null||paused||phase==='var')return;const id=window.setInterval(()=>setSeconds(s=>Math.max(0,s-1)),1000);return()=>window.clearInterval(id)},[active,paused,phase]); React.useEffect(()=>{if(active===null||seconds!==0||selected[Math.floor(active/6)]===1)return;if(phase==='question'){setStealFrom(turn);setPhase('steal');setSeconds(10)}else if(phase==='steal'){award(null)}},[seconds,active,phase]); const startSteal=()=>{setStealFrom(turn);setPhase('steal');setSeconds(10);setPaused(false)}; const openVar=(i:number)=>{if(varUsed[i])return;setVarTeam(i);setVarUsed(v=>v.map((x,j)=>j===i?true:x));setPhaseBeforeVar(phase==='steal'?'steal':'question');setPhase('var');setPaused(true)};
  React.useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('lamna-demo-match-v2') || 'null');
      if (saved && Array.isArray(saved.selected) && saved.selected.length === 6) {
        setSelected(saved.selected); setTeams(saved.teams); setTurn(saved.turn);
        setScores(saved.scores); setUsed(saved.used); setHistory(saved.history || []);
        setHelp(saved.help || [2, 2]); setVarUsed(saved.varUsed || [false, false]);
        if(typeof saved.matchName==='string')setMatchName(saved.matchName);
        if(Array.isArray(saved.chosenAids)&&saved.chosenAids.length===2)setChosenAids(saved.chosenAids);
        if(Array.isArray(saved.usedAids)&&saved.usedAids.length===2)setUsedAids(saved.usedAids);
        setAidEffect(saved.aidEffect||null);setAidOwner(saved.aidOwner??null);
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
        active, phase, seconds, stealFrom, showResult, matchName, chosenAids, usedAids, aidEffect, aidOwner
      }));
    } catch { /* Private mode may block storage. */ }
  }, [hydrated, selected, teams, turn, scores, used, history, help, varUsed, active, phase, seconds, stealFrom, showResult, matchName, chosenAids, usedAids, aidEffect, aidOwner]);
  const currentQuestion = active === null ? null : getQuestion(selected[Math.floor(active / 6)], active % 6);
  const isWordlessQuestion = active!==null && selected[Math.floor(active/6)]===1;
  const toggleAid = (team:number,aid:AidId) => {
    setChosenAids(prev=>prev.map((list,i)=>i!==team?list:list.includes(aid)?list.filter(x=>x!==aid):list.length<3?[...list,aid]:list));
  };
  const activateAid = (team:number,aid:AidId) => {
    if(active===null||reveal||pickWinner||phase==='var'||usedAids[team]?.includes(aid)||!chosenAids[team]?.includes(aid)||team!==(phase==='steal'?1-stealFrom:turn)||aidEffect!==null)return;
    setUsedAids(prev=>prev.map((list,i)=>i===team?[...list,aid]:list));
    setAidEffect(aid);setAidOwner(team);setShowHelp(false);
    if(aid==='two')setTwoAttemptsLeft(2);
    if(aid==='rest')setRestingPlayer('');
    if(aid==='phone'){setSeconds(v=>v+30);setPaused(false);}
    if(aid==='trap'){setStealFrom(team);setPhase('steal');setSeconds(10);setPaused(false);}
  };
  const go = (p: Page) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const choose = (i: number) => {
    const completesLineup = page==='home' && selected.length===5 && !selected.includes(i);
    setSelected(v => v.includes(i) ? v.filter(x => x !== i) : v.length < 6 ? [...v, i] : v);
    if(completesLineup) window.setTimeout(() => document.getElementById('lm-setup-teams')?.scrollIntoView({behavior:'smooth',block:'start'}), 280);
  };
  const scrollToGames = () => {
    if (page === 'home') {
      document.getElementById('lm-all-games')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      go('home');
      window.setTimeout(() => document.getElementById('lm-all-games')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 90);
    }
  };
  const award = (team: number | null) => {
    if(active===null)return;
    const pts=[200,400,600][Math.floor((active%6)/2)];
    const change=[0,0];
    if(team!==null)change[team]+=pts;
    if(aidEffect==='pit'&&aidOwner!==null&&team===aidOwner)change[1-team]-=pts;
    if(aidEffect==='trap'&&aidOwner!==null&&team===null)change[1-aidOwner]-=pts;
    const updatedScores=scores.map((score,i)=>Math.max(0,score+change[i]));
    const actualChanges=updatedScores.map((score,i)=>score-scores[i]);
    setScores(updatedScores);
    setHistory(v=>[...v,{team,points:pts,question:active,changes:actualChanges}]);
    setUsed(v=>[...v,active]);setActive(null);
    setReveal(false);setPickWinner(false);setTurn(v=>1-v);
    setShowHelp(false);setShowHint(false);setPhase('question');setSeconds(60);setPaused(false);
    setAidEffect(null);setAidOwner(null);setTwoAttemptsLeft(2);setRestingPlayer('');
    if(used.length===35)setShowResult(true);
  };
  const brand = <div className="brand"><OfficialLogo/></div>;
  const setupFields = (
          <div className="aid-setup-panel">
            <label className="aid-match-field">
              <strong>اسم اللعبة</strong>
              <input value={matchName} maxLength={35} placeholder="مثال: تحدّي العائلة" onChange={e=>setMatchName(e.target.value)}/>
            </label>
            {teams.map((team,i)=>(
              <div className="aid-team-setup" key={i}>
                <h2>الفريق {i===0?'الأول':'الثاني'}</h2>
                <input
                  aria-label={'اسم الفريق '+(i+1)}
                  value={team} maxLength={25}
                  placeholder={'اسم الفريق '+(i+1)}
                  onChange={e=>setTeams(v=>v.map((t,j)=>j===i?e.target.value:t))}
                />
                <div className="aid-team-title">
                  <strong>{team.trim()||'الفريق '+(i+1)}: اختر 3 وسائل مساعدة</strong>
                  <span className={chosenAids[i].length===3?'aid-count complete':'aid-count'}>{chosenAids[i].length} / 3</span>
                </div>
                <div className="aid-pick-grid">
                  {aidCatalog.map(aid=>{
                    const picked=chosenAids[i].includes(aid.id);
                    return <button key={aid.id} type="button" aria-pressed={picked}
                      className={'aid-pick-card '+(picked?'selected':'') }
                      disabled={!picked&&chosenAids[i].length===3}
                      title={aid.info} onClick={()=>toggleAid(i,aid.id)}>
                      <span className="aid-pick-check">{picked?'✓':''}</span>
                      <strong>{aid.name}</strong>
                      <AidGlyph id={aid.id} size={33}/>
                      <small>{aid.info}</small>
                    </button>;
                  })}
                </div>
              </div>
            ))}
            <p className="muted aid-setup-note">هذه نسخة تجريبية؛ تظهر الوسائل المختارة تحت كل فريق ويُمكن استعمال كل وسيلة مرة واحدة أثناء السؤال.</p>
            <button className="primary aid-start-button"
              disabled={!matchName.trim()||teams.some(t=>!t.trim())||chosenAids.some(list=>list.length!==3)}
              onClick={()=>{
                setScores([0,0]);setShowResult(false);setHistory([]);setShowHint(false);
                setUsed([]);setTurn(0);setHelp([2,2]);setVarUsed([false,false]);
                setActive(null);setPhase('question');setSeconds(60);setPaused(false);
                setUsedAids([[],[]]);setAidEffect(null);setAidOwner(null);setShowHelp(false);
                go('game');
              }}>ابدأ اللعب ←</button>
          </div>
  );
  return (
    <div className={"site"+(page==="game"?" in-match":"")+(page==="home"?" has-landing":"")} dir="rtl">
      {page!=="game" && <header className={"header"+(page==="home"?" lm-header":"")}>
        <div onClick={() => go('home')} className="brand-link">
          {brand}
        </div>
        <div className="lm-header-accounts">
          <button type="button" onClick={()=>{setAuthMode('register');go('account');}}>سجّل معنا</button>
          <button type="button" onClick={()=>{setAuthMode('login');go('account');}}>تسجيل الدخول</button>
        </div>
        {page!=='home'&&<nav>
          <button onClick={() => go('home')}>الرئيسية</button>
          <button onClick={scrollToGames}>الفئات</button>
          <button onClick={() => go('pricing')}>الباقات</button>
          <button onClick={() => go('account')}>حسابي</button>
        </nav>}
      </header>}
      {page === 'home' && (
        <div className="lm-landing" dir="rtl">
          <section className="lm-hero" aria-label="ابدأ إنشاء لعبة لمنا">
            <div className="lm-hero-content">
              <span className="lm-kicker">ألعاب تجمعنا</span>
              <h1>جاهزين <em>للّمة؟</em></h1>
              <p>جمعتكم، أسئلتكم، تحدّيكم. اختاروا الألعاب وابدأوا الوناسة.</p>
              <button type="button" className="lm-create-cta" onClick={scrollToGames}>
                <span className="lm-create-icon"><Plus size={26}/></span>
                <span>إنشاء لعبة</span>
                <ArrowLeft size={24}/>
              </button>
              {selected.length===6&&(used.length>0||active!==null)&&!showResult&&
                <button type="button" className="lm-resume-link" onClick={()=>{setPaused(true);go('game');}}>
                  <Play size={17} fill="currentColor"/> متابعة المباراة المحفوظة
                </button>}
              <div className="lm-hero-meta"><span>20 فئة</span><span>6 ألعاب تختارها</span><span>فريقان</span></div>
            </div>
          </section>

          <section id="lm-all-games" className="lm-library" aria-label="جميع ألعاب لمنا">
            <div className="lm-library-heading">
              <div>
                <span className="lm-library-eyebrow"><span/> هنا تبدأ جمعتكم</span>
                <h2>اختاروا <em>ألعابكم.</em></h2>
                <p>قدامك كل الفئات العشرين. اختر 6 فئات عشان نجهّز المباراة.</p>
              </div>
              <div className="lm-library-selected" aria-live="polite"><span>{selected.length}</span> من 6 فئات</div>
            </div>
            <div className="lm-picks" aria-label="تشكيلة لعبتكم">
              <div className="lm-picks-heading">
                <div className="lm-picks-title"><Sparkles size={17}/><strong>تشكيلتكم</strong><span>اضغط على الفئة لإزالتها</span></div>
                <span className="lm-picks-numerator">{selected.length} / 6</span>
              </div>
              <div className="lm-picks-grid">
                {Array.from({length:6},(_,idx)=>{
                  const item=selected[idx];
                  return item===undefined
                    ? <div className="lm-pick-empty" key={'empty-'+idx}><span>{String(idx+1).padStart(2,'0')}</span><Plus size={19}/><small>بانتظار اختيارك</small></div>
                    : <button type="button" key={item} className="lm-pick-filled" onClick={()=>choose(item)} aria-label={'إزالة '+categories[item]+' من التشكيلة'}>
                        <span className="lm-pick-ordinal">{String(idx+1).padStart(2,'0')}</span>
                        <strong>{categories[item]}</strong>
                        <span className="lm-pick-remove">×</span>
                      </button>
                })}
              </div>
            </div>
            <div className="lm-library-progress" role="progressbar" aria-label="الفئات المختارة" aria-valuemin={0} aria-valuemax={6} aria-valuenow={selected.length}>
              <span style={{ width: (selected.length / 6) * 100 + '%' }}/>
            </div>
            <div className="lm-library-grid">
              {categories.map((name,i)=>(
                <button type="button"
                  className={'lm-library-card'+(selected.includes(i)?' lm-is-selected':'')}
                  key={i}
                  onClick={()=>choose(i)}
                  aria-label={(selected.includes(i)?'إلغاء اختيار ':'اختيار ')+name}
                  aria-pressed={selected.includes(i)}>
                  <Cover i={i} title={name}/>
                  <span className="lm-library-selection-index" aria-hidden="true">{selected.includes(i)?String(selected.indexOf(i)+1).padStart(2,'0'):'+'}</span>
                </button>
              ))}
            </div>
            <div className="lm-library-bottom">
              <span>{selected.length===6?'تشكيلتكم جاهزة! كمّلوا معلومات الفرق تحت.':'اختر '+(6-selected.length)+' فئات '+(selected.length?'إضافية':'لبداية اللعب')}</span>
              <button type="button" className="lm-library-next" disabled={selected.length!==6}
                onClick={()=>document.getElementById('lm-setup-teams')?.scrollIntoView({behavior:'smooth',block:'start'})}>
                معلومات الفرق <ArrowLeft size={19}/>
              </button>
            </div>
          </section>
          {selected.length===6&&<section id="lm-setup-teams" className="lm-team-details" aria-label="حدد معلومات الفرق">
            <div className="lm-team-heading">
              <span className="lm-library-eyebrow"><span/> باقي خطوة ونبدأ</span>
              <h2>حدد <em>معلومات الفرق.</em></h2>
              <p>سمّ المباراة، اكتب أسماء الفريقين، واختار ثلاث وسائل مساعدة لكل فريق.</p>
            </div>
            {setupFields}
          </section>}
        </div>
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
        <section className="section narrow aid-setup-section" dir="rtl">
          <span className="kicker">جهّزوا المباراة</span>
          <h1>الأسماء ووسائل المساعدة</h1>
          <p className="muted">كل فريق يختار 3 وسائل من أصل 5 قبل أن يبدأ التحدي.</p>
          {setupFields}

        </section>
      )}
      {page === 'game' && (
        <section className="lamna-match-screen" dir="rtl" aria-label="لوحة مباراة لمنا">
          <div className="lamna-match-shell">
            <header className="lamna-match-header">
              <nav className="lamna-match-nav" aria-label="التحكم بالمباراة">
                <button type="button" onClick={()=>go('home')}>↪ الخروج</button>
                <button type="button" title="التراجع عن آخر نتيجة" disabled={!history.length||active!==null}
                  onClick={()=>{
                    const last=history[history.length-1];if(!last)return;
                    setHistory(v=>v.slice(0,-1));setUsed(v=>v.filter(x=>x!==last.question));
                    setTurn(v=>1-v);
                    setScores(v=>v.map((score,i)=>Math.max(0,score-(last.changes?.[i]??(last.team===i?last.points:0)))));
                    setShowResult(false);
                  }}>↶ تراجع</button>
                <button type="button" onClick={()=>{setActive(null);setShowResult(true)}}>➜ إنهاء المباراة</button>
              </nav>
              <div className="lamna-match-topline">
                <span className="lamna-match-current">دور فريق: <strong>{teams[turn]||'الفريق '+(turn+1)}</strong></span>
                <div className="lamna-match-logo"><OfficialLogo/></div>
              </div>
              <div className="lamna-match-title">{matchName||'لوحة التحدّي'}</div>
            </header>
            <div className="lamna-match-playfield">
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
                        setActive(n);setAidEffect(null);setAidOwner(null);
                        setReveal(false);setPickWinner(false);setShowHelp(false);setShowHint(false);setPhase('question');setSeconds(selected[col]===1?[90,60,40][Math.floor(row/2)]:60);setPaused(selected[col]===1);
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

            </div>
            <div className="lamna-match-footer">
              <div className="lamna-match-teams">
                {teams.map((team,i)=>(
                  <div className="lamna-match-team" key={i}>
                    <div className="lamna-match-team-name">{team||'الفريق '+(i+1)}</div>
                    <div className="lamna-match-scorebox">
                      <button type="button" aria-label={'خصم 200 نقطة من '+team}
                        onClick={()=>setScores(v=>v.map((score,j)=>j===i?Math.max(0,score-200):score))}>−</button>
                      <strong aria-label={'نقاط '+team}>{scores[i]}</strong>
                      <button type="button" aria-label={'إضافة 200 نقطة إلى '+team}
                        onClick={()=>setScores(v=>v.map((score,j)=>j===i?score+200:score))}>+</button>
                    </div>
                    <div className="lamna-match-help-title">وسائل المساعدة</div>
                    <div className="lamna-match-help-icons">
                      {chosenAids[i].map(id=>{
                        const aid=aidCatalog.find(x=>x.id===id)!;
                        return <span key={id} title={aid.name}
                          className={'lamna-match-help-icon '+(usedAids[i].includes(id)?'spent':'')}
                          aria-label={aid.name+(usedAids[i].includes(id)?' (مستخدمة)':'')}>
                          <AidGlyph id={id} size={19}/>
                        </span>;
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {showResult && active===null && <WinnerScreen teams={teams} scores={scores} answered={used.length} total={36}
             onReplay={()=>{
               setScores([0,0]);setUsed([]);setHistory([]);setUsedAids([[],[]]);setTurn(0);setActive(null);
               setReveal(false);setPickWinner(false);setPhase('question');setSeconds(60);setPaused(false);
               setShowHelp(false);setShowHint(false);setAidEffect(null);setAidOwner(null);
               setVarUsed([false,false]);setShowResult(false);
             }}
             onExit={()=>{setShowResult(false);go('home');}}
             onSetup={()=>{setShowResult(false);go('setup');}}
           />}
          {active !== null && (
            <div className="play-screen" dir="rtl" role="dialog" aria-modal="true" aria-label="شاشة لعب السؤال">
              <div className="play-header">
                <div className="play-nav">
                  <button type="button" onClick={()=>{setActive(null);setReveal(false);setPickWinner(false);setPaused(true);go('home');}}>↪ الخروج</button>
                  <button type="button" onClick={()=>{setActive(null);setReveal(false);setPickWinner(false);setPaused(true);}}>▦ الرجوع للوحة</button>
                  <button type="button" onClick={()=>{setActive(null);setReveal(false);setPickWinner(false);setPaused(true);go('home');}}>➜ إنهاء اللعبة</button>
                </div>
                <div className="play-brandrow">
                  <div className="play-turn">دور فريق: <strong>{teams[phase==='steal'?1-stealFrom:turn]}</strong></div>
                  <div className="play-brand"><OfficialLogo/></div>
                </div>
                <div className="play-category">{categories[selected[Math.floor(active/6)]]}</div>
              </div>

              <div className="play-content">
                <div className={'play-stage '+(pickWinner?'play-stage-pick':reveal?'play-stage-answer':'play-stage-question')}>
                  {!reveal && !pickWinner && (
                    <>
                      <div className="play-timer" aria-label="المؤقت">
                        <button type="button" aria-label={paused?'تشغيل المؤقت':'إيقاف المؤقت'} disabled={phase==='var'||isWordlessQuestion} onClick={()=>setPaused(v=>!v)}>{paused?'▶':'Ⅱ'}</button>
                        <span>{isWordlessQuestion&&paused&&seconds>0?'ابدأ من الجوال':String(Math.floor(seconds/60)).padStart(2,'0')+':'+String(seconds%60).padStart(2,'0')}</span>
                        <button type="button" aria-label="إعادة بدء المؤقت" disabled={phase==='var'||isWordlessQuestion} onClick={()=>{setSeconds(phase==='steal'?10:60);setPaused(false);}}>↺</button>
                      </div>
                      <div className="play-point-tag">{[200,400,600][Math.floor((active%6)/2)]} نقطة</div>
                    </>
                  )}

                  {pickWinner ? (
                    <div className="play-stage-inner play-pick-view">
                      <h2>أي فريق جاوب صح؟</h2>
                      <div className="play-choose-teams">
                        <div className="play-choose-pair">
                          <button type="button" onClick={()=>award(0)}>{teams[0]||'الفريق الأول'}</button>
                          <button type="button" onClick={()=>award(1)}>{teams[1]||'الفريق الثاني'}</button>
                        </div>
                        <button type="button" className="play-choose-none" onClick={()=>award(null)}>ولا أحد</button>
                      </div>
                    </div>
                  ) : reveal ? (
                    <div className="play-stage-inner play-answer-view">
                      <h2>{currentQuestion?.answer}</h2>
                      {currentQuestion?.mode && <p className="play-context">{currentQuestion.mode}</p>}
                    </div>
                  ) : (
                    <div className="play-stage-inner play-question-view">
                      {phase==='steal'&&<div className="play-status">فرصة السرقة للفريق: {teams[1-stealFrom]} — 10 ثوانٍ</div>}
                      {phase==='var'&&<div className="play-status">مراجعة VAR للفريق: {teams[varTeam]}</div>}
                      {isWordlessQuestion ? (
                        <WordlessTV index={active%6}
                          points={[200,400,600][Math.floor((active%6)/2)]}
                          onStart={(n)=>{setSeconds(n);setPaused(true);}}
                          onTick={(n)=>{setSeconds(n);}}/>
                      ) : <h2>{currentQuestion?.prompt}</h2>}
                      {aidEffect!==null&&<div className="play-aid-activated">
                        <strong>{aidCatalog.find(x=>x.id===aidEffect)?.name}</strong>
                        <span>{aidEffect==='phone'?'زاد وقت السؤال 30 ثانية للتشاور مع صديق':aidEffect==='two'?'لديكم '+twoAttemptsLeft+' '+(twoAttemptsLeft===2?'محاولتان':'محاولة')+' للإجابة في هذا السؤال':aidEffect==='rest'?'سمِّ لاعبًا واحدًا من الفريق الخصم ليتوقف عن المشاركة في هذا السؤال':aidEffect==='pit'?'إذا أجاب فريقك صح تخصم نقاط السؤال أيضًا من الخصم':'السؤال الآن عند الخصم: إذا لم يجب تُخصم منه نقاط السؤال'}</span>
                        {aidEffect==='two'&&twoAttemptsLeft===2&&<button className="lamna-second-guess" type="button" onClick={()=>setTwoAttemptsLeft(1)}>التخمين الأول خطأ — ابدأ المحاولة الثانية</button>}
                        {aidEffect==='rest'&&<label className="lamna-rest-player">اسم اللاعب المستريح<input value={restingPlayer} maxLength={35} onChange={e=>setRestingPlayer(e.target.value)} placeholder="اسم اللاعب من الفريق الثاني"/></label>}
                      </div>}
                      {!isWordlessQuestion&&currentQuestion?.mode && <p className="play-context">{currentQuestion.mode}</p>}
                      {!isWordlessQuestion&&currentQuestion?.instructions && <p className="play-instructions">{currentQuestion.instructions}</p>}
                      {showHint&&!isWordlessQuestion && <p className="play-hint">تلميح: {currentQuestion?.hint}</p>}
                    </div>
                  )}

                  <div className="play-stage-actions">
                    {pickWinner ? (
                      <button type="button" className="play-action play-action-green" onClick={()=>setPickWinner(false)}>العودة للإجابة</button>
                    ) : reveal ? (
                      <>
                        <button type="button" className="play-action play-action-blue" onClick={()=>setPickWinner(true)}>أي فريق؟</button>
                        <button type="button" className="play-action play-action-red" onClick={()=>{setReveal(false);setPaused(isWordlessQuestion);}}>ارجع للسؤال ›</button>
                      </>
                    ) : (
                      <>
                        <button type="button" className="play-action play-action-green" onClick={()=>{setReveal(true);setPaused(true);}}>الإجابة</button>
                        <span className="play-action play-action-category">{categories[selected[Math.floor(active/6)]]}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="play-score-footer">
                <div className="play-teams">
                  {teams.map((team,i)=>(
                    <div className="play-team" key={i}>
                      <div className="play-team-name">{team||'الفريق '+(i+1)}</div>
                      <div className="play-team-score">{scores[i]}</div>
                      <div className="play-team-help-label">وسائل المساعدة</div>
                      <div className="play-team-controls">
                        {chosenAids[i].map(id=>{
                          const aid=aidCatalog.find(x=>x.id===id)!;
                          const spent=usedAids[i].includes(id);
                          const playable=!spent&&active!==null&&!reveal&&!pickWinner&&phase!=='var'&&aidEffect===null&&i===(phase==='steal'?1-stealFrom:turn);
                          return <button key={id} type="button" title={aid.info}
                            className={'play-aid-button '+(spent?'spent':'')+(playable?' available':'')}
                            aria-label={aid.name+(spent?' (مستخدمة)':'')}
                            disabled={!playable} onClick={()=>activateAid(i,id)}>
                              <AidGlyph id={id} size={20}/><span>{aid.name}</span>
                          </button>;
                        })}
                      </div>
                    </div>
                  ))}
                </div>
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
      {page === 'account' && <AuthScreen initialMode={authMode} onReturn={()=>go('home')}/>}
      {page!=='game' && <footer className="lamna-site-footer">
        <div>{brand}</div>
        <p>ألعاب تجمعنا</p>
        <SocialLinks/>
        <small>نسخة تجريبية • بدون دفع أو تسجيل حقيقي</small>
      </footer>}
    </div>
  );
}
export default App;
