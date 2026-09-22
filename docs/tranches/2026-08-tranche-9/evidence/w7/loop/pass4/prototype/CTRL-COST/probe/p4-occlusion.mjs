#!/usr/bin/env node
// T9-W7 pass 4 · CTRL-COST — THE OCCLUSION HEADLINE, WITH ITS PREDICATE PRINTED, AND HEAD
// RE-DERIVED UNDER THE SAME ONE (charter row 6; registry §2.10 struck pass 3's headline).
//
// Pass 3 read "0 of 25 covered in EVERY cell" under `belowExemptBand` and carried `exempt: 3`
// and `exempt: 2` inside the same objects, unprinted; pass 2's HEAD figures (71.5 % / 63.3 %)
// were computed WITHOUT the predicate, so the comparison was never like-for-like. This probe
// states the predicate ONCE, generically, and runs the SAME predicate on both trees:
//
//   OCCLUDER   the nearest ancestor of the hit that is `position: sticky` inside the card.
//              (CTRL-COST's band head; HEAD's own section heading. Neither name is hard-coded.)
//   EXEMPT     a hit whose centre lies inside the card's OWN top padding strip — the reserve
//              the fold sentinel paints solid card over. A sticky head inside its own reserve
//              covers paper; only one reaching past it covers a control.
//   COVERED    a sticky hit BELOW that line. That is the number the row is about.
//
// Usage: node p4-occlusion.mjs <base> <engine> <WxH> <label> <out.json>
import { chromium, webkit } from "playwright";
import { writeFileSync } from "node:fs";

const [base, engine, vp, label, out] = process.argv.slice(2);
const [w, h] = vp.split("x").map(Number);
const coarse = w < 1024;
const browser = await (engine === "webkit" ? webkit : chromium).launch();
const ctx = await browser.newContext({
  viewport: { width: w, height: h },
  hasTouch: coarse,
  deviceScaleFactor: 2,
});
const page = await ctx.newPage();
await page.emulateMedia({ reducedMotion: "reduce" });
await page.goto(`${base}/sudoku?board=1&size=3&difficulty=EASY`);
await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 30000 });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(800);
if (coarse) {
  const tab = page.locator(".drawer-tab");
  if (await tab.count()) {
    await tab.tap();
    await page.waitForTimeout(1000);
  }
}

const res = await page.evaluate(async () => {
  const r2 = (n) => +Number(n).toFixed(2);
  const card = document.querySelector(".controls-card");
  if (!card) return { error: "no controls card on this tree" };
  const cs = getComputedStyle(card);
  const exemptStrip = parseFloat(cs.paddingTop) || 0;
  const controls = [
    ...card.querySelectorAll("button, input, [role='button'], .option-chip"),
  ].filter((c) => {
    const r = c.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  });
  const stickyAncestor = (el) => {
    for (let n = el; n && n !== document.body; n = n.parentElement)
      if (getComputedStyle(n).position === "sticky" && card.contains(n)) return n;
    return null;
  };
  const cells = [];
  for (const off of [0, 58, 116, 200, 302, 350]) {
    card.scrollTop = off;
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    const actual = r2(card.scrollTop);
    const cardTop = card.getBoundingClientRect().top;
    const exemptLine = cardTop + exemptStrip;
    let covered = 0;
    let exempt = 0;
    const who = [];
    let n = 0;
    for (const c of controls) {
      const r = c.getBoundingClientRect();
      if (!r.width || !r.height) continue;
      n++;
      const cx = r.x + r.width / 2;
      const cy = r.y + r.height / 2;
      const hit = document.elementFromPoint(cx, cy);
      if (!hit || hit === c || c.contains(hit)) continue;
      const sticky = stickyAncestor(hit);
      if (!sticky) continue;
      if (cy > exemptLine) {
        covered++;
        who.push({
          control: (c.getAttribute("class") || "").split(" ")[0],
          cy: r2(cy),
          by: (sticky.getAttribute("class") || "").split(" ")[0],
          text: (sticky.textContent || "").trim().slice(0, 20),
        });
      } else exempt++;
    }
    cells.push({ offset: off, actual, controls: n, covered, exempt, exemptLine: r2(exemptLine), who });
  }
  card.scrollTop = 0;
  return { exemptStrip: r2(exemptStrip), cells };
});

writeFileSync(out, JSON.stringify({ label, engine, viewport: vp, base, ...res }, null, 2));
console.log(
  `${label} ${engine} ${vp}  exempt strip ${res.exemptStrip}px  ` +
    (res.cells ?? [])
      .map((c) => `${c.offset}:${c.covered}cov+${c.exempt}exempt/${c.controls}`)
      .join(" "),
);
await browser.close();
