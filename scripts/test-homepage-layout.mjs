import test from 'node:test';
import assert from 'node:assert/strict';
import { splitHomepageAtSection } from '../src/data/homepage-layout.ts';

test('splits at the same section when attributes are reordered or use single quotes',()=>{
  for(const target of ['<section id="cta" aria-labelledby="title">','<section aria-labelledby="title" class="card" id=\'cta\'>']){
    const before='<main><section id="first"><p>Giữ nguyên nội dung</p></section>';
    const after=target+'<h2 id="title">Liên hệ</h2></section></main>';
    const result=splitHomepageAtSection(before+after,'cta');
    assert.equal(result.before,before);assert.equal(result.after,after);
    assert.equal(result.before+result.after,before+after);
  }
});
test('fails safely instead of splitting at -1 when the section is missing',()=>{
  assert.throws(()=>splitHomepageAtSection('<main><p>Original text</p></main>','cta'),/found 0/);
});
test('rejects duplicate insertion sections',()=>{
  assert.throws(()=>splitHomepageAtSection('<section id="cta"></section><section id="cta"></section>','cta'),/found 2/);
});
