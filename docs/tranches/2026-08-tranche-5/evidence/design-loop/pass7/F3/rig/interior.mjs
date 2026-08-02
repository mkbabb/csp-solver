import { chromium, webkit } from "playwright";
const BASE = "http://127.0.0.1:4237";
const COARSE = { viewport: { width: 390, height: 664 }, hasTouch: true, isMobile: true };
for (const [label, type] of [["chromium", chromium], ["webkit", webkit]]) {
  const b = await type.launch(); const ctx = await b.newContext(COARSE); const page = await ctx.newPage();
  await page.goto(`${BASE}/?size=3&difficulty=EASY`);
  await page.waitForSelector("svg.handwritten-logo", { timeout: 20000 });
  await page.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
  await page.waitForFunction(() => document.querySelectorAll(".sudoku-cell .glyph-svg").length > 0, { timeout: 20000 });
  await page.waitForTimeout(800);
  await page.locator(".drawer-tab").tap();
  await page.waitForSelector("#controls-drawer .drawer-case", { state: "visible" });
  await page.waitForTimeout(800);
  const r = await page.evaluate(() => {
    const out = [];
    document.querySelectorAll("#controls-drawer *").forEach((el) => {
      const over = el.scrollHeight - el.clientHeight;
      const cs = getComputedStyle(el);
      if (over > 0 && /auto|scroll/.test(cs.overflowY))
        out.push({ cls: el.className.toString().slice(0, 60), overflowY: cs.overflowY, scrollH: el.scrollHeight, clientH: el.clientHeight, over });
    });
    const c = document.querySelector("#controls-drawer .drawer-case");
    return { scrollables: out, caseOver: c.scrollHeight - c.clientHeight, caseOverflowY: getComputedStyle(c).overflowY };
  });
  console.log(label, JSON.stringify(r, null, 1));
  await b.close();
}
