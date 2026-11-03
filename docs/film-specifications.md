# Cập nhật thông số phim cách nhiệt

Điền thông số từng mẫu tại `src/data/film-specifications.json`, theo slug sản phẩm.

| Trường | Nội dung | Đơn vị hiển thị |
| --- | --- | --- |
| `vlt` | Độ truyền sáng | % |
| `irr` | Cản tia hồng ngoại | % |
| `uvr` | Cản tia UV | % |
| `tser` | Tổng năng lượng mặt trời bị loại bỏ | % |
| `vlr` | Độ phản gương | % |
| `thicknessMil` | Độ dày phim | mil |
| `warrantyYears` | Thời hạn bảo hành | năm |

Thay `null` bằng số theo tài liệu của đúng mã phim; không nhập thêm đơn vị vì giao diện tự thêm. Giữ `null` nếu chưa có số liệu: trang sẽ hiện “Chưa cập nhật”. Không dùng thông số của một mẫu cho các mẫu khác.

Lưu và triển khai lại website để hiển thị các thay đổi. Bảng thông số nằm trong mục đóng/mở “Thông số phim cách nhiệt” trên trang chi tiết.
