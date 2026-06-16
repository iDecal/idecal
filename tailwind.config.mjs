/** @type {import('tailwindcss').Config} */
export default {
content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
theme: {
extend: {
colors: {
primary: {
DEFAULT: '#00A99D',
dark: '#00897B',
light: '#DDF7F5',
},

```
			secondary: {
				DEFAULT: '#1F2937',
				light: '#374151',
			},

			accent: {
				DEFAULT: '#FFC107',
				dark: '#FFB300',
				light: '#FFF8E1',
			},

			background: '#FFFFFF',

			mainText: {
				DEFAULT: '#1F2937',
				muted: '#6B7280',
			},

			border: '#E5E7EB',

			surface: '#F5F9FA',
		},

		fontFamily: {
			body: ['Inter', 'sans-serif'],
			sans: ['Inter', 'sans-serif'],
		},

		fontSize: {
			h1: [
				'clamp(1.75rem, 3.5vw, 2.5rem)',
				{
					lineHeight: '1.2',
					fontWeight: '800',
					letterSpacing: '-0.02em',
				},
			],

			h2: [
				'clamp(1.5rem, 3vw, 2.125rem)',
				{
					lineHeight: '1.2',
					fontWeight: '800',
					letterSpacing: '-0.02em',
				},
			],

			h3: [
				'clamp(1.25rem, 2.5vw, 1.625rem)',
				{
					lineHeight: '1.3',
					fontWeight: '700',
				},
			],

			h4: [
				'1.125rem',
				{
					lineHeight: '1.4',
					fontWeight: '700',
				},
			],

			h5: [
				'1rem',
				{
					lineHeight: '1.5',
					fontWeight: '600',
				},
			],

			h6: [
				'0.875rem',
				{
					lineHeight: '1.5',
					fontWeight: '600',
					letterSpacing: '0.02em',
				},
			],
		},

		boxShadow: {
			card: '0 10px 30px rgba(0,0,0,.06)',

			brand:
				'0 12px 32px rgba(0,169,157,.18)',

			hover:
				'0 20px 50px rgba(0,0,0,.12)',
		},

		borderRadius: {
			brand: '16px',
		},
	},
},

plugins: [require('@tailwindcss/typography')],
```

};
