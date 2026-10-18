import fs from 'node:fs';
import assert from 'node:assert/strict';
import {catalogByCategory} from '../serverQuestionBank.mjs';

const source=fs.readFileSync(new URL('../src/gameCatalog.ts',import.meta.url),'utf8');
function parseTsLiteral(name){
 const escaped=name.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
 const match=source.match(new RegExp('export const '+escaped+' = ([\\s\\S]*?) as const;'));
 if(!match)throw new Error('Missing game catalogue export: '+name);
 return JSON.parse(match[1]);
}
const names=parseTsLiteral('categories');
const sections=parseTsLiteral('categorySections');
// The alphabet is a TypeScript array of single-quoted letters, not a JSON array.
const alphabetLiteral=source.match(/export const arabicAlphabet = \[([^\]]+)\] as const;/);
assert(alphabetLiteral,'Arabic alphabet export missing');
const alphabet=[...alphabetLiteral[1].matchAll(/'([^']+)'/g)].map(match=>match[1]);
const expectedAlphabet=['أ','ب','ت','ث','ج','ح','خ','د','ذ','ر','ز','س','ش','ص','ض','ط','ظ','ع','غ','ف','ق','ك','ل','م','ن','ه','و','ي'];
assert.deepEqual(alphabet,expectedAlphabet,'Arabic alphabet must contain all 28 distinct single-letter glyphs in order');
assert(alphabet.every(letter=>Array.from(letter).length===1),'Every Arabic tile must contain exactly one letter');
const letterGameIds=new Set([36,39,50,51,52,53,54,55,56,57]);
assert.deepEqual(sections.find(section=>section.name==='الحروف')?.ids.slice().sort((a,b)=>a-b), [...letterGameIds].sort((a,b)=>a-b),'All ten letter games must be in the exclusive letter section');
assert.equal(names.length,80,'Exactly eighty categories expected');
assert.equal(new Set(names).size,80,'Duplicated game names');
const assigned=sections.flatMap(section=>section.ids);
assert.equal(assigned.length,80,'Each game must appear in exactly one section');
assert.equal(new Set(assigned).size,80,'Duplicate game section ID');
assert.deepEqual([...assigned].sort((a,b)=>a-b),Array.from({length:80},(_,i)=>i),'Missing catalogue IDs');
assert(sections.some(section=>section.name==='الحروف'&&section.ids.length>=8),'Dedicated alphabet section must exist');
let total=0;
const allPrompts=new Map();
const normalizeQuestion=prompt=>String(prompt).normalize('NFKC')
 .replace(/[\u064b-\u065f\u0670\u0640\s؟?،,.!«»"'()]/g,'').toLowerCase();
function answerLetter(answer){
 const clean=String(answer).trim().replace(/^[\s\u064B-\u065F\u0670\u0640"«»'()]+/g,'');
 const special={'الألف':'أ','الباء':'ب','التاء':'ت','الثاء':'ث','الجيم':'ج','الحاء':'ح','الخاء':'خ','الدال':'د','الذال':'ذ','الراء':'ر','الزاي':'ز','السين':'س','الشين':'ش','الصاد':'ص','الضاد':'ض','الطاء':'ط','الظاء':'ظ','العين':'ع','الغين':'غ','الفاء':'ف','القاف':'ق','الكاف':'ك','اللام':'ل','الميم':'م','النون':'ن','الهاء':'ه','الواو':'و','الياء':'ي'};
 if(special[clean])return special[clean];
 const base=clean.startsWith('ال')&&clean.length>3?clean.slice(2):clean;
 const first=Array.from(base)[0]||'';
 if(/[إأآٱا]/.test(first))return 'أ';
 if(/[هة]/.test(first))return 'ه';
 if(first==='ى')return 'ي';
 return first;
}
const localSpelling=/[�□]|\s{3,}|(\?|؟){3,}/;
for(let id=0;id<80;id++){
 for(const kind of ['free','paid']){
  const questions=catalogByCategory(id,kind);
  assert.equal(questions.length,kind==='free'?6:12,'Bad question capacity for game '+id+' '+kind);
  const prompts=new Set();
  for(let q of questions){
   assert(typeof q.prompt==='string'&&typeof q.answer==='string'&&typeof q.hint==='string','Missing fields: '+id);
   assert(q.prompt.trim().length>=9&&q.answer.trim().length>=1,'Empty or suspicious question: '+id);
   assert(!localSpelling.test(q.prompt+q.answer),'Broken characters or spacing in '+id);
   const canonical=normalizeQuestion(q.prompt);
   assert(!prompts.has(canonical),'Repeated question within the same game '+id+': '+q.prompt);
   assert(!allPrompts.has(canonical),'Repeated question across games '+allPrompts.get(canonical)+' and '+id+' ('+kind+'): '+q.prompt);
   allPrompts.set(canonical,id+' '+kind);
   prompts.add(canonical);
   if(letterGameIds.has(id)){
    const glyph=answerLetter(q.answer);
    assert.equal(alphabet.filter(letter=>letter===glyph).length,1,'A letter-game answer must color exactly one valid letter: '+id+' '+q.answer);
   }
   total++;
  }
 }
}
assert.equal(total,80*18);
console.log('LAMNA QA OK: '+names.length+' real games; '+sections.length+' sections; '+total+' free/paid question entries; complete section coverage; no repeated prompts across games; 28 valid letter tiles.');
console.log('Game IDs and existing paid match snapshots are immutable; external provider activation is excluded from build QA.');
