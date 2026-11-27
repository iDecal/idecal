import { productCategories } from './catalogue';
import { getInstallationPhotos, uploadedServicePhotos } from './installation-photo-links';
import thermalCopy from './thermal-landing-copy.json';
import thermalFaqs from './thermal-landing-faq.json';
import { thermalCanonical } from './service-routes';

export { thermalPath, thermalCanonical } from './service-routes';
export { thermalCopy, thermalFaqs };
export const thermalTitle = thermalCopy.title;
export const thermalSeoTitle = thermalCopy.seoTitle;
export const thermalDescription = thermalCopy.description;
export const thermalCategory = productCategories.find(item => item.slug === 'phim-cach-nhiet')!;
export const thermalPhotos = getInstallationPhotos(uploadedServicePhotos['phim-cach-nhiet']);

export const thermalStructuredData=[
  {'@type':'Service','@id':thermalCanonical+'#service',url:thermalCanonical,name:thermalTitle,description:thermalDescription,serviceType:['Thi công phim cách nhiệt nhà kính','Cung cấp sản phẩm phim cách nhiệt'],provider:{'@id':'https://idecal.vn/#organization'}},
  {'@type':'FAQPage',mainEntity:thermalFaqs.map(item=>({'@type':'Question',name:item.question,acceptedAnswer:{'@type':'Answer',text:item.answer}}))},
];
