import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import {parse} from 'parse5';
import {searchEntries,normalizeSearch} from '../src/lib/site-search.ts';
const entries=JSON.parse(await readFile('dist/search-index.json','utf8'));
assert.ok(entries.length>200);
assert.equal(new Set(entries.map(entry=>entry.url)).size,entries.length);
for(const entry of entries){
 assert.ok(entry.url.startsWith('/')&&!entry.url.startsWith('//'));
 assert.ok(!/^\/(?:admin|api|404|tim-kiem|quan-ly|doi-chieu-anh)/.test(entry.url),'Only public canonical content belongs in search');
 const filename=entry.url.endsWith('.html')?'dist'+entry.url:'dist'+entry.url.replace(/\/$/,'')+'/index.html';
 assert.ok((await stat(filename)).isFile(),'Search result must resolve: '+entry.url);
 assert.ok(entry.title.trim());
 assert.ok(Array.isArray(entry.keywords));
}
assert.equal(normalizeSearch('Đà Nẵng'),'da nang');
assert.deepEqual(searchEntries(entries,'thang máy').map(entry=>entry.url),searchEntries(entries,'THANG MAY').map(entry=>entry.url));
assert.ok(searchEntries(entries,'thang may').some(entry=>entry.url==='/dan-decal-thang-may/'));
for(const query of ['IDC-008','idc008','IDC 008'])assert.equal(searchEntries(entries,query)[0].url,'/san-pham/decal-mo-o-vuong/');
assert.ok(searchEntries(entries,'cach nhiet').some(entry=>entry.url==='/phim-cach-nhiet-nha-kinh/'));
assert.deepEqual(searchEntries(entries,'  '),[]);
assert.deepEqual(searchEntries(entries,'d'),[]);
assert.deepEqual(searchEntries(entries,'thang may zxqvnonexistent'),[]);
assert.ok(searchEntries(entries,'decal').length>24);
const sitemap=await readFile('dist/sitemap.xml','utf8');
assert.ok(!sitemap.includes('<loc>https://idecal.vn/404'));
assert.ok(!sitemap.includes('<loc>https://idecal.vn/tim-kiem'));
for(const file of ['dist/404.html','dist/tim-kiem/index.html']){
 const html=await readFile(file,'utf8');
 assert.match(html,/name="robots" content="noindex, follow"/);
 const nodes=[];
 function walk(node){nodes.push(node);for(const child of node.childNodes??[])walk(child);}
 walk(parse(html));
 const attr=(node,key)=>node.attrs?.find(item=>item.name===key)?.value;
 assert.equal(nodes.filter(node=>node.tagName==='h1').length,1);
 assert.ok(nodes.some(node=>node.tagName==='form'&&attr(node,'action')==='/tim-kiem/'&&attr(node,'method')==='get'&&attr(node,'role')==='search'));
 const input=nodes.find(node=>node.tagName==='input'&&attr(node,'name')==='q');
 assert.ok(input);
 assert.ok(nodes.some(node=>node.tagName==='label'&&attr(node,'for')===attr(input,'id')));
 for(const href of ['/san-pham/','/dich-vu/','/blog/'])assert.ok(nodes.some(node=>node.tagName==='a'&&attr(node,'href')===href));
}
console.log('Search passed: '+entries.length+' public canonical pages; accent/case-insensitive matching, compact model codes, real destinations, empty/no-match queries, noindex 404/search pages and accessible GET forms.');
