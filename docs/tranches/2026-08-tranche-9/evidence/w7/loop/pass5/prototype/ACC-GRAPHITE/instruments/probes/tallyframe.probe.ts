/** ACC-GRAPHITE pass 5 — the 16x16 tally ballot crop: ONE payload mintBoard(4, 76) with 77 written,
 *  1280x800 dpr1 light fine, ALONG dist :4237 vs ACROSS dist :4239 (one variable: TALLY_ACROSS).
 *  Saves the board's top band and right edge per arm. */
import { test } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { mintBoard, solution } from "./lib";
const S = process.env.OUTDIR!; mkdirSync(S, { recursive: true });
for (const [arm, base] of [["along", "http://127.0.0.1:4237"], ["across", "http://127.0.0.1:4239"]]) test(`tallyframe-${arm}`, async ({ browser }, info) => {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, reducedMotion: "reduce", colorScheme: "light" });
  const page = await ctx.newPage();
  await page.goto(`${base}/?board=${mintBoard(4, 76)}`, { waitUntil: "domcontentloaded" });
  await page.waitForSelector("svg.hand-drawn-grid", { timeout: 60_000 }); await page.waitForTimeout(2500);
  const given = await page.evaluate(() => Array.from(document.querySelectorAll(".game-cell input")).map((i) => /given/i.test(i.getAttribute("aria-label") ?? "")));
  let w = 0;
  for (let i = 0; i < given.length && w < 77; i++) { if (given[i]) continue; const v = solution(4, i); if (v > 9) continue; await page.locator(".game-cell input").nth(i).focus(); await page.keyboard.type(String(v)); w++; }
  await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur()); await page.mouse.move(1, 1); await page.waitForTimeout(1500);
  const b = await page.evaluate(() => { const r = document.querySelector("svg.hand-drawn-grid")!.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; });
  await page.screenshot({ path: `${S}/tf-${info.project.name}-${arm}-top.png`, clip: { x: b.x + b.w * 0.42, y: b.y - 3, width: b.w * 0.58 + 3, height: 58 } });
  await page.screenshot({ path: `${S}/tf-${info.project.name}-${arm}-right.png`, clip: { x: b.x + b.w - 58, y: b.y - 3, width: 61, height: b.h * 0.55 } });
  await ctx.close();
});
