const BASE='https://lamna-wordless-sync.onrender.com';
export type QuizEntry={id:string;category:number;prompt:string;answer:string;hint:string;mode?:string;instructions?:string};
export type MatchProgress={teams:string[];chosenAids:string[][];scores:number[];used:number[];turn:number;usedAids:string[][];history:Array<{team:number|null;points:number;question:number;changes?:number[]}>;active?:number|null;phase?:'question'|'steal'|'var';seconds?:number;paused?:boolean;reveal?:boolean;pickWinner?:boolean;showHint?:boolean;stealFrom?:number;varUsed?:boolean[];help?:number[];aidEffect?:string|null;aidOwner?:number|null;twoAttemptsLeft?:number;restingPlayer?:string};
export type ServerMatch={id:string;kind:'free'|'paid';selected:number[];questions:QuizEntry[][];match_name:string;status:'active'|'completed';progress?:MatchProgress};
export type Wallet={freeRemaining:boolean;credits:number;matches:Array<{id:string;kind:'free'|'paid';selected:number[];match_name:string;status:'active'|'completed';created_at:string}>;user?:{id:string;firstName:string;isAdmin:boolean}};
export const token=()=>sessionStorage.getItem('lamna-session')||'';
export async function storeRequest<T>(path:string,method:'GET'|'POST'='GET',payload?:unknown):Promise<T>{
 const headers:Record<string,string>={'Accept':'application/json'};
 if(token())headers.Authorization='Bearer '+token();
 if(method==='POST')headers['Content-Type']='application/json';
 const response=await fetch(BASE+'/api/store/'+path,{method,headers,cache:'no-store',body:method==='POST'?JSON.stringify(payload||{}):undefined});
 const data=await response.json().catch(()=>({}));
 if(response.status===401){
  sessionStorage.removeItem('lamna-session');
  sessionStorage.removeItem('lamna-account-name');
  localStorage.removeItem('lamna-current-match-id');
 }
 if(!response.ok)throw Error(data.message||'تعذر الاتصال بخدمة لمنا.');
 return data as T;
}
