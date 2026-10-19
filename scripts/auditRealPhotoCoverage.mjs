import {catalogByCategory} from '../serverQuestionBank.mjs';

// Read-only source-bank audit. A license label is metadata, NOT independent
// verification that a file is authentic, matches its answer, or may be used.
const games=[];
const suspicious=[];
for(let gameId=0;gameId<81;gameId++){
 const questions=[...catalogByCategory(gameId,'free'),...catalogByCategory(gameId,'paid')];
 const summary={gameId,total:questions.length,withImage:0,withPhotoMetadata:0,flags:0,withoutImage:0};
 for(const q of questions){
  const url=typeof q.imageUrl==='string'?q.imageUrl.trim():'';
  const metadata=['photoCredit','photoSource','photoLicense'].every(k=>typeof q[k]==='string'&&q[k].trim());
  if(!url){summary.withoutImage++;continue;}
  summary.withImage++;
  if(q.flagCode){summary.flags++;continue;}
  if(metadata)summary.withPhotoMetadata++;
  else suspicious.push({gameId,questionId:q.id,reason:'Image without complete photographer/source/license metadata'});
 }
 games.push(summary);
}
const total=(field)=>games.reduce((sum,g)=>sum+g[field],0);
const report={
 scope:'source question bank only; excludes admin database edits and actual visual/license verification',
 games:games.length,questions:total('total'),withImage:total('withImage'),
 withPhotoMetadata:total('withPhotoMetadata'),flags:total('flags'),
 withoutImage:total('withoutImage'),imagesMissingMetadata:suspicious.length,
 games,imagesNeedingRightsReview:suspicious
};
console.log(JSON.stringify(report,null,2));
