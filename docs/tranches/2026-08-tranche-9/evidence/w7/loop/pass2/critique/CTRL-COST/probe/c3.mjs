#!/usr/bin/env node
/** CTRL-COST critic c3 — ATTRIBUTE THE SCROLL. Focus the verb FIRST, let its own focus-scroll
 *  settle, park nothing, then read; press Enter; read again. Whatever moves now is the ARM's. */
import fs from "node:fs";
import { chromium, webkit } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";
const BASE = process.env.BASE || "http://127.0.0.1:4241";
const OUT = process.argv[2] || "./c3.json";
const RECTS = () => {
  const r = (s) => { const e = document.querySelector(s); if (!e) return null;
    const b = e.getBoundingClientRect();
    return [+b.x.toFixed(2), +b.y.toFixed(2), +b.width.toFixed(2), +b.height.toFixed(2)]; };
  const c = document.querySelector(".controls-card");
  return { dealFace: r(".deal-face"), band3: r(".cost-band:nth-of-type(3)"),
    answer: r(".deal-face .act-answer"), scrollTop: c ? +c.scrollTop.toFixed(2) : null,
    scrollHeight: c ? c.scrollHeight : null };
};
async function run(engine, name) {
  const br = await engine.launch();
  const ctx = await br.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/?size=3&difficulty=EASY`);
  await page.waitForSelector(".controls-card", { state: "attached", timeout: 30000 });
  await page.waitForTimeout(1000);
  if (await page.evaluate(() => document.documentElement.classList.contains("drawer-closed"))) {
    await page.locator(".drawer-tab").click({ force: true });
    await page.waitForTimeout(950);
  }
  await page.locator('button[aria-label^="Fill in every cell"]').click();
  await page.waitForTimeout(900);
  // THE VERB'S OWN focus-scroll happens here and is allowed to settle.
  await page.locator(".deal-btn").focus();
  await page.waitForTimeout(700);
  const before = await page.evaluate(RECTS);
  await page.keyboard.press("Enter");
  await page.waitForTimeout(700);
  const after = await page.evaluate(RECTS);
  // and the DISARM leg
  await page.keyboard.press("Escape");
  await page.waitForTimeout(700);
  const afterDisarm = await page.evaluate(RECTS);
  const focusAfterDisarm = await page.evaluate(() => ({
    cls: document.activeElement?.className || document.activeElement?.tagName,
    sheetTop: document.querySelector(".drawer-case")?.getBoundingClientRect().top ?? null,
  }));
  await ctx.close(); await br.close();
  return { engine: name, before, after, afterDisarm, focusAfterDisarm };
}
const out = [];
for (const [e, n] of [[chromium, "chromium"], [webkit, "webkit"]]) {
  try { out.push(await run(e, n)); } catch (err) { out.push({ engine: n, error: String(err).slice(0, 600) }); }
}
fs.writeFileSync(OUT, JSON.stringify(out, null, 2));
console.log("DONE", OUT);
