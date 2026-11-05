# FAQ, bài liên quan và liên kết khu vực

- 30 tiêu đề FAQ riêng theo địa bàn, giữ toàn bộ câu hỏi trước đây và bổ sung 60 câu hỏi mới. Nội dung tập trung vào chọn vật liệu, đọc báo giá, đo kính và điều kiện thực hiện; không thêm địa chỉ chi nhánh, lời hứa thời gian hay giá chắc chắn.
- FAQPage schema dùng cùng nguồn dữ liệu với phần hỏi đáp hiển thị. Các mục đóng mặc định. Không cam kết việc Google sẽ hiển thị rich result.
- Bài đọc tiếp ưu tiên nội dung có đúng tên địa bàn, sau đó theo dịch vụ và hướng dẫn chuẩn bị. Mỗi trang có 3 thẻ kèm ảnh, chuyên mục và tiêu đề gốc. Không sửa nội dung hoặc tiêu đề bài WordPress.
- Liên kết khu vực khác được lựa chọn bằng danh sách trong `local-area-content.json`: 2–4 địa bàn và một liên kết tổng. Các quận/huyện ưu tiên khu vực lân cận; tỉnh/thành dùng nhãn “Khu vực phục vụ khác” thay vì khẳng định tất cả ở sát nhau.
- Giữ nguyên 47 khối chữ gốc, ảnh và canonical URL của Quận 12. Các thay đổi chỉ áp dụng phần FAQ bổ sung, bài đọc tiếp và điều hướng của trang khu vực.

Kiểm tra `check-local-faq.mjs`: đủ 30 tiêu đề riêng, 105 câu trả lời hiển thị khớp schema, 3 thẻ bài cho mỗi trang và liên kết khu vực không tự trỏ vào chính trang đang xem.
