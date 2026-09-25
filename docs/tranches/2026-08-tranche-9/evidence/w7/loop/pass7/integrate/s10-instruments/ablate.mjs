import { chromium, webkit } from "@playwright/test";
const url = process.argv[2]; const runs = +(process.argv[3] || 6);
const PANEL_H = () => { const p = document.querySelector(".controls-card .control-panel-wrap"); return p ? +p.getBoundingClientRect().height.toFixed(2) : null; };
for (const [name, eng] of [["chromium", chromium], ["webkit", webkit]]) {
  const b = await eng.launch(); const out = [];
  for (let i = 0; i < runs; i++) {
    const ctx = await b.newContext({ viewport: { width: 1280, height: 800 }, hasTouch: true, isMobile: true });
    const p = await ctx.newPage(); await p.goto(url);
    await p.waitForSelector("svg.handwritten-logo", { timeout: 30000 }); await p.waitForSelector(".ctrl-btn", { timeout: 30000 });
    const shipped = await p.evaluate(PANEL_H);
    await p.evaluate(() => { const s = document.createElement("style"); s.id = "abl"; s.textContent = ".zone-row-label { font-size: var(--type-tag) !important; line-height: 1.1 !important }"; document.head.appendChild(s); });
    await p.waitForTimeout(120);
    const hand = await p.evaluate(PANEL_H);
    await p.waitForTimeout(1500);
    const handLate = await p.evaluate(PANEL_H);
    const shippedLate = await p.evaluate(() => { document.getElementById("abl").remove(); const q = document.querySelector(".controls-card .control-panel-wrap"); return +q.getBoundingClientRect().height.toFixed(2); });
    out.push([shipped, +(shipped - hand).toFixed(2), +(shipped - handLate).toFixed(2), shippedLate]);
    await ctx.close();
  }
  console.log(name, JSON.stringify(out));
  await b.close();
}
