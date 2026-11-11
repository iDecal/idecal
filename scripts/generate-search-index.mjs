import {readFile,writeFile} from 'node:fs/promises';
import {parse} from 'parse5';
import products from '../src/data/products.json' with {type:'json'};
const attr=(node,key)=>node.attrs?.find(item=>item.name===key)?.value;
const all=node=>[node,...(node.childNodes??[]).flatMap(all)];
const text=node=>{
 if(['script','style','noscript','svg','dialog'].includes(node.tagName)||attr(node,'hidden')!==undefined||attr(node,'aria-hidden')==='true')return '';
 return node.nodeName==='#text'?node.value:(node.childNodes??[]).map(text).join(' ');
};
const clean=value=>value.replace(/\s+/g,' ').trim();
const sitemap=await readFile('dist/sitemap.xml','utf8');
const locations=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match=>match[1].replaceAll('&amp;','&'));
const entries=[];
for(const location of locations){
 const url=new URL(location);
 if(url.origin!=='https://idecal.vn')continue;
 const pathname=decodeURIComponent(url.pathname);
 const file=pathname.endsWith('.html')?'dist'+pathname:'dist'+pathname.replace(/\/$/,'')+'/index.html';
 const nodes=all(parse(await readFile(file,'utf8')));
 if(nodes.some(node=>node.tagName==='meta'&&attr(node,'name')==='robots'&&/noindex/.test(attr(node,'content')??'')))continue;
 const main=nodes.find(node=>node.tagName==='main');
 const heading=nodes.find(node=>node.tagName==='h1');
 if(!main||!heading)continue;
 const description=attr(nodes.find(node=>node.tagName==='meta'&&attr(node,'name')==='description'),'content')??'';
 const schemas=nodes.filter(node=>node.tagName==='script'&&attr(node,'type')==='application/ld+json').flatMap(node=>{const value=JSON.parse((node.childNodes??[]).map(child=>child.value??'').join(''));return value['@graph']??[value];});
 const isProduct=pathname.startsWith('/san-pham/')&&pathname!=='/san-pham/';
 const category=isProduct?'Sản phẩm':pathname.startsWith('/blog/')&& !pathname.startsWith('/blog/chuyen-muc/')?'Bài viết':pathname.startsWith('/du-an/')&&pathname!=='/du-an/'?'Công trình':pathname.startsWith('/dich-vu/')||schemas.some(schema=>schema['@type']==='Service')?'Dịch vụ':'Nội dung';
 const product=isProduct?products.find(item=>pathname==='/san-pham/'+item.slug+'/'):undefined;
 const keywords=[product?.code,product?.brand,...schemas.flatMap(schema=>Array.isArray(schema.serviceType)?schema.serviceType:[schema.serviceType])].filter(value=>typeof value==='string'&&value.trim());
 entries.push({url:url.pathname,title:clean(text(heading)),description:clean(description),category,keywords:[...new Set(keywords)],searchText:clean(text(main)).slice(0,1800)});
}
await writeFile('dist/search-index.json',JSON.stringify(entries));
console.log('Search index: '+entries.length+' public canonical pages, '+Math.round(Buffer.byteLength(JSON.stringify(entries))/1024)+' KiB.');
