import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile,writeFile,access} from 'node:fs/promises';
import {parse} from 'parse5';

const input=process.argv[2];
assert.ok(input,'Usage: node scripts/import-printing-service.mjs <source.html>');
const html=await readFile(input,'utf8');const doc=parse(html);
const attr=(n,k)=>n.attrs?.find(a=>a.name===k)?.value;
const all=n=>[n,...(n.childNodes??[]).flatMap(all)];
const has=(n,c)=>(attr(n,'class')??'').split(/\s+/).includes(c);
const raw=n=>['script','style','noscript','svg'].includes(n.tagName)?'':n.nodeName==='#text'?n.value:(n.childNodes??[]).map(raw).join('');
const text=n=>raw(n).replace(/\s+/g,' ').trim();
const nodes=all(doc);const canonical=attr(nodes.find(n=>n.tagName==='link'&&attr(n,'rel')==='canonical'),'href');
assert.equal(canonical,'https://idecal.vn/in-decal-theo-yeu-cau/','Unexpected source: inspect before importing');
const main=nodes.find(n=>has(n,'wp-block-post-content'));assert.ok(main);
const sections=main.childNodes.filter(n=>n.tagName&&!['script','style'].includes(n.tagName));
assert.equal(sections.length,15,'Source layout changed: inspect before importing');
const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const linkMap=[];
function link(value){
 if(!value)return '/lien-he-idecal?dich-vu=in-decal#yeu-cau';
 if(!/^(https?:\/\/|\/|#|tel:|mailto:)/i.test(value))return '';
 let out=value;
 if(value.startsWith('https://idecal.vn/')){
  const url=new URL(value);const slug=url.pathname.replace(/^\/|\/$/g,'');
  if(['lien-he-idecal','gioi-thieu-idecal','decal-dan-kinh-van-phong'].includes(slug))out='/'+slug+'/'+url.hash;
  else if(slug==='decal-trong-dan-kinh-quang-cao')out='/blog/decal-trong';
  else if(blogFiles.has(slug))out='/blog/'+slug+url.hash;
 }
 if(out!==value&&!linkMap.some(x=>x.original===value))linkMap.push({original:value,resolved:out});
 return out;
}
// Build a synchronous membership set; imported URLs never determine filesystem reads.
const {readdir}=await import('node:fs/promises');
const blogFiles=new Set((await readdir('src/content/blog')).map(f=>f.replace(/\.md$/,'')));
const allowed=new Set(['p','strong','b','em','i','a','ul','ol','li','br','span']);
function clean(n){
 if(n.nodeName==='#text')return escape(n.value);
 if(['script','style','noscript','svg','iframe','form','button','input'].includes(n.tagName))return '';
 const children=(n.childNodes??[]).map(clean).join('');if(!allowed.has(n.tagName))return children;
 if(n.tagName==='br')return '<br>';
 const href=n.tagName==='a'?link(attr(n,'href')):null;
 if(n.tagName==='a'&&!href)return children;
 return '<'+n.tagName+(href?' href="'+escape(href)+'"':'')+'>'+children+'</'+n.tagName+'>';
}
const paragraphs=n=>all(n).filter(x=>x.tagName==='p').map(x=>({text:text(x),html:clean(x)}));
function heading(n){const subtitle=(n.childNodes??[]).filter(x=>has(x,'gspb_heading_subtitle')).map(text).join(' ');return {title:(n.childNodes??[]).filter(x=>!has(x,'gspb_heading_subtitle')).map(raw).join('').replace(/\s+/g,' ').trim(),subtitle};}
const importedAssets=JSON.parse(await readFile('docs/wordpress-blog-import.json','utf8')).assets;
function image(n){
 const original=attr(n,'src');const basename=original.split('/').pop();
 const known={
  'Dich-vu-in-Decal.webp':{src:'/images/in-decal/dich-vu-in-decal.webp',url:'https://idecal.vn/wp-content/uploads/2025/10/Dich-vu-in-Decal.webp',alt:'In tem nhãn Decal trên máy in kỹ thuật số'},
  'in-decal-pp-25-2-e1750218700544.jpg':{src:'/images/in-decal/in-decal-pp.jpg',url:'https://idecal.vn/wp-content/uploads/2025/06/in-decal-pp-25-2-e1750218700544.jpg',alt:'Gia công bản in PP và Decal'}
 };
 const remote=(attr(n,'srcset')??'').split(',')[0]?.trim().split(/\s+/)[0];
 const source=known[basename]??{src:importedAssets[remote],url:remote,alt:attr(n,'alt')??''};
 assert.ok(source.src,'Missing image mapping: '+basename);
 return {...source,originalSrc:original,originalAlt:attr(n,'alt')??'',width:Number(attr(n,'width'))||800,height:Number(attr(n,'height'))||600};
}
const heroNodes=all(sections[0]);
const technologies=all(sections[1]).filter(n=>n.tagName==='h3').map(n=>({title:text(n),blocks:paragraphs(n.parentNode)}));
const benefitNodes=all(sections[4]);
const faqNodes=all(sections[10]);const faqItems=faqNodes.filter(n=>has(n,'gs-accordion-item'));
const faq={heading:heading(faqNodes.find(n=>n.tagName==='h2')),intro:paragraphs(sections[10]).filter(b=>!faqItems.some(item=>paragraphs(item).some(p=>p.text===b.text))),contact:{label:'Liên hệ chúng tôi',href:'/lien-he-idecal?dich-vu=in-decal#yeu-cau'},items:faqItems.map(item=>({question:text(all(item).find(n=>has(n,'gs-accordion-item__heading'))),blocks:paragraphs(all(item).find(n=>has(n,'gs-accordion-item__text')))}))};
const related=all(sections[14]).filter(n=>n.tagName==='li').map(item=>{const nodes=all(item);const h=nodes.find(n=>n.tagName==='h6');const anchor=all(h).find(n=>n.tagName==='a');return {title:text(h),href:link(attr(anchor,'href')),date:text(nodes.find(n=>n.tagName==='time')),image:image(nodes.find(n=>n.tagName==='img'))};});
const source={sourceTitle:text(nodes.find(n=>n.tagName==='title')),sourceFilename:input.split('/').pop(),sourceCanonical:canonical,canonical:'https://idecal.vn/dich-vu/in-decal/',sourceSha256:createHash('sha256').update(html).digest('hex'),description:attr(nodes.find(n=>n.tagName==='meta'&&attr(n,'name')==='description'),'content'),hero:{title:text(heroNodes.find(n=>n.tagName==='h1')),blocks:paragraphs(sections[0]),action:'In Decal ngay bây giờ',image:image(heroNodes.find(n=>n.tagName==='img'))},technologies,benefits:{heading:heading(benefitNodes.find(n=>n.tagName==='h2')),points:benefitNodes.filter(n=>has(n,'gspb_iconsList__item__text')).map(text),image:image(benefitNodes.find(n=>n.tagName==='img')),indicators:[{label:'Vật liệu Decal chất lượng',value:'80/100'},{label:'Mực in bền màu',value:'76/100'}],action:{label:'VỀ CHÚNG TÔI',href:'/gioi-thieu-idecal/'}},faq,relatedHeading:heading(sections[12]),related,linkMap};
assert.equal(source.technologies.length,2);assert.equal(source.benefits.points.length,5);assert.equal(source.faq.items.length,4);assert.equal(source.related.length,4);
const sourceTextNodes=[];function collect(n){if(['script','style','noscript','svg'].includes(n.tagName))return;if(n.nodeName==='#text'&&n.value.trim())sourceTextNodes.push(n.value.trim());for(const c of n.childNodes??[])collect(c);}collect(main);
const images=[source.hero.image,source.benefits.image,...source.related.map(x=>x.image)];
for(const i of images)await access('public'+i.src);
await writeFile('src/data/printing-original.json',JSON.stringify(source,null,2)+'\n');
await writeFile('docs/printing-source.json',JSON.stringify({sourceFilename:source.sourceFilename,sourceSha256:source.sourceSha256,sourceCanonical:canonical,sourceTextNodes,images},null,2)+'\n');
const seo=JSON.parse(await readFile('src/data/image-seo.json','utf8'));for(const image of images)if(!seo.some(x=>x.src===image.src))seo.push({src:image.src,alt:image.alt,title:image.alt+' | iDecal'});await writeFile('src/data/image-seo.json',JSON.stringify(seo,null,2)+'\n');
console.log(JSON.stringify({title:source.hero.title,technologies:2,benefits:5,faqs:4,images:images.length,textNodes:sourceTextNodes.length,links:linkMap.length},null,2));
