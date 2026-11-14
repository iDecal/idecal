const get=(n,k)=>n.attrs?.find(a=>a.name===k)?.value??'';
export function presentHeroMedia(nodes){
 let changed=false;
 for(const img of nodes.filter(n=>n.tagName==='img')){
  const ancestors=[];for(let n=img.parentNode;n;n=n.parentNode)ancestors.push(n);
  const hero=ancestors.find(n=>/(?:^|[\s-])hero(?:[\s-]|$)|compact-page-banner|q2-intro|q3-cover/.test(get(n,'class')));
  const home=get(img,'class').split(' ').includes('gsbp-6d50174');
  if(!hero&&!home)continue;
  const within=hero?ancestors.slice(0,ancestors.indexOf(hero)+1):[];
  const target=within.find(n=>n.attrs?.some(a=>a.name==='data-hero-media'))||within.find(n=>n.tagName==='figure')||within.find(n=>/hero-(image|photo|media)/.test(get(n,'class')))||img;
  if(target.attrs.some(a=>a.name==='data-hero-image-treatment'))continue;
  target.attrs.push({name:'data-hero-image-treatment',value:''});changed=true;
 }
 return changed;
}
