/** CRITIC (pass 5): tick-over-glyph occlusion, tree dist ALONG, 9x9 + 16x16, both engines, light, 1280x800 dpr1 fine.
 *  Layers toggled on ONE page (the prototype's method, re-written); THREE thresholds (40/60/90 levels) as the
 *  sensitivity row; a NEGATIVE CONTROL arm in the same run: the tally pushed inward (scale 0.94 about the board
 *  centre) must collide at 9x9. Payloads mintBoard(3,30) / mintBoard(4,76). */
import { test } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import sharp from "sharp";
import { mintBoard, solution } from "./lib";
const S = process.env.OUTDIR!; mkdirSync(S, { recursive: true });
const BASE = "http://127.0.0.1:4240";
const BOARDS = [{ s: 3, g: 30, w: 20 }, { s: 4, g: 76, w: 77 }];
const ARMS: [string, string][] = [["shipped", ""], ["neg-inward-0.94", ".progress-pose{transform:scale(0.94) !important;transform-origin:50% 50% !important;transform-box:view-box !important}"]];
for (const B of BOARDS) test(`occl-${B.s * B.s}`, async ({ browser }, info) => {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, reducedMotion: "reduce", colorScheme: "light" });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/?board=${mintBoard(B.s, B.g)}`, { waitUntil: "domcontentloaded" });
  await page.waitForSelector("svg.hand-drawn-grid", { timeout: 60_000 }); await page.waitForTimeout(2500);
  const giv = await page.evaluate(() => Array.from(document.querySelectorAll(".game-cell input")).map((i) => /given/i.test(i.getAttribute("aria-label") ?? "")));
  let written = 0;
  for (let i = 0; i < giv.length && written < B.w; i++) { if (giv[i]) continue; const v = solution(B.s, i); if (v > 9) continue; await page.locator(".game-cell input").nth(i).focus(); await page.keyboard.type(String(v)); written++; }
  await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur()); await page.mouse.move(1, 1); await page.waitForTimeout(1500);
  const b = await page.evaluate(() => { const r = document.querySelector("svg.hand-drawn-grid")!.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; });
  const clip = { x: b.x - 4, y: b.y - 4, width: b.w + 8, height: b.h + 8 };
  const shot = async (css: string) => { await page.evaluate((c) => { document.getElementById("occc")?.remove(); const s = document.createElement("style"); s.id = "occc"; s.textContent = c; document.head.append(s); }, css); await page.waitForTimeout(300); const { data, info } = await sharp(await page.screenshot({ clip })).raw().toBuffer({ resolveWithObject: true }); return { data, w: info.width, h: info.height, ch: info.channels }; };
  const NT = ".progress-pose{visibility:hidden !important}", NG = ".game-cell .glyph-svg{visibility:hidden !important}";
  const L = (im: any, i: number) => 0.2126 * im.data[i * im.ch] + 0.7152 * im.data[i * im.ch + 1] + 0.0722 * im.data[i * im.ch + 2];
  const A = await shot(NT), C = await shot(NT + NG);
  const ticks = await page.evaluate(() => (document.querySelector(".progress-pose.is-active path")?.getAttribute("d")?.match(/M/g) ?? []).length);
  const out: any = { engine: info.project.name, size: B.s * B.s, written, ticks, arms: {} };
  for (const [name, css] of ARMS) {
    const D = await shot(NG + css); const r: any = {};
    for (const thr of [40, 60, 90]) { let g = 0, t = 0, both = 0; for (let i = 0; i < A.w * A.h; i++) { const gi = L(C, i) - L(A, i) > thr, ti = L(C, i) - L(D, i) > thr; if (gi) g++; if (ti) t++; if (gi && ti) both++; } r[`thr${thr}`] = { glyphPx: g, tickPx: t, overlapPx: both, pct: +(100 * both / (g || 1)).toFixed(2) }; }
    out.arms[name] = r;
  }
  writeFileSync(`${S}/occl-${info.project.name}-${B.s * B.s}.json`, JSON.stringify(out, null, 1));
  await ctx.close();
});
