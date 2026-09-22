#!/usr/bin/env node
// T9-W7 pass 4 · CTRL-COST — THE π CENSUS, at the viewport pass 3 never opened, reading PAINT
// as well as geometry (registry §2.13: a rect census missed two deltas, one on a 0×0 element).
//
// Every box OUTSIDE the controls card and its drawer, keyed by its own ancestry path, with
// eleven computed paint properties and its tag name beside its rect. Copied from pass 3's
// `probe/pi-rects.mjs` (frozen) with the OUT re-pointed and three things added: a VIEWPORT and
// THEME argument, an optional SHEET-UP state (the dock's sheet is opened through its own tab
// before the reading), and the paint columns.
//
// Usage: node p4-pi-rects.mjs <base> <engine> <route> <WxH> <theme> <shut|up> <out.json>
import { chromium, webkit } from "playwright";
import { writeFileSync } from "node:fs";

const [base, engine, route, vp, theme, sheet, out] = process.argv.slice(2);
const [w, h] = vp.split("x").map(Number);
const coarse = w < 1024;
const browser = await (engine === "webkit" ? webkit : chromium).launch();
const ctx = await browser.newContext({
  viewport: { width: w, height: h },
  hasTouch: coarse,
  deviceScaleFactor: 2,
  colorScheme: theme,
});
const page = await ctx.newPage();
await page.emulateMedia({ reducedMotion: "reduce", colorScheme: theme });
// THE SAME BOARD ON BOTH ARMS (`?board=`) — LADDER/LEDGER's confound.
await page.goto(`${base}${route}${route.includes("?") ? "&" : "?"}board=1`);
await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 }).catch(() => {});
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(1400);
if (sheet === "up") {
  const tab = page.locator(".drawer-tab");
  if (await tab.count()) {
    await (coarse ? tab.tap() : tab.click());
    await page.waitForTimeout(1100); // the sheet SLIDES — settled pose, not the first frame
  }
}

const rects = await page.evaluate(() => {
  const r2 = (n) => +n.toFixed(2);
  // THE SUBJECT IS THE SURFACE THIS WAVE DOES NOT CLAIM (pass 3's sentence, kept).
  const path = (el) => {
    const parts = [];
    for (let n = el; n && n !== document.body; n = n.parentElement) {
      const cls =
        typeof n.className === "string"
          ? n.className.trim().split(/\s+/).filter((c) => !/^data-v-/.test(c)).slice(0, 2).join(".")
          : "";
      const sibs = [...(n.parentElement?.children ?? [])].filter(
        (s) => s.tagName === n.tagName,
      );
      parts.unshift(`${n.tagName.toLowerCase()}${cls ? "." + cls : ""}#${sibs.indexOf(n)}`);
    }
    return parts.join(">");
  };
  const PAINT = [
    "color",
    "backgroundColor",
    "fill",
    "stroke",
    "strokeWidth",
    "fillOpacity",
    "strokeOpacity",
    "opacity",
    "fontFamily",
    "fontSize",
    "lineHeight",
  ];
  return [...document.querySelectorAll("body *")]
    .filter((el) => !el.closest(".controls-card, #controls-drawer, .drawer-case"))
    .map((el) => {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      const paint = {};
      for (const p of PAINT) paint[p] = cs[p];
      // A 0×0 element still PAINTS (registry §2.13) — it is kept, with its rect zeroed.
      return {
        k: path(el),
        tag: el.tagName.toLowerCase(),
        x: r2(r.x),
        y: r2(r.y),
        w: r2(r.width),
        h: r2(r.height),
        p: paint,
      };
    });
});
writeFileSync(
  out,
  JSON.stringify({ engine, route, vp, theme, sheet, base, n: rects.length, rects }, null, 0),
);
console.log(`${engine} ${route} ${vp} ${theme} sheet=${sheet} ${base} → ${rects.length} nodes`);
await browser.close();
