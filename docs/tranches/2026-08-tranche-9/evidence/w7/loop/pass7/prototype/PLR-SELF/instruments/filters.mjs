// PLR-SELF pass 7: the filterBudget, the estate's rule (painted elements whose computed filter is not none, plus
// SVG elements carrying a filter attribute/url), tree dist vs control dist, shut / card open / lobby open, both themes,
// both engines, 1280x800 fine, PRM. Also the control-vs-control noise is 0 by construction (one read per arm).
import { createRequire } from 'node:module';
const pw = createRequire('/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json')('playwright');
const ARMS = { control: process.env.CTRL, tree: process.env.TREE };
const count = (p) => p.evaluate(() => { let n = 0; for (const el of document.querySelectorAll('*')) { const cs = getComputedStyle(el); const r = el.getBoundingClientRect(); if (cs.display === 'none' || cs.visibility === 'hidden' || r.width === 0) continue; if ((cs.filter && cs.filter !== 'none') || (el instanceof SVGElement && el.getAttribute('filter'))) n++; } return n; });
for (const eng of ['chromium', 'webkit']) for (const scheme of ['light', 'dark']) {
  const row = [];
  for (const [arm, url] of Object.entries(ARMS)) {
    const b = await pw[eng].launch(); const ctx = await b.newContext({ viewport: { width: 1280, height: 800 }, colorScheme: scheme, reducedMotion: 'reduce' }); const p = await ctx.newPage();
    await p.goto(url + '/?size=3&difficulty=EASY'); await p.waitForSelector('svg.handwritten-logo', { timeout: 90000 }); await p.waitForTimeout(2500);
    const shut = await count(p);
    await p.locator('.corner-left .attribution-trigger').hover(); await p.waitForTimeout(1000); const card = await count(p);
    await p.mouse.move(700, 700); await p.waitForTimeout(800);
    let lobby = '-'; if (await p.locator('.corner-left [data-player-mark]').count()) { await p.locator('.corner-left [data-player-mark]').click(); await p.waitForTimeout(1000); lobby = await count(p); }
    const js = await p.evaluate(() => [...document.scripts].map((s) => s.src).find((s) => /index-.*\.js/.test(s))?.split('/').pop());
    row.push(`${arm} ${js} shut ${shut} card ${card} lobby ${lobby}`);
    await b.close();
  }
  console.log(`FILTERS ${eng} ${scheme} :: ${row.join(' || ')}`);
}
