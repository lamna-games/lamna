import React from 'react';

/** Independent category scenes for the existing 20 Lamna games.
 * All geometry is original vector artwork; do not reuse competitor screenshots.
 * This is presentation only, the game rules and data stay untouched.
 */
const navy='#173b55';
const contour={stroke:navy,strokeWidth:5,strokeLinejoin:'round' as const,strokeLinecap:'round' as const};
const Card=({x,y,w,h,fill,children}:{x:number;y:number;w:number;h:number;fill:string;children?:React.ReactNode})=><g><rect x={x} y={y} width={w} height={h} rx="13" fill={fill} {...contour}/>{children}</g>;
export default function LamnaCoverArt({i}:{i:number}){
 switch(i){
 case 0: return <g>
   <path d="M45 278Q125 239 209 277Q283 227 374 276V344H45Z" fill="#89cea5" opacity=".8"/>
   <circle cx="210" cy="155" r="79" fill="#46bddd" {...contour}/>
   <path d="M181 94q-29 14-25 43l-17 20 21 21-4 32 32 3 19-27 33-3 25-28-19-14-3-24-30-7zM220 204l24 3 3 33-25 14-15-20z" fill="#78cb82"/>
   <ellipse cx="210" cy="155" rx="39" ry="79" fill="none" stroke="#daf6ff" strokeWidth="4"/>
   <path d="M131 154H288" stroke="#daf6ff" strokeWidth="4"/>
   <g transform="translate(49 183) rotate(-10)"><Card x={0} y={0} w={106} h={121} fill="#fff7e7"/><path d="M21 31h63M21 54h52M21 77h60" stroke="#9eacc2" strokeWidth="7" strokeLinecap="round"/><text x="54" y="115" fill="#f57851" fontSize="30" fontWeight="900" textAnchor="middle">؟</text></g>
   <g transform="translate(263 192)"><Card x={0} y={0} w={82} h={93} fill="#ffdb75"/><path d="M23 27h36M24 48h32" stroke="#f59c56" strokeWidth="9" strokeLinecap="round"/><circle cx="41" cy="77" r="6" fill="#138eac"/></g>
 </g>;
 case 1: return <g>
   <circle cx="198" cy="167" r="107" fill="#8bd8f0" opacity=".4"/>
   <path d="M103 320q18-90 95-91 84 0 101 91" fill="#ffa948" {...contour}/>
   <ellipse cx="200" cy="149" rx="76" ry="95" fill="#ffca9b" {...contour}/>
   <path d="M119 145q-1-95 85-95 81 0 72 95l-19-37q-76 21-109 5z" fill="#293443" {...contour}/>
   <path d="M169 159q8-8 17 0M223 159q8-8 17 0" fill="none" stroke="#263447" strokeWidth="7" strokeLinecap="round"/>
   <path d="M184 206q17 10 35 0" stroke="#c97258" strokeWidth="5" strokeLinecap="round" fill="none"/>
   <path d="M215 291q-12-15-12-27v-74q0-14 12-14 15 0 15 15v60q21-22 36-3 10 14-3 27l-39 47" fill="#ffca9b" {...contour}/>
   <path d="M198 200h31" stroke={navy} strokeWidth="7" strokeLinecap="round"/>
   <g transform="translate(37 89)"><circle r="31" cx="16" cy="18" fill="#ffda6a" stroke="#c68f45" strokeWidth="4"/><text x="16" y="29" textAnchor="middle" fontSize="30" fontWeight="bold" fill={navy}>؟</text></g>
   <path d="M302 100q35-25 60 7v30q-7 15-36 9l-11 19v-20q-21-9-13-45" fill="#fff" stroke="#1b7795" strokeWidth="5"/>
 </g>;
 case 3: return <g>
   <circle cx="200" cy="153" r="110" fill="#b1ddec" opacity=".7"/>
   <g transform="translate(75 73) rotate(-8 120 125)">
    <rect x="10" y="80" width="260" height="182" rx="20" fill="#33485b" stroke={navy} strokeWidth="7"/>
    <rect x="23" y="100" width="234" height="141" rx="8" fill="#e9f9ff"/>
    <path d="M48 224l52-59 38 29 58-73 41 103" fill="#5ec1a8"/>
    <circle cx="66" cy="134" r="20" fill="#ffcf68"/>
    <rect x="10" y="38" width="260" height="50" rx="6" fill="#263e55" stroke={navy} strokeWidth="5"/>
    <path d="M41 38l30 50m22-50 30 50m22-50 30 50m22-50 30 50" stroke="#fff" strokeWidth="15"/>
   </g>
   <circle cx="325" cy="125" r="47" fill="#26394c"/><circle cx="325" cy="125" r="34" fill="#d2e8f1"/><circle cx="325" cy="125" r="15" fill="#26394c"/>
   <path d="M309 105l19 19-19 19" fill="none" stroke="#26394c" strokeWidth="7"/>
 </g>;
 case 4: return <g>
   <path d="M0 265Q200 175 400 260V350H0Z" fill="#66ba82"/>
   <path d="M15 310H385M200 245v90M128 302a72 72 0 0 1 144 0" fill="none" stroke="white" strokeWidth="5" opacity=".85"/>
   <g transform="translate(200 175)"><circle r="103" fill="#fff" {...contour}/><path d="M-25-51L25-51 55-11 39 42-12 62-59 26-62-22Z" fill="#f4fafb" stroke={navy} strokeWidth="4"/><path d="M-25-51L5-10-12 62M25-51L5-10 39 42M-62-22L5-10 55-11" fill="none" stroke={navy} strokeWidth="6"/><path d="M-20-95L-27-55M78-68L54-12M-62 68L-12 62M75 72L39 42" stroke={navy} strokeWidth="6"/><path d="M5-10L31 12 20 39-16 39-29 10Z" fill="#20364c"/></g>
   <path d="M40 116l28-31m-3 46 32-15M324 93l28-24M340 136l32-10" stroke="#ffc646" strokeWidth="12" strokeLinecap="round"/>
 </g>;
 case 5: return <g>
   <circle cx="206" cy="159" r="111" fill="#b2e4f5" opacity=".58"/>
   <path d="M92 192v-26q0-120 111-120t111 120v27" fill="none" stroke={navy} strokeWidth="26" strokeLinecap="round"/>
   <path d="M93 168h28q23 0 23 24v54q0 25-23 25H91q-17 0-17-19v-64q0-20 19-20ZM288 168h28q17 0 17 20v64q0 19-17 19h-30q-22 0-22-25v-54q0-24 24-24Z" fill="#ff9059" {...contour}/>
   <g transform="translate(167 118)"><rect x="0" y="0" width="69" height="125" rx="33" fill="#fff4db" {...contour}/><rect x="11" y="16" width="47" height="76" rx="23" fill="#62c7d4" stroke={navy} strokeWidth="3"/><path d="M35 125v50m-39 0h78" stroke={navy} strokeWidth="10" strokeLinecap="round"/></g>
   <path d="M27 112l5-51 35 10m-35-10q-7 42 24 30M348 88l2-40 29-5m-29 5q-4 40 23 27" fill="none" stroke="#ffca49" strokeWidth="9" strokeLinecap="round"/>
 </g>;
 case 6: return <g>
   <path d="M30 292q68-41 126 0 68-42 129 0l75-26" fill="none" stroke="#52b6b6" strokeWidth="20" strokeLinecap="round"/>
   <g transform="translate(43 113) rotate(-8 150 110)"><path d="M0 27q78-19 148 0v169q-78-25-148 0z M148 27q77-19 154 0v169q-82-21-154 0z" fill="#fff4e3" {...contour}/><path d="M148 27v169" stroke={navy} strokeWidth="5"/><path d="M20 65h106M20 93h106M20 121h90M171 65h105M171 93h105M171 121h94" stroke="#c79a6d" strokeWidth="5" strokeLinecap="round"/></g>
   <g transform="translate(250 55) rotate(11)"><path d="M0 39q13-39 43 0q31-34 48 0v32q-6 32-46 44Q6 103 0 71Z" fill="#fff5b0" {...contour}/><text x="46" y="79" fontSize="40" textAnchor="middle" fontWeight="900" fill="#b5673e">!</text></g>
 </g>;
 case 7: return <g>
   <circle cx="201" cy="168" r="111" fill="#a8e0ef" opacity=".65"/>
   <path d="M103 317q11-85 97-85 86 0 99 85" fill="#ffbe67" {...contour}/>
   <ellipse cx="201" cy="152" rx="73" ry="84" fill="#ffcea5" {...contour}/>
   <path d="M128 139q-9-91 80-91 75 4 68 94-53-3-72-46-25 35-76 43Z" fill="#283e4e" {...contour}/>
   <path d="M165 169l14 0m44 0h14" fill="none" stroke={navy} strokeWidth="7" strokeLinecap="round"/>
   <path d="M179 202q20 16 44 0" fill="none" stroke="#ae684f" strokeWidth="4"/>
   <g transform="translate(21 151) rotate(-16)"><circle cx="45" cy="40" r="38" fill="#e8faff" stroke="#257d9d" strokeWidth="10"/><path d="M72 68l48 61" stroke="#257d9d" strokeWidth="17" strokeLinecap="round"/><text x="46" y="55" fontWeight="900" fontSize="50" fill="#227e99" textAnchor="middle">؟</text></g>
   <path d="M315 78q35-20 57 12v40h-44l-13 18v-18q-23-22 0-52" fill="#ffda75" stroke="#bc9a42" strokeWidth="5"/>
 </g>;
 case 10: return <g>
   <circle cx="201" cy="166" r="119" fill="#def3ee" opacity=".55"/>
   <path d="M40 303H354" stroke="#b58f62" strokeWidth="13" strokeLinecap="round"/>
   <path d="M70 260V115h52v145M66 129l28-40 32 40" fill="#e4bd76" {...contour}/>
   <path d="M81 165h28m-28 28h28m-28 29h28" stroke="#8e7559" strokeWidth="5"/>
   <path d="M152 272V140h121v132z" fill="#d5af74" {...contour}/>
   <path d="M147 144l65-70 68 70" fill="#ffdb94" {...contour}/>
   <path d="M201 272v-68q15-26 31 0v68" fill="#6fa1ab" {...contour}/>
   <path d="M168 170h24v25h-24m69-25h24v25h-24" fill="#fff4d9" stroke={navy} strokeWidth="4"/>
   <path d="M300 273v-91M297 200q-51-11-49-42q28-7 49 29M300 200q35-41 62-20q-4 29-62 28M299 189q-9-53 18-62q28 26-18 62" stroke="#228e71" strokeWidth="8" fill="#71c58a" strokeLinejoin="round" strokeLinecap="round"/>
 </g>;
 case 15: return <g>
   <g transform="translate(48 80)">
    <ellipse cx="158" cy="227" rx="159" ry="27" fill="#74c8b1" opacity=".5"/>
    <path d="M23 141q9-68 101-72 96 0 108 72Z" fill="#f6bd68" {...contour}/>
    <path d="M23 140q106-8 209 0" stroke="#ffe6a7" strokeWidth="10"/>
    <path d="M20 163h213q-13 30-35 31H59q-21 0-39-31Z" fill="#69c37d" {...contour}/>
    <path d="M36 198q83-21 184 0v20H36Z" fill="#e47758" {...contour}/>
    <path d="M38 218h180q0 30-29 30H68q-30 0-30-30Z" fill="#ffd37c" {...contour}/>
    <g fill="#fff3c0"><ellipse cx="80" cy="107" rx="9" ry="4"/><ellipse cx="128" cy="90" rx="9" ry="4"/><ellipse cx="169" cy="118" rx="9" ry="4"/></g>
   </g>
   <g transform="translate(274 90) rotate(9)"><path d="M0 45h87l-10 159H10Z" fill="#ff905c" {...contour}/><path d="M10 51h67" stroke="#fff" strokeWidth="10"/><path d="M26 65V18h40" fill="none" stroke="#277a98" strokeWidth="10" strokeLinecap="round"/><path d="M26 105h40M26 134h40" stroke="#ffe6b9" strokeWidth="11"/></g>
 </g>;
 case 17: return <g>
   <g transform="translate(62 91) rotate(-6 125 106)"><path d="M0 20q70-25 144 0v208q-70-24-144 0z M144 20q73-25 145 0v208q-73-24-145 0z" fill="#fffae9" {...contour}/><path d="M144 20v208M16 68h105M16 93h105M16 118h105M166 68h104M166 93h104M166 118h94" stroke="#b8cbd3" strokeWidth="5" strokeLinecap="round"/></g>
   <g transform="translate(270 64) rotate(27 33 110)"><rect x="15" y="0" width="37" height="186" rx="8" fill="#ffc85c" {...contour}/><path d="M15 160h37l-18 37Z" fill="#e5a77a" {...contour}/><path d="M27 179l7 18 8-18" fill="#344c5d"/></g>
   <path d="M73 60l22 19m23-32 2 26" stroke="#ffaf50" strokeWidth="8" strokeLinecap="round"/>
 </g>;
 default: return null;
 }
}