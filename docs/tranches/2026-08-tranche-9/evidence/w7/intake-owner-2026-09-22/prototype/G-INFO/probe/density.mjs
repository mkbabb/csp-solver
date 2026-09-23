// G14 Row B density + G8 one hand, HEAD control (4256) vs prototype (4255): the minimum gap between verb
// boxes in the strip, and whether any hover note (hovered by a real pointer, settled 400 ms) overlaps a verb box.
//   node density.mjs <chromium|webkit> <rungs> <out.json>
import { chromium, webkit } from '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs';
import { writeFileSync } from 'node:fs';
const [engName, rungArg, outFile] = process.argv.slice(2);
const eng = engName === 'webkit' ? webkit : chromium;
const ARMS = { base: 'http://127.0.0.1:4256/', proto: 'http://127.0.0.1:4255/' };
const rungs = rungArg.split(',').map((s) => s.split('x').map(Number));
const browser = await eng.launch();
const out = [];
for (const [w, h] of rungs) for (const arm of ['base', 'proto']) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto(ARMS[arm], { waitUntil: 'load' });
  await page.waitForSelector('.controls-card .action-bar .info-btn', { state: 'attached', timeout: 30000 });
  await page.waitForTimeout(2500);
  const boxes = await page.evaluate(() => [...document.querySelectorAll('.action-bar .action-verbs > .icon-btn, .action-bar > .info-btn')].filter((e) => getComputedStyle(e).display !== 'none').map((e) => { const b = e.getBoundingClientRect(); return { label: e.getAttribute('aria-label'), l: b.left, r: b.right, t: b.top, b: b.bottom }; }).sort((a, b) => a.l - b.l));
  const gaps = boxes.slice(1).map((b, k) => +(b.l - boxes[k].r).toFixed(2));
  const notes = [];
  for (const b of boxes) {
    await page.mouse.move((b.l + b.r) / 2, (b.t + b.b) / 2);
    await page.waitForTimeout(400);
    const hit = await page.evaluate((boxes) => {
      const vis = [...document.querySelectorAll('.action-bar .washi-label')].filter((e) => parseFloat(getComputedStyle(e).opacity) > 0.5);
      return vis.map((e) => { const r = e.getBoundingClientRect(); let worst = 0; for (const b of boxes) { const ix = Math.max(0, Math.min(r.right, b.r) - Math.max(r.left, b.l)); const iy = Math.max(0, Math.min(r.bottom, b.b) - Math.max(r.top, b.t)); worst = Math.max(worst, ix * iy); } return { text: e.textContent.trim().slice(0, 30), overlapPx2: +worst.toFixed(1), rect: [r.left, r.top, r.right, r.bottom].map((v) => +v.toFixed(1)), inViewport: r.left >= 0 && r.right <= innerWidth && r.bottom <= innerHeight }; });
    }, boxes);
    notes.push({ verb: b.label, notes: hit });
  }
  await page.mouse.move(2, 2);
  out.push({ eng: eng.name(), arm, w, h, nVerbs: boxes.length, boxW: boxes.map((b) => +(b.r - b.l).toFixed(2)), gaps, minGap: Math.min(...gaps), notes, maxNoteOverlap: Math.max(0, ...notes.flatMap((n) => n.notes.map((x) => x.overlapPx2))), notesOffViewport: notes.flatMap((n) => n.notes.filter((x) => !x.inViewport).map((x) => x.text)) });
  await ctx.close();
}
await browser.close();
writeFileSync(outFile, JSON.stringify(out, null, 1));
for (const r of out) console.log(JSON.stringify({ eng: r.eng, arm: r.arm, w: r.w, h: r.h, nVerbs: r.nVerbs, boxW: r.boxW, gaps: r.gaps, minGap: r.minGap, maxNoteOverlap: r.maxNoteOverlap, notesOffViewport: r.notesOffViewport, noteCount: r.notes.map((n) => n.notes.length) }));
