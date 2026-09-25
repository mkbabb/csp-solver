import { chromium, webkit } from "@playwright/test";
const url = process.argv[2]; const runs = +(process.argv[3] || 3);
const PANEL_H = () => { const p = document.querySelector(".controls-card .control-panel-wrap"); return p ? +p.getBoundingClientRect().height.toFixed(2) : null; };
for (const [name, eng] of [["chromium", chromium], ["webkit", webkit]]) {
  const b = await eng.launch(); const out = [];
  for (let i = 0; i < runs; i++) {
    const ctx = await b.newContext({ viewport: { width: 1280, height: 800 }, hasTouch: true, isMobile: name === "chromium" ? true : true });
    const p = await ctx.newPage(); await p.goto(url);
    await p.waitForSelector("svg.handwritten-logo", { timeout: 30000 }); await p.waitForSelector(".ctrl-btn", { timeout: 30000 });
    await p.waitForTimeout(600);
    const hash = await p.evaluate(() => [...document.scripts].map(s => s.src).find(s => /index-/.test(s)));
    const regime = await p.evaluate(() => [matchMedia("(pointer: coarse)").matches, matchMedia("(min-width: 1024px)").matches]);
    out.push({ h: await p.evaluate(PANEL_H), regime, hash: hash?.split("/").pop() });
    await ctx.close();
  }
  console.log(name, JSON.stringify(out));
  await b.close();
}
