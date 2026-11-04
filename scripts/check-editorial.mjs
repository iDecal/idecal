import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
const plan=JSON.parse(await readFile('docs/blog-editorial-plan.json','utf8'));
const decode=text=>text.replace(/&#x([0-9a-f]+);/gi,(_,n)=>String.fromCodePoint(parseInt(n,16))).replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(Number(n))).replaceAll('&amp;','&').replaceAll('&quot;','"').replaceAll('&nbsp;',' ');
const text=html=>decode(html.replace(/<[^>]+>/g,' ')).replace(/\s+/g,' ').trim();
const normalize=text=>text.normalize('NFC').toLowerCase().replace(/\s+/g,' ').trim();
const audit=[];
for(const [slug,item] of Object.entries(plan)){
 const html=await readFile(`dist/blog/${slug}/index.html`,'utf8');const source=await readFile(`src/content/blog/${slug}.md`,'utf8');
 const title=text(html.match(/<title>(.*?)<\/title>/s)?.[1]??'');
 const description=decode(html.match(/<meta name="description" content="([^"]*)"/)?.[1]??'');
 const body=html.split('<div class="blog-article-body">')[1]?.split('<div class="blog-contact">')[0]??'';const visible=text(body);
 const headings=[...body.matchAll(/<h[23]\b[^>]*>([\s\S]*?)<\/h[23]>/g)].map(match=>text(match[1]));
 const links=[...body.matchAll(/<a\b[^>]*href="([^\"]+)"/g)].map(match=>decode(match[1])).filter(href=>href.startsWith('/')&&!/\.(?:jpg|png|webp|avif|jpeg)(?:\?|$)/i.test(href));
 const keyword=normalize(item.primaryKeyword);
 assert.ok(normalize(title).includes(keyword),`Title keyword: ${slug}`);assert.ok(normalize(description).includes(keyword),`Description keyword: ${slug}`);
 assert.ok(normalize(visible.slice(0,Math.max(300,visible.length*.1))).includes(keyword),`Opening keyword: ${slug}`);assert.ok(headings.some(heading=>normalize(heading).includes(keyword)),`Heading keyword: ${slug}`);
 assert.ok(new Set(links).size>=2,`Internal context links: ${slug}`);assert.ok(source.includes('editorialReview: "2026-11-04"'));
 assert.ok(!visible.includes('Nội dung bài viết viết bằng Markdown ở đây'));audit.push({slug,primaryKeyword:item.primaryKeyword,words:visible.split(/\s+/).length,internalLinks:new Set(links).size,externalLinks:[...body.matchAll(/<a\b[^>]*href="https?:/g)].length});
}
assert.equal(audit.length,83);
await writeFile('/tmp/blog-editorial-audit.json',JSON.stringify(audit,null,2));
const wards=JSON.parse(await readFile('src/data/hcm-wards.json','utf8'));assert.equal(wards.units.length,168);assert.equal(new Set(wards.units.map(unit=>unit.slug)).size,168);assert.equal(wards.units.filter(unit=>unit.type==='phường').length,113);assert.equal(wards.units.filter(unit=>unit.type==='xã').length,54);
const hub=await readFile('dist/khu-vuc/tp-hcm/index.html','utf8');assert.ok(hub.includes('id="phuong-xa"'));assert.ok(hub.includes('Nghị quyết 1685'));assert.ok(hub.includes('phường Sài Gòn'));assert.ok(hub.includes('xã Thạnh An'));assert.ok(hub.includes('đặc khu Côn Đảo'));
const header=hub.match(/<nav class="sticky[\s\S]*?<\/nav>/)?.[0]??'';assert.ok(!header.includes('Chọn quận/huyện'));assert.ok(!header.includes('/khu-vuc/tp-hcm#quan-huyen'));
console.log(`Editorial passed: ${audit.length} reviewed posts with keyword-led metadata/openings/headings and contextual links; 168 verified HCM units; district menu removed.`);
