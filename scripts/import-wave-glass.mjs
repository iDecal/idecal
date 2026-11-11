import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile,writeFile,readdir} from 'node:fs/promises';
import {parse} from 'parse5';
import postcss from 'postcss';
const input=process.argv[2];
assert.ok(input,'Usage: node scripts/import-wave-glass.mjs <source.html>');
const html=await readFile(input,'utf8');
const document=parse(html);
const attr=(node,key)=>node?.attrs?.find(item=>item.name===key)?.value;
const hasClass=(node,name)=>(attr(node,'class')??'').split(/\s+/).includes(name);
const all=node=>[node,...(node.childNodes??[]).flatMap(all)];
const raw=node=>['script','style','noscript','svg'].includes(node.tagName)?'':node.nodeName==='#text'?node.value:(node.childNodes??[]).map(raw).join('');
const text=node=>raw(node).replace(/\s+/g,' ').trim();
const nodes=all(document);
const canonical=attr(nodes.find(node=>node.tagName==='link'&&attr(node,'rel')==='canonical'),'href');
assert.equal(canonical,'https://idecal.vn/decal-dan-kinh-3d-van-song/','Verify the supplied source is the wave glass page');
const main=nodes.find(node=>hasClass(node,'wp-block-post-content'));
assert.ok(main);
const sections=main.childNodes.filter(node=>node.tagName);
assert.equal(sections.length,8,'Inspect changes in the source structure before importing');
const productSlugs=JSON.parse(await readFile('src/data/products.json','utf8')).map(item=>item.slug);
const blogs=await readdir('src/content/blog');
const linkMap=[];
const href=value=>{
 let output=value??'';
 if(output.startsWith('https://idecal.vn/')){
  const url=new URL(output);const slug=url.pathname.replace(/^\/|\/$/g,'');
  if(productSlugs.includes(slug))output='/san-pham/'+slug+url.hash;
  else if(blogs.includes(slug+'.md'))output='/blog/'+slug+url.hash;
  else if(slug==='decal-mo-cat')output='/decal-mo-dan-kinh/'+url.hash;
  else output=url.pathname+url.search+url.hash;
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
  const target=href(attr(node,'href'));
  if(!/^(?:https?:\/\/|tel:|mailto:|\/|#)/i.test(target))return children;
  attributes=' href="'+escape(target)+'"';
  if(/^https?:/.test(target))attributes+=' target="_blank" rel="noopener noreferrer"';
 }
 return '<'+node.tagName+attributes+'>'+children+'</'+node.tagName+'>';
};
const heading=node=>{
 const own=all(node).filter(item=>hasClass(item,'gspb_heading_subtitle'));
 const subtitles=own.length?own:(node.parentNode.childNodes??[]).filter(item=>hasClass(item,'gspb_heading_subtitle'));
 return {id:attr(node,'id')??'',title:(node.childNodes??[]).filter(item=>!hasClass(item,'gspb_heading_subtitle')).map(raw).join('').replace(/\s+/g,' ').trim(),subtitle:subtitles.map(text).join(' ')};
};
const paragraphs=node=>all(node).filter(item=>item.tagName==='p').map(item=>({text:text(item),html:clean(item)}));
const image=node=>({src:attr(node,'src')||attr(node,'data-src'),alt:attr(node,'alt')??'',title:attr(node,'title')||attr(node,'alt')||'',width:parseInt(attr(node,'width'))||900,height:parseInt(attr(node,'height'))||900,source:'img'});
const styles=nodes.filter(node=>node.tagName==='style').map(node=>(node.childNodes??[]).map(child=>child.value??'').join('')).filter(style=>style.includes('background-image'));
const background=(id,title)=>{
 let url;
 for(const style of styles){
  postcss.parse(style).walkRules(rule=>{
   if(!rule.selector.split(',').some(selector=>selector.trim()==='#'+id))return;
   rule.walkDecls('background-image',decl=>{
    const match=decl.value.match(/^url\(["']?(https:\/\/[^"')]+)["']?\)$/);
    if(match)url=match[1];
   });
  });
 }
 assert.ok(url,'Missing source background: '+id);
 return {src:url,alt:title,title,width:900,height:700,source:'background',sourceSelector:'#'+id};
};
const heroNodes=all(sections[0]);
const hero={heading:heading(heroNodes.find(node=>node.tagName==='h1')),paragraphs:paragraphs(sections[0]),points:heroNodes.filter(node=>hasClass(node,'gspb_iconsList__item__text')).map(text),cta:heroNodes.filter(node=>node.tagName==='a'&&!node.parentNode?.tagName?.match(/^(?:p|strong|em)$/)&&text(node)).map(node=>({label:text(node),href:href(attr(node,'href'))})),image:image(heroNodes.find(node=>node.tagName==='img'))};
const cards=all(sections[3]).filter(node=>hasClass(node,'gspb_row__col--4')).map(node=>{
 const descendants=all(node);const title=heading(descendants.find(item=>item.tagName==='h3'));
 const backdrop=descendants.find(item=>item.tagName==='section');
 const blocks=paragraphs(node);
 const links=descendants.filter(item=>item.tagName==='a'&&text(item)).map(item=>({label:text(item),href:href(attr(item,'href'))}));
 return {heading:title,image:background(attr(backdrop,'id'),title.title),paragraphs:blocks.filter(item=>!item.text.startsWith('Giá từ ')),price:blocks.find(item=>item.text.startsWith('Giá từ ')).text,points:descendants.filter(item=>hasClass(item,'gspb_iconsList__item__text')).map(text),links};
});
assert.equal(cards.length,3);
const benefitNodes=all(sections[4]);
const benefits={heading:heading(benefitNodes.find(node=>node.tagName==='h2')),paragraphs:paragraphs(sections[4]),points:benefitNodes.filter(node=>hasClass(node,'gspb_iconsList__item')).map(node=>({text:text(node),html:clean(node)})),image:image(benefitNodes.find(node=>node.tagName==='img'))};
const faqNodes=all(sections[5]);
const faq={heading:heading(faqNodes.find(node=>node.tagName==='h2')),items:faqNodes.filter(node=>hasClass(node,'gs-accordion-item')).map(node=>{
 const content=all(node).find(item=>hasClass(item,'gs-accordion-item__text'));
 return {question:text(all(node).find(item=>hasClass(item,'gs-accordion-item__heading'))),answer:{text:text(content),html:clean(content)}};
})};
assert.equal(faq.items.length,5);
const gallery={heading:heading(sections[6]),images:all(sections[7]).filter(node=>node.tagName==='img').map(image)};
const images=[hero.image,...cards.map(card=>card.image),benefits.image,...gallery.images];
assert.equal(images.length,6);
assert.ok(images.every(item=>/^https:\/\//.test(item.src)));
const source={sourceTitle:text(nodes.find(node=>node.tagName==='title')),sourceCanonical:canonical,sourceSha256:createHash('sha256').update(html).digest('hex'),title:hero.heading.title,description:hero.paragraphs[0].text,hero,modelsHeading:heading(all(sections[1]).find(node=>node.tagName==='h2')),modelsIntro:clean(sections[2]),cards,benefits,faq,gallery,images,linkMap};
const sourceTextNodes=[];
function collect(node){if(['script','style','noscript','svg'].includes(node.tagName))return;if(node.nodeName==='#text'&&node.value.trim())sourceTextNodes.push(node.value.trim());for(const child of node.childNodes??[])collect(child)}
collect(main);
const snapshot={sourceFilename:input.split('/').pop(),sourceCanonical:canonical,sourceSha256:source.sourceSha256,title:source.title,sourceTextNodes,images,prices:cards.map(card=>card.price),questions:faq.items.map(item=>item.question)};
await writeFile('src/data/wave-glass-original.json',JSON.stringify(source,null,2)+'\n');
await writeFile('docs/wave-glass-source.json',JSON.stringify(snapshot,null,2)+'\n');
const metadata=JSON.parse(await readFile('src/data/image-seo.json','utf8'));
for(const item of images)if(!metadata.some(existing=>existing.src===item.src))metadata.push({src:item.src,alt:item.alt,title:item.title});
await writeFile('src/data/image-seo.json',JSON.stringify(metadata,null,2)+'\n');
console.log(JSON.stringify({title:source.title,canonical,models:cards.length,prices:snapshot.prices,features:benefits.points.length,faqs:faq.items.length,images:images.length,textNodes:sourceTextNodes.length,linkMap},null,2));
