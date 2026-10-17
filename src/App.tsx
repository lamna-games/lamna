import React, { useState } from 'react';
import { Phone, Hand, Repeat2, Bomb, MessageSquareText } from 'lucide-react';
import './site.css';
import './boardLayout.css';
import CartoonCover from './CartoonCover';
import { getQuestion, wordlessModeCount } from './quizData';
import { WordlessTV } from './Wordless';
import WinnerScreen from './WinnerScreen';
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
  const [selected, setSelected] = useState<number[]>([]);
  const [teams, setTeams] = useState(['الفريق الأول', 'الفريق الثاني']);
  const [matchName,setMatchName] = useState('');
  const [chosenAids,setChosenAids] = useState<AidId[][]>([[],[]]);
  const [usedAids,setUsedAids] = useState<AidId[][]>([[],[]]);
  const [aidEffect,setAidEffect] = useState<AidId|null>(null);
  const [aidOwner,setAidOwner] = useState<number|null>(null);
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
    if(aid==='phone'){setSeconds(v=>v+30);setPaused(false);}
    if(aid==='trap'){setStealFrom(team);setPhase('steal');setSeconds(10);setPaused(false);}
  };
  const go = (p: Page) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const choose = (i: number) =>
    setSelected(v =>
      v.includes(i) ? v.filter(x => x !== i) : v.length < 6 ? [...v, i] : v
    );
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
    setAidEffect(null);setAidOwner(null);
    if(used.length===35)setShowResult(true);
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
    <div className={"site"+(page==="game"?" in-match":"")+(page==="home"?" has-landing":"")} dir="rtl">
      {page!=="game" && <header className={"header"+(page==="home"?" lm-header":"")}>
        <div onClick={() => go('home')} className="brand-link">
          {brand}
        </div>
        <nav>
          <button onClick={() => go('home')}>الرئيسية</button>
          <button onClick={() => go('categories')}>الفئات</button>
          <button onClick={() => go('pricing')}>الباقات</button>
          <button onClick={() => go('account')}>حسابي</button>
        </nav>
      </header>}
      {page === 'home' && (
        <div className="lm-landing" dir="rtl">
          <section className="lm-hero" aria-label="إنشاء لعبة جديدة">
            <div className="lm-hero-glow lm-hero-glow-a" aria-hidden="true"/>
            <div className="lm-hero-glow lm-hero-glow-b" aria-hidden="true"/>
            <div className="lm-hero-grain" aria-hidden="true"/>
            <div className="lm-hero-content">
              <div className="lm-kicker"><span className="lm-kicker-star"><Sparkles size={14}/></span> لمنا <span className="lm-kicker-separator">/</span> ألعاب تجمعنا</div>
              <h1>اللّمة تصير<br/><span>أحلى بلعبة.</span></h1>
              <p className="lm-hero-desc">جهّزوا فريقين، اختاروا ست فئات على جوّكم، وخلو المنافسة تبدأ بينكم.</p>
              <div className="lm-hero-actions">
                <button type="button" className="lm-create-cta" onClick={()=>go('categories')}>
                  <span className="lm-create-icon"><Plus size={27} strokeWidth={2.6}/></span>
                  <span>إنشاء لعبة</span>
                  <span className="lm-create-arrow"><ArrowLeft size={22}/></span>
                </button>
                {selected.length===6&&(used.length>0||active!==null)&&!showResult&&
                  <button type="button" className="lm-resume-link" onClick={()=>{setPaused(true);go('game');}}>
                    <Play size={17} fill="currentColor"/> متابعة مباراتكم <span>({36-used.length} سؤال)</span>
                  </button>
                }
              </div>
              <div className="lm-hero-facts" aria-label="مميزات اللعبة">
                <span><span className="lm-fact-mark"/> 20 فئة متنوعة</span>
                <span><span className="lm-fact-mark"/> 36 سؤالًا</span>
                <span><span className="lm-fact-mark"/> فريقان</span>
              </div>
            </div>
            <div className="lm-hero-display" aria-label="نماذج من أغلفة الألعاب داخل لمنا">
              <div className="lm-display-glow" aria-hidden="true"/>
              <div className="lm-display-outline" aria-hidden="true"/>
              <div className="lm-display-cover lm-display-cover-back"><Cover i={4} title={categories[4]}/></div>
              <div className="lm-display-cover lm-display-cover-main"><Cover i={1} title={categories[1]}/></div>
              <div className="lm-display-cover lm-display-cover-front"><Cover i={2} title={categories[2]}/></div>
              <div className="lm-display-floating lm-display-score"><Trophy size={19}/><strong>200</strong><small>نقطة</small></div>
              <div className="lm-display-floating lm-display-tag"><Sparkles size={16}/> جمعتكم غير!</div>
            </div>
            <div className="lm-hero-bottom-line" aria-hidden="true"/>
          </section>

          <section className="lm-highlights" aria-label="خطوات بدء التحدي">
            <div className="lm-highlight"><span className="lm-highlight-number">01</span><div><strong>اختاروا الجو</strong><small>6 فئات من مكتبة لمنا</small></div><Grid2X2 size={22}/></div>
            <div className="lm-highlight"><span className="lm-highlight-number">02</span><div><strong>سمّوا الفريقين</strong><small>أسماءكم ومساعداتكم</small></div><UsersRound size={23}/></div>
            <div className="lm-highlight"><span className="lm-highlight-number">03</span><div><strong>ولّعوا المنافسة</strong><small>أسئلة ونقاط وضحك</small></div><Trophy size={22}/></div>
          </section>

          <section className="lm-library" aria-label="من مكتبة ألعاب لمنا">
            <div className="lm-library-heading">
              <div>
                <span className="lm-library-eyebrow"><span/> من مكتبة لمنا</span>
                <h2>كل فئة، <em>جوّ ثاني.</em></h2>
                <p>هذه عيّنة من الألعاب اللي تقدر تختار منها جمعتكم.</p>
              </div>
              <button type="button" onClick={()=>go('categories')}>استعرض الفئات <ChevronLeft size={19}/></button>
            </div>
            <div className="lm-library-grid">
              {[1,2,3,4,0,5].map((i)=>(
                <button type="button" className="lm-library-card" key={i}
                  onClick={()=>{setSelected(v=>v.includes(i)?v:(v.length<6?[...v,i]:[i]));go('categories');}}
                  aria-label={'اختر فئة '+categories[i]}>
                  <Cover i={i} title={categories[i]}/>
                  <span className="lm-library-check"><Check size={15}/></span>
                </button>
              ))}
            </div>
          </section>
          <section className="lm-bottom-invite">
            <div><span>جاهزين للتحدّي؟</span><h2>الليلة، <em>اللّمة لمنا.</em></h2></div>
            <button type="button" onClick={()=>go('categories')}><Plus size={22}/> إنشاء لعبة <ArrowLeft size={19}/></button>
          </section>
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
              }}>ابدأ المباراة ←</button>
          </div>
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
                <div className="lamna-match-logo">لمنا</div>
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
                  <div className="play-brand">لمنا</div>
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
                        <span>{aidEffect==='phone'?'زاد وقت السؤال 30 ثانية للتشاور مع صديق':aidEffect==='two'?'يُسمح بمحاولتين للإجابة بدل محاولة واحدة':aidEffect==='rest'?'حدّد لاعبًا من الخصم يستريح عن المشاركة في هذا السؤال':aidEffect==='pit'?'إذا أجاب فريقك صح تخصم نقاط السؤال أيضًا من الخصم':'السؤال الآن عند الخصم: إذا لم يجب تُخصم منه نقاط السؤال'}</span>
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
      {page!=='game' && <footer>
        <div>{brand}</div>
        <p>لمنا — ألعاب تجمعنا</p>
        <small>نسخة مستقلة تجريبية • بدون دفع أو تسجيل حقيقي</small>
      </footer>}
    </div>
  );
}
export default App;
