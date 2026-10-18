import fs from 'node:fs';
import assert from 'node:assert/strict';
import {passportRounds} from '../passportQuiz.mjs';
import {catalogByCategory} from '../serverQuestionBank.mjs';
for(const [kind,limit] of [['free',6],['paid',12]]){
 const rounds=catalogByCategory(74,kind);
 assert.equal(rounds.length,limit,'Passport game must cover every level');
 assert.equal(passportRounds[kind].length,limit);
 const countries=new Set();
 for(let i=0;i<limit;i++){
  const q=rounds[i],metadata=passportRounds[kind][i];
  assert.equal(q.passportCode,metadata.code,'Cover must match the answer, not a generic travel graphic');
  assert.equal(q.answer,metadata.answer);
  assert(!q.prompt.includes(q.answer),'The question must not disclose the country before reveal');
  assert(/جواز/.test(q.prompt),'Passport quiz questions must be about passport covers');
  countries.add(q.passportCode);
 }
 assert.equal(countries.size,limit,'Every question needs a different passport cover');
}
assert.equal(new Set([...passportRounds.free,...passportRounds.paid].map(x=>x.code)).size,18,'Require 18 different countries across free and paid');
const catalog=fs.readFileSync(new URL('../src/gameCatalog.ts',import.meta.url),'utf8');
assert(catalog.includes('"جوازات السفر"'),'The passport game must be discoverable by name');
const app=fs.readFileSync(new URL('../src/App.tsx',import.meta.url),'utf8');
assert(app.includes('selected[Math.floor(active/6)]===74&&currentQuestion.passportCode'),'Do not use unrelated travel art for passport covers');
assert(app.includes('<PassportCover passportCode={currentQuestion.passportCode} imageUrl={currentQuestion.imageUrl}/>'),'Must show the correct cover to players');
const component=fs.readFileSync(new URL('../src/PassportCover.tsx',import.meta.url),'utf8');
assert(component.includes('lm-passport-name-mask'),'Real passport photos must hide the country label');
assert(component.includes('feGaussianBlur'),'Illustrated placeholders must mask the issuer');
assert(component.includes('onError={()=>setImageFailed(true)}'),'Broken real photos fall back to styled passport cover');
assert(component.includes('نموذج تجريبي'),'Do not claim demo covers are authentic');
const bank=fs.readFileSync(new URL('../serverQuestionBank.mjs',import.meta.url),'utf8');
assert(bank.includes('passportCode:passportCodes'),'Persist card metadata within new matches');
console.log('LAMNA passport QA OK: 6 free + 12 paid country-specific passport-cover rounds; masked labels; photo fallback; old ID 74 retained.');
