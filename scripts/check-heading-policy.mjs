import { readFile, readdir } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { parse } from 'parse5';

const root=resolve('dist');
const failures=[];
let pages=0,headings=0;
const cache=new Map();
async function files(dir){const out=[];for(const e of await readdir(dir,{withFileTypes:true})){const p=join(dir,e.name);if(e.isDirectory())out.push(...await files(p));else if(p.endsWith('.html'))out.push(p);}return out;}
function walk(node,fn,heading=false){const inHeading=heading||/^h[1-6]$/.test(node.tagName??'');fn(node,inHeading);for(const child of node.childNodes??[])walk(child,fn,inHeading);}
for(const file of await files(root)){
 if(file.startsWith(join(root,'admin')+'/'))continue; // CMS administration has its own application UI.
 const html=await readFile(file,'utf8');const doc=parse(html);const css=[];let count=0;
 walk(doc,(n,inHeading)=>{
  const attr=Object.fromEntries((n.attrs??[]).map(a=>[a.name,a.value]));
  if(/^h[1-6]$/.test(n.tagName??''))count++;
  if(n.tagName==='style')css.push((n.childNodes??[]).map(c=>c.value??'').join(''));
  if(n.tagName==='link'&&attr.rel==='stylesheet'&&attr.href?.startsWith('/'))css.push(attr.href);
  if(inHeading&&/(?:font(?:-size|-family)?|color|background(?:-image)?|-webkit-text-fill-color)\s*:[^;]*!important/i.test(attr.style??''))failures.push(`${file}: heading has an inline !important typography override`);
 });
 if(!count)continue;
 pages++;headings+=count;
 const sources=await Promise.all(css.map(async s=>{if(!s.startsWith('/'))return s;if(!cache.has(s))cache.set(s,readFile(join(root,s),'utf8'));return cache.get(s);}));
 const combined=sources.join('\n');
 for(const token of ['--heading-font','Google Sans Flex','--heading-h1','--heading-h6','heading-policy'])if(!combined.includes(token))failures.push(`${file}: missing shared ${token}`);
}
if(failures.length){console.error(failures.join('\n'));process.exitCode=1;}
else console.log(`Heading policy passed: ${pages} pages, ${headings} headings; shared responsive scale and no inline important typography overrides.`);
