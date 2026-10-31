import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { clinic } from './src/clinic.config.ts';

export default defineConfig({
  site: clinic.siteUrl,
  output: 'static',
  devToolbar: { enabled: false },
  trailingSlash: 'always',
  integrations: [sitemap({ filter: (page) => !page.endsWith('/404/') })],
  vite: {
    build: {
      chunkSizeWarningLimit: 650,
      // Serial output avoids a mkdir race in restricted Windows filesystems.
      rollupOptions: {
        maxParallelFileOps: 1,
        output: {
          // Keep the physical renderer and softbox lookup tables in separate lazy chunks.
          manualChunks(id) {
            if (id.includes('/three/examples/jsm/lights/RectAreaLight')) return 'studio-lighting';
            if (id.includes('/node_modules/three/')) return 'three-core';
          },
        },
      },
    },
  },
});
