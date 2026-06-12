import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        projets: resolve(__dirname, 'projets.html'),
        contact: resolve(__dirname, 'contact.html'),
        about: resolve(__dirname, 'about.html'),
      },
    },
  },
});
