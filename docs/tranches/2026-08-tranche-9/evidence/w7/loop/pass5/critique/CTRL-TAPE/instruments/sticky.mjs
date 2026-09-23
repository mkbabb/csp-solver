import { chromium, webkit } from '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs';
const PAYLOAD = 'ATMuNTA4MDAwMDAwMDAzMDAwMDAwNjA5MDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAw';
for (const [en, eng] of [['chromium', chromium], ['webkit', webkit]]) for (const [cell, vw, vh, touch, sel] of [['rail1440', 1440, 900, false, '.controls-card'], ['drawer375', 375, 667, true, '#controls-drawer .controls-card']]) {
  const b = await eng.launch(); const ctx = await b.newContext({ baseURL: 'http://127.0.0.1:4232', viewport: { width: vw, height: vh }, hasTouch: touch });
  const page = await ctx.newPage(); await page.goto('/?board=' + PAYLOAD); await page.waitForSelector('.controls-card', { state: 'attached' }); await page.waitForTimeout(900);
  if (touch) { await page.locator('.drawer-tab').first().click(); await page.waitForTimeout(1300); }
  const r = await page.evaluate(async (sel) => {
    const card = document.querySelector(sel); const wells = [...card.querySelectorAll('.tray-well')]; const well = wells.find((w) => /pencils/.test(w.querySelector('.washi-tag')?.textContent || '')); if (!well) return 'no pencils well';
    const tag = well.querySelector('.washi-tag'); card.scrollTop = 0; await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    const want = well.getBoundingClientRect().top - card.getBoundingClientRect().top + 40; const max = card.scrollHeight - card.clientHeight;
    const vis = () => { const t = tag.getBoundingClientRect(), c = card.getBoundingClientRect(); const h = Math.max(0, Math.min(t.bottom, c.bottom) - Math.max(t.top, c.top)); return +(h / t.height).toFixed(3); };
    const snap = (k) => ({ k, pos: getComputedStyle(tag).position, released: tag.hasAttribute('data-released'), vis: vis() });
    card.scrollTop = want; const out = [snap('sync')];
    for (let f = 1; f <= 4; f++) { await new Promise((r) => requestAnimationFrame(r)); out.push(snap('raf' + f)); }
    await new Promise((r) => setTimeout(r, 600)); out.push(snap('600ms'));
    return { want: +want.toFixed(1), max, out };
  }, sel);
  console.log(JSON.stringify({ en, cell, r }));
  await b.close();
}
