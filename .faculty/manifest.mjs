const failure=(status,message)=>Object.assign(new Error(message),{status,safe:true,publicMessage:message});
const object=value=>value!==null&&typeof value==='object'&&!Array.isArray(value)&&[Object.prototype,null].includes(Object.getPrototypeOf(value));
const keys=(value,allowed)=>object(value)&&Object.keys(value).every(key=>allowed.includes(key));
const emailPattern=/^[^\s@<>"'`,;:]+@[^\s@<>"'`,;:]+\.[^\s@<>"'`,;:]+$/;
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export function validateSiteManifest(raw){
 if(!keys(raw,['version','pages','workers'])||raw.version!==1||!Array.isArray(raw.pages)||raw.pages.length<1||raw.pages.length>30)throw failure(400,'Use a version 1 site manifest with between 1 and 30 pages.');
 const paths=new Set();
 const pages=raw.pages.map(page=>{
  if(!keys(page,['path','source','title','access']))throw failure(400,'Each page may contain only path, source, title, and access.');
  if(typeof page.path!=='string'||page.path.length>200||!(page.path==='/'||/^\/(?:[a-z0-9][a-z0-9-]*\/)+$/.test(page.path)))throw failure(400,'Page paths must be / or lowercase paths such as /courses/ with a trailing slash.');
  if(paths.has(page.path))throw failure(400,'The manifest contains a duplicate page path.');
  paths.add(page.path);
  if(typeof page.source!=='string'||page.source.length>240||!/^pages\/(?:[a-z0-9][a-z0-9_-]*\/)*[a-z0-9][a-z0-9_-]*\.md$/.test(page.source))throw failure(400,'Page sources must be Markdown files inside pages/ using lowercase letters, digits, hyphens, or underscores.');
  if(typeof page.title!=='string'||!page.title.trim()||page.title.trim().length>150||/[\u0000-\u001f\u007f]/.test(page.title))throw failure(400,'Each page needs a title of between 1 and 150 characters.');
  if(!keys(page.access,['mode','allowedEmails'])||!['public','ncf','emails'].includes(page.access.mode))throw failure(400,'Page access must be public, ncf, or emails.');
  const allowed=page.access.allowedEmails??[];
  if(!Array.isArray(allowed)||allowed.length>100||allowed.some(email=>typeof email!=='string'||email.trim().length>254||!emailPattern.test(email.trim())))throw failure(400,'Enter up to 100 valid allowed email addresses.');
  const allowedEmails=[...new Set(allowed.map(email=>email.trim().toLowerCase()))];
  if(page.access.mode==='emails'&&!allowedEmails.length)throw failure(400,'The emails access mode requires at least one allowed email address.');
  if(page.access.mode!=='emails'&&allowedEmails.length)throw failure(400,'Allowed email addresses may only be set for the emails access mode.');
  return {path:page.path,source:page.source,title:page.title.trim(),access:{mode:page.access.mode,allowedEmails}};
 });
 if(!paths.has('/'))throw failure(400,'The manifest must include the root page at /.');
 if(pages.find(page=>page.path==='/').access.mode!=='public')throw failure(400,'The faculty home page must always be public. Set access restrictions on subpages.');
 if(raw.workers===undefined)return {version:1,pages};
 if(!Array.isArray(raw.workers)||raw.workers.length>5)throw failure(400,'Configure at most five Worker apps.');
 const names=new Set();
 const workers=raw.workers.map(worker=>{
  if(!keys(worker,['name','source','title','access','network'])||typeof worker.name!=='string'||!/^[a-z][a-z0-9-]{0,39}$/.test(worker.name)||names.has(worker.name))throw failure(400,'Each Worker needs a unique name with 1â€“40 lowercase letters, digits or hyphens.');
  names.add(worker.name);
  if(typeof worker.source!=='string'||!/^workers\/[a-z][a-z0-9_-]{0,79}\.js$/.test(worker.source))throw failure(400,'Worker sources must be JavaScript files inside workers/.');
  if(!['none','public'].includes(worker.network||'none'))throw failure(400,'Worker network access must be none or public.');
  const normalized=validateSiteManifest({version:1,pages:[{path:'/',source:'pages/index.md',title:'Home',access:{mode:'public',allowedEmails:[]}},{path:'/app/',source:'pages/app.md',title:worker.title,access:worker.access}]}).pages[1];
  if(pages.some(p=>p.path.startsWith('/apps/'+worker.name+'/')))throw failure(400,'A page and a Worker cannot use the same app path.');
  return {name:worker.name,source:worker.source,title:normalized.title,access:normalized.access,network:worker.network||'none'};
 });
 return {version:1,pages,workers};
}

