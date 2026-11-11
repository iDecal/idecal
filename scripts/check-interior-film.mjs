import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {parse} from 'parse5';
import {createHash} from 'node:crypto';
import {getImageSeo} from '../src/data/image-seo.ts';
const source=JSON.parse(await readFile('src/data/interior-film-original.json','utf8'));
const proof=JSON.parse(await readFile('docs/interior-film-source.json','utf8'));
const photos=JSON.parse(await readFile('src/data/interior-film-photos.json','utf8'));
const html=await readFile('dist/dich-vu-film-dan-noi-that/index.html','utf8');
const nodes=[];
function walk(node){nodes.push(node);for(const child of node.childNodes??[])walk(child)}
walk(parse(html));
const attr=(node,key)=>node.attrs?.find(item=>item.name===key)?.value;
const text=node=>['script','style'].includes(node.tagName)?'':node.nodeName==='#text'?node.value:(node.childNodes??[]).map(text).join('');
const normalize=value=>value.replace(/\s+/g,'');
const main=nodes.find(node=>node.tagName==='main');
const mainNodes=nodes.filter(node=>{for(let parent=node;parent;parent=parent.parentNode)if(parent===main)return true;return false;});
const rendered=normalize(text(main));
assert.equal(source.sourceSha256,proof.sourceSha256);
assert.equal(text(nodes.find(node=>node.tagName==='h1')),proof.heading);
const removedIntro=source.faq.intro;
const retainedBlocks=proof.blocks.filter(block=>!removedIntro.some(item=>item.text===block));
const textLeaves=node=>node.nodeName==='#text'?[node.value.trim()].filter(Boolean):(node.childNodes??[]).flatMap(textLeaves);
const removedLeaves=new Set(removedIntro.flatMap(item=>textLeaves(parse(item.html))));
for(const block of retainedBlocks)assert.ok(rendered.includes(normalize(block)),'Missing source text: '+block);
for(const leaf of proof.sourceTextNodes.filter(leaf=>!removedLeaves.has(leaf)))assert.ok(rendered.includes(normalize(leaf)),'Missing original source text node: '+leaf);
for(const block of removedIntro)assert.ok(!rendered.includes(normalize(block.text)),'Requested FAQ introduction must be removed');
assert.equal(source.patterns.length,6);assert.equal(source.benefits.items.length,4);assert.equal(source.applications.items.length,4);assert.equal(source.faq.items.length,5);
for(const image of proof.images){
 const replacement=photos.replacements[image.src];
 const expected=replacement?photos.images.find(photo=>photo.id===replacement):image;
 assert.ok(expected,'Missing approved photo replacement: '+replacement);
 const rendered=mainNodes.find(node=>node.tagName==='img'&&attr(node,'src')===expected.src);
 assert.ok(rendered,'Missing retained or replaced image: '+expected.src);
 assert.equal(attr(rendered,'alt'),getImageSeo(expected.src,expected.alt).alt);
 if(replacement)assert.ok(!mainNodes.some(node=>node.tagName==='img'&&attr(node,'src')===image.src),'Old replaced image must be removed: '+image.src);
}
assert.equal(photos.images.length,12);
assert.equal(Object.keys(photos.replacements).length,7);
for(const photo of photos.images){
 assert.equal(createHash('sha256').update(await readFile('public'+photo.src)).digest('hex'),photo.sha256,'Uploaded JPEG must retain its original bytes: '+photo.src);
 assert.ok(mainNodes.some(node=>node.tagName==='a'&&attr(node,'data-upload-photo')!==undefined&&attr(node,'href')===photo.src),'Missing gallery photo: '+photo.src);
}
const questions=mainNodes.find(node=>(attr(node,'class')??'').split(/\s+/).includes('interior-film-questions'));
const within=(node,ancestor)=>{for(let parent=node;parent;parent=parent.parentNode)if(parent===ancestor)return true;return false;};
const summaries=mainNodes.filter(node=>node.tagName==='summary'&&within(node,questions));
assert.equal(summaries.length,5);
assert.ok(!mainNodes.some(node=>node.tagName==='details'&&attr(node,'open')!==undefined),'FAQs must start closed');
for(const item of source.faq.items)assert.ok(summaries.some(node=>text(node).includes(item.question)));
assert.ok(nodes.some(node=>node.tagName==='link'&&attr(node,'rel')==='canonical'&&attr(node,'href')===proof.sourceCanonical));
const schemas=nodes.filter(node=>node.tagName==='script'&&attr(node,'type')==='application/ld+json').flatMap(node=>{const data=JSON.parse((node.childNodes??[]).map(child=>child.value??'').join(''));return data['@graph']??[data]});
const faq=schemas.find(item=>item['@type']==='FAQPage');assert.equal(faq.mainEntity.length,5);
for(const question of faq.mainEntity){assert.ok(rendered.includes(normalize(question.name)));assert.ok(rendered.includes(normalize(question.acceptedAnswer.text)));}
assert.ok(!/greenshift|gs-accordion-item__title|wp-admin|filmnoithat\/infeel|<form\b/i.test(html),'Do not import source scripts, admin forms or invalid links');
const redirects=await readFile('public/_redirects','utf8');
assert.ok(redirects.includes('/dich-vu/film-noi-that/ /dich-vu-film-dan-noi-that/ 301'));
assert.ok((await readFile('dist/film-dan-noi-that/index.html','utf8')).includes('href="/dich-vu-film-dan-noi-that/"'));
console.log('Interior film passed: '+retainedBlocks.length+' retained source blocks, 2 requested introduction blocks removed, 6 materials, 4 original applications plus elevator, 7 approved image replacements, 12 unchanged uploaded JPEGs with gallery links, 5 closed FAQs and original H1/canonical.');
