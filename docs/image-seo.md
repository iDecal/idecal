# Tiêu đề và ALT ảnh

`src/data/image-seo.json` quản lý tiêu đề (`title`) và văn bản thay thế (`alt`) theo đường dẫn ảnh. Mỗi ảnh có một mục trong CMS: **Tiêu đề & ALT ảnh**. Nội dung mô tả dựa trên ảnh, mã sản phẩm, chú thích và thông tin công trình có sẵn; không đổi tên tệp, URL ảnh hoặc tự gán địa bàn cho ảnh minh họa.

Middleware áp dụng dữ liệu cho HTML khi Astro tạo trang, bao gồm ảnh trong Markdown và các bài HTML nhập gốc. Bộ phân tích HTML xác định đúng vị trí thuộc tính; chỉ thay ALT/title, không serialize lại bài viết hay sửa phần chữ, script, liên kết và bố cục. Ảnh thuần trang trí với ALT rỗng/aria-hidden/role=presentation được giữ riêng. Ảnh mới chưa có trong danh sách dùng ALT của thành phần hiện tại làm fallback cho title.

Thư viện ảnh sản phẩm và hộp xem ảnh khu vực cập nhật cả ALT và title khi người dùng đổi ảnh. Không sửa chú thích hiển thị hay metadata sản phẩm thay cho ALT.

Kiểm tra: `node scripts/check-image-seo.mjs` sau khi build. Kiểm tra toàn bộ ảnh trong HTML xuất ra, đối chiếu theo đúng src, thử tính idempotent và xác minh script/nội dung gốc/ảnh trang trí không bị đổi. Đợt rà soát có 689 ảnh duy nhất, 3.012 lần xuất hiện trên website.

Bài `giay-decal-dan-kinh-chong-nang-hieu-qua-tren-90` đã được chủ website chỉnh nội dung qua CMS trước đợt này tại commit `5b92d51`. Kiểm tra bảo toàn dùng fingerprint của bản sửa đã commit đó, giữ nguyên fingerprint bài gốc để đối chiếu lịch sử; không hoàn tác nội dung chủ website đã sửa.
