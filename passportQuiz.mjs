/**
 * Country-passport rounds for the original game ID 74, formerly general
 * travel trivia. Keep this ID stable so saved match snapshots remain valid.
 * Codes are private puzzle metadata; do not render code/answer until reveal.
 * Real passport photos can be supplied per question through imageUrl.
 */
export const passportRounds={
 free:[
  {code:'sa',answer:'السعودية',hint:'دولة عربية في شبه الجزيرة العربية'},
  {code:'ae',answer:'الإمارات',hint:'دولة عربية خليجية'},
  {code:'jp',answer:'اليابان',hint:'دولة جزيرية في شرق آسيا'},
  {code:'us',answer:'الولايات المتحدة',hint:'دولة في أمريكا الشمالية'},
  {code:'gb',answer:'المملكة المتحدة',hint:'دولة أوروبية'},
  {code:'ca',answer:'كندا',hint:'دولة في شمال أمريكا'}
 ],
 paid:[
  {code:'kw',answer:'الكويت',hint:'دولة عربية خليجية'},
  {code:'qa',answer:'قطر',hint:'دولة عربية خليجية'},
  {code:'om',answer:'عُمان',hint:'دولة عربية في شبه الجزيرة العربية'},
  {code:'bh',answer:'البحرين',hint:'دولة عربية خليجية'},
  {code:'fr',answer:'فرنسا',hint:'دولة أوروبية'},
  {code:'de',answer:'ألمانيا',hint:'دولة في وسط أوروبا'},
  {code:'it',answer:'إيطاليا',hint:'دولة أوروبية على البحر المتوسط'},
  {code:'es',answer:'إسبانيا',hint:'دولة في جنوب غرب أوروبا'},
  {code:'cn',answer:'الصين',hint:'دولة آسيوية'},
  {code:'in',answer:'الهند',hint:'دولة في جنوب آسيا'},
  {code:'au',answer:'أستراليا',hint:'دولة في أوقيانوسيا'},
  {code:'br',answer:'البرازيل',hint:'دولة في أمريكا الجنوبية'}
 ]
};
export const passportCodes=Object.fromEntries(Object.entries(passportRounds).flatMap(([kind,rows])=>rows.map((row,index)=>[kind+'-'+index,row.code])));
export const passportRoundRows={
 free:passportRounds.free.map((q,i)=>`جواز السفر رقم ${i+1}: ما الدولة التي أصدرت هذا الجواز؟|${q.answer}|${q.hint}`),
 paid:passportRounds.paid.map((q,i)=>`تحدّي الجوازات رقم ${i+7}: ما الدولة صاحبة هذا الجواز؟|${q.answer}|${q.hint}`)
};
