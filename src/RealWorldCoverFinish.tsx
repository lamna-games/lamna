import React from 'react';
const stroke='#183c55';
const contour={stroke,strokeWidth:6,strokeLinejoin:'round' as const,strokeLinecap:'round' as const};
function Txt({x,y,children,size=24,color=stroke}:{x:number;y:number;children:React.ReactNode;size?:number;color?:string}){
 return <text x={x} y={y} textAnchor="middle" dominantBaseline="middle" fill={color} fontSize={size} fontFamily="Tajawal,Arial,sans-serif" fontWeight="900">{children}</text>;
}
export default function RealWorldCoverFinish({i}:{i:number}){
 switch(i){
 case 23:return <g>
   <g transform="translate(33 55)"><rect width="333" height="244" rx="30" fill="#454e61" {...contour}/>
    <rect x="15" y="19" width="302" height="201" rx="18" fill="#ead3b2" stroke="#fff4e0" strokeWidth="4"/>
    <path d="M19 216h300" stroke="#cb8f78" strokeWidth="11"/>
    <path d="M24 134h290" stroke="#eebc84" strokeWidth="22"/>
    <g transform="translate(27 45)"><path d="M9 173Q13 96 75 100Q145 91 148 173Z" fill="#fbf8ed" {...contour}/>
      <circle cx="82" cy="51" r="56" fill="#df9f7e" {...contour}/><path d="M18 53Q12-30 81-17Q145-30 142 55L125 21Q82 0 35 27Z" fill="#f8f6eb" {...contour}/>
      <path d="M24 42q50-25 113 1" fill="none" stroke={stroke} strokeWidth="10"/><path d="M53 64h13M94 64h13M74 91q15 11 29 0" stroke={stroke} strokeWidth="6" fill="none"/>
    </g><g transform="translate(163 51)"><path d="M9 173Q13 98 78 100Q146 96 152 173Z" fill="#b8819a" {...contour}/>
      <circle cx="82" cy="55" r="53" fill="#e6b18e" {...contour}/><path d="M31 67Q-3 7 63-19Q162-47 135 90L115 27Q59 0 31 67Z" fill="#493b42" {...contour}/>
      <path d="M55 69h12M99 69h12M74 96q17 11 27 0" fill="none" stroke={stroke} strokeWidth="5"/>
    </g></g><Txt x={192} y={73} size={20} color="#fff9e4">الدراما الخليجية</Txt>
  </g>;
 case 24:return <g>
   <g transform="translate(27 86)"><ellipse cx="123" cy="173" rx="96" ry="89" fill="#9aa3ac" {...contour}/>
    <ellipse cx="125" cy="83" rx="84" ry="94" fill="#8e99a5" {...contour}/>
    <path d="M64 28L47-21Q100-22 103 15M146 15Q172-20 210-26L187 44" fill="#8996a3" {...contour}/>
    <ellipse cx="90" cy="84" rx="27" ry="38" fill="#fff"/><ellipse cx="145" cy="84" rx="27" ry="38" fill="#fff"/>
    <circle cx="101" cy="97" r="11" fill={stroke}/><circle cx="151" cy="99" r="11" fill={stroke}/>
    <path d="M111 135l15 13 17-13-16-10Z" fill="#e88a7b" {...contour}/><path d="M126 149v22M106 169q19 20 40 0" fill="none" strokeWidth="5" stroke={stroke}/>
    <path d="M69 155L0 143M72 175L2 182M165 155l71-13M162 175l75 13" stroke={stroke} strokeWidth="4"/>
   </g>
   <g transform="translate(262 174)"><ellipse cx="57" cy="94" rx="60" ry="87" fill="#b98958" {...contour}/>
    <ellipse cx="59" cy="40" rx="53" ry="51" fill="#c89a68" {...contour}/>
    <circle cx="24" cy="11" r="21" fill="#d8a878" {...contour}/><circle cx="93" cy="11" r="21" fill="#d8a878" {...contour}/>
    <ellipse cx="42" cy="44" rx="18" ry="25" fill="#fff"/><ellipse cx="77" cy="44" rx="18" ry="25" fill="#fff"/>
    <circle cx="45" cy="49" r="6" fill={stroke}/><circle cx="77" cy="49" r="6" fill={stroke}/>
    <path d="M52 73q12 18 27 0" fill="none" strokeWidth="5" stroke={stroke}/>
   </g>
 </g>;
 case 37:return <g>
   <g transform="translate(31 49)"><path d="M20 200Q170 170 324 200V279H20Z" fill="#d5b685" {...contour}/>
    <g transform="translate(13 13)"><path d="M0 223Q0 134 89 134Q172 135 177 223Z" fill="#f5ebda" {...contour}/>
      <circle cx="87" cy="89" r="64" fill="#d69b78" {...contour}/>
      <path d="M25 90Q5 15 90 0Q164 6 150 90L127 47Q91 17 50 47Z" fill="#f7f4ed" {...contour}/>
      <path d="M23 70q66-27 130 0" stroke={stroke} strokeWidth="11" fill="none"/>
    </g><g transform="translate(175 20)"><path d="M0 221Q0 137 76 137Q156 136 159 221Z" fill="#8caeaa" {...contour}/>
      <circle cx="81" cy="84" r="61" fill="#d9a27a" {...contour}/><path d="M22 74Q12 4 74 1Q145-8 142 80Q120 38 81 38Q49 34 22 74Z" fill="#57403d" {...contour}/>
    </g><g transform="translate(192 212)"><path d="M7 0h70l-7 50H16Z" fill="#f9e5c8" {...contour}/><path d="M77 9q31-8 24 17l-30 14" stroke={stroke} strokeWidth="7" fill="none"/></g>
   </g><g transform="translate(50 27)"><rect width="155" height="59" rx="26" fill="#fff2d5" {...contour}/><Txt x={79} y={29} size={26}>وش علومك؟</Txt></g>
 </g>;
 case 38:return <g><g transform="translate(60 57)">
   <path d="M17 57Q28 16 98 16Q171 8 184 58L218 223H0Z" fill="#fff2d9" {...contour}/>
   <path d="M0 223H217" stroke="#b4896e" strokeWidth="13"/>
   <path d="M59 59L39 186M110 27v158M156 56l23 127" stroke="#ddc5aa" strokeWidth="6"/>
   <path d="M50 185q23-100 60-96q45 7 66 96" fill="#9fb2b3" stroke="#8aaba7" strokeWidth="4" strokeDasharray="12 9"/>
   <circle cx="112" cy="143" r="35" fill="#587783"/><path d="M99 142h28M113 130v27" stroke="#fff" strokeWidth="7"/>
   </g><g transform="translate(237 90)"><circle cx="62" cy="67" r="64" fill="#f9d477" {...contour}/><Txt x={62} y={65} size={67}>؟</Txt></g></g>;
 case 43:return <g>
   <path d="M15 320H384" stroke={stroke} strokeWidth="9"/>
   <g transform="translate(21 81)" strokeLinejoin="round">
    <path d="M0 235V126L42 113Q89 16 170 113L213 126v109Z" fill="#f3e4c8" {...contour}/>
    <path d="M37 124Q106-41 178 124Z" fill="#2c895e" {...contour}/>
    <path d="M103 37V7" stroke="#cbaa5f" strokeWidth="8"/><circle cx="103" cy="2" r="9" fill="#d8b568"/>
    <path d="M48 131h126M48 165h126" stroke="#cda57a" strokeWidth="7"/>
    {Array.from({length:4},(_,j)=><path key={j} d={'M'+(22+j*49)+' 213v-36q17-19 33 0v36'} fill="#adbea6" stroke={stroke} strokeWidth="4"/>)}
   </g>
   <g transform="translate(265 31)" strokeLinejoin="round"><path d="M32 286V43l23-23 25 23v243Z" fill="#e9d2a1" {...contour}/><path d="M20 98h73M19 144h74M20 220h72" stroke="#b69b75" strokeWidth="9"/><path d="M19 288h75" stroke={stroke} strokeWidth="6"/><path d="M34 44L54 9l23 35" fill="#f6e8bd" {...contour}/></g>
   <g transform="translate(154 238) rotate(-8 93 51)"><path d="M0 15Q48-2 92 21Q145 1 189 15V99Q144 85 92 107Q46 87 0 100Z" fill="#fff3d2" {...contour}/><path d="M92 22v85" stroke={stroke} strokeWidth="4"/></g>
 </g>;
 default:return null;
 }
}
