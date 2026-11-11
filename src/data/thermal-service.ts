import {products,productCategories} from './catalogue';
import {productLandings} from './site-offerings';
import {servicePresentation} from './service-presentation';
import {getInstallationPhotos,uploadedServicePhotos} from './installation-photo-links';
import pricing from './service-pricing.json' with {type:'json'};
import {thermalCanonical} from './service-routes';

export {thermalPath,thermalCanonical} from './service-routes';
export const thermalTitle='Dịch vụ dán phim cách nhiệt nhà kính';
export const thermalSeoTitle='Dán phim cách nhiệt nhà kính: dịch vụ & sản phẩm | iDecal';
export const thermalDescription='Tư vấn, cung cấp sản phẩm và thi công phim cách nhiệt nhà kính. Xem mẫu phim, thương hiệu, báo giá 2026 và hình ảnh thi công để chọn phương án phù hợp.';
export const thermalCategory=productCategories.find(item=>item.slug==='phim-cach-nhiet')!;
export const thermalLanding=productLandings.find(item=>item.slug==='phim-cach-nhiet-nha-kinh')!;
export const thermalPresentation=servicePresentation['phim-cach-nhiet'];
const serviceProducts=new Set(thermalPresentation.productSlugs??[]);
export const thermalAllProducts=products.filter(product=>product.category==='phim-cach-nhiet'||thermalLanding.select(product)||serviceProducts.has(product.slug));
export const thermalFilms=thermalAllProducts.filter(product=>!/^bo-dung-cu|safety|ppf/.test(product.slug));
export const thermalSupportProducts=thermalAllProducts.filter(product=>!thermalFilms.includes(product));
export const thermalPricing=pricing.groups.find(group=>group.id==='phim-cach-nhiet')!;
export const thermalPhotos=getInstallationPhotos(uploadedServicePhotos['phim-cach-nhiet']);
export const thermalFaqs=thermalCategory.faqs.slice(0,2);
export const thermalChecks=[
  'Đối chiếu thông số của mã phim được chọn.',
  'Trao đổi sắc phim và độ xuyên sáng.',
  'Xác nhận cách thi công và điều kiện bảo hành theo vật liệu.',
];
export const thermalStructuredData=[
  {'@type':'Service','@id':thermalCanonical+'#service',url:thermalCanonical,name:thermalTitle,description:thermalDescription,serviceType:['Thi công phim cách nhiệt nhà kính','Cung cấp sản phẩm phim cách nhiệt'],provider:{'@id':'https://idecal.vn/#organization'}},
  {'@type':'FAQPage',mainEntity:thermalFaqs.map(item=>({'@type':'Question',name:item.question,acceptedAnswer:{'@type':'Answer',text:item.answer}}))},
];
