const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { execFileSync } = require('node:child_process');
const { draft, emailLink, delivery } = require('../js/mapping.js');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
function walk(dir) { return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => e.name.startsWith('.') ? [] : e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]); }
const pages = walk(root).filter(file => file.endsWith('.html'));

test('all local links, fragments, images, and scripts resolve', () => {
  for (const file of pages) {
    const html = fs.readFileSync(file, 'utf8');
    const route = '/' + path.relative(root, file).replaceAll('\\', '/');
    for (const [, link] of html.matchAll(/(?:href|src)="([^"\s]+)"/g)) {
      if (/^(?:https?:|mailto:|data:)/.test(link)) continue;
      const url = new URL(link, 'http://local' + route);
      let target = path.join(root, decodeURIComponent(url.pathname));
      assert.ok(fs.existsSync(target), `${route}: missing ${link}`);
      if (fs.statSync(target).isDirectory()) target = path.join(target, 'index.html');
      assert.ok(fs.existsSync(target), `${route}: missing index ${link}`);
      if (url.hash) assert.ok(fs.readFileSync(target, 'utf8').includes(`id="${url.hash.slice(1)}"`), `${route}: missing fragment ${link}`);
    }
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
    assert.equal(new Set(ids).size, ids.length, `${route}: duplicate IDs`);
    assert.equal((html.match(/<h1\b/g) || []).length, 1, `${route}: one h1 required`);
    assert.match(html, /class="skip-link"/);
    assert.match(html, /href="\/warehouse-heatmap\/mapping\/"/);
  }
});

test('policy main content is unchanged from the backed-up baseline', () => {
  for (const file of pages.filter(file => /[\\/](privacy|tos)[\\/]/.test(file))) {
    const relative = path.relative(root, file).replaceAll('\\', '/');
    const previous = execFileSync('git', ['show', '6ba7df5bc9877630fb1b915659992405e3d66990:' + relative], { cwd: root, encoding: 'utf8' });
    const main = html => html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)[1].replace(/\r\n/g, '\n');
    assert.equal(main(read(relative)), main(previous), relative);
  }
});

test('tested CSV has unique locations and numeric coordinates, dimensions, and heat values', () => {
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
  // Preserve the previous download URL with the same tested data.
  assert.equal(read('assets/warehouse-3d/sample-coordinates.csv'), sample);
});

test('drawing format options include DWG and DXF, with a working no-script email alternative', () => {
  const html = read('warehouse-heatmap/mapping/index.html');
  const select = html.match(/<select id="request-format"[^>]*>([\s\S]*?)<\/select>/)[1];
  const options = [...select.matchAll(/<option\b[^>]*>([^<]+)<\/option>/g)].map(match => match[1]);
  assert.deepEqual(options, ['Not sure yet', 'DWG', 'DXF', 'Other — described below']);
  assert.match(html, /<noscript>[\s\S]*?mailto:support@unclocked\.app[\s\S]*?<\/noscript>/);
  assert.match(html, /<fieldset disabled>/);
});

test('draft preserves Unicode, reserved characters, and multiline descriptions in email links', () => {
  const body = draft({ name: 'Zoë & 李', company: 'A&B #1', description: 'Aisle A + B?\nHeight: 2.5m & special labels = yes.' });
  const url = new URL(emailLink(body));
  assert.equal(url.pathname, 'support@unclocked.app');
  assert.equal(url.searchParams.get('subject'), 'Warehouse mapping request');
  assert.equal(url.searchParams.get('body'), body);
  assert.match(body, /Zoë & 李/);
  assert.match(body, /B\?\nHeight/);
  assert.match(body, /Drawing format: Not sure yet/);
});

test('oversized drafts retain all text and select copy delivery', () => {
  const description = 'Warehouse details.\n'.repeat(1500) + 'LAST DETAIL';
  const body = draft({ name: 'Test', description });
  assert.equal(delivery(body).copyRequired, true);
  assert.ok(body.includes(description));
  assert.ok(new URL(delivery(body).href).searchParams.get('body').includes('LAST DETAIL'));
  assert.equal(delivery(draft({ name: 'Test', description: 'A small layout.' })).copyRequired, false);
});

function mappingHarness(values, clipboard) {
  function element() { return { hidden: true, textContent: '', value: '', events: {}, addEventListener(type, handler) { this.events[type] = handler; }, focus() { this.focused = true; }, select() { this.selected = true; }, setCustomValidity(message) { this.error = message; } }; }
  const names = ['name', 'company', 'format', 'count', 'levels', 'description'];
  const fields = Object.fromEntries(names.map(name => [name, element()]));
  const fieldset = { disabled: true };
  const form = element();
  form.elements = { namedItem: name => fields[name] };
  form.querySelector = () => fieldset;
  form.reportValidity = () => !fields.name.error && !fields.description.error;
  const ids = Object.fromEntries(['request-preview', 'request-status', 'copy-request', 'prepare-request', 'manual-copy-help', 'long-request-help', 'draft-details'].map(id => [id, element()]));
  ids['mapping-form'] = form;
  const window = { document: { getElementById: id => ids[id] }, navigator: { clipboard }, location: { href: 'initial' }, FormData: class { forEach(callback) { Object.entries(values).forEach(([key, value]) => callback(value, key)); } } };
  vm.runInNewContext(read('js/mapping.js'), { window });
  return { ids, form, fields, fieldset, window, submit() { form.events.submit({ preventDefault() {} }); } };
}

