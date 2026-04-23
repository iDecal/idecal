import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import cloudflare from '@astrojs/cloudflare';
import { emdash } from 'emdash';

export default defineConfig({
  output: 'server',
  adapter: cloudflare(),
  integrations: [
    tailwind(),
    emdash(), // Không cần d1() ở đây nữa, EmDash sẽ tự nhận diện môi trường Cloudflare
  ],
});
