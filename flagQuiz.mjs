/**
 * Lamna's flag recognition game. 200 = familiar flags, 400 = intermediate,
 * 600 = less familiar/confusable flags. IDs stay anchored at category 11.
 *
 * In this game the PICTURE is the question: never describe the flag or show
 * the country name on the question screen.
 */
export const flagRounds={
 free:[
  {code:'SA',answer:'السعودية',hint:'دولة عربية في شبه الجزيرة العربية'},
  {code:'JP',answer:'اليابان',hint:'دولة آسيوية'},
  {code:'AE',answer:'الإمارات',hint:'دولة خليجية'},
  {code:'CA',answer:'كندا',hint:'دولة في أمريكا الشمالية'},
  {code:'AR',answer:'الأرجنتين',hint:'دولة من أمريكا الجنوبية'},
  {code:'CH',answer:'سويسرا',hint:'دولة أوروبية غير ساحلية'}
 ],
 paid:[
  {code:'TR',answer:'تركيا',hint:'دولة تمتد في آسيا وأوروبا'},
  {code:'FR',answer:'فرنسا',hint:'دولة في أوروبا الغربية'},
  {code:'DE',answer:'ألمانيا',hint:'دولة أوروبية'},
  {code:'EG',answer:'مصر',hint:'دولة عربية في إفريقيا'},
  {code:'BR',answer:'البرازيل',hint:'أكبر دولة في أمريكا الجنوبية من حيث المساحة'},
  {code:'LB',answer:'لبنان',hint:'دولة عربية على المتوسط'},
  {code:'SE',answer:'السويد',hint:'دولة من شمال أوروبا'},
  {code:'KR',answer:'كوريا الجنوبية',hint:'دولة من شرق آسيا'},
  {code:'NP',answer:'نيبال',hint:'دولة آسيوية جبلية'},
  {code:'MX',answer:'المكسيك',hint:'دولة من أمريكا الشمالية'},
  {code:'ZA',answer:'جنوب إفريقيا',hint:'دولة إفريقية'},
  {code:'NZ',answer:'نيوزيلندا',hint:'دولة تقع في أوقيانوسيا'}
 ]
};
export const flagCodes=Object.fromEntries(Object.entries(flagRounds).flatMap(([kind,rows])=>rows.map((row,index)=>[kind+'-'+index,row.code])));
export const flagRoundRows={
 free:flagRounds.free.map((r,i)=>`انظر إلى العلم أمامك وحدد الدولة — بطاقة ${i+1}.|${r.answer}|${r.hint}`),
 paid:flagRounds.paid.map((r,i)=>`تحدّي الأعلام: حدد الدولة من صورتها — بطاقة ${i+7}.|${r.answer}|${r.hint}`)
};
