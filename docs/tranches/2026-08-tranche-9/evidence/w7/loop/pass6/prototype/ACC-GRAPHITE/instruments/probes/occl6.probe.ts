/** Tick clearance (pass-5 occl.probe.ts widened for the OUTSIDE arm): one page per board, layers
 *  toggled by injected CSS. Per arm: tick px, tick px over glyph ink, tick px over any other ink
 *  (the frame, the rule, the card's edge) read on the tick-free, glyph-free photograph, and tick
 *  px beyond the svg's box. ARMS = [name, css]; BASE = the served arm. */
import { test } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import sharp from "sharp";
import { mintBoard, solution } from "./lib";
const S = process.env.OUTDIR!; mkdirSync(S, { recursive: true });
const BASE = process.env.BASE ?? "http://127.0.0.1:4235";
const BOARDS = [{ s: 2, g: 4, w: 6 }, { s: 3, g: 30, w: 20 }, { s: 4, g: 76, w: 77 }].filter((b) => (process.env.SIZES ?? "2,3,4").split(",").includes(String(b.s)));
const ARMS: [string, string][] = JSON.parse(process.env.ARMS ?? '[["served",""]]');
const VW = Number(process.env.VW ?? 1280), VH = Number(process.env.VH ?? 800);
for (const B of BOARDS) test(`occl6-${B.s * B.s}`, async ({ browser }, info) => {
  const ctx = await browser.newContext({ viewport: { width: VW, height: VH }, deviceScaleFactor: 1, reducedMotion: "reduce", colorScheme: (process.env.THEME as any) ?? "light", hasTouch: !!process.env.TOUCH });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/?board=${mintBoard(B.s, B.g)}`, { waitUntil: "domcontentloaded" });
  await page.waitForSelector("svg.hand-drawn-grid", { timeout: 60_000 }); await page.waitForTimeout(2500);
  const cells = await page.evaluate(() => Array.from(document.querySelectorAll(".game-cell input")).map((i) => /given/i.test(i.getAttribute("aria-label") ?? "")));
  let written = 0;
  for (let i = 0; i < cells.length && written < B.w; i++) { if (cells[i]) continue; const v = solution(B.s, i); if (v > 9) continue; await page.locator(".game-cell input").nth(i).focus(); await page.keyboard.type(String(v)); written++; }
  await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur()); await page.mouse.move(1, 1); await page.waitForTimeout(1500);
  const b = await page.evaluate(() => { const r = document.querySelector("svg.hand-drawn-grid")!.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; });
  const P = 24;
  const clip = { x: Math.round(b.x - P), y: Math.round(b.y - P), width: Math.round(b.w + 2 * P), height: Math.round(b.h + 2 * P) };
  const shot = async (css: string) => { await page.evaluate((c) => { document.getElementById("occ")?.remove(); const s = document.createElement("style"); s.id = "occ"; s.textContent = c; document.head.append(s); }, css); await page.waitForTimeout(300); const { data, info } = await sharp(await page.screenshot({ clip })).raw().toBuffer({ resolveWithObject: true }); return { data, w: info.width, h: info.height, ch: info.channels }; };
  const NT = ".progress-pose{visibility:hidden !important}", NG = ".game-cell .glyph-svg{visibility:hidden !important}";
  const L = (im: any, i: number) => 0.2126 * im.data[i * im.ch] + 0.7152 * im.data[i * im.ch + 1] + 0.0722 * im.data[i * im.ch + 2];
  const A = await shot(NT), C = await shot(NT + NG);
  const dark = (process.env.THEME ?? "light") === "dark"; const sgn = dark ? -1 : 1;
  const out: any = { engine: info.project.name, size: B.s * B.s, vp: `${VW}x${VH}`, payload: mintBoard(B.s, B.g), written, board: b, arms: {} };
  for (const [name, css] of ARMS) {
    const D = await shot(NG + css);
    let glyph = 0, tick = 0, both = 0, onInk = 0, outside = 0;
    for (let y = 0; y < A.h; y++) for (let x = 0; x < A.w; x++) {
      const i = y * A.w + x;
      const g = sgn * (L(C, i) - L(A, i)) > 60, t = sgn * (L(C, i) - L(D, i)) > 60;
      if (g) glyph++;
      if (t) { tick++; if (dark ? L(C, i) > 120 : L(C, i) < 150) onInk++; if (x < P || y < P || x >= A.w - P || y >= A.h - P) outside++; }
      if (g && t) both++;
    }
    const kinfo = await page.evaluate(() => { const p = document.querySelector(".progress-pose.is-active path"); const g = p?.parentElement; return { ticks: (p?.getAttribute("d")?.match(/M/g) ?? []).length, tf: g ? getComputedStyle(g).transform : null, cls: g?.getAttribute("class") }; });
    out.arms[name] = { ...kinfo, glyphPx: glyph, tickPx: tick, tickOnGlyphPx: both, tickOnGlyphPct: +(100 * both / (glyph || 1)).toFixed(2), tickOnOtherInkPx: onInk, tickOutsideSvgPx: outside };
    console.log(`occl6 ${info.project.name} ${B.s * B.s} ${name}: ticks ${kinfo.ticks} tickPx ${tick} onGlyph ${both}/${glyph} onOtherInk ${onInk} outsideSvg ${outside} tf ${kinfo.tf}`);
    if (process.env.SHOTS) await page.screenshot({ path: `${S}/occl6-${info.project.name}-${B.s * B.s}-${name}.png`, clip });
  }
  writeFileSync(`${S}/occl6-${info.project.name}-${B.s * B.s}-${process.env.THEME ?? "light"}-${VW}.json`, JSON.stringify(out));
  await ctx.close();
});
