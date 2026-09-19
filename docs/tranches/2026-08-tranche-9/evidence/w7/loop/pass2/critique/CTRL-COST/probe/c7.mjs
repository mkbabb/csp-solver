#!/usr/bin/env node
/** CTRL-COST critic c7 — THE NOTE'S OWN PAPER. The record's cited crop
 *  (`frames/writing-note-1280.png`) shows the `fill` note's second line, "left", sitting at the
 *  edge of the washi's tinted ground. The record measured the LABEL BOX against the head's
 *  budget; this reads the TEXT against the label's own paper — the tape's padding was cut from
 *  0.25rem/0.7rem to 0.02rem/0.4rem to buy that budget, and a padding is what keeps ink on
 *  paper. Both engines, both themes, desk and dock.
 */
import fs from "node:fs";
import {
  chromium,
  webkit,
} from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";

const BASE = process.env.BASE || "http://127.0.0.1:4241";
const OUT = process.argv[2] || "./c7.json";

async function run(engine, name, vp, dark) {
  const br = await engine.launch();
  const ctx = await br.newContext({ viewport: vp, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/?size=3&difficulty=EASY`);
  await page.waitForSelector(".controls-card", { state: "attached", timeout: 30000 });
  await page.waitForTimeout(1200);
  if (dark) {
    await page.evaluate(() => document.documentElement.classList.add("dark"));
    await page.waitForTimeout(400);
  }
  if (
    await page.evaluate(() => document.documentElement.classList.contains("drawer-closed"))
  ) {
    await page.locator(".drawer-tab").click({ force: true });
    await page.waitForTimeout(950);
  }
  const rows = [];
  for (const [sel, key] of [
    ['[data-note="fill"]', "fill"],
    ['[data-note="marks"]', "marks"],
    ['[data-note="solve"]', "solve"],
  ]) {
    const el = page.locator(sel).first();
    if ((await el.count()) === 0) {
      rows.push({ key, missing: true });
      continue;
    }
    await el.hover();
    await page.waitForTimeout(450);
    rows.push(
      await page.evaluate((k) => {
        const lab = document.querySelector(".cost-band-head .washi-label.is-shown");
        if (!lab) return { key: k, shown: false };
        const b = lab.getBoundingClientRect();
        // the text's own painted extent
        const r = document.createRange();
        r.selectNodeContents(lab);
        const t = r.getBoundingClientRect();
        const cs = getComputedStyle(lab);
        const head = lab.closest(".cost-band-head").getBoundingClientRect();
        const band = lab.closest(".cost-band").getBoundingClientRect();
        return {
          key: k,
          shown: true,
          label: [+b.x.toFixed(2), +b.y.toFixed(2), +b.width.toFixed(2), +b.height.toFixed(2)],
          text: [+t.x.toFixed(2), +t.y.toFixed(2), +t.width.toFixed(2), +t.height.toFixed(2)],
          overflowBottom: +(t.bottom - b.bottom).toFixed(2),
          overflowRight: +(t.right - b.right).toFixed(2),
          overflowLeft: +(b.left - t.left).toFixed(2),
          lines: Math.round(t.height / (parseFloat(cs.lineHeight) || 1)),
          lineHeight: cs.lineHeight,
          padding: cs.padding,
          headBottomOverhang: +(b.bottom - head.bottom).toFixed(2),
          bandBottom: +band.bottom.toFixed(2),
        };
      }, key),
    );
    await page.mouse.move(2, 2);
    await page.waitForTimeout(250);
  }
  await ctx.close();
  await br.close();
  return { engine: name, vp: `${vp.width}x${vp.height}`, theme: dark ? "dark" : "light", rows };
}

const out = [];
for (const [e, n] of [
  [chromium, "chromium"],
  [webkit, "webkit"],
]) {
  for (const vp of [
    { width: 1280, height: 800 },
    { width: 390, height: 844 },
  ]) {
    for (const dark of [false]) {
      try {
        out.push(await run(e, n, vp, dark));
      } catch (err) {
        out.push({ engine: n, vp: `${vp.width}x${vp.height}`, error: String(err).slice(0, 400) });
      }
      fs.writeFileSync(OUT, JSON.stringify(out, null, 2));
    }
  }
}
console.log("DONE", OUT);
