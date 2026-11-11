import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile,writeFile} from 'node:fs/promises';
import {parse} from 'yaml';
const plan=JSON.parse(await readFile('docs/blog-editorial-plan.json','utf8'));
const decode=text=>text.replace(/&#x([0-9a-f]+);/gi,(_,n)=>String.fromCodePoint(parseInt(n,16))).replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(Number(n))).replaceAll('&amp;','&').replaceAll('&quot;','"').replaceAll('&nbsp;',' ');
const text=html=>decode(html.replace(/<[^>]+>/g,' ')).replace(/\s+/g,' ').trim();
const normalize=text=>text.normalize('NFC').toLowerCase().replace(/\s+/g,' ').trim();
const originals=JSON.parse(await readFile('docs/wordpress-original-titles.json','utf8'));
const titleChanges=JSON.parse(await readFile('docs/material-blog-title-changes.json','utf8'));
const audit=[];
for(const [slug,item] of Object.entries(plan)){
 const html=await readFile(`dist/blog/${slug}/index.html`,'utf8');const source=await readFile(`src/content/blog/${slug}.md`,'utf8');
 const title=text(html.match(/<title>(.*?)<\/title>/s)?.[1]??'');
 const description=decode(html.match(/<meta name="description" content="([^"]*)"/)?.[1]??'');
 const body=html.split('<div class="blog-article-body">')[1]?.split('<div class="blog-contact">')[0]??'';const visible=text(body);
 const headings=[...body.matchAll(/<h[23]\b[^>]*>([\s\S]*?)<\/h[23]>/g)].map(match=>text(match[1]));
 const links=[...body.matchAll(/<a\b[^>]*href="([^\"]+)"/g)].map(match=>decode(match[1])).filter(href=>href.startsWith('/')&&!/\.(?:jpg|png|webp|avif|jpeg)(?:\?|$)/i.test(href));
 const approvedTitle=titleChanges[slug]?.title;
 if(approvedTitle){
  const parts=source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  const metadata=parse(parts[1]);
  assert.equal(metadata.title,approvedTitle,`Approved material title: ${slug}`);
  assert.equal(metadata.seoTitle,approvedTitle,`Approved material SEO title: ${slug}`);
  assert.equal(createHash('sha256').update(parts[2]).digest('hex'),titleChanges[slug].bodySha256,`Unchanged material article body: ${slug}`);
 }
 if(originals[slug]){
  // CMS may reorder front matter or edit categories; preserve the original title and body.
  const parts=source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  assert.ok(parts,`Front matter: ${slug}`);
  const metadata=parse(parts[1]);
  assert.equal(metadata.title,approvedTitle??originals[slug].title,`Preserved XML title: ${slug}`);
  assert.equal(metadata.wordpressId,originals[slug].wordpressId,`Preserved WordPress ID: ${slug}`);
  assert.equal(createHash('sha256').update(parts[2]).digest('hex'),(originals[slug].cmsRevision?.bodySha256??originals[slug].bodySha256),`Preserved XML body: ${slug}`);
  assert.equal(text(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1]??''),(approvedTitle??originals[slug].title).replace(/\s+/g,' ').trim());
  audit.push({slug,preservedXml:true,words:visible.split(/\s+/).length});continue;
 }
 const keyword=normalize(item.primaryKeyword);
 assert.ok(approvedTitle?normalize(title).includes(normalize(approvedTitle)):normalize(title).includes(keyword),`Title keyword or approved material title: ${slug}`);assert.ok(normalize(description).includes(keyword),`Description keyword: ${slug}`);
 assert.ok(normalize(visible.slice(0,Math.max(300,visible.length*.1))).includes(keyword),`Opening keyword: ${slug}`);assert.ok(headings.some(heading=>normalize(heading).includes(keyword)),`Heading keyword: ${slug}`);
 assert.ok(new Set(links).size>=2,`Internal context links: ${slug}`);assert.ok(source.includes('editorialReview: "2026-11-04"'));
 assert.ok(!visible.includes('Nội dung bài viết viết bằng Markdown ở đây'));audit.push({slug,primaryKeyword:item.primaryKeyword,words:visible.split(/\s+/).length,internalLinks:new Set(links).size,externalLinks:[...body.matchAll(/<a\b[^>]*href="https?:/g)].length});
}
assert.equal(audit.length,83);
await writeFile('/tmp/blog-editorial-audit.json',JSON.stringify(audit,null,2));
const wards=JSON.parse(await readFile('src/data/hcm-wards.json','utf8'));assert.equal(wards.units.length,168);assert.equal(new Set(wards.units.map(unit=>unit.slug)).size,168);assert.equal(wards.units.filter(unit=>unit.type==='phường').length,113);assert.equal(wards.units.filter(unit=>unit.type==='xã').length,54);
const hub=await readFile('dist/khu-vuc/tp-hcm/index.html','utf8');assert.ok(hub.includes('id="phuong-xa"'));assert.ok(hub.includes('Nghị quyết 1685'));assert.ok(hub.includes('phường Sài Gòn'));assert.ok(hub.includes('xã Thạnh An'));assert.ok(!hub.includes('đặc khu Côn Đảo'));assert.equal((hub.match(/class="hcm-ward-links"/g)||[]).length,22);assert.equal(wards.units.filter(unit=>Boolean(unit.districtSlug)).length,102);assert.ok(hub.includes('class="hcm-old-districts"'));
const header=hub.match(/<nav class="sticky[\s\S]*?<\/nav>/)?.[0]??'';assert.ok(!header.includes('Chọn quận/huyện'));assert.ok(!header.includes('/khu-vuc/tp-hcm#quan-huyen'));
console.log(`Editorial passed: ${audit.length} reviewed posts with original WordPress titles or authorized material titles, unchanged XML bodies, optimized descriptions/openings/headings and contextual links; 102 HCM wards/communes within the former city, old district links and district menu removed.`);

for(const [name,former] of [['An Khánh','Quận 2'],['Bình Trưng','Quận 2'],['Tăng Nhơn Phú','Quận 9'],['Phước Long','Quận 9'],['Tân Định','Quận 1']])assert.equal(wards.units.find(unit=>unit.name===name)?.formerDistrict,former);assert.ok(hub.includes('Quận 2 cũ →'));assert.ok(hub.includes('Quận 9 cũ →'));
