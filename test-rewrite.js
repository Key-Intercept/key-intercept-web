import { defineConfig } from 'astro/config';
export default defineConfig({
  rewrites: { '/wiki': '/wiki/Home' }
});
