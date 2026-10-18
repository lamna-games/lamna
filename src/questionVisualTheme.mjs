// Safe picture selection by question topic. This module never receives answer text.
// Don't introduce answer-shaped clues into visual puzzles, Zoom, logos,
// 'guess the thing', memory or letter-board games: they already have
// their own visual rules.
const puzzles=new Set([1,2,7,9,12,13,16,38,39,40,41,50,51,52,53,54,55,56,57,74]);
const specificTheme={
 3:'film',4:'football',5:'music',6:'language',8:'history',10:'history',11:'globe',
 15:'food',17:'language',18:'sport',19:'ideas',20:'language',21:'nature',
 22:'technology',23:'film',24:'film',25:'football',26:'football',27:'football',
 28:'globe',29:'globe',30:'money',31:'travel',32:'language',33:'landmark',
 34:'city',35:'food',36:'language',37:'language',42:'faith',43:'faith',
 44:'faith',45:'faith',46:'faith',47:'music',48:'travel',49:'technology',
 58:'landmark',59:'football',60:'football',61:'football',62:'history',
 63:'technology',64:'health',65:'space',66:'sea',67:'city',68:'food',
 69:'language',70:'language',71:'language',72:'faith',73:'faith',
 75:'travel',76:'film',77:'music',78:'drama',79:'gaming'
};


// Manual per-question editorial decisions for the first five reviewed games.
// A null choice is deliberate: an irrelevant or answer-revealing picture
// is worse than a legible text-only question. The sea scene is retained.
export const reviewedVisualGames=[4,28,33,34,66];
const selectedQuestionScenes={
  4:[
    [/المنطقة التي يُسمح فيها للحارس بمسك الكرة/, 'penaltyarea'],
    [/الخط الذي يفصل نصفي الملعب/, 'midline'],
    [/المخالفة عند لمس الكرة باليد عمدًا/, 'handball'],
    [/الضربة التي تنفذ من زاوية الملعب/, 'corner']
  ],
  33:[
    [/نافورة الملك فهد/, 'fountain'],
    [/موقع التراث العالمي في العلا الذي يضم المقابر المنحوتة/, 'carvedrocks'],
    [/الحي التاريخي المسجل في اليونسكو بمدينة جدة/, 'oldtown'],
    [/الواحة السعودية المعروفة بوفرة النخيل/, 'oasis'],
    [/القرية التراثية المشهورة في منطقة عسير/, 'mountains'],
    [/الطريق القديم الذي يرتبط بالحج/, 'caravan']
  ],
  34:[
    [/حي البلد التاريخي/, 'oldtown'],
    [/نافورة الملك فهد/, 'fountain'],
    [/تقع أبها/, 'mountains'],
    [/مدينة الورد/, 'roses'],
    [/مركز محافظة الأحساء/, 'oasis'],
    [/مشهور[ة]? بمينائها في البحر الأحمر/, 'coast'],
    [/الغوص واللؤلؤ/, 'pearldive']
  ]
};

/** Select a picture about the QUESTION topic, not the correct ANSWER. */
export function getQuestionVisualTheme(category,prompt){
 if(puzzles.has(category))return null;
 const q=String(prompt||'').normalize('NFKC');
 if(category===66)return 'sea'; // Approved: retain the existing sea artwork.
 if(category===28)return null; // All capital questions work better without spoilers.
 if(Object.prototype.hasOwnProperty.call(selectedQuestionScenes,category)){
  return selectedQuestionScenes[category].find(([pattern])=>pattern.test(q))?.[1]??null;
 }
 // For mixed/general knowledge, select by question wording when reliable.
 const mixed=[0,14,19].includes(category);
 if(mixed){
  if(/صل[ااوة]|ركع|القرآن|المسجد|رمضان|الصيام|مسلم|النبي|الديانة|الإسلام/.test(q))return 'faith';
  if(/عاصمة|مدينة|دول|قارة|خليج|بحر|محيط|القارات|العالم|جزيرة|بلد/.test(q))return 'globe';
  if(/كوكب|شمس|قمر|نجوم|فضاء/.test(q))return 'space';
  if(/ساع|دقيق|زمن|عدد|حساب|رقم|كم يساوي/.test(q))return 'math';
  if(/كرة|مباراة|لاعب|منتخب|رياض/.test(q))return 'sport';
  if(/طعام|أكل|طبخ|مطبخ|قهوة/.test(q))return 'food';
  if(/تاريخ|حضارة|ملك|مملكة|عهد/.test(q))return 'history';
  if(/حاسب|تقنية|برنامج|هاتف|اختراع/.test(q))return 'technology';
  if(/فيزياء|كيمياء|عنصر|علم|جسم|طاقة/.test(q))return 'science';
  return mixed&&category===19?'ideas':null;
 }
 return specificTheme[category]??null;
}

