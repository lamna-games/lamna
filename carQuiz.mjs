/**
 * Lamna #81 — عالم السيارات (stable category ID 80).
 *
 * Every question MUST use a verified, rights-cleared real photo of the
 * IDENTIFIED model and appropriate photographed angle. No generative photos,
 * unrelated cars, ambiguous trims, or photo reuse. Brand/model appears ONLY
 * after reveal; hidden-logo crops may be used for the harder tiers.
 *
 * Photos are deliberately not invented. Until 18 correct photos are attached
 * via the authorized admin media workflow, matches choosing this game are
 * rejected without consuming credits. Do not call this launch-ready.
 */
export const carPhotoReady=false;
export const carRounds={
 free:[
  {model:'تويوتا كامري',view:'front',angle:'الواجهة الأمامية',tier:200},
  {model:'تويوتا لاندكروزر 300',view:'front',angle:'الواجهة الأمامية',tier:200},
  {model:'هيونداي سوناتا',view:'interior',angle:'داخلية السيارة',tier:400},
  {model:'كيا سبورتاج',view:'rear',angle:'الواجهة الخلفية',tier:400},
  {model:'جينيسيس G80',view:'interior',angle:'لوحة القيادة',tier:600},
  {model:'لكزس LC 500',view:'detail',angle:'تفصيل من داخلية السيارة',tier:600}
 ],
 paid:[
  {model:'تويوتا هايلكس',view:'front',angle:'الواجهة الأمامية',tier:200},
  {model:'نيسان باترول',view:'front',angle:'الواجهة الأمامية',tier:200},
  {model:'فورد موستانج',view:'front',angle:'الواجهة الأمامية',tier:200},
  {model:'مرسيدس G-Class',view:'front',angle:'الواجهة الأمامية',tier:200},
  {model:'هيونداي توسان',view:'interior',angle:'داخلية السيارة',tier:400},
  {model:'مازدا CX-5',view:'rear',angle:'الواجهة الخلفية',tier:400},
  {model:'هوندا أكورد',view:'interior',angle:'لوحة القيادة',tier:400},
  {model:'شيفروليه تاهو',view:'rear',angle:'الواجهة الخلفية',tier:400},
  {model:'رينج روفر فيلار',view:'interior',angle:'لوحة القيادة',tier:600},
  {model:'بورشه تايكان',view:'interior',angle:'الكونسول الداخلي',tier:600},
  {model:'بي إم دبليو i4',view:'detail',angle:'تفصيل من السيارة',tier:600},
  {model:'أودي RS e-tron GT',view:'detail',angle:'تفصيل من السيارة',tier:600}
 ]
};
export const carQuestionRows=Object.fromEntries(Object.entries(carRounds).map(([kind,rounds])=>[
 kind,rounds.map((r,i)=>{
  const n=kind==='free'?i+1:i+7;
  return `من خلال صورة ${r.angle}، ما اسم السيارة؟ (بطاقة ${n})|${r.model}|مستوى ${r.tier} — لاحظ تصميم السيارة دون الاعتماد على الشعار`;
 })
]));
export const carCards=Object.fromEntries(Object.entries(carRounds).flatMap(([kind,rounds])=>
 rounds.map((r,i)=>[kind+'-'+i,{photoKey:'car-'+String(kind==='free'?i+1:i+7).padStart(2,'0'),view:r.view,tier:r.tier}])
));
