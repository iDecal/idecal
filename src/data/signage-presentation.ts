import {parseFragment,serialize,type DefaultTreeAdapterMap} from 'parse5';
import original from './signage-original.json' with {type:'json'};
import copy from './signage-copy.json' with {type:'json'};
type Node=DefaultTreeAdapterMap['node'];
type Element=DefaultTreeAdapterMap['element'];
export const signageCopy=copy;
const isElement=(node:Node):node is Element=>'tagName' in node;
const children=(node:Node):Node[]=>'childNodes' in node?node.childNodes:[];
const all=(node:Node):Node[]=>[node,...children(node).flatMap(all)];
const nodeText=(node:Node):string=>'value' in node?node.value:children(node).map(nodeText).join('');

export function localizeSignageText(value:string):string {
  return copy.replacements.reduce((text,{from,to})=>text.replaceAll(from,to),value);
}
export function localizeSignageHtml(html:string):string {
  const fragment=parseFragment(html);
  for(const node of all(fragment))if('value' in node)node.value=localizeSignageText(node.value);
  return serialize(fragment);
}

// Preserve imported archives, links and source image metadata.
const protectedFields=new Set(['src','href','id','alt','sourceCanonical','sourceSha256','sourceTitle']);
function present(value:unknown,key=''):unknown {
  if(typeof value==='string')return protectedFields.has(key)?value:key==='html'?localizeSignageHtml(value):localizeSignageText(value);
  if(Array.isArray(value))return value.map(item=>present(item,key));
  if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([name,item])=>[name,present(item,name)]));
  return value;
}
export const signage=present(original) as typeof original;

// One semantic table for every viewport. Explicit roles preserve table semantics
// when mobile styles arrange rows as cards; data-label supplies the note heading.
export function signageTableHtml(html:string):string {
  const fragment=parseFragment(html);
  const elements=all(fragment).filter(isElement);
  const labels=elements.filter(node=>node.tagName==='th').map(nodeText);
  const roles:Record<string,string>={table:'table',thead:'rowgroup',tbody:'rowgroup',tr:'row',th:'columnheader',td:'cell'};
  for(const node of elements) {
    if(roles[node.tagName])node.attrs.push({name:'role',value:roles[node.tagName]});
    if(node.tagName==='tr')node.childNodes.filter(isElement).filter(child=>child.tagName==='td').forEach((cell,index)=>{
      cell.attrs.push({name:'data-label',value:labels[index]});
    });
  }
  return serialize(fragment);
}
