import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import {parse} from 'parse5';
import {getImageSeo} from '../src/data/image-seo.ts';
const source=JSON.parse(await readFile('src/data/wave-glass-original.json','utf8'));
const proof=JSON.parse(await readFile('docs/wave-glass-source.json','utf8'));
const html=await readFile('dist/decal-dan-kinh-3d-van-song/index.html','utf8');
const nodes=[];
function walk(node){nodes.push(node);for(const child of node.childNodes??[])walk(child);}
walk(parse(html));
const attr=(node,key)=>node.attrs?.find(item=>item.name===key)?.value;
const text=node=>['script','style'].includes(node.tagName)?'':node.nodeName==='#text'?node.value:(node.childNodes??[]).map(text).join('');
const normalize=value=>value.replace(/\s+/g,'');
const main=nodes.find(node=>node.tagName==='main');
const mainNodes=nodes.filter(node=>{for(let parent=node;parent;parent=parent.parentNode)if(parent===main)return true;return false;});
const rendered=normalize(text(main));
assert.equal(source.sourceSha256,proof.sourceSha256);
assert.equal(nodes.filter(node=>node.tagName==='h1').length,1);
assert.equal(text(nodes.find(node=>node.tagName==='h1')),proof.title);
for(const leaf of proof.sourceTextNodes)assert.ok(rendered.includes(normalize(leaf)),'Missing original source text: '+leaf);
assert.equal(source.cards.length,3);
const prices=nodes.filter(node=>(attr(node,'class')??'').split(' ').includes('wave-price')).map(text);
assert.deepEqual(prices,proof.prices,'Preserve all three original price strings');
const images=nodes.filter(node=>node.tagName==='img'&&proof.images.some(image=>image.src===attr(node,'src')));
assert.equal(images.length,6);
assert.equal(proof.images.filter(image=>image.source==='background').length,3);
for(const image of proof.images){
 const actual=images.find(node=>attr(node,'src')===image.src);
 assert.ok(actual,'Missing source image, including CSS/lazy image: '+image.src);
 const metadata=getImageSeo(image.src,image.alt);
 assert.equal(attr(actual,'alt'),metadata.alt);
 assert.equal(attr(actual,'title'),metadata.title);
}
assert.equal(mainNodes.filter(node=>node.tagName==='summary').length,5);
assert.ok(!mainNodes.some(node=>node.tagName==='details'&&attr(node,'open')!==undefined));
for(const question of proof.questions)assert.ok(mainNodes.some(node=>node.tagName==='summary'&&text(node).includes(question)));
assert.ok(nodes.some(node=>node.tagName==='link'&&attr(node,'rel')==='canonical'&&attr(node,'href')===proof.sourceCanonical));
const schemas=nodes.filter(node=>node.tagName==='script'&&attr(node,'type')==='application/ld+json').flatMap(node=>{const data=JSON.parse((node.childNodes??[]).map(child=>child.value??'').join(''));return data['@graph']??[data];});
const faq=schemas.find(item=>item['@type']==='FAQPage');
assert.equal(faq.mainEntity.length,5);
for(const item of faq.mainEntity){assert.ok(rendered.includes(normalize(item.name)));assert.ok(rendered.includes(normalize(item.acceptedAnswer.text)));}
assert.ok(!/greenshift|gs-accordion-item__title|wp-admin|<form\b/i.test(html),'Do not import saved scripts or admin forms');
for(const link of source.linkMap){
 const path=new URL(link.resolved,'https://idecal.vn').pathname.replace(/\/$/,'');
 assert.ok((await stat('dist'+path+'/index.html')).isFile(),'Imported link must resolve: '+link.resolved);
}
const redirects=await readFile('public/_redirects','utf8');
assert.ok(redirects.includes('/dich-vu/decal-mo-3d-van-song/ /decal-dan-kinh-3d-van-song/ 301'));
assert.ok(redirects.includes('/decal-mo-3d-van-song /san-pham/decal-mo-3d-van-song/ 301'),'Keep the separate product route');
assert.ok((await readFile('dist/film-trang-tri-kinh/index.html','utf8')).includes('href="/decal-dan-kinh-3d-van-song/"'));
assert.ok((await readFile('dist/sitemap.xml','utf8')).includes('<loc>'+proof.sourceCanonical+'</loc>'));
console.log('Wave glass passed: '+proof.sourceTextNodes.length+' original text nodes, 3 models/prices, 6 source images (3 CSS backgrounds), 5 closed FAQs, canonical, sitemap and working internal links.');
