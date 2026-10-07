// Product facts: current names, store links, published prices, policies, and sample data.
// When a listing changes, update the page and the expected values here together.
const test = require('node:test');
const assert = require('node:assert/strict');
const { fs, path, root, read, pages, relative } = require('./helpers.cjs');

test('no page uses retired product or plan names, or the old Marketplace sample link', () => {
  for (const file of pages) {
    const html = fs.readFileSync(file, 'utf8');
    const name = relative(file);
    assert.ok(!/Warehouse(?:%20| )3D/.test(html), name + ': retired "Warehouse 3D" product name');
    assert.ok(!html.includes('Warehouse Pro'), name + ': retired "Warehouse Pro" plan name');
    assert.ok(!html.includes('customvisualspackages.powerbi.com'), name + ': old Marketplace sample link');
  }
});

test('policy pages show a "Last updated" date', () => {
  for (const file of pages.filter(file => /[\\/](privacy|tos)[\\/]/.test(file))) {
    assert.match(fs.readFileSync(file, 'utf8'), /Last updated: [A-Z][a-z]+ \d{1,2}, 20\d\d/, relative(file));
  }
});

test('3D Heatmap lists every Professional tier and the 100,000-bin limit', () => {
  const html = read('warehouse-heatmap/index.html');
  for (const price of ['$6', '$60', '$5', '$50', '$4', '$40', '$3', '$30']) assert.ok(html.includes(`<td>${price}</td>`), 'tier price ' + price);
  assert.match(html, /up to 100,000/);
});

test('LoopDeck and twenty5 link to their store listings, and LoopDeck lists its prices', () => {
  const loopdeck = read('products/loopdeck/index.html');
  assert.ok(loopdeck.includes('https://chromewebstore.google.com/detail/loopdeck-dashboard-tab-sw/ibiicjnbphicnpiadbofboldbfpfihld'));
  for (const price of ['$9.99', '$4.99', '$49.99', '$8.99', '$89.99', '$17.99', '$179.99']) assert.ok(loopdeck.includes(price), 'LoopDeck price ' + price);
  assert.ok(read('products/twenty5/index.html').includes('https://apps.apple.com/us/app/twenty5/id6748280871'));
});

test('the hosted 3D Heatmap sample report is linked as a download', () => {
  assert.ok(fs.statSync(path.join(root, 'assets/warehouse-3d/unclocked-sample-data.pbix')).size > 1e6);
  for (const file of ['index.html', 'warehouse-heatmap/index.html', 'warehouse-heatmap/support/index.html']) {
    assert.ok(read(file).includes('href="/assets/warehouse-3d/unclocked-sample-data.pbix" download'), file);
  }
});

test('the sample CSV has unique locations and numeric coordinates, dimensions, and heat values', () => {
  const sample = read('assets/warehouse-3d/warehouse_sample.csv');
  const [header, ...rows] = sample.trim().split(/\r?\n/);
  assert.equal(header, 'Location,Aisle,Bay,Level,Location_Type,PowerBI_X,PowerBI_Y,PowerBI_Z,Length,Width,Height,Value');
  assert.equal(rows.length, 2208);
  const names = new Set();
  for (const row of rows) {
    const columns = row.split(',');
    assert.equal(columns.length, 12);
    assert.ok(columns[0] && !names.has(columns[0]));
    names.add(columns[0]);
    assert.ok(columns.slice(5).every(value => value !== '' && Number.isFinite(Number(value))));
  }
  // The previous download URL must keep serving the same tested data.
  assert.equal(read('assets/warehouse-3d/sample-coordinates.csv'), sample);
});
