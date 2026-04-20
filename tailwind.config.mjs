/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				// Màu vàng thương hiệu (phù hợp cho các nút báo giá, icon)
				primary: {
					DEFAULT: '#ffdf3c',
					dark: '#e6c730',
				},
				// Màu xanh đen đậm (dùng cho Header, Footer, chữ tiêu đề)
				secondary: {
					DEFAULT: '#0b3954',
					light: '#154b6d',
				},
				// Xanh da trời nhạt (phù hợp làm nền cho các section sản phẩm)
				accent: {
					DEFAULT: '#BAE6FD',
					light: '#E0F2FE',
				},
				// Bổ sung dải màu xám để làm background phân tách các khối
				surface: {
					100: '#FFFFFF', // Trắng thuần
					200: '#F8FAFC', // Xám cực nhạt (hợp với tone nền sáng bạn đang đổi)
					300: '#F1F5F9',
				}
			},
			fontFamily: {
				heading: ['"Be Vietnam Pro"', 'sans-serif'],
				body: ['Inter', 'sans-serif'],
			},
			boxShadow: {
				// Shadow nhẹ giúp các card decal/phim cách nhiệt trông nổi khối hơn
				'soft': '0 4px 20px -2px rgba(11, 57, 84, 0.05)',
			},
			borderRadius: {
				'brand': '8px', // Bo góc vừa phải, tạo cảm giác hiện đại
			}
		},
	},
	plugins: [],
}
