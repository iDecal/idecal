import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
const regionSource=await readFile('src/data/regions.ts','utf8');
const regions=[...regionSource.matchAll(/slug: '([^']+)', name:/g)].map(match=>match[1]);
const districts=JSON.parse(await readFile('src/data/districts.json','utf8'));
for(const key of [...regions,...districts.map(item=>item.slug)]){
 assert.ok((await stat(`public/images/khu-vuc/${key}`)).isDirectory());
 const route=regions.includes(key)?`khu-vuc/${key}`:key==='quan-12'?'vi-tri/decal-dan-kinh-quan-12':`khu-vuc/tp-hcm/${key}`;
 const html=await readFile(`dist/${route}/index.html`,'utf8');const start=html.indexOf('id="anh-thi-cong"');assert.ok(start>=0,`Missing gallery ${key}`);assert.ok(html.includes(`data-photo-area="${key}"`));
 const after=html.slice(start);const project=after.indexOf('href="/du-an');assert.ok(project>=0,`Missing project link after photos ${key}`);
 if(key==='quan-12'||key==='tp-hcm')assert.ok(after.includes('data-local-photo'));else if(!html.includes('data-local-photo'))assert.ok(after.includes('đang được cập nhật'));
 assert.ok(!after.includes('type="file"'),`Public upload input ${key}`);
}
const manager=await readFile('dist/quan-ly-anh-khu-vuc/index.html','utf8');assert.ok(/name="robots" content="noindex/.test(manager));
for(const key of [...regions,...districts.map(item=>item.slug)])assert.ok(manager.includes(`https://github.com/iDecal/idecal/upload/main/public/images/khu-vuc/${key}`),`Missing upload link ${key}`);
assert.ok(!(await readFile('dist/sitemap.xml','utf8')).includes('/quan-ly-anh-khu-vuc'));
console.log(`Local photos passed: ${regions.length+districts.length} area galleries, project links after photos, authenticated GitHub upload links and noindex manager.`);
