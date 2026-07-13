// I3 reflow driver probe — pinpoint the 320px overflow chain + each offender's min-width/width.
import { chromium } from '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs';
const BASE = process.env.BASE || 'http://localhost:4490';
const URLS = { sudoku: `${BASE}/`, futoshiki: `${BASE}/?game=futoshiki` };

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
        const cls = (el.className && el.className.baseVal !== undefined ? el.className.baseVal : el.className || '').toString().slice(0, 44);
        offenders.push({ tag: el.tagName.toLowerCase(), cls, w: +r.width.toFixed(1), over: +(r.right - window.innerWidth).toFixed(1), minW: cs.minWidth, width: cs.width, flex: cs.flex, disp: cs.display });
      }
    }
    offenders.sort((a, b) => b.w - a.w);
    // also: the widest element overall (even if not overflowing) to see the min-content driver
    let widest = null;
    for (const el of document.querySelectorAll('.board-group, .board-shell, .board-wrapper, .board-margin, .board-cells, .app-layout, main, .futoshiki-board, .caret-layer')) {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      if (!widest) widest = [];
      widest.push({ cls: (el.className.baseVal !== undefined ? el.className.baseVal : el.className).toString().slice(0, 40), w: +r.width.toFixed(1), minW: cs.minWidth, width: cs.width, disp: cs.display, over: +(r.right - window.innerWidth).toFixed(1) });
    }
    return { innerW: window.innerWidth, scrollW: se.scrollWidth, overflowPx: se.scrollWidth - se.clientWidth, offenderCount: offenders.length, top: offenders.slice(0, 12), named: widest };
  });
}

async function main() {
  const browser = await chromium.launch();
  for (const [game, url] of Object.entries(URLS)) {
    const ctx = await browser.newContext({ viewport: { width: 320, height: 800 }, colorScheme: 'light' });
    const page = await ctx.newPage();
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);
    const r = await reflow(page);
    console.log(`\n=== ${game} @320: overflow=${r.overflowPx}px offenders=${r.offenderCount} ===`);
    for (const o of r.top) console.log(`  ${o.tag}.${o.cls} w=${o.w} over=${o.over} minW=${o.minW} width=${o.width} flex=${o.flex}`);
    console.log('  -- named chain --');
    for (const n of (r.named || [])) console.log(`  .${n.cls} w=${n.w} over=${n.over} minW=${n.minW} width=${n.width} disp=${n.disp}`);
    await ctx.close();
  }
  await browser.close();
}
main().catch((e) => { console.error(e); process.exit(1); });
