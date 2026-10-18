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

/** Select a picture about the QUESTION topic, not the correct ANSWER. */
export function getQuestionVisualTheme(category,prompt){
 if(puzzles.has(category))return null;
 const q=String(prompt||'').normalize('NFKC');
 // For mixed/general knowledge, select by question wording when reliable.
 const mixed=[0,14,19].includes(category);
 if(mixed){
  if(/صل[ااوة]|ركع|القرآن|المسجد|رمضان|الصيام|مسلم|النبي|دين/.test(q))return 'faith';
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

