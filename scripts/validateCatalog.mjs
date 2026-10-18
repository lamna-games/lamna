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
assert.equal(names.length,80,'Exactly eighty categories expected');
assert.equal(new Set(names).size,80,'Duplicated game names');
const assigned=sections.flatMap(section=>section.ids);
assert.equal(assigned.length,80,'Each game must appear in exactly one section');
assert.equal(new Set(assigned).size,80,'Duplicate game section ID');
assert.deepEqual([...assigned].sort((a,b)=>a-b),Array.from({length:80},(_,i)=>i),'Missing catalogue IDs');
assert(sections.some(section=>section.name==='الحروف'&&section.ids.length>=8),'Dedicated alphabet section must exist');
let total=0;let alerts=[];
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
   const canonical=q.prompt.replace(/[\u064b-\u065f\s،؟.!]/g,'').toLowerCase();
   assert(!prompts.has(canonical),'Repeated question within the same game '+id+': '+q.prompt);
   prompts.add(canonical);
   total++;
  }
 }
}
assert.equal(total,80*18);
console.log('LAMNA QA OK: '+names.length+' real games; '+sections.length+' sections; '+total+' free/paid question entries; complete section coverage.');
console.log('Game IDs and existing paid match snapshots are immutable; external provider activation is excluded from build QA.');
