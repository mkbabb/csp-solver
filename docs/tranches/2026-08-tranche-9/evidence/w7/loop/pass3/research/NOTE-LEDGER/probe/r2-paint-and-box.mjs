#!/usr/bin/env node
/**
 * NOTE-LEDGER pass-3 RESEARCH, second probe. Read-only, HEAD (74a2b5d9) on :4249.
 *
 *   P6  THE FLOOR IS WRITTEN AGAINST A BOX, AND THE READER SEES INK. The caption line box is
 *       18.1875px and the clearance to `#fold-tools` is 1.8125px — but a line box is leading
 *       plus descender, and neither is painted. `TextMetrics` (canvas 2D, the SAME family and
 *       size the strip computes) gives the real ink extent, so the disposition can be priced
 *       on paint instead of on a box. Also: the tally's real width at the caption tier, which
 *       is L14's arithmetic.
 *   P7  THE RANSOM NOTE, LIVE: hunt a hidden single whose house is a BOX across several deals
 *       and read the strip through the estate's own font-census algorithm. `HOUSE_WORD.box`
 *       (techniqueVoice.ts:35) renders `x` (U+0078), which is NOT in the 46-codepoint Patrick
 *       Hand cut — on every 9x9, not only at 16x16.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  chromium,
  webkit,
} from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";

const BASE = process.env.BASE || "http://127.0.0.1:4249";
const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass3/research/NOTE-LEDGER/logs";
mkdirSync(OUT, { recursive: true });
const bank = (n, d) => writeFileSync(join(OUT, n), JSON.stringify(d, null, 2));

const STRINGS = [
  "D goes nowhere else in this column",
  "4 goes nowhere else in this box",
  "only 4 fits here",
  "1284 backtracks · 19.9s",
  "162 backtracks · 1ms",
];

const PAINT = (strings) => {
  const block = document.querySelector(".margin-note-block");
  const p = document.createElement("p");
  p.style.cssText =
    "margin:0;width:fit-content;font-family:var(--font-hand);letter-spacing:var(--type-tracking-wide);font-size:var(--type-caption);line-height:var(--type-leading-caption);white-space:nowrap";
  p.textContent = strings[0];
  block.appendChild(p);
  const cs = getComputedStyle(p);
  const fs = parseFloat(cs.fontSize);
  const lineBox = p.getBoundingClientRect().height;
  const ctx = document.createElement("canvas").getContext("2d");
  ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${fs}px ${cs.fontFamily}`;
  const rows = strings.map((s) => {
    const m = ctx.measureText(s);
    return {
      s,
      width: m.width,
      actualAscent: m.actualBoundingBoxAscent,
      actualDescent: m.actualBoundingBoxDescent,
      fontAscent: m.fontBoundingBoxAscent,
      fontDescent: m.fontBoundingBoxDescent,
    };
  });
  p.remove();
  // half-leading: (lineBox - (fontAscent + fontDescent)) / 2 sits above AND below the text box
  const f = rows[0];
  const halfLeading = (lineBox - (f.fontAscent + f.fontDescent)) / 2;
  return {
    fontSize: fs,
    family: cs.fontFamily,
    lineBox,
    halfLeading,
    /** distance from the LINE BOX's bottom edge down-up to the lowest painted pixel */
    inkBottomInset: halfLeading + f.fontDescent - f.actualDescent,
    rows,
  };
};

const MIXED_IN_STRIP = () => {
  const ranges = {};
  for (const sheet of [...document.styleSheets]) {
    let rules;
    try {
      rules = [...sheet.cssRules];
    } catch {
      continue;
    }
    for (const r of rules) {
      if (!r.style || !r.style.getPropertyValue("unicode-range")) continue;
      const fam = r.style.getPropertyValue("font-family").replace(/["']/g, "").trim();
      const set = new Set();
      for (const m of r.style
        .getPropertyValue("unicode-range")
        .matchAll(/U\+([0-9A-Fa-f]+)(?:-([0-9A-Fa-f]+))?/g)) {
        const a = parseInt(m[1], 16);
        const b = m[2] ? parseInt(m[2], 16) : a;
        for (let c = a; c <= b; c++) set.add(c);
      }
      if (set.size) ranges[fam] = set;
    }
  }
  const out = [];
  const strip = document.querySelector(".board-margin");
  if (!strip) return out;
  const walker = document.createTreeWalker(strip, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = walker.nextNode())) {
    const t = n.nodeValue;
    if (!t || !t.trim()) continue;
    const el = n.parentElement;
    const box = el.getBoundingClientRect();
    if (box.width < 3 || box.height < 3) continue;
    const fam = getComputedStyle(el).fontFamily.split(",")[0].replace(/["']/g, "").trim();
    const set = ranges[fam];
    if (!set) continue;
    const missing = [...new Set([...t.trim()])].filter(
      (c) => c !== " " && !set.has(c.codePointAt(0)),
    );
    if (missing.length)
      out.push({
        face: fam,
        shown: t.trim(),
        missing: missing.map(
          (c) => "U+" + c.codePointAt(0).toString(16).toUpperCase().padStart(4, "0"),
        ),
      });
  }
  return out;
};

async function run(name, launcher) {
  const browser = await launcher.launch();
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: name === "chromium",
    hasTouch: true,
  });
  const page = await ctx.newPage();
  const res = { engine: name, control: "74a2b5d9", P6: null, P7: [] };

  await page.goto(`${BASE}/?size=3&difficulty=EASY`);
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 60000 });
  await page.waitForTimeout(1500);
  res.P6 = await page.evaluate(PAINT, STRINGS);

  // P7 — several deals, several cells, until a box-axis hidden single arms
  outer: for (let deal = 0; deal < 8; deal++) {
    await page.goto(`${BASE}/?size=3&difficulty=EASY&r=${deal}`);
    await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 60000 });
    await page.waitForTimeout(900);
    for (let nth = 0; nth < 6; nth++) {
      await page.evaluate((n) => {
        const inputs = [...document.querySelectorAll(".board-cells input")];
        const open = inputs.filter((i) => !i.value && !i.readOnly && !i.disabled);
        open[n % Math.max(1, open.length)]?.focus();
      }, nth);
      await page.keyboard.press("h");
      await page.waitForTimeout(450);
      const note = await page.evaluate(
        () => document.querySelector(".margin-note")?.textContent?.trim() ?? "",
      );
      if (!note) continue;
      const mixed = await page.evaluate(MIXED_IN_STRIP);
      res.P7.push({ deal, nth, note, mixed });
      if (/ box$/.test(note)) break outer;
      await page.keyboard.press("h"); // disarm
      await page.waitForTimeout(200);
    }
  }
  await ctx.close();
  await browser.close();
  const round = JSON.parse(
    JSON.stringify(res, (k, v) =>
      typeof v === "number" ? Math.round(v * 10000) / 10000 : v,
    ),
  );
  bank(`r2-${name}.json`, round);
  console.log(name, "P6 ink inset", round.P6.inkBottomInset, "| P7 rows", round.P7.length);
  return round;
}

await run("chromium", chromium);
await run("webkit", webkit);
console.log("DONE");
