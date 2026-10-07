// Warehouse mapping request builder (js/mapping.js and the mapping page form).
const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const { read } = require('./helpers.cjs');
const { draft, emailLink, delivery } = require('../js/mapping.js');

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

/** Runs js/mapping.js against a minimal fake DOM and returns its elements. */
function mappingHarness(values, clipboard) {
  function element() {
    return {
      hidden: true, textContent: '', value: '', events: {},
      addEventListener(type, handler) { this.events[type] = handler; },
      focus() { this.focused = true; },
      select() { this.selected = true; },
      setCustomValidity(message) { this.error = message; },
    };
  }
  const names = ['name', 'company', 'format', 'count', 'levels', 'description'];
  const fields = Object.fromEntries(names.map(name => [name, element()]));
  const fieldset = { disabled: true };
  const form = element();
  form.elements = { namedItem: name => fields[name] };
  form.querySelector = () => fieldset;
  form.reportValidity = () => !fields.name.error && !fields.description.error;
  const ids = Object.fromEntries(['request-preview', 'request-status', 'copy-request', 'prepare-request', 'manual-copy-help', 'long-request-help', 'draft-details'].map(id => [id, element()]));
  ids['mapping-form'] = form;
  const window = {
    document: { getElementById: id => ids[id] },
    navigator: { clipboard },
    location: { href: 'initial' },
    FormData: class { forEach(callback) { Object.entries(values).forEach(([key, value]) => callback(value, key)); } },
  };
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
