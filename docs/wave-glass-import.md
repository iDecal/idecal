# Nhập trang dịch vụ Decal dán kính 3D vân sóng

Nguồn: tệp HTML “Decal dán kính 3D vân sóng _ iDecal©.html” do chủ website gửi.
URL gốc và canonical: /decal-dan-kinh-3d-van-song/.
SHA-256: e5ccc90dada45bc2a75c96cc4abbb22cc8cdab875a3df9490dfc8662133fad3d.

Dữ liệu hiển thị nằm trong src/data/wave-glass-original.json; bản đối chiếu
docs/wave-glass-source.json lưu 118 nút chữ lấy trực tiếp từ nội dung bài nguồn,
các ảnh, câu hỏi và chuỗi giá gốc. Không chạy script trong tệp đính kèm.

Giữ nguyên H1, toàn bộ phần giới thiệu, 3 mẫu, giá nguồn, 5 ưu điểm, 5 FAQ và
6 URL ảnh. Ba ảnh nền CSS chuyển thành ảnh HTML có ALT; ảnh catalogue đọc từ
data-src. Bố cục mới ưu tiên nền trắng, ảnh lớn, ba thẻ mẫu và điểm nhấn vàng cát
#e4cfaa / #d1b581. FAQ đóng mặc định và có schema trùng nội dung.

Các liên kết sản phẩm và bài viết được chuyển tới đường dẫn hiện có của website,
giữ nhãn gốc. Trang dịch vụ cũ /dich-vu/decal-mo-3d-van-song/ chuyển 301 về
URL gốc; đường dẫn sản phẩm riêng không thay đổi. Catalogue film trang trí kính
có liên kết tới trang dịch vụ. Có thêm liên kết hướng dẫn đo kính cạnh phần giá.

Ảnh giữ URL nguồn, dùng cơ chế dự phòng của trang film nội thất nếu tải lỗi.
Không thay ảnh nguồn bằng ảnh khác. Kích thước cho ảnh nền chỉ dùng bố trí khung;
ảnh catalogue dùng object-fit contain để không cắt nội dung.

Kiểm tra:

- ASTRO_TELEMETRY_DISABLED=1 npm run check
- ASTRO_TELEMETRY_DISABLED=1 npm test
- Khi Astro dev chạy ở cổng 4321: python3 scripts/test-wave-glass.py

Kiểm tra browser chủ động chặn ảnh ngoài để xác minh giao diện dự phòng, không
đánh giá khả năng tải ảnh từ máy chủ nguồn. Kiểm tra nội dung đối chiếu toàn bộ
nút chữ, giá, ảnh (kể cả CSS/data-src), FAQ, canonical, sitemap và liên kết nội bộ.
