# Biên tập Blog và địa bàn TP.HCM — 04/11/2026

83 bài được rà soát theo kế hoạch `blog-editorial-plan.json`: từ khóa chính riêng, tiêu đề SEO, mô tả, mở bài trả lời trực tiếp, tiêu đề phụ và liên kết theo ngữ cảnh. URL và ngày đăng gốc được giữ; ngày cập nhật ghi riêng. 277 ảnh trong nội dung được giữ lại. Chín bài ngắn được bổ sung hướng dẫn cụ thể; bài Toyota được sửa nội dung mẫu thành bài về dự án Decal lưới có thật trên website. Giá và ưu đãi cũ được nhận diện là thông tin lịch sử.

Liên kết đi từ nội dung bài sang vật liệu, sản phẩm, dịch vụ phù hợp; các trang sản phẩm, dịch vụ, khu vực và bài viết có nhóm bài đọc tiếp theo chủ đề. Nguồn hãng chỉ thêm khi phù hợp (ORAFOL, 3M). Không chèn liên kết ngoài hoặc lặp từ khóa để đạt điểm. Đây là tối ưu trên Astro, không phải kết quả chấm điểm của plugin Rank Math; không buộc mọi bài đạt 600 từ bằng nội dung lặp.

`npm test` kiểm tra toàn bộ trang, tài nguyên và liên kết nội bộ; metadata/schema; 22 trang địa bàn cũ; từ khóa trong tiêu đề, mô tả, mở bài và đề mục của 83 bài; tối thiểu hai đích liên kết nội bộ trong nội dung. Công cụ nhập WordPress mặc định giữ lại bài đã biên tập; chỉ ghi đè với `--overwrite-reviewed`.

## TP.HCM

Nguồn: [Nghị quyết 1685/NQ-UBTVQH15](https://xaydungchinhsach.chinhphu.vn/toan-van-nghi-quyet-so-1685-nq-ubtvqh15-sap-xep-cac-dvhc-cap-xa-cua-thanh-pho-ho-chi-minh-nam-2025-119250616211341304.htm), hoạt động từ 01/07/2025. Danh sách chứa 168 đơn vị: 113 phường, 54 xã và đặc khu Côn Đảo, bao gồm địa bàn Bình Dương và Bà Rịa–Vũng Tàu trước sắp xếp.

Tên đơn vị hiện hành được ưu tiên; tên quận/huyện cũ giúp định hướng, không mô tả ranh giới pháp lý chính xác. Trang quận cũ và URL vẫn giữ để tham chiếu; mục chọn quận/huyện bị gỡ khỏi menu. Chọn phường/xã chuyển thông tin sang form liên hệ. Danh mục hành chính không đồng nghĩa cam kết khảo sát hoặc thi công ở mọi địa chỉ; phạm vi thực hiện được xác nhận theo công trình.

### Điều chỉnh phạm vi theo yêu cầu

Trang TP.HCM và lựa chọn phường/xã trong form chỉ hiển thị 102 phường/xã thuộc TP.HCM trước sáp nhập. Không hiển thị địa bàn Bình Dương, Bà Rịa–Vũng Tàu và Côn Đảo trong danh sách này. Dữ liệu nguồn 168 đơn vị vẫn giữ để đối chiếu. Thêm danh sách liên kết trực tiếp tới 22 trang quận/huyện/TP. Thủ Đức cũ ngay trên các nhóm phường/xã; không đưa trở lại menu chính.

### Giữ nguyên tiêu đề XML — 05/11/2026

Theo yêu cầu của chủ website, khôi phục nguyên văn 71 tiêu đề bài WordPress theo XML (đối chiếu wordpressId), áp dụng cả title và seoTitle. `wordpress-original-titles.json` lưu bản đối chiếu; kiểm tra tiêu đề gốc thay cho yêu cầu bắt buộc chứa từ khóa chính. Không tự viết lại tiêu đề bài từ XML trong các lượt tối ưu tiếp theo. Các bài có sẵn ngoài XML không bị đổi trong lượt khôi phục này.
