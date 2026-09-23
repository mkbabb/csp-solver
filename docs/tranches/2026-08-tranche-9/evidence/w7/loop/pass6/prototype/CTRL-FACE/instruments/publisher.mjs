// T9-W7 pass 6 · CTRL-FACE · INTAKE row 2 — `--action-bar-h` writes per crib open, and G-INFO G6
// (frames > 17.5 ms per open). Arms INTERLEAVED per open; the load average is printed per round.
//   node publisher.mjs <engine> <urlA>=<labelA> <urlB>=<labelB> [N]
import { createRequire } from 'node:module';
import { loadavg } from 'node:os';
const require = createRequire('/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json');
const pw = require('playwright');
const PAYLOAD = '?size=3&difficulty=MEDIUM&board=ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5';
const [engine, ...rest] = process.argv.slice(2);
const N = +(rest.find((a) => /^\d+$/.test(a)) || 8);
const arms = rest.filter((a) => a.includes('=')).map((a) => { const i = a.lastIndexOf('='); return { url: a.slice(0, i), label: a.slice(i + 1) }; });
const br = await pw[engine].launch();
const pages = [];
for (const arm of arms) {
  const ctx = await br.newContext({ viewport: { width: 1280, height: 800 } });
  const p = await ctx.newPage();
  await p.addInitScript(() => {
    const orig = CSSStyleDeclaration.prototype.setProperty;
    window.__writes = 0;
    CSSStyleDeclaration.prototype.setProperty = function (n, ...a) {
      if (n === '--action-bar-h') window.__writes++;
      return orig.call(this, n, ...a);
    };
  });
  await p.goto(arm.url + '/' + PAYLOAD);
  await p.waitForSelector('.sudoku-cell .glyph-svg', { timeout: 30000 });
  await p.waitForTimeout(1500);
  pages.push({ ...arm, p, rows: [] });
}
for (let i = 0; i < N; i++) {
  for (const a of pages) {
    const b = await a.p.evaluate(() => { const r = document.querySelector('.info-btn').getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; });
    for (const phase of ['open', 'close']) {
      await a.p.evaluate(() => { window.__writes = 0; window.__ts = []; const loop = (t) => { window.__ts.push(t); if (window.__ts.length < 60) requestAnimationFrame(loop); }; requestAnimationFrame(loop); });
      await a.p.mouse.click(b[0], b[1]);
      await a.p.waitForTimeout(700);
      const r = await a.p.evaluate(() => { const d = window.__ts.slice(1).map((t, k) => t - window.__ts[k]); const card = document.querySelector('.controls-card'); return { writes: window.__writes, long: d.filter((x) => x > 17.5).length, max: +Math.max(...d).toFixed(1), barH: card.style.getPropertyValue('--action-bar-h'), exp: document.querySelector('.info-btn').getAttribute('aria-expanded') }; });
      a.rows.push({ i, phase, ...r, load: +loadavg()[0].toFixed(2) });
    }
  }
}
for (const a of pages) {
  const opens = a.rows.filter((r) => r.phase === 'open');
  const med = (xs) => { const s = [...xs].sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
  console.log(`${engine} ${a.label}: writes/open ${JSON.stringify(opens.map((r) => r.writes))} · writes/close ${JSON.stringify(a.rows.filter((r) => r.phase === 'close').map((r) => r.writes))} · frames>17.5ms/open ${JSON.stringify(opens.map((r) => r.long))} median ${med(opens.map((r) => r.long))} · max frame ${Math.max(...opens.map((r) => r.max))} · final bar-h ${a.rows.at(-2).barH} (open) ${a.rows.at(-1).barH} (closed) · load ${JSON.stringify([...new Set(a.rows.map((r) => r.load))].slice(0, 6))}`);
}
await br.close();
