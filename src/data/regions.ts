import { updatedRegionalContent } from './regional-content';

export interface Region {
  slug: string;
  name: string;
  shortName: string;
  theme: string;
  description: string;
  introduction: string[];
  needs: { title: string; description: string }[];
  serviceSlugs: (keyof typeof regionalServices)[];
  areas: string[];
  planning: { title: string; description: string }[];
  faqs: { question: string; answer: string }[];
  projectIds: string[];
}

export const regionalServices = {
  'decal-dan-kinh-van-phong': {
    name: 'Decal dán kính văn phòng',
    description: 'Decal mờ, cắt logo và đường chỉ trang trí cho vách kính, phòng họp, cửa ra vào; cân đối giữa riêng tư và ánh sáng.',
  },
  'phim-cach-nhiet': {
    name: 'Phim cách nhiệt nhà kính',
    description: 'Tư vấn phim theo hướng nắng, loại kính và độ xuyên sáng mong muốn, phù hợp cho nhà ở, văn phòng và không gian kinh doanh.',
  },
  'decal-quang-cao': {
    name: 'Decal quảng cáo & nhận diện',
    description: 'Thiết kế, in và thi công decal mặt tiền, decal lưới, logo và thông tin thương hiệu cho cửa hàng, showroom, phòng khám.',
  },
  'film-noi-that': {
    name: 'Film dán nội thất',
    description: 'Tư vấn làm mới cửa, tủ, quầy và các bề mặt phù hợp bằng film vân gỗ, vân đá, vân kim loại hoặc đơn sắc.',
  },
  'cat-decal': {
    name: 'Cắt chữ & logo decal',
    description: 'Cắt chữ, logo, giờ mở cửa và thông tin chỉ dẫn theo kích thước thực tế; kiểm tra độ rõ khi đọc và màu sắc trên nền dán.',
  },
  'decal-mo-3d-van-song': {
    name: 'Decal mờ 3D vân sóng',
    description: 'Tạo điểm nhấn cho vách kính, cửa kính và không gian tiếp khách bằng họa tiết vân sóng; chọn quy cách theo thiết kế tổng thể.',
  },
};

