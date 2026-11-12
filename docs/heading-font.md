# Heading font

H1–H6 use **Google Sans Flex** on all public pages, including Blog and imported content. Body copy keeps Inter; desktop/mobile navigation and footer text also use Google Sans Flex. SVG logo/icon lettering keeps its own font. The shared sizes, weight (600), colors and responsive rules remain in `heading-policy.css`.

- Files: `public/fonts/google-sans-flex/`; definitions: `src/styles/heading-font.css`.
- Official source: [Google Fonts metadata](https://github.com/google/fonts/tree/main/ofl/googlesansflex).
- WOFF2 subsets: Vietnamese, Latin extended and Latin; served locally, with `font-display: swap`.
- Google Fonts CSS version: v26, fetched 2026-11-12. Request: `https://fonts.googleapis.com/css2?family=Google+Sans+Flex:opsz,wght@1..144,100..1000&display=swap`.
- Variable axes requested: optical size 1–144 and weight 100–1000; width is normal. Headings use automatic optical sizing.
- License: SIL Open Font License 1.1, preserved at `public/fonts/google-sans-flex/OFL.txt`.

`Layout.astro` and the standalone homepage preload the Latin and Vietnamese subsets. `check-heading-policy.mjs` verifies the shared family is included on every built page with headings. Browser verification checks actual font loading, Vietnamese text, nested heading elements, body fonts and responsive overflow.
