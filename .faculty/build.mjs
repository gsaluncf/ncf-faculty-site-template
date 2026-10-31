import {readFileSync,writeFileSync,mkdirSync,lstatSync,rmSync} from 'node:fs';
import {resolve,dirname,join,relative} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {validateSiteManifest} from './manifest.mjs';

// This checks app syntax and packages source. It never imports or runs app code.
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const maxManifest=64*1024,maxFile=100*1024,maxTotal=500*1024;
function readSource(path,maximum){
 const absolute=resolve(root,path);
 if(relative(root,absolute).startsWith('..'))throw Error('Source must remain inside the repository.');
 let part=root;
 for(const segment of path.split('/')){part=join(part,segment);if(lstatSync(part).isSymbolicLink())throw Error('Sources must not use symbolic links.');}
 const stat=lstatSync(absolute);
 if(!stat.isFile()||stat.size>maximum)throw Error(path+' must be a regular file within the size limit.');
 const bytes=readFileSync(absolute);
 return {text:new TextDecoder('utf-8',{fatal:true}).decode(bytes),size:bytes.length};
}
const manifest=readSource('faculty-site.json',maxManifest);
const site=validateSiteManifest(JSON.parse(manifest.text));
let total=manifest.size;
const sources=[];
for(const entry of [...site.pages,...(site.workers||[])]){
 const source=readSource(entry.source,maxFile);total+=source.size;
 if(total>maxTotal)throw Error('The site exceeds the 500 KiB publishing size limit.');
 if(entry.source.startsWith('workers/')){
  const check=spawnSync(process.execPath,['--input-type=module','--check'],{input:source.text,encoding:'utf8'});
  if(check.status!==0)throw Error(entry.source+' contains invalid JavaScript.\n'+check.stderr);
 }
 sources.push([entry.source,source.text]);
}
const dist=join(root,'dist');
rmSync(dist,{recursive:true,force:true});mkdirSync(dist,{recursive:true});
writeFileSync(join(dist,'faculty-site.json'),JSON.stringify(site,null,2)+'\n');
for(const [path,content] of sources){const output=join(dist,path);mkdirSync(dirname(output),{recursive:true});writeFileSync(output,content);}
console.log('Built '+site.pages.length+' pages and '+(site.workers||[]).length+' apps ('+total+' UTF-8 bytes).');
