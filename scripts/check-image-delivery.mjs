import assert from 'node:assert/strict';
import {readFile,readdir,stat} from 'node:fs/promises';
import {join,resolve} from 'node:path';
import {createHash} from 'node:crypto';
import {parse} from 'parse5';
import sharp from 'sharp';
const root=resolve('dist'),originals=new Set(),variants=new Map();let instances=0;
const files=async d=>(await Promise.all((await readdir(d,{withFileTypes:true})).map(e=>e.isDirectory()?files(join(d,e.name)):[join(d,e.name)]))).flat();
const walk=n=>[n,...(n.childNodes??[]).flatMap(walk)],get=(n,k)=>n.attrs?.find(a=>a.name===k)?.value;
for(const file of (await files(root)).filter(f=>f.endsWith('.html'))){
 for(const img of walk(parse(await readFile(file,'utf8'))).filter(n=>n.tagName==='img')){
  const srcset=get(img,'srcset');if(!srcset?.startsWith('/images/optimized/'))continue;
  const match=srcset.match(/^(\/images\/optimized\/[^\s]+) (\d+)w$/);assert.ok(match,`Invalid optimized image candidate: ${file}`);
  assert.ok(Number(get(img,'width'))>0&&Number(get(img,'height'))>0,`Missing reserved image dimensions: ${file}`);
  const src=get(img,'src');assert.ok(src?.startsWith('/'),'Original src must be retained');
  const original=decodeURIComponent(new URL(src,'https://idecal.vn').pathname);
  if(!originals.has(original)){
   const [before,after]=await Promise.all([readFile('public'+original),readFile(root+original)]);
   const hash=b=>createHash('sha256').update(b).digest('hex');assert.equal(hash(after),hash(before),'Original image bytes changed: '+original);originals.add(original);
  }
  if(!variants.has(match[1])){
   const p=root+match[1],meta=await sharp(p).metadata();assert.equal(meta.format,'webp');assert.equal(meta.width,Number(match[2]));
   assert.ok((await stat(p)).size<(await stat(root+original)).size*.85,'Optimized image must save at least 15%');variants.set(match[1],meta);
  }
  instances++;
 }
}
assert.ok(variants.size>0,'Image delivery pipeline must produce optimized candidates');
const home=await readFile('dist/index.html','utf8');const hero=walk(parse(home)).find(n=>n.tagName==='img'&&(get(n,'class')??'').includes('gsbp-6d50174'));
assert.equal(get(hero,'loading'),'eager');assert.equal(get(hero,'fetchpriority'),'high');assert.ok(get(hero,'src')?.startsWith('/'),'Hero must use its internal image');
console.log(`Image delivery passed: ${instances} responsive instances, ${variants.size} valid WebP candidates, ${originals.size} untouched originals, reserved dimensions and eager/high-priority local hero.`);
