import imageSeo from '../src/data/image-seo.json' with {type:'json'};
const expectedImageAlt=src=>imageSeo.find(image=>image.src===decodeURIComponent(src))?.alt;
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const decode=value=>value.replace(/&#x([0-9a-f]+);/gi,(_,v)=>String.fromCodePoint(parseInt(v,16))).replace(/&#(\d+);/g,(_,v)=>String.fromCodePoint(Number(v))).replaceAll('&amp;','&').replaceAll('&quot;','"').replaceAll('&nbsp;',' ');
const normalize=value=>decode(value).replace(/\s+/g,' ').trim();
const redirects=await readFile('public/_redirects','utf8');const sitemap=await readFile('dist/sitemap.xml','utf8');
for(const number of [1,2,3,4,'tan-binh']){
 const proof=JSON.parse(await readFile(`docs/quan-${number}-original-content.json`,'utf8'));
 const html=await readFile(`dist${new URL(proof.originalUrl).pathname}index.html`,'utf8');
 const className=number==='tan-binh'?'tb':`q${number}`;
 const body=html.match(new RegExp(`<article class="${className}-page">([\\s\\S]*?)<\\/article>`))?.[1];assert.ok(body);
 const visible=normalize(body.replace(/<[^>]*>/g,' '));let cursor=0;
 for(const node of proof.textNodes){const expected=normalize(node);const index=visible.indexOf(expected,cursor);assert.ok(index>=cursor,`Q${number}: missing/reordered original text: ${expected}`);cursor=index+expected.length;}
 for(const id of proof.headingIds)assert.ok(body.includes(`id="${id}"`),`Q${number} heading ${id}`);
 for(const image of proof.images){assert.ok(body.includes(`src="${image.src}"`));assert.ok(body.includes((expectedImageAlt(image.src)??image.alt).replaceAll('&','&amp;').replaceAll('"','&quot;')));}
 assert.ok(normalize(html.match(/<title>(.*?)<\/title>/s)[1]).includes(proof.title));assert.ok(html.includes(`<link rel="canonical" href="${proof.originalUrl}"`));assert.ok(sitemap.includes(`<loc>${proof.originalUrl}</loc>`));
 const originalPath=new URL(proof.originalUrl).pathname;assert.ok(!redirects.split('\n').some(line=>line.startsWith(originalPath+' ')||line.startsWith(originalPath.replace(/\/$/,'')+' ')));
 assert.ok(!body.includes('wp-admin'));assert.ok(!body.includes('fluent_form_ff_form'));assert.ok(!body.includes('local-related-posts'));assert.ok(!body.includes('class="local-photo-projects"'));
 console.log(`Quận ${number} passed: ${proof.textNodes.length} original editorial text blocks, ${proof.images.length} images, original headings/title/canonical and distinct q${number} layout.`);
}

const rules=new Map(redirects.split('\n').filter(line=>line&&!line.startsWith('#')).map(line=>line.split(/\s+/)).map(([source,target])=>[source,target]));
const imported=JSON.parse(await readFile('docs/wordpress-blog-import.json','utf8'));
for(const post of imported.posts){const source=`/blog/${post.slug}/amp`;if(rules.has(source))assert.equal(rules.get(source),`/blog/${post.slug}/`,`Preserve original blog AMP destination: ${post.slug}`);}
