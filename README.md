# iDecal

Website tĩnh dùng Astro 7, Tailwind CSS 3 và Markdown. Yêu cầu Node.js >=22.23.4 (đã kiểm tra với Node 24.19.0), npm >=9.6.5.

## Phát triển

```sh
npm ci
npm run dev
```

Dùng checkout hiện tại khi làm việc trong môi trường cloud; không cần tạo Git worktree. Môi trường sandbox có thể yêu cầu quyền mở cổng cho máy chủ phát triển. Không cần Cloudflare token hoặc biến môi trường để chạy website cục bộ.

## Kiểm tra

```sh
npm run check
npm test
npm audit
```

`npm test` build website và kiểm tra HTML trong `dist`: trang nội dung, liên kết nội bộ, ảnh, điểm neo, tiêu đề, landmark và canonical URL. Không kiểm tra dịch vụ bên ngoài như Zalo hoặc Google Fonts.

## Nội dung và hình ảnh

Trang chủ giữ nội dung/CSS từ HTML người dùng cung cấp; trang giới thiệu được thiết kế lại từ nội dung gốc. Xem [ghi chú nhập trang và ảnh nguồn](docs/homepage-import.md).

Hệ màu dựa trên hai bản thiết kế HTML cũ: xem [bảng màu và cách áp dụng](docs/brand-design.md).

- Catalogue: `src/data/products.json` (74 mẫu), `src/data/product-categories.json` (6 danh mục); kiểu dữ liệu và hàm dùng chung ở `src/data/catalogue.ts`.
- Trang sản phẩm: `/san-pham`, `/san-pham/[slug]`; danh mục: `/danh-muc-san-pham/[slug]`. Đường dẫn sản phẩm cũ được chuyển hướng qua `public/_redirects`.
- Ảnh có trong gói đính kèm nằm tại `public/images/catalogue`. Các ảnh khác giữ URL công khai từ `idecal.vn` và có khung dự phòng khi không tải được. Giá trong dữ liệu là giá tham khảo; không mặc định đơn vị tính hoặc tình trạng tồn kho.
- Khu vực: `src/data/regions.ts`; trang tổng hợp tại `/khu-vuc`, các trang con được tạo từ `src/pages/khu-vuc/[slug].astro`. Dữ liệu cũng dùng cho menu và chân trang.
- Blog: `src/content/blog/*.md`.
- Công trình: `src/content/projects/*.md`.
- Schema tập trung tại `src/content.config.ts`. Cả hai collection yêu cầu `title` và `pubDate`; dự án yêu cầu thêm `category`.
- Các liên kết nội dung dùng `entry.id` từ glob loader.
- Ảnh tĩnh ở `public/images`. Các ảnh còn thiếu dùng `image-placeholder.svg` có nhãn “Hình ảnh đang cập nhật”; thay bằng ảnh thật khi có tư liệu.
- Cấu hình tên miền chính tại `astro.config.mjs` (`https://idecal.vn`).

## Triển khai Cloudflare Pages

Build command: `npm run build`. Output directory: `dist`.

Toàn bộ trang được tạo tĩnh; không cần Cloudflare adapter, Worker, KV hoặc Wrangler. Đặt phiên bản Node đáp ứng yêu cầu ở trên trong môi trường build. Kiểm tra bản build cục bộ bằng `npm run preview`. Việc triển khai production chưa được thực hiện trong đợt rà soát này.

Tailwind chạy qua PostCSS. Override `postcss-selector-parser` trong `package.json` giữ dependency gián tiếp của typography ở bản đã vá bảo mật.
