/** @type {import('tailwindcss').Config} */
export default {
  // Quét tất cả các file trong thư mục src để nhận diện class
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  
  theme: {
    extend: {
      colors: {
        // Xanh iDecal mới: Nhạt và hiện đại hơn (không bị quá tối)
        'primary': {
          600: '#0066cc', // Màu xanh chủ đạo cho nút và icon (đã làm nhạt hơn)
          900: '#004a99', // Màu cho tiêu đề H1, H2 (thay cho màu đen/xanh đen cũ)
        },
        // Vàng điểm nhấn tinh tế cho các chi tiết nhỏ
        'accent': {
          500: '#f59e0b', 
        },
        // Màu trung tính giúp giao diện sạch sẽ, bớt rối
        'neutral': {
          50: '#f8fafc',  // Dùng làm nền cho các khối nội dung
          100: '#f1f5f9', // Dùng cho các đường kẻ (border)
        }
      }
    },
  },
  plugins: [],
}
