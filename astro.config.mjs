import { defineConfig } from 'astro/config';

// Cloudflare Pages serves the generated dist directory as a static site.
export default defineConfig({
  site: 'https://idecal.vn',
  output: 'static',
});
