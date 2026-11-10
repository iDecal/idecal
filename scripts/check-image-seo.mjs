import productData from '../src/data/products.json' with {type:'json'};
import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {parse} from 'parse5';
import {applyImageSeo,imageKey,getProductImageSeo} from '../src/data/image-seo.ts';
const data=JSON.parse(await readFile('src/data/image-seo.json','utf8'));
const metadata=new Map(data.map(image=>[imageKey(image.src),image]));
assert.equal(metadata.size,data.length);
for(const image of data){assert.ok(image.alt.trim());assert.ok(image.title.trim());assert.ok(!/<[^>]+>/.test(image.alt));}
const original='<p>Nội dung gốc &amp; liên kết</p><script>const sample=\'<img src="/test.jpg" alt="Script text">\';</script><img src="/images/idecal-logo.png" alt="Logo cũ"><img src="/decor.svg" alt="" role="presentation">';
const updated=applyImageSeo(original);
assert.ok(updated.includes('<p>Nội dung gốc &amp; liên kết</p>'));
assert.ok(updated.includes('<script>const sample=\'<img src="/test.jpg" alt="Script text">\';</script>'));
assert.ok(updated.includes('<img src="/decor.svg" alt="" role="presentation">'));
assert.equal(applyImageSeo(updated),updated,'Image rewrite must be idempotent');
// Simulate an editor save in memory only; leave all source JSON files unchanged.
const sample=productData[0];const previous=sample.imageMetadata;
try {
 sample.imageMetadata=[{src:sample.images[0],alt:'ALT riêng cho sản phẩm',title:'Tiêu đề ảnh riêng'}];
 const custom=applyImageSeo('<img src="'+sample.images[0]+'" data-image-product="'+sample.slug+'" alt="Ảnh cũ"><button data-image-product="'+sample.slug+'" data-gallery-source="'+sample.images[0]+'"></button>');
 assert.ok(custom.includes('alt="ALT riêng cho sản phẩm"'));
 assert.ok(custom.includes('title="Tiêu đề ảnh riêng"'));
 assert.ok(custom.includes('data-gallery-label="ALT riêng cho sản phẩm"'));
 assert.ok(custom.includes('data-gallery-title="Tiêu đề ảnh riêng"'));
 assert.notEqual(getProductImageSeo(undefined,sample.images[0],'Mặc định').alt,'ALT riêng cho sản phẩm','Other products retain shared metadata');
} finally { if(previous===undefined)delete sample.imageMetadata;else sample.imageMetadata=previous; }
async function files(dir){const output=[];for(const file of await readdir(dir,{withFileTypes:true})){const path=dir+'/'+file.name;if(file.isDirectory())output.push(...await files(path));else if(path.endsWith('.html'))output.push(path);}return output;}
let count=0;const seen=new Set();
for(const file of await files('dist')){
 function visit(node){
  if(node.tagName==='img'){
   const attrs=Object.fromEntries(node.attrs.map(a=>[a.name,a.value]));
   if(attrs.src&&attrs.alt!==''&&attrs.role!=='presentation'&&attrs['aria-hidden']!=='true'){
    assert.ok(attrs.alt?.trim(),`Missing ALT: ${file}: ${attrs.src}`);assert.ok(attrs.title?.trim(),`Missing title: ${file}: ${attrs.src}`);
    const key=imageKey(attrs.src);const original=metadata.get(key);const expected=attrs['data-image-product']?getProductImageSeo(attrs['data-image-product'],attrs.src,attrs.alt):original;
    if(expected){assert.equal(attrs.alt,expected.alt,`Incorrect ALT: ${file}: ${attrs.src}`);assert.equal(attrs.title,expected.title,`Incorrect title: ${file}: ${attrs.src}`);if(original)seen.add(key);}
    count++;
   }
  }
  for(const child of node.childNodes??[])visit(child);
 }
 visit(parse(await readFile(file,'utf8')));
}
assert.ok(count>0);// Replaced images may retain metadata for reuse; validate every rendered image above.
assert.ok(seen.size>0,'Rendered images must use the image metadata registry');
console.log(`Image SEO passed: ${seen.size} unique images, ${count} rendered instances with ALT/title; original text, scripts and decorative images preserved.`);
