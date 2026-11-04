# Nhập Blog WordPress

Nguồn: XML do người dùng cung cấp ngày 04/11/2026. Chỉ nhập `post` có trạng thái `publish`, không nhập trang, sản phẩm, bình luận hoặc bài trong thùng rác.

- 71 bài WP; 1 slug đã có được thay bằng nội dung gốc; tổng 83 bài Blog.
- 309 ảnh được lưu trong `public/images/blog-wordpress`; tên hash tránh trùng tên.
- 18 URL ảnh gốc không tải được, được giữ thành liên kết trong bài. Xem chi tiết trong [báo cáo JSON](wordpress-blog-import.json).
- Nội dung chuyển từ HTML Gutenberg sang Markdown, bỏ script/style/form và các thành phần quản trị. Giữ bảng, ảnh, chú thích và mốc tiêu đề; sửa link bài sang route mới.
- Ghi nhận ngày đăng, chuyên mục gốc, WordPress ID và URL gốc.
- Chuyển hướng 301 từ slug WP sang `/blog/<slug>/`, không ghi đè route sản phẩm/dịch vụ đang có.

## Chạy lại

Cài các gói trong `scripts/requirements-wp-import.txt` vào một môi trường Python riêng, chạy `python scripts/import-wordpress-blog.py /duong-dan/file.xml` từ thư mục repo. Có thể dùng `--retry-images` để thử lại các URL ảnh đã lỗi. Luôn xem diff và báo cáo sau khi chạy vì bài có cùng slug sẽ được cập nhật theo XML.

Không lưu XML gốc hoặc file cấu hình Rank Math vào thư mục public.
