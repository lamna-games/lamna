import assert from 'node:assert/strict';
import fs from 'node:fs';
import {carRounds,carQuestionRows,carCards,carPhotoReady} from '../carQuiz.mjs';
import {carPhotoAssets} from '../carPhotoAssets.mjs';
import {catalogByCategory} from '../serverQuestionBank.mjs';

const src=file=>fs.readFileSync(new URL('../'+file,import.meta.url),'utf8');
const catalog=src('src/gameCatalog.ts');
assert.match(catalog,/"عالم السيارات"/,'Car game name must appear in Lamna');
assert.match(catalog,/"name": "سيارات ومحركات"/,'A dedicated car section is required');
assert.match(catalog,/"ids": \[80\]/,'Car game must keep ID 80');
assert.equal(carPhotoReady,false,'Do not unlock game without vetted real vehicle photos');

const carIds=new Set(),photoKeys=new Set(),models=new Set();
let verifiedPhotoCount=0;
for(const [kind,count,perTier] of [['free',6,2],['paid',12,4]]){
 const rows=catalogByCategory(80,kind);
 assert.equal(rows.length,count,kind+' capacity');
 assert.equal(carRounds[kind].length,count);
 assert.equal(carQuestionRows[kind].length,count);
 for(let i=0;i<count;i++){
  const row=rows[i],draft=carRounds[kind][i];
  assert.equal(row.id,kind+'-80-'+i,'Existing match ID convention must remain stable');
  assert.equal(row.answer,draft.model,'Photo target and answer mismatch');
  assert.equal(row.carView,draft.view,'Image angle and answer mismatch');
  assert.equal(row.carTier,[200,400,600][Math.floor(i/perTier)],'Incorrect 200/400/600 difficulty assignment');
  assert(!row.prompt.includes(draft.model),'Question leaked the car model');
  assert(row.prompt.includes('صورة'),'Photo required for this category');
  const vetted=carPhotoAssets[kind+'-'+i];
  if(vetted){
   verifiedPhotoCount++;
   assert.equal(row.imageUrl,vetted.imageUrl,'Photo must match vetted asset for this card');
   assert.equal(row.photoCredit,vetted.photoCredit,'Photographer attribution missing');
   assert.equal(row.photoSource,vetted.photoSource,'Source attribution missing');
   assert.equal(row.photoLicense,'CC BY-SA 4.0','Unexpected or unverified photo license');
   assert(row.imageUrl.startsWith('https://res.cloudinary.com/l1ixwj8b/image/upload/'),'Use approved Lamna media host');
   assert(row.photoSource.startsWith('https://commons.wikimedia.org/wiki/File:'),'Missing original licensed source');
  }else{
   assert(!row.imageUrl,'Unverified photographs must never be inserted as real photos');
  }
  assert(/^car-\d\d$/.test(row.carPhotoKey),'Unexpected photo identifier');
  assert.equal(row.carPhotoKey,carCards[kind+'-'+i].photoKey);
  assert(!carIds.has(row.id),'Duplicate question ID');carIds.add(row.id);
  assert(!photoKeys.has(row.carPhotoKey),'Duplicate media slot');photoKeys.add(row.carPhotoKey);
  assert(!models.has(row.answer),'Do not repeat models across 200/400/600');models.add(row.answer);
 }
}
assert.equal(photoKeys.size,18);
assert.equal(verifiedPhotoCount,6,'Six verified attributed photos approved so far');
assert.equal(models.size,18);
const commerce=src('commerce.mjs');
assert(commerce.includes('id<81'),'Admin must recognize game 81');
assert(commerce.includes('x>80'),'Server match validation must accept ID 80');
assert(commerce.includes('car_photos_pending'),'Car game must reject play if authentic photos are missing');
assert(commerce.includes("selected.includes(80)"),'Car game must not consume free game/paid credits yet');
assert(commerce.includes("CHECK(game_id BETWEEN 0 AND 80)"),'Admin table must support ID 80');
const app=src('src/App.tsx');
assert(app.includes('disabled={i===80}'),'User should see game as preparation rather than selecting missing-photo puzzle');
assert(app.includes('<CarQuestion imageUrl={currentQuestion.imageUrl} view={currentQuestion.carView}/>'),'Real approved vehicle photo must be usable after completion');
const visual=src('src/CarQuestion.tsx');
assert(visual.includes('!imageUrl||failed'),'Missing photos must never become fake images');
assert(visual.includes('onError={()=>setFailed(true)}'),'Broken photo URL must be explicit');
for(const asset of Object.values(carPhotoAssets)){
 assert(visual.includes(asset.photoSource),'In-game photo source attribution missing: '+asset.photoSource);
 assert(visual.includes("author:'"+asset.photoCredit+"'"),'In-game photographer attribution missing: '+asset.photoCredit);
}

console.log('LAMNA car-game QA OK: category 80 (game 81), dedicated section, 18 unique model/photo slots; all 200/400/600 tiers; player and credit safety; 6 real photos attached; 12 still PENDING.');
