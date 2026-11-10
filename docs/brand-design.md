# Hệ màu iDecal

Đối chiếu từ hai bản thiết kế HTML người dùng cung cấp: **Máy tính-html.zip** (`Desktop.dc.html`, `DvCards.dc.html`, `Header.dc.html`, `Footer.dc.html`) và **Trang dịch vụ-html.zip** (`DichVu.dc.html`, `Header.dc.html`, `Footer.dc.html`). Các file này là tài liệu tham khảo thiết kế; không đưa runtime JavaScript của bản xuất vào website.

| Vai trò | Màu trong thiết kế | Áp dụng |
| --- | --- | --- |
| Nền đậm | `#031245` | Hero, banner và chân trang |
| Tiêu đề, nội dung chính | `#1B4F7A` | Tiêu đề thẻ và chữ trên nền sáng |
| Nội dung phụ | `#44566B` | Đoạn văn, mô tả, nhãn phụ |
| Liên kết | `#0D6B96` | Liên kết và chi tiết sản phẩm trên nền sáng |
| Điểm nhấn trên nền đậm | `#1AA7E0`, `#4CC3F5` | Nhãn, biểu tượng và chữ nổi bật |
| Nền sáng | `#FFFFFF`, `#F1F7FC` | Trang, thẻ và các phần nội dung xen kẽ |
| Viền | `#DBE3EC` | Thẻ, bộ lọc, khung nhập liệu |
| Chữ phụ trên nền đậm | `#C9D6EA` | Mô tả hero và chân trang |
| Gradient | `#0F8FE0` → `#4F46E5` → `#7D12F7` | Nút chính và tiêu đề nổi bật |

Vàng cát `#E4CFAA` và `#D1B581` là màu phụ được bổ sung theo yêu cầu chủ website. Chỉ dùng tiết chế ở tiêu đề nhỏ và biểu tượng footer, viền nhãn khu vực, nét gạch chân khi rê vào liên kết phụ. Không phủ vàng lên nền lớn hoặc thay màu nút chính; chữ trên nền trắng vẫn dùng xanh đậm để dễ đọc. Màu vàng của logo và hình minh họa hiện có được giữ riêng. Các ảnh nội dung và logo hiện có được giữ lại. Font Lexend tiếp tục được phục vụ trực tiếp từ website, gồm bộ ký tự tiếng Việt.

Màu tập trung trong `tailwind.config.mjs`; kiểu nút, tiêu đề gradient và ngữ cảnh chữ trên nền đậm nằm ở `src/styles/global.css`. Dùng `brand-dark` cùng nền navy để đoạn văn kế thừa đúng màu sáng. Thẻ nền trắng trong phần đậm có ngữ cảnh chữ riêng. Mẫu họa tiết ở `public/images/brand-pattern.svg` được trích nguyên từ nền SVG của bản thiết kế.

Website giữ cấu trúc nội dung, đường dẫn, menu gọn, trang công trình và 8 trang khu vực đã triển khai. Các file `.dc.html`, thư viện React và `support.js` của bản xuất không phải dependencies của website Astro.
