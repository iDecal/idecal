# Gộp ba trang phim cách nhiệt

Theo yêu cầu chủ website, gộp phần giới thiệu, danh mục và dịch vụ thành một
trang tại /phim-cach-nhiet-nha-kinh/ (URL đang có trên menu). Hai URL
/phim-cach-nhiet/ và /dich-vu/phim-cach-nhiet/ chuyển 301 trực tiếp về đây,
cả bản có/không dấu gạch cuối. Các URL danh mục WordPress cũng trỏ trực tiếp
về trang chính. Các bản render dự phòng cùng canonical để xem được trên
Astro preview; Cloudflare áp dụng các chuyển hướng trong public/_redirects.

docs/thermal-merge-source.json lưu nội dung/ảnh/sản phẩm của ba trang trước
khi gộp. Dữ liệu sản phẩm, thương hiệu, bảng giá, thông số và bài Blog vẫn
được giữ ở nguồn hiện có. Bỏ các hero, thương hiệu, catalogue, CTA và hướng
dẫn lặp; không ghép ba bản HTML nối tiếp nhau.

Trang chính có một H1 dịch vụ, một catalogue tám mẫu phim, hai sản phẩm hỗ
trợ (dụng cụ và phim bảo vệ kính), ba nhóm giá 2026, cách chọn phim/sắc phim,
ba ứng dụng, thông tin thi công, ba ảnh thi công đã có và hai FAQ phù hợp.
Mẫu xanh dương phản gương được đưa vào từ danh sách sản phẩm gợi ý của dịch
vụ; không đổi nhóm quản lý, mã mẫu, giá hoặc URL chi tiết sản phẩm.

Các giá /m² giữ đúng nguồn service-pricing.json, không suy ra tỷ lệ cản nhiệt
hoặc thời hạn bảo hành khi chưa có thông số. Ảnh sắc phim giữ chú thích minh
họa; ảnh thực tế lấy từ thư viện thi công số 4, 13, 34. CTA chọn sẵn dịch vụ
thi công trong biểu mẫu và không gửi tự động.

service-routes.ts ánh xạ liên kết dịch vụ và danh mục cách nhiệt về canonical;
các nhóm khác dùng nguyên đường dẫn cũ. Sitemap và search index chỉ có một
trang phim cách nhiệt chính. Structured data gồm Service và FAQPage.

Kiểm tra: npm run check, npm test (gồm check-thermal-service.mjs), sau build
chạy python3 scripts/test-thermal-service.py qua Astro preview cổng 4322.
