import { chromium } from 'playwright';
const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2 }); const p = await ctx.newPage();
await p.goto('http://127.0.0.1:4251/'); await p.waitForSelector('.info-btn'); await p.waitForTimeout(2500);
const cr = await p.evaluate(async () => { const c = document.querySelector('.controls-card'); c.scrollTop = c.scrollHeight; await new Promise(r => setTimeout(r, 200));
  document.querySelector('.info-btn').click(); await new Promise(r => setTimeout(r, 700)); document.getElementById('keys-fold').scrollIntoView({ block: 'nearest' }); await new Promise(r => setTimeout(r, 150));
  const r = c.getBoundingClientRect(); return { x: r.left, w: r.width }; });
await p.screenshot({ path: '/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/.owner-intake/info/chromium-light-1280x800-counterfactual.png', clip: { x: cr.x - 8, y: 380, width: cr.w + 16, height: 400 } });
await b.close();
