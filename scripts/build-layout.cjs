// Stamps the shared head, header, and footer from _partials/ into every page.
// No dependencies. Pages stay plain static HTML; run after editing a partial.
//   node scripts/build-layout.cjs          update pages
//   node scripts/build-layout.cjs --check  list out-of-date pages, exit 1 if any
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');

// Each shared block: the partial file and the pattern that finds it in a page.
// The pattern captures the block's indentation so pages keep their formatting.
const blocks = [
  { partial: 'head', pattern: /^([ \t]*)<!-- Shared head\b[\s\S]*?<!-- \/Shared head -->/m, marker: '<!-- Shared head -->' },
  { partial: 'header', pattern: /^([ \t]*)<header class="site-header">[\s\S]*?<\/header>/m, marker: '<header class="site-header">' },
  { partial: 'footer', pattern: /^([ \t]*)<footer class="site-footer">[\s\S]*?<\/footer>/m, marker: '<footer class="site-footer">' },
];

/** Every page under the repository root, skipping hidden (.) and unpublished (_) folders. */
function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    if (entry.name.startsWith('.') || entry.name.startsWith('_') || entry.name === 'node_modules') return [];
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : full.endsWith('.html') ? [full] : [];
  });
}

const partial = name => fs.readFileSync(path.join(root, '_partials', name + '.html'), 'utf8').replace(/\r\n/g, '\n').trimEnd();

/** Returns the page with each shared block replaced by its partial, re-indented to match. */
function render(html) {
  const newline = html.includes('\r\n') ? '\r\n' : '\n';
  let output = html.replace(/\r\n/g, '\n');
  for (const block of blocks) {
    if (!block.pattern.test(output)) throw new Error(`missing ${block.marker} block`);
    output = output.replace(block.pattern, (_, indent) =>
      partial(block.partial).split('\n').map(line => line ? indent + line : line).join('\n'));
  }
  return output.replace(/\n/g, newline);
}

/** Updates pages (or only lists them when check is true); returns out-of-date paths. */
function run({ check = false } = {}) {
  const stale = [];
  for (const file of walk(root)) {
    const html = fs.readFileSync(file, 'utf8');
    const next = render(html);
    if (next === html) continue;
    stale.push(path.relative(root, file).replaceAll('\\', '/'));
    if (!check) fs.writeFileSync(file, next);
  }
  return stale;
}

if (require.main === module) {
  const check = process.argv.includes('--check');
  const stale = run({ check });
  if (check && stale.length) {
    console.error('Out of date (run npm run build):\n  ' + stale.join('\n  '));
    process.exit(1);
  }
  console.log(check ? 'All pages match _partials/.' : stale.length ? 'Updated:\n  ' + stale.join('\n  ') : 'All pages already up to date.');
}

module.exports = { render, run, walk };
