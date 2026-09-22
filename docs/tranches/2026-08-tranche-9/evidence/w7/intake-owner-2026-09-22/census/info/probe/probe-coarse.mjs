// census:info — the coarse poses: 390×844 hasTouch dock (sheet open), 1280×800 hasTouch coarse rail (iPad-class).
// Plus the counterfactual on the desk: re-run the SAME scrollIntoView after the fold settles.
import { chromium, webkit } from 'playwright';
const BASE = 'http://127.0.0.1:4251/';
const eng = process.argv[2] === 'webkit' ? webkit : chromium;
const out = [];
const browser = await eng.launch();
const census = () => {
  const vis = (el) => { const cs = getComputedStyle(el); const r = el.getBoundingClientRect(); return cs.display !== 'none' && cs.visibility !== 'hidden' && r.width > 0 && r.height > 0; };
  const btns = [...document.querySelectorAll('button')].filter(vis);
  const iLike = btns.filter(b => /^\s*i\s*$/.test(b.textContent) || /info|what the keys|attribution/i.test(b.getAttribute('aria-label') || '')).map(b => ({ label: b.getAttribute('aria-label'), text: b.textContent.trim().slice(0, 20), cls: b.className.toString().slice(0, 60) }));
  const card = document.querySelector('.controls-card');
  const ccs = card && getComputedStyle(card);
  return { infoBtnNodes: document.querySelectorAll('.info-btn').length, keysFoldNodes: document.querySelectorAll('#keys-fold').length,
    legendNodes: document.querySelectorAll('.keyboard-legend').length, legendDisplay: document.querySelector('.keyboard-legend') ? getComputedStyle(document.querySelector('.keyboard-legend')).display : null,
    iLike, fine: matchMedia('(hover: hover) and (pointer: fine)').matches, coarse: matchMedia('(pointer: coarse)').matches,
    card: card && { overflowY: ccs.overflowY, st: card.scrollTop, sh: card.scrollHeight, ch: card.clientHeight },
    actionBarText: document.querySelector('.action-bar')?.innerText.replace(/\s+/g, ' ').trim() };
};
// A — 390×844 hasTouch, dock, sheet open
for (const [w, h, label] of [[390, 844, 'dock-390x844'], [1280, 800, 'coarse-rail-1280x800']]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: true, isMobile: w < 1024, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  const navs = []; page.on('framenavigated', f => { if (f === page.mainFrame()) navs.push(f.url()); });
  await page.goto(BASE, { waitUntil: 'load' });
  await page.waitForTimeout(4000); await page.waitForLoadState('load');
  const r = { eng: eng.name(), label, navs };
  r.closed = await page.evaluate(census).catch(async e => { await page.waitForTimeout(3000); return page.evaluate(census); });
  if (w < 1024 && await page.locator('.drawer-tab').count()) {
    await page.locator('.drawer-tab').tap();
    // the sheet SLIDES: poll the settled pose (card rect stable over 5 frames)
    await page.evaluate(() => new Promise(res => { let last = null, stable = 0; const t0 = performance.now(); const tick = () => { const c = document.querySelector('.controls-card'); const top = c ? c.getBoundingClientRect().top : 0; if (last !== null && Math.abs(top - last) < 0.1) stable++; else stable = 0; last = top; if (stable >= 5 || performance.now() - t0 > 2000) res(); else requestAnimationFrame(tick); }; requestAnimationFrame(tick); }));
    r.open = await page.evaluate(census);
    await page.screenshot({ path: `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/.owner-intake/info/${eng.name()}-light-${label}-coarse.png` });
    // the attribution tag on the head line (the brief's AttributionCard :898) — tap it, read where its card lands
    r.attTrig = await page.evaluate(() => { const b = [...document.querySelectorAll('button[aria-label="Show attribution card"]')].map(e => { const q = e.getBoundingClientRect(); return [q.left, q.top, q.width, q.height].map(Math.round); }); return b; });
    const att = page.locator('button[aria-label="Show attribution card"]:visible');
    r.attribution = { visibleTriggers: await att.count() };
    if (r.attribution.visibleTriggers) { await att.first().tap().catch(e => r.attribution.tapErr = String(e).slice(0, 120)); await page.waitForTimeout(400);
      r.attribution.urlAfterTap = page.url(); r.attribution.after = await page.evaluate(() => { const c = [...document.querySelectorAll('.hover-card.is-open')].map(e => { const b = e.getBoundingClientRect(); return { top: b.top, bottom: b.bottom, left: b.left, right: b.right }; }); const card = document.querySelector('.controls-card'); return { openCards: c, vw: innerWidth, vh: innerHeight, panelScrollTop: card && card.scrollTop }; }).catch(e => ({ err: String(e).slice(0, 100), url: page.url() })); }
  }
  out.push(r); await ctx.close();
}
// B — the counterfactual on the desk, fine pointer, 1280×800, start at the scroll end
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: 'load' }); await page.waitForSelector('.info-btn'); await page.waitForTimeout(2500);
  const cf = await page.evaluate(async () => {
    const c = document.querySelector('.controls-card'); c.scrollTop = c.scrollHeight; await new Promise(r => setTimeout(r, 200));
    const meas = () => { const dl = document.querySelector('#keys-fold .keyboard-legend').getBoundingClientRect(); const bar = document.querySelector('.action-bar').getBoundingClientRect(); const cr = c.getBoundingClientRect();
      const inter = Math.max(0, Math.min(dl.bottom, bar.top) - Math.max(dl.top, cr.top)); return { st: c.scrollTop, max: c.scrollHeight - c.clientHeight, dlVisFrac: +(inter / dl.height).toFixed(3), dlBotMinusBarTop: +(dl.bottom - bar.top).toFixed(2) }; };
    document.querySelector('.info-btn').click();
    await new Promise(r => setTimeout(r, 700));
    const asShipped = meas();
    document.getElementById('keys-fold').scrollIntoView({ block: 'nearest' }); // same call, instant, AFTER the 200 ms fold settles
    await new Promise(r => setTimeout(r, 100));
    const afterSettleNearest = meas();
    return { asShipped, afterSettleNearest };
  });
  out.push({ eng: eng.name(), label: 'counterfactual-1280x800-fine', cf });
  await ctx.close();
}
await browser.close();
console.log(JSON.stringify(out, null, 1));
