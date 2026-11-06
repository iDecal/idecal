# Nhập Quận 3, Quận 4 và Tân Bình

Nguồn là ba tệp HTML chủ website cung cấp. Giữ nguyên tiêu đề SEO, nội dung biên tập, đề mục/ID và toàn bộ ảnh:

- Quận 3: 113 khối chữ, 11 lượt ảnh. Bố cục tư vấn với ảnh, khái niệm/lợi ích, thư viện mẫu và quy trình ba bước dạng trục dọc. Tiêu đề đầu nguồn đang là H2 được nâng thành H1, giữ nguyên chữ và ID. Nội dung ưu đãi tháng 10/2025 giữ nguyên; ghi chú bổ sung phân biệt điều kiện hiện tại.
- Quận 4: 65 khối chữ, 4 ảnh. Bố cục có điều hướng ngắn, ba lý do, ứng dụng, mẫu chất liệu và quy trình bốn bước riêng. Ảnh nguồn có địa danh khác được giữ làm minh họa, không đưa vào thư viện ảnh thi công tại Quận 4.
- Tân Bình: 59 khối chữ, 6 lượt ảnh (một ảnh được dùng lặp theo nguồn). Bố cục hồ sơ dịch vụ với mục lục thu gọn mặc định ở thanh bên, nội dung đọc chính, ảnh bảo hành và thư viện ảnh gốc. Dữ liệu nguồn không có H1 nên thêm H1 từ tiêu đề SEO. Mọi nội dung liên hệ cũ được giữ, kèm số liên hệ hiện tại trong ghi chú riêng.

Không nhập mã quản trị hoặc script WordPress. Không thêm thẻ Blog liên quan hoặc thẻ hồ sơ dự án. Giữ các chú thích ảnh gốc; ảnh thi công Tân Bình do nguồn xác nhận được khởi tạo cho thư viện Tân Bình và TP.HCM. Thư viện Quận 3/4 chờ chủ website tải ảnh đúng địa bàn, không lấy ảnh mẫu thay ảnh thi công.

Canonical và URL gốc trong `src/data/district-routes.json`. Đường dẫn `/khu-vuc/tp-hcm/...` chuyển trực tiếp về URL gốc. Trang Blog Tân Bình nhập từ XML và nội dung mọi bài Blog giữ nguyên; chỉ khôi phục trang dịch vụ độc lập tại URL nguồn, không đổi đường dẫn Blog hoặc Blog AMP.

`check-imported-districts.mjs` đối chiếu từng khối chữ theo đúng thứ tự, toàn bộ ảnh, ID, title, canonical và đích Blog AMP. Mục lục giữ đủ liên kết gốc. Kiểm tra trình duyệt ở 1440, 768, 390 và 360 px: không tràn ngang, đủ ảnh tải được, một H1, mục lục đóng/mở hoạt động.
