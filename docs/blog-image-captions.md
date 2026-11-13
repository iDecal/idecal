# Chú thích ảnh Blog

Theo yêu cầu chủ website: chữ chú thích 14px, căn giữa theo ảnh và cách ảnh 6px; giữ nguyên font/màu website và nội dung bài.

Bản nhập WordPress đã chuyển nhiều figcaption thành đoạn p thông thường. `blog-image-captions.json` trích 104 chú thích thuộc 27 bài đang có từ `idecal.WordPress.2026-11-04.xml`. `presentBlogImages()` chỉ ghép ảnh với đoạn kế tiếp khớp chú thích gốc thành figure/figcaption trong lớp trình bày. Giữ nguyên HTML bên trong, chữ, thuộc tính ảnh/link và mọi tệp Markdown gốc. Không thu nhỏ tự động tất cả đoạn sau ảnh.

Khôi phục được 95 cặp ảnh/chú thích đang có ảnh thật. Chín mục nguồn còn lại không ghép do ảnh không còn trong nội dung hiện hành hoặc đã được thay bằng bảng; không thêm lại ảnh/nội dung thiếu. Chú thích native figure/figcaption cũng nhận cùng CSS. Link trong chú thích giữ inline, cỡ 14px, không nhận chiều cao nút 48px; các đoạn văn thường và trang ngoài Blog không đổi.

Đã kiểm tra build, npm test (nguồn/SEO/headings/Blog TOC/ảnh/editorial), Astro check 197 tệp không lỗi/cảnh báo/hint. Playwright kiểm tra canh giữa, chữ 14px, khoảng cách 6px, ảnh tải, không tràn ngang và giữ cỡ đoạn văn thường trên desktop/mobile. Xem ảnh chụp bài vân gỗ và kiểm tra thêm bài Decal mờ logo, phòng tắm có link trong chú thích. Không phát hiện vi phạm axe tự động trên nhóm ảnh của bài mẫu.

Chưa xuất bản.
