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

## Thiết kế lại từ tệp gửi lần sau

Chủ website xác nhận cập nhật trang dịch vụ /dich-vu-film-dan-noi-that/.
Tệp HTML mới được đối chiếu và tái nhập: SHA-256, 82 khối chữ và 17 ảnh khớp
nguồn đã lưu. Không thay trang vật liệu /film-dan-noi-that/.

- Chỉ sử dụng dữ liệu chữ, ảnh và liên kết nội dung đã làm sạch; không dùng giao diện, CSS hay JavaScript của HTML nguồn.
- Đầu trang có ảnh lớn, giới thiệu và hai thao tác chọn mẫu/nhận tư vấn. Menu nội dung bám dưới header, chỉ rõ phần đang đọc.
- Sáu nhóm mẫu trình bày hai cột trên desktop, một cột trên mobile; có lối chọn nhóm nhanh. Mô tả luôn hiện, danh sách ứng dụng đầy đủ nằm trong details mở theo nhu cầu.
- Bốn nhóm ứng dụng dùng tab có nhãn, điều khiển bằng chuột, cảm ứng và các phím mũi tên/Home/End. Không có JavaScript thì cả bốn nhóm đều hiện.
- Năm FAQ dùng details đóng mặc định; nút báo giá mở biểu mẫu có sẵn và chọn dịch vụ thi công, không gửi yêu cầu tự động.
- Theo hệ thống giao diện hiện tại: nền trắng/sáng, nhấn xanh–tím, thang chữ chung; giữ ảnh, ALT/title, H1, canonical và toàn bộ nội dung nguồn.

Sau build, chạy python3 scripts/test-interior-film.py qua Astro preview cổng
4322: kiểm tra 1440/1024/768/390/320px, tab/bàn phím, mục mở rộng, vị trí neo,
FAQ, chọn dịch vụ báo giá và khả năng đọc khi không có JavaScript. Bộ test
chủ động chặn ảnh ngoài để kiểm tra khung dự phòng; không dùng kết quả đó
để khẳng định ảnh ngoài đang tải thành công.

Theo yêu cầu xuất bản tiếp theo, liên kết Film nội thất ở menu desktop/mobile,
thẻ dịch vụ trang chủ, gợi ý 404 và liên kết tư vấn thi công trỏ thẳng tới
/dich-vu-film-dan-noi-that/. Các liên kết được ghi rõ là catalogue/nhóm sản phẩm
vẫn dùng trang vật liệu /film-dan-noi-that/ để tiếp tục chọn sản phẩm.

Bổ sung theo yêu cầu tiếp theo: Thang máy là ứng dụng thứ năm, đặt đầu tiên và
mở mặc định, có icon và màu nhấn xanh–tím. Dữ liệu bổ sung nằm trong
interior-film-applications.ts, dùng nội dung film nội thất và ảnh thang máy đã
có trong elevator-service.json; ảnh có chú thích tham khảo, không gán là công
trình mới. Có liên kết đến /dan-decal-thang-may/. Giữ nguyên bốn ứng dụng và
17 ảnh trong bản nhập; trang hiển thị tổng cộng 18 ảnh. Các tab vẫn hỗ trợ bàn
phím và cả năm ứng dụng đều hiện khi tắt JavaScript.
