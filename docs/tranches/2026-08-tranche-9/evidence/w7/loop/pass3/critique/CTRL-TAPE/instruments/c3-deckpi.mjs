/** CTRL-TAPE pass-3 CRITIC — π on the GALLERY (the surface this wave does not claim),
 *  proto (:4237) vs the 74a2b5d9 control (:4238), at the cells the lane's own census skipped.
 *  node c3-deckpi.mjs <out.json> <base> [engine] */
import { chromium, webkit } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";
import { writeFileSync } from "node:fs";
const OUT = process.argv[2], BASE = process.argv[3];
const READ = () => {
  const r = (e) => { const b = e?.getBoundingClientRect(); return b ? { w: +b.width.toFixed(2), h: +b.height.toFixed(2), t: +b.top.toFixed(2), l: +b.left.toFixed(2) } : null; };
  const band = document.querySelector(".staging-band");
  const axis = document.querySelector(".staging-axis-label");
  const chips = [...document.querySelectorAll(".staging-band .ctrl-btn, .staging-band [role='radio'], .staging-band button")].slice(0, 8);
  const tapes = [...document.querySelectorAll(".washi-label")].map((e) => ({
    text: (e.textContent || "").trim().slice(0, 18), cls: e.className, tag: e.tagName,
    font: getComputedStyle(e).fontSize, lh: getComputedStyle(e).lineHeight, ...r(e),
  }));
  const cards = [...document.querySelectorAll(".staging-band [class*='card'], .deck-card, .gallery-card")].slice(0, 3).map(r);
  return {
    band: r(band),
    axis: axis ? { font: getComputedStyle(axis).fontSize, weight: getComputedStyle(axis).fontWeight, family: getComputedStyle(axis).fontFamily.split(",")[0], ...r(axis) } : null,
    chips: chips.map((c) => ({ text: (c.textContent || "").trim().slice(0, 10), font: getComputedStyle(c).fontSize, ...r(c) })),
    tapes, cards,
    typeOption: getComputedStyle(document.documentElement).getPropertyValue("--type-option").trim(),
    typeGroupTitle: getComputedStyle(document.documentElement).getPropertyValue("--type-group-title").trim(),
    docH: document.documentElement.scrollHeight,
    h2s: [...document.querySelectorAll("h2")].map((e) => (e.textContent || "").trim().slice(0, 18)),
  };
};
const out = {};
for (const [name, eng] of [["chromium", chromium], ["webkit", webkit]]) {
  const browser = await eng.launch();
  for (const cell of [
    { name: "tab-820x1180", w: 820, h: 1180 },
    { name: "tab-900x1000", w: 900, h: 1000 },
    { name: "rail-1440x900", w: 1440, h: 900 },
    { name: "dock-390x844", w: 390, h: 844 },
  ]) {
    const ctx = await browser.newContext({ baseURL: BASE, viewport: { width: cell.w, height: cell.h } });
    const page = await ctx.newPage();
    const key = `${name}|${cell.name}`;
    try {
      await page.goto("/?view=gallery");
      await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
      await page.waitForTimeout(1500);
      out[key] = await page.evaluate(READ);
      out[key].ax = ((await page.locator("body").ariaSnapshot()).match(/^\s*- heading/gm) || []).length;
    } catch (e) { out[key] = { error: String(e).slice(0, 200) }; }
    await ctx.close();
  }
  await browser.close();
}
writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log("BANKED", OUT);
