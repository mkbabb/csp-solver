import { chromium } from '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs';
const base = process.argv[2];
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto(base + '/?size=3&difficulty=EASY');
await p.waitForSelector('svg.handwritten-logo', { timeout: 20000 });
await p.waitForSelector('g.boil-frame-layer.is-active', { state: 'attached', timeout: 20000 });
if (process.argv[3]) await p.addStyleTag({ content: process.argv[3] }); await p.waitForTimeout(800);
const CENSUS = () => {
  const card = document.querySelector('.controls-card');
  const inter = [...card.querySelectorAll('button')].filter(e => e.getClientRects().length);
  const out = [];
  for (const tape of card.querySelectorAll('.washi-label')) {
    const cs = getComputedStyle(tape);
    if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity < 0.05) continue;
    const t = tape.getBoundingClientRect();
    if (!t.width) continue;
    const liveTop = card.hasAttribute('data-fold-above') ? card.getBoundingClientRect().top + parseFloat(getComputedStyle(card).paddingTop) : -Infinity;
    for (const el of inter) {
      const bb = el.getBoundingClientRect();
      const w = Math.max(0, Math.min(bb.right, t.right) - Math.max(bb.left, t.left));
      const h = Math.max(0, Math.min(bb.bottom, t.bottom) - Math.max(bb.top, t.top, liveTop));
      if (w * h > 0.5) out.push({ tape: tape.textContent.trim().slice(0,20), cls: tape.className.baseVal ?? tape.className, target: (el.getAttribute('aria-label')||el.textContent.trim()).slice(0,20), tb: [t.top, t.bottom].map(Math.round), bb: [bb.top, bb.bottom].map(Math.round), px: Math.round(w*h) });
    }
  }
  return { st: card.scrollTop, sh: card.scrollHeight, ch: card.clientHeight, fold: card.hasAttribute('data-fold-above'), out };
};
console.log('rest', JSON.stringify(await p.evaluate(CENSUS)));
for (const btn of await p.locator('.controls-card button').all()) {
  const name = ((await btn.getAttribute('aria-label')) || (await btn.textContent()) || '').trim().slice(0, 20);
  try { await btn.hover({ timeout: 2500 }); } catch { continue; }
  await p.waitForTimeout(500);
  const r = await p.evaluate(CENSUS);
  if (r.out.length) console.log('hover', name, JSON.stringify(r));
}
await b.close();
