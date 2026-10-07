// Publishing safeguards: what GitHub Pages serves, and URLs that store listings depend on.
const test = require('node:test');
const assert = require('node:assert/strict');
const { fs, path, root, read } = require('./helpers.cjs');

// Registered in the App Store, Chrome Web Store, and Microsoft Marketplace listings.
// These addresses must keep working; never remove, rename, or noindex their content pages.
const storeUrls = {
  '/': 'LoopDeck Chrome homepage',
  '/twenty5/': 'twenty5 App Store marketing (redirects to /products/twenty5/)',
  '/twenty5/support/': 'twenty5 App Store support',
  '/twenty5/privacy/': 'twenty5 App Store privacy',
  '/frame64/': 'Frame64 Chrome support',
  '/frame64/privacy/': 'Frame64 Chrome privacy',
  '/loopdeck/': 'LoopDeck Chrome support',
  '/loopdeck/privacy/': 'LoopDeck Chrome privacy',
  '/warehouse-heatmap/support/': '3D Heatmap Marketplace support',
  '/warehouse-heatmap/privacy/': '3D Heatmap Marketplace privacy',
};

test('store-registered URLs exist and serve their intended content', () => {
  for (const [route, purpose] of Object.entries(storeUrls)) {
    const file = path.join(root, route, 'index.html');
    assert.ok(fs.existsSync(file), route + ' missing (' + purpose + ')');
    const html = fs.readFileSync(file, 'utf8');
    if (route === '/twenty5/') {
      assert.match(html, /<meta http-equiv="refresh" content="0; url=\/products\/twenty5\/">/, 'twenty5 marketing URL must forward to the product page');
      continue;
    }
    assert.ok(!/name="robots" content="noindex"/.test(html), route + ' must stay indexable (' + purpose + ')');
  }
});

test('Jekyll keeps repository-only files off the site and publishes verification files', () => {
  const excluded = [...read('_config.yml').matchAll(/^\s+-\s+(\S+)\s*$/gm)].map(match => match[1]);
  for (const name of ['README.md', 'VALIDATION.md', 'package.json', 'tests', 'scripts']) assert.ok(excluded.includes(name), 'exclude ' + name);
  for (const name of ['BingSiteAuth.xml', 'CNAME', 'robots.txt', 'sitemap.xml', '404.html', 'assets']) {
    assert.ok(!excluded.includes(name), 'must stay published: ' + name);
    assert.ok(fs.existsSync(path.join(root, name)), 'missing ' + name);
  }
});
