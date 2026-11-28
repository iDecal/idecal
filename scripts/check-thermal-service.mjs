import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {parse} from 'parse5';
import copy from '../src/data/thermal-landing-copy.json' with {type:'json'};
import faqs from '../src/data/thermal-landing-faq.json' with {type:'json'};

const primary='/phim-cach-nhiet-nha-kinh/';
const canonical='https://idecal.vn'+primary;
const aliases=['/phim-cach-nhiet/','/dich-vu/phim-cach-nhiet/'];
const attr=(node,key)=>node.attrs?.find(item=>item.name===key)?.value;
const all=node=>[node,...(node.childNodes??[]).flatMap(all)];
const text=node=>['script','style','svg'].includes(node.tagName)?'':node.nodeName==='#text'?node.value:(node.childNodes??[]).map(text).join(' ');
const clean=node=>text(node).replace(/\s+/g,' ').trim();
const expectedFilms = [
 'Medium Black 18', 'Xanh dương phản gương', 'Khói sáng P.K18', 'Smoke Black',
 'IceTouch Nano Ceramic', 'Bạc phản gương', 'Xanh nhạt tự nhiên', 'R20S – Rainier',
];
const sectionIds = ['loi-ich','san-pham','bao-gia','ung-dung','quy-trinh','faq'];
for(const route of [primary,...aliases]){
 const nodes=all(parse(await readFile('dist'+route+'index.html','utf8')));
 const main=nodes.find(node=>node.tagName==='main');const content=all(main);
 const headings=content.filter(node=>node.tagName==='h1');
 assert.equal(headings.length,1);assert.match(clean(headings[0]),/Phim Cách Nhiệt Nhà Kính.*Cản Tia UV Hiệu Quả/);
 assert.ok(nodes.some(node=>node.tagName==='link'&&attr(node,'rel')==='canonical'&&attr(node,'href')===canonical));
 const ids=content.map(node=>attr(node,'id')).filter(Boolean);assert.equal(ids.length,new Set(ids).size,'Duplicate HTML IDs on '+route);
 const cards=content.filter(node=>attr(node,'data-film-group')!==undefined);
 assert.deepEqual(cards.map(card=>clean(all(card).find(node=>node.tagName==='h3'))),expectedFilms);
 assert.deepEqual(content.filter(node=>node.tagName==='section'&&sectionIds.includes(attr(node,'id'))).map(node=>attr(node,'id')),sectionIds);
 for(const id of ['mau-san-pham','bao-gia-phim-cach-nhiet','chon-phim','ung-dung-phim','thi-cong-phim','anh-thi-cong-phim','cau-hoi-phim'])assert.ok(ids.includes(id),'Lost section link: '+id);
 const table=content.find(node=>(attr(node,'class')??'').includes('film-price-table'));
 assert.deepEqual(all(table).filter(node=>node.tagName==='td').map(clean),copy.pricing.rows.flatMap(row=>row.slice(1)));
 for(const group of [copy.benefits,copy.types,copy.applications,copy.process]) {
   assert.ok(clean(main).includes(group.heading));
   for(const item of group.items) assert.ok(clean(main).includes(item.description));
 }
 const brands=content.find(node=>attr(node,'class')==='film-brand-list');
 assert.deepEqual(all(brands).filter(node=>node.tagName==='li').map(clean),copy.brands.items);
 for(const card of cards){
   const photo=all(card).find(node=>(attr(node,'class')??'').includes('film-product-photo'));
   assert.ok(all(photo).some(node=>node.tagName==='img'));
   assert.ok(!all(photo).some(node=>attr(node,'class')==='film-product-label'));
 }
 assert.ok(nodes.some(node=>node.tagName==='meta'&&attr(node,'name')==='description'&&attr(node,'content')===copy.description));
 assert.ok(!content.some(node=>attr(node,'data-film-calculator')!==undefined));
 const related=content.find(node=>attr(node,'aria-labelledby')==='thermal-related-title');
 assert.equal(all(related).filter(node=>node.tagName==='a'&&attr(node,'href')?.startsWith('/blog/')).length,3);
 assert.ok(!content.some(node=>node.attrs?.some(({name,value})=>name.startsWith('on')||value.startsWith('file:'))),'Local file URL or inline event in imported content');
 const gallery=content.filter(node=>attr(node,'data-upload-photo')!==undefined);assert.equal(gallery.length,3);
 assert.ok(!content.some(node=>node.tagName==='details'&&attr(node,'open')!==undefined),'FAQ closed by default');
 const schemas=nodes.filter(node=>node.tagName==='script'&&attr(node,'type')==='application/ld+json').flatMap(node=>{const data=JSON.parse((node.childNodes??[]).map(child=>child.value??'').join(''));return data['@graph']??[data];});
 assert.ok(schemas.some(schema=>schema['@type']==='Service'&&schema.url===canonical));
 const faq=schemas.find(schema=>schema['@type']==='FAQPage');assert.deepEqual(faq.mainEntity.map(item=>({question:item.name,answer:item.acceptedAnswer.text})),faqs);
 assert.match(clean(nodes.find(node=>node.tagName==='title')), /^Phim cách nhiệt nhà kính/i);
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
console.log('Thermal landing passed: imported section order, eight film models, pricing, local gallery, FAQ schema, anchors and canonical redirects.');
