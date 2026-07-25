const { defineConfig } = require('vite');
const { resolve } = require('path');

module.exports = defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: { input: {
      home: resolve(__dirname, 'index.html'),
      affiliates: resolve(__dirname, 'affiliates/index.html'),
      impressum: resolve(__dirname, 'impressum/index.html'),
      datenschutz: resolve(__dirname, 'datenschutz/index.html'),
    } },
  },
});
