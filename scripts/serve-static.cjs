// Local production preview: real static routes, 404s, MIME types and media ranges.
// No framework fallback. Cloudflare Pages remains the production host.
const http = require('node:http');
const fs = require('node:fs');
const fsp = require('node:fs/promises');
const path = require('node:path');
const root = path.resolve(__dirname, '../dist');
const args = process.argv.slice(2);
const port = Number(args.includes('--port') ? args[args.indexOf('--port') + 1] : 4173);
const host = args.includes('--host') ? args[args.indexOf('--host') + 1] : '127.0.0.1';
const mime = { '.ico': 'image/vnd.microsoft.icon', '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml; charset=utf-8', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.avif': 'image/avif', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.jfif': 'image/jpeg', '.mp4': 'video/mp4', '.woff2': 'font/woff2' };
const headerRules = [];
try {
  let rule;
  for (const line of fs.readFileSync(path.join(root, '_headers'), 'utf8').split('\n')) {
    if (!line.trim() || line.trimStart().startsWith('#')) continue;
    if (!/^\s/.test(line)) {
      // Host-specific Pages preview rules do not match the local preview host.
      rule = line.startsWith('/') ? { pattern: line.trim(), set: [], unset: [] } : null;
      if (rule) headerRules.push(rule);
      continue;
    }
    if (!rule) continue;
    const unset = /^\s*!\s+(.+)$/.exec(line);
    const set = /^\s+([^:]+):\s*(.*)$/.exec(line);
    if (unset) rule.unset.push(unset[1].trim().toLowerCase());
    else if (set) rule.set.push([set[1].trim().toLowerCase(), set[2]]);
  }
} catch { console.error('Build output is missing. Run npm run build first.'); process.exit(1); }
function headersForPath(pathname) {
  const headers = {};
  for (const { pattern, set, unset } of headerRules) {
    const [prefix, suffix] = pattern.split('*');
    const matches = suffix === undefined ? pathname === pattern : pathname.startsWith(prefix) && pathname.endsWith(suffix);
    if (!matches) continue;
    // Cloudflare applies removals before additions within each matching rule.
    for (const name of unset) delete headers[name];
    for (const [name, value] of set) headers[name] = headers[name] ? `${headers[name]}, ${value}` : value;
  }
  return headers;
}
async function fileResponse(request, response, file, status) {
  const stat = await fsp.stat(file);
  const headers = { ...headersForPath(new URL(request.url, 'http://localhost').pathname), 'content-type': mime[path.extname(file)] || 'application/octet-stream', 'content-length': stat.size, 'accept-ranges': 'bytes' };
  if (status === 404) headers['x-robots-tag'] = 'noindex, follow';
  if (file.includes(`${path.sep}assets${path.sep}`)) headers['cache-control'] = 'public, max-age=31536000, immutable';
  let start = 0; let end = stat.size - 1;
  if (request.headers.range && status === 200) {
    const match = /^bytes=(\d*)-(\d*)$/.exec(request.headers.range);
    if (!match || (!match[1] && !match[2])) { response.writeHead(416, { ...headers, 'content-range': `bytes */${stat.size}`, 'content-length': 0 }); return response.end(); }
    if (!match[1]) { start = Math.max(0, stat.size - Number(match[2])); }
    else { start = Number(match[1]); if (match[2]) end = Math.min(Number(match[2]), end); }
    if (start > end || start >= stat.size) { response.writeHead(416, { ...headers, 'content-range': `bytes */${stat.size}`, 'content-length': 0 }); return response.end(); }
    status = 206; headers['content-range'] = `bytes ${start}-${end}/${stat.size}`; headers['content-length'] = end - start + 1;
  }
  response.writeHead(status, headers);
  if (request.method === 'HEAD' || stat.size === 0) return response.end();
  fs.createReadStream(file, { start, end }).on('error', () => response.destroy()).pipe(response);
}
const server = http.createServer(async (request, response) => {
  try {
    if (!['GET', 'HEAD'].includes(request.method)) { response.writeHead(405, { Allow: 'GET, HEAD' }); return response.end(); }
    let pathname;
    try { pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname); } catch { response.writeHead(400); return response.end(); }
    const legacyMedia = { '/uploads/portfolio/Auftrag1.mp4': '/media/koepi-live.mp4', '/uploads/profile.png': '/media/portrait-1023.webp' };
    if (legacyMedia[pathname]) { response.writeHead(301, { Location: legacyMedia[pathname] }); return response.end(); }
    const segments = pathname.split('/');
    if (segments.some(segment => segment.startsWith('.') || segment.startsWith('_')) || pathname.includes('\\') || pathname.includes('\0')) return fileResponse(request, response, path.join(root, '404.html'), 404);
    let file = path.resolve(root, `.${pathname}`);
    if (file !== root && !file.startsWith(`${root}${path.sep}`)) return fileResponse(request, response, path.join(root, '404.html'), 404);
    const stat = await fsp.stat(file).catch(() => null);
    if (stat?.isDirectory()) {
      if (!pathname.endsWith('/')) { response.writeHead(301, { Location: `${pathname}/${new URL(request.url, 'http://localhost').search}` }); return response.end(); }
      file = path.join(file, 'index.html');
    }
    if (!(await fsp.stat(file).catch(() => null))?.isFile()) return fileResponse(request, response, path.join(root, '404.html'), 404);
    return fileResponse(request, response, file, pathname === '/404.html' ? 404 : 200);
  } catch (error) { console.error(error.message); if (!response.headersSent) response.writeHead(500); response.end(); }
});
server.on('error', error => { console.error(error.message); process.exitCode = 1; });
server.listen(port, host, () => console.log(`Static production preview listening on ${host}:${port}`));
