# Ảnh thi công theo sản phẩm

Thêm trường `installationImages` vào sản phẩm trong `src/data/products.json` khi có ảnh thi công phù hợp, với `src`, `alt`, `caption` và `projectSlug` (nếu có hồ sơ công trình). Không dùng hình màu SVG hoặc ảnh khác công trình để thay ảnh thi công. Bỏ trường hoặc để mảng rỗng thì phần ảnh sẽ tự ẩn.

Mẫu hiện có: `decal-mo-cat-logo-thuong-hieu` dùng ảnh ứng dụng Decal mờ kết hợp cắt chữ logo tại FDCARE, dựa trên hồ sơ `src/content/projects/in-an-thi-cong-decal-DFcare-quan-9.md`. Caption mô tả loại ứng dụng; không khẳng định một mã màu hoặc quy cách cụ thể đã dùng ở công trình.

Khối sản phẩm cùng danh mục hiển thị tối đa 4 mẫu, loại trừ chính sản phẩm đang xem. Mẫu PVC liên kết trong bảng màu được gom cùng nhóm, kể cả ba sản phẩm Trắng/Đen/Xám vốn thuộc nhóm dữ liệu cũ. Không khôi phục gợi ý sản phẩm trên các trang dịch vụ.
