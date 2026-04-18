import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite'; // Thêm dòng này

export default defineConfig({
  vite: {
    plugins: [tailwindcss()], // Và dòng này
  },
});
