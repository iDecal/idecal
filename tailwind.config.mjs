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
          "DEFAULT": "#006edc",
          "dark": "#0056b3",
          "light": "#E4EEF2"
        },
        "secondary": {
          "DEFAULT": "#102E57",
          "light": "#566375",
          "dark": "#0D1B36"
        },
        "accent": {
          "DEFAULT": "#E6C85B",
          "dark": "#D5B547",
          "light": "#FAF4D8"
        },
        "background": "#FFFFFF",
        "text": {
          "DEFAULT": "#102E57",
          "muted": "#566375"
        },
        "mainText": {
          "DEFAULT": "#102E57",
          "muted": "#566375"
        },
        "border": "#D7E3E9",
        "surface": "#E4EEF2",
        "ui-accent": {
          "DEFAULT": "#E4EEF2",
          "dark": "#9DBEC5"
        },
        "brand": {
          "navy": "#0D1B36",
          "sky": "#17abeb",
          "highlight": "#8bd0f5",
          "start": "#102E57",
          "middle": "#17abeb",
          "end": "#E6C85B",
          "pale": "#E4EEF2",
          "line": "#D7E3E9",
          "inverse": "#D9E6ED"
        }
      },
      "backgroundImage": {
        "brand-gradient": "linear-gradient(100deg, #102E57 0%, #17abeb 55%, #E6C85B 100%)",
        "brand-heading": "linear-gradient(90deg, #102E57 0%, #17abeb 55%, #E6C85B 100%)",
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
