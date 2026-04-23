import { defineConfig } from 'astro/config';
import emdash from "emdash/astro";
import { d1 } from "emdash/db";
import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  output: 'server',
  adapter: cloudflare(),
  integrations: [
    emdash({ database: d1() })
  ],
});
