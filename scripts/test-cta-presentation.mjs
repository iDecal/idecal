import {test} from 'node:test';
import assert from 'node:assert/strict';
import {parse,serialize} from 'parse5';
import {presentCtaArrows} from './present-cta-arrows.mjs';
const nodes=n=>[n,...(n.childNodes??[]).flatMap(nodes)];
test('Imported nested icons become one CTA arrow, repeated passes are stable',()=>{
 const doc=parse('<main><a class="gspb-buttonbox" href="/contact"><span><span>Nhận báo giá</span><span><svg><path/></svg></span></span></a><a class="contact-order-jump" href="#order">Điền thông tin đặt hàng ↓</a></main>');
 assert.equal(presentCtaArrows(doc,'/'),true);
 const links=nodes(doc).filter(n=>n.tagName==='a');assert.equal(nodes(links[0]).filter(n=>n.tagName==='svg').length,1);assert.equal(nodes(links[1]).filter(n=>n.tagName==='svg').length,0);
 const first=serialize(doc);assert.equal(presentCtaArrows(doc,'/'),false);assert.equal(serialize(doc),first);
});
test('Blog, phone links and breadcrumb controls remain unchanged',()=>{
 for(const path of ['/blog/article/','/']){
 const doc=parse('<main><nav aria-label="Breadcrumb"><a href="/">Trang chủ →</a></nav><a href="tel:0866077040">Gọi ngay →</a></main>');const before=serialize(doc);presentCtaArrows(doc,path);assert.equal(serialize(doc),before);
 }
});

test('A two-button section keeps one upward arrow and uses a warm primary action',()=>{
 const doc=parse('<main><section><div class="actions"><a class="btn" href="/quote">Tư vấn →</a><a class="btn" href="/samples">Xem mẫu →</a></div></section></main>');
 presentCtaArrows(doc,'/service');
 const links=nodes(doc).filter(n=>n.tagName==='a');assert.equal(nodes(links[0]).filter(n=>n.tagName==='svg').length,1);assert.equal(nodes(links[1]).filter(n=>n.tagName==='svg').length,0);assert.match(serialize(doc),/M5 19 19 5/);assert.match(serialize(doc),/data-cta-tone="yellow"/);
});
