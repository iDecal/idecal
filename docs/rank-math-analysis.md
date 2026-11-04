# Phân tích Rank Math và đối chiếu website mới

Ngày đối chiếu: 04/11/2026. Nguồn: file `rank-math-settings-2026-11-04T05-42-47-361Z.json` do người dùng cung cấp; XML WordPress và bản dựng hiện tại.

Đây là phân tích cấu hình, không phải báo cáo thứ hạng hay dữ liệu Search Console. Chưa áp dụng cấu hình Rank Math vào website mới. Không đưa file cấu hình gốc hoặc dữ liệu xác thực vào mã nguồn.

## Kết quả nhập Blog

- Nhập 71 bài có trạng thái `publish`; bỏ qua 3 bài `trash`.
- Blog hiện có 83 bài. Bài trùng slug `bao-gia-thi-cong-dan-decal-kinh-mo-tron-goi` được thay bằng nội dung gốc WP.
- Giữ nội dung, ngày đăng và chuyên mục gốc trong dữ liệu; ánh xạ bài vào 5 chuyên mục hiện tại.
- Tải 309 ảnh về máy chủ website. Có 18 URL ảnh không truy cập được: 5 URL trả 404, 11 URL ở một tên miền bị chặn và 2 ảnh LinkedIn trả 403. Các vị trí này giữ liên kết ảnh gốc thay vì ảnh vỡ; chi tiết nằm trong `wordpress-blog-import.json`.
- URL bài cũ chuyển 301 về `/blog/<slug>/`; sửa các liên kết giữa bài và mục lục, giữ ảnh bìa khi có dữ liệu phù hợp.

## Các điểm SEO quan trọng

| Ưu tiên | Cấu hình WordPress | Website mới và khuyến nghị |
| --- | --- | --- |
| Cao | Sitemap bật cho post/page/product/category; ảnh nội dung và ảnh đại diện được đưa vào sitemap. | Hiện bản dựng chưa có sitemap XML hoặc robots.txt. Nên tạo sitemap theo các route hiện tại, có ảnh, rồi khai báo URL với công cụ tìm kiếm. |
| Cao | 32 quy tắc 301 đang active, tương ứng 34 mẫu nguồn; có cả URL AMP và đường dẫn khu vực cũ. | Không sao chép nguyên bộ vì nhiều đích không tồn tại theo cấu trúc mới. Cần ánh xạ tới trang mới cuối cùng, tránh chuỗi chuyển hướng. Bản nhập Blog đã có 301 cho 71 slug; bảng rà soát 34 mẫu nguồn nằm trong CSV đi kèm. |
| Cao | Blog dùng schema `BlogPosting`; iDecal dùng `LocalBusiness`; sản phẩm dùng `Product`. | Blog mới hiện chỉ có meta chung `og:type=website`, chưa có `BlogPosting` với ngày đăng/sửa/ảnh/tác giả. Nên bổ sung đúng loại nội dung. Product schema đã có. Thông tin doanh nghiệp cần kiểm tra thực tế trước khi dựng LocalBusiness. |
| Vừa | Mẫu title bài `%title% | %sitename%`; mô tả dùng excerpt. | Tiêu đề hiện tại chưa tự thêm tên iDecal. Trong XML có 11 SEO title riêng, 23 SEO description và 46 focus keyword; cần đối chiếu từng bài trước khi thay meta. Focus keyword là dữ liệu biên tập, không bảo đảm thứ hạng. |
| Vừa | Author archive noindex, date archive tắt, post tag noindex; post/page/product/category index. | Website mới không tạo archive tác giả/ngày/tag nên không cần dựng lại để rồi noindex. Meta chung hiện `index, follow`; cần dùng trạng thái index theo route nếu sau này tạo trang tìm kiếm hoặc trang ít giá trị. |
| Vừa | Tự thêm alt từ `%filename%`; thêm image title/description; mở liên kết ngoài ở tab mới. | Đã có alt cho ảnh nhập và lazy-loading ảnh trong bài. Nên rà soát alt theo nội dung ảnh thay vì chỉ dựa tên file; không cần đưa title/caption lặp lại vào mọi ảnh. Không cần ép tất cả link ngoài mở tab mới. |
| Thấp | Breadcrumbs bật; redirect debug bật; nhiều module WP như WooCommerce, AMP, bbPress, BuddyPress. | Không khôi phục breadcrumb vì người dùng đã yêu cầu bỏ. Debug và module WordPress không áp dụng cho website Astro; chỉ giữ hành vi cần thiết, không mang cả plugin sang. |
| Cần kiểm tra | Kiểu schema mặc định cho `portfolio` đang là `FactCheck`. | Không phù hợp với công trình thi công thông thường. Không nên kế thừa cho trang dự án mới; chỉ dùng FactCheck cho nội dung kiểm chứng đúng nghĩa. |

## Thứ tự triển khai đề xuất

1. Rà soát và ánh xạ 301 cũ tới đúng route cuối; giữ URL bài Blog đã nhập.
2. Tạo sitemap/robots và bổ sung schema BlogPosting, Open Graph loại article.
3. Đối chiếu 11 SEO title và 23 description cũ; giữ ý định tìm kiếm, tránh tối ưu đồng loạt bằng từ khóa lặp.
4. Kiểm tra 18 ảnh lỗi và liên kết cũ; thay đúng ảnh khi người dùng cung cấp bản sao.
5. Xem lại bài khuyến mãi/báo giá cũ theo ngày đăng trước khi quảng bá như thông tin hiện hành. Nội dung lịch sử đang được giữ nguyên.

## Giới hạn

File cấu hình cho biết các tùy chọn plugin, không chứng minh robots.txt/sitemap/schema thực tế của website WordPress đang chạy, cũng không có số liệu lượt truy cập hoặc từ khóa. Đối chiếu trên đây dựa trên cấu hình và bản dựng tĩnh hiện tại; cần kiểm tra domain chính sau khi trỏ về website mới nếu muốn đánh giá đầy đủ.

Kết quả rà soát 34 mẫu nguồn: 6 page exists, 28 needs mapping. Các quy tắc trong CSV chỉ là dữ liệu phân tích, chưa được áp dụng.
