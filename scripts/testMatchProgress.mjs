import assert from 'node:assert/strict';
import {validateMatchProgress} from '../matchProgress.mjs';

const valid={revision:1,teams:['أصدقاء','عائلة'],chosenAids:[['phone','two','trap'],['rest','pit','two']],usedAids:[[],[]],
 scores:[200,0],used:[0],history:[{team:0,points:200,question:0,changes:[200,0]}],turn:1,
 active:6,phase:'question',seconds:49,paused:true,help:[2,2],varUsed:[false,false],
 reveal:false,pickWinner:false,showHint:false,stealFrom:0,aidEffect:null,aidOwner:null,twoAttemptsLeft:2,restingPlayer:''};
assert.equal(validateMatchProgress(valid),true,'Valid checkpoint rejected');
const bad=[
 {used:[0,0],history:[valid.history[0],valid.history[0]]},
 {active:0},{revision:0},{revision:-1},{seconds:-1},{scores:[-1,0]},
 {history:[]},{turn:2},{phase:'cheat'}, {usedAids:[['rest'],[]]},
 {history:[{team:0,points:600,question:0}]},{used:[36],history:[{team:0,points:200,question:36}]},
 {chosenAids:[['phone','phone'],[]]}, {active:36}
];
for(const mutation of bad) assert.equal(validateMatchProgress({...valid,...mutation}),false,JSON.stringify(mutation));
assert.equal(validateMatchProgress({...valid,used:[0,3],history:[valid.history[0],{team:1,points:400,question:3}]}),true,'Two completed answers');
const usedAll=Array.from({length:36},(_,i)=>i);
const complete={...valid,revision:250,active:null,used:usedAll,scores:[4200,3800],
 history:usedAll.map(i=>({team:i%2,points:[200,400,600][Math.floor((i%6)/2)],question:i})),
 paused:true,phase:'question',varUsed:[true,true],varTeam:1,phaseBeforeVar:'steal'};
assert.equal(validateMatchProgress(complete),true,'Final 36-question scoreboard should be persistable');
assert.equal(validateMatchProgress({...complete,history:complete.history.slice(1)}),false,'Missing final answer must be rejected');
assert.equal(validateMatchProgress({...valid,varTeam:3}),false,'Invalid VAR owner must be rejected');
assert.equal(validateMatchProgress({...valid,phaseBeforeVar:'var'}),false,'Invalid VAR resume phase must be rejected');
console.log('LAMNA progress QA OK: valid saves and '+bad.length+' malformed/overlap cases.');
