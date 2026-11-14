# Biểu tượng dịch vụ

Bốn SVG tự thiết kế có cùng viewBox 124 × 124, nét navy, nền xanh nhạt và điểm nhấn vàng. File gốc tại `public/icons/services/`: `consultation.svg`, `design.svg`, `print-cut.svg`, `installation.svg`. Không chứa ảnh bitmap, font hoặc tài nguyên bên ngoài.

Dùng trong Astro khi có tiêu đề đi kèm:

```astro
---
import ServiceIcon from '../components/ServiceIcon.astro';
---
<ServiceIcon name="consultation" size={88} />
```

Component nhúng SVG trực tiếp và ẩn biểu tượng khỏi trình đọc màn hình để không lặp lại tiêu đề. Nếu dùng file SVG độc lập dưới dạng ảnh mang thông tin, cung cấp `alt` phù hợp. Các thẻ dịch vụ tại OfficeGlassLanding dùng bốn biểu tượng, giữ nguyên nội dung và liên kết; ảnh nguồn vẫn được lưu trữ.
