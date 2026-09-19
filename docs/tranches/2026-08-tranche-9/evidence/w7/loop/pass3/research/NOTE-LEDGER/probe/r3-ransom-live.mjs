#!/usr/bin/env node
/** NOTE-LEDGER pass-3 RESEARCH — the ransom note, LIVE and both halves.
 *  16x16 (`?size=4`) puts A-G in the record; a box-axis hidden single puts `x` in it. Read
 *  through the estate's own font-census algorithm, scoped to the strip. Read-only, HEAD :4249. */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  chromium,
  webkit,
} from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";

const BASE = "http://127.0.0.1:4249";
const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass3/research/NOTE-LEDGER/logs";
mkdirSync(OUT, { recursive: true });

const MIXED = () => {
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
  const w = document.createTreeWalker(strip, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = w.nextNode())) {
    const t = n.nodeValue;
    if (!t || !t.trim()) continue;
    const el = n.parentElement;
    const b = el.getBoundingClientRect();
    if (b.width < 3 || b.height < 3) continue;
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
    hasTouch: true,
  });
  const page = await ctx.newPage();
  const rows = [];
  await page.goto(`${BASE}/?size=4&difficulty=EASY`);
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 120000 });
  await page.waitForTimeout(3000);
  for (let nth = 0; nth < 20; nth++) {
    await page.evaluate((n) => {
      const inputs = [...document.querySelectorAll(".board-cells input")];
      const open = inputs.filter((i) => !i.value && !i.readOnly && !i.disabled);
      open[(n * 7) % Math.max(1, open.length)]?.focus();
    }, nth);
    await page.keyboard.press("h");
    await page.waitForTimeout(400);
    const note = await page.evaluate(
      () => document.querySelector(".margin-note")?.textContent?.trim() ?? "",
    );
    if (note) {
      rows.push({ nth, note, mixed: await page.evaluate(MIXED) });
      if (/[A-G]/.test(note) || / box$/.test(note)) break;
    }
    await page.keyboard.press("h");
    await page.waitForTimeout(150);
  }
  await ctx.close();
  await browser.close();
  writeFileSync(join(OUT, `r3-16x16-${name}.json`), JSON.stringify(rows, null, 2));
  console.log(name, JSON.stringify(rows.filter((r) => r.mixed.length)));
}
await run("chromium", chromium);
console.log("DONE");
