import React from 'react';
import { FaTiktok, FaSnapchat, FaInstagram, FaWhatsapp } from 'react-icons/fa6';
import { Phone } from 'lucide-react';
import './socialLinks.css';

const channels = [
  {key:'tiktok',name:'تيك توك',handle:'@lamna011',url:'https://www.tiktok.com/@lamna011'},
  {key:'snap',name:'سناب شات',handle:'@lamna007',url:'https://snapchat.com/t/wNeyrrEX'},
  {key:'instagram',name:'إنستغرام',handle:'@lamna007',url:'https://www.instagram.com/lamna007?vrfl=azRhdHQwamJ2MDR6&utm_source=qr'},
  {key:'whatsapp',name:'واتساب',handle:'0531360039',url:'https://wa.me/966531360039'}
];
function ChannelIcon({name}:{name:string}) {
 if(name==='instagram')return <FaInstagram size={24}/>;
 if(name==='snap')return <FaSnapchat size={24}/>;
 if(name==='tiktok')return <FaTiktok size={23}/>;
 return <FaWhatsapp size={24}/>;
}
export default function SocialLinks(){
 return <section className="lm-contact" dir="rtl" aria-label="حسابات لمنا الرسمية وطرق التواصل">
   <h2>حساباتنا الرسمية</h2>
   <p>تابع حسابات لمنا، أو تواصل معنا مباشرة.</p>
   <div className="lm-social-list">
    {channels.map(c=><a className={'lm-social lm-social-'+c.key}
      key={c.key} href={c.url} target="_blank" rel="noopener noreferrer"
      aria-label={c.name+' '+c.handle}>
      <span className="lm-social-icon"><ChannelIcon name={c.key}/></span>
      <span className="lm-social-text"><strong>{c.name}</strong><small dir="ltr">{c.handle}</small></span>
    </a>)}
   </div>
   <div className="lm-contact-phone"><Phone size={16}/><a href="tel:+966531360039" dir="ltr">0531360039</a><span>خدمة العملاء</span></div>
 </section>;
}
