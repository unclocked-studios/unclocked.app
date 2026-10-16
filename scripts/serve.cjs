// Local preview only. No dependencies, build step, or public network binding.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml', '.csv': 'text/csv; charset=utf-8', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml; charset=utf-8' };
const server = http.createServer((req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (pathname.split(/[\\/]/).some(part => part.startsWith('.'))) throw new Error('Hidden path');
    let file = path.resolve(root, '.' + pathname);
    if (!file.startsWith(root + path.sep) && file !== root) throw new Error('Outside root');
    if (fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    const type = types[path.extname(file)];
    if (!type) throw new Error('Unsupported preview file');
    res.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-store' });
    fs.createReadStream(file).pipe(res);
  } catch (_) {
    // Match GitHub Pages, which serves the site's 404.html for missing paths.
    res.writeHead(404, { 'Content-Type': types['.html'], 'Cache-Control': 'no-store' });
    fs.createReadStream(path.join(root, '404.html')).pipe(res);
  }
});
server.listen(Number(process.env.PORT) || 4173, '127.0.0.1', () => console.log('Website preview: http://127.0.0.1:' + server.address().port));
