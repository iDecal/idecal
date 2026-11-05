import content from './local-area-content.json';
export interface AreaQuestion {question:string;answer:string;}
interface AreaContent {title:string;items:AreaQuestion[];nearby:string[];}
const areas=content as Record<string,AreaContent>;
export function getAreaFaqs(key:string,existing:AreaQuestion[]){
 const area=areas[key];if(!area)throw new Error(`Missing local area content: ${key}`);
 const items=[...existing,...area.items].filter((item,index,list)=>list.findIndex(other=>other.question===item.question)===index);
 return {title:area.title,items};
}
export const areaFaqSchema=(items:AreaQuestion[])=>({'@type':'FAQPage',mainEntity:items.map(item=>({'@type':'Question',name:item.question,acceptedAnswer:{'@type':'Answer',text:item.answer}}))});
export const nearbyAreaKeys=(key:string)=>areas[key]?.nearby??[];
