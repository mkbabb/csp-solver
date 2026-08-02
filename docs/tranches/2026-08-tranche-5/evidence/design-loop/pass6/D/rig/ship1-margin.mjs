#!/usr/bin/env node
// PASS-6 LANE D · order (3) — re-derive ship 1's healthy-pose margin before citing it.
//
// The sentence landing at `e2e/visual-regression.spec.ts:491` says the bound is an IDENTITY,
// not a margin: `btn.h` is `auto`, so it equals its own content and `demanded` equals it to
// the hundredth. That claim carries numbers (54.38, 0.00), and the standing law is that every
// number is re-derived at citation. This rig reads exactly the geometry the row reads —
// same selectors, same `getComputedStyle` spellings — and prints the arithmetic in both
// engines, so the comment is not quoting the pass-5 report, it is quoting a measurement.
//
// Run: BASE=http://127.0.0.1:4245 node <this file>
//      (BASE must serve a BUILT dist; the row's own discipline. Default 4245.)

// playwright lives in web/frontend/node_modules; the rig lives under docs/. Walk up to the
// repo root rather than hardcoding a depth, so a moved evidence dir fails loudly, not subtly.
import { createRequire } from "node:module";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

let root = dirname(fileURLToPath(import.meta.url));
while (!existsSync(join(root, "web/frontend/package.json"))) {
  const up = dirname(root);
  if (up === root) throw new Error("repo root not found above " + import.meta.url);
  root = up;
}
const { chromium, webkit } = createRequire(join(root, "web/frontend/package.json"))("playwright");

const BASE = process.env.BASE ?? "http://127.0.0.1:4245";

const read = () => {
  const btn = document.querySelector(".controls-card .deal-btn");
  if (!btn) return null;
  const die = btn.querySelector("svg");
  const label = btn.querySelector(".icon-sublabel");
  const r = (el) => (el ? el.getBoundingClientRect() : null);
  const b = r(btn);
  const d = r(die);
  const l = r(label);
  const cs = getComputedStyle(btn);
  const px = (v) => parseFloat(v) || 0;
  return {
    btn: { w: b.width, h: b.height },
    die: d ? { w: d.width, h: d.height } : null,
    labelH: l ? l.height : 0,
    padY: px(cs.paddingTop) + px(cs.paddingBottom),
    gap: px(cs.rowGap) || px(cs.gap),
    heightDecl: cs.height,
    // The identity claim's load-bearing fact: the box is not pinned by an author height.
    heightAuthored: btn.style.height || "(none inline)",
  };
};

const f = (n) => n.toFixed(2).padStart(6);

for (const [name, engine] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  const browser = await engine.launch();
  const page = await browser.newPage({ viewport: { width: Number(process.env.VW ?? 1280), height: 800 } });
  await page.goto(BASE + "/");
  await page.waitForSelector("svg.handwritten-logo", { timeout: 15000 });
  const g = await page.evaluate(read);
  await browser.close();

  if (!g) {
    console.log(`${name}: .controls-card .deal-btn NOT FOUND — the rig is blind, not green`);
    process.exitCode = 1;
    continue;
  }

  const demanded = g.die.w + g.labelH + g.padY + g.gap;
  const headroom = g.btn.h - demanded;
  const contentSum = g.die.h + g.labelH + g.padY + g.gap;

  console.log(`[${name}]`);
  console.log(`  btn        h ${f(g.btn.h)}   w ${f(g.btn.w)}   computed height: ${g.heightDecl}`);
  console.log(`  die        h ${f(g.die.h)}   w ${f(g.die.w)}   (square within 0.5? ${Math.abs(g.die.h - g.die.w) <= 0.5})`);
  console.log(`  labelH     ${f(g.labelH)}`);
  console.log(`  padY       ${f(g.padY)}`);
  console.log(`  gap        ${f(g.gap)}`);
  console.log(`  demanded = die.w + labelH + padY + gap = ${f(demanded)}`);
  console.log(`  HEADROOM   btn.h - demanded = ${f(headroom)}    (the row allows -0.50)`);
  console.log(`  IDENTITY   die.h + labelH + padY + gap = ${f(contentSum)}  vs btn.h ${f(g.btn.h)}` +
    `  -> delta ${f(g.btn.h - contentSum)}`);
  console.log("");
}
