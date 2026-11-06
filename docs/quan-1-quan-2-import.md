# Quận 1 và Quận 2 — nhập nội dung gốc

Nguồn: hai tệp HTML do chủ website cung cấp. Giữ tiêu đề SEO, H1, toàn bộ nội dung biên tập, bảng giá, ID đề mục và URL canonical gốc:

- `/vi-tri/decal-dan-kinh-quan-1/`: 44 khối chữ gốc, 2 ảnh. Bố cục tư vấn: tiêu đề và liên hệ, giới thiệu kèm ảnh, bảng giá rộng bên trái và ưu đãi bên phải.
- `/vi-tri/decal-dan-kinh-quan-2/`: 47 khối chữ gốc, 8 ảnh. Bố cục ảnh lớn, nhu cầu theo ba trục, lý do lựa chọn, ảnh thực tế và 6 câu hỏi gốc chia hai nhóm.

Không nhập mã quản trị, script, nonce, trường ẩn chống spam hoặc plugin Fluent Forms WordPress. Chức năng tư vấn được dẫn sang trang liên hệ hiện tại; các đoạn biên tập và nút nội dung được giữ. Không lưu HTML quản trị thô trong repo. Các claims/giá/chính sách gốc được giữ theo yêu cầu chủ website; thêm ghi chú cần xác nhận điều kiện thực hiện theo hạng mục, không tự mở rộng các cam kết.

10 ảnh gốc được tải về website. Alt gốc giữ nguyên; chú thích hiển thị được bổ sung để dễ đọc thay vì hiện tên file máy ảnh. Quận 1 dùng ảnh thứ hai khởi tạo thư viện; Quận 2 dùng sáu ảnh thư viện gốc. Hai ảnh giới thiệu vẫn ở đúng phần nội dung tương ứng. Tải thêm ảnh trong trang quản lý khu vực; Quận 2 có thư mục riêng và ảnh cũng tổng hợp lên TP.HCM.

Khôi phục URL gốc làm canonical; các đường dẫn khu vực và alias cũ chuyển trực tiếp về trang gốc. Liên kết Quận 2 dưới phường An Khánh, Bình Trưng, Cát Lái trỏ về trang Quận 2 riêng. Giữ nguyên đích các redirect Blog, gồm bài căn hộ Ruby có tên Quận 2; không đổi thành trang dịch vụ.

`check-imported-districts.mjs` kiểm tra từng khối chữ gốc theo đúng thứ tự, ảnh, ID, tiêu đề, canonical và các đích Blog AMP. Không thêm Blog liên quan hoặc hồ sơ công trình vào hai trang.
