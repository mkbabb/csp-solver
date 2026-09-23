// G4 coarse π: the strip's tag list + computed paint properties, HEAD control (4256) vs prototype (4255).
// Cells: 1280×800 hasTouch (the coarse rail), 390×844 and 430×932 hasTouch (the dock, sheet OPEN and SETTLED —
// the sheet slides ~700 ms, so the card's top is polled stable over 5 frames). Both themes' light only.
//   node coarse.mjs <chromium|webkit> <out.json>
import { chromium, webkit } from '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs';
import { writeFileSync } from 'node:fs';
const [engName, outFile] = process.argv.slice(2);
const eng = engName === 'webkit' ? webkit : chromium;
const ARMS = { base: 'http://127.0.0.1:4256/', proto: 'http://127.0.0.1:4255/' };
const census = () => {
  const bar = document.querySelector('.action-bar'); const card = document.querySelector('.controls-card'); const grid = document.querySelector('[role="grid"]');
  if (!bar) return { noBar: true };
  const P = ['color', 'backgroundColor', 'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth', 'fontSize', 'fontFamily', 'fontWeight', 'opacity', 'transform', 'filter', 'clipPath', 'visibility', 'display', 'position', 'zIndex'];
  const name = (e) => `${e.tagName.toLowerCase()}${e.id ? '#' + e.id : ''}.${String(e.className?.baseVal ?? e.className).trim().split(/\s+/).filter((c) => !c.startsWith('data-')).join('.')}`;
  const all = [bar, ...bar.querySelectorAll('*')];
  const rendered = all.filter((e) => { const cs = getComputedStyle(e); const r = e.getBoundingClientRect(); return cs.display !== 'none' && cs.visibility !== 'hidden' && r.width > 0 && r.height > 0; })
    .map((e) => { const cs = getComputedStyle(e); const r = e.getBoundingClientRect(); const o = { n: name(e), r: [r.left, r.top, r.width, r.height].map((v) => +v.toFixed(2)), txt: e.children.length ? '' : (e.textContent || '').trim().slice(0, 20) }; for (const p of P) o[p] = cs[p]; return o; });
  return { dom: all.map(name), rendered, barH: +bar.getBoundingClientRect().height.toFixed(2), barText: bar.innerText.replace(/\s+/g, ' ').trim(),
    cardW: card && +card.getBoundingClientRect().width.toFixed(2), cardL: card && +card.getBoundingClientRect().left.toFixed(2), boardL: grid && +grid.getBoundingClientRect().left.toFixed(2),
    infoBtn: document.querySelectorAll('.info-btn').length, fold: document.querySelectorAll('#keys-fold').length };
};
const browser = await eng.launch();
const out = [];
for (const [w, h, label] of [[1280, 800, 'coarse-rail-1280x800'], [390, 844, 'dock-390x844'], [430, 932, 'dock-430x932']]) {
  const res = {};
  for (const arm of ['base', 'proto']) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: true, isMobile: w < 1024, deviceScaleFactor: 2 });
    const page = await ctx.newPage();
    await page.goto(ARMS[arm], { waitUntil: 'load' });
    await page.waitForTimeout(4000);
    if (w < 1024 && (await page.locator('.drawer-tab').count())) {
      await page.locator('.drawer-tab').first().tap();
      await page.evaluate(() => new Promise((res) => { let last = null, stable = 0; const t0 = performance.now(); const tick = () => { const c = document.querySelector('.controls-card'); const top = c ? c.getBoundingClientRect().top : 0; if (last !== null && Math.abs(top - last) < 0.1) stable++; else stable = 0; last = top; if ((stable >= 5 && performance.now() - t0 > 700) || performance.now() - t0 > 2500) res(); else requestAnimationFrame(tick); }; requestAnimationFrame(tick); }));
    }
    res[arm] = await page.evaluate(census);
    await ctx.close();
  }
  const a = res.base, b = res.proto;
  const domAdded = b.dom.filter((x) => !a.dom.includes(x)), domRemoved = a.dom.filter((x) => !b.dom.includes(x));
  const rn = (l) => l.map((x) => x.n);
  const paintDelta = [];
  const len = Math.max(a.rendered.length, b.rendered.length);
  for (let i = 0; i < len; i++) {
    const x = a.rendered[i], y = b.rendered[i];
    if (!x || !y) { paintDelta.push({ i, base: x?.n, proto: y?.n }); continue; }
    const d = Object.keys(x).filter((k) => JSON.stringify(x[k]) !== JSON.stringify(y[k]));
    if (d.length) paintDelta.push({ i, n: [x.n, y.n], keys: d.map((k) => `${k}: ${JSON.stringify(x[k])} -> ${JSON.stringify(y[k])}`) });
  }
  out.push({ eng: eng.name(), label, renderedCount: [a.rendered.length, b.rendered.length], renderedTagsEqual: JSON.stringify(rn(a.rendered)) === JSON.stringify(rn(b.rendered)), paintDelta, domAdded, domRemoved, barH: [a.barH, b.barH], barText: [a.barText, b.barText], cardW: [a.cardW, b.cardW], cardL: [a.cardL, b.cardL], boardL: [a.boardL, b.boardL], infoBtn: [a.infoBtn, b.infoBtn], fold: [a.fold, b.fold] });
}
await browser.close();
writeFileSync(outFile, JSON.stringify(out, null, 1));
for (const r of out) console.log(JSON.stringify({ ...r, paintDelta: r.paintDelta.length ? r.paintDelta : 0 }));
