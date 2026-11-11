import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  "content": [
    "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"
  ],
  "theme": {
    "extend": {
      "colors": {
        "primary": {
          "DEFAULT": "#0D6B96",
          "dark": "#0B6AA0",
          "light": "#D6E9F5"
        },
        "secondary": {
          "DEFAULT": "#1B4F7A",
          "light": "#44566B",
          "dark": "#031245"
        },
        "accent": {
          "DEFAULT": "#7D12F7",
          "dark": "#6D28D9",
          "light": "#F5E3FB"
        },
        "background": "#FFFFFF",
        "text": {
          "DEFAULT": "#1B4F7A",
          "muted": "#44566B"
        },
        "mainText": {
          "DEFAULT": "#1B4F7A",
          "muted": "#44566B"
        },
        "border": "#DBE3EC",
        "surface": "#F1F7FC",
        "ui-accent": {
          "DEFAULT": "#D6E9F5",
          "dark": "#93BAD8"
        },
        "brand": {
          "navy": "#031245",
          "sky": "#1AA7E0",
          "highlight": "#4CC3F5",
          "start": "#0F8FE0",
          "middle": "#4F46E5",
          "end": "#7D12F7",
          "pale": "#D6E9F5",
          "line": "#BFD0E6",
          "inverse": "#C9D6EA"
        }
      },
      "backgroundImage": {
        "brand-gradient": "linear-gradient(100deg, #0F8FE0 0%, #4F46E5 55%, #7D12F7 100%)",
        "brand-heading": "linear-gradient(90deg, #0F8FE0 0%, #4F46E5 55%, #7D12F7 100%)",
        "brand-pattern": "url('/images/brand-pattern.svg')"
      },
      "fontFamily": {
        "body": [
          "Lexend Variable",
          "sans-serif"
        ],
        "mono": [
          "Lexend Variable",
          "sans-serif"
        ],
        "sans": [
          "Lexend Variable",
          "sans-serif"
        ]
      },
      "fontSize": {
        "h1": [
          "var(--heading-h1)",
          {
            "lineHeight": "1.2",
            "fontWeight": "600",
            "letterSpacing": "-0.02em"
          }
        ],
        "h2": [
          "var(--heading-h2)",
          {
            "lineHeight": "1.2",
            "fontWeight": "600",
            "letterSpacing": "-0.02em"
          }
        ],
        "h3": [
          "var(--heading-h3)",
          {
            "lineHeight": "1.3",
            "fontWeight": "600"
          }
        ],
        "h4": [
          "var(--heading-h4)",
          {
            "lineHeight": "1.4",
            "fontWeight": "600"
          }
        ],
        "h5": [
          "var(--heading-h5)",
          {
            "lineHeight": "1.5",
            "fontWeight": "600"
          }
        ],
        "h6": [
          "var(--heading-h6)",
          {
            "lineHeight": "1.5",
            "fontWeight": "600",
            "letterSpacing": "0.02em"
          }
        ]
      },
      "boxShadow": {
        "card": "0 10px 30px rgba(0,0,0,.06)",
        "brand": "0 12px 32px rgba(79,70,229,.14)",
        "hover": "0 20px 50px rgba(0,0,0,.12)"
      },
      "borderRadius": {
        "brand": "16px"
      }
    }
  },
  plugins: [typography],
};
