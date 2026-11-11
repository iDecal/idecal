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

// Existing library photos; illustrative samples are not assigned new client/location claims.
export const cuttingServiceImages=[
 {src:'/images/blog-wordpress/3e08609cc61fda5bc1ed.jpg',alt:'Mẫu chữ Decal trắng thể hiện giờ mở cửa trên kính',width:1024,height:682},
 {src:'/images/print-materials/tem-nhan.jpg',alt:'Mẫu tem nhãn cắt theo đường viền trên tờ Decal',width:1092,height:819},
 {src:'/images/blog-wordpress/dfc0b2db4e9ab6d03f40.webp',alt:'Mẫu họa tiết Decal trang trí cửa kính',width:800,height:1000},
 {src:'/images/cong-trinh-thuc-te/40-decal-logo-xpert.webp',alt:'Logo XPERT trên dải Decal vách kính văn phòng',width:1280,height:584},
];
export const cuttingMaterialImages=[
 {src:'/images/Banner/decal-cat-chu-trang-tri-quang-cao.jpg',alt:'Minh họa gia công chữ Decal theo file thiết kế',caption:'Gia công theo file · tư vấn loại phản quang theo nhu cầu',width:1600,height:898},
 {src:'/images/catalogue/decal-pvc-xam.jpg',alt:'Cuộn Decal PVC màu xám',caption:'Bề mặt Decal PVC màu',width:1000,height:1000},
 {src:'/images/cong-trinh-thuc-te/20-decal-mo-cat-chu-van-phong.webp',alt:'Ứng dụng Decal mờ kết hợp chữ và logo trên cửa kính',caption:'Decal mờ kết hợp chữ và logo',width:1280,height:960},
 {src:'/images/uploads/tem-nhan-logo-in-be.webp',alt:'Tem nhãn giấy hình tròn in logo trên tờ đế',caption:'Tem nhãn giấy in và bế theo mẫu',width:1200,height:1200},
];
