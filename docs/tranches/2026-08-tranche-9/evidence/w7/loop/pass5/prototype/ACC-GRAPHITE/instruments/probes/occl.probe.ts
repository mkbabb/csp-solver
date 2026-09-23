/** Tick-to-glyph and tick-to-rule clearance (the pass-4 critic's occl.crit.ts, widened to the WHOLE
 *  board and to the rule): masks by toggling layers with injected CSS on ONE page. ARMS = CSS
 *  overrides of the tally's stroke width / inset, one page per board, both engines. */
import { test } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import sharp from "sharp";
import { mintBoard, solution } from "./lib";
const S = process.env.OUTDIR!; mkdirSync(S, { recursive: true });
const BASE = process.env.BASE ?? "http://127.0.0.1:4235";
const BOARDS = [{ s: 2, g: 4, w: 6 }, { s: 3, g: 30, w: 20 }, { s: 4, g: 76, w: 77 }].filter((b) => (process.env.SIZES ?? "2,3,4").split(",").includes(String(b.s)));
const ARMS: [string, string][] = JSON.parse(process.env.ARMS ?? '[["shipped",""]]');
for (const B of BOARDS) test(`occl-${B.s * B.s}`, async ({ browser }, info) => {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, reducedMotion: "reduce", colorScheme: (process.env.THEME as any) ?? "light" });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/?board=${mintBoard(B.s, B.g)}`, { waitUntil: "domcontentloaded" });
  await page.waitForSelector("svg.hand-drawn-grid", { timeout: 60_000 }); await page.waitForTimeout(2500);
  const cells = await page.evaluate(() => Array.from(document.querySelectorAll(".game-cell input")).map((i) => /given/i.test(i.getAttribute("aria-label") ?? "")));
  let written = 0;
  for (let i = 0; i < cells.length && written < B.w; i++) { if (cells[i]) continue; const v = solution(B.s, i); if (v > 9) continue; await page.locator(".game-cell input").nth(i).focus(); await page.keyboard.type(String(v)); written++; }
  await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur()); await page.mouse.move(1, 1); await page.waitForTimeout(1500);
  const b = await page.evaluate(() => { const r = document.querySelector("svg.hand-drawn-grid")!.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; });
  const clip = { x: b.x - 4, y: b.y - 4, width: b.w + 8, height: b.h + 8 };
  const shot = async (css: string) => { await page.evaluate((c) => { document.getElementById("occ")?.remove(); const s = document.createElement("style"); s.id = "occ"; s.textContent = c; document.head.append(s); }, css); await page.waitForTimeout(250); const { data, info } = await sharp(await page.screenshot({ clip })).raw().toBuffer({ resolveWithObject: true }); return { data, w: info.width, h: info.height, ch: info.channels }; };
  const NT = ".progress-pose{visibility:hidden !important}", NG = ".game-cell .glyph-svg{visibility:hidden !important}";
  const L = (im: any, i: number) => 0.2126 * im.data[i * im.ch] + 0.7152 * im.data[i * im.ch + 1] + 0.0722 * im.data[i * im.ch + 2];
  const A = await shot(NT), C = await shot(NT + NG);
  const out: any = { engine: info.project.name, size: B.s * B.s, payload: mintBoard(B.s, B.g).slice(0, 16) + "…", written, arms: {} };
  const dark = (process.env.THEME ?? "light") === "dark"; const sgn = dark ? -1 : 1;
  for (const [name, css] of ARMS) {
    const D = await shot(NG + css);
    let glyph = 0, tick = 0, both = 0, onRule = 0;
    for (let i = 0; i < A.w * A.h; i++) {
      const g = sgn * (L(C, i) - L(A, i)) > 60, t = sgn * (L(C, i) - L(D, i)) > 60;
      if (g) glyph++; if (t) { tick++; if (sgn * (255 * (dark ? 0 : 1) - L(C, i)) * (dark ? -1 : 1) > 0 && (dark ? L(C, i) > 120 : L(C, i) < 128)) onRule++; } if (g && t) both++;
    }
    const kinfo = await page.evaluate(() => { const p = document.querySelector(".progress-pose.is-active path"); return (p?.getAttribute("d")?.match(/M/g) ?? []).length; });
    out.arms[name] = { css, ticks: kinfo, glyphPx: glyph, tickPx: tick, tickOnGlyphPx: both, tickOnGlyphPct: +(100 * both / (glyph || 1)).toFixed(2), tickOnRulePx: onRule, tickOnRulePct: +(100 * onRule / (tick || 1)).toFixed(2) };
  }
  writeFileSync(`${S}/occl-${info.project.name}-${B.s * B.s}-${process.env.THEME ?? "light"}.json`, JSON.stringify(out));
  await ctx.close();
});
