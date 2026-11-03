# Trang chủ và trang giới thiệu từ HTML đã lưu

Nguồn người dùng cung cấp:

- `Dịch vụ Decal dán kính cách nhiệt & Decal mờ trang trí _ iDecal©.html`
- `Giới thiệu iDecal _ Dịch vụ Decal uy tín và chuyên nghiệp.html`

## Trang chủ

`src/content/homepage/public.html` giữ nguyên phần giao diện công khai: header, các khối nội dung và footer. `source-audit.json` lưu văn bản, tiêu đề và ID của các khối để kiểm tra tính toàn vẹn nội dung. Mọi câu chữ trong `main` được kiểm tra đối chiếu với bản nguồn khi chạy `npm test`.

Toàn bộ CSS inline liên quan đến giao diện nằm ở `src/styles/homepage/source.css`, chỉ tải trên trang chủ. Không dùng `Layout.astro` cho route này để tránh CSS Tailwind của các trang khác thay đổi thiết kế nguồn. Font Lexend được phục vụ cục bộ; `compat.css` chỉ bổ sung tương tác/menu và ngữ cảnh font.

Hai HTML được lưu khi người dùng đang đăng nhập WordPress. Thanh quản trị, thống kê quản trị, thông tin tài khoản, script theo dõi và runtime WordPress không được đưa vào trang công khai. `src/scripts/homepage.ts` thay thế các tương tác menu/accordion cần thiết. Nội dung và nhãn liên kết được giữ, URL được nối tới các route đang có trong website Astro.

CSS nền công khai còn thiếu được bổ sung từ:

- WordPress Core: `https://raw.githubusercontent.com/WordPress/WordPress/master/wp-includes/blocks/navigation/style.min.css`
- WordPress Core: `https://raw.githubusercontent.com/WordPress/WordPress/master/wp-includes/css/dist/block-library/common.min.css`
- Bản mirror theme Greenshift: `https://raw.githubusercontent.com/WordPressBugBounty/themes-greenshift/main/greenshift/assets/style.min.css`

Các stylesheet WordPress/Greenshift được phân phối theo GPL-2.0-or-later; phần CSS sao chép giữ ghi chú nguồn trong file. Greenshift: tác giả Wpsoul, `https://greenshiftwp.com/`. Không chạy PHP hoặc JavaScript từ theme hay file lưu gốc.

## Tài nguyên ảnh

Hai HTML không kèm các thư mục `_files`. Ảnh có `srcset` hoặc URL trong CSS giữ nguồn gốc từ `idecal.vn`; khi nguồn đó không tải được, dùng ảnh tương ứng hiện có trong repository. Riêng ảnh `img.jpg` của phần giải pháp không còn URL gốc trong file, đang dùng ảnh iDecal sẵn có. Danh sách xử lý từng ảnh nằm ở `source-audit.json`.

Do thiếu thư mục tài nguyên, chưa thể khẳng định khớp tuyệt đối từng ảnh với bản lưu. Có thể thay ảnh dự phòng bằng đúng file gốc mà không thay đổi nội dung hoặc bố cục. Kiểm thử trong môi trường này chặn ảnh ngoài để xác nhận đường dẫn dự phòng hoạt động; không coi đó là xác minh ảnh từ website cũ.

## Trang giới thiệu

`src/data/about-page.json` chứa toàn bộ phần giới thiệu, ba năng lực, bốn tiêu chuẩn, ba nhân sự và sáu hình ảnh thi công trích từ nội dung công khai. `src/pages/gioi-thieu-idecal.astro` thiết kế lại theo hệ màu xanh–tím và Lexend của website. Ảnh đội ngũ sử dụng các ảnh iDecal sẵn có; ảnh thư viện giữ URL nguồn và có giao diện dự phòng khi không tải được.

Yêu cầu trang chủ mới thay thế bố cục trước đó, bao gồm phần ba công trình từng được thêm vào trang chủ. Trang `/du-an` và toàn bộ catalogue/khu vực vẫn được giữ và liên kết từ menu.
