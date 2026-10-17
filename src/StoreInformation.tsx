import React from 'react';
import { ArrowRight, ShieldCheck, FileText, HelpCircle, Headphones, ExternalLink } from 'lucide-react';
import './storeInformation.css';

export type InformationPage='privacy'|'terms'|'faq'|'contact';
const whatsapp='https://wa.me/966531360039';

export default function StoreInformation({page,onBack}:{page:InformationPage;onBack:()=>void}){
 const config={
  privacy:{title:'سياسة الخصوصية',sub:'كيف نتعامل مع معلوماتك أثناء استخدام ألعاب لمنا.',icon:ShieldCheck},
  terms:{title:'الشروط والأحكام',sub:'قواعد استخدام المنصة وتجربة الألعاب.',icon:FileText},
  faq:{title:'الأسئلة الشائعة',sub:'إجابات مختصرة لأهم الأسئلة قبل اللعب.',icon:HelpCircle},
  contact:{title:'تواصل معنا',sub:'يسعدنا استقبال استفساراتك وملاحظاتك.',icon:Headphones}
 }[page];
 const Icon=config.icon;
 return <main className="lm-information" dir="rtl">
  <section className="lm-information-shell">
   <button className="lm-information-back" onClick={onBack} type="button"><ArrowRight size={18}/> الرجوع للرئيسية</button>
   <header className="lm-information-heading"><div className="lm-information-icon"><Icon size={26}/></div><h1>{config.title}</h1><p>{config.sub}</p></header>
   {page==='privacy'&&<div className="lm-information-sections">
    <section><h2>المعلومات التي تستخدمها المنصة</h2><p>عند إنشاء مباراة، تدخل أسماء الفرق واسم المباراة واختيارات الألعاب ووسائل المساعدة. تُحفظ بيانات المباراة في مساحة التخزين المحلية لمتصفحك حتى تتمكن من متابعة اللعب على الجهاز نفسه. تستطيع إزالة هذه البيانات من إعدادات المتصفح.</p></section>
    <section><h2>الحسابات وبيانات التواصل</h2><p>لا تطلب لمنا إنشاء حساب لاستخدام الألعاب الحالية. عندما تتاح الحسابات بشكل رسمي، ستُعرض متطلبات التسجيل وطريقة حماية بياناتها قبل الاستخدام. وإذا تواصلت معنا عبر واتساب أو حسابات التواصل، فإن البيانات التي تشاركها هناك تخضع أيضًا لسياسة خدمة التواصل المستخدمة.</p></section>
    <section><h2>الاستضافة والخدمات الخارجية</h2><p>تعتمد المنصة على خدمات استضافة وتشغيل للصفحات والمحتوى البصري ووظائف الألعاب. عند استخدامها قد تعالج تلك الخدمات بيانات تقنية لازمة لتشغيل الاتصال، مثل عنوان الإنترنت وسجلات الطلبات، وفقًا لسياساتها.</p></section>
    <section><h2>الدفع والشراء</h2><p>لا نجمع معلومات بطاقات دفع أو ننفّذ عمليات شراء من هذه الواجهة حاليًا.</p></section>
    <section><h2>الاستفسار عن الخصوصية</h2><p>للاستفسارات المتعلقة بالمعلومات أو طلب المساعدة، تواصل معنا عبر رقم خدمة العملاء 0531360039.</p></section>
   </div>}
   {page==='terms'&&<div className="lm-information-sections">
    <section><h2>استخدام لمنا</h2><p>توفر لمنا ألعابًا ترفيهية جماعية. باستخدام المنصة توافق على استخدامها بطريقة نظامية ومحترمة، وعلى عدم محاولة تعطيل الخدمة أو الوصول غير المصرح به إلى أنظمتها.</p></section>
    <section><h2>قواعد المباريات</h2><p>يختار اللاعبون الفئات والفرق ووسائل المساعدة، وتُحتسب النتائج بحسب اختيارات منظّم المباراة داخل اللعبة. منظّم المباراة مسؤول عن تطبيق التعليمات والتحقق من إجابات الفرق في الأنشطة التي تتطلب حكمًا بشريًا.</p></section>
    <section><h2>المحتوى والحقوق</h2><p>شعار لمنا، والواجهة، والمحتوى الأصلي الموجود في المنصة مخصص للاستخدام داخل تجربة الألعاب. لا يُسمح بنسخ المحتوى ونشره أو إعادة بيعه أو انتحال هوية لمنا دون إذن مناسب، مع احترام حقوق أصحاب المواد والعلامات الأخرى.</p></section>
    <section><h2>توفر الخدمة</h2><p>قد تتوقف بعض الوظائف مؤقتًا بسبب الصيانة أو الاتصال بالإنترنت أو الخدمات الخارجية. لا تضمن لمنا استمرارية تقنية غير منقطعة.</p></section>
    <section><h2>الدفع والاشتراكات</h2><p>لا توجد عملية دفع مفعّلة من خلال هذه الواجهة حاليًا. وفي حال إضافة منتجات مدفوعة مستقبلًا، ستُعرض أسعارها وشروطها بوضوح قبل طلب الشراء.</p></section>
    <section><h2>التواصل</h2><p>لأي استفسار حول شروط الاستخدام تواصل عبر واتساب خدمة العملاء.</p></section>
   </div>}
   {page==='faq'&&<div className="lm-information-sections lm-faq-list">
    {[
     ['كيف أبدأ اللعب؟','اضغط «إنشاء لعبة»، واختر 6 فئات، ثم أدخل اسم المباراة واسم الفريقين، وحدد 3 وسائل مساعدة لكل فريق واضغط «ابدأ اللعب».'],
     ['هل أحتاج إلى حساب؟','لا، يمكنك بدء مباراة بالألعاب المتاحة مباشرة دون إنشاء حساب.'],
     ['هل لازم أحمّل تطبيقًا؟','لا، افتح لمنا من متصفح الجوال أو الكمبيوتر.'],
     ['هل أقدر ألعب على التلفزيون؟','يمكن عرض لوحة المباراة على شاشة تلفزيون باستخدام المتصفح أو مشاركة الشاشة من جهاز مناسب.'],
     ['كم مرة أستخدم وسائل المساعدة؟','يختار كل فريق ثلاث وسائل قبل اللعب، وتُستخدم كل وسيلة مختارة مرة واحدة أثناء المباراة.'],
     ['هل تحفظ المباراة إذا خرجت؟','قد يحتفظ المتصفح بالمباراة على الجهاز نفسه لتتمكن من متابعتها. حذف بيانات المتصفح قد يمسح المباراة المحفوظة.'],
     ['كيف أتواصل عند وجود مشكلة؟','استخدم رابط واتساب خدمة العملاء في أسفل الموقع وأرسل وصف المشكلة.']
    ].map(([question,answer])=><details key={question}><summary>{question}</summary><p>{answer}</p></details>)}
   </div>}
   {page==='contact'&&<div className="lm-information-sections lm-information-contact">
    <section><h2>خدمة العملاء</h2><p>عندك استفسار عن الألعاب أو مشكلة في فتح الموقع؟ تواصل معنا عبر واتساب وسنراجع رسالتك.</p>
      <a className="lm-contact-primary" href={whatsapp} target="_blank" rel="noopener noreferrer">تواصل عبر واتساب <ExternalLink size={18}/></a>
      <p>رقم التواصل: <a href="tel:+966531360039" dir="ltr">0531360039</a></p></section>
    <section><h2>حسابات لمنا الرسمية</h2><p>تيك توك: <a href="https://www.tiktok.com/@lamna011" target="_blank" rel="noopener noreferrer">@lamna011</a></p>
     <p>سناب شات: <a href="https://snapchat.com/t/wNeyrrEX" target="_blank" rel="noopener noreferrer">@lamna007</a></p>
     <p>إنستغرام: <a href="https://www.instagram.com/lamna007/" target="_blank" rel="noopener noreferrer">@lamna007</a></p></section>
   </div>}
  </section>
 </main>
}
