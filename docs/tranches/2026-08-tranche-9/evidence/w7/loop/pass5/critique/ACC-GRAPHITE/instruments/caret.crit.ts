/** CRITIC (pass 5): caret + given weights, tree dist vs control dist, both themes, dpr2. Independent re-cut of
 *  the prototype's caret row: stroke-width of every .logo-caret / .futoshiki-caret path and every board given,
 *  plus a pixel differ of the caret crops (>24 levels). Payload mintBoard(3,30); futoshiki = the prototype's FUTO. */
import { test } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import sharp from "sharp";
import { mintBoard } from "./lib";
import { encodeFutoshiki } from "../e2e/wire";
const S = process.env.OUTDIR!; mkdirSync(S, { recursive: true });
const ARMS: [string, string][] = [["tree", "http://127.0.0.1:4240"], ["control", "http://127.0.0.1:4241"], ["control2", "http://127.0.0.1:4241"]];
const sol = (i: number) => ((Math.floor(i / 5) + (i % 5)) % 5) + 1;
const FUTO = encodeFutoshiki(5, { 0: sol(0), 7: sol(7), 13: sol(13), 19: sol(19), 21: sol(21) }, 25, [[1, 0], [10, 5], [3, 2], [16, 15], [22, 17], [8, 7]]);
async function grab(page: any, sel: string) {
  const loc = page.locator(sel); const n = await loc.count(); const shots: any[] = [];
  for (let i = 0; i < n; i++) { const { data, info } = await sharp(await loc.nth(i).screenshot()).raw().toBuffer({ resolveWithObject: true }); shots.push({ data, w: info.width, h: info.height, ch: info.channels }); }
  const sw = await page.evaluate((s: string) => Array.from(document.querySelectorAll(`${s} svg path`)).map((p) => getComputedStyle(p).strokeWidth), sel);
  return { n, sw: [...new Set(sw)], shots };
}
const diff = (A: any[], B: any[]) => { let d = 0; for (let i = 0; i < Math.min(A.length, B.length); i++) { const a = A[i], b = B[i]; if (a.w !== b.w || a.h !== b.h) return -1; for (let k = 0; k < a.w * a.h; k++) { let m = 0; for (let c = 0; c < 3; c++) m = Math.max(m, Math.abs(a.data[k * a.ch + c] - b.data[k * b.ch + c])); if (m > 24) d++; } } return d; };
for (const theme of ["light", "dark"] as const) test(`caret-${theme}`, async ({ browser }, info) => {
  const out: any = { engine: info.project.name, theme }; const shots: any = {};
  for (const [arm, base] of ARMS) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2, colorScheme: theme, reducedMotion: "reduce" });
    const page = await ctx.newPage();
    await page.goto(`${base}/?board=${mintBoard(3, 30)}`, { waitUntil: "domcontentloaded" });
    await page.waitForSelector(".logo-caret svg path", { timeout: 60_000 }); await page.mouse.move(640, 790); await page.waitForTimeout(3000);
    const logo = await grab(page, ".logo-caret");
    const givens = await page.evaluate(() => { const r: Record<string, number> = {}; for (const p of document.querySelectorAll(".game-cell .glyph-svg path")) { const k = getComputedStyle(p).strokeWidth; r[k] = (r[k] ?? 0) + 1; } return r; });
    await page.goto(`${base}/?game=futoshiki&board=${FUTO}`, { waitUntil: "domcontentloaded" });
    await page.waitForSelector(".futoshiki-caret svg path", { timeout: 60_000 }); await page.mouse.move(640, 790); await page.waitForTimeout(3000);
    const futo = await grab(page, ".futoshiki-caret");
    const fgiv = await page.evaluate(() => { const r: Record<string, number> = {}; for (const p of document.querySelectorAll(".game-cell .glyph-svg path")) { const k = getComputedStyle(p).strokeWidth; r[k] = (r[k] ?? 0) + 1; } return r; });
    shots[arm] = { logo: logo.shots, futo: futo.shots };
    out[arm] = { logoN: logo.n, logoSw: logo.sw, futoN: futo.n, futoSw: futo.sw, sudokuGivenSw: givens, futoGlyphSw: fgiv };
    await ctx.close();
  }
  out.logoDiff_tree_vs_ctrl = diff(shots.tree.logo, shots.control.logo); out.logoDiff_ctrl_vs_ctrl2 = diff(shots.control2.logo, shots.control.logo);
  out.futoDiff_tree_vs_ctrl = diff(shots.tree.futo, shots.control.futo); out.futoDiff_ctrl_vs_ctrl2 = diff(shots.control2.futo, shots.control.futo);
  writeFileSync(`${S}/caret-${info.project.name}-${theme}.json`, JSON.stringify(out, null, 1));
});
