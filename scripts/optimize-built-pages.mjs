// Preserve source text/URLs and original image files; enhance delivery in built HTML.
import {readFile,writeFile,readdir,mkdir,stat} from 'node:fs/promises';
import {join,resolve,basename} from 'node:path';
import {createHash} from 'node:crypto';
import {parse,serialize} from 'parse5';
import sharp from 'sharp';
const root=resolve('dist');
const files=async dir=>(await Promise.all((await readdir(dir,{withFileTypes:true})).map(e=>e.isDirectory()?files(join(dir,e.name)):[join(dir,e.name)]))).flat();
const walk=n=>[n,...(n.childNodes??[]).flatMap(walk)];
const get=(n,k)=>n.attrs?.find(a=>a.name===k)?.value;
const set=(n,k,v)=>{const a=n.attrs.find(a=>a.name===k);if(a)a.value=String(v);else n.attrs.push({name:k,value:String(v)});};
const text=n=>n.nodeName==='#text'?n.value:(n.childNodes??[]).map(text).join('');
const cache=new Map();let dimensions=0,enhanced=0,breadcrumbs=0,saved=0;
await mkdir(join(root,'images/optimized'),{recursive:true});
async function imageInfo(src){
 if(cache.has(src))return cache.get(src);
 let result=null;
 try{
  const path=resolve(root,'.'+decodeURIComponent(new URL(src,'https://idecal.vn').pathname));
  if(!path.startsWith(root+'/'))return null;
  const metadata=await sharp(path).metadata();
  if(!metadata.width||!metadata.height||metadata.pages>1)return null;
  const rotated=[5,6,7,8].includes(metadata.orientation);
  result={width:rotated?metadata.height:metadata.width,height:rotated?metadata.width:metadata.height};
  const bytes=(await stat(path)).size;
  if(bytes>180000&&metadata.width>=320&&!src.endsWith('.svg')){
   const input=await readFile(path),hash=createHash('sha256').update(input).update('webp1600q78-v1').digest('hex').slice(0,12);
   const name=basename(path).replace(/\.[^.]+$/,'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/gi,'d').toLowerCase().replace(/[^a-z0-9]+/g,'-').slice(0,55).replace(/-$/,'');
   const output=await sharp(input).rotate().resize({width:1600,height:1600,fit:'inside',withoutEnlargement:true}).webp({quality:78,effort:4}).toBuffer({resolveWithObject:true});
   if(output.data.length<bytes*.85){
    result.variant='/images/optimized/'+name+'-'+hash+'.webp';result.variantWidth=output.info.width;
    await writeFile(root+result.variant,output.data);saved+=bytes-output.data.length;
   }
  }
 }catch(error){if(error.code!=='ENOENT')console.warn('Image delivery skipped:',src,error.message);}
 cache.set(src,result);return result;
}
for(const file of (await files(root)).filter(f=>f.endsWith('.html')&&!f.includes('/admin/'))){
 const doc=parse(await readFile(file,'utf8')),nodes=walk(doc);let changed=false;
 for(const img of nodes.filter(n=>n.tagName==='img')){
  const src=get(img,'src');if(!src?.startsWith('/')||src.startsWith('//'))continue;
  const info=await imageInfo(src);if(!info)continue;
  if(!get(img,'width')||!get(img,'height')){set(img,'width',info.width);set(img,'height',info.height);dimensions++;changed=true;}
  if(info.variant&&!get(img,'srcset')){set(img,'srcset',info.variant+' '+info.variantWidth+'w');set(img,'sizes','(max-width: 767px) calc(100vw - 48px), (max-width: 1279px) 75vw, 1200px');enhanced++;changed=true;}
 }
 // Schema follows the visible breadcrumb; do not invent a path hierarchy.
 const canonical=nodes.find(n=>n.tagName==='link'&&get(n,'rel')==='canonical');
 const schema=nodes.filter(n=>n.tagName==='script'&&get(n,'type')==='application/ld+json');
 const data=schema.map(n=>({node:n,json:JSON.parse(text(n))}));
 const existing=data.some(d=>(d.json['@graph']??[d.json]).some(s=>s['@type']==='BreadcrumbList'));
 const nav=nodes.find(n=>n.tagName==='nav'&&/breadcrumb|đường dẫn/i.test((get(n,'class')??'')+' '+(get(n,'aria-label')??'')));
 if(!existing&&nav&&canonical){
  const url=get(canonical,'href'),list=[];
  for(const a of walk(nav).filter(n=>n.tagName==='a')){try{const item=new URL(get(a,'href'),url);if(item.origin!==new URL(url).origin)continue;const name=text(a).trim();if(name)list.push({name,item:item.href});}catch{}}
  const current=walk(nav).filter(n=>get(n,'aria-current')==='page').at(-1);
  const last=current?text(current).trim():text((nav.childNodes??[]).filter(n=>n.tagName==='span').at(-1)??{}).trim();
  if(list.length&&last&&!/^[\/›>»|]+$/.test(last)&&last.length<150){
   if(list.at(-1).item.replace(/\/$/,'')!==url.replace(/\/$/,''))list.push({name:last,item:url});
   const graph=data.find(d=>Array.isArray(d.json['@graph']));
   if(graph&&list.length>=2){graph.json['@graph'].push({'@type':'BreadcrumbList',itemListElement:list.map((x,i)=>({'@type':'ListItem',position:i+1,...x}))});graph.node.childNodes[0].value=JSON.stringify(graph.json).replaceAll('<','\\u003c');breadcrumbs++;changed=true;}
  }
 }
 if(changed)await writeFile(file,serialize(doc));
}
console.log(`Delivery optimized: ${enhanced} responsive image instances, ${dimensions} reserved image dimensions, ${breadcrumbs} visible breadcrumb schemas; ${Math.round(saved/1024)} KiB saved across unique image variants.`);
