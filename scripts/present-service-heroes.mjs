import {readFile,writeFile,mkdir} from 'node:fs/promises';
import sharp from 'sharp';
const photos=JSON.parse(await readFile('src/data/service-hero-photos.json','utf8'));
const get=(n,k)=>n.attrs?.find(a=>a.name===k)?.value;
const set=(n,k,v)=>{const a=n.attrs.find(a=>a.name===k);if(a)a.value=v;else n.attrs.push({name:k,value:v});};
const walk=n=>[n,...(n.childNodes??[]).flatMap(walk)];
const cache=new Map();
export async function presentServiceHeroes(nodes,pathname){
 const hero=nodes.find(n=>n.attrs?.some(a=>a.name==='data-service-hero'));if(!hero)return false;
 const media=walk(hero).find(n=>n.attrs?.some(a=>a.name==='data-hero-media'));if(!media)return false;
 set(hero,'data-editorial-hero','');
 const photo=photos[pathname.replace(/^\//,'').replace(/\/index.html$/,'').replace(/\/$/,'')];
 if(!photo)return true;
 const img=walk(media).find(n=>n.tagName==='img');if(!img)return true;
 let output=cache.get(photo.src);
 if(!output){const original=await sharp('public'+photo.src).metadata();const file='/images/hero-services/'+photo.src.split('/').at(-1).replace(/\.[^.]+$/,'')+'.webp';await mkdir('dist/images/hero-services',{recursive:true});const result=await sharp('public'+photo.src).resize({width:1800,withoutEnlargement:true}).webp({quality:88}).toBuffer({resolveWithObject:true});await writeFile('dist'+file,result.data);output={file,width:result.info.width,height:result.info.height,originalWidth:original.width};cache.set(photo.src,output);}
 // A picture source delivers the selected high-resolution visual; keep the archived img URL as fallback.
 const source={nodeName:'source',tagName:'source',namespaceURI:img.namespaceURI,attrs:[{name:'srcset',value:output.file},{name:'type',value:'image/webp'}],childNodes:[]};
 const parent=img.parentNode;
 if(parent.tagName==='picture'){source.parentNode=parent;parent.childNodes.unshift(source);}else{const picture={nodeName:'picture',tagName:'picture',namespaceURI:img.namespaceURI,attrs:[],childNodes:[source,img],parentNode:parent};parent.childNodes=parent.childNodes.map(n=>n===img?picture:n);img.parentNode=picture;source.parentNode=picture;}
 set(media,'style',(get(media,'style')??'')+';--hero-photo-position:'+photo.position);
 set(img,'data-hero-selected-alt',photo.alt);set(img,'data-hero-source-width',String(output.originalWidth));
 // The original alt/title remain with their fallback image; the picture has the selected image description.
 set(img.parentNode,'role','img');set(img.parentNode,'aria-label',photo.alt);set(img,'aria-hidden','true');
 return true;
}
