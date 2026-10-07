// Shared helpers for the site tests. Each *.test.cjs file covers one topic;
// run them all with `npm test`.
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');

/** Read a repository file as UTF-8, relative to the repository root. */
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

/** All files under `dir`, skipping hidden (`.`) and unpublished (`_`) folders and files. */
function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    if (/^[._]/.test(entry.name) || entry.name === 'node_modules') return [];
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

/** Absolute paths of every published HTML page. */
const pages = walk(root).filter(file => file.endsWith('.html'));

/** Repository-relative path with forward slashes, e.g. `loopdeck/privacy/index.html`. */
const relative = file => path.relative(root, file).replaceAll('\\', '/');

/** Site route for a page file, e.g. `/loopdeck/privacy/`. */
const routeOf = file => '/' + relative(file).replace(/index\.html$/, '');

module.exports = { fs, path, root, read, walk, pages, relative, routeOf };
