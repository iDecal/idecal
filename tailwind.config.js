/** @type {import('tailwindcss').Config} */
export default {
  // PHẦN QUAN TRỌNG: Phải có dòng này để Tailwind quét code trong thư mục src
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  
  theme: {
    extend: {
      colors: {
        // Xanh đậm chuyên nghiệp cho thương hiệu iDecal
        'primary': {
          600: '#004a99', // Màu chính cho button, icon
          900: '#002b59', // Màu tiêu đề H1, H2
        },
        // Vàng điểm nhấn tinh tế
        'accent': {
          500: '#f59e0b', 
        },
        // Màu nền trung tính giúp giao diện bớt rối
        'neutral': {
          50: '#f8fafc',  
          100: '#f1f5f9', 
        }
      }
    },
  },
  plugins: [],
}
