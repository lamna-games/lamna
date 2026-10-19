import assert from 'node:assert/strict';
import {catalogByCategory} from '../serverQuestionBank.mjs';
import {instrumentPhotoAssets} from '../instrumentPhotoAssets.mjs';

const free=catalogByCategory(47,'free');
const paid=catalogByCategory(47,'paid');
const photo=instrumentPhotoAssets['free-1'];
assert.equal(free.length,6);
assert.equal(paid.length,12);
assert.equal(free[1].id,'free-47-1');
assert.equal(free[1].answer,'البيانو');
assert.equal(free[1].imageUrl,photo.imageUrl);
assert.equal(free[1].photoSource,photo.photoSource);
assert.equal(free[1].photoLicense,'CC0 1.0');
assert.equal(free[1].photoCredit,'Raysonho');
assert(!free[1].prompt.includes('البيانو'),'Do not reveal the instrument in the question');
assert(!free[1].prompt.includes('سوداء وبيضاء'),'Do not answer via the text prompt');
for(const row of [...free.slice(0,1),...free.slice(2),...paid])assert(!row.imageUrl,'Do not reuse piano image for other instruments');
console.log('LAMNA instrument photo pilot OK: 1/18 verified piano photo, correct free question and rights.');
