import { chromium, webkit } from '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs';
const PAYLOAD = 'ATMuNTA4MDAwMDAwMDAzMDAwMDAwNjA5MDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAw';
const ARM = process.argv[2] || 'proto'; const BASE = ARM === 'proto' ? 'http://127.0.0.1:4232' : 'http://127.0.0.1:4233';
const SEL = 'button, [role="button"], input, select, a[href], [tabindex]:not([tabindex="-1"])';
for (const [en, eng] of [['chromium', chromium], ['webkit', webkit]]) for (const [cell, vw, vh, touch, card] of [['rail1440', 1440, 900, false, '.controls-card'], ['dock390', 390, 844, true, '#controls-drawer .controls-card']]) {
  const b = await eng.launch(); const ctx = await b.newContext({ baseURL: BASE, viewport: { width: vw, height: vh }, hasTouch: touch });
  const page = await ctx.newPage(); await page.goto('/?board=' + PAYLOAD); await page.waitForSelector('.controls-card', { state: 'attached' }); await page.waitForTimeout(900);
  if (touch) { await page.locator('.drawer-tab').first().click(); await page.waitForTimeout(1400); }
  const res = await page.evaluate(async ({ card: cs, SEL }) => {
    const card = document.querySelector(cs); const max = card.scrollHeight - card.clientHeight; const raf = () => new Promise((r) => requestAnimationFrame(r));
    const poses = []; let bad = 0, worst = -Infinity, worstPose = null, badRows = [], outPoses = [], stuckOut = 0, outRows = [];
    for (let i = 0; i <= 100; i++) {
      card.scrollTop = Math.round(max * i / 100); await raf(); await raf(); await new Promise((r) => setTimeout(r, 20));
      const cb = card.getBoundingClientRect(); const clipTop = cb.top + card.clientTop, clipBot = clipTop + card.clientHeight;
      const band = clipTop + (parseFloat(getComputedStyle(card).paddingTop) || 0); const fold = card.hasAttribute('data-fold-above'); const live = fold ? band : -Infinity;
      const inter = [...card.querySelectorAll(SEL)].map((e) => ({ e, r: e.getBoundingClientRect() })).filter((x) => x.r.width > 0 && x.r.height > 0);
      let poseBad = [];
      for (const tape of card.querySelectorAll('.washi-label')) {
        const ts = getComputedStyle(tape); if (ts.display === 'none' || ts.visibility === 'hidden' || +ts.opacity < 0.05) continue;
        const r = tape.getBoundingClientRect(); const t = { l: r.left, r: r.right, t: Math.max(r.top, clipTop), b: Math.min(r.bottom, clipBot) }; if (t.b - t.t <= 0) continue;
        const pinned = ts.position === 'sticky' && !tape.hasAttribute('data-released');
        if (pinned && r.top <= band + 0.5) { const below = r.bottom - band; const stuck = Math.abs(r.top - (clipTop + (parseFloat(ts.top) || 0))) < 0.5; if (below > 0) { outPoses.push(i); if (stuck) stuckOut++; if (outRows.length < 3) outRows.push({ i, st: card.scrollTop, tape: (tape.textContent||'').trim().slice(0,10), below: +below.toFixed(2), stuck, topVsBand: +(r.top - band).toFixed(2), fold }); } if (below > worst) { worst = below; worstPose = i; } }
        for (const { e, r: br } of inter) { if (tape.contains(e) || e.contains(tape)) continue; const vt = Math.max(br.top, clipTop), vb = Math.min(br.bottom, clipBot); const w = Math.max(0, Math.min(br.right, t.r) - Math.max(br.left, t.l)); const h = Math.max(0, Math.min(vb, t.b) - Math.max(vt, t.t, live)); if (w * h > 0.5) poseBad.push({ tape: (tape.textContent || '').trim().slice(0, 12), pinned, target: (e.getAttribute('aria-label') || e.textContent || '').trim().slice(0, 14), px: +(w * h).toFixed(1) }); }
      }
      if (poseBad.length) { bad++; if (badRows.length < 4) badRows.push({ pose: i, st: card.scrollTop, rows: poseBad.slice(0, 3) }); }
    }
    card.scrollTop = 0; return { max, posesWithOverlap: bad, worstPinnedBelowBand: +worst.toFixed(2), worstPose, posesPinnedBelowBand: outPoses.length, poseRange: [outPoses[0], outPoses[outPoses.length-1]], stuckOut, outRows };
  }, { card, SEL });
  console.log(JSON.stringify({ arm: ARM, en, cell, ...res }));
  await b.close();
}
