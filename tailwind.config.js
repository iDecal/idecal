// tailwind.config.mjs
export default {
  theme: {
    extend: {
      colors: {
        // Xanh đậm làm màu nhận diện chính (Deep Navy)
        'primary': {
          600: '#004a99', // Dùng cho Button chính, Icon quan trọng
          900: '#002b59', // Dùng cho Text Heading (H1, H2) để tạo sự sang trọng
        },
        // Vàng chỉ dùng làm điểm nhấn nhỏ (Soft Gold)
        'accent': {
          500: '#f59e0b', // Thay vì vàng tươi, dùng vàng hổ phách để dịu mắt hơn
        },
        // Màu nền trung tính để làm dịu giao diện
        'neutral': {
          50: '#f8fafc',  // Nền cho các section phụ
          100: '#f1f5f9', // Đường kẻ viền (border)
        }
      }
    }
  }
}
