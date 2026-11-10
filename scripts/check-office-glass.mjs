import assert from 'node:assert/strict';
import fs from 'node:fs';
import {parse} from 'parse5';
const source=JSON.parse(fs.readFileSync('src/data/office-glass-original.json','utf8'));
const copy=JSON.parse(fs.readFileSync('src/data/office-glass-copy.json','utf8'));
const presentation=JSON.parse(fs.readFileSync('src/data/office-glass-presentation.json','utf8'));
const snapshot=JSON.parse(fs.readFileSync('docs/office-glass-source.json','utf8'));
const html=fs.readFileSync('dist/decal-dan-kinh-van-phong/index.html','utf8');
const document=parse(html);const nodes=[];function walk(n){nodes.push(n);for(const c of n.childNodes??[])walk(c)}walk(document);
const attr=(n,k)=>n.attrs?.find(a=>a.name===k)?.value;
const text=n=>n.nodeName==='#text'?n.value:(n.childNodes??[]).filter(c=>!['script','style'].includes(c.tagName)).map(text).join('');
const normalize=value=>value.replace(/\s+/g,'');const main=nodes.find(n=>n.tagName==='main');const rendered=normalize(text(main));
assert.equal(source.sourceSha256,snapshot.sourceSha256);
assert.equal(text(nodes.find(n=>n.tagName==='h1')),copy.h1);
const sectionStart=source.tokens.findIndex(token=>token.type==='h2');
const sectionEnd=source.tokens.findIndex((token,index)=>index>sectionStart&&token.type==='h2');
const editedBlocks=new Set([...source.tokens.slice(sectionStart+1,sectionEnd).map(token=>token.text), ...source.tokens.filter(token=>['h1','h2'].includes(token.type)).map(token=>token.text)]);
for(const block of snapshot.blocks)if(!editedBlocks.has(block))assert.ok(rendered.includes(normalize(block)),`Missing retained editorial block: ${block}`);
for(const heading of Object.values(copy.headings))assert.ok(nodes.some(node=>node.tagName==='h2'&&text(node)===heading),`Missing edited heading: ${heading}`);
for(const item of copy.audiences)assert.ok(rendered.includes(normalize(item.title))&&rendered.includes(normalize(item.text)),`Missing audience: ${item.title}`);
for(const item of presentation){
  assert.ok(rendered.includes(normalize(item.title))&&rendered.includes(normalize(item.intro)),`Missing solution: ${item.title}`);
  for(const point of item.points)assert.ok(rendered.includes(normalize(`${point.label}: ${point.text}`)),`Missing solution point: ${point.label}`);
  assert.ok(nodes.some(node=>node.tagName==='a'&&attr(node,'href')===item.href&&text(node).includes(item.action)),`Missing action: ${item.action}`);
}
assert.ok(!text(main).includes('👉'),'Remove hand emoji from public content');
for(const image of source.images){assert.ok(nodes.some(n=>n.tagName==='img'&&attr(n,'src')===image.src),`Missing source image: ${image.src}`);assert.ok(fs.existsSync('public'+image.src));}
const faqs=source.tokens.filter(t=>t.type==='faq');assert.equal(faqs.length,7);
for(const faq of faqs)assert.ok(nodes.some(n=>n.tagName==='summary'&&text(n).includes(faq.question)),`Missing question: ${faq.question}`);
assert.ok(!nodes.some(n=>n.tagName==='details'&&attr(n,'open')!==undefined),'FAQs must start closed');
assert.ok(nodes.some(n=>n.tagName==='table'),'Source price table is required');
assert.ok(nodes.some(n=>n.tagName==='link'&&attr(n,'rel')==='canonical'&&attr(n,'href')===source.sourceCanonical));
assert.ok(!html.includes('google.com/search?q=link-subpage-logo'),'Replace source placeholder with the real cutting service');
console.log(`Office glass passed: ${snapshot.blocks.length} archived source blocks, 5 concise solutions, ${source.images.length} source images, keyword H1, edited headings, application contexts, original canonical, source table and ${faqs.length} closed FAQs.`);
