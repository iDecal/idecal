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
Giữ cả các nhãn tiếng Anh ở phần đầu vì chúng có trong HTML nguồn.

Bố cục trắng, chữ xanh, vàng cát dùng nhẹ ở đường nhấn. Ảnh giữ URL nguồn
và ALT/title qua cơ chế metadata hiện có. Bảng giá có vùng cuộn ngang,
nhãn truy cập và có thể dùng bàn phím trên màn hình hẹp. Hai nút gọi trong
nguồn chưa có href nay dùng tel:0866077040; nội dung chữ giữ nguyên.
Liên kết nội bộ của WordPress chuyển tới sản phẩm, blog, in decal và liên hệ
đang có. Liên kết ngoài trong bảng giá được giữ nguyên.

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
