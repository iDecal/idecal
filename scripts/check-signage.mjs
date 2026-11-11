import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import {parse} from 'parse5';
import {getImageSeo} from '../src/data/image-seo.ts';
import {localizeSignageText,signageCopy} from '../src/data/signage-presentation.ts';

const source=JSON.parse(await readFile('src/data/signage-original.json','utf8'));
const proof=JSON.parse(await readFile('docs/signage-source.json','utf8'));
const gallery=JSON.parse(await readFile('src/data/signage-gallery.json','utf8'));
const library=JSON.parse(await readFile('src/data/installation-photo-library.json','utf8'));
const html=await readFile('dist/dan-decal-bang-hieu/index.html','utf8');
const all=node=>[node,...(node.childNodes??[]).flatMap(all)];
const nodes=all(parse(html));
const attr=(node,key)=>node.attrs?.find(item=>item.name===key)?.value;
const text=node=>['script','style'].includes(node.tagName)?'':node.nodeName==='#text'?node.value:(node.childNodes??[]).map(text).join('');
const normalize=value=>value.replace(/\s+/g,'');
const main=nodes.find(node=>node.tagName==='main');
const rendered=normalize(text(main));
assert.equal(source.sourceSha256,proof.sourceSha256);
assert.equal(nodes.filter(node=>node.tagName==='h1').length,1);
assert.equal(text(nodes.find(node=>node.tagName==='h1')),proof.title);
// The owner requested a shorter process section; all other source copy remains protected.
const retainOutsideProcess=values=>{
 const start=values.indexOf(source.process.heading.title);
 const end=values.indexOf(source.applications.heading.title,start+1);
 assert.ok(start>=0&&end>start,'Find exact archived process boundaries');
 return [...values.slice(0,start),...values.slice(end)];
};
const retainedBlocks=retainOutsideProcess(proof.blocks);
assert.equal(proof.blocks.length-retainedBlocks.length,11,'Only the process heading and five title/paragraph pairs may be shortened');
for(const leaf of retainOutsideProcess(proof.sourceTextNodes))assert.ok(rendered.includes(normalize(localizeSignageText(leaf))),'Missing original/localized text: '+leaf);
for(const block of retainedBlocks)assert.ok(rendered.includes(normalize(localizeSignageText(block))),'Missing original/localized text block: '+block);
const processList=all(main).find(node=>(attr(node,'class')??'').split(' ').includes('sign-process'));
const steps=processList.childNodes.filter(node=>node.tagName==='li');
assert.equal(steps.length,5);
for(const [index,step] of steps.entries()){
 assert.equal(text(all(step).find(node=>node.tagName==='h3')),signageCopy.process.items[index].title);
 assert.equal(text(all(step).find(node=>node.tagName==='p')),signageCopy.process.items[index].description);
 assert.ok(text(step).startsWith(String(index+1).padStart(2,'0')));
}
assert.ok(signageCopy.process.items.map(item=>item.description).join('').length<source.process.items.map(item=>item.body.text).join('').length*.6,'Process copy should be substantially shorter');
assert.ok(text(processList).includes('6–12 tháng tùy vật liệu, điều kiện sử dụng'),'Retain warranty period and conditions');
for(const heading of proof.headings.filter(item=>item.id)){
 const node=nodes.find(node=>attr(node,'id')===heading.id);
 assert.ok(node,'Missing heading anchor: '+heading.id);
 assert.equal(text(node),heading.id===source.process.heading.id?signageCopy.process.title:localizeSignageText(heading.title));
}
const actualTables=all(main).filter(node=>node.tagName==='table').map(table=>all(table).filter(node=>node.tagName==='tr').map(row=>row.childNodes.filter(cell=>['th','td'].includes(cell.tagName)).map(cell=>text(cell).replace(/\s+/g,' ').trim())));
assert.deepEqual(actualTables,proof.tables.map(table=>table.map(row=>row.map(localizeSignageText))),'Only requested Vietnamese translations may change table text');
assert.deepEqual(actualTables.map(table=>table.slice(1).map(row=>row[1])),proof.tables.map(table=>table.slice(1).map(row=>row[1])),'Keep every original price and unit');
for(const replacement of signageCopy.replacements){
 assert.ok(!rendered.includes(normalize(replacement.from)),'Remove English wording: '+replacement.from);
}
const links=all(main).filter(node=>node.tagName==='a');
assert.ok(links.some(node=>attr(node,'href')===signageCopy.quoteHref));
assert.ok(links.some(node=>attr(node,'href')==='tel:0866077040'));
for(const cell of all(main).filter(node=>node.tagName==='td'))assert.ok(attr(cell,'data-label'),'Responsive table cells need column labels');
for(const image of proof.images){
 const actual=all(main).find(node=>node.tagName==='img'&&attr(node,'src')===image.src);
 assert.ok(actual,'Missing source image: '+image.src);
 const seo=getImageSeo(image.src,image.alt);
 assert.equal(attr(actual,'alt'),seo.alt);
 assert.equal(attr(actual,'title'),seo.title);
}
assert.equal(all(main).filter(node=>node.tagName==='img'&&proof.images.some(image=>image.src===attr(node,'src'))).length,6,'Keep all source images alongside the new gallery');
const workGallery=all(main).find(node=>attr(node,'id')===gallery.id);
assert.ok(workGallery,'Display the installation gallery');
const photos=all(workGallery).filter(node=>node.tagName==='img'&&attr(node,'src'));
assert.equal(photos.length,6);
const featuredBlog=await readFile('src/content/blog/'+gallery.featuredPost.slug+'.md','utf8');
const featuredImage=featuredBlog.match(/^image: "([^"]+)"/m)?.[1];
assert.ok(featuredImage,'Use the existing project article image');
assert.equal(attr(photos[0],'src'),featuredImage);
for(const [index,number] of gallery.installationNumbers.entries()){
 const record=library.find(photo=>photo.number===number);
 assert.equal(record.kind,'installation','Only use existing installation evidence');
 assert.equal(attr(photos[index+1],'src'),record.src);
}
for(const photo of photos)assert.ok((await stat('public'+attr(photo,'src'))).isFile());
assert.equal(all(workGallery).filter(node=>node.tagName==='a'&&attr(node,'data-upload-photo')!==undefined).length,6);
assert.ok(all(workGallery).some(node=>node.tagName==='dialog'),'Allow full-size photo viewing');
assert.ok(nodes.some(node=>node.tagName==='link'&&attr(node,'rel')==='canonical'&&attr(node,'href')===proof.sourceCanonical));
const schemas=nodes.filter(node=>node.tagName==='script'&&attr(node,'type')==='application/ld+json').flatMap(node=>{const data=JSON.parse((node.childNodes??[]).map(child=>child.value??'').join(''));return data['@graph']??[data];});
const breadcrumb=schemas.find(item=>item['@type']==='BreadcrumbList');
assert.equal(breadcrumb.itemListElement[1].item,'https://idecal.vn/decal-quang-cao/');
assert.equal(breadcrumb.itemListElement[2].item,proof.sourceCanonical);
assert.ok(schemas.some(item=>item['@type']==='Service'&&item.url===proof.sourceCanonical));
assert.ok(all(main).some(node=>node.tagName==='a'&&attr(node,'href')===source.parent.href));
for(const route of ['decal-quang-cao','dich-vu/decal-quang-cao']){
 const parent=await readFile('dist/'+route+'/index.html','utf8');
 assert.ok(parent.includes('class="container signage-service-card"'),'Parent service card missing: '+route);
 assert.ok(parent.includes('href="/dan-decal-bang-hieu/"'));
}
const rules=new Map((await readFile('public/_redirects','utf8')).split('\n').filter(line=>line&&!line.startsWith('#')).map(line=>line.trim().split(/\s+/)).map(([from,to])=>[from,to]));
assert.ok(!rules.has('/dan-decal-bang-hieu')&&!rules.has('/dan-decal-bang-hieu/'),'New canonical page must not redirect to cutting service');
for(const alias of ['/decal-bang-hieu','/dich-vu-dan-decal-bang-hieu-chuyen-nghiep'])for(const suffix of ['','/'])assert.equal(rules.get(alias+suffix),'/dan-decal-bang-hieu/');
for(const link of source.linkMap){
 const pathname=new URL(link.resolved,'https://idecal.vn').pathname.replace(/\/$/,'');
 assert.ok((await stat('dist'+pathname+'/index.html')).isFile(),'Invalid imported internal link: '+link.resolved);
}
assert.ok((await readFile('dist/sitemap.xml','utf8')).includes('<loc>'+proof.sourceCanonical+'</loc>'));
assert.ok(!/wp-admin|cozyBlock|<form\b|onerror=|onclick=/i.test(html),'Do not import saved admin/plugin scripts or handlers');
console.log('Signage passed: '+retainedBlocks.length+' preserved source blocks plus 5 concise numbered process steps, '+proof.sourceTextNodes.length+' archived text nodes, 6 original images, 6 verified local installation photos, 13 unchanged prices, responsive table labels, quote/call actions, parent links and canonical.');
