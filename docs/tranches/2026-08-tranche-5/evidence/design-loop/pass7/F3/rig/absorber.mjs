import { chromium, webkit } from "playwright";
const BASE = "http://127.0.0.1:4237";
const COARSE = { viewport: { width: 390, height: 664 }, hasTouch: true, isMobile: true };
for (const [label, type] of [["chromium", chromium], ["webkit", webkit]]) {
  const b = await type.launch(); const ctx = await b.newContext(COARSE); const page = await ctx.newPage();
  await page.goto(`${BASE}/?size=3&difficulty=EASY`);
  await page.waitForSelector("svg.handwritten-logo", { timeout: 20000 });
  await page.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
  await page.waitForFunction(() => document.querySelectorAll(".sudoku-cell .glyph-svg").length > 0, { timeout: 20000 });
  await page.waitForTimeout(600);
  await page.addStyleTag({ content: ".completion-vignette{position:static!important}" });
  await page.waitForTimeout(200);
  const r = await page.evaluate(() => {
    const doc = document.scrollingElement || document.documentElement;
    const q = (s) => document.querySelector(s);
    const snap = () => {
      const w = q(".board-wrapper").getBoundingClientRect(), t = q("#fold-tools").getBoundingClientRect();
      const sc = q(".game-scene") || q("#app").firstElementChild;
      const cs = getComputedStyle(sc);
      return { boardBottom: +w.bottom.toFixed(2), toolsTop: +t.top.toFixed(2),
               gap: +(t.top - w.bottom).toFixed(2), doc: doc.scrollHeight,
               sceneH: +sc.getBoundingClientRect().height.toFixed(2),
               sceneMinH: cs.minHeight, sceneJustify: cs.justifyContent, sceneDisplay: cs.display };
    };
    const v = q(".completion-vignette");
    const before = snap(); const prior = v.style.display;
    v.style.display = "block"; void v.offsetHeight;
    const after = snap(); v.style.display = prior;
    return { before, after,
      gapCollapse: +(before.gap - after.gap).toFixed(2),
      docGrowth: after.doc - before.doc,
      push: +(after.toolsTop - before.toolsTop).toFixed(2) };
  });
  console.log(label, JSON.stringify(r, null, 1));
  await b.close();
}
