import { chromium } from '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs';
const [base, w, h] = [process.argv[2], +process.argv[3], +process.argv[4]];
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: w, height: h } });
await p.goto(base + '/?size=3&difficulty=EASY');
await p.waitForSelector('g.boil-frame-layer.is-active', { state: 'attached', timeout: 20000 });
await p.waitForTimeout(800);
console.log(w, JSON.stringify(await p.evaluate(() => {
  const card = [...document.querySelectorAll('.controls-card')].find(c => c.getClientRects().length);
  const ws = [...card.querySelectorAll('.tray-well')];
  return ws.map((wl, i) => {
    const t = wl.querySelector('.washi-tag')?.getBoundingClientRect();
    const btns = [...wl.querySelectorAll('button')].filter(e => e.getClientRects().length).map(e => e.getBoundingClientRect());
    const prev = ws[i - 1];
    const pw = prev?.getBoundingClientRect(); const me = wl.getBoundingClientRect(); const cs = getComputedStyle(wl); const pb = prev ? Math.max(...[...prev.querySelectorAll('button')].filter(e => e.getClientRects().length).map(e => e.getBoundingClientRect().bottom)) : null;
    return { tag: wl.querySelector('.washi-tag')?.textContent.trim(), tagTop: t && +t.top.toFixed(2), prevLastBtnBottom: pb && +pb.toFixed(2), gapWells: pw && +(me.top - pw.bottom).toFixed(2), prevPadB: prev && getComputedStyle(prev).paddingBottom, mt: cs.marginTop, overhang: t && +(me.top - t.top).toFixed(2), tagH: t && +t.height.toFixed(2), daylight: pb && t ? +(t.top - pb).toFixed(2) : null, lastChild: wl.lastElementChild?.className };
  });
})));
await b.close();
