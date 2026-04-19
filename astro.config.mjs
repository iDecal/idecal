import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  // Tích hợp Tailwind CSS
  integrations: [tailwind()],
  
  // Nếu bạn dùng Cloudflare Pages, hãy bỏ comment dòng dưới sau khi cài @astrojs/cloudflare
  // output: 'server',
  // adapter: cloudflare()
});
