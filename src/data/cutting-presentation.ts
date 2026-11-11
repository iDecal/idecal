import source from './cutting-original.json';
import previous from './decal-cutting.json';

const destinations=['/blog/decal-phan-quang','/decal-pvc','/decal-mo-dan-kinh'];
// The supplied HTML repeats the same frosted material twice; show it once.
const uniqueMaterials=[...new Map(source.materials.items.map(item=>[item.title,item])).values()];
export const cuttingMaterials=[...uniqueMaterials.map((item,index)=>({...item,href:destinations[index]})),{
  title:'Decal giấy',blocks:[{text:previous.materials[3].text,html:'<p>'+previous.materials[3].text+'</p>'}],href:'/blog/decal-giay',
}];
const relatedLinks:Record<string,string>={
 'Phòng họp kín đáo':'/decal-mo-dan-kinh',
 'Phân chia không gian':'/decal-dan-kinh-van-phong',
 'Giảm nhiệt – tiết kiệm điện':'/phim-cach-nhiet-nha-kinh',
 'Trang trí tường nhà':'/film-dan-noi-that',
 'dán kính văn phòng':'/decal-dan-kinh-van-phong',
};
export const cuttingRelatedSolutions=[...new Set(source.services.items.flatMap(item=>item.labels))].map(label=>({label,href:relatedLinks[label]}));
// Keep the original FAQ answer and add the existing site's practical demi-cut explanation.
export const cuttingFaqs=source.faq.items.map((item,index)=>({...item,clarification:index===1?previous.faqs[1].answer:''}));
