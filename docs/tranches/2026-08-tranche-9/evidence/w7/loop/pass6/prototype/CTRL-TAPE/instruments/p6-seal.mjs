/**
 * COPIED to pass 5 from pass4/…/p4-seal.mjs: the URL is the encoded payload (LAWS P4), and
 * three LIFT rows are added (charter row 4 — the first well's tape lies below its frame; a lift
 * is priced here, never landed), each re-reading THE CROSSING under its own ablation.
 *
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
import { URL } from "./p6-lib.mjs";
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
  ["LIFT a: the first tape up 8px, paint only (translate)", `.tray-well:first-child > .washi-tag { translate: 0 -8px }`],
  ["LIFT b: the first tape up 16px, paint only (translate)", `.tray-well:first-child > .washi-tag { translate: 0 -16px }`],
  ["LIFT c: the first well's lift +8px (layout)", `.tray-well:first-child { --washi-tag-lift: 11px !important }`],
];

const res = {};
for (const [name, eng] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  const b = await eng.launch();
  const ctx = await b.newContext({
    baseURL: BASE,
    viewport: { width: +(process.env.VW || 1280), height: +(process.env.VH || 800) },
    hasTouch: true,
    isMobile: true,
  });
  const p = await ctx.newPage();
  await p.goto(URL);
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
    const cross = (await p.evaluate(CROSSING))[0];
    await p.evaluate((t) => t.remove(), tag);
    await p.waitForTimeout(120);
    abl.push({ label, delta: +(h - base).toFixed(2), first: cross && [cross.aboveLine, cross.belowLine] });
  }
  res[name] = { regime, base, crossing, ablations: abl };
  console.log(`\n== ${name} · coarse ${process.env.VW || 1280}x${process.env.VH || 800} · ${JSON.stringify(regime)}`);
  console.log(`   base .control-panel-wrap = ${base}px`);
  for (const r of abl) console.log(`   ${String(r.delta).padStart(8)}  ${r.label}  first-tape above/below ${JSON.stringify(r.first)}`);
  console.log(`   crossing: ${JSON.stringify(crossing)}`);
  await ctx.close();
  await b.close();
}
console.log("\nJSON " + JSON.stringify(res));
