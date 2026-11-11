import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile,writeFile} from 'node:fs/promises';
import {parse} from 'parse5';
const input=process.argv[2];
assert.ok(input,'Usage: node scripts/import-interior-film.mjs <source.html>');
const html=await readFile(input,'utf8');
const document=parse(html);
const attr=(node,key)=>node.attrs?.find(item=>item.name===key)?.value;
const hasClass=(node,name)=>(attr(node,'class')??'').split(/\s+/).includes(name);
const all=node=>[node,...(node.childNodes??[]).flatMap(all)];
const rawText=node=>['script','style','noscript','svg'].includes(node.tagName)?'':node.nodeName==='#text'?node.value:(node.childNodes??[]).map(rawText).join('');
const text=node=>rawText(node).replace(/\s+/g,' ').trim();
const nodes=all(document);
const canonical=attr(nodes.find(node=>node.tagName==='link'&&attr(node,'rel')==='canonical'),'href');
assert.equal(canonical,'https://idecal.vn/dich-vu-film-dan-noi-that/','The uploaded file must be the interior film service page');
const main=nodes.find(node=>hasClass(node,'wp-block-post-content'));
assert.ok(main);
const sections=main.childNodes.filter(node=>node.tagName&&text(node));
assert.equal(sections.length,7,'Inspect changed source sections before importing');
const heading=node=>{
 const own=all(node).filter(child=>hasClass(child,'gspb_heading_subtitle'));
 const subtitles=own.length?own:(node.parentNode.childNodes??[]).filter(child=>hasClass(child,'gspb_heading_subtitle'));
 return {id:attr(node,'id')??'',title:(node.childNodes??[]).filter(child=>!hasClass(child,'gspb_heading_subtitle')).map(rawText).join('').replace(/\s+/g,' ').trim(),subtitle:subtitles.map(text).join(' ')};
};
const productSlugs=JSON.parse(await readFile('src/data/products.json','utf8')).map(product=>product.slug);
const blogNames=await import('node:fs/promises').then(fs=>fs.readdir('src/content/blog'));
const linkMap=[];
const href=value=>{
  if(!value)return '';
  let output=value;
  if(value==='https://filmnoithat/infeel')output='/thuong-hieu/infeel';
  else if(value.startsWith('https://idecal.vn/')){
    const url=new URL(value);const slug=url.pathname.replace(/^\/|\/$/g,'');
    if(productSlugs.includes(slug))output='/san-pham/'+slug+url.hash;
    else if(blogNames.includes(slug+'.md'))output='/blog/'+slug+url.hash;
    else if(slug==='dich-vu-film-dan-noi-that')output='/dich-vu-film-dan-noi-that/'+url.hash;
    else output=value;
  }
  if(output!==value&&!linkMap.some(item=>item.original===value))linkMap.push({original:value,resolved:output});
  return output;
};
const escape=value=>value.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const allowed=new Set(['p','strong','b','em','i','ul','ol','li','a','br','span']);
const clean=node=>{
  if(node.nodeName==='#text')return escape(node.value);
  if(['script','style','noscript','svg','form','iframe','input','button'].includes(node.tagName))return '';
  const children=(node.childNodes??[]).map(clean).join('');
  if(!allowed.has(node.tagName))return children;
  if(node.tagName==='br')return '<br>';
  let attributes='';
  if(node.tagName==='a'){
    const url=href(attr(node,'href'));
    if(!/^(?:https?:\/\/|tel:|mailto:|\/|#)/i.test(url))return children;
    attributes=' href="'+escape(url)+'"';
    if(/^https?:/.test(url))attributes+=' target="_blank" rel="noopener noreferrer"';
  }
  return '<'+node.tagName+attributes+'>'+children+'</'+node.tagName+'>';
};
const blocks=node=>{
 const output=[];
 const walk=item=>{
  if(['p','ul','ol'].includes(item.tagName)){output.push({text:text(item),html:clean(item)});return;}
  if(['script','style','noscript','svg'].includes(item.tagName))return;
  for(const child of item.childNodes??[])walk(child);
 };
 walk(node);return output;
};
const image=node=>{
 let link=node.parentNode;while(link&&link.tagName!=='a')link=link.parentNode;
 return {src:attr(node,'src'),alt:attr(node,'alt')??'',title:attr(node,'title')??attr(node,'alt')??'',width:Number(attr(node,'width'))||900,height:Number(attr(node,'height'))||675,href:link?href(attr(link,'href')):null};
};
const images=all(main).filter(node=>node.tagName==='img').map(image);
const heroNodes=all(sections[0]);
const hero={heading:heading(heroNodes.find(node=>node.tagName==='h1')),paragraphs:blocks(sections[0]),points:heroNodes.filter(node=>hasClass(node,'gspb_iconsList__item__text')).map(text),contact:heroNodes.filter(node=>node.tagName==='a'&&text(node)).map(node=>({label:text(node),href:href(attr(node,'href'))})),images:heroNodes.filter(node=>node.tagName==='img').map(image)};
const patternHeadings=all(sections[2]).filter(node=>node.tagName==='h3');
const patterns=patternHeadings.map(node=>{
 let parent=node.parentNode;
 while(parent&&!(all(parent).filter(n=>n.tagName==='h3').length===1&&all(parent).filter(n=>n.tagName==='img').length===1))parent=parent.parentNode;
 assert.ok(parent,'Missing pattern card');
 const nodes=all(parent);
 return {heading:heading(node),image:image(nodes.find(n=>n.tagName==='img')),blocks:blocks(parent),links:nodes.filter(n=>n.tagName==='a'&&text(n)).map(n=>({label:text(n),href:href(attr(n,'href'))}))};
});
assert.equal(patterns.length,6);
const benefitNodes=all(sections[3]);
const benefits={heading:heading(benefitNodes.find(node=>node.tagName==='h2')),items:benefitNodes.filter(node=>node.tagName==='h3').map(heading),image:image(benefitNodes.find(node=>node.tagName==='img'))};
const appNodes=all(sections[4]);
const labels=appNodes.filter(node=>hasClass(node,'tabtitlelabel')).map(text);
const applications={heading:heading(appNodes.find(node=>node.tagName==='h2')),items:appNodes.filter(node=>attr(node,'role')==='tabpanel').map((node,index)=>({title:labels[index],image:image(all(node).find(n=>n.tagName==='img')),blocks:blocks(node),links:all(node).filter(n=>n.tagName==='a'&&text(n)).map(n=>({label:text(n),href:href(attr(n,'href'))}))}))};
assert.equal(applications.items.length,4);
const faqNodes=all(sections[5]);
const faqItems=faqNodes.filter(node=>hasClass(node,'gs-accordion-item'));
const faq={heading:heading(faqNodes.find(node=>node.tagName==='h2')),intro:faqNodes.filter(node=>node.tagName==='p'&&!faqItems.some(item=>all(item).includes(node))).map(node=>({text:text(node),html:clean(node)})),items:faqItems.map(node=>({question:text(all(node).find(n=>hasClass(n,'gs-accordion-item__heading'))),answer:blocks(all(node).find(n=>hasClass(n,'gs-accordion-item__text')))}))};
assert.equal(faq.items.length,5);
const related=all(sections[6]).filter(node=>node.tagName==='li').map(node=>{
 const nodes=all(node);const titleNode=nodes.find(n=>n.tagName==='h3');const link=all(titleNode).find(n=>n.tagName==='a');const date=nodes.find(n=>n.tagName==='time');
 return {title:text(titleNode),href:href(attr(link,'href')),byline:'iDecal / '+text(date),image:image(nodes.find(n=>n.tagName==='img'))};
});
const source={sourceTitle:text(nodes.find(node=>node.tagName==='title')),sourceCanonical:canonical,sourceSha256:createHash('sha256').update(html).digest('hex'),title:hero.heading.title,description:hero.paragraphs[0].text,hero,brandImages:images.filter(image=>![...hero.images,...patterns.map(item=>item.image),benefits.image,...applications.items.map(item=>item.image),...related.map(item=>item.image)].some(used=>used.src===image.src)).map(image=>({...image,href:image.alt.toLowerCase().includes('infeel')?href('https://filmnoithat/infeel'):null})),patternsHeading:heading(all(sections[1]).find(node=>node.tagName==='h2')),patterns,benefits,applications,faq,related,images,linkMap};
const retained=[hero.heading.title,...[source.patternsHeading,benefits.heading,applications.heading,faq.heading].flatMap(item=>[item.title,item.subtitle]),...hero.paragraphs.map(b=>b.text),...hero.points,...hero.contact.map(c=>c.label),...patterns.flatMap(item=>[item.heading.title,...item.blocks.map(b=>b.text),...item.links.map(l=>l.label)]),...benefits.items.flatMap(item=>[item.title,item.subtitle]),...applications.items.flatMap(item=>[item.title,...item.blocks.map(b=>b.text),...item.links.map(l=>l.label)]),...faq.intro.map(b=>b.text),...faq.items.flatMap(item=>[item.question,...item.answer.map(b=>b.text)]),...related.flatMap(item=>[item.title,item.byline])].filter(Boolean);
const sourceTextNodes=[];
function collectSourceText(node){
 if(['script','style','noscript','svg'].includes(node.tagName))return;
 if(node.nodeName==='#text'&&node.value.trim())sourceTextNodes.push(node.value.trim());
 for(const child of node.childNodes??[])collectSourceText(child);
}
collectSourceText(main);
const snapshot={sourceFilename:input.split('/').pop(),sourceSha256:source.sourceSha256,sourceCanonical:canonical,heading:source.title,blocks:retained,sourceTextNodes,images};
await writeFile('src/data/interior-film-original.json',JSON.stringify(source,null,2)+'\n');
await writeFile('docs/interior-film-source.json',JSON.stringify(snapshot,null,2)+'\n');
const imageData=JSON.parse(await readFile('src/data/image-seo.json','utf8'));
for(const item of images)if(!imageData.some(existing=>existing.src===item.src))imageData.push({src:item.src,alt:item.alt,title:item.title});
await writeFile('src/data/image-seo.json',JSON.stringify(imageData,null,2)+'\n');
console.log(JSON.stringify({title:source.title,patterns:patterns.length,benefits:benefits.items.length,applications:applications.items.length,faqs:faq.items.length,images:images.length,blocks:retained.length,related:related.length,linkMap},null,2));
