import assert from 'node:assert/strict';
import {saudiHistoryRounds as rounds} from '../saudiHistoryRounds.mjs';

// Draft content QA. This does NOT imply the bank is active in serverQuestionBank.
assert.equal(rounds.free.length,6,'Free bank needs 2 questions per tier');
assert.equal(rounds.paid.length,12,'Paid bank needs 4 questions per tier');
const all=[...rounds.free,...rounds.paid].map(line=>line.split('|'));
assert(all.every(row=>row.length===3&&row.every(field=>field.trim())),'Missing prompt, answer, or hint');
const prompts=all.map(row=>row[0].normalize('NFKC').replace(/[\s؟?،,.!«»]/g,''));
assert.equal(new Set(prompts).size,18,'Duplicate question prompts');
for(const [kind,rows,slots] of [['free',rounds.free,2],['paid',rounds.paid,4]]){
 for(const [index,points] of [200,400,600].entries()){
  assert.equal(rows.slice(index*slots,(index+1)*slots).length,slots,kind+' '+points+' tier missing questions');
 }
}
assert(rounds.free[5].includes('تأسيس الدولة السعودية الثانية ثم استعادة الرياض ثم إعلان توحيد المملكة'),'Historical order must be 1824, 1902, 1932');
assert(!rounds.free[5].split('|')[2].match(/1824|1902|1932/),'Hint must not reveal event years');
assert(rounds.paid.some(q=>q.includes('1139هـ')),'First Saudi state Hijri year missing');
assert(rounds.paid.some(q=>q.includes('1240هـ')),'Second Saudi state Hijri year missing');
assert(rounds.paid.some(q=>q.includes('1351هـ')),'Kingdom unification Hijri year missing');
console.log('Game 11 draft QA OK: 6 free + 12 paid, tier slots, unique complete rows, chronology and non-revealing hint; activation pending.');
