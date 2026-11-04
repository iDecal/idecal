import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
const origin='https://idecal.vn';
const escape=value=>value.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&apos;');
const decode=value=>value.replaceAll('&amp;','&').replaceAll('&quot;','"');
async function walk(dir){const result=[];for(const entry of await readdir(dir,{withFileTypes:true})){const name=path.join(dir,entry.name);if(entry.isDirectory())result.push(...await walk(name));else if(name.endsWith('.html'))result.push(name);}return result;}
const redirectSources=new Set((await readFile('public/_redirects','utf8')).split('\n').filter(line=>line.trim()&&!line.startsWith('#')).map(line=>line.split(/\s+/)[0].replace(/\/$/,'')));
const entries=new Map();
for(const file of await walk('dist')){
 const html=await readFile(file,'utf8');
 if(/<meta\b[^>]*name="robots"[^>]*content="[^"]*noindex/i.test(html))continue;
 const canonical=html.match(/<link\b[^>]*rel="canonical"[^>]*href="([^"]+)"/i)?.[1];if(!canonical)continue;
 const url=new URL(decode(canonical));if(url.origin!==origin||redirectSources.has(url.pathname.replace(/\/$/,'')))continue;
 const main=html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1]??'';
 const candidates=[html.match(/<meta\b[^>]*property="og:image"[^>]*content="([^"]+)"/i)?.[1],...[...main.matchAll(/<img\b[^>]*src="([^"]+)"/gi)].map(match=>match[1])].filter(Boolean);
 const images=[...new Set(candidates.map(src=>new URL(decode(src),origin).href))].filter(src=>new URL(src).origin===origin).slice(0,1000);
 const updated=html.match(/<meta\b[^>]*property="article:modified_time"[^>]*content="([^"]+)"/i)?.[1]??html.match(/<meta\b[^>]*property="article:published_time"[^>]*content="([^"]+)"/i)?.[1];
 entries.set(url.href,{images,updated});
}
const body=[...entries].sort(([a],[b])=>a.localeCompare(b)).map(([url,{images,updated}])=>`  <url><loc>${escape(url)}</loc>${updated?`<lastmod>${escape(updated)}</lastmod>`:''}${images.map(image=>`<image:image><image:loc>${escape(image)}</image:loc></image:image>`).join('')}</url>`).join('\n');
await writeFile('dist/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${body}\n</urlset>\n`);
await writeFile('dist/sitemap_index.xml',`<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><sitemap><loc>${origin}/sitemap.xml</loc></sitemap></sitemapindex>\n`);
console.log(`Sitemap: ${entries.size} canonical pages, including local images.`);
