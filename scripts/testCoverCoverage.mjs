import fs from 'node:fs';
import assert from 'node:assert/strict';
const read=name=>fs.readFileSync(new URL('../src/'+name,import.meta.url),'utf8');
const cover=read('CartoonCover.tsx');
const expansion=read('ExpansionCoverArt.tsx');
const newer=read('NewCovers80.tsx');
const groups=[
 {name:'IllustratedCoversA.tsx',from:20,to:29},
 {name:'IllustratedCoversB.tsx',from:30,to:39},
 {name:'IllustratedCoversC.tsx',from:40,to:49}
];
assert(cover.includes('<NewCovers80 i={i}/>'),'Missing cover dispatcher for games 50–79');
assert(cover.includes('<ExpansionCoverArt i={i}/>'),'Missing cover dispatcher for games 20–49');
assert(cover.includes('LAMNA_OFFICIAL_LOGO'),'Original graphical Lamna logo must stay on every cover');
assert(expansion.includes('<IllustratedCoversA i={i}/>')&&expansion.includes('<IllustratedCoversB i={i}/>')&&expansion.includes('<IllustratedCoversC i={i}/>'),'Missing original illustration import or routing');
for(const group of groups){
 const source=read(group.name);
 const cases=new Set([...source.matchAll(/case\s+(\d+)\s*:/g)].map(m=>Number(m[1])));
 for(let id=group.from;id<=group.to;id++)assert(cases.has(id),group.name+' is missing cover art for game '+id);
}
assert(/i\s*>=\s*50\s*&&\s*i\s*<=\s*57/.test(newer)&&newer.includes('<Letters id={i}/>'),'Games 50–57 must draw their own letter board artwork');
const cases=new Set([...newer.matchAll(/case\s+(\d+)\s*:/g)].map(m=>Number(m[1])));
for(let id=58;id<81;id++)assert(cases.has(id),'Missing topical cover art for game '+id);
console.log('LAMNA cover routing QA OK: illustrations are mapped for games 20–80; original logo overlay remains intact.');
// This cannot assess subjective illustration quality or physical-device rendering.
