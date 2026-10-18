import assert from 'node:assert/strict';
import {catalogByCategory} from '../serverQuestionBank.mjs';
import {reviewedTierRows} from '../reviewedTierRows.mjs';
const tiers=[200,400,600];
for(const category of [0,4,8]){
 for(const kind of ['free','paid']){
  const questions=catalogByCategory(category,kind);
  const expected=reviewedTierRows[category][kind];
  assert.equal(questions.length,kind==='free'?6:12);
  assert.deepEqual(questions.map(q=>[q.prompt,q.answer,q.hint].join('|')),expected);
  assert.equal(new Set(questions.map(q=>q.prompt)).size,questions.length);
  const slots=kind==='free'?2:4;
  for(let tier=0;tier<3;tier++){
   const subset=questions.slice(tier*slots,(tier+1)*slots);
   assert.equal(subset.length,slots,'Incomplete '+tiers[tier]+' tier');
   assert(subset.every(q=>q.prompt.trim()&&q.answer.trim()&&q.hint.trim()));
  }
 }
}
const football=catalogByCategory(4,'paid');
assert(football.slice(0,4).every(q=>!/تسلل|ياردات|ركلة مرمى مباشرة/.test(q.prompt)),
 'Advanced laws must not appear in 200-point football tier');
assert(football.slice(8).some(q=>q.prompt.includes('تسلل')),'600 tier must contain a real law challenge');
const general=catalogByCategory(0,'paid');
assert(general.slice(8).some(q=>q.answer==='التنغستن'),'600 tier needs expert questions');
assert(general.slice(0,4).some(q=>q.answer==='الأرض'),'200 tier needs accessible questions');
console.log('LAMNA tier QA OK: general knowledge and football free/paid ladders each contain 200/400/600 levels and keep stable question IDs.');
