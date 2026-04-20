/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				primary: {
					DEFAULT: '#17abeb',
					dark: '#1499d3',
					light: '#d0effd',
				},
				secondary: {
					DEFAULT: '#031246',
					light: '#05207c',
				},
				background: '#FFFFFF',
				text: {
					DEFAULT: '#031246', 
					muted: '#64748b',   
				},
				border: '#e2e8f0',
			},
			fontFamily: {
				sans: ['Inter', 'sans-serif'],
			},
			fontSize: {
				/* GIẢM ĐỘ ĐẬM:
				   - H1 & H2 hạ xuống 800 (Extra Bold) thay vì 900.
				   - H3 hạ xuống 700 (Bold).
				   - Các tiêu đề nhỏ giữ ở mức 600-700 để dễ đọc.
				*/
				'h1': ['clamp(1.75rem, 3.5vw, 2.5rem)', { lineHeight: '1.2', fontWeight: '800', letterSpacing: '-0.01em' }],
				'h2': ['clamp(1.5rem, 3vw, 2.125rem)', { lineHeight: '1.2', fontWeight: '800', letterSpacing: '-0.01em' }],
				'h3': ['clamp(1.25rem, 2.5vw, 1.625rem)', { lineHeight: '1.3', fontWeight: '700' }],
				'h4': ['1.125rem', { lineHeight: '1.4', fontWeight: '700' }],
				'h5': ['1rem', { lineHeight: '1.5', fontWeight: '600' }],
				'h6': ['0.875rem', { lineHeight: '1.5', fontWeight: '600', letterSpacing: '0.02em' }],
			},
			boxShadow: {
				'card': '0 8px 24px -4px rgba(3, 18, 70, 0.06)',
				'brand': '0 16px 32px -8px rgba(3, 18, 70, 0.1)',
			},
			borderRadius: {
				'brand': '12px', // Giảm độ bo góc một chút để trông cứng cáp hơn
			}
		},
	},
	plugins: [],
}
