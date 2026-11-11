import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile,readdir,writeFile} from 'node:fs/promises';
import {parse} from 'parse5';

const input=process.argv[2];
assert.ok(input,'Usage: node scripts/import-signage.mjs <source.html>');
const html=await readFile(input,'utf8');
const attr=(node,key)=>node?.attrs?.find(item=>item.name===key)?.value;
const all=node=>[node,...(node.childNodes??[]).flatMap(all)];
const hasClass=(node,name)=>(attr(node,'class')??'').split(/\s+/).includes(name);
const raw=node=>['script','style','svg','noscript'].includes(node.tagName)?'':node.nodeName==='#text'?node.value:(node.childNodes??[]).map(raw).join('');
const text=node=>raw(node).replace(/\s+/g,' ').trim();
const nodes=all(parse(html));
const canonical=attr(nodes.find(node=>node.tagName==='link'&&attr(node,'rel')==='canonical'),'href');
assert.equal(canonical,'https://idecal.vn/dan-decal-bang-hieu/','Verify the supplied service source');
const main=nodes.find(node=>hasClass(node,'wp-block-post-content'));
assert.ok(main);
const sections=main.childNodes.filter(node=>node.tagName);
assert.equal(sections.length,54,'Review source structure before reimporting');
const products=JSON.parse(await readFile('src/data/products.json','utf8'));
const blogs=await readdir('src/content/blog');
const links=[];
const href=value=>{
 let output=value??'';
 if(output.startsWith('https://idecal.vn/')){
  const url=new URL(output);
  const slug=url.pathname.replace(/^\/|\/$/g,'');
  if(products.some(item=>item.slug===slug))output='/san-pham/'+slug+url.hash;
  else if(blogs.includes(slug+'.md'))output='/blog/'+slug+url.hash;
  else if(slug==='decal-luoi-dan-kinh')output='/decal-quang-cao/';
  else if(slug==='dich-vu/in-decal-theo-yeu-cau')output='/dich-vu/in-decal/';
  else output=url.pathname+url.search+url.hash;
 }
 if(output!==value&&!links.some(item=>item.original===value))links.push({original:value,resolved:output});
 return output;
};
const escape=value=>value.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const allowed=new Set(['p','strong','b','em','i','span','a','br','ul','ol','li','table','thead','tbody','tr','th','td']);
const clean=node=>{
 if(node.nodeName==='#text')return escape(node.value);
 if(['script','style','svg','noscript','form','button','iframe','input','img'].includes(node.tagName))return '';
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
 if(node.tagName==='th')attributes+=' scope="col"';
 return '<'+node.tagName+attributes+'>'+children+'</'+node.tagName+'>';
};
const block=node=>({text:text(node),html:clean(node)});
const heading=node=>({id:attr(node,'id')??'',title:text(node)});
const image=node=>{
 let parent=node.parentNode;
 while(parent&&parent.tagName!=='a'&&parent.tagName!=='figure')parent=parent.parentNode;
 return {src:attr(node,'src')||attr(node,'data-src'),alt:attr(node,'alt')??'',title:attr(node,'title')||attr(node,'alt')||'',width:parseInt(attr(node,'width'))||900,height:parseInt(attr(node,'height'))||600,...(parent?.tagName==='a'?{href:href(attr(parent,'href'))}:{})};
};
const findImage=node=>image(all(node).find(item=>item.tagName==='img'));
const heroNodes=all(sections[0]);
const heroParagraphs=heroNodes.filter(node=>node.tagName==='p');
assert.equal(heroParagraphs.length,3);
const hero={eyebrow:text(heroParagraphs[0]),title:text(heroNodes.find(node=>node.tagName==='h1')),intro:block(heroParagraphs[1]),actions:heroNodes.filter(node=>node.tagName==='a').map(node=>({label:text(node),href:'tel:0866077040'})),image:findImage(sections[0]),badge:{title:text(heroNodes.find(node=>node.tagName==='h3')),text:text(heroParagraphs[2])}};
const introduction={heading:heading(sections[1]),blocks:[block(sections[2])]};
const benefits={heading:heading(sections[3]),items:[4,6,8,10].map(index=>({title:text(sections[index]),body:block(sections[index+1])}))};
const materials={heading:heading(sections[12]),items:[[13,16],[16,20],[20,22],[22,25],[25,27]].map(([start,end])=>{
 const group=sections.slice(start+1,end);
 const figure=group.find(node=>node.tagName==='figure');
 return {heading:heading(sections[start]),blocks:group.filter(node=>node.tagName!=='figure').map(block),...(figure?{image:findImage(figure)}:{})};
})};
const installation={heading:heading(sections[27]),items:[28,30,32,34,36].map(index=>({title:text(sections[index]),body:block(sections[index+1])})),image:findImage(sections[38])};
const applications={heading:heading(sections[39]),items:sections[40].childNodes.filter(node=>node.tagName==='li').map(block)};
const commitments={heading:heading(sections[41]),intro:block(sections[42]),items:sections[43].childNodes.filter(node=>node.tagName==='li').map(block),image:findImage(sections[44])};
const table=node=>({html:clean(node),rows:all(node).filter(item=>item.tagName==='tr').map(row=>row.childNodes.filter(cell=>['th','td'].includes(cell.tagName)).map(text))});
const pricing={heading:heading(sections[45]),tables:[{heading:heading(sections[46]),intro:[],...table(sections[47])},{heading:heading(sections[48]),intro:[block(sections[49])],...table(sections[50])}],note:block(sections[51])};
const contact={heading:heading(sections[52]),blocks:[block(sections[53])]};
const images=[hero.image,...materials.items.filter(item=>item.image).map(item=>item.image),installation.image,commitments.image];
assert.equal(images.length,6);
assert.equal(materials.items.length,5);
assert.equal(applications.items.length,6);
assert.equal(commitments.items.length,5);
assert.deepEqual(pricing.tables.map(item=>item.rows.length),[6,9]);
const sourceSha256=createHash('sha256').update(html).digest('hex');
const source={sourceTitle:text(nodes.find(node=>node.tagName==='title')),sourceCanonical:canonical,sourceSha256,description:attr(nodes.find(node=>node.tagName==='meta'&&attr(node,'name')==='description'),'content'),parent:{name:'Decal quảng cáo',href:'/decal-quang-cao/'},hero,introduction,benefits,materials,process:installation,applications,commitments,pricing,contact,images,linkMap:links};
const sourceTextNodes=[];
function collect(node){if(['script','style','svg','noscript'].includes(node.tagName))return;if(node.nodeName==='#text'&&node.value.trim())sourceTextNodes.push(node.value.trim());for(const child of node.childNodes??[])collect(child);}
collect(main);
const proof={sourceFilename:input.split('/').pop(),sourceCanonical:canonical,sourceSha256,title:hero.title,sourceTextNodes,blocks:all(main).filter(node=>['h1','h2','h3','p','li'].includes(node.tagName)).map(text),headings:all(main).filter(node=>/^h[1-3]$/.test(node.tagName)).map(heading),images:all(main).filter(node=>node.tagName==='img').map(image),tables:sections.filter(node=>hasClass(node,'wp-block-table')).map(node=>table(node).rows)};
await writeFile('src/data/signage-original.json',JSON.stringify(source,null,2)+'\n');
await writeFile('docs/signage-source.json',JSON.stringify(proof,null,2)+'\n');
const metadata=JSON.parse(await readFile('src/data/image-seo.json','utf8'));
for(const item of images)if(!metadata.some(existing=>existing.src===item.src))metadata.push({src:item.src,alt:item.alt.trim(),title:item.title.trim()});
await writeFile('src/data/image-seo.json',JSON.stringify(metadata,null,2)+'\n');
console.log(JSON.stringify({title:hero.title,canonical,images:images.length,materials:materials.items.length,benefits:benefits.items.length,processSteps:installation.items.length,tableRows:proof.tables.map(rows=>rows.length-1),sourceTextNodes:sourceTextNodes.length,blocks:proof.blocks.length,links},null,2));
