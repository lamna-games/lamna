import React, { useState } from 'react';
import { Phone, Hand, Repeat2, Bomb, MessageSquareText, LogOut, LayoutGrid, Flag, Undo2 } from 'lucide-react';
import './site.css';
import './boardLayout.css';
import CartoonCover from './CartoonCover';
import {categories,categorySections,isLetterGame} from './gameCatalog';
import LetterBoard from './LetterBoard';
import { getQuestion, wordlessModeCount } from './quizData';
import { WordlessTV } from './Wordless';
import WinnerScreen from './WinnerScreen';
import OfficialLogo from './OfficialLogo';
import SocialLinks from './SocialLinks';
import AuthScreen from './AuthScreen';
import PasswordRecovery from './PasswordRecovery';
import StoreInformation from './StoreInformation';
import StoreCommerce from './StoreCommerce';
import QuestionReport from './QuestionReport';
import {storeRequest, token, type ServerMatch, type Wallet} from './storeApi';
import { Plus, ArrowLeft, Sparkles, UsersRound, Grid2X2, Trophy, ChevronLeft, Check, Play } from 'lucide-react';
import './landing.css';
import './gameSections.css';
import './brandTheme.css';
type Page = 'home' | 'categories' | 'setup' | 'game' | 'pricing' | 'account' | 'reset-password' | 'privacy' | 'terms' | 'faq' | 'contact';
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
  const getInitialPage=():Page=>{
    const fromHash=window.location.hash.replace(/^#\/?/,'').split('?')[0];
    return (['privacy','terms','faq','contact','pricing','account','reset-password'] as string[]).includes(fromHash)?fromHash as Page:'home';
  };
  const [page, setPage] = useState<Page>(getInitialPage);
  React.useEffect(()=>{
    const handleHash=()=>{
      const hash=window.location.hash.replace(/^#\/?/,'').split('?')[0];
      if((['privacy','terms','faq','contact','pricing','account','reset-password'] as string[]).includes(hash)){setPage(hash as Page);}
      else if(page!=='game')setPage('home');
    };
    window.addEventListener('hashchange',handleHash);
    return()=>window.removeEventListener('hashchange',handleHash);
  },[page]);
  const [authMode,setAuthMode] = useState<'register'|'login'>('register');
  const [sessionVersion,setSessionVersion]=useState(0);
  const [accountsEnabled,setAccountsEnabled] = useState(false);
  React.useEffect(()=>{
    let mounted=true;
    fetch('https://lamna-wordless-sync.onrender.com/api/accounts/status',{cache:'no-store'})
      .then(r=>r.ok?r.json():{enabled:false})
      .then(data=>{if(mounted)setAccountsEnabled(data.enabled===true)})
      .catch(()=>{if(mounted)setAccountsEnabled(false)});
    return()=>{mounted=false};
  },[]);

  const [wallet,setWallet]=useState<Wallet|null>(null);
  const [activeSession,setActiveSession]=useState<ServerMatch|null>(null);
  const [matchError,setMatchError]=useState('');
  const [starting,setStarting]=useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [gameSearch,setGameSearch]=useState('');
  const [openSections,setOpenSections]=useState<number[]>(()=>categorySections.map((_,index)=>index));
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
  // Account-bound match progress belongs in the database, not in a shared browser draft.
  // Remove old cross-account demo state so a different user's scores cannot bleed into this session.
  React.useEffect(()=>{
    localStorage.removeItem('lamna-demo-match-v2');
    setHydrated(true);
  },[]);
  const currentQuestion = active === null ? null
   : (activeSession?.questions[Math.floor(active/6)]?.[active%6] ?? getQuestion(selected[Math.floor(active / 6)], active % 6));
  const isWordlessQuestion = active!==null && selected[Math.floor(active/6)]===1;
  const isLetterQuestion = active!==null && isLetterGame(selected[Math.floor(active/6)]);
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
  React.useEffect(()=>{
    if(!accountsEnabled||page!=='home'||!token())return;
    let alive=true;
    storeRequest<Wallet>('me').then(data=>{if(alive)setWallet(data)}).catch(()=>{});
    return()=>{alive=false};
  },[accountsEnabled,page]);
  const applyMatch=(match:ServerMatch)=>{
    const p=match.progress;
    setActiveSession(match);setSelected(match.selected);setMatchName(match.match_name);
    setTeams(Array.isArray(p?.teams)&&p.teams.length===2?p.teams:teams);
    if(p?.chosenAids?.length===2)setChosenAids(p.chosenAids as AidId[][]);
    setScores(p?.scores?.length===2?p.scores:[0,0]);
    setShowResult(match.status==='completed');setHistory(p?.history||[]);setShowHint(false);
    setUsed(p?.used||[]);setTurn(p?.turn===1?1:0);setHelp(p?.help?.length===2?p.help:[2,2]);setVarUsed(p?.varUsed?.length===2?p.varUsed:[false,false]);
    setActive(p?.active??null);setPhase(p?.phase==='steal'?'steal':p?.phase==='var'?'var':'question');
    setSeconds(typeof p?.seconds==='number'&&p.seconds>=0&&p.seconds<=180?p.seconds:60);setPaused(true);
    setUsedAids(p?.usedAids?.length===2?p.usedAids as AidId[][]:[[],[]]);
    setAidEffect(p?.aidEffect as AidId|null||null);setAidOwner(typeof p?.aidOwner==='number'?p.aidOwner:null);
    setTwoAttemptsLeft(p?.twoAttemptsLeft===1?1:2);setRestingPlayer(p?.restingPlayer||'');setStealFrom(p?.stealFrom===1?1:0);
    setShowHelp(false);setReveal(Boolean(p?.reveal));setPickWinner(Boolean(p?.pickWinner));setShowHint(Boolean(p?.showHint));
    localStorage.setItem('lamna-current-match-id',match.id);
    go('game');
  };
  React.useEffect(()=>{
    if(!accountsEnabled||!hydrated||!token())return;
    const id=localStorage.getItem('lamna-current-match-id');
    if(!id)return;
    let alive=true;
    storeRequest<{match:ServerMatch}>('matches/'+id)
      .then(data=>{if(alive&&data.match.status==='active')applyMatch(data.match)})
      .catch(()=>{if(alive)localStorage.removeItem('lamna-current-match-id')});
    return()=>{alive=false};
  },[accountsEnabled,hydrated]);
  const beginMatch=async()=>{
    if(starting)return;setMatchError('');
    if(!accountsEnabled){setMatchError('يلزم تشغيل الحسابات الآمنة قبل بدء المباريات الجديدة.');return;}
    if(!token()){setAuthMode('register');go('account');return;}
    try{
      setStarting(true);
      const data=await storeRequest<{match:ServerMatch;credits:number;freeRemaining:boolean}>('matches','POST',{selected,matchName,teams,chosenAids});
      applyMatch(data.match);
    }catch(error){setMatchError(error instanceof Error?error.message:'تعذر بدء المباراة.');}
    finally{setStarting(false);}
  };
  // Persist the COMPLETE active match to Postgres; local browser state never grants credits.
  const progressSnapshot={teams,chosenAids,scores,used,turn,usedAids,history,active,phase,seconds,paused,
    reveal,pickWinner,showHint,stealFrom,varUsed,help,aidEffect,aidOwner,twoAttemptsLeft,restingPlayer};
  const progressRef=React.useRef(progressSnapshot);
  progressRef.current=progressSnapshot;
  React.useEffect(()=>{
    if(!accountsEnabled||!activeSession||activeSession.status!=='active'||!token()||showResult)return;
    const matchId=activeSession.id;
    const t=window.setTimeout(()=>{
      storeRequest('progress','POST',{matchId,progress:progressRef.current}).catch(()=>{});
    },450);
    return()=>window.clearTimeout(t);
  },[accountsEnabled,activeSession?.id,activeSession?.status,teams,chosenAids,scores,used,turn,usedAids,history,active,phase,seconds,paused,reveal,pickWinner,showHint,stealFrom,varUsed,help,aidEffect,aidOwner,twoAttemptsLeft,restingPlayer,showResult]);
  React.useEffect(()=>{
    if(!accountsEnabled||!activeSession||activeSession.status!=='active'||!token())return;
    const matchId=activeSession.id;
    const flush=()=>{
      if(document.visibilityState==='visible')return;
      const authToken=token();if(!authToken)return;
      const body=JSON.stringify({matchId,progress:progressRef.current});
      if(body.length>6400)return;
      fetch('https://lamna-wordless-sync.onrender.com/api/store/progress',{
        method:'POST',keepalive:true,headers:{Authorization:'Bearer '+authToken,'Content-Type':'application/json'},
        body,cache:'no-store'
      }).catch(()=>{});
      setPaused(true);
    };
    document.addEventListener('visibilitychange',flush);
    return()=>document.removeEventListener('visibilitychange',flush);
  },[accountsEnabled,activeSession?.id,activeSession?.status]);
  React.useEffect(()=>{
    if(!accountsEnabled||!activeSession||activeSession.status!=='active'||!showResult||active!==null)return;
    let alive=true;
    storeRequest<{ok:boolean;credits:number;freeRemaining:boolean}>('finish','POST',{matchId:activeSession.id})
     .then(()=>{if(alive){setActiveSession(v=>v?{...v,status:'completed'}:v);localStorage.removeItem('lamna-current-match-id')}})
     .catch(()=>{});
    return()=>{alive=false};
  },[accountsEnabled,activeSession?.id,activeSession?.status,showResult,active]);
  const go = (p: Page) => {
    setPage(p);
    const infoPages=['privacy','terms','faq','contact','pricing','account','reset-password'] as const;
    if(infoPages.some(item=>item===p)){window.history.pushState(null,'','#'+p);}
    else if(window.location.hash){window.history.pushState(null,'',window.location.pathname+window.location.search);}
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  // A completed match cannot be replayed against its old question snapshot.
  // Finish it on the server first, then request a NEW match through beginMatch.
  // The next match consumes the next entitlement only after allocation succeeds.
  const prepareAnotherMatch = async () => {
    if(!activeSession)return;
    if(starting)return;
    setStarting(true);
    try {
      await storeRequest('finish','POST',{matchId:activeSession.id});
      localStorage.removeItem('lamna-current-match-id');
      setActiveSession(null);
      setScores([0,0]);setUsed([]);setHistory([]);setUsedAids([[],[]]);
      setTurn(0);setActive(null);setReveal(false);setPickWinner(false);
      setPhase('question');setSeconds(60);setPaused(true);
      setShowHelp(false);setShowHint(false);setAidEffect(null);setAidOwner(null);
      setVarUsed([false,false]);setShowResult(false);setMatchError('');
      go('setup');
    } catch {
      window.alert('تعذر تأكيد نهاية المباراة على الخادم. لن نعيد استخدامها؛ حاول مرة أخرى بعد التأكد من الاتصال.');
    } finally { setStarting(false); }
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
            <p className="muted aid-setup-note">اختر ثلاث وسائل مساعدة لكل فريق. تُستخدم كل وسيلة مرة واحدة أثناء المباراة.</p>
            <button className="primary aid-start-button"
              disabled={starting||!matchName.trim()||teams.some(t=>!t.trim())||chosenAids.some(list=>list.length!==3)}
              onClick={beginMatch}>{starting?'جارٍ تجهيز المباراة…':'ابدأ اللعب ←'}</button>
            {matchError&&<p className="lm-new-game-note" role="alert">{matchError}</p>}
          </div>
  );
  return (
    <div className={"site"+(page==="game"?" in-match":"")+(page==="home"?" has-landing":"")} dir="rtl">
      {page!=="game" && <header className={"header"+(page==="home"?" lm-header":"")}>
        <div onClick={() => go('home')} className="brand-link">
          {brand}
        </div>
        <div className="lm-header-accounts">
          {token()
            ? <button type="button" onClick={()=>go('account')}>حسابي</button>
            : <>
                <button type="button" onClick={()=>{setAuthMode('register');go('account');}}>سجّل معنا</button>
                <button type="button" onClick={()=>{setAuthMode('login');go('account');}}>تسجيل الدخول</button>
              </>
          }
        </div>
        {page!=='home'&&<nav>
          <button onClick={() => go('home')}>الرئيسية</button>
          <button onClick={scrollToGames}>الفئات</button>
          <button onClick={() => go('pricing')}>الباقات</button>
          <button onClick={() => go('faq')}>الأسئلة الشائعة</button>
          <button onClick={() => {setAuthMode('login');go('account');}}>حسابي</button>
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
              {Boolean(token())&&activeSession?.status==='active'&&selected.length===6&&(used.length>0||active!==null)&&!showResult&&
                <button type="button" className="lm-resume-link" onClick={()=>{setPaused(true);go('game');}}>
                  <Play size={17} fill="currentColor"/> متابعة المباراة المحفوظة
                </button>}
              <div className="lm-hero-meta"><span>ألعاب متنوعة</span><span>6 ألعاب تختارها</span><span>فريقان</span></div>
              <button type="button" className="lm-hero-bundles" onClick={()=>go('pricing')}>شوف باقات لمنا وأسعارها</button>
            </div>
          </section>

          <section id="lm-all-games" className="lm-library" aria-label="جميع ألعاب لمنا">
            <div className="lm-library-heading">
              <div>
                <span className="lm-library-eyebrow"><span/> هنا تبدأ جمعتكم</span>
                <h2>اختاروا <em>ألعابكم.</em></h2>
                <p>تصفّح الأقسام وافتح أو أقفل أي قسم براحتك، واختر 6 ألعاب لمباراتكم من نفس الصفحة.</p>
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
            <div className="lm-game-search"><label htmlFor="lm-find-game">ابحث عن لعبة من ألعاب لمنا الـ80</label><input id="lm-find-game" type="search" dir="rtl" autoComplete="off" placeholder="اكتب اسم اللعبة، مثل الحروف أو الطيران…" value={gameSearch} onChange={e=>setGameSearch(e.target.value)} aria-label="البحث عن الألعاب"/>{gameSearch&&<button type="button" onClick={()=>setGameSearch('')} aria-label="امسح البحث">مسح</button>}</div>
            <nav className="lm-section-shortcuts" aria-label="انتقل إلى قسم الألعاب">
              {categorySections.map((section,index)=>(
                <button type="button" key={section.name} className={openSections.includes(index)?'is-current':''}
                 aria-pressed={openSections.includes(index)}
                 onClick={()=>{setOpenSections(prev=>prev.includes(index)?prev:[...prev,index]);document.getElementById('lm-section-'+index)?.scrollIntoView({behavior:'smooth',block:'start'});}}>
                  {section.name}
                </button>
              ))}
            </nav>
            <div className="lm-category-groups">
              {categorySections.map((section,index)=>{
                const visibleIds=gameSearch.trim()?section.ids.filter(i=>categories[i].includes(gameSearch.trim())):section.ids;
                if(visibleIds.length===0)return null;
                const isOpen=openSections.includes(index);
                return <section className={'lm-category-group'+(isOpen?' is-open':'')} key={section.name}
                    id={'lm-section-'+index} aria-label={section.name}>
                  <button type="button" className="lm-category-heading" aria-expanded={isOpen}
                    aria-controls={'lm-section-games-'+index}
                    onClick={()=>setOpenSections(prev=>prev.includes(index)?prev.filter(i=>i!==index):[...prev,index])}>
                    <span className="lm-category-heading-copy">
                      <strong>{section.name}</strong>
                      <small>{section.description}</small>
                    </span>
                    <span className="lm-category-heading-meta">
                      <span className="lm-category-expand" aria-hidden="true">{isOpen?'−':'+'}</span>
                    </span>
                  </button>
                  {isOpen&&<div className="lm-category-content" id={'lm-section-games-'+index}>
                    <div className="lm-library-grid">
                      {visibleIds.map(i=>(
                        <button type="button" className={'lm-library-card'+(selected.includes(i)?' lm-is-selected':'')}
                         key={i} onClick={()=>choose(i)}
                         aria-label={(selected.includes(i)?'إلغاء اختيار ':'اختيار ')+categories[i]}
                         aria-pressed={selected.includes(i)}>
                          <Cover i={i} title={categories[i]}/>
                          <span className="lm-library-selection-index" aria-hidden="true">{selected.includes(i)?String(selected.indexOf(i)+1).padStart(2,'0'):'+'}</span>
                        </button>
                      ))}
                    </div>
                  </div>}
                </section>;
              })}
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
                <button type="button" className="lm-action-link" onClick={()=>go('home')}><LogOut size={18} aria-hidden="true"/><span>الخروج</span></button>
                <button type="button" title="التراجع عن آخر نتيجة" disabled={!history.length||active!==null}
                  onClick={()=>{
                    const last=history[history.length-1];if(!last)return;
                    setHistory(v=>v.slice(0,-1));setUsed(v=>v.filter(x=>x!==last.question));
                    setTurn(v=>1-v);
                    setScores(v=>v.map((score,i)=>Math.max(0,score-(last.changes?.[i]??(last.team===i?last.points:0)))));
                    setShowResult(false);
                  }}><Undo2 size={18} aria-hidden="true"/><span>تراجع</span></button>
                <button type="button" className="lm-action-link" onClick={()=>{setActive(null);setShowResult(true)}}><Flag size={18} aria-hidden="true"/><span>إنهاء المباراة</span></button>
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
             onReplay={prepareAnotherMatch}
             onExit={()=>{setShowResult(false);go('home');}}
             onSetup={prepareAnotherMatch}
           />}
          {active !== null && (
            <div className="play-screen" dir="rtl" role="dialog" aria-modal="true" aria-label="شاشة لعب السؤال">
              <div className="play-header">
                <div className="play-nav">
                  <button type="button" className="lm-action-link" onClick={()=>{setActive(null);setReveal(false);setPickWinner(false);setPaused(true);go('home');}}><LogOut size={18} aria-hidden="true"/><span>الخروج</span></button>
                  <button type="button" className="lm-action-link" onClick={()=>{setActive(null);setReveal(false);setPickWinner(false);setPaused(true);}}><LayoutGrid size={18} aria-hidden="true"/><span>الرجوع للوحة</span></button>
                  <button type="button" className="lm-action-link" onClick={()=>{setActive(null);setReveal(false);setPickWinner(false);setPaused(true);setShowResult(true);}}><Flag size={18} aria-hidden="true"/><span>إنهاء اللعبة</span></button>
                </div>
                <div className="play-brandrow">
                  <div className="play-turn">دور فريق: <strong>{teams[phase==='steal'?1-stealFrom:turn]}</strong></div>
                  <div className="play-brand"><OfficialLogo/></div>
                </div>
                <div className="play-category">{categories[selected[Math.floor(active/6)]]}</div>
              </div>

              <div className="play-content">
                <div className={'play-stage '+(pickWinner?'play-stage-pick':reveal?'play-stage-answer':'play-stage-question')}>
                  {activeSession?.kind==='paid'&&!reveal&&!pickWinner&&
                    <QuestionReport matchId={activeSession.id} questionNumber={active}/>}
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
                      ) : <><h2>{currentQuestion?.prompt}</h2>{isLetterQuestion&&<LetterBoard answer={currentQuestion?.answer||''} category={selected[Math.floor((active??0)/6)]}/>}</>}
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
      {page === 'reset-password'&&<PasswordRecovery onBack={()=>{setAuthMode('login');go('account')}}/>}
      {page === 'pricing' && <StoreCommerce mode="plans" accountsEnabled={accountsEnabled} onBack={()=>go('home')} onLogin={()=>{setAuthMode('login');go('account')}}/>}
      {(page==='privacy'||page==='terms'||page==='faq'||page==='contact')&&
        <StoreInformation page={page} onBack={()=>go('home')}/>}

      {page === 'account' && (!token()
        ? <AuthScreen key={authMode+'-'+sessionVersion} initialMode={authMode} onReturn={()=>go('home')}
             onAuthenticated={()=>{setSessionVersion(v=>v+1);setAuthMode('login');go('account')}}/>
        : <StoreCommerce mode="wallet" accountsEnabled={accountsEnabled} onBack={()=>go('home')}
             onSignedOut={()=>{setActiveSession(null);setActive(null);setUsed([]);setHistory([]);setShowResult(false);setSessionVersion(v=>v+1);go('home')}}
             onLogin={()=>{setAuthMode('login');setSessionVersion(v=>v+1);go('account')}} onResume={applyMatch}/>)}
      {page!=='game' && <footer className="lamna-site-footer">
        <div>{brand}</div>
        <p>ألعاب تجمعنا</p>
        <SocialLinks/>
        <nav className="lm-legal-links" aria-label="روابط معلومات لمنا">
          <button type="button" onClick={()=>go('privacy')}>سياسة الخصوصية</button>
          <button type="button" onClick={()=>go('terms')}>الشروط والأحكام</button>
          <button type="button" onClick={()=>go('faq')}>الأسئلة الشائعة</button>
          <button type="button" onClick={()=>go('contact')}>تواصل معنا</button>
        </nav>
        <small>© {new Date().getFullYear()} لمنا — ألعاب تجمعنا</small>
      </footer>}
    </div>
  );
}
export default App;
