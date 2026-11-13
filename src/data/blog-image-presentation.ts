import {parseFragment,type DefaultTreeAdapterMap} from 'parse5';
import sourceCaptions from './blog-image-captions.json';
type Node=DefaultTreeAdapterMap['node'];
const captions=sourceCaptions as Record<string,string[]>;
const normalize=(value:string)=>value.normalize('NFC').replace(/\s+/gu,' ').trim();
const text=(node:Node):string=>'value' in node?node.value:'childNodes' in node?node.childNodes.map(text).join(''):'';
function imageOnly(node:Node):boolean {
  let image=false,valid=true;
  function visit(current:Node){
    if('tagName' in current){
      if(!['img','picture','source','p','a'].includes(current.tagName))valid=false;
      if(current.tagName==='img')image=true;
    }
    if('childNodes' in current)current.childNodes.forEach(visit);
  }
  visit(node);return valid&&image&&!normalize(text(node));
}
/** Recover only captions identified in the original WordPress figures. */
export function presentBlogImages(html:string|undefined,slug:string):string|undefined {
  if(!html||!captions[slug]?.length)return html;
  const expected=new Set(captions[slug].map(normalize));
  const nodes=parseFragment(html,{sourceCodeLocationInfo:true}).childNodes.filter(node=>'tagName' in node);
  const edits:{start:number;end:number;html:string}[]=[];
  for(let index=1;index<nodes.length;index++){
    const caption=nodes[index],image=nodes[index-1];
    if(caption.tagName!=='p'||!expected.has(normalize(text(caption)))||!imageOnly(image))continue;
    const imageLocation=image.sourceCodeLocation,captionLocation=caption.sourceCodeLocation;
    if(!imageLocation||!captionLocation)continue;
    const captionHtml=html.slice(captionLocation.startOffset,captionLocation.endOffset).replace(/^<p\b/u,'<figcaption').replace(/<\/p>$/u,'</figcaption>');
    edits.push({start:imageLocation.startOffset,end:captionLocation.endOffset,html:`<figure class="blog-image-figure">${html.slice(imageLocation.startOffset,imageLocation.endOffset)}${captionHtml}</figure>`});
  }
  return edits.reverse().reduce((result,edit)=>result.slice(0,edit.start)+edit.html+result.slice(edit.end),html);
}
