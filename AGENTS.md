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

- Cập nhật trang bảng hiệu theo yêu cầu chủ website: làm lại UX và bỏ/thay nội dung tiếng Anh. Giữ bản nhập và bản đối chiếu nguyên vẹn; lớp hiển thị src/data/signage-presentation.ts áp dụng các thay thế trong signage-copy.json. Cho phép Việt hóa nhãn tiếng Anh, tên vật liệu và từ mô tả theo tệp này; giữ H1, URL, 6 ảnh và toàn bộ giá/đơn vị. Bảng giá đặt sau vật liệu, điện thoại hiển thị từng dòng giá thành thẻ đủ ba cột; menu mục ngắn có trạng thái hiện tại. Nút báo giá chọn đúng dịch vụ thi công trong biểu mẫu.

- Cập nhật quy trình bảng hiệu theo yêu cầu: được rút gọn tiêu đề và 5 bước trong signage-copy.json, thay 11 khối quy trình gốc bằng 5 mô tả ngắn. Giữ nội dung gốc ở hai tệp lưu nguồn; ảnh quy trình bên trái, bước 01–05 bên phải trên desktop, xếp dọc dưới 901px. Chữ bước và mô tả nhỏ hơn; giữ điều kiện bảo hành 6–12 tháng và liên kết in decal. Các phần khác tiếp tục đối chiếu nguồn như trước.

- Trang bảng hiệu có thư viện ảnh thực tế theo signage-gallery.json: lấy ảnh bài Hoa Đạt từ dữ liệu Blog và các ảnh installation số 36, 39, 41, 24, 37 của installation-photo-library.json. Giữ nguồn ảnh, chỉ dùng chú thích đã có căn cứ, không gán thêm địa chỉ hoặc ngày thi công. Có xem ảnh lớn; không thay sáu ảnh của nội dung gốc bằng ảnh thư viện.

- /dan-decal-thang-may/ là dịch vụ con của Decal quảng cáo, dữ liệu tại elevator-service.json. Giữ hai nhóm: film nội thất và decal in quảng cáo; liên kết ở cả hai trang cha Decal quảng cáo, breadcrumb về /decal-quang-cao/. Dùng ảnh thang máy có sẵn, chú thích theo nội dung ảnh; không gán ảnh tham khảo thành công trình mới của iDecal. Không thay bài Blog thang máy hiện có. Kiểm tra bằng node scripts/check-elevator.mjs và scripts/test-elevator.py.
- Cập nhật bố cục văn phòng theo landing HTML mới: hero nền sáng và CTA nền đậm, thẻ dịch vụ có ảnh, lưới giải pháp 3+2, bảng giá rộng. Người dùng cho phép đổi ảnh dịch vụ/giải pháp; ảnh chọn tại `office-glass-visuals.json`, giữ tệp nguồn cũ để đối chiếu.

- Footer dùng nền navy đậm như web cũ kèm gradient nhẹ, khối liên hệ có viền mờ, chữ sáng và nhóm link có gạch nhấn xanh nhạt; giữ 7 social cùng các địa chỉ. Trên mobile các nhóm điều hướng footer đóng mặc định, mở dạng accordion.

- Header giữ nền trắng/chữ xanh đậm, bỏ nút gọi điện và mục Khu vực riêng trong menu chính. Bộ chọn khu vực ở bên phải, mặc định TP. Hồ Chí Minh; khi đang ở trang khu vực thì hiển thị đúng khu vực đó. Mobile chỉ có logo và nút ba gạch; bộ chọn khu vực nằm bên trong menu, không hiển thị cạnh nút ba gạch.

- Toàn bộ màu nhấn vàng cát của giao diện đã được thay bằng xanh dương/xanh nhạt; dùng token `ui-accent` trong Tailwind, không dùng lại `sand` hoặc các màu beige/gold cho nền, nút, viền. Giữ nguyên màu vật liệu thật trong ảnh/bảng màu và logo thương hiệu. Footer dùng gradient navy rất đậm cùng tông thanh bản quyền.

- Quy tắc tiêu đề toàn site, kể cả Blog và tài liệu nhập HTML/XML/DOCX/PDF/CMS: dùng `heading-policy.css`. H1 Lexend gradient xanh–tím, 34–38px; H2 Lexend xanh đậm #1b4f7a, không gradient/không ép hoa, thang chung 24–34px và cỡ gọn riêng cho thẻ/sidebar. H3 và con bên trong Inter 19px; H4–H6 Inter 17px ở mọi màn hình. Mọi tiêu đề trên nền tối luôn trắng #fff, bỏ gradient; dùng data-heading-theme="dark" cho khối mới, data-heading-theme="light" cho thẻ sáng bên trong. Không mang font/cỡ/màu từ tài liệu vào giao diện, không dùng inline !important; ánh xạ đề mục thành h1–h6, đoạn thường thành p/li. Giữ nguyên chữ/tiêu đề nguồn. Chạy `node scripts/check-heading-policy.mjs` sau build (đã nằm trong npm test).

- Tất cả Hero đầu trang dùng nền sáng theo `hero-surfaces.css`, giữ ảnh minh họa và H1 gradient. Footer và CTA cuối trang vẫn giữ thiết kế riêng.

- Nhãn nhỏ trên H1/H2 dùng pill gradient nhạt như trang chủ theo `heading-labels.css` (không giả tương tác); nhãn mới dùng data-heading-label. Lợi ích hero dùng BannerBenefits với icon theo nghĩa, chữ không có nền/viền/bo tròn. Giữ nhãn lợi ích nguồn và chọn icon tương ứng, không cắt chữ để ép bố cục.

- CTA cuối trang văn phòng được chủ website cho phép rút gọn: nền sáng, một tiêu đề và một đoạn ngắn, nút tư vấn cùng Hotline/Zalo; bỏ khối nội dung chào bán dài, hộp liên hệ phụ và ba link phụ trong CTA. Giữ bản nguồn office-glass-original.json/docs nguyên vẹn.

- Header dùng nhãn ngắn “Dịch vụ” cho mega menu. Chuyên mục Blog “Vật liệu Decal” thay tên “So sánh vật liệu”, giới thiệu đặc điểm/ứng dụng/cách chọn; giữ slug so-sanh-vat-lieu để bảo toàn liên kết. CMS và trình nhập Blog dùng cùng tên chuyên mục.
