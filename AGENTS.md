# Quy tắc giữ nội dung của chủ website

- Các bài nhập từ XML WordPress phải giữ nguyên tiêu đề và toàn bộ nội dung gốc. Chỉ chỉnh nội dung khi chủ website yêu cầu cụ thể; không tự viết lại để đạt điểm SEO.
- Với nội dung chủ website cung cấp và cho biết đã lên TOP Google, giữ đầy đủ nội dung, tiêu đề và URL hiện có. Có thể bổ sung theo yêu cầu và cải thiện bố cục/trình bày; không tự cắt bớt, tóm tắt thay thế hoặc đổi URL.
- Trước khi nhập, kiểm tra tệp thực tế có đúng nội dung được nhắc đến. Nếu tệp không khớp, báo rõ và yêu cầu đúng nguồn; không tự suy diễn nội dung thay thế.

- Trang Quận 12 dùng nội dung gốc từ HTML của chủ website: `src/data/quan-12-original.json`. Giữ toàn bộ 47 khối chữ gốc, đề mục, giá và ảnh; kiểm tra với `docs/quan-12-original-content.json`. URL chính là `/vi-tri/decal-dan-kinh-quan-12/`; không đổi URL hoặc viết lại nội dung chỉ để tối ưu SEO.

- Các trang khu vực có thư viện ảnh thi công lẻ riêng, không hiển thị phần hồ sơ công trình lớn trong nội dung khu vực. Ảnh quản lý qua `/quan-ly-anh-khu-vuc` và thư mục `public/images/khu-vuc/<slug>/`; chỉ hiển thị ảnh thực tế đúng địa bàn, không thay bằng ảnh stock hoặc tự tạo hồ sơ dự án cho mỗi ảnh.

- Cập nhật yêu cầu: trên trang khu vực chỉ giữ thư viện ảnh thi công; không hiển thị thẻ bài Blog liên quan, hồ sơ công trình hoặc CTA dẫn công trình trong nội dung khu vực. Giữ FAQ và liên kết địa bàn.

- Quận 1 và Quận 2 dùng hai bố cục riêng (`Quan1Landing`, `Quan2Landing`), giữ toàn bộ nội dung biên tập, ảnh, đề mục và canonical từ HTML nguồn trong `quan-1-original.json` / `quan-2-original.json`. Không rút gọn thành mẫu trang khu vực chung; không đưa lại thẻ Blog/hồ sơ công trình.

- Quận 3, Quận 4 và Tân Bình dùng các bố cục riêng (`Quan3Landing`, `Quan4Landing`, `TanBinhLanding`) và dữ liệu HTML gốc trong các tệp `*-original.json`. Giữ nguyên nội dung biên tập, ảnh, đề mục, URL theo `district-routes.json`; chỉ bổ sung ghi chú hiện tại bên ngoài đoạn gốc. Mục lục Tân Bình đóng mặc định. Ảnh minh họa không được gán thành ảnh thi công thực tế của địa bàn.

- Thiết kế trang quận/huyện: ưu tiên nền trắng, ít viền/khối màu và nhãn trang trí, chữ phân cấp rõ, ảnh cân đối. Dùng `district-clean.css` để thống nhất nhịp trình bày; vẫn giữ bố cục riêng của các bài nhập gốc, không cắt nội dung hoặc ép về cùng mẫu.

- Không hiển thị thông tin tồn kho, hết hàng, ngừng mẫu hoặc yêu cầu xác nhận tình trạng cung ứng trên trang sản phẩm; giữ các ghi chú quản lý hàng ở tài liệu nội bộ.

- Trang `/decal-dan-kinh-van-phong/` dùng nội dung chủ website gửi từ HTML, lưu tại `src/data/office-glass-original.json`, bố cục `OfficeGlassLanding`. Giữ 8 ảnh nguồn, bảng giá và 7 FAQ. Người dùng đã yêu cầu viết lại tiêu đề giữ từ khóa và thêm ứng dụng phòng ban/công ty vận tải/du lịch trong `office-glass-copy.json`; giữ H1 và meta theo tệp này. Bản nguồn 69 khối được lưu nguyên vẹn; người dùng đã cho phép rút gọn 5 nhóm giải pháp trong `office-glass-presentation.json`, bỏ emoji bàn tay và chuyển link dài thành nút. Các phần còn lại giữ nội dung gốc. Kiểm tra bằng `node scripts/check-office-glass.mjs`.

- Trang /dich-vu-film-dan-noi-that/ dùng HTML film nội thất do chủ website gửi, lưu tại src/data/interior-film-original.json; đối chiếu docs/interior-film-source.json. Giữ 82 khối chữ gốc, 17 ảnh nguồn, 6 nhóm mẫu, 4 lợi ích, 4 ứng dụng và 5 FAQ; chỉ đổi liên kết tới trang đang có khi cần. /dich-vu/film-noi-that/ chuyển về URL gốc này. Kiểm tra bằng node scripts/check-interior-film.mjs.

- Trang /decal-dan-kinh-3d-van-song/ dùng HTML Decal 3D vân sóng do chủ website gửi: src/data/wave-glass-original.json và bản đối chiếu docs/wave-glass-source.json. Giữ 118 nút chữ nguồn, 3 mẫu và giá, 6 ảnh nguồn (gồm 3 ảnh nền CSS và 1 ảnh data-src), 5 ưu điểm, 5 FAQ; giữ H1 và canonical gốc. /dich-vu/decal-mo-3d-van-song/ chuyển về trang dịch vụ này; giữ riêng đường dẫn sản phẩm /san-pham/decal-mo-3d-van-song/. Kiểm tra bằng node scripts/check-wave-glass.mjs.

- Trang /dan-decal-bang-hieu/ là dịch vụ con của Decal quảng cáo (/decal-quang-cao/), nhập từ HTML chủ website gửi: src/data/signage-original.json và docs/signage-source.json. Giữ 67 khối chữ (125 nút chữ nguồn), 6 ảnh, 5 nhóm vật liệu, 4 lợi ích, 5 bước thi công, hai bảng giá đầy đủ (5 và 8 dòng), H1 và canonical gốc. Hai trang Decal quảng cáo có thẻ dẫn dịch vụ con. Không đưa lại chuyển hướng từ URL canonical sang cắt decal. Kiểm tra bằng node scripts/check-signage.mjs.
