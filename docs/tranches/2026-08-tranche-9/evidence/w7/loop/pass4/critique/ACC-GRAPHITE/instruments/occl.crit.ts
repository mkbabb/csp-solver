/** CRITIC: does the shipped ALONG tally occlude top-row glyph ink? 4 shots per board, masks by
 *  toggling layers with injected CSS on ONE page; overlap = tick mask AND glyph mask. */
import { test } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import sharp from "sharp";
import { encodeSudoku } from "../e2e/wire";
const S = process.env.OUTDIR!; mkdirSync(S, { recursive: true });
const BASE = process.env.BASE ?? "http://127.0.0.1:4245";
function solution(size: number, i: number) { const n = size * size, r = Math.floor(i / n), c = i % n; return ((r * size + Math.floor(r / size) + c) % n) + 1; }
function mint(size: number, givens: number) { const n = size * size, total = n * n, cells: Record<number, number> = {}; for (let i = 0; i < total; i++) if ((i * 37) % total < givens) cells[i] = solution(size, i); return encodeSudoku(size, cells, total); }
const BOARDS = [{ s: 2, g: 4, w: 6 }, { s: 3, g: 30, w: 20 }, { s: 4, g: 76, w: 77 }];
const ACROSS = process.env.ACROSS === "1";
for (const B of BOARDS) {
  test(`occl-${B.s * B.s}`, async ({ browser }, info) => {
    test.setTimeout(170_000);
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, reducedMotion: "reduce" });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/?board=${mint(B.s, B.g)}`, { waitUntil: "domcontentloaded" });
    await page.waitForSelector("svg.hand-drawn-grid", { timeout: 60_000 });
    await page.waitForTimeout(2500);
    const n = B.s * B.s;
    const cells = await page.evaluate(() => Array.from(document.querySelectorAll(".game-cell input")).map((i) => /given/i.test(i.getAttribute("aria-label") ?? "")));
    let written = 0;
    for (let i = 0; i < cells.length && written < B.w; i++) {
      if (cells[i]) continue; const v = solution(B.s, i); if (v > 9) continue;
      await page.locator(".game-cell input").nth(i).focus(); await page.keyboard.type(String(v)); written++;
    }
    await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    await page.mouse.move(1, 1);
    await page.waitForTimeout(1500);
    const b = await page.evaluate(() => { const r = document.querySelector("svg.hand-drawn-grid")!.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; });
    const clip = { x: b.x - 4, y: b.y - 4, width: b.w + 8, height: b.h + 8 };
    const shot = async (css: string) => { await page.evaluate((c) => { document.getElementById("occ")?.remove(); const s = document.createElement("style"); s.id = "occ"; s.textContent = c; document.head.append(s); }, css); await page.waitForTimeout(300); const { data, info } = await sharp(await page.screenshot({ clip })).raw().toBuffer({ resolveWithObject: true }); return { data, w: info.width, h: info.height, ch: info.channels }; };
    const NT = ".progress-pose{visibility:hidden !important}", NG = ".game-cell .glyph-svg{visibility:hidden !important}";
    const A = await shot(NT), C = await shot(NT + NG), D = await shot(NG), F = await shot("");
    const L = (im: any, i: number) => 0.2126 * im.data[i * im.ch] + 0.7152 * im.data[i * im.ch + 1] + 0.0722 * im.data[i * im.ch + 2];
    let glyph = 0, tick = 0, both = 0, topGlyph = 0, topBoth = 0;
    const topBand = (clip.height) / n; // the top row's height
    for (let y = 0; y < A.h; y++) for (let x = 0; x < A.w; x++) {
      const i = y * A.w + x; const g = L(C, i) - L(A, i) > 60; const t = L(C, i) - L(D, i) > 60;
      if (g) glyph++; if (t) tick++; if (g && t) both++;
      if (y < topBand) { if (g) topGlyph++; if (g && t) topBoth++; }
    }
    const kinfo = await page.evaluate(() => { const p = document.querySelector(".progress-pose.is-active path, .progress-pose path"); const d = p?.getAttribute("d") ?? ""; return { subpaths: (d.match(/M/g) ?? []).length }; });
    const res = { engine: info.project.name, size: n, written, ticks: kinfo.subpaths, glyphPx: glyph, tickPx: tick, overlapPx: both, topRowGlyphPx: topGlyph, topRowOccludedPx: topBoth, topRowOccludedPct: +(100 * topBoth / (topGlyph || 1)).toFixed(2) };
    writeFileSync(`${S}/occl-${info.project.name}-${n}${ACROSS ? "-across" : ""}.json`, JSON.stringify(res));
    await sharp(await page.screenshot({ clip: { ...clip, height: Math.min(clip.height, topBand * 1.3) } })).png().toFile(`${S}/occl-${info.project.name}-${n}.png`);
    await ctx.close();
  });
}
