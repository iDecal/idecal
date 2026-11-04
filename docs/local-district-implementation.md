# Local dịch vụ quận/huyện cho iDecal

Triển khai 04/11/2026 theo yêu cầu tích hợp vào iDecal, sau khi xem bộ `decalpro-main.zip`.

## Phạm vi

- 22 landing tại `/khu-vuc/tp-hcm/<slug>`; dữ liệu tập trung trong `src/data/districts.json`, kiểu dữ liệu và liên kết dùng chung tại `src/data/districts.ts`.
- Mỗi khu vực có giới thiệu, lưu ý công trình và một câu hỏi/giải đáp riêng; các dịch vụ, sản phẩm và bảng giá dẫn về nội dung đã có.
- Danh mục 4 nhóm trên trang TP.HCM, một liên kết chọn quận/huyện trong menu Khu vực. Không đưa danh sách 22 mục lên toàn bộ menu.
- Giữ font Inter/Lexend, ảnh minh họa sẵn có và gradient phụ nhạt của iDecal. Không sao chép thương hiệu, số điện thoại, bố cục hoặc lời hứa vận hành của DecalPro.
- Đây là tên khu vực tìm kiếm theo cách gọi phổ biến/địa bàn cũ, không phải danh sách đơn vị hành chính hiện hành. Form yêu cầu địa chỉ theo phường/xã hiện tại.

## Dữ liệu thật và SEO

- Dùng Service schema với `areaServed: Place`, provider trỏ về một Organization iDecal. Không tạo chi nhánh, địa chỉ, đánh giá hoặc tọa độ tại từng quận.
- Ảnh không có xác nhận địa phương được ghi là minh họa. Riêng trang Thủ Đức có thể dẫn đến hồ sơ FDCARE Quận 9 đã có trong dữ liệu công trình.
- Bài Blog liên quan được tìm theo tên khu vực trong tiêu đề; không đổi nội dung hay gán chúng thành hồ sơ công trình mới.
- Title/canonical riêng cho từng trang, sitemap tự thêm khi build. Alias của code tham khảo và các cách gọi cũ được chuyển 301; Quận 2/9/`thu-duc` về landing khu vực Thủ Đức.
- Các redirect Rank Math trước đây đưa quận về trang TP.HCM nay được đưa đến landing tương ứng khi có; những URL cấp thành phố vẫn giữ trang TP.HCM.

## Form Liên hệ

Link từ landing chứa `dich-vu=thi-cong-decal&khu-vuc=tp-hcm&dia-ban=<slug>`. Form chọn sẵn dịch vụ, vùng và địa bàn. Khi đổi sang tỉnh/thành khác, lựa chọn địa bàn bị ẩn và không đưa vào nội dung yêu cầu. Giá trị query chỉ được chấp nhận nếu có trong option đã định nghĩa.

Không tự gửi Zalo hoặc nhận lịch tự động. Form soạn nội dung để khách kiểm tra, sao chép và gửi như luồng hiện có.

## Biên tập tiếp

Chỉnh dữ liệu riêng từng khu vực trong JSON. Bổ sung ảnh/công trình theo địa chỉ đã xác minh; không dùng tên quận làm bằng chứng công trình. Thêm phường/xã hoặc phạm vi phục vụ chi tiết khi có dữ liệu vận hành được xác nhận.

Kiểm tra: `npm run check`, `npm test`, gồm kiểm tra 22 route, liên kết hub, alias, sitemap và Service schema; kiểm tra trình duyệt cho giao diện và chọn địa bàn trong form.
