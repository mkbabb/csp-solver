// CTRL-TABS · the RESIDUE probe — what the card still spends when one tray is face-up.
// The first probe showed the landscape card at scrollHeight 326 with a 67px tray selected:
// 259px of something that is not the tray. This names every one of those pixels.
//   node residue.probe.mjs
import { chromium, webkit } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const BASE = process.env.LANE_BASE || "http://127.0.0.1:4232/";
const CELLS = [
  { name: "dock-390x844", w: 390, h: 844, mobile: true, sheet: true },
  { name: "land-900x500", w: 900, h: 500, mobile: true, sheet: true },
  { name: "desk-1280x800", w: 1280, h: 800, mobile: false, sheet: false },
];
const out = {};

const dump = () => {
  const card = document.querySelector(".controls-card");
  const wrap = document.querySelector(".control-panel-wrap");
  const walk = (root) =>
    Array.from(root.children).map((el) => {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return {
        cls: el.className?.baseVal ?? String(el.className).slice(0, 48),
        tag: el.tagName,
        h: +r.height.toFixed(2),
        mt: cs.marginTop,
        mb: cs.marginBottom,
        display: cs.display,
        text: (el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 28),
      };
    });
  return {
    cardChildren: walk(card),
    wrapChildren: walk(wrap),
    cardPad: [getComputedStyle(card).paddingTop, getComputedStyle(card).paddingBottom],
    wrapPad: [getComputedStyle(wrap).paddingTop, getComputedStyle(wrap).paddingBottom],
    scrollHeight: card.scrollHeight,
    clientHeight: card.clientHeight,
    trayInner: Array.from(document.querySelectorAll(".tray-well:not([data-proto-off])")).map(
      (t) => ({
        name: (t.querySelector(".washi-tag")?.textContent || "").trim(),
        h: +t.getBoundingClientRect().height.toFixed(2),
        pad: [getComputedStyle(t).paddingTop, getComputedStyle(t).paddingBottom],
        kids: walk(t),
      }),
    ),
  };
};

for (const engine of ["chromium"]) {
  for (const cell of CELLS) {
    const browser = await (engine === "webkit" ? webkit : chromium).launch();
    const ctx = await browser.newContext({
      viewport: { width: cell.w, height: cell.h },
      deviceScaleFactor: 1,
      isMobile: cell.mobile && engine === "chromium" ? true : undefined,
      hasTouch: cell.mobile,
    });
    await ctx.addInitScript(() => {
      try {
        localStorage.clear();
      } catch {}
    });
    const page = await ctx.newPage();
    await page.goto(BASE + "?size=3&difficulty=EASY", { waitUntil: "domcontentloaded" });
    await page.waitForSelector(".controls-card", { state: "attached", timeout: 30000 });
    await page.waitForTimeout(1400);
    if (cell.sheet) {
      await page.locator(".drawer-tab").click({ force: true });
      await page.waitForTimeout(950);
    }
    out[`${cell.name}-BEFORE`] = await page.evaluate(dump);
    // minimal overlay: hide three trays, keep the rest untouched
    await page.addStyleTag({
      content: `.tray-well[data-proto-off]{display:none!important}`,
    });
    await page.evaluate(() => {
      const trays = Array.from(document.querySelectorAll(".tray-well"));
      trays.forEach((t, i) => {
        if (i !== 2) t.setAttribute("data-proto-off", "");
      });
    });
    await page.waitForTimeout(200);
    out[`${cell.name}-CHECKING-ONLY`] = await page.evaluate(dump);
    await browser.close();
  }
}
writeFileSync(join(HERE, "residue.json"), JSON.stringify(out, null, 1));
for (const [k, v] of Object.entries(out)) {
  console.log(`\n=== ${k}  sh=${v.scrollHeight}/${v.clientHeight} pad=${v.cardPad}`);
  for (const c of v.cardChildren) console.log(`  CARD  ${c.h.toString().padStart(8)}  ${c.tag}.${c.cls} mt=${c.mt} mb=${c.mb} ${c.display}`);
  for (const c of v.wrapChildren) console.log(`  WRAP  ${c.h.toString().padStart(8)}  ${c.tag}.${c.cls} mt=${c.mt} mb=${c.mb} ${c.display} | ${c.text}`);
}
