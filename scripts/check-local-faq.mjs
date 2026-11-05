import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const config=JSON.parse(await readFile('src/data/local-area-content.json','utf8'));
assert.equal(Object.keys(config).length,30);assert.equal(new Set(Object.values(config).map(area=>area.title)).size,30);
const districts=JSON.parse(await readFile('src/data/districts.json','utf8'));
const decode=value=>value.replace(/&#x([0-9a-f]+);/gi,(_,v)=>String.fromCodePoint(parseInt(v,16))).replace(/&#(\d+);/g,(_,v)=>String.fromCodePoint(Number(v))).replaceAll('&amp;','&').replaceAll('&quot;','"').replaceAll('&nbsp;',' ');
const text=html=>decode(html.replace(/<[^>]*>/g,' ')).replace(/\s+/g,' ').trim();let questions=0;
for(const [key,area] of Object.entries(config)){
 const route=districts.some(district=>district.slug===key)?key==='quan-12'?'vi-tri/decal-dan-kinh-quan-12':`khu-vuc/tp-hcm/${key}`:`khu-vuc/${key}`;
 const html=await readFile(`dist/${route}/index.html`,'utf8');const section=html.match(/<section id="cau-hoi"[\s\S]*?<\/section>/)?.[0];assert.ok(section,`FAQ ${key}`);assert.ok(text(section).includes(area.title));
 const faq=[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap(match=>{const value=JSON.parse(match[1]);return value['@graph']??[value];}).filter(value=>value['@type']==='FAQPage');assert.equal(faq.length,1,`Unique FAQ schema ${key}`);
 assert.ok(faq[0].mainEntity.length>=3);assert.equal((section.match(/<details/g)||[]).length,faq[0].mainEntity.length);
 for(const item of faq[0].mainEntity){assert.ok(text(section).includes(item.name),`Visible schema question ${key}`);assert.ok(text(section).includes(item.acceptedAnswer.text),`Visible schema answer ${key}`);}
 for(const item of area.items)assert.ok(faq[0].mainEntity.some(question=>question.name===item.question));questions+=faq[0].mainEntity.length;
 assert.ok(!html.includes('local-related-posts'),`Related post section removed ${key}`);
 assert.ok(area.nearby.length>=2&&area.nearby.length<=4);assert.ok(!area.nearby.includes(key));assert.equal(new Set(area.nearby).size,area.nearby.length);for(const neighbor of area.nearby)assert.ok(config[neighbor]);
 assert.ok(html.includes('local-nearby-areas'));
}
console.log(`Local FAQ passed: 30 unique headings, ${questions} visible answers matching FAQ schema, no related-post sections and curated cross-links.`);
