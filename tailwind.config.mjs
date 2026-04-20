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
					DEFAULT: '#031246', // Xanh đen iDecal
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
				// Hệ thống H tự động co giãn (Mobile -> Desktop)
				'h1': ['clamp(2.5rem, 5vw, 4.5rem)', { lineHeight: '1.1', fontWeight: '900' }],
				'h2': ['clamp(1.75rem, 3.5vw, 3rem)', { lineHeight: '1.2', fontWeight: '900' }],
				'h3': ['clamp(1.5rem, 2.5vw, 2.25rem)', { lineHeight: '1.3', fontWeight: '800' }],
				'h4': ['clamp(1.25rem, 2vw, 1.5rem)', { lineHeight: '1.4', fontWeight: '800' }],
				'h5': ['1.125rem', { lineHeight: '1.5', fontWeight: '700' }],
				'h6': ['1rem', { lineHeight: '1.5', fontWeight: '700' }],
			},
			boxShadow: {
				'card': '0 10px 30px -5px rgba(3, 18, 70, 0.08)',
				'brand': '0 20px 40px -10px rgba(3, 18, 70, 0.15)',
			},
			borderRadius: {
				'brand': '20px', // Bo góc lớn hiện đại
			}
		},
	},
	plugins: [],
}
