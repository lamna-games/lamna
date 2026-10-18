// Persistent match progress is client-edited for a live, self-scored party game.
// Strict validation prevents malformed or overlapping question state from
// corrupting saved matches. It is NOT a trusted competitive scoring system.
const aids=new Set(['phone','two','rest','pit','trap']);
const validNumber=(n,max)=>Number.isInteger(n)&&n>=0&&n<=max;
const validTeams=t=>Array.isArray(t)&&t.length===2&&t.every(x=>typeof x==='string'&&x.trim().length>0&&x.length<=25);
const validAids=a=>Array.isArray(a)&&a.length===2&&a.every(list=>Array.isArray(list)&&list.length<=3&&new Set(list).size===list.length&&list.every(item=>aids.has(item)));

export function validateMatchProgress(p) {
 if(!p||typeof p!=='object'||Array.isArray(p)||JSON.stringify(p).length>6500)return false;
 if(!validNumber(p.revision,1000000000)||p.revision===0)return false;
 if(!validTeams(p.teams)||!validAids(p.chosenAids)||!validAids(p.usedAids))return false;
 if(p.usedAids.some((list,i)=>list.some(a=>!p.chosenAids[i].includes(a))))return false;
 if(!Array.isArray(p.scores)||p.scores.length!==2||p.scores.some(s=>!validNumber(s,999999)))return false;
 if(!Array.isArray(p.used)||p.used.length>36||p.used.some(n=>!validNumber(n,35))||new Set(p.used).size!==p.used.length)return false;
 if(!Array.isArray(p.history)||p.history.length!==p.used.length||p.history.length>36)return false;
 for(let i=0;i<p.history.length;i++){
  const entry=p.history[i];
  if(!entry||entry.question!==p.used[i]||![null,0,1].includes(entry.team)||entry.points!==[200,400,600][Math.floor((entry.question%6)/2)])return false;
  if(entry.changes!==undefined&&(!Array.isArray(entry.changes)||entry.changes.length!==2||entry.changes.some(n=>!Number.isInteger(n)||Math.abs(n)>600)))return false;
 }
 if(p.active!==null&&p.active!==undefined&&(!validNumber(p.active,35)||p.used.includes(p.active)))return false;
 if(![0,1].includes(p.turn)||!['question','steal','var'].includes(p.phase))return false;
 if(!validNumber(p.seconds,180)||typeof p.paused!=='boolean')return false;
 if(p.varUsed!==undefined&&(!Array.isArray(p.varUsed)||p.varUsed.length!==2||p.varUsed.some(x=>typeof x!=='boolean')))return false;
 if(p.help!==undefined&&(!Array.isArray(p.help)||p.help.length!==2||p.help.some(x=>!validNumber(x,3))))return false;
 for(const key of ['reveal','pickWinner','showHint'])if(p[key]!==undefined&&typeof p[key]!=='boolean')return false;
 if(p.stealFrom!==undefined&&![0,1].includes(p.stealFrom))return false;
 if(p.aidEffect!==null&&p.aidEffect!==undefined&&!aids.has(p.aidEffect))return false;
 if(p.aidOwner!==null&&p.aidOwner!==undefined&&![0,1].includes(p.aidOwner))return false;
 if(p.twoAttemptsLeft!==undefined&&![1,2].includes(p.twoAttemptsLeft))return false;
 if(p.restingPlayer!==undefined&&(typeof p.restingPlayer!=='string'||p.restingPlayer.length>35))return false;
 return true;
}
