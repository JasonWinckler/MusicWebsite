const { cp, mkdir, writeFile } = require('fs/promises');
const { join } = require('path');

async function copyStatic() {
  await mkdir('dist/uploads', { recursive: true });
  await cp('uploads', 'dist/uploads', { recursive: true });
  await writeFile(join('dist', '_redirects'), '/affiliates/* /affiliates/index.html 200\n/impressum/* /impressum/index.html 200\n/datenschutz/* /datenschutz/index.html 200\n/* /index.html 200\n');
}
copyStatic().catch(error => { console.error(error); process.exitCode = 1; });
