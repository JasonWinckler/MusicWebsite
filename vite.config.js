const { defineConfig } = require('vite');
const { resolve } = require('node:path');

module.exports = defineConfig({
  appType: 'mpa',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        home: resolve(__dirname, 'index.html'),
        english: resolve(__dirname, 'en/index.html'),
        affiliates: resolve(__dirname, 'affiliates/index.html'),
        affiliatesEnglish: resolve(__dirname, 'en/affiliates/index.html'),
        impressum: resolve(__dirname, 'impressum/index.html'),
        datenschutz: resolve(__dirname, 'datenschutz/index.html'),
        notFound: resolve(__dirname, '404.html'),
      },
    },
  },
});
