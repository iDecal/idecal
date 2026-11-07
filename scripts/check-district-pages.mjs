import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
const districts=JSON.parse(await readFile('src/data/districts.json','utf8'));
const restoredRoutes=JSON.parse(await readFile('src/data/district-routes.json','utf8'));
assert.equal(districts.length,22);assert.equal(new Set(districts.map(d=>d.slug)).size,22);assert.equal(new Set(districts.map(d=>d.intro)).size,22);assert.equal(new Set(districts.map(d=>d.siteNote)).size,22);
const hub=await readFile('dist/khu-vuc/tp-hcm/index.html','utf8');const sitemap=await readFile('dist/sitemap.xml','utf8');
for(const district of districts){
 const route='/khu-vuc/tp-hcm/'+district.slug;const html=await readFile(path.join('dist',route,'index.html'),'utf8');
 assert.ok(hub.includes(`href="${restoredRoutes[district.slug]??route}"`),`Missing hub link ${district.slug}`);const canonical=html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];assert.ok(canonical);assert.ok(sitemap.includes(`<loc>${canonical}</loc>`),`Missing sitemap ${district.slug}`);
 assert.doesNotMatch(html,/DecalPro|0862208108|0909000000|30 phút|giá thành không đổi/i);if(district.slug!=='quan-1')assert.doesNotMatch(html,/24\/7/);
 const data=[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap(match=>{const value=JSON.parse(match[1]);return value['@graph']??[value];});
 const service=data.find(item=>item['@type']==='Service');assert.ok(service);assert.equal(service.areaServed['@type'],'Place');assert.ok(service.areaServed.name.includes(district.name));assert.ok(!service.address);assert.ok(data.some(item=>item['@type']==='FAQPage'));
 assert.ok(html.includes('dia-ban='+district.slug));assert.ok(html.includes('phường/xã hiện tại'));
}
const aliases=JSON.parse(await readFile('docs/local-district-aliases.json','utf8'));const redirects=await readFile('public/_redirects','utf8');
for(const [source,target] of Object.entries(aliases)){assert.ok(redirects.includes(`${source} ${target} 301`));assert.ok((await stat(path.join('dist',target,'index.html'))).isFile());}

const merged=await readFile('dist/khu-vuc/tp-hcm/quan-7/index.html','utf8');
assert.ok(merged.includes('Thi công Decal &amp; film tại khu vực Quận 7'));
assert.ok(merged.includes('Thi công Decal và film tại Nhà Bè'));
assert.ok(merged.includes('Cửa kính các phòng ở Nhà Bè'));
assert.ok(merged.includes('https://idecal.vn/khu-vuc/tp-hcm/quan-7/'));
assert.ok(!sitemap.includes('<loc>https://idecal.vn/khu-vuc/tp-hcm/huyen-nha-be/</loc>'));
assert.ok(!hub.includes('href="/khu-vuc/tp-hcm/huyen-nha-be'));

console.log('Local SEO passed: 22 distinct district pages, hub links, Service schema, sitemap and aliases.');
