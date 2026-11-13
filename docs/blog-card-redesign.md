# Thẻ Blog theo mẫu chủ website

Dùng BlogPostCard cho danh sách Blog, năm chuyên mục và Bài cùng chủ đề. Lưới 3 cột desktop, 2 cột tablet và 1 cột dưới 640px. Ảnh cover 2:1; phần chữ nền xanh nhạt #f3f8ff, bo góc 18px, không viền. Thứ tự tiêu đề → giới thiệu ngắn → Đọc thêm. Bỏ featured riêng để bài đầu nằm trong cùng lưới, giữ thứ tự ngày hiện hành.

Theo phản hồi mới nhất: bỏ chuyên mục và ngày tháng trên thẻ; thay bằng giới thiệu 15 từ, dùng blog-card-excerpts.ts. Bốn giới thiệu biên tập cho đo kính/tháo Decal/kính mờ/Decal giấy; các bài còn lại trích 15 từ đầu description và thêm dấu lửng. Đã đối chiếu đủ 83 bài hiện có đều 15 từ theo khoảng trắng. Không sửa description SEO, tiêu đề, URL, ảnh, nội dung nguồn hoặc metadata header bài chi tiết. Các bài mới có description ngắn hơn thì giữ nguyên, tối đa 15 từ.

Link Đọc thêm dùng SVG 24px, nét 2.4px, mũi tên thẳng xuống luôn hiển thị; aria-label khớp nhãn và thêm tiêu đề bài. Giữ link không gạch dưới và vùng chạm 48px. Không dùng chuyên mục/ngày trong thẻ; các thông tin này ở bài chi tiết giữ nguyên.

Giữ Google Sans Flex/Inter, heading #1b4f7a, link #0d6b96. Cỡ H2 cục bộ 22px desktop, 18px cộng 2px mobile theo chính sách toàn site; H3 bài liên quan giữ 19px. Blog trên trang chủ không đổi. Ảnh đầu danh sách eager/high; các ảnh khác lazy, có width/height và ALT từ tiêu đề. Chuyển động hover tắt khi người dùng yêu cầu giảm chuyển động.

Đã build và kiểm tra Astro (196 tệp, không lỗi/cảnh báo/hint), nguồn nhập/site/Blog TOC/editorial. Playwright kiểm tra Blog, Hướng dẫn, Vật liệu Decal, bài Decal giấy tại 1440/768/390/320: giới thiệu đủ 15 từ, không có metadata trong thẻ, SVG xuống hiển thị 24px, font/màu, ảnh và link đúng, không tràn ngang; axe WCAG A/AA và 2.1 A/AA trên lưới tại desktop/mobile không phát hiện vi phạm tự động. Đã xem ảnh chụp desktop/mobile và mở bài từ thẻ.

Chưa xuất bản.
