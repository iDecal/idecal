import {parseFragment} from 'parse5';
const get=(n,k)=>n.attrs?.find(a=>a.name===k)?.value??'';
const walk=n=>[n,...(n.childNodes??[]).flatMap(walk)];
const content=n=>n.nodeName==='#text'?n.value:(n.childNodes??[]).map(content).join('');
const horizontal='M5 12h14m-6-6 6 6-6 6';
const setArrow=(icon,d)=>{walk(icon).find(n=>n.tagName==='path').attrs.find(a=>a.name==='d').value=d;};
const svg='<svg class="site-cta-arrow" aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter"><path d="M5 19 19 5M5 5h14v14"/></svg>';
// Presentation only: navigation, forms, filters, contact icons and image controls keep their own symbols.
export function presentCtaArrows(doc,pathname){
 if(/^\/(blog|admin|quan-ly)/.test(pathname))return false;
 const main=walk(doc).find(n=>n.tagName==='main');if(!main)return false;
 let changed=false;const groups=new Map();
 for(const a of walk(main).filter(n=>n.tagName==='a')){
  if(a.attrs?.some(x=>x.name==='data-site-cta'))continue;
  const label=content(a).trim(),cls=get(a,'class'),href=get(a,'href');
  const cardAction=walk(a).find(n=>n.tagName==='span'&&/^(tư vấn|báo giá|xem|đọc|tìm hiểu)/i.test(content(n).trim())&&n.childNodes?.some(c=>c.tagName==='svg'));
  if(!href||href==='#'||/^(tel:|mailto:)/.test(href)||(!cardAction&&walk(a).some(n=>['img','h1','h2','h3','h4'].includes(n.tagName))))continue;
  if(/breadcrumb|pagination|filter|social|category|toc|tab/.test(cls))continue;
  const ancestors=[];for(let n=a.parentNode;n&&n!==main;n=n.parentNode)ancestors.push(n);
  if(ancestors.some(n=>(['nav','form','table'].includes(n.tagName)&&!(/cta|btn|quote/.test(cls)))||/breadcrumb|toc|pagination|filter/.test(get(n,'class'))))continue;
  const explicit=Boolean(cardAction)||/btn|button|cta|read-more|consult|quote|about-link|order-jump/.test(cls)||(/^(xem|đọc|tìm hiểu|khám phá|nhận|liên hệ|tư vấn|trao đổi|chọn mẫu|đặt|gửi|báo giá|điền thông tin)/i.test(label)&&/[→↗↘↓]/.test(label));
  if(!explicit||(!cardAction&&label.length>150)||!label)continue;
  const target=cardAction??a;
  // Each selected CTA has exactly one trailing icon, including imported nested SVG wrappers.
  for(const n of walk(target)){
   if(n.nodeName==='#text')n.value=n.value.replace(/[→↗↘↓]/g,'');
   if(n.tagName==='svg')n.parentNode.childNodes=n.parentNode.childNodes.filter(c=>c!==n);
  }
  const icon=parseFragment(svg).childNodes[0];icon.parentNode=target;target.childNodes.push(icon);
  a.attrs.push({name:'data-site-cta',value:''});changed=true;
  const textAction=Boolean(cardAction)||/product-card-read|solution-button|read-more|blog-read/.test(cls)||ancestors.some(n=>n.tagName==='article'&&(walk(n).some(c=>c.tagName==='img')||/card|solution/.test(get(n,'class'))));
  if(textAction){a.attrs.push({name:'data-cta-text',value:''});setArrow(icon,horizontal);}
  const group=ancestors.find(n=>/actions|buttons/.test(get(n,'class')))||ancestors.find(n=>['article','section'].includes(n.tagName))||a.parentNode;
  if(!groups.has(group))groups.set(group,[]);groups.get(group).push({a,target,icon});
 }
 let index=0;
 for(const buttons of groups.values()){
  if(buttons.length===2){const secondary=buttons[1];setArrow(secondary.icon,horizontal);secondary.a.attrs.push({name:'data-cta-secondary',value:''});}
  for(const [i,{a}] of buttons.entries())if(i===0&&!a.attrs.some(x=>x.name==='data-cta-text')&&(buttons.length===2||index%2===0))a.attrs.push({name:'data-cta-tone',value:'yellow'});
  index++;
 }
 return changed;
}
