// Refined reflow + target: desktop context (locked innerWidth), cell-rect distribution debug.
import { chromium } from '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs';
import fs from 'node:fs';
const BASE = 'http://localhost:4486';
const EV = '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-07-tranche-4/evidence/w10';
const URLS = { sudoku: `${BASE}/`, futoshiki: `${BASE}/?game=futoshiki` };

async function pickSizeAndDeal(page, sizeLabel) {
  const picked = await page.evaluate((lab) => {
    const b = [...document.querySelectorAll('.ctrl-btn')].find((n) => n.textContent.trim() === lab && n.offsetParent !== null);
    if (b) { b.click(); return true; } return false;
  }, sizeLabel);
  if (!picked) return false;
  await page.waitForTimeout(150);
  await page.evaluate(() => {
    const d = [...document.querySelectorAll('button')].find((n) => /deal/i.test(n.getAttribute('aria-label') || '') && n.offsetParent !== null);
    if (d) { d.click(); d.click(); }
  });
  await page.waitForTimeout(800);
  return true;
}

async function cellDist(page, cellSel) {
  return await page.evaluate((sel) => {
    const cells = [...document.querySelectorAll(sel)];
    const rows = cells.map((c) => {
      const vis = c.offsetParent !== null;
      const cr = c.getBoundingClientRect();
      const input = c.querySelector('input');
      const ir = input ? input.getBoundingClientRect() : null;
      return { vis, cellW: +cr.width.toFixed(2), cellH: +cr.height.toFixed(2), hasInput: !!input, inW: ir ? +ir.width.toFixed(2) : null, inH: ir ? +ir.height.toFixed(2) : null };
    });
    const visRows = rows.filter((r) => r.vis && r.cellW > 0);
    const tap = visRows.map((r) => (r.inW != null ? r.inW : r.cellW));
    const tapH = visRows.map((r) => (r.inH != null ? r.inH : r.cellH));
    return {
      total: cells.length, visible: visRows.length,
      zeroInput: rows.filter((r) => r.vis && r.hasInput && r.inW === 0).length,
      noInput: rows.filter((r) => r.vis && !r.hasInput).length,
      minTapW: tap.length ? +Math.min(...tap).toFixed(2) : null,
      minTapH: tapH.length ? +Math.min(...tapH).toFixed(2) : null,
      maxTapW: tap.length ? +Math.max(...tap).toFixed(2) : null,
      sample: visRows.slice(0, 2),
    };
  }, cellSel);
}

async function reflow(page) {
  return await page.evaluate(() => {
    const se = document.scrollingElement || document.documentElement;
    const offenders = [];
    for (const el of document.querySelectorAll('*')) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden') continue;
      if (r.right > window.innerWidth + 0.5 || r.left < -0.5) {
        const cls = (el.className && el.className.baseVal !== undefined ? el.className.baseVal : el.className || '').toString().slice(0, 50);
        offenders.push({ tag: el.tagName.toLowerCase(), cls, left: +r.left.toFixed(1), right: +r.right.toFixed(1), w: +r.width.toFixed(1), over: +(r.right - window.innerWidth).toFixed(1) });
      }
    }
    offenders.sort((a, b) => b.w - a.w);
    return { innerW: window.innerWidth, scrollW: se.scrollWidth, clientW: se.clientWidth, overflowPx: se.scrollWidth - se.clientWidth, offenderCount: offenders.length, top: offenders.slice(0, 8) };
  });
}

async function main() {
  const browser = await chromium.launch();
  const out = { reflow: {}, target: {} };

  // reflow at desktop-context 320 (innerWidth locked to viewport minus nothing)
  for (const [game, url] of Object.entries(URLS)) {
    const ctx = await browser.newContext({ viewport: { width: 320, height: 800 }, colorScheme: 'light' });
    const page = await ctx.newPage();
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);
    out.reflow[`${game}:320`] = await reflow(page);
    await ctx.close();
  }

  // target: desktop context (no mobile emulation) at 390 and 320
  const plan = [
    { game: 'sudoku', cellSel: '.sudoku-cell', sizes: ['9×9', '16×16'] },
    { game: 'futoshiki', cellSel: '.futoshiki-cell', sizes: [null] },
  ];
  for (const vw of [390, 320]) {
    for (const p of plan) {
      const ctx = await browser.newContext({ viewport: { width: vw, height: 844 }, colorScheme: 'light', hasTouch: true });
      const page = await ctx.newPage();
      await page.goto(URLS[p.game], { waitUntil: 'networkidle' });
      await page.waitForTimeout(500);
      for (const sz of p.sizes) {
        if (sz) await pickSizeAndDeal(page, sz);
        await page.waitForTimeout(300);
        const tag = sz ? sz.replace(/[×]/g, 'x') : '5x5-default';
        out.target[`${p.game}:${tag}:${vw}`] = await cellDist(page, p.cellSel);
      }
      await ctx.close();
    }
  }

  fs.writeFileSync(`${EV}/c3-rt2-raw.json`, JSON.stringify(out, null, 2));
  console.log('=== REFLOW (desktop ctx, innerWidth locked) ===');
  for (const [k, v] of Object.entries(out.reflow)) {
    console.log(`${k}: innerW=${v.innerW} scrollW=${v.scrollW} clientW=${v.clientW} OVERFLOW(scrollW-clientW)=${v.overflowPx}px offenders=${v.offenderCount}`);
    for (const o of v.top.slice(0, 6)) console.log(`   ${o.tag}.${o.cls} left=${o.left} right=${o.right} w=${o.w} over=${o.over}`);
  }
  console.log('\n=== TARGET ===');
  for (const [k, v] of Object.entries(out.target)) {
    console.log(`${k}: total=${v.total} vis=${v.visible} noInput=${v.noInput} zeroInput=${v.zeroInput} minTap=${v.minTapW}x${v.minTapH} maxW=${v.maxTapW}`);
    console.log(`      sample: ${JSON.stringify(v.sample)}`);
  }
  await browser.close();
}
main().catch((e) => { console.error(e); process.exit(1); });
