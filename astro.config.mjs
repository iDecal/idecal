import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://idecal.vn', // Thay bằng domain của bạn
  integrations: [tailwind(), sitemap()],
  // Tích hợp Tailwind CSS
  integrations: [tailwind()],
  
  // Nếu bạn dùng Cloudflare Pages, hãy bỏ comment dòng dưới sau khi cài @astrojs/cloudflare
  // output: 'server',
  // adapter: cloudflare()
});
