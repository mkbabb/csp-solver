import { chromium, webkit } from "playwright";
const BASE = "http://127.0.0.1:4237";
const COARSE = { viewport: { width: 390, height: 664 }, hasTouch: true, isMobile: true };
for (const [label, type] of [["chromium", chromium], ["webkit", webkit]]) {
  const b = await type.launch();
  const seen = [];
  for (let i = 0; i < 4; i++) {
    const ctx = await b.newContext(COARSE); const page = await ctx.newPage();
    await page.goto(`${BASE}/?size=3&difficulty=EASY`);
    await page.waitForSelector("svg.handwritten-logo", { timeout: 20000 });
    await page.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
    await page.waitForFunction(() => document.querySelectorAll(".sudoku-cell .glyph-svg").length > 0, { timeout: 20000 });
    await page.waitForTimeout(800);
    await page.locator(".drawer-tab").tap();
    await page.waitForSelector("#controls-drawer .drawer-case", { state: "visible" });
    await page.waitForTimeout(800);
    const r = await page.evaluate(() => {
      const card = document.querySelector("#controls-drawer .controls-card");
      const tally = document.querySelector("[aria-label^='difficulty']");
      return { over: card.scrollHeight - card.clientHeight, scrollH: card.scrollHeight, clientH: card.clientHeight,
               step: tally?.getAttribute("aria-label") ?? null };
    });
    seen.push(r); console.log(`${label} rep${i+1} interiorScroll=${r.over} (scrollH ${r.scrollH} / clientH ${r.clientH})  ${r.step}`);
    await ctx.close();
  }
  const o = seen.map(s => s.over);
  console.log(`${label}: min=${Math.min(...o)} max=${Math.max(...o)} distinct=${[...new Set(o)].join(",")}\n`);
  await b.close();
}
