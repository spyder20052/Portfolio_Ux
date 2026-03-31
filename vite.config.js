import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        works: resolve(__dirname, 'works.html'),
        about: resolve(__dirname, 'about.html'),
        contact: resolve(__dirname, 'contact.html'),
        photography: resolve(__dirname, 'photography.html'),
        projectDetail: resolve(__dirname, 'project-detail.html'),
        caseStudy: resolve(__dirname, 'case-study.html'),
        caseStudy2: resolve(__dirname, 'case-study-2.html'),
      },
    },
  },
});
