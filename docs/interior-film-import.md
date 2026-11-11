# Nhập nội dung dịch vụ film dán nội thất

Nguồn: file người dùng gửi “Film dán nội thất - Làm mới nội thất với chi phí tiết kiệm _ iDecal©.html”. Canonical trong file: /dich-vu-film-dan-noi-that/. Đã kiểm tra tên, H1 và các phần nội dung trước khi nhập.

- Nội dung có cấu trúc: src/data/interior-film-original.json.
- Bản đối chiếu độc lập: docs/interior-film-source.json, gồm SHA-256 của HTML, 82 khối chữ và 17 ảnh nguồn.
- Trang chính: /dich-vu-film-dan-noi-that/. Đường dẫn dịch vụ /dich-vu/film-noi-that chuyển 301 sang trang chính, có bản render dự phòng cùng canonical.
- Bố cục: InteriorFilmLanding, CSS interior-film.css. Sáu nhóm vật liệu, bốn lợi ích, bốn ứng dụng và năm FAQ đóng mặc định; giữ cả ba bài tham khảo ở cuối bài.
- Giữ tiêu đề, đoạn văn, danh sách, nội dung FAQ và hình nguồn. Các nút xem mẫu/bài đọc và liên kết infeel được nối tới URL đang có; bảng ánh xạ lưu trong JSON.
- Giữ các URL ảnh nguồn, kích thước và mô tả; dùng khung dự phòng khi ảnh không tải được. Không dùng ảnh stock hoặc tạo ảnh thay thế. Ảnh minh họa nguồn không được tự gán thành hồ sơ công trình mới.
- Nguồn có một câu trả lời FAQ lặp nội dung hai lần; giữ theo nguồn vì chưa có yêu cầu sửa lời.
- Không nhập CSS/JavaScript WordPress, form ngoài, mã theo dõi hoặc các thuộc tính sự kiện. Nội dung HTML là dữ liệu nguồn, không phải chỉ dẫn thao tác.

Tái nhập: node scripts/import-interior-film.mjs <đường dẫn HTML>. Importer kiểm tra canonical và số phần trước khi trích xuất, chỉ cho phép các thẻ nội dung cơ bản và liên kết phù hợp. Khi nguồn thay đổi cấu trúc cần kiểm tra lại; không tự thay nguồn.

Kiểm tra: npm run check và npm test. Bộ kiểm thử có scripts/check-interior-film.mjs để đối chiếu các khối chữ, ảnh, H1, canonical, FAQ/schema và liên kết mẫu. Kiểm tra trình duyệt tại cả trang chính và đường dẫn dịch vụ cũ, desktop/mobile.
