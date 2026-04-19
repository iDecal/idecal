/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				primary: '#FBBF24',   // Vàng
				secondary: '#000000', // Đen
				accent: '#BAE6FD',    // Xanh da nhạt
				background: '#FFFFFF' // Nền trắng
			},
			fontFamily: {
				heading: ['"Be Vietnam Pro"', 'sans-serif'],
				body: ['Roboto', 'sans-serif'],
			},
		},
	},
	plugins: [],
}
