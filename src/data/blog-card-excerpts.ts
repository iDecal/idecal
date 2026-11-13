// Presentation-only introductions; article bodies and SEO descriptions stay intact.
const introductions:Record<string,string>={
  'cach-do-kich-thuoc-kinh-truoc-khi-dat-decal':'Đo từng ô kính, ghi kích thước để đặt Decal vừa vặn với không gian.',
  'cach-thao-decal-dan-kinh-nhanh-sach':'Hướng dẫn bóc Decal kính, làm mềm keo và vệ sinh bề mặt sau tháo.',
  'decal-dan-kinh-mo-huong-dan-toan-tap-a-z-cho-van-phong-nha-o':'Tìm hiểu Decal kính mờ, cách chọn mẫu và ứng dụng cho nhà, văn phòng.',
  'decal-giay':'Giới thiệu Decal giấy, đặc điểm bề mặt và ứng dụng tem nhãn sản phẩm.',
};
export function blogCardExcerpt(id:string,description:string):string {
  if(introductions[id])return introductions[id];
  const words=description.replace(/<[^>]*>/g,' ').trim().split(/\s+/u);
  if(words.length<=15)return words.join(' ');
  return words.slice(0,15).join(' ').replace(/[\s,;:…–—-]+$/u,'')+'…';
}
