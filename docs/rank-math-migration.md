# Đã áp dụng cấu hình SEO từ Rank Math

Ngày: 04/11/2026. Website dùng Astro, vì vậy đây là chuyển đổi hành vi SEO sang website tĩnh, không cài plugin WordPress.

## Đã thực hiện

- Title theo mẫu `Tiêu đề | iDecal`, tránh lặp tên thương hiệu nếu đã có.
- Giữ 11 SEO title riêng và 22 SEO description riêng của các bài WP. XML có 23 bản ghi description nhưng một bản ghi trùng; không tạo trường YAML trùng. Biến `%title%`, `%sitename%`, `%sep%`, `%excerpt%` được thay bằng dữ liệu bài, không chạy mã từ file nhập.
- Lưu 46 focus keyword trong frontmatter để biên tập, không xuất thành meta keywords.
- Open Graph tiếng Việt, loại `article` cho Blog, ảnh và ngày xuất bản; Twitter card ảnh lớn.
- Schema Organization/WebSite chung; BlogPosting cho 83 bài. Giữ Product/FAQ schema hiện có. Không kế thừa kiểu FactCheck cho công trình.
- Robots `index, follow` và giới hạn preview theo Rank Math. Trang đặt dịch vụ cũ có `noindex` và chuyển hướng về Liên hệ.
- Tạo sitemap có ảnh tại `/sitemap.xml`, sitemap index tại `/sitemap_index.xml`, khai báo trong `/robots.txt`. Tự cập nhật theo bản build, loại trang noindex và URL chuyển hướng. Không dùng ngày build giả làm ngày cập nhật bài.
- 34 mẫu nguồn từ 32 quy tắc Rank Math đã có đích hợp lệ, chuyển trực tiếp về route cuối. Các URL quận/Thủ Đức chưa có trang riêng được đưa về trang TP.HCM; các khu vực khác về đúng trang khu vực. URL bảng hiệu về dịch vụ cắt Decal; mẫu Decal về landing tương ứng.
- Thêm alias cho đích trung gian cũ và các URL AMP của bài WP. Tổng 398 quy tắc mới, gồm biến thể có/không dấu `/`; báo cáo máy đọc ở `rank-math-applied-redirects.json`. Giữ quy tắc sản phẩm và bài WP đã có.

## Chủ động không kế thừa

- Breadcrumbs: người dùng đã yêu cầu bỏ trong các lượt trước.
- Địa chỉ, số hotline khác và giờ làm việc từ file cũ: đang khác trang Liên hệ đã duyệt. Schema giữ tên iDecal và thông tin liên hệ đang hiển thị, chưa thêm LocalBusiness với địa chỉ hoặc giờ cũ.
- Role manager, analytics/account credentials, WooCommerce, AMP plugin, bbPress, BuddyPress và redirect debug: không áp dụng cho website Astro.
- Không nhập các trang tác giả/ngày/tag để rồi noindex; website hiện không tạo các archive này.

## Kiểm tra

`npm run check` kiểm tra Astro/TypeScript. `npm test` dựng website, tạo sitemap, kiểm tra toàn bộ trang và chạy `scripts/check-seo.mjs` để xác nhận schema bài viết, metadata, sitemap và chuyển hướng trực tiếp đến trang có thật.

Các cấu hình đã xuất bản không đồng nghĩa công cụ tìm kiếm đã thu thập hoặc lập chỉ mục. Chưa gửi sitemap vào Search Console vì phiên làm việc không có quyền truy cập tài khoản đó.
