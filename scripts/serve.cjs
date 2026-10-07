// Local preview server for `npm run serve`. No dependencies.
// Binds to 127.0.0.1 only, never to the network. Set PORT to change the port (default 4173).
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');

// Only these file types are served; anything else returns 404.
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.csv': 'text/csv; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.pbix': 'application/octet-stream',
};

const server = http.createServer((req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    // Never serve dotfiles such as .git, or paths that escape the repository.
    if (pathname.split(/[\\/]/).some(part => part.startsWith('.'))) throw new Error('Hidden path');
    let file = path.resolve(root, '.' + pathname);
    if (!file.startsWith(root + path.sep) && file !== root) throw new Error('Outside root');
    // Folder URLs such as /loopdeck/ serve their index.html, as GitHub Pages does.
    if (fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    const type = types[path.extname(file)];
    if (!type) throw new Error('Unsupported preview file');
    // no-store so edits show up on the next reload.
    res.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-store' });
    fs.createReadStream(file).pipe(res);
  } catch (_) {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(Number(process.env.PORT) || 4173, '127.0.0.1', () => {
  console.log('Website preview: http://127.0.0.1:' + server.address().port);
});
