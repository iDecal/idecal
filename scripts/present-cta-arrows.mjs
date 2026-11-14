import {parseFragment} from 'parse5';
const get=(n,k)=>n.attrs?.find(a=>a.name===k)?.value??'';
const walk=n=>[n,...(n.childNodes??[]).flatMap(walk)];
const content=n=>n.nodeName==='#text'?n.value:(n.childNodes??[]).map(content).join('');
const svg='<svg class="site-cta-arrow" aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter"><path d="M5 5 19 19M5 19h14V5"/></svg>';
// Presentation only: navigation, forms, filters, contact icons and image controls keep their own symbols.
export function presentCtaArrows(doc,pathname){
 if(/^\/(blog|admin|quan-ly)/.test(pathname))return false;
 const main=walk(doc).find(n=>n.tagName==='main');if(!main)return false;
 let changed=false;
 for(const a of walk(main).filter(n=>n.tagName==='a')){
  if(a.attrs?.some(x=>x.name==='data-site-cta'))continue;
  const label=content(a).trim(),cls=get(a,'class'),href=get(a,'href');
  const cardAction=walk(a).find(n=>n.tagName==='span'&&/^(tư vấn|báo giá|xem|đọc|tìm hiểu)/i.test(content(n).trim())&&n.childNodes?.some(c=>c.tagName==='svg'));
  if(!href||href==='#'||/^(tel:|mailto:)/.test(href)||(!cardAction&&walk(a).some(n=>['img','h1','h2','h3','h4'].includes(n.tagName))))continue;
  if(/breadcrumb|pagination|filter|social|category|toc|tab/.test(cls))continue;
  const ancestors=[];for(let n=a.parentNode;n&&n!==main;n=n.parentNode)ancestors.push(n);
  if(ancestors.some(n=>(['nav','form','table'].includes(n.tagName)&&!(/cta|btn|quote/.test(cls)))||/breadcrumb|toc|pagination|filter/.test(get(n,'class'))))continue;
  const explicit=Boolean(cardAction)||/btn|button|cta|read-more|consult|quote|about-link/.test(cls)||(/^(xem|đọc|tìm hiểu|khám phá|nhận|liên hệ|tư vấn|trao đổi|chọn mẫu|đặt|gửi|báo giá)/i.test(label)&&/[→↗↘↓]/.test(label));
  if(!explicit||(!cardAction&&label.length>150)||!label)continue;
  const target=cardAction??a;
  // Remove only decorative arrow SVGs/text; keep meaningful service icons.
  for(const n of walk(target)){
   if(n.nodeName==='#text')n.value=n.value.replace(/[→↗↘↓]/g,'');
   if(n.tagName==='svg'&&(n.parentNode===target||/arrow/i.test(get(n,'class'))))n.parentNode.childNodes=n.parentNode.childNodes.filter(c=>c!==n);
  }
  const icon=parseFragment(svg).childNodes[0];icon.parentNode=target;target.childNodes.push(icon);
  a.attrs.push({name:'data-site-cta',value:''});changed=true;
 }
 return changed;
}
