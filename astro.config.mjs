import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  
  // Thiết lập adapter để chạy trên Cloudflare Pages
  adapter: cloudflare(),
  
  integrations: [
    // Kích hoạt Tailwind CSS
    tailwind({
      // Giúp Tailwind nhận diện các file cấu hình riêng của bạn
      applyBaseStyles: false, 
    }),
  ],
});
