import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import cloudflare from '@astrojs/cloudflare';
import { emdash } from 'emdash';
import { d1 } from 'emdash/db/cloudflare'; // Sửa dòng này để khớp với bản mới

export default defineConfig({
  output: 'server',
  adapter: cloudflare(),
  integrations: [
    tailwind(),
    emdash({
      db: d1(),
    }),
  ],
});
