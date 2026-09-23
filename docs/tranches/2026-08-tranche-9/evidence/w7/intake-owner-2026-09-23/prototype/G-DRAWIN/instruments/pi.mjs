// π reads at rest (t ≈ 7 s), prototype vs HEAD control: π-1 the baked pose bytes (SHA-256 of
// every canvas blob by width), π-2 the painted live-filter census, π-3 computed paint
// properties + tags over every element. usage: node pi.mjs <engine> <light|dark> <protoBase> <headBase>
import { createRequire } from 'node:module';
const require = createRequire('/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json');
const pw = require('playwright');
const [engine, theme, A, B] = process.argv.slice(2);
const BOARD = 'ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5';
const hook = () => {
  window.__blobs = [];
  const tb = HTMLCanvasElement.prototype.toBlob;
  HTMLCanvasElement.prototype.toBlob = function (cb, ...a) { const w = this.width, h = this.height; return tb.call(this, async (b) => { try { const d = await crypto.subtle.digest('SHA-256', await b.arrayBuffer()); window.__blobs.push([w, h, [...new Uint8Array(d)].slice(0, 8).map((x) => x.toString(16).padStart(2, '0')).join('')]); } catch (e) {} cb(b); }, ...a); };
};
const PROPS = ['display', 'visibility', 'opacity', 'clip-path', 'mask', 'filter', 'transform', 'color', 'background-color', 'fill', 'stroke', 'stroke-width', 'stroke-opacity', 'animation-name', 'font-family', 'font-size'];
const browser = await pw[engine].launch({ headless: true });
async function read(base) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2, colorScheme: theme });
  await ctx.addInitScript(hook);
  const page = await ctx.newPage();
  await page.goto(`${base}/?board=${BOARD}`, { waitUntil: 'load' });
  await page.waitForTimeout(7000);
  const r = await page.evaluate((PROPS) => {
    const els = [...document.querySelectorAll('body *')];
    const sig = els.map((el) => { const cs = getComputedStyle(el); const cls = (el.getAttribute('class') || '').split(/\s+/).filter((c) => c && c !== 'is-active').sort().join('.'); return `${el.tagName.toLowerCase()}.${cls}|` + PROPS.map((p) => (/(bitmap|pose-bmp|boil-frame-layer|logo-pose)/.test(cls) && p === 'opacity' ? '*' : cs.getPropertyValue(p))).join('|'); });
    const live = els.filter((el) => { if (el.closest('[style*="display: none"]')) return false; const f = el.getAttribute('filter'); if (!f || f === 'none') return false; let n = el; while (n && n.nodeType === 1) { if (getComputedStyle(n).display === 'none') return false; n = n.parentElement; } return true; }).map((el) => el.getAttribute('filter'));
    return { sig, live, blobs: window.__blobs, htmlClass: document.documentElement.className };
  }, PROPS);
  await ctx.close();
  return r;
}
const a = await read(A); const b = await read(B);
const cnt = (arr) => arr.reduce((m, s) => ((m[s] = (m[s] || 0) + 1), m), {});
const ca = cnt(a.sig), cb = cnt(b.sig); const delta = [];
for (const k of new Set([...Object.keys(ca), ...Object.keys(cb)])) if ((ca[k] || 0) !== (cb[k] || 0)) delta.push([(ca[k] || 0) - (cb[k] || 0), k.slice(0, 220)]);
const last = (bl, w) => bl.filter((x) => x[0] === w).slice(-4).map((x) => x[2]);
const widths = [...new Set(b.blobs.map((x) => x[0]))];
console.log(JSON.stringify({ engine, theme, elements: [a.sig.length, b.sig.length], sigDelta: delta, liveFilters: [a.live.length, b.live.length, a.live, b.live], htmlClass: [a.htmlClass, b.htmlClass],
  poseBytes: widths.map((w) => ({ w, proto: last(a.blobs, w), head: last(b.blobs, w), equalAsSet: JSON.stringify(last(a.blobs, w).sort()) === JSON.stringify(last(b.blobs, w).sort()) })) }, null, 1));
await browser.close();
