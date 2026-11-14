import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {parse} from 'parse5';
const articles=JSON.parse(await readFile('docs/owner-articles-2026-11-14.json','utf8'));
const attr=(node,key)=>node.attrs?.find(a=>a.name===key)?.value;
const text=node=>node.nodeName==='#text'?node.value:(node.childNodes??[]).map(text).join(' ');
const normalize=value=>value.normalize('NFC').replace(/\s+/g,'');
for(const article of articles){
 const html=await readFile(`dist/blog/${article.slug}/index.html`,'utf8');
 const nodes=[];function walk(n){nodes.push(n);for(const c of n.childNodes??[])walk(c);}walk(parse(html));
 const body=nodes.find(n=>(attr(n,'class')??'').split(' ').includes('blog-article-body'));
 assert.ok(body,article.slug);
 const rendered=normalize(text(body));
 for(const block of article.blocks)assert.ok(rendered.includes(normalize(block)),`Missing owner text in ${article.slug}: ${block}`);
 assert.equal(text(nodes.find(n=>n.tagName==='h1')).trim(),article.title);
 const bodyNodes=[];function collect(n){bodyNodes.push(n);for(const c of n.childNodes??[])collect(c);}collect(body);
 assert.equal(bodyNodes.filter(n=>n.tagName==='table').length,article.tables,`Tables in ${article.slug}`);
 assert.ok(bodyNodes.some(n=>n.tagName==='a'&&attr(n,'href')?.startsWith('/lien-he-idecal')),`Contact action in ${article.slug}`);
 for(const file of ['dist/sitemap.xml','dist/search-index.json'])assert.ok((await readFile(file,'utf8')).includes(article.slug),`Discoverable article in ${file}`);
 console.log(`Owner article passed: ${article.slug}; ${article.blocks.length} unchanged text blocks; ${article.tables} tables.`);
}
