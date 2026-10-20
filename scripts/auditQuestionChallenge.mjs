import {catalogByCategory} from '../serverQuestionBank.mjs';

// Read-only 81-game audit. Heuristics produce review candidates, not automatic
// claims that a question is wrong or a difficulty tier is objectively calibrated.
const normalize=s=>String(s??'').normalize('NFKC').replace(/[\u064B-\u065F\u0670]/g,'').replace(/[إأآ]/g,'ا').replace(/ى/g,'ي').replace(/\s+/g,' ').trim().toLowerCase();
const games=[];
const findings=[];
for(let gameId=0;gameId<81;gameId++){
 const free=catalogByCategory(gameId,'free');
 const paid=catalogByCategory(gameId,'paid');
 const seen=new Map();
 const tiers={};
 for(const [kind,rows] of [['free',free],['paid',paid]]){
  const slots=kind==='free'?2:4;
  tiers[kind]=[];
  for(let tier=0;tier<3;tier++){
   const chunk=rows.slice(tier*slots,(tier+1)*slots);
   tiers[kind].push({points:[200,400,600][tier],count:chunk.length});
  }
  for(const q of rows){
   const prompt=normalize(q.prompt),answer=normalize(q.answer),hint=normalize(q.hint);
   const id=q.id??null;
   if(!prompt||!answer)findings.push({gameId,kind,id,type:'missing-prompt-or-answer'});
   if(prompt&&seen.has(prompt))findings.push({gameId,kind,id,type:'duplicate-prompt',previous:seen.get(prompt)});
   if(prompt)seen.set(prompt,id);
   // A hint giving away a multi-character answer makes a challenge trivial.
   if(answer.length>=4&&hint.includes(answer))findings.push({gameId,kind,id,type:'answer-exposed-in-hint'});
   if(answer.length>=4&&prompt.includes(answer))findings.push({gameId,kind,id,type:'answer-exposed-in-prompt'});
  }
 }
 games.push({gameId,free:free.length,paid:paid.length,tiers});
}
const counts=Object.fromEntries([...new Set(findings.map(f=>f.type))].map(type=>[type,findings.filter(f=>f.type===type).length]));
console.log(JSON.stringify({scope:'static bank only; review candidates, not verified errors; no DB writes',games:games.length,questions:games.reduce((n,g)=>n+g.free+g.paid,0),counts,findings,tiers:games.map(({gameId,tiers})=>({gameId,tiers}))},null,2));
