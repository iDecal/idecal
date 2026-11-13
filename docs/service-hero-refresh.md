# Hero dịch vụ

Thiết kế lại phần đầu trang theo yêu cầu chủ website, giữ nội dung, ảnh, URL, anchor, schema và H1 hiện có.

## Bố cục

- Nền sáng nhẹ, hai cột chữ/ảnh ở desktop; xếp dọc dưới 1024px.
- Ảnh cover 4:3 desktop, 3:2 mobile; khung có kích thước cố định.
- Nhãn nhỏ, H1 gradient theo quy tắc hiện hành; CTA chính gradient và phụ nền trắng, vùng chạm tối thiểu 52px.
- Lợi ích dùng icon/chữ, tách bằng đường kẻ mảnh.
- CSS chỉ áp dụng qua marker data-service-hero; PageBanner opt-in serviceHero=true cho cách nhiệt.
- ProductImage eager nhận fetchpriority=high; ảnh phía dưới tiếp tục lazy-load.

## Phạm vi

12 route: /dich-vu/, /dich-vu/thiet-ke/, /dich-vu/in-decal/, /dich-vu/cat-decal/, /dich-vu/thi-cong-decal/, /decal-dan-kinh-van-phong/, /phim-cach-nhiet-nha-kinh/, /dich-vu-film-dan-noi-that/, /decal-dan-kinh-3d-van-song/, /decal-quang-cao/, /dan-decal-bang-hieu/, /dan-decal-thang-may/.

Trang chủ, Blog và catalogue không nhận marker và giữ bố cục hiện hành.

## Kiểm tra

- npm test: build, nguồn nhập, nội dung, SEO, schema, headings, ảnh và kiểm tra xác thực đều qua.
- npm run check: 194 tệp, không lỗi/cảnh báo/hint.
- Playwright: 12 route × 6 chiều rộng (1440, 1280, 1024, 768, 390, 320), không tràn ngang; đúng cột/xếp dọc, ảnh tải thành công, CTA >=48px, hero không lazy-load và giữ H1 gradient.
- Axe WCAG A/AA trên các hero tại 1440/390: không phát hiện vi phạm tự động. Đây không thay thế đánh giá accessibility thủ công toàn site.
- Kiểm tra giao diện bằng ảnh chụp desktop/mobile.
- test-wave-glass.py và test-elevator.py chạy qua bản preview cổng 4323: FAQ bàn phím, anchor, fallback ảnh, thư viện ảnh, CTA/form và nội dung khi tắt JavaScript hoạt động.

Thay đổi này chưa xuất bản. Không gộp bản typography navy chưa duyệt từ worktree chính vào lần xuất bản sau.
