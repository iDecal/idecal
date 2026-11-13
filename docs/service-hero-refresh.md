# Hero dịch vụ

Thiết kế lại phần đầu trang theo yêu cầu chủ website, giữ nội dung, ảnh, URL, anchor, schema và H1 hiện có.

## Bố cục theo ảnh mẫu mới nhất

- Ảnh nguồn phủ toàn khung hero bo góc; vẫn dùng img eager/high với ALT và ảnh responsive từ pipeline sẵn có.
- Overlay navy đậm bên trái, nhạt dần bên phải; nội dung sáng và H1 trắng theo quy tắc nền tối. Không lấy màu vàng hoặc thông tin đánh giá từ website mẫu.
- Giữ nguyên nhãn, H1, mô tả và lợi ích nguồn ở bên trái; CTA trong thanh trắng rộng phía dưới, logo chữ iDecal bên phải trên desktop.
- Khung cao tối thiểu 640px desktop, tự giãn theo nội dung; không đặt chiều cao cứng làm cắt chữ. Mobile xếp dọc trong cùng ảnh nền, CTA toàn chiều rộng, không hiện logo chữ phụ.
- Figcaption nguồn giữ trong HTML cho công nghệ hỗ trợ, tránh phủ thêm nhãn lên ảnh; không xóa ALT hoặc chú thích nguồn khỏi dữ liệu.
- Chỉ các hero opt-in nhận giao diện mới; PageBanner catalogue không thay đổi. Yêu cầu mới thay thế bố cục chữ trái/ảnh phải và quy tắc nền sáng của các phiên bản trước.

## Phạm vi

12 route: /dich-vu/, /dich-vu/thiet-ke/, /dich-vu/in-decal/, /dich-vu/cat-decal/, /dich-vu/thi-cong-decal/, /decal-dan-kinh-van-phong/, /phim-cach-nhiet-nha-kinh/, /dich-vu-film-dan-noi-that/, /decal-dan-kinh-3d-van-song/, /decal-quang-cao/, /dan-decal-bang-hieu/, /dan-decal-thang-may/.

Trang chủ, Blog và catalogue không nhận marker và giữ bố cục hiện hành.

## Kiểm tra

- npm test: build, nguồn nhập, nội dung, SEO, schema, headings, ảnh và kiểm tra xác thực đều qua.
- npm run check: 194 tệp, không lỗi/cảnh báo/hint.
- Playwright: 12 route × 6 chiều rộng (1440, 1280, 1024, 768, 390, 320), không tràn ngang; ảnh phủ khung, H1 trắng/CTA nền trắng và không tràn nội dung, ảnh tải thành công, CTA >=48px, hero không lazy-load và giữ H1 đúng nền tối.
- Axe WCAG A/AA trên các hero tại 1440/390: không phát hiện vi phạm tự động. Đây không thay thế đánh giá accessibility thủ công toàn site.
- Kiểm tra giao diện bằng ảnh chụp desktop/mobile.
- test-wave-glass.py và test-elevator.py chạy qua bản preview cổng 4323: FAQ bàn phím, anchor, fallback ảnh, thư viện ảnh, CTA/form và nội dung khi tắt JavaScript hoạt động.

Thay đổi này chưa xuất bản. Không gộp bản typography navy chưa duyệt từ worktree chính vào lần xuất bản sau.
