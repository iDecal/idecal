import fs from 'node:fs';
import {parse} from 'parse5';
import crypto from 'node:crypto';
const file=process.argv[2];if(!file)throw Error('Pass the supplied HTML source path');
const source=fs.readFileSync(file,'utf8');const document=parse(source);
const attr=(n,k)=>n.attrs?.find(a=>a.name===k)?.value;
const has=(n,c)=>(attr(n,'class')??'').split(/\s+/).includes(c);
const text=n=>n.nodeName==='#text'?n.value:(n.childNodes??[]).map(text).join('');
const cleanText=n=>text(n).replace(/\s+/g,' ').trim();
const nodes=[];function walk(n){nodes.push(n);for(const c of n.childNodes??[])walk(c)}walk(document);
const entry=nodes.find(n=>has(n,'entry-content'));if(!entry)throw Error('Missing entry content');
const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const redirects=new Map(fs.readFileSync('public/_redirects','utf8').split('\n').filter(l=>l&&!l.startsWith('#')).map(l=>l.trim().split(/\s+/)).map(([a,b])=>[a,b]));
function href(value){if(value.includes('google.com/search?q=link-subpage-logo'))return '/dich-vu/cat-decal/';try{const u=new URL(value,'https://idecal.vn');if(!['https:','http:','tel:','mailto:'].includes(u.protocol))return '';if(u.hostname==='idecal.vn'||u.hostname==='www.idecal.vn'){let path=u.pathname;const aliases={'/in-decal-theo-yeu-cau/':'/dich-vu/in-decal/','/decal-dan-kinh-3d-van-song/':'/film-trang-tri-kinh/'};path=aliases[path]??path;for(let i=0;i<5;i++){const next=redirects.get(path)??redirects.get(path.replace(/\/$/,''));if(!next)break;path=next;}return path+u.search+u.hash;}return value;}catch{return '';}}
const tags=new Set(['p','ul','ol','li','strong','em','a','br','table','thead','tbody','tr','th','td','span']);
function html(n){if(n.nodeName==='#text')return escape(n.value);if(['script','style','svg','noscript'].includes(n.tagName))return '';const children=(n.childNodes??[]).map(html).join('');if(!tags.has(n.tagName))return children;if(n.tagName==='a'){const link=href(attr(n,'href')??'');return link?`<a href="${escape(link)}">${children}</a>`:children;}if(n.tagName==='br')return '<br>';return `<${n.tagName}>${children}</${n.tagName}>`;}
const tokens=[],images=[];function extract(n){if(['script','style','svg','noscript'].includes(n.tagName))return;
 if(has(n,'gs-accordion-item')){const all=[];const find=x=>{all.push(x);for(const c of x.childNodes??[])find(c)};find(n);const q=all.find(x=>has(x,'gs-accordion-item__heading'));const answer=all.find(x=>has(x,'gs-accordion-item__text'));tokens.push({type:'faq',question:cleanText(q),html:html(answer),text:cleanText(answer)});return;}
 if(n.tagName==='img'){const src=attr(n,'src');if(src&&!images.some(x=>x.source===src)){const i=images.length;const image={source:src,src:`/images/van-phong/office-glass-${String(i+1).padStart(2,'0')}.webp`,alt:attr(n,'alt')||'Decal dán kính văn phòng',width:Number(attr(n,'width'))||960,height:Number(attr(n,'height'))||720};images.push(image);tokens.push({type:'image',image});}return;}
 if(['h1','h2','h3','h4'].includes(n.tagName)){const subtitle=n.childNodes?.find(x=>has(x,'gspb_heading_subtitle'));tokens.push({type:n.tagName,text:cleanText(n),title:subtitle?(n.childNodes??[]).filter(x=>x!==subtitle).map(text).join('').trim():cleanText(n),subtitle:subtitle?html(subtitle):''});return;}
 if(['p','ul','ol','table'].includes(n.tagName)){if(cleanText(n))tokens.push({type:n.tagName,text:cleanText(n),html:html(n)});return;}
 if(n.nodeName==='#text' && cleanText(n) && !/^\d+$/.test(cleanText(n))) { const value=cleanText(n); if(!['Our Features','Content Creation','Learn More'].includes(value))tokens.push({type:'p',text:value,html:`<p>${escape(value)}</p>`}); return; }
 if(n.tagName==='a' && cleanText(n)) { tokens.push({type:'p',text:cleanText(n),html:`<p>${html(n)}</p>`});return; }
 for(const child of n.childNodes??[])extract(child);
}extract(entry);
const blocks=tokens.filter(x=>x.text&&!['Our Features','Content Creation','Learn More'].includes(x.text));
const data={sourceTitle:cleanText(nodes.find(n=>n.tagName==='title')),title:tokens.find(t=>t.type==='h1').text,description:tokens.find(t=>t.type==='p'&&t.text.startsWith('Decal dán kính văn phòng là')).text,sourceCanonical:attr(nodes.find(n=>attr(n,'rel')==='canonical'),'href'),sourceSha256:crypto.createHash('sha256').update(source).digest('hex'),tokens,images};
fs.writeFileSync('src/data/office-glass-original.json',JSON.stringify(data,null,2)+'\n');fs.writeFileSync('docs/office-glass-source.json',JSON.stringify({title:data.title,sourceSha256:data.sourceSha256,blocks:blocks.map(x=>x.text),images:images.map(x=>x.source)},null,2)+'\n');
console.log(`${blocks.length} editorial blocks, ${images.length} images, ${tokens.filter(t=>t.type==='faq').length} FAQs`);
