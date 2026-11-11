# Trang 404 và tìm kiếm

src/pages/404.astro tạo dist/404.html ở gốc để Cloudflare Pages dùng cho URL
không tồn tại và trả HTTP 404. Không thêm chuyển hướng bắt mọi URL về trang chủ.
Giữ nguyên cấu hình API quản trị và các chuyển hướng hiện có.

Form tìm kiếm GET trỏ tới /tim-kiem/?q=...; trang kết quả xử lý trên trình duyệt.
Cả 404 và tìm kiếm đều noindex, không thêm vào sitemap. Danh mục sản phẩm, dịch vụ,
Blog và liên kết về trang chủ vẫn truy cập được khi không có JavaScript.
Trang kết quả có thông báo hướng dẫn trong noscript.

Build tạo sitemap trước, sau đó generate-search-index.mjs đọc các URL canonical
công khai từ sitemap, lấy H1, mô tả, mã mẫu, thương hiệu và tối đa 1800 ký tự nội
dung chính cho mỗi trang. Loại script, style, SVG, dialog và nội dung hidden.
Không đưa trang noindex, quản trị hoặc bản chuyển hướng vào chỉ mục.
Chỉ mục là tài nguyên công khai; URL kết quả là đường dẫn nội bộ.

Tìm kiếm không phân biệt hoa thường/dấu tiếng Việt, hỗ trợ đ/Đ, mã IDC-008,
IDC 008 và IDC008. Ưu tiên tiêu đề và mã mẫu, mọi từ trong truy vấn cần khớp
hoặc khớp cụm liền trong tiêu đề/từ khóa. Hiển thị 12 kết quả đầu, nút xem thêm
và thông báo số kết quả. Truy vấn tối đa 120 ký tự; chữ người dùng và kết quả
được đưa vào DOM qua textContent, không chèn HTML. Có trạng thái rỗng, không tìm
thấy, lỗi tải và thử lại. Lịch sử tìm kiếm hỗ trợ nút Back/Forward.
Chỉ tải JSON khi có từ khóa đủ dài; một lượt trang dùng lại dữ liệu đã tải.

Kiểm tra:

- ASTRO_TELEMETRY_DISABLED=1 npm run check
- ASTRO_TELEMETRY_DISABLED=1 npm test
- Sau build, chạy npm run preview -- --host 127.0.0.1 --port 4322
- python3 scripts/test-search.py

Kiểm tra search dùng bản build qua Astro preview để có /search-index.json và
kiểm tra chính tệp 404.html; chỉ mục được tạo từ toàn bộ HTML build, không phải
danh sách URL tĩnh viết tay.

Theo yêu cầu cuối cùng, trang 404 dùng nền trắng, giữ chữ xanh/tím và nhấn xanh nhạt,
hai ảnh vật liệu có sẵn dẫn tới nhóm film trang trí kính và film nội thất.
Bố cục hai cột trên desktop, ảnh xếp sau ô tìm kiếm trên điện thoại.
Ba lối đi nhanh có màu riêng; không đổi thuật toán tìm kiếm và trạng thái 404.
Ảnh chỉ minh họa vật liệu, không gán thành công trình có khách hàng/địa chỉ mới.
