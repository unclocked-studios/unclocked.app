// Light/dark appearance: boot script, the appearance menu, and color contrast.
const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const { read } = require('./helpers.cjs');

test('theme boot handles missing, invalid, saved, and unavailable storage', () => {
  const cases = [[null, 'system'], ['nonsense', 'system'], ['system', 'system'], ['dark', 'dark'], ['light', 'light'], [new Error('Blocked'), 'system']];
  for (const [stored, expected] of cases) {
    const document = { documentElement: { dataset: {} } };
    const localStorage = { getItem() { if (stored instanceof Error) throw stored; return stored; } };
    vm.runInNewContext(read('js/theme.js'), { document, localStorage });
    assert.equal(document.documentElement.dataset.appearance, expected);
  }
});

test('appearance selection still works when storage writes are blocked', () => {
  const rootElement = { dataset: { appearance: 'system' } };
  const wrapper = { hidden: true };
  const select = { events: {}, closest: () => wrapper, addEventListener(type, callback) { this.events[type] = callback; } };
  const document = { documentElement: rootElement, getElementById: id => id === 'appearance' ? select : null, querySelector: () => null };
  vm.runInNewContext(read('js/site.js'), { document, localStorage: { setItem() { throw new Error('Blocked'); } } });
  select.value = 'light';
  select.events.change();
  assert.equal(rootElement.dataset.appearance, 'light');
  assert.equal(wrapper.hidden, false);
});

test('theme palettes and primary action provide readable text contrast (WCAG AA, 4.5:1)', () => {
  // Relative luminance per WCAG 2.x.
  const luminance = hex => {
    const [r, g, b] = hex.match(/\w\w/g).map(value => parseInt(value, 16) / 255)
      .map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4);
    return r * .2126 + g * .7152 + b * .0722;
  };
  const ratio = (a, b) => { const x = luminance(a), y = luminance(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
  const pairs = [
    ['23232a', 'f7f7f9'], ['586070', 'f0f2f6'], ['b32649', 'fbe9ee'], // light: text, muted, accent
    ['f3f4f7', '20232b'], ['b5becf', '2b303a'], ['ff91ac', '502738'], // dark: text, muted, accent
    ['ffffff', 'c83256'], // primary button
  ];
  for (const [text, background] of pairs) assert.ok(ratio(text, background) >= 4.5, `${text} on ${background}`);
});
