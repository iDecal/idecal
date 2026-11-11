import assert from 'node:assert/strict';
import {readdir,readFile} from 'node:fs/promises';
import {parse} from 'parse5';
const attr=(n,k)=>n.attrs?.find(a=>a.name===k)?.value;
const hasClass=(n,c)=>(attr(n,'class')??'').split(/\s+/).includes(c);
const text=n=>n.nodeName==='#text'?n.value:(n.childNodes??[]).map(text).join('');
let count=0;
for(const file of await readdir('src/content/blog')){
 if(!file.endsWith('.md'))continue;
 const slug=file.slice(0,-3);const doc=parse(await readFile(`dist/blog/${slug}/index.html`,'utf8'));const nodes=[];
 const walk=n=>{nodes.push(n);for(const c of n.childNodes??[])walk(c)};walk(doc);
 const body=nodes.find(n=>hasClass(n,'blog-article-body'));assert.ok(body,slug);
 const toc=nodes.filter(n=>hasClass(n,'blog-toc'));
 if(!toc.length)continue;
 assert.equal(toc.length,1,`Only one TOC: ${slug}`);
 assert.equal(toc[0].parentNode,body,`TOC belongs in article body: ${slug}`);
 assert.equal(attr(toc[0],'open'),undefined,`TOC starts closed: ${slug}`);
 const cover=nodes.find(n=>hasClass(n,'blog-article-cover'));
 assert.ok(nodes.indexOf(cover)<nodes.indexOf(body),`Cover precedes body: ${slug}`);
 const intro=body.childNodes.find(n=>n.tagName==='p'&&text(n).trim());
 assert.ok(intro&&text(intro).trim(),`Text intro before TOC: ${slug}`);
 assert.ok(nodes.indexOf(intro)<nodes.indexOf(toc[0]),`Intro precedes TOC: ${slug}`);
 const firstHeading=nodes.find((n,i)=>i>nodes.indexOf(body)&&/^h[2-6]$/.test(n.tagName??''));
 if(firstHeading)assert.ok(nodes.indexOf(toc[0])<nodes.indexOf(firstHeading),`TOC before first body heading: ${slug}`);
 count++;
}
console.log(`Blog layout passed: ${count} closed inline TOCs after cover and text intro, before body headings.`);
