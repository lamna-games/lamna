import React from 'react';
import { LAMNA_OFFICIAL_LOGO } from './brandLogo';
import './officialLogo.css';

/** The owner's approved image, displayed without changes or effects. */
export default function OfficialLogo({className = ''}:{className?:string}){
 return <img src={LAMNA_OFFICIAL_LOGO} className={'lamna-official-logo '+className}
  alt="شعار لمنا الرسمي" draggable={false}/>;
}
