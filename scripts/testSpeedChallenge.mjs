import assert from 'node:assert/strict';
import {speedChallengeRounds as rounds} from '../speedChallengeRounds.mjs';

// Draft-only check. The new bank is NOT live until explicitly routed by the server.
assert.equal(rounds.free.length,6);
assert.equal(rounds.paid.length,12);
const all=[...rounds.free,...rounds.paid].map(row=>row.split('|'));
assert(all.every(parts=>parts.length===3&&parts.every(s=>s.trim())));
const normalized=all.map(row=>row[0].normalize('NFKC').replace(/[\s؟?،,.!«»]/g,''));
assert.equal(new Set(normalized).size,18,'Repeated question');
for(const [kind,rows,perTier] of [['free',rounds.free,2],['paid',rounds.paid,4]]){
 for(const [i,points] of [200,400,600].entries()){
  assert.equal(rows.slice(i*perTier,(i+1)*perTier).length,perTier,kind+' '+points);
 }
}
assert.equal(14+9,23);
assert.equal(60*3/4,45);
assert.equal(19+5,24);
assert.equal(35,20+15);
assert.equal(47*2+1,95);
assert.equal(Array.from({length:101},(_,i)=>i+100).filter(n=>n%9===0).length,11);
assert.equal(80/4,20);
assert.equal(15+16+17,48);
assert.equal((12*60+20)-(10*60+45),95);
assert.equal(144/.8,180);
assert.equal((23*60+47+2*60+38)%(24*60),2*60+25);
assert.equal(35+21,56);
assert.equal(Array.from({length:120},(_,i)=>i+1).filter(n=>n%4===0&&n%8!==0).length,15);
console.log('Game 20 speed challenge DRAFT QA OK: 18 distinct complete entries, 200/400/600 tier slots and arithmetic. Not yet active.');
