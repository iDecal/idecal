# Bảng màu Airify cho iDecal

Theo yêu cầu áp dụng màu từ HTML Airify: navy #102e57 cho tiêu đề, #0d1b36 cho nền tối, teal #2e9f94 cho điểm nhấn, nền #e4eef2/trắng, CTA vàng logo #f9f024. Link dùng teal đậm #18766d và nút vàng dùng chữ navy để giữ tương phản. H1 chuyển navy phẳng; tiêu đề trên nền tối vẫn trắng. Nhãn trên tiêu đề dùng nền xanh xám, bộ lọc/chuyên mục đang chọn navy chữ trắng.

`airify-colors.css` là lớp important đầu tiên để xử lý CSS màu cũ; token Tailwind cập nhật theo bảng màu mới. Giữ font Google Sans Flex/Inter, nội dung, bố cục, logo, ảnh gốc và bảng màu vật liệu. Không áp bộ font hoặc script của HTML mẫu.

Đã chạy npm test qua toàn bộ kiểm tra build, nguồn, SEO, heading, ảnh, Blog, khu vực và bảo mật. Bản CSS cuối cùng được build lại và kiểm tra bằng Playwright trên trang chủ, Đồng Nai, văn phòng, Blog và công trình ở 1440/390px: màu heading/CTA/footer đúng, font giữ nguyên và không tràn ngang. Axe trên mục lục nền tối, chuyên mục Blog và bộ lọc công trình không phát hiện vi phạm tự động. Đây là kiểm tra các khối thay đổi, không phải chứng nhận accessibility toàn website.

Theo phản hồi mới: màu cam được thay bằng vàng logo #f9f024 (RGB 249,240,36, lấy từ pixel chủ đạo của public/images/idecal-logo.png); hover #e5dc16, chữ navy giữ nguyên.

Chưa xuất bản.
