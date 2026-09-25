/** ACC-GRAPHITE pass-7 CRITIC: the OUTSIDE tally's clearance to the ink above the board (the heading),
 *  read from PAINTED bytes. 16×16 mintBoard(4,76) + 77 written (the ballot's payload), light, DPR 1.
 *  Per column: the topmost tick pixel (ticks-on minus ticks-hidden, ΔL > 60) and the lowest dark
 *  pixel ABOVE it on the ticks-hidden photograph (L < 120 = heading/other ink). Gap = rows between.
 *  NEGATIVE CONTROL: the probe re-run with the pose translated up 12 px (it must shrink the gap). */
import { test } from "@playwright/test";
import sharp from "sharp";
import { mintBoard, solution } from "./lib";
const ARMS: [string, string][] = JSON.parse(process.env.ARMS!);
const VW = Number(process.env.VW ?? 393), VH = Number(process.env.VH ?? 699), TOUCH = !!process.env.TOUCH;
for (const [arm, base] of ARMS) test(`clear-${arm}`, async ({ browser }, info) => {
  const ctx = await browser.newContext({ viewport: { width: VW, height: VH }, deviceScaleFactor: 1, reducedMotion: "reduce", colorScheme: "light", hasTouch: TOUCH });
  const page = await ctx.newPage();
  await page.goto(`${base}/?board=${mintBoard(4, 76)}`, { waitUntil: "domcontentloaded" });
  await page.waitForSelector("svg.hand-drawn-grid", { timeout: 60_000 }); await page.waitForTimeout(2500);
  const index = await page.evaluate(() => [...document.scripts].map((s) => s.src).find((s) => /index-/.test(s))?.split("/").pop());
  const cells = await page.evaluate(() => Array.from(document.querySelectorAll(".game-cell input")).map((i) => /given/i.test(i.getAttribute("aria-label") ?? "")));
  let written = 0;
  for (let i = 0; i < cells.length && written < 77; i++) { if (cells[i]) continue; const v = solution(4, i); if (v > 9) continue; await page.locator(".game-cell input").nth(i).focus(); await page.keyboard.type(String(v)); written++; }
  await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur()); await page.mouse.move(1, 1); await page.waitForTimeout(1500);
  const sv = await page.evaluate(() => { const r = document.querySelector("svg.hand-drawn-grid")!.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; });
  const top = Math.max(0, Math.round(sv.y - 70)), clip = { x: 0, y: top, width: VW, height: Math.round(sv.y + 40 - top) };
  const shot = async (css: string) => { await page.evaluate((c) => { document.getElementById("occ")?.remove(); const s = document.createElement("style"); s.id = "occ"; s.textContent = c; document.head.append(s); }, css); await page.waitForTimeout(300); const { data, info: m } = await sharp(await page.screenshot({ clip })).raw().toBuffer({ resolveWithObject: true }); return { data, w: m.width, h: m.height, ch: m.channels }; };
  const L = (im: any, i: number) => 0.2126 * im.data[i * im.ch] + 0.7152 * im.data[i * im.ch + 1] + 0.0722 * im.data[i * im.ch + 2];
  const measure = async (shift: string) => {
    const off = await shot(".progress-pose{visibility:hidden !important}"), on = await shot(shift);
    let min = Infinity, minX = -1, cols = 0; const gaps: number[] = [];
    for (let x = 0; x < off.w; x++) {
      let yt = -1; for (let y = 0; y < off.h; y++) { const i = y * off.w + x; if (L(off, i) - L(on, i) > 60) { yt = y; break; } }
      if (yt < 0) continue; cols++;
      let yh = -1; for (let y = yt - 1; y >= 0; y--) { const i = y * off.w + x; if (L(off, i) < 120) { yh = y; break; } }
      if (yh < 0) continue; const g = yt - yh - 1; gaps.push(g); if (g < min) { min = g; minX = x; }
    }
    gaps.sort((a, b) => a - b);
    return { tickCols: cols, colsWithInkAbove: gaps.length, minGap: min, atX: minX, p10: gaps[Math.floor(gaps.length * 0.1)] ?? null, touching: gaps.filter((g) => g <= 1).length };
  };
  const clean = await measure("");
  const neg = await measure(".progress-pose.is-active{translate:0 -12px !important}");
  const head = await page.evaluate((svTop) => { let best: any = null; for (const e of Array.from(document.querySelectorAll("h1,h2,h3,p,span,div,label"))) { if (!(e as HTMLElement).innerText || e.children.length > 0) continue; const r = e.getBoundingClientRect(); if (r.bottom <= svTop + 1 && r.height > 0 && (!best || r.bottom > best.b)) best = { t: (e as HTMLElement).innerText.slice(0, 30), b: +r.bottom.toFixed(1), tag: e.tagName }; } return best; }, sv.y);
  console.log(`CLEAR ${info.project.name} ${VW}x${VH} ${arm} ${index} written ${written} svgTop ${sv.y.toFixed(1)} nearest-text-above ${JSON.stringify(head)} · clean ${JSON.stringify(clean)} · NEG(-12px) ${JSON.stringify(neg)}`);
  await ctx.close();
});
