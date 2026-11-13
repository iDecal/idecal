# Thẻ Blog theo mẫu chủ website

Dùng BlogPostCard cho danh sách Blog, năm chuyên mục và Bài cùng chủ đề. Lưới 3 cột desktop, 2 cột tablet và 1 cột dưới 640px. Ảnh cover 2:1; phần chữ nền #f3f8ff, bo góc 18px, không viền. Thứ tự tiêu đề → chuyên mục/ngày → link “Đọc thêm” cuối thẻ kèm mũi tên SVG chéo xuống phải theo mẫu. Không hiển thị mô tả trong thẻ theo mẫu; mô tả dữ liệu, metadata SEO và nội dung bài vẫn giữ nguyên. Bỏ featured riêng để bài đầu nằm trong cùng lưới, giữ thứ tự ngày hiện hành.

Giữ Google Sans Flex/Inter, heading #1b4f7a, link #0d6b96 và quy tắc không gạch dưới. Cỡ H2 cục bộ 22px desktop, 18px cộng 2px mobile theo chính sách toàn site; H3 bài liên quan giữ 19px. Chuyên mục có pill xanh nhạt, ngày cùng hàng khi đủ chỗ và được phép xuống hàng trên khung hẹp. Header metadata và mục lục bài chi tiết không thay đổi. Blog trên trang chủ giữ nguyên.

Ảnh đầu danh sách eager/high; các ảnh khác lazy, có width/height và ALT từ tiêu đề. Link đọc có tên truy cập đầy đủ, vùng chạm 48px; chuyển động hover tắt khi người dùng yêu cầu giảm chuyển động.

Đã kiểm tra npm test (build, nguồn nhập, SEO, schema, headings, Blog TOC, ảnh và xác thực), npm run check (195 tệp, không lỗi/cảnh báo/hint). Playwright kiểm tra Blog, Hướng dẫn, Vật liệu Decal, bài Decal giấy tại 1440/1024/768/390/320: số cột, thứ tự nội dung, font/màu, ảnh tải, link, không tràn ngang; axe WCAG A/AA trên lưới tại desktop/mobile không phát hiện vi phạm tự động. Đã xem ảnh chụp desktop/mobile và mở bài từ thẻ. CSS cuối cùng chỉ bổ sung scope metadata vào lưới và vùng chạm chuyên mục, sau đó build và chạy lại kiểm tra trình duyệt.

Cập nhật theo phản hồi: nền nhạt hơn #f3f8ff; link Đọc thêm dùng mũi tên SVG chéo xuống phải và tên truy cập khớp nhãn. Đã kiểm tra lại màu nền, SVG, font/màu chữ, mở bài và axe trên desktop/mobile.

Chưa xuất bản.
