// Page structure: links resolve, markup basics hold, and the shared layout is in place.
const test = require('node:test');
const assert = require('node:assert/strict');
const { fs, path, root, read, walk, pages, relative } = require('./helpers.cjs');

test('all local links, fragments, images, and scripts resolve', () => {
  for (const file of pages) {
    const html = fs.readFileSync(file, 'utf8');
    const route = '/' + relative(file);
    for (const [, link] of html.matchAll(/(?:href|src)="([^"\s]+)"/g)) {
      if (/^(?:https?:|mailto:|data:)/.test(link)) continue;
      const url = new URL(link, 'http://local' + route);
      let target = path.join(root, decodeURIComponent(url.pathname));
      assert.ok(fs.existsSync(target), `${route}: missing ${link}`);
      if (fs.statSync(target).isDirectory()) target = path.join(target, 'index.html');
      assert.ok(fs.existsSync(target), `${route}: missing index ${link}`);
      if (url.hash) assert.ok(fs.readFileSync(target, 'utf8').includes(`id="${url.hash.slice(1)}"`), `${route}: missing fragment ${link}`);
    }
  }
});

test('every page has one h1, unique IDs, and a skip link', () => {
  for (const file of pages) {
    const html = fs.readFileSync(file, 'utf8');
    const route = relative(file);
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
    assert.equal(new Set(ids).size, ids.length, `${route}: duplicate IDs`);
    assert.equal((html.match(/<h1\b/g) || []).length, 1, `${route}: one h1 required`);
    assert.match(html, /class="skip-link"/, route);
  }
});

test('every page uses the shared header and footer from _partials/', () => {
  const { run } = require('../scripts/build-layout.cjs');
  assert.deepEqual(run({ check: true }), [], 'run npm run build');
  assert.ok(pages.length >= 18 && pages.every(file => !file.includes('_partials')));
});

test('css/style.css is generated from the modules in css/src/', () => {
  const { isCurrent } = require('../scripts/build-css.cjs');
  assert.ok(isCurrent(), 'run npm run build');
});

test('the shared navigation and footer link every product, support page, and policy', () => {
  const header = read('_partials/header.html');
  const footer = read('_partials/footer.html');
  for (const href of ['/products/', '/warehouse-heatmap/', '/products/loopdeck/', '/products/twenty5/', '/products/frame64/', '/warehouse-heatmap/mapping/']) {
    assert.ok(header.includes(`href="${href}"`), 'header: ' + href);
  }
  for (const href of ['/products/', '/support/', '/warehouse-heatmap/support/', '/loopdeck/', '/twenty5/support/', '/frame64/',
    '/warehouse-heatmap/privacy/', '/loopdeck/privacy/', '/twenty5/privacy/', '/twenty5/tos/', '/frame64/privacy/']) {
    assert.ok(footer.includes(`href="${href}"`), 'footer: ' + href);
  }
});

test('every class in css/src/ is used by a page, partial, or script', () => {
  const css = fs.readdirSync(path.join(root, 'css/src')).map(name => read('css/src/' + name)).join('\n')
    .replace(/\/\*[\s\S]*?\*\//g, '') // ignore comments
    .replace(/url\([^)]*\)|"[^"]*"|'[^']*'/g, ''); // ignore strings and URLs (e.g. ".95fr" is not a class)
  const classes = new Set([...css.matchAll(/\.(-?[a-zA-Z_][\w-]*)/g)].map(match => match[1]));
  const sources = [...pages, ...walk(path.join(root, '_partials')), ...walk(path.join(root, 'js'))]
    .map(file => fs.readFileSync(file, 'utf8')).join('\n');
  const used = name => new RegExp(`class="[^"]*\\b${name}\\b|['"]${name}['"]|\\.${name}\\b`).test(sources);
  const unused = [...classes].filter(name => !used(name));
  assert.deepEqual(unused, [], 'unused CSS classes; delete them or use them');
});

test('pages use classes instead of inline style attributes', () => {
  for (const file of pages) assert.ok(!/\sstyle="/.test(fs.readFileSync(file, 'utf8')), relative(file) + ': move inline styles into css/src/');
});
