/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				// Xanh dương sáng (Màu chính - Action/Accent)
				primary: {
					DEFAULT: '#17abeb',
					dark: '#1499d3', // Tông đậm hơn một chút cho hover
					light: '#d0effd', // Tông rất nhạt để làm nền nhấn
				},
				// Xanh đen đậm (Màu phụ - Text/Headers/Footers)
				secondary: {
					DEFAULT: '#031246',
					light: '#05207c',
				},
				// Định nghĩa rõ ràng màu nền và màu văn bản để giao diện rõ ràng
				background: '#FFFFFF', // Nền trắng thuần
				text: {
					DEFAULT: '#031246', // Chữ chính dùng màu xanh đen đậm thay vì đen thuần
					muted: '#64748b',   // Chữ phụ, mô tả (màu xám)
				},
				// Màu đường kẻ, viền (Border) để phân chia bố cục
				border: '#e2e8f0', // Xám nhạt
			},
			fontFamily: {
				// Đề xuất font Inter cho giao diện hiện đại, rõ ràng
				sans: ['Inter', 'sans-serif'],
			},
			boxShadow: {
				// Shadow rất nhẹ để làm nổi bật các khối (card) trên nền trắng
				'card': '0 2px 12px -1px rgba(3, 18, 70, 0.08)',
			},
			borderRadius: {
				'brand': '10px', // Bo góc hiện đại
			}
		},
	},
	plugins: [],
}
