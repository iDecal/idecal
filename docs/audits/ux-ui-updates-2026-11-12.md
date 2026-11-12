# Cập nhật giao diện theo audit — 12/11/2026

Bản thay đổi giữ nội dung nguồn, URL, font Google Sans Flex cho tiêu đề/header/footer, body Inter và bố cục trang chủ đã duyệt.

- Chuẩn hóa chữ phụ trên nền sáng về #52677C; sửa cả ngày Blog, social, thư viện, công trình, khu vực và trạng thái ảnh dự phòng.
- CTA dùng gradient đầu xanh #0878BD, hover đậm; focus rõ, link không gạch dưới nhưng nhấn đậm 650.
- Nội dung đọc trên mobile tối thiểu 16px; vùng chạm cho nút, control, summary và link điều hướng độc lập tối thiểu 48px. Link inline trong đoạn văn giữ dòng đọc tự nhiên.
- Preload các nhóm ký tự Inter để giảm thay font sau khi trang đã hiện.
- Hero trang chủ dùng ảnh nội bộ cùng hình, eager/high; logo phía dưới chuyển về lazy.
- Build tự bổ sung kích thước từ ảnh thật và tạo WebP dẫn xuất khi tiết kiệm tối thiểu 15%. Giữ src/ALT/title và ảnh gốc; ảnh gốc vẫn được dùng khi xem lớn. Không ghi đè ảnh người dùng tải lên.
- BreadcrumbList bổ sung từ breadcrumb đang hiển thị; không tạo hierarchy hoặc review giả.

Bản dựng: 222 lượt ảnh được bổ sung nguồn responsive, 893 lượt ảnh có thêm kích thước. Các bản ảnh dẫn xuất tiết kiệm tổng cộng 41.843 KiB so với nhóm ảnh gốc tương ứng (không phải mức giảm của từng trang). Ví dụ ảnh FDCARE từ 10.561.987 byte xuống 125.924 byte cho bản hiển thị, ảnh gốc giữ nguyên.

Đã chạy npm test và Astro check: không lỗi. Đã kiểm tra tab/FAQ, chọn dịch vụ, ảnh thu nhỏ và modal ảnh gốc, bàn phím/Escape, chế độ không JavaScript ở các dịch vụ trọng tâm. Thư viện ảnh kiểm tra độ phân giải ảnh gốc trong modal thay vì dùng naturalWidth của thumbnail responsive (giá trị này được trình duyệt hiệu chỉnh theo mật độ).

Kết quả quét đầy đủ và Lighthouse sau sửa nằm ở phần kiểm tra cuối bên dưới. Kiểm tra tự động không thay thế chứng nhận WCAG thủ công hoặc dữ liệu INP người dùng thực tế. Các thông tin kinh doanh/đánh giá cần bằng chứng thật; không tự thêm dữ liệu để tăng điểm.

## Kết quả kiểm tra cuối

- Quét tương phản và tràn ngang ở 390px trên toàn bộ **291 trang canonical**. Các lỗi dùng chung phát hiện trong lượt quét được sửa và các trang liên quan được kiểm tra lại: kết quả cuối không còn lỗi `color-contrast` do axe phát hiện, không tràn ngang, không lỗi tải trang trong phạm vi quét.
- 27 lượt kiểm tra đầy đủ WCAG A/AA trên các mẫu chính ở 320/390/1440px không phát hiện lỗi; phần đầu màn hình được kiểm tra không còn nút/điều hướng độc lập dưới 48px, không còn đoạn nội dung p/li mobile dưới 16px.
- Thumbnails sản phẩm không làm mờ toàn nút nữa: tránh làm chữ fallback thiếu tương phản và làm sai màu ảnh vật liệu. Ảnh được chọn dùng viền xanh đậm.
- Ô số liệu 96,5% trên hero trang chủ chuyển từ H3 sang đoạn số liệu, giữ chữ và kiểu hiển thị; không nhảy từ H1 xuống H3 chỉ để trang trí.
- Kiểm tra giao nhận ảnh xác nhận **77 ảnh gốc không đổi byte**, 77 ứng viên WebP hợp lệ và 222 lượt dùng ảnh responsive, có kích thước khung; hero nội bộ eager/high. Các kiểm tra nội dung nguồn, ALT/title, canonical/URL vẫn chạy qua.

### Lighthouse mobile trên bản xem trước cuối

| Trang | Performance | Accessibility | SEO | LCP | CLS | TBT |
|---|---:|---:|---:|---:|---:|---:|
| Trang chủ | 100 | 100 | 100 | 1,21 giây | 0 | 0ms |
| Film nội thất | 100 | 100 | 100 | 1,05 giây | 0 | 0ms |

Đo ngày 12/11/2026 bằng Lighthouse 13.6.0, mobile simulated throttling, CPU 4×, tại Astro preview cổng 4322. Mẫu trước sửa đo từ website Cloudflare, mẫu sau từ preview nội bộ; không so sánh trực tiếp điểm số để khẳng định tốc độ người dùng thực tế tăng bao nhiêu. TBT không phải INP. Điểm 100 và axe không lỗi không chứng minh chứng nhận WCAG toàn diện; cần theo dõi CrUX/RUM và kiểm tra thủ công liên tục sau xuất bản.

Các vấn đề biên tập/IA cần quyết định riêng vẫn giữ nguyên: không tự viết lại nội dung gốc, không tạo đánh giá hoặc số liệu kinh doanh thiếu căn cứ, không tự gộp năm trang chưa có đường link trong crawl chỉ để thay đồ thị. Bản sửa này tập trung giao diện, khả năng tiếp cận và phân phối ảnh/font, đồng bộ schema với breadcrumb hiện có.
