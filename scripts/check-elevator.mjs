import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import {parse} from 'parse5';
const service=JSON.parse(await readFile('src/data/elevator-service.json','utf8'));
const html=await readFile('dist/'+service.slug+'/index.html','utf8');
const all=node=>[node,...(node.childNodes??[]).flatMap(all)];
const nodes=all(parse(html));
const attr=(node,key)=>node.attrs?.find(item=>item.name===key)?.value;
const text=node=>['script','style'].includes(node.tagName)?'':node.nodeName==='#text'?node.value:(node.childNodes??[]).map(text).join('');
const main=nodes.find(node=>node.tagName==='main');
assert.equal(nodes.filter(node=>node.tagName==='h1').length,1);
assert.equal(text(nodes.find(node=>node.tagName==='h1')),service.title);
const canonical='https://idecal.vn/'+service.slug+'/';
assert.ok(nodes.some(node=>node.tagName==='link'&&attr(node,'rel')==='canonical'&&attr(node,'href')===canonical));
for(const solution of service.solutions){
 const section=all(main).find(node=>attr(node,'id')===solution.id);
 assert.ok(section,'Both film and print solutions must be accessible');
 assert.ok(text(section).includes(solution.title));
 for(const link of solution.links)assert.ok(all(section).some(node=>node.tagName==='a'&&attr(node,'href')===link.href));
}
for(const image of [service.heroImage,...service.gallery]){
 assert.ok((await stat('public'+image.src)).isFile(),'Use existing local elevator photos');
 assert.ok(all(main).some(node=>node.tagName==='img'&&attr(node,'src')===image.src));
}
assert.ok(all(main).some(node=>node.tagName==='a'&&attr(node,'href')===service.quoteHref));
assert.equal(new URL(service.quoteHref,'https://idecal.vn').searchParams.get('dich-vu'),'thi-cong-decal');
assert.equal(all(main).filter(node=>node.tagName==='summary').length,4);
assert.ok(!all(main).some(node=>node.tagName==='details'&&attr(node,'open')!==undefined));
const schemas=nodes.filter(node=>node.tagName==='script'&&attr(node,'type')==='application/ld+json').flatMap(node=>{const data=JSON.parse((node.childNodes??[]).map(child=>child.value??'').join(''));return data['@graph']??[data];});
const breadcrumb=schemas.find(item=>item['@type']==='BreadcrumbList');
assert.equal(breadcrumb.itemListElement[1].item,'https://idecal.vn/decal-quang-cao/');
assert.equal(breadcrumb.itemListElement[2].item,canonical);
const serviceSchema=schemas.find(item=>item['@type']==='Service');
assert.equal(serviceSchema.serviceType.length,2);
const faq=schemas.find(item=>item['@type']==='FAQPage');
assert.equal(faq.mainEntity.length,4);
for(const item of faq.mainEntity){
 assert.ok(text(main).includes(item.name));
 assert.ok(text(main).includes(item.acceptedAnswer.text));
}
for(const route of ['decal-quang-cao','dich-vu/decal-quang-cao']){
 const parent=await readFile('dist/'+route+'/index.html','utf8');
 assert.ok(parent.includes('id="elevator-child-service-title"'));
 assert.ok(parent.includes('href="/'+service.slug+'/"'));
 assert.ok(parent.includes('id="signage-child-service-title"'),'Retain the existing signage child');
}
const redirects=await readFile('public/_redirects','utf8');
assert.ok(!redirects.split('\n').some(line=>line.startsWith('/'+service.slug+' ' )||line.startsWith('/'+service.slug+'/ ')));
assert.ok((await readFile('dist/sitemap.xml','utf8')).includes('<loc>'+canonical+'</loc>'));
assert.ok((await stat('dist/blog/dan-decal-thang-may-giai-phap-refresh-khong-gian/index.html')).isFile(),'Keep the existing source article');
console.log('Elevator service passed: film and printed advertising solutions, advertising parent links, existing local photos, 4 closed FAQs matching schema, quote handoff and independent canonical/sitemap entry.');
