interface ServiceCta { title:string; description:string; action:string; bookingService?:string; }
const content:Record<string,ServiceCta>={
 'thiet-ke':{title:'Bạn đã có ý tưởng cho mẫu Decal?',description:'Gửi kích thước, ảnh vị trí dán và nội dung mong muốn để trao đổi bố cục, phạm vi thiết kế và chi phí.',action:'Tư vấn thiết kế'},
 'in-decal':{title:'Cần in Decal theo thiết kế của bạn?',description:'Gửi file, kích thước và số lượng để được tư vấn vật liệu, cách hoàn thiện và báo giá in.',action:'Nhận báo giá in'},
 'cat-decal':{title:'Bạn cần cắt chữ, logo hay họa tiết?',description:'Gửi file hoặc ảnh mẫu cùng kích thước, số lượng để trao đổi phương án gia công phù hợp.',action:'Nhận báo giá cắt'},
 'thi-cong-decal':{title:'Trao đổi phương án cho công trình của bạn',description:'Gửi ảnh hiện trạng, kích thước và địa chỉ để được tư vấn vật liệu, phạm vi thi công và chi phí.',action:'Tư vấn thi công'},
 'decal-dan-kinh-van-phong':{title:'Chọn phương án Decal cho kính văn phòng',description:'Gửi ảnh vách kính, kích thước và logo để trao đổi mức che phủ, bố cục và chi phí thi công.',action:'Tư vấn Decal văn phòng',bookingService:'thi-cong-decal'},
 'phim-cach-nhiet':{title:'Chọn phim phù hợp với kính và hướng nắng',description:'Gửi ảnh kính, kích thước và nhu cầu giữ sáng để được tư vấn mã phim cùng phương án thi công.',action:'Tư vấn phim cách nhiệt',bookingService:'thi-cong-decal'},
 'decal-mo-3d-van-song':{title:'Bạn muốn xem phương án kính vân sóng?',description:'Gửi ảnh không gian và kích thước kính để trao đổi mẫu, chiều vân và vùng dự kiến dán.',action:'Tư vấn mẫu vân sóng',bookingService:'thi-cong-decal'},
 'film-noi-that':{title:'Làm mới bề mặt bằng film nội thất',description:'Gửi ảnh bề mặt, kích thước và mẫu vân mong muốn để được tư vấn vật liệu và cách xử lý nền.',action:'Tư vấn film nội thất',bookingService:'thi-cong-decal'},
 'decal-quang-cao':{title:'Đưa hình ảnh thương hiệu lên vị trí bạn cần',description:'Gửi ảnh vị trí dán, kích thước và file thiết kế để trao đổi vật liệu, cách in và phương án thi công.',action:'Tư vấn Decal quảng cáo',bookingService:'thi-cong-decal'},
};
export function getServiceCta(service?:string){
 const item=service?content[service]:undefined;
 return {...(item??{title:'Bắt đầu từ nhu cầu của bạn',description:'Gửi ảnh, kích thước hoặc file đang có để được tư vấn phần việc phù hợp và chi phí.',action:'Gửi yêu cầu tư vấn'}),href:service?`/lien-he-idecal?dich-vu=${encodeURIComponent(item?.bookingService??service)}#yeu-cau`:'/lien-he-idecal#yeu-cau'};
}
