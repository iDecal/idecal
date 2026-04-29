import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import tailwind from '@astrojs/tailwind'; // THÊM DÒNG NÀY

export default defineConfig({
  output: 'static',
  adapter: cloudflare(),
  integrations: [
    tailwind(), 
  ],
});
