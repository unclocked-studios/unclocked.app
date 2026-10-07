// Stamps the shared header and footer from _partials/ into every page.
// No dependencies. Pages stay plain static HTML; run after editing a partial.
//   node scripts/build-layout.cjs          update pages
//   node scripts/build-layout.cjs --check  list out-of-date pages, exit 1 if any
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const blocks = ['header', 'footer'];

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    if (entry.name.startsWith('.') || entry.name.startsWith('_') || entry.name === 'node_modules') return [];
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : full.endsWith('.html') ? [full] : [];
  });
}

const partial = name => fs.readFileSync(path.join(root, '_partials', name + '.html'), 'utf8').replace(/\r\n/g, '\n').trimEnd();

// Replace each shared block, re-indenting the partial to the block's current indentation.
function render(html) {
  const newline = html.includes('\r\n') ? '\r\n' : '\n';
  let output = html.replace(/\r\n/g, '\n');
  for (const name of blocks) {
    const pattern = new RegExp(`^([ \\t]*)<${name} class="site-${name}">[\\s\\S]*?</${name}>`, 'm');
    if (!pattern.test(output)) throw new Error(`missing <${name} class="site-${name}">`);
    output = output.replace(pattern, (_, indent) => partial(name).split('\n').map(line => line ? indent + line : line).join('\n'));
  }
  return output.replace(/\n/g, newline);
}

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
    console.error('Out of date (run node scripts/build-layout.cjs):\n  ' + stale.join('\n  '));
    process.exit(1);
  }
  console.log(check ? 'All pages match _partials/.' : stale.length ? 'Updated:\n  ' + stale.join('\n  ') : 'All pages already up to date.');
}

module.exports = { render, run, walk };
