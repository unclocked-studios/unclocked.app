// Search and sharing metadata: titles, descriptions, canonicals, sitemap, and preview images.
const test = require('node:test');
const assert = require('node:assert/strict');
const { fs, path, root, read, pages, relative, routeOf } = require('./helpers.cjs');

const noindex = html => /<meta name="robots" content="noindex">/.test(html);

test('indexable pages have unique titles, descriptions, and self-canonicals that match the sitemap', () => {
  const listed = [...read('sitemap.xml').matchAll(/<loc>https:\/\/unclocked\.app([^<]*)<\/loc>/g)].map(match => match[1]).sort();
  const indexable = [];
  const titles = new Set();
  for (const file of pages) {
    const html = fs.readFileSync(file, 'utf8');
    const name = relative(file);
    if (noindex(html)) {
      assert.ok(!/rel="canonical"/.test(html), name + ': noindex pages should not declare a canonical');
      continue;
    }
    const route = routeOf(file);
    indexable.push(route);
    const title = html.match(/<title>([^<]+)<\/title>/)[1];
    assert.ok(!titles.has(title), name + ': duplicate title ' + title);
    titles.add(title);
    assert.match(html, /<meta name="description"\s+content="[^"]{50,}">/, name + ': description');
    assert.ok(html.includes(`<link rel="canonical" href="https://unclocked.app${route}">`), name + ': canonical');
  }
  assert.deepEqual(listed, indexable.sort());
});

test('robots.txt points to the sitemap and the 404 page is not indexed', () => {
  assert.match(read('robots.txt'), /^Sitemap: https:\/\/unclocked\.app\/sitemap\.xml$/m);
  assert.ok(noindex(read('404.html')));
});

test('share images exist and declare their real dimensions', () => {
  for (const file of pages) {
    const html = fs.readFileSync(file, 'utf8');
    const image = html.match(/<meta property="og:image" content="https:\/\/unclocked\.app([^"]+)">/);
    if (!image) continue;
    const png = fs.readFileSync(path.join(root, image[1]));
    assert.equal(png.toString('ascii', 1, 4), 'PNG', image[1]);
    // PNG IHDR: width and height are big-endian integers at bytes 16 and 20.
    assert.equal(html.match(/og:image:width" content="(\d+)"/)[1], String(png.readUInt32BE(16)), image[1] + ' width');
    assert.equal(html.match(/og:image:height" content="(\d+)"/)[1], String(png.readUInt32BE(20)), image[1] + ' height');
  }
});