test('request blocks empty or whitespace-only required fields', () => {
  for (const values of [{}, { name: '   ', description: '\n  ' }]) {
    const h = mappingHarness(values);
    h.submit();
    assert.equal(h.window.location.href, 'initial');
    assert.ok(h.fields.name.error && h.fields.description.error);
  }
});

test('valid request opens a draft, accurately describes the handoff, and does not report sending', () => {
  const h = mappingHarness({ name: 'Test', description: 'Please map our warehouse.' });
  assert.equal(h.fieldset.disabled, false);
  h.submit();
  assert.match(h.window.location.href, /^mailto:support@unclocked\.app/);
  assert.match(h.ids['request-status'].textContent, /Nothing has been sent/);
});

test('long request opens the complete preview without launching a truncated email', () => {
  const h = mappingHarness({ name: 'Test', description: 'x'.repeat(4000) + 'END' });
  h.submit();
  assert.equal(h.window.location.href, 'initial');
  assert.equal(h.ids['long-request-help'].hidden, false);
  assert.equal(h.ids['draft-details'].open, true);
  assert.match(h.ids['request-preview'].value, /END/);
  assert.ok(h.ids['request-preview'].selected);
});

test('clipboard success copies the full draft; failure exposes selectable manual copy', async () => {
  let copied;
  const good = mappingHarness({ name: 'Test', description: 'Layout' }, { writeText: async text => { copied = text; } });
  await good.ids['copy-request'].events.click();
  assert.equal(copied, good.ids['request-preview'].value);
  for (const clipboard of [undefined, { writeText: async () => { throw new Error('Denied'); } }]) {
    const h = mappingHarness({ name: 'Test', description: 'Layout' }, clipboard);
    await h.ids['copy-request'].events.click();
    assert.equal(h.ids['manual-copy-help'].hidden, false);
    assert.ok(h.ids['request-preview'].selected);
    assert.equal(h.ids['draft-details'].open, true);
  }
});

test('theme boot handles missing, invalid, saved, and unavailable storage', () => {
  for (const [stored, expected] of [[null, 'system'], ['nonsense', 'system'], ['system', 'system'], ['dark', 'dark'], ['light', 'light'], [new Error('Blocked'), 'system']]) {
    const document = { documentElement: { dataset: {} } };
    vm.runInNewContext(read('js/theme.js'), { document, localStorage: { getItem() { if (stored instanceof Error) throw stored; return stored; } } });
    assert.equal(document.documentElement.dataset.appearance, expected);
  }
});

test('appearance selection still works when storage writes are blocked', () => {
  const rootElement = { dataset: { appearance: 'system' } };
  const wrapper = { hidden: true };
  const select = { events: {}, closest: () => wrapper, addEventListener(type, callback) { this.events[type] = callback; } };
  const document = { documentElement: rootElement, getElementById: id => id === 'appearance' ? select : null, querySelector: () => null };
  vm.runInNewContext(read('js/site.js'), { document, localStorage: { setItem() { throw new Error('Blocked'); } } });
  select.value = 'light'; select.events.change();
  assert.equal(rootElement.dataset.appearance, 'light');
  assert.equal(wrapper.hidden, false);
});

test('theme palettes and primary action provide readable text contrast', () => {
  const luminance = hex => { const rgb = hex.match(/\w\w/g).map(value => parseInt(value, 16) / 255).map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4); return rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722; };
  const ratio = (a, b) => { const x = luminance(a), y = luminance(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
  for (const [text, background] of [['23232a', 'f7f7f9'], ['586070', 'f0f2f6'], ['b32649', 'fbe9ee'], ['f3f4f7', '20232b'], ['b5becf', '2b303a'], ['ff91ac', '502738'], ['ffffff', 'c83256']]) assert.ok(ratio(text, background) >= 4.5, `${text} on ${background}`);
});

test('product pages link to their store listings and publish plan prices', () => {
  const loopdeck = read('products/loopdeck/index.html');
  assert.ok(loopdeck.includes('https://chromewebstore.google.com/detail/loopdeck-dashboard-tab-sw/ibiicjnbphicnpiadbofboldbfpfihld'));
  for (const price of ['$9.99', '$4.99', '$49.99', '$8.99', '$89.99', '$17.99', '$179.99']) assert.ok(loopdeck.includes(price), 'LoopDeck price ' + price);
  assert.ok(read('products/twenty5/index.html').includes('https://apps.apple.com/us/app/twenty5/id6748280871'));
});
