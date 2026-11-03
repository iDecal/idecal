# Bảng màu PVC

Bảng gồm 36 tông màu số hóa từ giá trị sRGB trên trang chính thức ORAFOL ORACAL 651, kiểm tra ngày 03/11/2026: https://www.orafol.com/en/europe/products/oracal-651-intermediate-cal. Chỉ dùng làm tham khảo màu; không khẳng định iDecal bán hàng ORACAL hoặc có sẵn các mã này.

Sửa tên màu, giá trị hiển thị và liên kết tại `src/data/pvc-colors.json`. Ba ô Trắng, Đen, Xám liên kết sản phẩm cũ. 33 trang sản phẩm màu mới có nội dung ban đầu tại `src/data/products.json`, nhóm `decal-pvc`, mã nội bộ `PVC-xxx`. Thay mô tả, ảnh minh họa, thông số, giá trong các bản ghi này khi có vật liệu thực tế. Chưa điền giá, xuất xứ, bảo hành hay tồn kho.

Ảnh SVG màu tại `public/images/pvc-colors/` là hình minh họa số hóa, không phải ảnh chụp sản phẩm. Mã tham khảo nhà sản xuất nằm riêng trong dữ liệu bảng màu; không dùng làm mã hàng iDecal.

Các ảnh bề mặt Bóng/Nhám (mờ) tại `public/images/pvc-finishes/` là hình minh họa riêng cho từng màu. `src/data/pvc-options.ts` cung cấp liên kết ảnh và nhãn lựa chọn; có thể thay các tệp SVG bằng ảnh vật liệu đã xác nhận rồi cập nhật đường dẫn ở đây. Chọn bề mặt và chọn ảnh nhỏ được đồng bộ hai chiều. Trang sản phẩm giữ quy cách cuộn nhưng không có ô hình thức mua hay kích thước cắt lẻ.
