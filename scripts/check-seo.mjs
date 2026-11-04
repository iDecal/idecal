import assert from 'node:assert/strict';
import {readFile,readdir,stat} from 'node:fs/promises';
import path from 'node:path';
const parseSchemas=html=>[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap(match=>{const data=JSON.parse(match[1]);return data['@graph']??[data];});
const readField=(source,key)=>{const line=source.split('\n').find(line=>line.startsWith(key+': '));return line?JSON.parse(line.slice(key.length+2)):undefined;};
let articles=0,customTitles=0,customDescriptions=0;
for(const name of await readdir('src/content/blog')){
 if(!name.endsWith('.md'))continue;
 const source=await readFile('src/content/blog/'+name,'utf8');const html=await readFile('dist/blog/'+name.slice(0,-3)+'/index.html','utf8');
 const schemas=parseSchemas(html);const post=schemas.find(item=>item['@type']==='BlogPosting');assert.ok(post,`Missing BlogPosting ${name}`);
 assert.equal(post.headline,readField(source,'title'));assert.equal(post.inLanguage,'vi-VN');assert.ok(Number.isFinite(Date.parse(post.datePublished)));
 assert.ok(html.includes('property="og:type" content="article"'));assert.ok(html.includes('name="twitter:card" content="summary_large_image"'));
 const title=html.match(/<title>(.*?)<\/title>/)?.[1];assert.match(title,/idecal/i);assert.doesNotMatch(title,/%[a-z_]+%/i);
 const description=html.match(/<meta name="description" content="([^"]*)"/)[1];assert.doesNotMatch(description,/%[a-z_]+%/i);
 if(readField(source,'seoTitle'))customTitles++;if(readField(source,'seoDescription'))customDescriptions++;
 assert.ok(schemas.some(item=>item['@type']==='Organization'));assert.ok(schemas.some(item=>item['@type']==='WebSite'));articles++;
}
assert.equal(articles,83);assert.ok(customTitles>=11);assert.ok(customDescriptions>=22);
const sitemap=await readFile('dist/sitemap.xml','utf8');const index=await readFile('dist/sitemap_index.xml','utf8');const robots=await readFile('dist/robots.txt','utf8');
assert.ok(index.includes('https://idecal.vn/sitemap.xml'));assert.ok(robots.includes('Sitemap: https://idecal.vn/sitemap_index.xml'));
const locations=[...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match=>match[1]);assert.equal(new Set(locations).size,locations.length);assert.ok(locations.length>=237);
assert.ok((sitemap.match(/<image:loc>/g)??[]).length>309);assert.ok(!sitemap.includes('<loc>https://idecal.vn/dat-dich-vu'));
for(const location of locations){const url=new URL(location);assert.equal(url.origin,'https://idecal.vn');const file=path.join('dist',decodeURIComponent(url.pathname),'index.html');assert.ok((await stat(file)).isFile());const html=await readFile(file,'utf8');assert.ok(!/<meta name="robots" content="noindex/.test(html));}
const rules=new Map((await readFile('public/_redirects','utf8')).split('\n').filter(line=>line&&!line.startsWith('#')).map(line=>line.trim().split(/\s+/)).map(parts=>[parts[0],parts[1]]));
const migration=JSON.parse(await readFile('docs/rank-math-applied-redirects.json','utf8'));
for(const [source,target] of Object.entries(migration.addedRules)){assert.equal(rules.get(source),target);assert.ok(!rules.has(target),`Redirect chain at ${source}`);assert.ok((await stat(path.join('dist',target,'index.html'))).isFile());}
assert.equal(migration.rankMathPatterns.length,34);
const legacy=await readFile('dist/dat-dich-vu/index.html','utf8');assert.ok(legacy.includes('name="robots" content="noindex, follow"'));
console.log(`SEO passed: ${articles} BlogPosting schemas; ${customTitles} custom titles; ${customDescriptions} custom descriptions; ${locations.length} sitemap URLs; 34 Rank Math patterns.`);
