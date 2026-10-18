import assert from 'node:assert/strict';
import fs from 'node:fs';
import {catalogByCategory} from '../serverQuestionBank.mjs';
import {getQuestionVisualTheme} from '../src/questionVisualTheme.mjs';
import {validQuestionImageUrl} from '../questionImagePolicy.mjs';

const themes=new Set(['globe','landmark','city','travel','money','football','sport','film','music','food','faith','history','science','space','health','sea','technology','gaming','language','nature','math','ideas','drama','camera']);
const ignored=new Set([1,2,7,9,12,13,16,38,39,40,41,50,51,52,53,54,55,56,57,74]);
assert.equal(getQuestionVisualTheme(0,'كم عدد ركعات الصلاة المفروضة؟'),'faith','Prayer questions should show faith-related art');
assert.equal(getQuestionVisualTheme(0,'ما المدينة الخليجية التي تضم مطارا دوليا؟'),'globe','Geography questions should show the globe');
assert.equal(getQuestionVisualTheme(28,'ما عاصمة لبنان؟'),'globe');
assert.equal(getQuestionVisualTheme(79,'ما اسم هذه اللعبة؟'),'gaming');
for(const id of ignored)assert.equal(getQuestionVisualTheme(id,'ما الإجابة الصحيحة؟'),null,'QR and answer-guessing categories must not show generic spoiler illustrations: '+id);
let total=0,illustrated=0,missing=[],misclassified=[];
for(let category=0;category<80;category++){
 let categoryShown=0;
 for(const kind of ['free','paid'])for(const q of catalogByCategory(category,kind)){
  const theme=getQuestionVisualTheme(category,q.prompt);
  if(theme!==null){illustrated++;categoryShown++;if(!themes.has(theme))misclassified.push(category+':'+theme);}
  total++;
 }
 if(!ignored.has(category)&&categoryShown===0)missing.push(category);
}
assert.equal(total,1440);
assert.equal(misclassified.length,0,'Question pictures have an unknown illustration theme: '+misclassified);
assert(illustrated>total*.58,'Most eligible questions should have a relevant illustration; observed '+illustrated+'/'+total);
assert.equal(missing.length,0,'No topic pictures mapped for supported categories: '+missing);
const app=fs.readFileSync(new URL('../src/App.tsx',import.meta.url),'utf8');
const component=fs.readFileSync(new URL('../src/QuestionVisual.tsx',import.meta.url),'utf8');
assert(app.includes('<QuestionVisual category={selected[Math.floor(active/6)]} prompt={currentQuestion.prompt} imageUrl={currentQuestion.imageUrl}/>'),'Question picture must show before revealing answer and accept approved user media');
assert(app.indexOf('<QuestionVisual')>app.indexOf(') : reveal ? ('),'Never add a picture to the answer screen');
assert(!component.includes('currentQuestion?.answer'),'Question pictures must not embed the correct answer');
assert(!component.includes('https://'),'Question art must not fetch unauthorized third-party photos');
const accepted=[
 '', 'https://res.cloudinary.com/l1ixwj8b/image/upload/v1791818599/lamna-quiz/photo.webp',
 'https://res.cloudinary.com/l1ixwj8b/image/upload/q_auto,f_auto/v1791818599/folder/photo.jpg'
];
const rejected=[
 'http://res.cloudinary.com/l1ixwj8b/image/upload/a.jpg',
 'https://res.cloudinary.com/other-account/image/upload/a.jpg',
 'https://evil.example.net/track.png',
 'data:image/svg+xml;base64,AAAA',
 'javascript:alert(1)',
 'https://res.cloudinary.com/l1ixwj8b/raw/upload/secret.txt',
 'https://res.cloudinary.com/l1ixwj8b/image/upload/picture.svg',
 'https://res.cloudinary.com/l1ixwj8b/image/upload/picture.jpg?redirect=http://bad.test'
];
for(const image of accepted)assert(validQuestionImageUrl(image),'Approved image URL rejected: '+image);
for(const image of rejected)assert(!validQuestionImageUrl(image),'Untrusted image URL accepted: '+image);
assert(component.includes('onError={()=>setPhotoFailed(true)}'),'Broken photographs need a safe illustration fallback');
console.log('LAMNA image QA OK: '+illustrated+'/'+total+' question entries assigned original contextual illustrations; QR, letter board and guess-the-picture questions protected.');
