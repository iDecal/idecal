import {products,productCategories} from './catalogue';
import {productLandings} from './site-offerings';
import {servicePresentation} from './service-presentation';
import {getInstallationPhotos,uploadedServicePhotos} from './installation-photo-links';
import pricing from './service-pricing.json' with {type:'json'};
import {thermalCanonical} from './service-routes';

export {thermalPath,thermalCanonical} from './service-routes';
export const thermalTitle='Dịch vụ dán phim cách nhiệt nhà kính';
export const thermalSeoTitle='Phim cách nhiệt nhà kính: Mẫu, giá và thi công | iDecal';
export const thermalDescription='Xem giá phim cách nhiệt nhà kính theo m², so sánh mẫu phản gương, khói và sáng. iDecal tư vấn chọn phim theo loại kính, hướng nắng và nhu cầu giữ sáng.';
export const thermalCategory=productCategories.find(item=>item.slug==='phim-cach-nhiet')!;
export const thermalLanding=productLandings.find(item=>item.slug==='phim-cach-nhiet-nha-kinh')!;
export const thermalPresentation=servicePresentation['phim-cach-nhiet'];
const serviceProducts=new Set(thermalPresentation.productSlugs??[]);
export const thermalAllProducts=products.filter(product=>product.category==='phim-cach-nhiet'||thermalLanding.select(product)||serviceProducts.has(product.slug));
export const thermalFilms=thermalAllProducts.filter(product=>!/^bo-dung-cu|safety|ppf/.test(product.slug));
export const thermalSupportProducts=thermalAllProducts.filter(product=>!thermalFilms.includes(product));
export const thermalPricing=pricing.groups.find(group=>group.id==='phim-cach-nhiet')!;
export const thermalPhotos=getInstallationPhotos(uploadedServicePhotos['phim-cach-nhiet']);
export const thermalFaqs=[
  ...thermalCategory.faqs.slice(0,2),
  {
    question:'Kính hướng tây nên chọn phim cách nhiệt loại nào?',
    answer:'So sánh chỉ số tổng năng lượng mặt trời bị loại bỏ (TSER) và độ truyền sáng (VLT) trên cùng loại kính thử nghiệm. Với kính hộp, kính dán hoặc kính Low-E, cần xác nhận mã phim và mặt dán phù hợp trước khi thi công.',
  },
  {
    question:'Dán phim cách nhiệt có làm phòng tối hơn không?',
    answer:'Mức thay đổi ánh sáng phụ thuộc độ truyền sáng (VLT) của cả kính và phim. Nếu cần giữ ánh sáng tự nhiên, hãy so sánh các mã có VLT cao hơn và thử mẫu trên chính ô kính dự kiến dán.',
  },
];
export const thermalSelectionCriteria=[
  {term:'Độ truyền sáng (VLT)', explanation:'Cho biết tỷ lệ ánh sáng nhìn thấy đi qua kính và phim. VLT cao hơn thường giữ phòng sáng hơn.'},
  {term:'Tổng năng lượng mặt trời bị loại bỏ (TSER)', explanation:'Dùng để so sánh khả năng cản tổng năng lượng mặt trời. Hãy đối chiếu thông số được đo trên cùng loại kính.'},
  {term:'Tương thích với kính', explanation:'Cho biết mã phim và mặt dán nào phù hợp với kính đang dùng. Cần kiểm tra kỹ với kính hộp, kính dán và kính Low-E.'},
];
export const thermalChecks=[
  'Đối chiếu thông số của mã phim được chọn.',
  'Trao đổi sắc phim và độ xuyên sáng.',
  'Xác nhận cách thi công và điều kiện bảo hành theo vật liệu.',
];
export const thermalStructuredData=[
  {'@type':'Service','@id':thermalCanonical+'#service',url:thermalCanonical,name:thermalTitle,description:thermalDescription,serviceType:['Thi công phim cách nhiệt nhà kính','Cung cấp sản phẩm phim cách nhiệt'],provider:{'@id':'https://idecal.vn/#organization'}},
  {'@type':'FAQPage',mainEntity:thermalFaqs.map(item=>({'@type':'Question',name:item.question,acceptedAnswer:{'@type':'Answer',text:item.answer}}))},
];
