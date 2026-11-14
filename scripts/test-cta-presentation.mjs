import {test} from 'node:test';
import assert from 'node:assert/strict';
import {parse,serialize} from 'parse5';
import {presentCtaArrows} from './present-cta-arrows.mjs';
const nodes=n=>[n,...(n.childNodes??[]).flatMap(nodes)];
test('Imported nested icons become one CTA arrow, repeated passes are stable',()=>{
 const doc=parse('<main><a class="gspb-buttonbox" href="/contact"><span><span>Nhận báo giá</span><span><svg><path/></svg></span></span></a><a class="contact-order-jump" href="#order">Điền thông tin đặt hàng ↓</a></main>');
 assert.equal(presentCtaArrows(doc,'/'),true);
 const links=nodes(doc).filter(n=>n.tagName==='a');for(const a of links)assert.equal(nodes(a).filter(n=>n.tagName==='svg').length,1);
 const first=serialize(doc);assert.equal(presentCtaArrows(doc,'/'),false);assert.equal(serialize(doc),first);
});
test('Blog, phone links and breadcrumb controls remain unchanged',()=>{
 for(const path of ['/blog/article/','/']){
 const doc=parse('<main><nav aria-label="Breadcrumb"><a href="/">Trang chủ →</a></nav><a href="tel:0866077040">Gọi ngay →</a></main>');const before=serialize(doc);presentCtaArrows(doc,path);assert.equal(serialize(doc),before);
 }
});
