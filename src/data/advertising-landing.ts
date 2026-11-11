import {productLandings,landingProducts} from './site-offerings';
import {getInstallationPhotos,uploadedServicePhotos} from './installation-photo-links';
import {getServiceCta} from './service-cta';

export const advertisingLanding=productLandings.find(item=>item.slug==='decal-quang-cao')!;
export const advertisingProducts=landingProducts(advertisingLanding);
export const advertisingPhotos=getInstallationPhotos(uploadedServicePhotos['decal-quang-cao']);
export const advertisingQuote=getServiceCta('decal-quang-cao').href;
export const advertisingCanonical='https://idecal.vn/decal-quang-cao/';
export const advertisingServices=[
  {title:'In Decal theo thiết kế',description:'In hình ảnh, thông điệp và nhận diện thương hiệu. Chọn vật liệu, công nghệ in và cách hoàn thiện theo vị trí sử dụng.',href:'/dich-vu/in-decal/',action:'Xem dịch vụ in Decal',image:'/images/in-decal/dich-vu-in-decal.webp',alt:'Minh họa in hình ảnh và tem nhãn trên cuộn vật liệu',width:1176,height:540},
  {title:'Cắt chữ, logo & họa tiết',description:'Gia công chữ và hình theo file thiết kế cho kính, bảng hiệu hoặc bề mặt phù hợp. Thống nhất kích thước và màu vật liệu trước khi cắt.',href:'/dich-vu/cat-decal/',action:'Xem dịch vụ cắt Decal',image:'/images/cat-decal/cat-decal-theo-yeu-cau.webp',alt:'Minh họa máy cắt và vật liệu Decal màu',width:600,height:450},
];
export const advertisingSteps=[
  {title:'Gửi nhu cầu',description:'Gửi ảnh vị trí, kích thước, số lượng và nội dung quảng cáo. Có thể gửi mẫu tham khảo nếu chưa có file.'},
  {title:'Chọn vật liệu, duyệt thiết kế',description:'Thống nhất vật liệu, bố cục, hướng nhìn và chi phí. Kiểm tra nội dung trước khi duyệt sản xuất.'},
  {title:'In, cắt & hoàn thiện',description:'Sản xuất theo bản đã duyệt; thực hiện phần cán màng, cắt hoặc gia công đã thống nhất.'},
  {title:'Thi công & bàn giao',description:'Chuẩn bị bề mặt, dán theo bố cục và kiểm tra hoàn thiện. Lịch thi công được trao đổi theo công trình.'},
];
export const advertisingFaqs=[
  {question:'Nên chọn Decal trong, Decal trắng hay Decal lưới?',answer:'Decal trong phù hợp khi muốn giữ độ trong của kính và phối hình ảnh trên nền kính. Decal trắng tạo nền cho nội dung in, còn Decal lưới thường dùng cho quảng cáo trên hệ kính cần cân nhắc tầm nhìn. Nên gửi ảnh vị trí và nhu cầu nhìn từ hai phía để chọn vật liệu, độ che phủ và cách in phù hợp.'},
  {question:'iDecal có nhận thiết kế, in và thi công cùng một đơn hàng không?',answer:'Bạn có thể chọn riêng phần thiết kế, in, cắt hoặc kết hợp thi công. Phạm vi từng phần việc, bản duyệt, chi phí và lịch thực hiện được thống nhất trước khi sản xuất.'},
  {question:'Cần gửi những gì để nhận báo giá Decal quảng cáo?',answer:'Hãy gửi ảnh vị trí dán, kích thước từng phần, số lượng, địa điểm và thời gian dự kiến. Nếu đã có thiết kế, gửi kèm file; nếu chưa có, chuẩn bị logo, nội dung và mẫu tham khảo. Cho biết vị trí trong nhà hay ngoài trời để trao đổi vật liệu và cách hoàn thiện.'},
  {question:'Báo giá gồm những khoản nào?',answer:'Chi phí phụ thuộc vật liệu, kích thước, số lượng, công nghệ in, cán màng, gia công và điều kiện thi công. Cần xác nhận rõ phần thiết kế, in, tháo lớp cũ, xử lý bề mặt, vận chuyển và thi công có nằm trong báo giá hay được tính riêng. Giá mẫu trong catalogue là giá tham khảo theo quy cách sản phẩm.'},
  {question:'Chưa có file thiết kế thì có đặt làm được không?',answer:'Bạn có thể gửi logo, nội dung cần thể hiện, ảnh vị trí và ý tưởng tham khảo để trao đổi phần thiết kế. Bố cục, kích thước, chính tả và màu sắc cần được kiểm tra trên bản duyệt trước khi chuyển sang in hoặc cắt.'},
  {question:'Decal quảng cáo nên dán mặt trong hay mặt ngoài kính?',answer:'Cách dán phụ thuộc hướng người xem, loại kính, vật liệu và công nghệ in. Dán từ mặt trong có thể cần xử lý chiều hình ảnh và lớp nền khác với dán ngoài. Hai bên cần thống nhất vị trí dán và hướng nhìn trước khi duyệt file để nội dung hiển thị đúng.'},
  {question:'Khi thay quảng cáo, Decal có tháo ra được không?',answer:'Khả năng tháo và lượng keo còn lại phụ thuộc vật liệu, thời gian sử dụng, nền dán và điều kiện tiếp xúc. Nên kiểm tra hiện trạng và thử tại một vị trí nhỏ, nhất là bề mặt sơn hoặc lớp phủ nhạy cảm. Phần tháo lớp cũ và vệ sinh keo cần được trao đổi trong phạm vi công việc.'},
  {question:'Mất bao lâu để sản xuất và thi công?',answer:'Thời gian phụ thuộc việc duyệt thiết kế, số lượng, cách gia công, diện tích và điều kiện tiếp cận vị trí dán. Hãy thông báo mốc khai trương, sự kiện hoặc khung giờ có thể thi công để thống nhất lịch trước khi đặt dịch vụ.'},
];
export const advertisingStructuredData=[
  {'@type':'Service',url:advertisingCanonical,name:'Decal quảng cáo',description:advertisingLanding.description,provider:{'@id':'https://idecal.vn/#organization'}},
  {'@type':'FAQPage',mainEntity:advertisingFaqs.map(item=>({'@type':'Question',name:item.question,acceptedAnswer:{'@type':'Answer',text:item.answer}}))},
];