export const regions: Region[] = [
  {
    slug: 'tp-hcm', name: 'TP. Hồ Chí Minh', shortName: 'TP.HCM',
    theme: 'Văn phòng · Cửa hàng · Không gian sống',
    description: 'Tư vấn Decal dán kính, phim cách nhiệt và film nội thất tại TP.HCM theo phường/xã hiện tại. Đối chiếu địa danh cũ và gửi hiện trạng để trao đổi phương án.',
    introduction: [
      'Vách kính trong văn phòng, mặt tiền cửa hàng và cửa sổ căn hộ cần những giải pháp khác nhau. Tại TP.HCM, iDecal tiếp nhận nhu cầu dán decal mờ, trang trí nhận diện và tư vấn phim cách nhiệt theo đặc điểm từng không gian.',
      'Với văn phòng đang hoạt động hoặc cửa hàng có giờ kinh doanh cố định, việc thống nhất mẫu, khung giờ tiếp cận mặt bằng và trình tự thi công giúp hạn chế ảnh hưởng đến sinh hoạt. Bạn có thể gửi ảnh hiện trạng và kích thước sơ bộ trước khi trao đổi lịch khảo sát.',
    ],
    needs: [
      { title: 'Phòng họp riêng tư, vẫn đón sáng', description: 'Chọn cao độ dán mờ theo vị trí ngồi và tầm nhìn qua vách kính. Có thể kết hợp cắt logo hoặc đường chỉ để đồng bộ nhận diện văn phòng.' },
      { title: 'Mặt tiền dễ nhận biết', description: 'Sắp xếp logo, tên thương hiệu và thông tin liên hệ trên kính cửa hàng. Cân đối diện tích quảng cáo với phần kính cần giữ thông thoáng.' },
      { title: 'Căn hộ và nhà phố hướng nắng', description: 'Đánh giá hướng cửa, loại kính và thời điểm chói nắng trước khi chọn phim. So sánh độ sáng và màu phim thay vì chỉ nhìn mẫu trên cuộn.' },
    ],
    serviceSlugs: ['decal-dan-kinh-van-phong', 'phim-cach-nhiet', 'decal-quang-cao'],
    areas: ['Khu vực trung tâm', 'Thủ Đức và khu Đông', 'Khu Nam Sài Gòn', 'Các khu dân cư, văn phòng lân cận'],
    planning: [
      { title: 'Làm việc với ban quản lý tòa nhà', description: 'Với mặt bằng trong tòa nhà hoặc chung cư, cần xác nhận giờ thi công, quy định vận chuyển vật tư và điều kiện sử dụng thang máy trước khi chốt lịch.' },
      { title: 'Kiểm tra phim và keo dán cũ', description: 'Ảnh chụp cận bề mặt giúp nhận diện lớp phim cũ, mép bong hoặc vết keo cần xử lý. Phần tháo gỡ và vệ sinh nên được tách rõ trong báo giá.' },
    ],
    faqs: [
      { question: 'Có thể dán decal cho văn phòng đang làm việc không?', answer: 'Có thể trao đổi phương án chia khu vực hoặc chọn khung giờ phù hợp với hoạt động của văn phòng. Lịch cụ thể phụ thuộc diện tích, hiện trạng và quy định của tòa nhà.' },
      { question: 'Nên chọn decal mờ hay phim cách nhiệt cho kính văn phòng?', answer: 'Decal mờ phục vụ nhu cầu che tầm nhìn và trang trí; phim cách nhiệt được lựa chọn theo nhu cầu kiểm soát nắng, chói và ánh sáng. Gửi ảnh và mục đích sử dụng để được tư vấn đúng hạng mục.' },
      { question: 'Gửi gì để nhận báo giá tại TP.HCM?', answer: 'Bạn nên gửi địa chỉ, ảnh toàn cảnh kính, số ô kính, kích thước dự kiến và mẫu mong muốn qua Zalo 0866.077.040. iDecal sẽ trao đổi thêm các điều kiện cần thiết trước khi chốt phương án.' },
    ],
    projectIds: ['in-an-thi-cong-decal-dfcare-quan-9', 'toyota-showroom'],
  },
  {
    slug: 'vung-tau', name: 'Vũng Tàu', shortName: 'Vũng Tàu',
    theme: 'Nhà ven biển · Lưu trú · Cửa hàng',
    description: 'Giải pháp decal kính, phim cách nhiệt và film nội thất cho nhà ở, homestay, khách sạn, cửa hàng tại Vũng Tàu. Trao đổi mẫu và kế hoạch thi công với iDecal.',
    introduction: [
      'Không gian lưu trú, quán cà phê và nhà ở tại Vũng Tàu thường cần giữ vẻ thoáng sáng của kính, đồng thời tạo sự riêng tư và nhận diện riêng. Decal trang trí và phim cách nhiệt nên được lựa chọn theo vị trí lắp đặt, hướng nắng và nhu cầu sử dụng thực tế.',
      'Với mặt bằng gần biển, điều kiện tiếp xúc nắng, gió và độ ẩm cần được trao đổi ngay từ đầu. iDecal tiếp nhận ảnh và thông tin công trình để tư vấn vật liệu, cách xử lý bề mặt và kế hoạch triển khai phù hợp.',
    ],
    needs: [
      { title: 'Lưu trú riêng tư, không bí sáng', description: 'Cân nhắc decal mờ cho kính phòng tắm, vách ngăn hoặc cửa nhìn trực diện sang không gian khác. Chọn mức che phủ theo vị trí và điều kiện ánh sáng.' },
      { title: 'Giảm chói cho mặt kính đón nắng', description: 'Tư vấn phim theo hướng mặt tiền, nhu cầu nhìn ra ngoài và màu sắc mong muốn. Phim cần được đánh giá với loại kính hiện hữu trước khi lựa chọn.' },
      { title: 'Làm mới quầy và nội thất', description: 'Film nội thất có thể là phương án cho cửa, tủ hoặc quầy có bề mặt còn phù hợp. Cần kiểm tra độ phẳng, độ khô và tình trạng lớp nền trước khi dán.' },
    ],
    serviceSlugs: ['phim-cach-nhiet', 'film-noi-that', 'decal-dan-kinh-van-phong'],
    areas: ['Khu Bãi Trước', 'Khu Bãi Sau', 'Khu Chí Linh', 'Khu Long Sơn và lân cận'],
    planning: [
      { title: 'Phân biệt kính trong nhà và ngoài trời', description: 'Vật liệu và điều kiện thi công khác nhau tùy mặt dán. Hãy cho biết bề mặt có thường xuyên tiếp xúc trực tiếp với nước, gió hoặc nắng hay không để chọn phương án thích hợp.' },
      { title: 'Sắp xếp theo lịch đón khách', description: 'Với khách sạn và homestay, nên trao đổi khung giờ trống phòng hoặc chia từng khu vực. Thời gian tiếp cận và vệ sinh bề mặt được tính trong kế hoạch thực hiện.' },
    ],
    faqs: [
      { question: 'Kính gần biển nên chọn vật liệu như thế nào?', answer: 'Cần xem vị trí trong hay ngoài nhà, mức tiếp xúc độ ẩm, tình trạng kính và mục đích sử dụng. iDecal tư vấn theo thông tin thực tế; không nên dùng cùng một loại decal cho mọi bề mặt.' },
      { question: 'Có thể dán phim mà vẫn giữ tầm nhìn ra biển không?', answer: 'Có những lựa chọn phim với độ xuyên sáng và sắc độ khác nhau. Việc chọn mẫu cần cân đối khả năng nhìn ra ngoài, độ chói và yêu cầu riêng tư; nên xem mẫu trên kính ở các thời điểm khác nhau.' },
      { question: 'Lịch khảo sát tại Vũng Tàu được sắp xếp ra sao?', answer: 'Gửi địa chỉ, quy mô và thời điểm mong muốn để iDecal kiểm tra phương án triển khai. Lịch khảo sát, điều kiện di chuyển và các khoản chi phí liên quan sẽ được trao đổi trước khi xác nhận.' },
    ],
    projectIds: [],
  },
  {
    slug: 'dong-nai', name: 'Đồng Nai', shortName: 'Đồng Nai',
    theme: 'Văn phòng nhà xưởng · Showroom · Nhà ở',
    description: 'Tư vấn decal văn phòng, logo kính và phim cách nhiệt tại Đồng Nai. Giải pháp cho văn phòng nhà xưởng, showroom, cửa hàng và nhà ở cùng iDecal.',
    introduction: [
      'Văn phòng trong nhà xưởng, showroom và cửa hàng tại Đồng Nai cần vừa rõ nhận diện, vừa phù hợp hoạt động hằng ngày. Decal mờ, chữ cắt và phim cách nhiệt là những hạng mục có thể phối hợp theo từng vị trí kính.',
      'Với mặt bằng doanh nghiệp, việc làm rõ quy trình ra vào, yêu cầu an toàn và khu vực có thể thi công giúp xây dựng phương án thực tế. iDecal tiếp nhận bản vẽ hoặc hình ảnh để trao đổi vật liệu, thiết kế và khối lượng trước khi thống nhất lịch.',
    ],
    needs: [
      { title: 'Vách kính văn phòng trong nhà xưởng', description: 'Decal mờ giúp phân tách khu làm việc, phòng họp và khu tiếp khách. Có thể bố trí logo, đường chỉ hoặc tên phòng để dễ nhận diện chức năng.' },
      { title: 'Kính mặt tiền showroom', description: 'Kết hợp thông tin thương hiệu với phần kính trưng bày cần giữ thoáng. Bản thiết kế nên kiểm tra từ tầm nhìn của người đi đường lẫn khách đứng gần cửa.' },
      { title: 'Phòng làm việc chịu nắng', description: 'Chọn phim theo hướng nắng và loại kính, đồng thời cân nhắc ánh sáng cần thiết cho công việc. Cần khảo sát điều kiện tiếp cận khi kính ở vị trí cao.' },
    ],
    serviceSlugs: ['decal-dan-kinh-van-phong', 'cat-decal', 'phim-cach-nhiet'],
    areas: ['Biên Hòa', 'Long Thành', 'Nhơn Trạch', 'Trảng Bom và khu vực lân cận'],
    planning: [
      { title: 'Thống nhất yêu cầu ra vào nhà xưởng', description: 'Doanh nghiệp nên cung cấp yêu cầu đăng ký nhân sự, khung giờ được làm việc và quy định an toàn liên quan đến khu vực thi công.' },
      { title: 'Chia khối lượng theo khu vực', description: 'Với nhiều phòng hoặc nhiều dãy kính, bảng thống kê từng khu giúp đối chiếu kích thước, loại vật liệu và khối lượng nghiệm thu rõ ràng hơn.' },
    ],
    faqs: [
      { question: 'Có thể thi công theo từng khu của văn phòng nhà xưởng không?', answer: 'Có thể trao đổi cách chia giai đoạn để phù hợp hoạt động của doanh nghiệp. Thứ tự thực hiện cần dựa trên mặt bằng, thời gian được tiếp cận và khả năng bố trí khu vực làm việc.' },
      { question: 'Logo công ty cần gửi file gì?', answer: 'Ưu tiên file vector như AI, SVG hoặc PDF có đường nét rõ. Nếu chỉ có ảnh, hãy gửi bản có độ phân giải tốt để kiểm tra khả năng dựng lại và thống nhất thiết kế trước khi sản xuất.' },
      { question: 'Báo giá công trình tại Đồng Nai gồm những phần nào?', answer: 'Các phần cần làm rõ gồm vật liệu, thiết kế nếu có, sản xuất, tháo gỡ lớp cũ, thi công và điều kiện tiếp cận. Chi phí di chuyển hoặc yêu cầu đặc biệt được trao đổi theo địa chỉ thực tế.' },
    ],
    projectIds: [],
  },
  {
    slug: 'nha-trang', name: 'Nha Trang', shortName: 'Nha Trang',
    theme: 'Khách sạn · Homestay · Không gian dịch vụ',
    description: 'Tư vấn decal kính, film nội thất và phim cách nhiệt tại Nha Trang. Giải pháp trang trí cho khách sạn, homestay, spa, quán cà phê và cửa hàng.',
    introduction: [
      'Với khách sạn, homestay, spa hoặc quán cà phê tại Nha Trang, bề mặt kính và nội thất góp phần tạo cảm nhận đầu tiên của khách hàng. Decal trang trí nên thống nhất với phong cách không gian, đồng thời đáp ứng nhu cầu riêng tư và vệ sinh hằng ngày.',
      'iDecal tiếp nhận nhu cầu làm mới vách kính, nhận diện mặt tiền và các bề mặt nội thất phù hợp. Khi gửi thông tin, bạn nên kèm ảnh tổng thể, ảnh cận bề mặt và lịch hoạt động để trao đổi phương án triển khai tại Nha Trang.',
    ],
    needs: [
      { title: 'Vách ngăn trong spa và lưu trú', description: 'Chọn decal mờ hoặc vân sóng cho khu cần che tầm nhìn; cân nhắc cao độ dán và bố cục họa tiết để giữ sự nhẹ nhàng cho không gian.' },
      { title: 'Làm mới quầy lễ tân và cửa tủ', description: 'Film nội thất giúp thay đổi cảm giác bề mặt mà không nhất thiết thay toàn bộ đồ dùng. Tình trạng nền, mép cạnh và vị trí thường xuyên tiếp xúc nước cần được kiểm tra.' },
      { title: 'Nhận diện mặt tiền cửa hàng', description: 'Logo, tên thương hiệu và giờ hoạt động được bố trí theo kích thước kính. Ưu tiên nội dung dễ đọc, giữ các khoảng trống cần thiết cho trưng bày và đón sáng.' },
    ],
    serviceSlugs: ['film-noi-that', 'decal-mo-3d-van-song', 'decal-quang-cao'],
    areas: ['Khu trung tâm Nha Trang', 'Khu ven biển Trần Phú', 'Vĩnh Hải và Vĩnh Hòa', 'Phước Hải và khu vực lân cận'],
    planning: [
      { title: 'Đồng bộ mẫu với thiết kế không gian', description: 'Ảnh vật liệu đang có, màu sơn, ánh sáng và mẫu nhận diện giúp lựa chọn màu film hoặc decal phù hợp hơn so với xem riêng một bảng mẫu.' },
      { title: 'Lên phương án theo công suất sử dụng', description: 'Với cơ sở lưu trú, cần thống nhất thứ tự các phòng, thời gian bàn giao và điều kiện vệ sinh sau thi công để phối hợp với lịch đón khách.' },
    ],
    faqs: [
      { question: 'Decal vân sóng có phù hợp vách ngăn spa không?', answer: 'Có thể cân nhắc khi cần hiệu ứng trang trí và che tầm nhìn tương đối. Mức riêng tư phụ thuộc mẫu, khoảng cách và ánh sáng, vì vậy nên trao đổi yêu cầu cụ thể trước khi chọn vật liệu.' },
      { question: 'Có thể dán film lên nội thất cũ trong homestay không?', answer: 'Cần xem nền có phẳng, khô, chắc và còn bám dính tốt hay không. Bề mặt bong tróc, ẩm hoặc hư hỏng cần được đánh giá và xử lý trước; không phải mọi món đồ đều phù hợp để dán.' },
      { question: 'Công trình Nha Trang cần chuẩn bị thông tin gì để lên lịch?', answer: 'Gửi vị trí, số phòng hoặc số khu vực, kích thước, ảnh bề mặt và thời điểm mong muốn. iDecal trao đổi kế hoạch, điều kiện triển khai và chi phí liên quan trước khi chốt lịch.' },
    ],
    projectIds: [],
  },
  {
    slug: 'quy-nhon', name: 'Quy Nhơn', shortName: 'Quy Nhơn',
    theme: 'Nhà phố · Quán cà phê · Lưu trú',
    description: 'Giải pháp decal trang trí, nhận diện cửa hàng và phim cách nhiệt tại Quy Nhơn. Trao đổi nhu cầu cho nhà phố, quán cà phê, homestay và văn phòng với iDecal.',
    introduction: [
      'Với quán cà phê ven đường Xuân Diệu hoặc cơ sở lưu trú ở Ghềnh Ráng, decal có thể tạo điểm nhận diện ở cửa mà vẫn dành khoảng kính cho cảnh quan. Phần phim giảm chói nên chọn theo hướng nắng và chỗ ngồi thực tế.',
      'Nhà phố, quán cà phê và cơ sở lưu trú tại Quy Nhơn có thể sử dụng decal để làm rõ phong cách mà vẫn giữ sự gọn gàng của mặt kính. Một phương án phù hợp cần xem đồng thời ánh sáng, tầm nhìn, màu nền và nội dung muốn thể hiện.',
      'iDecal tư vấn từ decal mờ tạo riêng tư, cắt chữ thương hiệu đến phim cách nhiệt cho các ô kính đón nắng. Hình ảnh hiện trạng và thông tin sử dụng giúp xác định hạng mục cần ưu tiên thay vì lựa chọn vật liệu chỉ theo tên gọi.',
    ],
    needs: [
      { title: 'Cửa hàng dễ nhận diện từ bên ngoài', description: 'Cắt chữ tên thương hiệu, giờ mở cửa hoặc logo theo tỷ lệ mặt kính. Hạn chế dồn quá nhiều thông tin để khách dễ đọc và nhận biết lối vào.' },
      { title: 'Nhà ở và homestay cần sự kín đáo', description: 'Tư vấn decal mờ cho cửa phòng, vách ngăn hoặc kính nhìn sang nhà bên cạnh. Chọn phạm vi che phủ theo nhu cầu sinh hoạt và nguồn sáng.' },
      { title: 'Không gian ngồi cạnh kính', description: 'Đánh giá nắng chói và hướng kính để lựa chọn phim phù hợp cho khu tiếp khách hoặc bàn làm việc. Chú ý độ sáng sau dán và màu nhìn từ trong ra ngoài.' },
    ],
    serviceSlugs: ['cat-decal', 'decal-dan-kinh-van-phong', 'phim-cach-nhiet'],
    areas: ['Khu trung tâm Quy Nhơn', 'Khu Nguyễn Tất Thành', 'Ghềnh Ráng', 'Nhơn Hội và lân cận'],
    planning: [
      { title: 'Xem mẫu theo ánh sáng thực tế', description: 'Màu sắc và độ mờ có thể tạo cảm nhận khác nhau dưới nắng, đèn vàng hoặc đèn trắng. Ảnh chụp không gian vào thời điểm sử dụng chính giúp tư vấn sát hơn.' },
      { title: 'Kiểm tra điều kiện tiếp cận mặt kính', description: 'Cần cho biết kính nằm ở tầng nào, có vật cản hoặc phần kính ngoài tầm với hay không. Những yếu tố này ảnh hưởng cách thi công và khối lượng chuẩn bị.' },
    ],
    faqs: [
      { question: 'Quán cà phê nhỏ nên dùng decal toàn mặt kính hay cắt chữ?', answer: 'Tùy mức độ che phủ và thông điệp cần thể hiện. Cắt chữ thường giữ nhiều khoảng kính thoáng; decal in hoặc decal mờ phù hợp khi cần thêm hình ảnh, bố cục hoặc che tầm nhìn.' },
      { question: 'Decal mờ có chống nóng thay phim cách nhiệt không?', answer: 'Decal mờ chủ yếu phục vụ trang trí và che tầm nhìn. Nếu ưu tiên kiểm soát nắng nóng, cần trao đổi riêng về phim cách nhiệt và loại kính hiện có để chọn đúng giải pháp.' },
      { question: 'Làm sao trao đổi phương án cho công trình ở Quy Nhơn?', answer: 'Gửi ảnh, địa chỉ và nhu cầu qua Zalo 0866.077.040. iDecal sẽ làm rõ thiết kế, vật liệu, khối lượng và khả năng sắp xếp lịch trước khi xác nhận triển khai.' },
    ],
    projectIds: [],
  },
  {
    slug: 'binh-duong', name: 'Bình Dương', shortName: 'Bình Dương',
    theme: 'Văn phòng doanh nghiệp · Nhà xưởng · Showroom',
    description: 'Tư vấn thi công decal kính, nhận diện showroom và phim cách nhiệt tại Bình Dương. Giải pháp cho doanh nghiệp, văn phòng nhà xưởng và cửa hàng từ iDecal.',
    introduction: [
      'Văn phòng doanh nghiệp, nhà xưởng và showroom ở khu vực Bình Dương cần những hạng mục vừa có tính nhận diện, vừa phù hợp vận hành. Decal mờ phân chia phòng làm việc, logo dán kính và decal mặt tiền có thể được thiết kế theo cùng một bộ nhận diện.',
      'iDecal tiếp nhận nhu cầu tại các khu vực Dĩ An, Thuận An, Thủ Dầu Một và lân cận. Với mặt bằng có nhiều ô kính hoặc nhiều khu chức năng, nên gửi bản vẽ và thống kê sơ bộ để trao đổi phương án vật liệu, sản xuất và thi công.',
    ],
    needs: [
      { title: 'Nhận diện đồng bộ cho showroom', description: 'Bố trí decal lưới, decal in hoặc chữ cắt theo mặt tiền và diện tích trưng bày. Thống nhất màu nhận diện và bản thiết kế trước khi sản xuất.' },
      { title: 'Văn phòng trong khu sản xuất', description: 'Decal mờ giúp phân chia không gian làm việc và phòng họp; có thể bổ sung tên phòng, logo và đường chỉ để tạo sự nhất quán giữa các khu.' },
      { title: 'Phòng tiếp khách và nhà phố', description: 'Tư vấn phim cách nhiệt cho cửa kính đón nắng theo điều kiện thực tế, cân đối giữa độ sáng, sắc độ và mục đích sử dụng của từng phòng.' },
    ],
    serviceSlugs: ['decal-quang-cao', 'decal-dan-kinh-van-phong', 'phim-cach-nhiet'],
    areas: ['Dĩ An và Thuận An', 'Thủ Dầu Một', 'Bến Cát và Tân Uyên', 'Khu VSIP, Sóng Thần, Mỹ Phước và lân cận'],
    planning: [
      { title: 'Đối chiếu mẫu với bộ nhận diện', description: 'Với showroom hoặc chuỗi cửa hàng, cần kiểm tra file logo, màu thương hiệu, vị trí ghép và tỷ lệ hình ảnh trên từng ô kính trước khi duyệt.' },
      { title: 'Tách rõ phần tháo gỡ và phần dán mới', description: 'Showroom đang sử dụng có thể có decal quảng cáo cũ hoặc lớp keo lưu lại. Ảnh hiện trạng giúp làm rõ khâu xử lý bề mặt và thống nhất phạm vi công việc.' },
    ],
    faqs: [
      { question: 'Decal lưới và decal mờ khác nhau thế nào khi dán showroom?', answer: 'Decal lưới thường phục vụ hình ảnh quảng cáo trên kính; decal mờ ưu tiên che tầm nhìn và trang trí. Phương án cụ thể phụ thuộc vị trí kính, ánh sáng, nội dung in và nhu cầu trưng bày.' },
      { question: 'Có hồ sơ công trình nào tại Bình Dương để tham khảo không?', answer: 'Bạn có thể xem công trình decal dán kính showroom GEELY Bình Dương trong mục Công trình thực tế. Hình ảnh và thông tin tại đó giúp tham khảo cách sử dụng decal cho mặt tiền showroom.' },
      { question: 'Làm nhiều ô kính có được báo giá theo tổng khối lượng không?', answer: 'iDecal có thể lập báo giá theo bảng kích thước và hạng mục. Tổng diện tích, cách chia ô, loại vật liệu, công xử lý nền và điều kiện thi công đều cần được làm rõ trước khi chốt giá.' },
    ],
    projectIds: ['decal-dan-kinh-geely-binh-duong'],
  },
  {
    slug: 'da-nang', name: 'Đà Nẵng', shortName: 'Đà Nẵng',
    theme: 'Văn phòng · Khách sạn · Thương hiệu dịch vụ',
    description: 'Tư vấn decal kính, film dán nội thất và nhận diện cửa hàng tại Đà Nẵng. Giải pháp cho văn phòng, khách sạn và không gian dịch vụ; trao đổi kế hoạch cùng iDecal.',
    introduction: [
      'Từ cửa hàng gần cầu Rồng đến không gian lưu trú quanh biển Mỹ Khê, mỗi mặt kính có một vai trò khác nhau. Có thể giữ mặt tiền gọn với logo, dùng mờ cho vách cần riêng tư và xem mẫu phim riêng ở cửa sổ đón nắng.',
      'Văn phòng, khách sạn và cửa hàng dịch vụ ở Đà Nẵng thường cần giữ sự sáng thoáng nhưng vẫn có điểm nhấn thương hiệu. Decal kính, film nội thất và chữ cắt có thể được phối hợp để làm mới không gian theo một ngôn ngữ thiết kế thống nhất.',
      'iDecal tiếp nhận thông tin công trình để tư vấn phương án và điều kiện triển khai tại Đà Nẵng. Với mặt bằng đang hoạt động, hãy chia sẻ giờ kinh doanh, khu vực ưu tiên và tiến độ mong muốn để trao đổi kế hoạch phù hợp.',
    ],
    needs: [
      { title: 'Không gian làm việc rõ nhận diện', description: 'Kết hợp logo và decal mờ trên phòng họp, cửa kính và khu tiếp khách. Thiết kế cần thống nhất tỷ lệ, khoảng trống và cao độ dán giữa các mặt kính.' },
      { title: 'Làm mới nội thất dịch vụ', description: 'Cân nhắc film dán cho quầy lễ tân, cửa hoặc tủ có nền phù hợp. Chọn họa tiết gắn với ánh sáng và các vật liệu đang có trong không gian.' },
      { title: 'Mặt tiền quảng cáo dễ đọc', description: 'Làm rõ tên thương hiệu, sản phẩm hoặc dịch vụ chính bằng decal in và cắt chữ. Hình ảnh trên kính nên được cân đối với tầm nhìn của khách từ ngoài đường.' },
    ],
    serviceSlugs: ['decal-dan-kinh-van-phong', 'film-noi-that', 'decal-quang-cao'],
    areas: ['Khu Hải Châu', 'Khu Thanh Khê', 'Khu Sơn Trà và Ngũ Hành Sơn', 'Khu Liên Chiểu, Cẩm Lệ và lân cận'],
    planning: [
      { title: 'Ưu tiên thử bố cục trên ảnh mặt bằng', description: 'Ảnh thẳng mặt kính kèm kích thước giúp kiểm tra độ rõ của logo, vị trí đường chỉ và sự liên tục của họa tiết trước khi sản xuất.' },
      { title: 'Làm rõ kế hoạch cho công trình ngoài khu vực gần', description: 'Địa chỉ, khối lượng và tiến độ giúp trao đổi khả năng bố trí nhân sự, vật tư và lịch di chuyển. Các điều kiện này được thống nhất trước khi xác nhận thực hiện.' },
    ],
    faqs: [
      { question: 'Có thể đồng bộ decal kính với film nội thất không?', answer: 'Có thể trao đổi một phương án màu sắc và vật liệu chung cho mặt kính, quầy và cửa. Việc lựa chọn vẫn cần kiểm tra riêng điều kiện bề mặt và mục đích sử dụng của từng hạng mục.' },
      { question: 'Cửa hàng Đà Nẵng cần duyệt gì trước khi sản xuất decal?', answer: 'Nên duyệt nội dung, chính tả, file logo, kích thước, tỷ lệ trên từng ô kính và mẫu màu. Bản duyệt rõ ràng giúp hạn chế phải chỉnh sửa sau khi in hoặc cắt.' },
      { question: 'iDecal có xác nhận lịch ngay khi gửi yêu cầu không?', answer: 'Lịch cần được kiểm tra theo địa chỉ, quy mô và điều kiện thi công. Bạn gửi thông tin trước để iDecal trao đổi phương án triển khai và các chi phí liên quan, sau đó hai bên mới xác nhận lịch.' },
    ],
    projectIds: [],
  },
  {
    slug: 'ha-noi', name: 'Hà Nội', shortName: 'Hà Nội',
    theme: 'Văn phòng tòa nhà · Cửa hàng · Căn hộ',
    description: 'Tư vấn decal mờ văn phòng, chữ logo và film nội thất tại Hà Nội. Tiếp nhận thông tin công trình, mẫu thiết kế và nhu cầu để trao đổi phương án với iDecal.',
    introduction: [
      'Với cửa hàng quanh hồ Hoàn Kiếm hoặc văn phòng phía hồ Tây, bố cục decal nên hợp với tỷ lệ cửa và phong cách nội thất sẵn có. Nhà có mặt tiền hẹp cần chữ dễ đọc; phòng có nhiều kính nên xem mẫu dưới cả ánh sáng ban ngày lẫn đèn tối.',
      'Văn phòng trong tòa nhà, cửa hàng mặt phố và căn hộ tại Hà Nội có những điều kiện tiếp cận và sử dụng khác nhau. Giải pháp decal cần xuất phát từ vị trí kính, mức riêng tư mong muốn và cách không gian vận hành hằng ngày.',
      'iDecal tiếp nhận yêu cầu tư vấn thiết kế, vật liệu và kế hoạch triển khai tại Hà Nội. Để trao đổi sát nhu cầu, bạn nên gửi ảnh hiện trạng, kích thước, địa chỉ và yêu cầu của ban quản lý nếu công trình nằm trong tòa nhà.',
    ],
    needs: [
      { title: 'Phòng họp trong văn phòng tòa nhà', description: 'Decal mờ và logo cắt tạo sự phân chia giữa phòng họp với lối đi chung. Cao độ dán nên được xác định theo tầm nhìn và vị trí bố trí bàn ghế.' },
      { title: 'Tên thương hiệu trên cửa kính', description: 'Cắt chữ, logo và thông tin chỉ dẫn theo tỷ lệ mặt tiền. Với cửa hàng có diện tích kính nhỏ, ưu tiên nội dung chính và độ tương phản khi nhìn từ ngoài.' },
      { title: 'Làm mới bề mặt trong căn hộ', description: 'Film nội thất là một lựa chọn cho cửa, tủ hoặc quầy có bề mặt còn chắc, phẳng và khô. Cần đánh giá kỹ các vị trí ẩm hoặc đã bong tróc trước khi dán.' },
    ],
    serviceSlugs: ['decal-dan-kinh-van-phong', 'cat-decal', 'film-noi-that'],
    areas: ['Khu Hoàn Kiếm và Ba Đình', 'Khu Đống Đa và Hai Bà Trưng', 'Khu Cầu Giấy, Nam Từ Liêm và Bắc Từ Liêm', 'Khu Tây Hồ, Long Biên và lân cận'],
    planning: [
      { title: 'Xác nhận khung giờ của tòa nhà', description: 'Một số mặt bằng có quy định riêng về thi công, vận chuyển và vệ sinh. Hãy cung cấp các yêu cầu này để tính vào lịch thực hiện và phạm vi báo giá.' },
      { title: 'Đánh giá bề mặt trước khi chốt vật liệu', description: 'Kính có phim cũ, đồ gỗ có lớp sơn yếu hoặc bề mặt còn ẩm có thể cần xử lý bổ sung. Ảnh cận cảnh và thông tin nền giúp xác định bước kiểm tra tiếp theo.' },
    ],
    faqs: [
      { question: 'Tư vấn từ xa cho văn phòng Hà Nội cần những gì?', answer: 'Ảnh toàn cảnh, ảnh cận kính, kích thước từng ô và bản vẽ nếu có là những thông tin hữu ích. Kèm theo yêu cầu riêng tư, nhận diện hoặc làm mới nội thất để lựa chọn đúng hạng mục.' },
      { question: 'Có thể báo giá chỉ từ tổng diện tích kính không?', answer: 'Tổng diện tích có thể dùng để trao đổi sơ bộ, nhưng báo giá cần thêm cách chia ô, loại vật liệu, thiết kế, hiện trạng và điều kiện thi công. Các phần phát sinh như tháo phim cũ nên được làm rõ riêng.' },
      { question: 'Chi phí và lịch triển khai tại Hà Nội được xác nhận khi nào?', answer: 'Sau khi làm rõ địa chỉ, khối lượng, vật liệu và yêu cầu tiếp cận, iDecal sẽ trao đổi khả năng triển khai, lịch và các chi phí liên quan. Không mặc định lịch thi công hoặc phí di chuyển trước khi thống nhất.' },
    ],
    projectIds: [],
  },
];

// Keep regional index previews in sync with the supplied page content.
for (const region of regions) {
  const updated = updatedRegionalContent[region.slug];
  if (updated) {
    region.description = updated.description;
    region.introduction = updated.introduction;
    region.areas = updated.areas;
  }
}
