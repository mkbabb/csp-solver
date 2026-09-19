/** The second landscape cell chair §6.3(b) binds the ballot to: 812×375, both engines, HEAD. */
import { chromium, webkit } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";
import { writeFileSync } from "node:fs";

const BASE = "http://127.0.0.1:4232/";
const out = {};
for (const [name, type] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  const b = await type.launch();
  const ctx = await b.newContext({
    viewport: { width: 812, height: 375 },
    isMobile: name === "chromium",
    hasTouch: true,
    deviceScaleFactor: 2,
  });
  const page = await ctx.newPage();
  await page.goto(BASE + "?size=3&difficulty=EASY", { waitUntil: "load" });
  await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
  await page.waitForFunction(
    () => document.querySelectorAll(".sudoku-cell .glyph-svg").length > 0,
    null,
    { timeout: 30000 },
  );
  out[name] = await page.evaluate(() => {
    const vis = (el) => {
      if (!el) return false;
      const cs = getComputedStyle(el);
      if (cs.display === "none" || cs.visibility === "hidden" || +cs.opacity < 0.05)
        return false;
      const b = el.getBoundingClientRect();
      return b.width > 0 && b.height > 0 && b.top < window.innerHeight && b.bottom > 0;
    };
    const box = (s) => {
      const el = document.querySelector(s);
      if (!el) return null;
      const b = el.getBoundingClientRect();
      return [+b.left.toFixed(2), +b.top.toFixed(2), +b.width.toFixed(2), +b.height.toFixed(2)];
    };
    const card = document.querySelector(".controls-card");
    return {
      drawerTabVisible: vis(document.querySelector(".drawer-tab")),
      drawerTab: box(".drawer-tab"),
      foldTools: box(".fold-tools"),
      drawerHandle: box(".drawer-handle"),
      dealVisible: vis(document.querySelector(".controls-card .deal-btn")),
      sheetChrome: getComputedStyle(document.querySelector(".scene-controls")).getPropertyValue("--sheet-chrome").trim(),
      cardClientH: card?.clientHeight ?? null,
      cardScrollH: card?.scrollHeight ?? null,
      vh: window.innerHeight,
      vhMinusClient: card ? window.innerHeight - card.clientHeight : null,
      docScrollH: document.documentElement.scrollHeight,
      mqLandscape: matchMedia("(orientation: landscape)").matches,
      mqShort: matchMedia("(max-height: 500px) and (min-aspect-ratio: 2/1)").matches,
    };
  });
  await ctx.close();
  await b.close();
}
writeFileSync(process.argv[2], JSON.stringify(out, null, 1));
console.log(JSON.stringify(out, null, 1));
