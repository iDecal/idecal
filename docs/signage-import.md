# Dịch vụ dán decal bảng hiệu

Nguồn: HTML “Dịch vụ dán Decal bảng hiệu giá tốt, Đa dạng vật liệu Decal.html”
do chủ website gửi. Đọc file bằng parse5, không chạy JavaScript trong file.

Trang mới giữ URL/canonical nguồn /dan-decal-bang-hieu/ và H1 gốc.
Đây là trang con về nội dung của Decal quảng cáo: breadcrumb và schema dẫn về
/decal-quang-cao/, thẻ dịch vụ ở cả /decal-quang-cao/ và
/dich-vu/decal-quang-cao/. Không thay thế nội dung hai trang cha.

Dữ liệu: src/data/signage-original.json.
Đối chiếu độc lập: docs/signage-source.json, lưu hash nguồn, 125 nút chữ,
67 khối, đề mục, 6 ảnh và toàn bộ ô của hai bảng giá. Giữ đầy đủ năm nhóm
vật liệu, bốn lợi ích, năm bước thi công, sáu ứng dụng, năm cam kết.
Các nhãn tiếng Anh được lưu trong bản gốc để đối chiếu. Chủ website đã yêu cầu
làm lại UX và Việt hóa; lớp signage-presentation.ts áp dụng signage-copy.json
cho nội dung hiển thị, không ghi đè bản lưu gốc.

Bố cục trắng, chữ xanh, vàng cát dùng nhẹ ở đường nhấn. Ảnh giữ URL nguồn
và ALT/title qua cơ chế metadata hiện có. Sau lần chỉnh UX theo yêu cầu:
menu mục ngắn bám khi cuộn, có trạng thái vị trí hiện tại; bảng giá chuyển
lên sau vật liệu và có hai liên kết chọn loại báo giá. Điện thoại hiển thị
mỗi dòng giá thành thẻ, đủ tên/giá/ghi chú, dùng cùng bảng HTML có vai trò truy cập,
không nhân đôi nội dung hoặc bắt kéo ngang. Giá và đơn vị nguồn không đổi.

Đầu trang có nút nhận báo giá và liên kết gọi riêng. Liên kết báo giá đặt
dich-vu=thi-cong-decal để biểu mẫu chọn đúng dịch vụ. Liên kết nội bộ của
WordPress chuyển tới sản phẩm, blog, in decal và liên hệ đang có. Liên kết ngoài
trong bảng giá được giữ nguyên. Lớp Việt hóa chỉ thay nội dung chữ, không sửa URL.

Theo yêu cầu mới, riêng phần quy trình được rút gọn trong signage-copy.json:
tiêu đề ngắn hơn và năm bước 01–05, giữ khảo sát, duyệt mẫu, in, thi công,
bảo hành 6–12 tháng theo vật liệu/điều kiện sử dụng. Trên desktop, ảnh nguồn
ở cột trái và danh sách bước ở cột phải; dưới 901px xếp dọc. Cỡ chữ tiêu đề
bước 16px (mobile 15px), mô tả 14px (mobile 13px). Bản gốc vẫn lưu đầy đủ;
kiểm tra nội dung loại trừ đúng 11 khối quy trình đã được phép rút gọn,
đối chiếu các phần còn lại và năm mô tả mới.

Thư viện công trình bổ sung dùng dữ liệu signage-gallery.json: ảnh bài Blog
Hoa Đạt (ảnh đầu bài, 2000 × 1500) cùng các ảnh installation 36, 39, 41, 24, 37
trong installation-photo-library.json. Ảnh đã kiểm tra trực quan, gồm bảng hiệu,
decal mặt kính, chữ/logo và gian hàng triển lãm. Không sao chép lại tệp ảnh,
không thêm thông tin địa điểm/ngày thi công không có nguồn. Chú thích BIDV dùng
“phông nền” thay “backdrop”. Ảnh nguồn gốc trong bài vẫn giữ nguyên.
Dùng InstallationPhotoGallery với ảnh bổ sung truyền vào, mặc định các trang khác
vẫn lấy theo số ảnh như trước. Thư viện trang bảng hiệu dùng object-fit contain,
bấm mở ảnh nguyên khung trong hộp thoại; Escape/Đóng trả về ảnh vừa chọn.
Liên kết xem ảnh lớn hoạt động khi tắt JavaScript.

Gỡ hai chuyển hướng từ URL canonical tới /dich-vu/cat-decal/ để trang mới
hoạt động. Bốn biến thể alias /decal-bang-hieu và
/dich-vu-dan-decal-bang-hieu-chuyen-nghiep chuyển thẳng về trang mới.
Cập nhật docs/rank-math-applied-redirects.json để phản ánh đích hiện tại,
giữ nguyên các mẫu nguồn lịch sử.

Kiểm tra:

- ASTRO_TELEMETRY_DISABLED=1 npm run check
- ASTRO_TELEMETRY_DISABLED=1 npm test
- Với Astro dev ở cổng 4321: python3 scripts/test-signage.py

Browser chủ động chặn ảnh ngoài để kiểm tra cơ chế dự phòng, không dùng kết quả
này để kết luận ảnh tại máy chủ nguồn đã tải được.
