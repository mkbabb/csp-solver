// CTRL-TABS · probe 6 — THE FAMILY'S HARDEST NUMBER.
//   node rank-vs-row.probe.mjs
// R1 ROW 3 says a group NAME must clear the option chip it captions by 1.23× (the desk's own
// shipped ratio less 5%). The option chip is 20px on the phone, so a tab word must be ≥24.60px.
// This sweeps the tab word's rung and reports the widest four (and five) words that fit the
// strip at every cell, in both engines, with and without the hand's own tracking.
import { chromium, webkit } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const BASE = process.env.LANE_BASE || "http://127.0.0.1:4232/";
const CELLS = [
  { name: "dock-390x844", w: 390, h: 844, mobile: true, strip: 374 },
  { name: "dock-375x812", w: 375, h: 812, mobile: true, strip: 359 },
  { name: "dock-430x932", w: 430, h: 932, mobile: true, strip: 414 },
  { name: "land-900x500", w: 900, h: 500, mobile: true, strip: 884 },
  { name: "desk-1280x800", w: 1280, h: 800, mobile: false, strip: 284.22 },
];
const out = {};

const sweep = (stripW) => {
  const FOUR = ["new game", "pencils", "checking", "players"];
  const FIVE = [...FOUR, "keys"];
  const probe = document.createElement("span");
  probe.style.cssText =
    "position:absolute;visibility:hidden;white-space:nowrap;font-family:var(--font-hand);text-transform:lowercase;";
  document.body.appendChild(probe);
  const w = (t, px, weight, track) => {
    probe.style.fontSize = px + "px";
    probe.style.fontWeight = String(weight);
    probe.style.letterSpacing = track;
    probe.textContent = t;
    return probe.getBoundingClientRect().width;
  };
  const PAD = 8; // 0.25rem each side — the strip's own padding-inline
  const SEAM = 4;
  const need = (arr, px, weight, track) =>
    arr.reduce((a, t) => a + Math.max(44, w(t, px, weight, track) + PAD), 0) + SEAM * (arr.length - 1);
  const rows = [];
  for (let px = 14; px <= 34; px += 0.5) {
    for (const track of ["0.06em", "0em"]) {
      rows.push({
        px,
        track,
        need4: +need(FOUR, px, 500, track).toFixed(2),
        need5: +need(FIVE, px, 500, track).toFixed(2),
        fits4: need(FOUR, px, 500, track) <= stripW,
        fits5: need(FIVE, px, 500, track) <= stripW,
      });
    }
  }
  const maxFit4 = rows.filter((r) => r.fits4).reduce((a, r) => (r.px > a ? r.px : a), 0);
  const maxFit4Tight = rows.filter((r) => r.fits4 && r.track === "0em").reduce((a, r) => (r.px > a ? r.px : a), 0);
  const maxFit5 = rows.filter((r) => r.fits5).reduce((a, r) => (r.px > a ? r.px : a), 0);
  const optionPx = +parseFloat(
    getComputedStyle(document.querySelector(".ctrl-btn")).fontSize,
  ).toFixed(2);
  // `probe` STAYS ATTACHED until every reader below has run — a detached span measures 0 and
  // the first cut of this probe silently reported 188px (4 × the tap floor) for every rung.
  const R = {
    stripW,
    optionPx,
    ROW3_floor: +(optionPx * 1.23).toFixed(2),
    maxFit4_tracked: maxFit4,
    maxFit4_untracked: maxFit4Tight,
    maxFit5_any: maxFit5,
    ROW3_reachable_4: maxFit4 >= +(optionPx * 1.23).toFixed(2),
    ROW3_reachable_4_untracked: maxFit4Tight >= +(optionPx * 1.23).toFixed(2),
    ROW3_reachable_5: maxFit5 >= +(optionPx * 1.23).toFixed(2),
    // what the ROW-3 rung actually costs
    atFloor: (() => {
      const px = +(optionPx * 1.23).toFixed(2);
      return {
        px,
        need4_tracked: +need(FOUR, px, 500, "0.06em").toFixed(2),
        need4_untracked: +need(FOUR, px, 500, "0em").toFixed(2),
        need5_untracked: +need(FIVE, px, 500, "0em").toFixed(2),
        overflow4_tracked: +(need(FOUR, px, 500, "0.06em") - stripW).toFixed(2),
        overflow4_untracked: +(need(FOUR, px, 500, "0em") - stripW).toFixed(2),
      };
    })(),
    // two-line tabs: the widest single word sets the column
    twoLine: (() => {
      const px = +(optionPx * 1.23).toFixed(2);
      const widest = (t) =>
        Math.max(...t.split(" ").map((word) => w(word, px, 500, "0.06em")));
      const cols = FOUR.map((t) => Math.max(44, widest(t) + PAD));
      return {
        px,
        cols: cols.map((c) => +c.toFixed(2)),
        need4: +(cols.reduce((a, b) => a + b, 0) + SEAM * 3).toFixed(2),
        fits: cols.reduce((a, b) => a + b, 0) + SEAM * 3 <= stripW,
      };
    })(),
  };
  // THE VERTICAL ARM — tabs down the rail's left flank, writing-mode vertical-rl. The strip's
  // constraint becomes the card's HEIGHT and the cost is the WIDTH it steals from the rail.
  const cardBox = document.querySelector(".controls-card").getBoundingClientRect();
  const px = +(optionPx * 1.23).toFixed(2);
  const lens = FOUR.map((t) => Math.max(44, w(t, px, 500, "0.06em") + PAD));
  R.vertical = {
    px,
    cardH: +cardBox.height.toFixed(2),
    cardW: +cardBox.width.toFixed(2),
    tabLengths: lens.map((l) => +l.toFixed(2)),
    need4: +(lens.reduce((a, b) => a + b, 0) + SEAM * 3).toFixed(2),
    fits4: lens.reduce((a, b) => a + b, 0) + SEAM * 3 <= cardBox.height,
    need5: +(lens.reduce((a, b) => a + b, 0) + Math.max(44, w("keys", px, 500, "0.06em") + PAD) + SEAM * 4).toFixed(2),
    fits5:
      lens.reduce((a, b) => a + b, 0) + Math.max(44, w("keys", px, 500, "0.06em") + PAD) + SEAM * 4 <=
      cardBox.height,
    // the flank's own depth: the tongue's 48px, which is what the rail would have to give up
    flankDepthPx: 48,
    boardLeft: +(document.querySelector(".board-paper") || document.querySelector(".board-wrapper"))
      .getBoundingClientRect().x.toFixed(2),
  };
  probe.remove();
  return R;
};

for (const engine of ["chromium", "webkit"]) {
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
    await page.waitForTimeout(1500);
    if (cell.mobile) {
      await page.locator(".drawer-tab").click({ force: true });
      await page.waitForTimeout(950);
    }
    const r = await page.evaluate(sweep, cell.strip);
    out[`${cell.name}-${engine}`] = r;
    console.log(
      `[${cell.name}-${engine}] strip ${r.stripW} option ${r.optionPx} ROW3 floor ${r.ROW3_floor}px | ` +
        `max 4-word rung tracked ${r.maxFit4_tracked} untracked ${r.maxFit4_untracked} (5-word ${r.maxFit5_any}) | ` +
        `ROW3 reachable: 4=${r.ROW3_reachable_4}/${r.ROW3_reachable_4_untracked} 5=${r.ROW3_reachable_5} | ` +
        `at floor need4 ${r.atFloor.need4_tracked} (over ${r.atFloor.overflow4_tracked}) | two-line ${r.twoLine.need4} fits=${r.twoLine.fits}`,
    );
    await browser.close();
  }
}
writeFileSync(join(HERE, "rank-vs-row.json"), JSON.stringify(out, null, 1));
console.log("\nbanked probe/rank-vs-row.json");
