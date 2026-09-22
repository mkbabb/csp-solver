#!/usr/bin/env node
// T9-W7 pass 4 · CTRL-COST — W2 §2.2's REACHABILITY PROBE, at both landscape widths, both
// engines, coarse (chair §6.2; charter row 11). Pass 3 owed this and offered a favourable
// READING instead; this is the probe, and it is born-RED against the surface it claims.
//
// THE CLAIM: with the sheet reached through its own cued entry (the tab), every band's first
// control can be brought into the card's scrollport, lands inside the card's box, and hit-tests
// to ITSELF at its own centre. The card's `clientHeight` is reported as a reading beside it —
// W2 §2.2's cell is 844×390 and 812×375, and the tab is the cued path because this design
// deletes the section tabs.
//
// THE NEGATIVE CONTROL runs in the same visit: a control is shrunk to a 1px sliver behind the
// dock's own chrome and the same walk must FAIL it. A probe that cannot red is a probe that
// proves the surface has no controls.
//
// Usage: node p4-reach.mjs <base> <engine> <WxH> <out.json>
import { chromium, webkit } from "playwright";
import { writeFileSync } from "node:fs";

const [base, engine, vp, out] = process.argv.slice(2);
const [w, h] = vp.split("x").map(Number);
const browser = await (engine === "webkit" ? webkit : chromium).launch();
const ctx = await browser.newContext({
  viewport: { width: w, height: h },
  hasTouch: true,
  isMobile: false,
  deviceScaleFactor: 2,
});
const page = await ctx.newPage();
await page.emulateMedia({ reducedMotion: "reduce" });
await page.goto(`${base}/sudoku?board=1&size=3&difficulty=EASY`);
await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 30000 });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(800);

const regime = await page.evaluate(() => ({
  coarse: matchMedia("(pointer: coarse)").matches,
  hover: matchMedia("(hover: hover)").matches,
  landscape: matchMedia("(orientation: landscape)").matches,
  narrow: matchMedia("(max-width: 1023.98px)").matches,
}));

// THE CUED PATH: the tab, tapped. `openedBy` records that nothing else opened the sheet.
const tab = page.locator(".drawer-tab");
const openedByTab = (await tab.count()) > 0;
if (openedByTab) await tab.tap();
await page.waitForTimeout(1000); // the dock sheet SLIDES (~700 ms) — poll the settled pose
await page.waitForFunction(
  () => {
    const c = document.querySelector(".controls-card");
    if (!c) return false;
    const a = c.getBoundingClientRect().top;
    return new Promise((r) =>
      requestAnimationFrame(() =>
        requestAnimationFrame(() =>
          r(Math.abs(c.getBoundingClientRect().top - a) < 0.05),
        ),
      ),
    );
  },
  { timeout: 8000 },
).catch(() => {});

async function walk(sabotage) {
  return page.evaluate(async (sabotage) => {
    const r2 = (n) => +Number(n).toFixed(2);
    const card = document.querySelector(".controls-card");
    if (!card) return { error: "no card" };
    const firsts = [...document.querySelectorAll(".cost-band")].map((b) => ({
      band: b.querySelector(".section-heading")?.textContent?.trim() ?? "?",
      el: b.querySelector("button, input, [role='button'], .option-chip"),
    }));
    if (sabotage && firsts[0]?.el) {
      firsts[0].el.style.height = "1px";
      firsts[0].el.style.minHeight = "1px";
      firsts[0].el.style.pointerEvents = "none";
    }
    const rows = [];
    for (const f of firsts) {
      if (!f.el) {
        rows.push({ band: f.band, reachable: false, why: "no control" });
        continue;
      }
      f.el.scrollIntoView({ block: "center" });
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      const cb = card.getBoundingClientRect();
      const r = f.el.getBoundingClientRect();
      const cx = r.x + r.width / 2;
      const cy = r.y + r.height / 2;
      const hit = document.elementFromPoint(cx, cy);
      const inside = r.top >= cb.top - 0.5 && r.bottom <= cb.bottom + 0.5;
      const self = !!(hit && (hit === f.el || f.el.contains(hit) || hit.contains(f.el)));
      rows.push({
        band: f.band,
        cls: (f.el.getAttribute("class") || "").split(" ")[0],
        box: [r2(r.x), r2(r.y), r2(r.width), r2(r.height)],
        insideCard: inside,
        hitsSelf: self,
        hit: hit ? hit.tagName.toLowerCase() + "." + (hit.getAttribute("class") || "").split(" ")[0] : null,
        reachable: inside && self && r.height >= 44 - 0.01,
      });
    }
    return {
      cardClientHeight: r2(card.clientHeight),
      cardScrollHeight: r2(card.scrollHeight),
      rows,
    };
  }, sabotage);
}

const live = await walk(false);
const sabotaged = await walk(true);
const allReach = (live.rows ?? []).every((r) => r.reachable);
const sabotageRed = (sabotaged.rows ?? []).some((r) => !r.reachable);

const res = {
  engine,
  viewport: vp,
  regime,
  openedByTab,
  live,
  negativeControl: { sabotaged: true, someUnreachable: sabotageRed, rows: sabotaged.rows },
  verdict: { allReachable: allReach, probeCanRed: sabotageRed },
  base,
};
writeFileSync(out, JSON.stringify(res, null, 2));
console.log(
  `${engine} ${vp} coarse=${regime.coarse} tab=${openedByTab}  clientH ${live.cardClientHeight} / scrollH ${live.cardScrollHeight}  ` +
    `reachable ${(live.rows ?? []).filter((r) => r.reachable).length}/${(live.rows ?? []).length}  ` +
    `negative-control reds: ${sabotageRed}`,
);
await browser.close();
