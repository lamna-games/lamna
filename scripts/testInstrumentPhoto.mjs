import assert from 'node:assert/strict';
import {catalogByCategory} from '../serverQuestionBank.mjs';
import {instrumentPhotoAssets} from '../instrumentPhotoAssets.mjs';

const free=catalogByCategory(47,'free');
const paid=catalogByCategory(47,'paid');
const oudPhoto=instrumentPhotoAssets['free-0'];
const pianoPhoto=instrumentPhotoAssets['free-1'];
const violinPhoto=instrumentPhotoAssets['free-4'];
assert.equal(free.length,6);
assert.equal(paid.length,12);
for(const [index,answer,photo,credit] of [
 [0,'العود',oudPhoto,'The Metropolitan Museum of Art'],
 [1,'البيانو',pianoPhoto,'Raysonho'],
 [4,'الكمان',violinPhoto,'Just plain Bill']
]){
 const row=free[index];
 assert.equal(row.id,'free-47-'+index);
 assert.equal(row.answer,answer);
 assert.equal(row.imageUrl,photo.imageUrl);
 assert.equal(row.photoSource,photo.photoSource);
 assert.equal(row.photoLicense,'CC0 1.0');
 assert.equal(row.photoCredit,credit);
 assert(row.imageUrl.startsWith('https://'),'Image must use HTTPS');
 assert(row.photoSource.startsWith('https://commons.wikimedia.org/wiki/File:'),'Require verifiable original source');
 assert(!row.prompt.includes(answer),'Do not reveal the instrument in the question');
 assert(!row.prompt.includes('سوداء وبيضاء'),'Do not answer via the text prompt');
}
for(const row of [...free.filter((_,i)=>![0,1,4].includes(i)),...paid]){
 assert(!row.imageUrl,'Do not reuse instrument photos for other cards');
}
assert.equal(new Set([free[0].imageUrl,free[1].imageUrl,free[4].imageUrl]).size,3,'Each instrument must use its own image');
console.log('LAMNA instrument photo pilot OK: 3/18 documented real photos (oud, piano, violin) with correct questions and rights.');
