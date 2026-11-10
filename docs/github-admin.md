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

### Kiểm thử tương thích Cloudflare runtime

Cloudflare chỉ hỗ trợ redirect manual/follow; không dùng redirect error (Node có hỗ trợ nhưng workerd sẽ ném TypeError trước khi gửi request). Các request GitHub dùng manual và kiểm tra HTTP status, không tự chuyển tiếp token/secret sang đích khác.

Bài kiểm tra runtime dùng GitHub giả lập, nhưng tạo Request và cookie AES-GCM bằng workerd thật. Chạy hai lệnh ở hai terminal:
- XDG_CONFIG_HOME=/workspace/.config WRANGLER_LOG_PATH=/tmp/idecal-auth-runtime.log WRANGLER_SEND_METRICS=false npm exec --yes --cache /workspace/.npm --package wrangler@4.160.0 -- wrangler dev scripts/fixtures/admin-auth-worker.mjs --port 8791 --ip 127.0.0.1 --compatibility-date=2026-04-17
- python3 scripts/test-admin-runtime.py

Fixture chỉ dùng để kiểm thử tại máy phát triển, không triển khai fixture lên Cloudflare.

## Thương hiệu và ảnh trong popup

Chọn thương hiệu từ danh sách hiện có (cấu hình hãng và dữ liệu sản phẩm mới nhất). Chọn Thêm thương hiệu để nhập hãng mới; khi lưu, tên được gắn vào sản phẩm và có thể chọn ở các lần chỉnh sửa tiếp theo. Tên trùng được đối chiếu không phân biệt chữ hoa/thường.

Mỗi ảnh có URL, ALT và tiêu đề riêng; có thể sửa URL, thêm hoặc bỏ ảnh. ALT/title được lưu trong imageMetadata của sản phẩm và được dùng trên ảnh chi tiết, thumbnail và thẻ sản phẩm, không ghi đè metadata của ảnh dùng chung ở sản phẩm khác.

Upload chấp nhận JPG, PNG, WebP, GIF, AVIF tối đa 5 MB. Server kiểm tra phiên, quyền ghi và chữ ký định dạng; tạo tên tệp duy nhất trong public/images/uploads. Không nhận đường dẫn ghi tùy ý và không cho SVG/HTML. Upload tạo commit media ngay; Lưu sản phẩm tạo commit dữ liệu riêng sau đó. Nếu đóng popup chưa lưu, tệp đã upload vẫn được giữ trong thư viện nhưng chưa gắn vào sản phẩm. Đường dẫn ảnh trên website có hiệu lực sau khi triển khai; ảnh xem trước trong popup dùng tệp đã chọn.

Không cần thêm secret/quyền OAuth ngoài quyền repository hiện có.

## Thêm danh mục ngay trong popup

Danh mục có nút Thêm danh mục. Nhập tên, đường dẫn được gợi ý từ tên và có thể sửa trước khi tạo. Tạo danh mục lưu ngay vào product-categories.json bằng quyền GitHub hiện có, chọn danh mục mới trong dropdown; bấm Lưu sản phẩm để đổi nhóm cho sản phẩm. Danh mục được tạo có trang riêng và hiển thị trên trang tổng hợp sản phẩm sau khi triển khai. Ảnh đại diện và liên kết dịch vụ ban đầu kế thừa nhóm đang chọn, phần mô tả/giá dùng nội dung chung, không sao chép thông tin giá của nhóm cũ.

Danh sách được đọc mới từ GitHub mỗi lần mở popup. Không tạo trùng tên (không phân biệt hoa/thường), không ghi đè đường dẫn đã có, giữ nguyên danh mục khác và kiểm tra SHA khi ghi. Danh mục đã tạo vẫn tồn tại nếu đóng popup trước khi lưu sản phẩm.
