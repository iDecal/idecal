import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile,writeFile,access,readdir} from 'node:fs/promises';
import {parse} from 'parse5';
const input=process.argv[2];assert.ok(input,'Usage: node scripts/import-cutting-service.mjs <source.html>');
const html=await readFile(input,'utf8');const doc=parse(html);
const attr=(n,k)=>n.attrs?.find(a=>a.name===k)?.value;
const all=n=>[n,...(n.childNodes??[]).flatMap(all)];
const has=(n,c)=>(attr(n,'class')??'').split(/\s+/).includes(c);
const raw=n=>['script','style','noscript','svg'].includes(n.tagName)?'':n.nodeName==='#text'?n.value:(n.childNodes??[]).map(raw).join('');
const text=n=>raw(n).replace(/\s+/g,' ').trim();
const nodes=all(doc);const canonical=attr(nodes.find(n=>n.tagName==='link'&&attr(n,'rel')==='canonical'),'href');
assert.equal(canonical,'https://idecal.vn/dich-vu-cat-decal-theo-yeu-cau/');
const main=nodes.find(n=>has(n,'wp-block-post-content'));assert.ok(main);
const sections=main.childNodes.filter(n=>n.tagName&&!['script','style'].includes(n.tagName));assert.equal(sections.length,14);
const blog=new Set((await readdir('src/content/blog')).map(n=>n.replace(/\.md$/,'')));
const products=new Set(JSON.parse(await readFile('src/data/products.json','utf8')).map(p=>p.slug));
const linkMap=[];const quote='/lien-he-idecal?dich-vu=cat-decal#yeu-cau';
function link(value){
 if(!value)return quote;
 let result=value;
 if(value==='tel:0981851815')result='https://zalo.me/0866077040';
 else if(value.startsWith('https://idecal.vn/')){
  const url=new URL(value);const slug=url.pathname.replace(/^\/|\/$/g,'');
  if(slug==='dich-vu-cat-decal-theo-yeu-cau')result='/dich-vu/cat-decal/'+(url.hash?'#bang-gia':'');
  else if(slug==='in-decal-theo-yeu-cau')result='/dich-vu/in-decal/';
  else if(blog.has(slug))result='/blog/'+slug+url.hash;
  else if(products.has(slug))result='/san-pham/'+slug+url.hash;
  else if(slug==='gioi-thieu-idecal'||slug==='lien-he-idecal')result='/'+slug+'/';
 }
 if(!/^(https?:\/\/|\/|#|tel:|mailto:)/i.test(result))return '';
 if(result!==value&&!linkMap.some(x=>x.original===value))linkMap.push({original:value,resolved:result});return result;
}
const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const allowed=new Set(['p','strong','b','em','i','a','ul','ol','li','br','span']);
function clean(n){
 if(n.nodeName==='#text')return escape(n.value);
 if(['script','style','noscript','svg','iframe','form','input','button'].includes(n.tagName))return '';
 const children=(n.childNodes??[]).map(clean).join('');if(!allowed.has(n.tagName))return children;
 if(n.tagName==='br')return '<br>';
 const href=n.tagName==='a'?link(attr(n,'href')):null;if(n.tagName==='a'&&!href)return children;
 return '<'+n.tagName+(href?' href="'+escape(href)+'"':'')+'>'+children+'</'+n.tagName+'>';
}
function blocks(n){const out=[];function walk(node){if(node.tagName==='p'||has(node,'gspb_text')){if(text(node))out.push({text:text(node),html:node.tagName==='p'?clean(node):'<p>'+clean(node)+'</p>'});return;}for(const child of node.childNodes??[])walk(child);}walk(n);return out;}
function heading(n){return {title:(n.childNodes??[]).filter(x=>!has(x,'gspb_heading_subtitle')).map(raw).join('').replace(/\s+/g,' ').trim(),subtitle:all(n).filter(x=>has(x,'gspb_heading_subtitle')).map(text).join(' ')};}
function group(n){let p=n.parentNode;while(p&&!(all(p).filter(x=>x.tagName===n.tagName).length===1&&blocks(p).length))p=p.parentNode;assert.ok(p,'Missing heading group '+text(n));return p;}
function image(n){const original=attr(n,'src');const hero=original.includes('1761427-847');return {src:hero?'/images/cat-decal/cat-decal-theo-yeu-cau.webp':'/images/blog-wordpress/e17ed2e555ed62e01f60.jpg',url:(attr(n,'srcset')??'').split(',')[0].split(/\s+/)[0],alt:hero?'Minh họa máy cắt cùng các vật liệu Decal màu':'Máy cắt Decal vi tính thực hiện cắt theo file thiết kế',originalSrc:original,originalAlt:attr(n,'alt')??'',width:Number(attr(n,'width')),height:Number(attr(n,'height'))};}
const hero=all(sections[1]);const h1=text(hero.find(n=>n.tagName==='h1'));const subtitle=hero.filter(n=>has(n,'gspb_heading_subtitle')).map(text).join(' ');
const services=all(sections[3]).filter(n=>n.tagName==='h3').map(n=>{const parent=group(n);return {title:text(n),blocks:blocks(parent),labels:all(parent).filter(x=>has(x,'gspb_iconsList__item__text')).map(text),actions:all(parent).filter(x=>x.tagName==='a'&&text(x)&&!all(parent).some(p=>p.tagName==='p'&&all(p).includes(x))).map(x=>({label:text(x),href:link(attr(x,'href'))}))};});
const matNodes=all(sections[4]);const matHeadings=matNodes.filter(n=>n.tagName==='h2');
const materials=matNodes.filter(n=>n.tagName==='h3').map(n=>({title:text(n),blocks:blocks(group(n))}));
const priceNodes=all(sections[7]);const table=priceNodes.find(n=>n.tagName==='table');const rows=all(table).filter(n=>n.tagName==='tr').map(n=>(n.childNodes??[]).filter(c=>['td','th'].includes(c.tagName)).map(text));assert.equal(rows.length,6);assert.ok(rows.every(row=>row.length===3));
const priceBlocks=blocks(sections[7]);
const processNodes=all(sections[8]);const steps=processNodes.filter(n=>n.tagName==='h3').map(n=>({title:text(n),blocks:blocks(group(n))}));
const stepTexts=new Set(steps.flatMap(s=>s.blocks.map(b=>b.text)));const processNotes=blocks(sections[8]).filter(b=>!stepTexts.has(b.text));
const benefitNodes=all(sections[9]);const faqNodes=all(sections[12]);
const source={sourceTitle:text(nodes.find(n=>n.tagName==='title')),sourceFilename:input.split('/').pop(),sourceSha256:createHash('sha256').update(html).digest('hex'),sourceCanonical:canonical,canonical:'https://idecal.vn/dich-vu/cat-decal/',description:attr(nodes.find(n=>n.tagName==='meta'&&attr(n,'name')==='description'),'content'),hero:{title:h1+' '+subtitle,heading:h1,subtitle,blocks:blocks(sections[1]),image:image(hero.find(n=>n.tagName==='img')),actions:hero.filter(n=>n.tagName==='a'&&text(n)).map(n=>({label:text(n),href:link(attr(n,'href'))}))},services:{heading:heading(all(sections[2]).find(n=>n.tagName==='h2')),intro:blocks(sections[2]),items:services},materials:{intro:matNodes.filter(n=>has(n,'gspb_heading_subtitle')).map(n=>({text:text(n),html:'<p>'+clean(n)+'</p>'})),heading:heading(matHeadings[1]),consultHeading:heading(matHeadings[0]),consult:blocks(sections[4]).filter(b=>b.text.startsWith('Chưa biết')),items:materials},pricing:{heading:heading(priceNodes.find(n=>n.tagName==='h2')),intro:priceBlocks,headers:rows[0],rows:rows.slice(1),caption:text(priceNodes.find(n=>n.tagName==='figcaption')),note:priceNodes.filter(n=>has(n,'gspb_text')).map(text).filter(t=>!priceBlocks.some(b=>b.text===t))},process:{heading:heading(processNodes.find(n=>n.tagName==='h2')),steps,notes:processNotes,action:{label:'Đặt dịch vụ của bạn',href:quote}},benefits:{caption:text(benefitNodes.find(n=>n.tagName==='figcaption')),heading:heading(benefitNodes.find(n=>n.tagName==='h2')),intro:blocks(sections[9]),points:benefitNodes.filter(n=>has(n,'gspb_iconsList__item__text')).map(text),pointsHtml:benefitNodes.filter(n=>has(n,'gspb_iconsList__item__text')).map(clean),image:image(benefitNodes.find(n=>n.tagName==='img'))},faq:{heading:heading(all(sections[10]).find(n=>n.tagName==='h2')),items:faqNodes.filter(n=>has(n,'gs-accordion-item')).map(item=>({question:text(all(item).find(n=>has(n,'gs-accordion-item__heading'))),blocks:blocks(all(item).find(n=>has(n,'gs-accordion-item__text')))}))},linkMap};
assert.equal(source.services.items.length,4);assert.equal(source.materials.items.length,4);assert.equal(source.pricing.rows.length,5);assert.equal(source.process.steps.length,4);assert.equal(source.benefits.points.length,4);assert.equal(source.faq.items.length,4);
const sourceTextNodes=[];function collect(n){if(['script','style','noscript','svg'].includes(n.tagName))return;if(n.nodeName==='#text'&&n.value.trim())sourceTextNodes.push(n.value.trim());for(const child of n.childNodes??[])collect(child);}collect(main);
const images=[source.hero.image,source.benefits.image];for(const img of images)await access('public'+img.src);
await writeFile('src/data/cutting-original.json',JSON.stringify(source,null,2)+'\n');await writeFile('docs/cutting-source.json',JSON.stringify({sourceFilename:source.sourceFilename,sourceCanonical:canonical,sourceSha256:source.sourceSha256,sourceTextNodes,images},null,2)+'\n');
const seo=JSON.parse(await readFile('src/data/image-seo.json','utf8'));for(const img of images)if(!seo.some(i=>i.src===img.src))seo.push({src:img.src,alt:img.alt,title:img.alt+' | iDecal'});await writeFile('src/data/image-seo.json',JSON.stringify(seo,null,2)+'\n');
console.log(JSON.stringify({title:source.hero.title,services:4,materials:4,priceRows:5,steps:4,faqs:4,textNodes:sourceTextNodes.length,links:linkMap},null,2));
