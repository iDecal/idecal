# Ảnh thi công thực tế theo khu vực

Trang quản lý: `/quan-ly-anh-khu-vuc` (noindex, không đưa vào menu cho khách).

1. Chọn **Thêm ảnh** ở khu vực tương ứng, đăng nhập GitHub có quyền ghi kho iDecal/idecal.
2. Kéo ảnh vào thư mục đã mở, bấm **Commit changes** vào main. Không cần sửa bài viết hoặc tạo hồ sơ công trình.
3. Sau khi Cloudflare xuất bản xong, chọn **Xem trang** để kiểm tra.

Ảnh đặt trong `public/images/khu-vuc/<slug>/`: 8 tỉnh/thành phố + 22 quận/huyện cũ. Chấp nhận JPG/JPEG, PNG, WebP, AVIF (không phân biệt chữ hoa). Tên số đầu sắp thứ tự tăng tự nhiên: 01, 02, 03… Chú thích mặc định theo khu vực. Ảnh quận/huyện cũng xuất hiện ở TP.HCM; không tự đưa ảnh vào tỉnh khác. Đổi/xóa ảnh trong thư mục rồi commit để cập nhật. Đây là quản lý qua GitHub, không phải backend upload công khai trên website.

Tùy chọn: tải thêm `captions.json` cùng thư mục:

```json
{
  "01-kinh-van-phong.jpg": {
    "caption": "Dán Decal mờ vách kính văn phòng",
    "alt": "Vách kính văn phòng sau khi dán Decal mờ"
  }
}
```

Thư viện nằm trước hồ sơ công trình trên mọi trang khu vực. Chưa có ảnh thì hiển thị trạng thái đang cập nhật; không dùng ảnh mẫu để giả làm ảnh thi công tại địa phương. Ảnh gốc trong trang Quận 12 do chủ website cung cấp được dùng khởi tạo cho Quận 12 và TP.HCM. Bấm ảnh để xem lớn; khi không có JavaScript vẫn mở được ảnh gốc.

Giữ nguyên mọi nội dung XML và 47 khối chữ gốc Quận 12. Chỉ bổ sung thư viện; các liên kết hồ sơ công trình lớn vẫn ở sau thư viện.

## Cập nhật hiển thị

Theo yêu cầu mới, các trang khu vực chỉ giữ thư viện ảnh; bỏ phần hồ sơ công trình, CTA dẫn công trình và thẻ bài liên quan trong nội dung khu vực. Trang quản lý và thao tác tải ảnh giữ nguyên.
