// Photos assigned to questions must be curated and hosted in the project's
// existing media account. This rejects arbitrary trackers, inline data URLs,
// unencrypted links and other remote image origins.
export function validQuestionImageUrl(value){
 if(value==='')return true; // A topic illustration is the safe default.
 if(typeof value!=='string'||value.length>450)return false;
 try{
  const url=new URL(value);
  return url.protocol==='https:'&&url.host==='res.cloudinary.com'&&
   url.pathname.startsWith('/l1ixwj8b/image/upload/')&&
   /^\/l1ixwj8b\/image\/upload\/[a-zA-Z0-9_.,/%-]+\.(?:jpe?g|png|webp|avif)$/i.test(url.pathname)&&
   !url.search&&!url.hash&&!url.username&&!url.password;
 }catch{return false;}
}
