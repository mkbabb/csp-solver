/**
 * T9-W7 pass 4 · CTRL-TAPE — THE SEAL, READ (chair §6.1), and THE CROSSING against the
 * declared reference line. Both engines, read-only on the product.
 *
 * THE CROSSING'S REFERENCE LINE, declared once here (chair §6.1): the PAINTED bounding box
 * top of the well's own `<path>` — the `HandDrawnOutline`'s active pose stroke, taken with
 * `getBoundingClientRect()` on the `<path>` element itself, not on the `<svg>` and not on the
 * `.tray-well` box. A hand-drawn edge wobbles inside its container, so the container's rect
 * over-reports the line by the stroke's own excursion. `aboveLine` is how much of the tape
 * lies ABOVE that line; `belowLine` how much lies on the compartment's ink. A tape "taped
 * across" its frame straddles: both terms positive.
 *
 *   node p4-seal.mjs <baseURL>
 */
import {
  chromium,
  webkit,
} from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";

const BASE = process.argv[2] || "http://127.0.0.1:4230";
const PANEL_H = () => {
  const p = document.querySelector(".controls-card .control-panel-wrap");
  return p ? +p.getBoundingClientRect().height.toFixed(2) : null;
};

const CROSSING = () => {
  const out = [];
  for (const well of document.querySelectorAll(".controls-card .tray-well")) {
    const tape = well.querySelector(":scope > .washi-tag");
    if (!tape) continue;
    const pose = [...well.querySelectorAll(":scope > svg.outline-svg > g.boil-pose")].find(
      (p) => getComputedStyle(p).display !== "none",
    );
    const path = pose && pose.querySelector("path");
    if (!path) continue;
    const t = tape.getBoundingClientRect();
    const l = path.getBoundingClientRect();
    const w = well.getBoundingClientRect();
    out.push({
      name: (tape.textContent || "").trim(),
      lineTop: +l.top.toFixed(2),
      wellTop: +w.top.toFixed(2),
      containerOver: +(w.top - l.top).toFixed(2),
      tapeTop: +t.top.toFixed(2),
      tapeBottom: +t.bottom.toFixed(2),
      tapeH: +t.height.toFixed(2),
      aboveLine: +(l.top - t.top).toFixed(2),
      belowLine: +(t.bottom - l.top).toFixed(2),
    });
  }
  return out;
};

/** each row: a name, and the ONE declaration reverted in page to read its price. */
const ABLATIONS = [
  ["the name rung 25.888 -> 14.05 (head's own)", `.controls-card { --type-name: 14.05px !important }`],
  ["pin band 43.87 -> 20 (the utility class's own top)", `.controls-card { padding-top: 20px !important }`],
  ["well padding-top -> 0.35rem (the hang unpaid)", `.tray-well { padding-top: 0.35rem !important }`],
  ["first well margin 0.35rem -> 2rem (pass 1's own)", `.tray-well:first-child { margin-top: 2rem !important }`],
  ["tape leading 1.2 -> 1.5", `.controls-card .washi-tag { line-height: 1.5 !important }`],
  ["the bar back in flow inside the card (its reserve)", `.controls-card { padding-bottom: calc(3.5rem + 64.81px) !important }`],
];

const res = {};
for (const [name, eng] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  const b = await eng.launch();
  const ctx = await b.newContext({
    baseURL: BASE,
    viewport: { width: 1280, height: 800 },
    hasTouch: true,
    isMobile: true,
  });
  const p = await ctx.newPage();
  await p.goto("/?size=3&difficulty=EASY&board=seal");
  await p.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
  await p.waitForSelector(".ctrl-btn", { timeout: 30000 });
  await p.waitForTimeout(900);
  const regime = await p.evaluate(() => ({
    coarse: matchMedia("(pointer: coarse)").matches,
    row: matchMedia("(min-width: 1024px)").matches,
    rail: !!document.querySelector(".controls-card .control-panel-wrap"),
  }));
  const base = await p.evaluate(PANEL_H);
  const crossing = await p.evaluate(CROSSING);
  const abl = [];
  for (const [label, css] of ABLATIONS) {
    const tag = await p.addStyleTag({ content: css });
    await p.waitForTimeout(180);
    const h = await p.evaluate(PANEL_H);
    await p.evaluate((t) => t.remove(), tag);
    await p.waitForTimeout(120);
    abl.push({ label, delta: +(h - base).toFixed(2) });
  }
  res[name] = { regime, base, crossing, ablations: abl };
  console.log(`\n== ${name} · iPad coarse 1280x800 · ${JSON.stringify(regime)}`);
  console.log(`   base .control-panel-wrap = ${base}px`);
  for (const r of abl) console.log(`   ${String(r.delta).padStart(8)}  ${r.label}`);
  console.log(`   crossing: ${JSON.stringify(crossing)}`);
  await ctx.close();
  await b.close();
}
console.log("\nJSON " + JSON.stringify(res));
