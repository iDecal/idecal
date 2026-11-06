# Quy tắc giữ nội dung của chủ website

- Các bài nhập từ XML WordPress phải giữ nguyên tiêu đề và toàn bộ nội dung gốc. Chỉ chỉnh nội dung khi chủ website yêu cầu cụ thể; không tự viết lại để đạt điểm SEO.
- Với nội dung chủ website cung cấp và cho biết đã lên TOP Google, giữ đầy đủ nội dung, tiêu đề và URL hiện có. Có thể bổ sung theo yêu cầu và cải thiện bố cục/trình bày; không tự cắt bớt, tóm tắt thay thế hoặc đổi URL.
- Trước khi nhập, kiểm tra tệp thực tế có đúng nội dung được nhắc đến. Nếu tệp không khớp, báo rõ và yêu cầu đúng nguồn; không tự suy diễn nội dung thay thế.

- Trang Quận 12 dùng nội dung gốc từ HTML của chủ website: `src/data/quan-12-original.json`. Giữ toàn bộ 47 khối chữ gốc, đề mục, giá và ảnh; kiểm tra với `docs/quan-12-original-content.json`. URL chính là `/vi-tri/decal-dan-kinh-quan-12/`; không đổi URL hoặc viết lại nội dung chỉ để tối ưu SEO.

- Các trang khu vực có thư viện ảnh thi công lẻ riêng, không hiển thị phần hồ sơ công trình lớn trong nội dung khu vực. Ảnh quản lý qua `/quan-ly-anh-khu-vuc` và thư mục `public/images/khu-vuc/<slug>/`; chỉ hiển thị ảnh thực tế đúng địa bàn, không thay bằng ảnh stock hoặc tự tạo hồ sơ dự án cho mỗi ảnh.

- Cập nhật yêu cầu: trên trang khu vực chỉ giữ thư viện ảnh thi công; không hiển thị thẻ bài Blog liên quan, hồ sơ công trình hoặc CTA dẫn công trình trong nội dung khu vực. Giữ FAQ và liên kết địa bàn.

- Quận 1 và Quận 2 dùng hai bố cục riêng (`Quan1Landing`, `Quan2Landing`), giữ toàn bộ nội dung biên tập, ảnh, đề mục và canonical từ HTML nguồn trong `quan-1-original.json` / `quan-2-original.json`. Không rút gọn thành mẫu trang khu vực chung; không đưa lại thẻ Blog/hồ sơ công trình.

- Quận 3, Quận 4 và Tân Bình dùng các bố cục riêng (`Quan3Landing`, `Quan4Landing`, `TanBinhLanding`) và dữ liệu HTML gốc trong các tệp `*-original.json`. Giữ nguyên nội dung biên tập, ảnh, đề mục, URL theo `district-routes.json`; chỉ bổ sung ghi chú hiện tại bên ngoài đoạn gốc. Mục lục Tân Bình đóng mặc định. Ảnh minh họa không được gán thành ảnh thi công thực tế của địa bàn.
