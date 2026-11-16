/* Dumps the site's data (window.KLM), the Indonesian UI strings (TEKS.id) and the logo SVG as JSON,
   for _alat/halaman.py. Usage: node _alat/data.js <site root> */
const fs = require('fs'), path = require('path');
const R = path.resolve(process.argv[2] || path.join(__dirname, '..'));
global.window = global; window.KLM = {};
for (const f of ['pengaturan.js', 'konten/tanaman.js', 'konten/pengetahuan.js', 'konten/artikel.js', 'konten/buku.js']) require(path.join(R, f));
const src = fs.readFileSync(path.join(R, 'assets/js/app.js'), 'utf8');
// cut out the `var TEKS = { ... }` literal by matching braces, skipping string contents
const a = src.indexOf('{', src.indexOf('var TEKS = {'));
let d = 0, q = null, k = a;
for (; k < src.length; k++) {
  const c = src[k];
  if (q) { if (c === '\\') { k++; continue; } if (c === q) q = null; continue; }
  if (c === "'" || c === '"' || c === '`') { q = c; continue; }
  if (c === '/' && src[k + 1] === '/') { k = src.indexOf('\n', k); continue; }
  if (c === '/' && src[k + 1] === '*') { k = src.indexOf('*/', k) + 1; continue; }
  if (c === '{') d++;
  else if (c === '}' && --d === 0) break;
}
const TEKS = Function('return ' + src.slice(a, k + 1))();
const logo = (src.match(/function logoSVG\(\) \{[\s\S]*?return '([^']*)';/) || [])[1] || '';
process.stdout.write(JSON.stringify({ KLM: window.KLM, TEKS: TEKS.id, logo }));
