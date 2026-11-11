import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {parse} from 'parse5';
import products from '../src/data/products.json' with {type:'json'};
import pricing from '../src/data/service-pricing.json' with {type:'json'};

const primary='/phim-cach-nhiet-nha-kinh/';
const canonical='https://idecal.vn'+primary;
const aliases=['/phim-cach-nhiet/','/dich-vu/phim-cach-nhiet/'];
const attr=(node,key)=>node.attrs?.find(item=>item.name===key)?.value;
const all=node=>[node,...(node.childNodes??[]).flatMap(all)];
const text=node=>['script','style','svg'].includes(node.tagName)?'':node.nodeName==='#text'?node.value:(node.childNodes??[]).map(text).join(' ');
const clean=node=>text(node).replace(/\s+/g,' ').trim();
const films=products.filter(p=>p.slug.startsWith('phim-cach-nhiet-'));
const expected=products.filter(p=>p.category==='phim-cach-nhiet'||films.some(film=>film.slug===p.slug));
const source=JSON.parse(await readFile('docs/thermal-merge-source.json','utf8'));
for(const route of [primary,...aliases]){
 const nodes=all(parse(await readFile('dist'+route+'index.html','utf8')));
 const main=nodes.find(node=>node.tagName==='main');const content=all(main);
 const headings=content.filter(node=>node.tagName==='h1');
 assert.equal(headings.length,1);assert.match(clean(headings[0]),/Dịch vụ dán phim cách nhiệt/);
 assert.ok(nodes.some(node=>node.tagName==='link'&&attr(node,'rel')==='canonical'&&attr(node,'href')===canonical));
 const ids=content.map(node=>attr(node,'id')).filter(Boolean);assert.equal(ids.length,new Set(ids).size,'Duplicate HTML IDs on '+route);
 const cardIds=content.map(node=>attr(node,'data-product-id')).filter(Boolean);
 assert.equal(cardIds.length,new Set(cardIds).size,'Duplicate product cards');
 assert.deepEqual([...cardIds].sort(),expected.map(p=>p.slug).sort());
 for(const page of source.pages)for(const slug of page.products)assert.ok(cardIds.includes(slug),'Lost source product: '+slug);
 assert.equal(content.filter(node=>attr(node,'id')==='mau-san-pham').length,1,'One main product catalogue');
 assert.equal(content.filter(node=>attr(node,'id')==='bao-gia-phim-cach-nhiet').length,1);
 const table=content.find(node=>(attr(node,'class')??'').includes('thermal-price-table'));
 const tableText=clean(table);
 for(const row of pricing.groups.find(group=>group.id==='phim-cach-nhiet').rows)for(const value of row)assert.ok(tableText.includes(value),'Lost price or unit: '+value);
 for(const file of ['/images/uploads/film-phan-guong-xanh-la.png','/images/uploads/film-phan-guong-xanh-xam.png'])assert.ok(content.some(node=>node.tagName==='img'&&attr(node,'src')===file),'Lost shade illustration');
 const gallery=content.filter(node=>attr(node,'data-upload-photo')!==undefined);assert.equal(gallery.length,3);
 assert.ok(!content.some(node=>node.tagName==='details'&&attr(node,'open')!==undefined),'FAQ closed by default');
 const schemas=nodes.filter(node=>node.tagName==='script'&&attr(node,'type')==='application/ld+json').flatMap(node=>{const data=JSON.parse((node.childNodes??[]).map(child=>child.value??'').join(''));return data['@graph']??[data];});
 assert.ok(schemas.some(schema=>schema['@type']==='Service'&&schema.url===canonical));
 const faq=schemas.find(schema=>schema['@type']==='FAQPage');assert.equal(faq.mainEntity.length,2);
 for(const item of faq.mainEntity){assert.ok(clean(main).includes(item.name));assert.ok(clean(main).includes(item.acceptedAnswer.text));}
}
const redirects=new Map((await readFile('public/_redirects','utf8')).split('\n').filter(line=>line.trim()&&!line.startsWith('#')).map(line=>{const [from,to,status]=line.trim().split(/\s+/);return [from,{to,status}];}));
for(const path of [...aliases.map(url=>url.slice(0,-1)),'/danh-muc-san-pham/phim-cach-nhiet'])for(const suffix of ['','/'])assert.deepEqual(redirects.get(path+suffix),{to:primary,status:'301'});
assert.ok(!redirects.has(primary)&&!redirects.has(primary.slice(0,-1)),'Canonical URL must not redirect');
const sitemap=[...(await readFile('dist/sitemap.xml','utf8')).matchAll(/<loc>([^<]+)<\/loc>/g)].map(match=>match[1]);
assert.equal(sitemap.filter(url=>url===canonical).length,1);
for(const alias of aliases)assert.ok(!sitemap.includes('https://idecal.vn'+alias));
const index=JSON.parse(await readFile('dist/search-index.json','utf8'));
assert.equal(index.filter(entry=>[primary,...aliases].includes(entry.url)).length,1);
console.log('Thermal merge passed: one canonical service, direct 301 aliases, '+films.length+' film products plus '+(expected.length-films.length)+' support products without duplicates, original prices/photos, FAQ schema and one search/sitemap entry.');
