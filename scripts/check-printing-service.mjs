import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import {parse} from 'parse5';
const source=JSON.parse(await readFile('src/data/printing-original.json','utf8'));
const snapshot=JSON.parse(await readFile('docs/printing-source.json','utf8'));
const html=await readFile('dist/dich-vu/in-decal/index.html','utf8');
const nodes=[];function walk(n){nodes.push(n);for(const c of n.childNodes??[])walk(c)}walk(parse(html));
const attr=(n,k)=>n.attrs?.find(a=>a.name===k)?.value;
const cls=(n,c)=>(attr(n,'class')??'').split(/\s+/).includes(c);
const raw=n=>['script','style','noscript','svg'].includes(n.tagName)?'':n.nodeName==='#text'?n.value:(n.childNodes??[]).map(raw).join('');
const norm=s=>s.replace(/\s+/g,'');
const main=nodes.find(n=>n.tagName==='main');const visible=norm(raw(main));
assert.equal(source.sourceSha256,snapshot.sourceSha256);
assert.equal(raw(nodes.find(n=>n.tagName==='h1')),source.hero.title);
for(const text of snapshot.sourceTextNodes)assert.ok(visible.includes(norm(text)),`Missing source text: ${text}`);
for(const image of snapshot.images){await access('public'+image.src);assert.ok(nodes.some(n=>n.tagName==='img'&&attr(n,'src')===image.src),`Missing source image ${image.src}`);}
assert.equal(source.technologies.length,2);assert.equal(source.benefits.points.length,5);
assert.equal(source.faq.items.length,4);assert.equal(source.related.length,4);
const faq=nodes.find(n=>cls(n,'printing-faq-list'));const faqNodes=[];function collect(n){faqNodes.push(n);for(const c of n.childNodes??[])collect(c)}collect(faq);
const details=faqNodes.filter(n=>n.tagName==='details');assert.equal(details.length,4);
for(const [i,item] of details.entries()){assert.equal(attr(item,'open'),undefined);assert.equal(raw(item.childNodes.find(n=>n.tagName==='summary')).replace('+','').trim(),source.faq.items[i].question);}
const schemas=nodes.filter(n=>n.tagName==='script'&&attr(n,'type')==='application/ld+json').flatMap(n=>{const value=JSON.parse(n.childNodes.map(c=>c.value??'').join(''));return value['@graph']??[value]});
const faqSchema=schemas.find(s=>s['@type']==='FAQPage');assert.equal(faqSchema.mainEntity.length,4);
for(const [i,item] of faqSchema.mainEntity.entries()){assert.equal(item.name,source.faq.items[i].question);assert.equal(item.acceptedAnswer.text,source.faq.items[i].blocks.map(b=>b.text).join(' '));}
assert.ok(schemas.some(s=>s['@type']==='Service'&&s.name===source.hero.title&&s.url===source.canonical));
for(const id of ['vat-lieu-in','cong-nghe-in','vi-sao-chon-idecal','lp-cau-hoi','pham-vi'])assert.ok(nodes.some(n=>attr(n,'id')===id),`Preserve service anchor ${id}`);
assert.ok(nodes.some(n=>n.tagName==='link'&&attr(n,'rel')==='canonical'&&attr(n,'href')===source.canonical));
assert.ok(nodes.some(n=>n.tagName==='a'&&attr(n,'href')==='/lien-he-idecal?dich-vu=in-decal#yeu-cau'));
assert.ok(nodes.some(n=>n.tagName==='a'&&attr(n,'href')==='https://zalo.me/0866077040'));
for(const item of source.related)assert.ok(nodes.some(n=>n.tagName==='a'&&attr(n,'href')===item.href));
const redirects=await readFile('public/_redirects','utf8');assert.ok(redirects.includes('/in-decal-theo-yeu-cau/ /dich-vu/in-decal/ 301'));
assert.ok(!html.includes('_files/')&&!html.includes('googlesitekit')&&!html.includes('wpadminbar'));
console.log(`Printing service passed: ${snapshot.sourceTextNodes.length} source text nodes, 6 source images, 2 technologies, 5 benefits, 4 closed FAQs matching schema, retained service URL/anchors and quote handoff.`);
