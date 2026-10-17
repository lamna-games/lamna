import React from 'react';
import IllustratedCoversA from './IllustratedCoversA';
import IllustratedCoversB from './IllustratedCoversB';
import IllustratedCoversC from './IllustratedCoversC';

/* Original cover illustrations, one scene per actual game topic.
   Preserve the official logo overlay applied by CartoonCover.tsx. */
export default function ExpansionCoverArt({i}:{i:number}){
 if(i>=20&&i<=29)return <IllustratedCoversA i={i}/>;
 if(i>=30&&i<=39)return <IllustratedCoversB i={i}/>;
 if(i>=40&&i<=49)return <IllustratedCoversC i={i}/>;
 return null;
}
