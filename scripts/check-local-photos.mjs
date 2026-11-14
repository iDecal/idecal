import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
const regionSource=await readFile('src/data/regions.ts','utf8');
const regions=[...regionSource.matchAll(/slug: '([^']+)', name:/g)].map(match=>match[1]);
const districts=JSON.parse(await readFile('src/data/districts.json','utf8'));
const restoredRoutes=JSON.parse(await readFile('src/data/district-routes.json','utf8'));
for(const key of [...regions,...districts.map(item=>item.slug)]){
 assert.ok((await stat(`public/images/khu-vuc/${key}`)).isDirectory());
 const route=regions.includes(key)?`khu-vuc/${key}`:restoredRoutes[key]?restoredRoutes[key].replace(/^\/|\/$/g,''):`khu-vuc/tp-hcm/${key}`;
 const html=await readFile(`dist/${route}/index.html`,'utf8');const start=html.indexOf('id="anh-thi-cong"');assert.ok(start>=0,`Missing gallery ${key}`);assert.ok(html.includes(`data-photo-area="${key}"`));
 const after=html.slice(start);assert.ok(!html.includes('class="local-photo-projects"'));assert.ok(!html.includes('local-related-posts'));assert.ok(!html.includes('class="district-project"'));assert.ok(!html.includes('class="regional-projects"'));
 if(key==='tp-hcm'){
  const counts=new Map();
  for(const [,area] of after.matchAll(/data-photo-district="([^"]+)"/g))counts.set(area,(counts.get(area)??0)+1);
  assert.ok(counts.size>0,'HCM gallery must contain confirmed local photos');
  for(const [area,count] of counts)assert.ok(count<=2,`HCM gallery exceeds two photos for ${area}`);
  assert.ok(after.includes('data-two-row-gallery'),'HCM gallery must support two-row display');
  assert.ok(after.includes('data-gallery-more'),'HCM gallery must offer show more');
 }
 if(key==='quan-12'||key==='tp-hcm')assert.ok(after.includes('data-local-photo'));else if(!html.includes('data-local-photo'))assert.ok(after.includes('đang được cập nhật'));
 assert.ok(!after.includes('type="file"'),`Public upload input ${key}`);
}
const manager=await readFile('dist/quan-ly-anh-khu-vuc/index.html','utf8');assert.ok(/name="robots" content="noindex/.test(manager));
for(const key of [...regions,...districts.map(item=>item.slug)])assert.ok(manager.includes(`https://github.com/iDecal/idecal/upload/main/public/images/khu-vuc/${key}`),`Missing upload link ${key}`);
assert.ok(!(await readFile('dist/sitemap.xml','utf8')).includes('/quan-ly-anh-khu-vuc'));
console.log(`Local photos passed: ${regions.length+districts.length} area galleries, photo-only local sections, authenticated GitHub upload links and noindex manager.`);
