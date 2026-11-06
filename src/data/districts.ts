import data from './districts.json';
export const districtServiceTypes = {
 office:{title:'Decal kính văn phòng',text:'Dải mờ, logo và chỉ dẫn cho phòng họp, cửa ra vào.',service:'decal-dan-kinh-van-phong',product:'decal-dan-kinh-van-phong',image:'/images/catalogue/decal-mo-ke-soc-ngang.jpg'},
 heat:{title:'Phim cách nhiệt nhà kính',text:'Lựa chọn theo loại kính, hướng nắng và nhu cầu giữ sáng.',service:'phim-cach-nhiet',product:'phim-cach-nhiet-nha-kinh',image:'/images/phim-cach-nhiet/Thi-cong-dan-phim-cach-nhiet-van-phong-cong-ty.webp'},
 ads:{title:'Decal quảng cáo & nhận diện',text:'Hình in, chữ và logo cho cửa hàng hoặc showroom.',service:'decal-quang-cao',product:'decal-quang-cao',image:'/images/print-materials/decal-trong.jpg'},
 interior:{title:'Film dán nội thất',text:'Tư vấn nền và bề mặt film cho cửa, tủ, bàn hoặc quầy.',service:'film-noi-that',product:'film-dan-noi-that',image:'/images/film-noi-that/dan-film-noi-that-mat-ban.jpg'},
} as const;
export interface District {slug:string;name:string;group:string;intro:string;siteNote:string;question:string;answer:string;services:(keyof typeof districtServiceTypes)[];}
export const districts=data as District[];
export const districtGroups=[...new Set(districts.map(item=>item.group))];
export const districtUrl=(slug:string)=>['quan-1','quan-2','quan-12'].includes(slug)?`/vi-tri/decal-dan-kinh-${slug}/`:`/khu-vuc/tp-hcm/${slug}`;
export const districtBookingUrl=(slug:string)=>`/lien-he-idecal?dich-vu=thi-cong-decal&khu-vuc=tp-hcm&dia-ban=${slug}#yeu-cau`;
