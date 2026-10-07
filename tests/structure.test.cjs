// Page structure: links resolve, markup basics hold, and the shared layout is in place.
const test = require('node:test');
const assert = require('node:assert/strict');
const { fs, path, root, read, pages, relative } = require('./helpers.cjs');

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

test('the shared navigation and footer link every product, support page, and policy', () => {
  const header = read('_partials/header.html');
  const footer = read('_partials/footer.html');
  for (const href of ['/warehouse-heatmap/', '/products/loopdeck/', '/products/twenty5/', '/products/frame64/', '/warehouse-heatmap/mapping/']) {
    assert.ok(header.includes(`href="${href}"`), 'header: ' + href);
  }
  for (const href of ['/support/', '/warehouse-heatmap/support/', '/loopdeck/', '/twenty5/support/', '/frame64/',
    '/warehouse-heatmap/privacy/', '/loopdeck/privacy/', '/twenty5/privacy/', '/twenty5/tos/', '/frame64/privacy/']) {
    assert.ok(footer.includes(`href="${href}"`), 'footer: ' + href);
  }
});
