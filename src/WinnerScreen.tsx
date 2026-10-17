import React from 'react';
import { Trophy, Volume2, VolumeX, RotateCcw, DoorOpen, Sparkles } from 'lucide-react';
import './winner.css';

type Props = { teams:string[]; scores:number[]; answered:number; total:number; onReplay:()=>void; onExit:()=>void; onSetup:()=>void; };
const confetti=Array.from({length:35},(_,i)=>({
 x:(i*47+13)%97, delay:(i*11%32)/10, duration:2.8+(i%6)*.44,
 turn:(i*41)%360, width:5+(i%3)*3,
 color:['#5bd5c5','#f4bb75','#a393eb','#e47e96','#89d8f1'][i%5]
}));
function celebrateSound(){
 try{
  const Ctx=(window as typeof window & {webkitAudioContext?:typeof AudioContext}).AudioContext||(window as typeof window & {webkitAudioContext?:typeof AudioContext}).webkitAudioContext;
  if(!Ctx)return;
  const ctx=new Ctx();
  const notes=[523,659,784,1047];
  notes.forEach((pitch,i)=>{
   const oscillator=ctx.createOscillator();
   const gain=ctx.createGain();
   const t=ctx.currentTime+i*.13;
   oscillator.type='sine';oscillator.frequency.setValueAtTime(pitch,t);
   gain.gain.setValueAtTime(.0001,t);gain.gain.exponentialRampToValueAtTime(.085,t+.015);
   gain.gain.exponentialRampToValueAtTime(.0001,t+.4);
   oscillator.connect(gain);gain.connect(ctx.destination);
   oscillator.start(t);oscillator.stop(t+.41);
  });
  window.setTimeout(()=>ctx.close(),2000);
 }catch{ /* Audio is optional if the browser blocks playback */ }
}
export default function WinnerScreen({teams,scores,answered,total,onReplay,onExit,onSetup}:Props){
 const [muted,setMuted]=React.useState(false);
 const winner=scores[0]===scores[1]?-1:(scores[0]>scores[1]?0:1);
 const name=winner===-1?'تعادل كبير!':(teams[winner]?.trim()||'الفريق الفائز');
 return <div className="lamna-finale" dir="rtl" role="dialog" aria-modal="true" aria-label="نهاية مباراة لمنا">
  <div className="lamna-confetti" aria-hidden="true">
   {confetti.map((piece,i)=><span key={i} style={{
    left:piece.x+'%', animationDelay:'-'+piece.delay+'s',animationDuration:piece.duration+'s',
    width:piece.width+'px',height:piece.width*1.7+'px',background:piece.color,
    transform:'rotate('+piece.turn+'deg)'
   }}/>)}
  </div>
  <header className="lamna-finale-header">
   <span className="lamna-finale-brand">لمنا <small>ألعاب تجمعنا</small></span>
   <button type="button" className="lamna-finale-sound" title="صوت الاحتفال" aria-label={muted?'تشغيل صوت الاحتفال':'كتم صوت الاحتفال'} onClick={()=>{
    setMuted(v=>!v);if(muted)celebrateSound();
   }}>{muted?<VolumeX size={23}/>:<Volume2 size={23}/>}</button>
  </header>
  <main className="lamna-finale-main">
   <div className="lamna-trophy-shell" aria-hidden="true"><Trophy size={50} strokeWidth={1.8}/></div>
   <span className="lamna-finale-kicker">انتهى التحدّي</span>
   <h1>{winner===-1?'تعادل الفريقين!':'مبروك الفوز!'}</h1>
   <div className="lamna-winner-name"><Sparkles size={20}/><span>{name}</span><Sparkles size={20}/></div>
   <p className="lamna-finale-summary">{winner===-1?'كانت منافسة متقاربة… جولة فاصلة؟':'حماسكم صنع الليلة! يستاهل الفريق الفوز.'}</p>
   <div className="lamna-final-scores">
    {teams.map((team,i)=><div className={'lamna-final-card '+(i===winner?'is-winner':'')} key={i}>
      <span className="lamna-final-team">{team||'الفريق '+(i+1)}</span>
      <strong>{scores[i]}</strong>
      <small>نقطة</small>
      {i===winner&&<span className="lamna-card-crown" aria-label="الفائز"><Trophy size={20}/></span>}
    </div>)}
   </div>
   <p className="lamna-finale-progress">لعبتم {answered} من أصل {total} سؤالًا</p>
   <div className="lamna-finale-actions">
    <button type="button" className="lamna-finale-replay" onClick={onReplay}><RotateCcw size={20}/> العب مرة ثانية</button>
    <button type="button" className="lamna-finale-exit" onClick={onExit}><DoorOpen size={20}/> الخروج</button>
   </div>
   <button type="button" className="lamna-finale-change" onClick={onSetup}>تغيير الفرق ووسائل المساعدة</button>
   {!muted&&<button type="button" className="lamna-finale-cheer" onClick={celebrateSound}>♪ شغّل صوت الاحتفال</button>}
  </main>
 </div>;
}