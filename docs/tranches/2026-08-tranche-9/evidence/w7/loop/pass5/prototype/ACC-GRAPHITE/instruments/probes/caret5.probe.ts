/** ACC-GRAPHITE pass 5 — the CARET rows (charter row 3): the wordmark's `span.logo-caret` (the
 *  pass-4 critic's caret.crit.ts, copied, ports re-pointed) AND futoshiki's clue carets on one
 *  encoded futoshiki payload, tree dist vs control dist, both themes: computed stroke-width, ink
 *  px, and differ px (> 24 levels). Sudoku payload mintBoard(3, 30); futoshiki payload below. */
import { test } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import sharp from "sharp";
import { mintBoard } from "./lib";
import { encodeFutoshiki } from "../e2e/wire";
const S = process.env.OUTDIR!; mkdirSync(S, { recursive: true });
const ARMS = [["tree", process.env.TREE_URL ?? "http://127.0.0.1:4237"], ["control", process.env.CTRL_URL ?? "http://127.0.0.1:4236"]];
const sol = (i: number) => ((Math.floor(i / 5) + (i % 5)) % 5) + 1;
const fcells: Record<number, number> = { 0: sol(0), 7: sol(7), 13: sol(13), 19: sol(19), 21: sol(21) };
const FUTO = encodeFutoshiki(5, fcells, 25, [[1, 0], [10, 5], [3, 2], [16, 15], [22, 17], [8, 7]]);
async function read(page: import("@playwright/test").Page, sel: string, theme: string) {
  const loc = page.locator(sel);
  const n = await loc.count();
  const sws = await page.evaluate((s) => Array.from(document.querySelectorAll(`${s} svg path`)).map((p) => getComputedStyle(p).strokeWidth), sel);
  const shots: { data: Buffer; w: number; h: number; ch: number }[] = [];
  let ink = 0;
  for (let i = 0; i < n; i++) {
    const { data, info: im } = await sharp(await loc.nth(i).screenshot()).raw().toBuffer({ resolveWithObject: true });
    shots.push({ data, w: im.width, h: im.height, ch: im.channels });
    for (let k = 0; k < im.width * im.height; k++) { const L = 0.2126 * data[k * im.channels] + 0.7152 * data[k * im.channels + 1] + 0.0722 * data[k * im.channels + 2]; if (theme === "light" ? L < 128 : L > 128) ink++; }
  }
  return { n, strokeWidths: [...new Set(sws)], inkPx: ink, shots };
}
const diffPx = (A: any[], B: any[]) => { let d = 0; for (let i = 0; i < Math.min(A.length, B.length); i++) { const a = A[i], b = B[i]; if (a.w !== b.w || a.h !== b.h) return -1; for (let k = 0; k < a.w * a.h; k++) { let m = 0; for (let c = 0; c < 3; c++) m = Math.max(m, Math.abs(a.data[k * a.ch + c] - b.data[k * b.ch + c])); if (m > 24) d++; } } return d; };
for (const theme of ["light", "dark"] as const) test(`caret-${theme}`, async ({ browser }, info) => {
  test.setTimeout(170_000);
  const out: any = { engine: info.project.name, theme, sudoku: mintBoard(3, 30).slice(0, 18) + "…", futoshiki: FUTO };
  const shots: any = {};
  for (const [arm, base] of ARMS) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2, colorScheme: theme, reducedMotion: "reduce" });
    const page = await ctx.newPage();
    await page.goto(`${base}/?board=${mintBoard(3, 30)}`, { waitUntil: "domcontentloaded" });
    await page.waitForSelector(".logo-caret svg path", { timeout: 60_000 });
    await page.mouse.move(640, 790); await page.waitForTimeout(3000);
    const logo = await read(page, ".logo-caret", theme);
    await page.goto(`${base}/?game=futoshiki&board=${FUTO}`, { waitUntil: "domcontentloaded" });
    await page.waitForSelector(".futoshiki-caret svg path", { timeout: 60_000 });
    await page.mouse.move(640, 790); await page.waitForTimeout(3000);
    const futo = await read(page, ".futoshiki-caret", theme);
    const givenSw = await page.evaluate(() => Array.from(document.querySelectorAll(".game-cell .glyph-svg path")).map((p) => getComputedStyle(p).strokeWidth));
    shots[arm] = { logo: logo.shots, futo: futo.shots };
    out[arm] = { logo: { n: logo.n, strokeWidths: logo.strokeWidths, inkPx: logo.inkPx }, futo: { n: futo.n, strokeWidths: futo.strokeWidths, inkPx: futo.inkPx }, futoGivenStrokeWidths: [...new Set(givenSw)] };
    await ctx.close();
  }
  out.logoDiffPx = diffPx(shots.tree.logo, shots.control.logo);
  out.futoDiffPx = diffPx(shots.tree.futo, shots.control.futo);
  writeFileSync(`${S}/caret-${info.project.name}-${theme}.json`, JSON.stringify(out, null, 1));
});
