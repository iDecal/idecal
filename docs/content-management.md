# Quản lý nội dung bằng Sveltia CMS

Trang quản trị: `https://idecal.pages.dev/admin/`.
Hướng dẫn cho chủ website: `/quan-ly-noi-dung/`.

## Đăng nhập

Backend GitHub trỏ đến `iDecal/idecal`, nhánh `main`. Người quản lý cần có quyền ghi repository. Đăng nhập bằng fine-grained personal access token: chọn chủ sở hữu iDecal, chỉ repository idecal, quyền Contents: Read and write; Metadata: Read được GitHub thêm tự động. Nhập token trực tiếp trong CMS, không ghi vào mã nguồn, cấu hình, tài liệu, chat hoặc biến môi trường build. Nếu tổ chức yêu cầu duyệt token, chủ tổ chức cần duyệt trước. Token được Sveltia lưu trong localStorage của trình duyệt; đăng xuất khi dùng máy chung.

Chưa cấu hình OAuth App hoặc máy chủ OAuth. `backend.auth_methods: [token]` chỉ hiển thị phương thức đăng nhập đang hỗ trợ, không đưa ra nút GitHub OAuth chưa hoạt động. Không có mật khẩu quản trị dùng chung hay endpoint ghi công khai.

## Nội dung quản lý

- Bài viết Markdown trong `src/content/blog`: tiêu đề, chuyên mục, ngày, ảnh, nội dung và SEO; tạo bài mới hoặc sửa bài có sẵn. Tên tệp của bài cũ không được đổi để bảo toàn URL. Trường metadata chưa đưa ra biểu mẫu được Sveltia giữ lại theo cơ chế bảo toàn dữ liệu hiện có.
- Hồ sơ công trình trong `src/content/projects`: nội dung, khách hàng, loại công trình, địa điểm và thư viện ảnh.
- Sản phẩm trong `src/data/products.json`: sửa các sản phẩm hiện có, giữ nguyên slug và danh sách. Thông số/metadata khác không đưa ra biểu mẫu được bảo toàn; không đưa tồn kho/ngừng mẫu vào nội dung bán hàng. Việc thêm sản phẩm mới cần đồng bộ URL cũ/redirect nên chưa mở thao tác thêm trong biểu mẫu.
- Quận/huyện trong `src/data/districts.json`: đặc điểm địa phương, đoạn giới thiệu và khảo sát của trang dùng mẫu, câu hỏi chính. Các trang Quận 1, 2, 3, 4, 12 và Tân Bình dùng nội dung gốc riêng; CMS chỉ sửa đoạn bổ sung địa phương ngoài bài gốc. Nhà Bè nằm trong `mergedAreas` của Quận 7.
- Đặc điểm địa phương của 8 tỉnh/thành phố trong `src/data/region-context.json`: đoạn ứng dụng có nhắc địa danh, được render trên cả trang dùng mẫu và trang riêng.
- Nội dung biên tập riêng Vũng Tàu, Bình Dương, Đồng Nai, Nha Trang trong `src/data/regional-content.json`: giới thiệu, dịch vụ, ảnh, giá và ghi chú.
- Hỏi đáp khu vực trong `src/data/local-area-content.json`; một số trang quận giữ FAQ gốc riêng theo yêu cầu bảo toàn bài nhập.
- Thư viện ảnh: có thể duyệt `public/images`, ảnh tải mới từ trường ảnh mặc định vào `public/images/uploads`, hiển thị bằng `/images/uploads`. Ảnh khu vực cần đặt đúng thư mục `public/images/khu-vuc/<slug>/`; dùng trang `/quan-ly-anh-khu-vuc` để giữ đúng địa bàn.

Phần nội dung gốc của trang chủ, trang giới thiệu và các bài HTML nhập riêng không được đưa vào trình soạn thảo tổng quát trong đợt tích hợp này. Các phần đó vẫn giữ cấu trúc hiện có.

## Lưu và xuất bản

Dùng workflow trực tiếp: lưu/xuất bản trong CMS sẽ tạo commit trên main qua quyền GitHub của người đăng nhập. Cloudflare Pages tự build và cập nhật bản web sau khi build thành công. CMS không gọi Cloudflare API, không cần token Cloudflare hoặc database. Nếu build thất bại, xem log Cloudflare và sửa/khôi phục commit; bản triển khai thành công trước vẫn hoạt động.

## Cấu hình và kiểm tra

- `public/admin/index.html`: trang tĩnh tách khỏi Astro HMR theo hướng dẫn chính thức; dùng Sveltia `0.261.0`, URL cố định kèm SRI SHA-384 và CORS. JavaScript được tải từ unpkg; trình duyệt cần truy cập được unpkg và GitHub API.
- `public/admin/config.json`: biểu mẫu CMS khớp với dữ liệu và schema Astro. Cấu hình công khai chỉ chứa tên repository, nhánh, đường dẫn và định nghĩa trường, không chứa thông tin đăng nhập.
- `public/_headers`: admin noindex/nofollow, nosniff và no-cache. Không đưa admin/hướng dẫn vào sitemap.
- Trên máy phát triển mở `/admin/index.html`; bản build hỗ trợ `/admin/`.
- Chạy `npm run check`, `npm test` và `node scripts/check-cms.mjs`.
- Cấu hình được đối chiếu JSON schema chính thức cùng phiên bản. Kiểm tra trình duyệt xác minh tải CMS, hộp thoại token, đọc đủ bài viết/công trình và mở–sửa–lưu JSON bằng File System Access API trên bản dữ liệu tách riêng trong bộ nhớ trình duyệt. Nội dung thật không bị ghi bởi bài kiểm tra. Các request tài nguyên ngoài trong bài kiểm tra được chuyển qua curl với CA/proxy được cấp sẵn, không tắt TLS verification. Chưa đăng nhập hoặc ghi thử bằng tài khoản của chủ website.

Tài liệu chính thức: https://sveltiacms.app/en/docs/frameworks/astro và https://sveltiacms.app/en/docs/backends/github .
