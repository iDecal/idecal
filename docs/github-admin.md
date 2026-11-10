# Trang quản trị iDecal với GitHub OAuth

## Luồng sử dụng

- /admin/: trang đăng nhập riêng của iDecal, không tải Sveltia.
- Nhấn **Đăng nhập bằng GitHub**, cấp quyền, hệ thống xác minh quyền ghi repository iDecal/idecal rồi trở về /admin/.
- Chọn sản phẩm. Nút **Chỉnh sửa sản phẩm** hiện trên trang chi tiết khi cookie phiên hợp lệ.
- Lưu popup tạo commit vào main. Bản mới hiển thị sau khi Cloudflare Pages triển khai thành công.
- /admin/cms.html: Sveltia cũ để sửa bài viết và quản lý thư viện ảnh, giữ phương thức đăng nhập token riêng. Phiên OAuth không được sao chép vào localStorage để đăng nhập Sveltia.

## Cấu hình trước khi dùng đăng nhập thật

Frontend và Cloudflare Pages Functions đã được chuẩn bị; chưa cấu hình OAuth App hoặc triển khai trong tài khoản Cloudflare thật. Không đưa secret vào repository hoặc gửi trong chat.

1. Trong GitHub → Settings → Developer settings → OAuth Apps → New OAuth App, tạo ứng dụng:
   - Application name: iDecal Admin
   - Homepage URL: https://idecal.pages.dev
   - Authorization callback URL: https://idecal.pages.dev/api/admin/callback
2. Trong dự án Cloudflare Pages idecal, mục Settings → Variables and Secrets, thêm cho môi trường Production:
   - GITHUB_CLIENT_ID: Client ID của OAuth App.
   - GITHUB_CLIENT_SECRET: Client Secret của OAuth App, lưu dạng secret.
   - ADMIN_SESSION_SECRET: chuỗi ngẫu nhiên tối thiểu 32 ký tự, lưu dạng secret. Có thể tạo ở máy riêng bằng openssl rand -base64 32; không chép giá trị vào chat.
3. Triển khai lại dự án sau khi lưu biến. Giữ build command npm run build, output dist. Thư mục functions/ ở gốc repository phải được Cloudflare Pages biên dịch; không chỉ tải lên các tệp tĩnh. Không cần đổi Astro adapter.
4. Mở /admin/, đăng nhập, kiểm tra sản phẩm. Nếu tổ chức GitHub yêu cầu duyệt OAuth App, chủ tổ chức cần duyệt truy cập ứng dụng.
5. Chỉ cấu hình Preview nếu cần, bằng OAuth App riêng với callback khớp host preview. Không dùng secret production cho các preview không đáng tin cậy.

OAuth App dùng scope repo vì GitHub OAuth không có quyền Contents riêng theo repository như fine-grained PAT; người dùng xem lại quyền trên màn hình GitHub. API của iDecal chỉ cho đọc tài khoản/quyền repository và đọc/ghi src/data/products.json trên main, không cung cấp proxy GitHub tổng quát.

## Phiên và dữ liệu

Token GitHub được trao đổi ở server và mã hóa AES-GCM trong cookie __Host-idecal-admin có HttpOnly, Secure, SameSite=Lax, thời hạn 8 giờ. JavaScript không đọc được token. Khóa ADMIN_SESSION_SECRET chỉ tồn tại trong runtime Cloudflare. Đổi khóa sẽ kết thúc các phiên cũ.

OAuth có state ngẫu nhiên, PKCE S256 và cookie state hết hạn sau 10 phút. Cookie state và cookie phiên dùng ngữ cảnh mã hóa khác nhau. Các thao tác ghi/đăng xuất kiểm tra Origin; quyền ghi GitHub được xác minh lại trước mỗi thao tác API. Không ghi log request, token hay nội dung lỗi OAuth thô. Logout xóa cookie trên trình duyệt, không thu hồi toàn bộ ủy quyền OAuth trong tài khoản GitHub.

Popup giữ nguyên URL, sản phẩm khác và metadata ngoài biểu mẫu; kiểm tra xung đột trên sản phẩm và SHA toàn tệp trước khi lưu. Khi lỗi, nội dung form không bị xóa.

## Kiểm thử

- npm run check và npm test (bao gồm kiểm thử OAuth server dùng GitHub giả lập).
- python3 scripts/test-product-editor.py với Astro dev cổng 4321, Python Playwright và Chromium.
- Biên dịch Functions: XDG_CONFIG_HOME=/workspace/.config WRANGLER_LOG_PATH=/tmp/idecal-wrangler.log WRANGLER_SEND_METRICS=false npm exec --yes --cache /workspace/.npm --package wrangler@4.160.0 -- wrangler pages functions build --outdir /tmp/idecal-functions-build
- Chạy Pages local: cùng các biến logging ở trên, wrangler pages dev dist --port 8788 --ip 127.0.0.1 --compatibility-date=2026-11-10. Không có OAuth config thì /api/admin/session trả configured:false và nút đăng nhập bị vô hiệu hóa, không giả lập thành công.

Kiểm thử GitHub giả lập không chứng minh OAuth App, secret runtime, tổ chức và quyền tài khoản thật đã được thiết lập. Cần hoàn tất cấu hình trên và kiểm thử đăng nhập thật sau khi triển khai.
