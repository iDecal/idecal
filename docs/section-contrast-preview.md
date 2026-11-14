# Phân cấp màu theo section

Chủ website yêu cầu tăng tương phản giữa các khối trên toàn website, cho phép nền tối. Dùng `section-contrast.css` ở lớp important đầu tiên; không đổi nội dung, font, bố cục hoặc ảnh.

- Navy #0d1b36–#173d60: mở đầu các dịch vụ/khu vực/catalogue/công trình và các khối lợi ích, quy trình.
- Teal đậm #14534f: khối tư vấn/CTA, giúp tách khỏi phần nội dung.
- Xanh xám #e4eef2: giá, FAQ và các nhóm thông tin hỗ trợ.
- Trắng: nội dung đọc, ảnh, bảng và thẻ bên trong nền tối.
- Vàng ấm #e6c85b/chữ navy: hành động chính.

Biến màu được đặt lại tại thẻ trắng, form và bảng để không kế thừa chữ sáng từ nền tối. H1–H6 dùng trắng khi nằm trên nền tối. Chú thích và nội dung Blog giữ phần đọc nền trắng; đầu Blog, mục lục và CTA tạo điểm nhấn. Link phụ và focus bàn phím dùng màu sáng trên navy/teal, màu đậm trên nền trắng. Nhãn nhỏ có nền trong nhẹ theo từng khối. Giữ màu vật liệu và logo trong ảnh.

Đã chạy npm test đầy đủ và build lại sau các điều chỉnh tương phản. Playwright/axe rà `color-contrast` trên các nhóm trang trang chủ, thiết kế/in/cắt/thi công/văn phòng/film/cách nhiệt/bảng hiệu/thang máy/vân sóng, khu vực, quận, catalogue, Blog, công trình và liên hệ tại desktop/mobile. Kiểm tra thêm trang sản phẩm, bài Blog và hồ sơ công trình chi tiết. Các kiểm tra này tập trung màu chữ/nền và không tràn ngang; không thay thế đánh giá accessibility thủ công toàn website.

Chưa xuất bản.
