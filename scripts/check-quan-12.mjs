import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const proof=JSON.parse(await readFile('docs/quan-12-original-content.json','utf8'));
const html=await readFile('dist/vi-tri/decal-dan-kinh-quan-12/index.html','utf8');
const decode=value=>value.replace(/&#x([0-9a-f]+);/gi,(_,v)=>String.fromCodePoint(parseInt(v,16))).replace(/&#(\d+);/g,(_,v)=>String.fromCodePoint(Number(v))).replaceAll('&amp;','&').replaceAll('&quot;','"').replaceAll('&nbsp;',' ');
const normalize=value=>decode(value).replace(/\s+/g,' ').trim();
const body=html.match(/<article class="q12-page">([\s\S]*?)<\/main>/)?.[1];assert.ok(body);
const text=normalize(body.replace(/<[^>]*>/g,' '));let cursor=0;
for(const node of proof.textNodes){const expected=normalize(node);const index=text.indexOf(expected,cursor);assert.ok(index>=cursor,`Missing or reordered original text: ${expected}`);cursor=index+expected.length;}
for(const id of proof.headingIds)assert.ok(html.includes(`id="${id}"`),`Original heading anchor: ${id}`);
assert.ok(html.includes(`<link rel="canonical" href="${proof.originalUrl}"`));
assert.ok(normalize(html.match(/<title>(.*?)<\/title>/s)[1]).includes(proof.title));
assert.ok(html.includes('src="/images/local/decal-dan-kinh-quan-12.jpg"'));assert.ok(html.includes(proof.images[0].alt));
const redirects=await readFile('public/_redirects','utf8');assert.ok(!redirects.split('\n').some(line=>line.startsWith('/vi-tri/decal-dan-kinh-quan-12 ')||line.startsWith('/vi-tri/decal-dan-kinh-quan-12/ ')));assert.ok(redirects.includes('/khu-vuc/tp-hcm/quan-12/ /vi-tri/decal-dan-kinh-quan-12/ 301'));
const sitemap=await readFile('dist/sitemap.xml','utf8');assert.ok(sitemap.includes(`<loc>${proof.originalUrl}</loc>`));assert.ok(!sitemap.includes('<loc>https://idecal.vn/khu-vuc/tp-hcm/quan-12/</loc>'));
console.log(`Quận 12 passed: all ${proof.textNodes.length} original text blocks retained in order, heading anchors/image preserved, ranked URL canonical and migration alias checked.`);
