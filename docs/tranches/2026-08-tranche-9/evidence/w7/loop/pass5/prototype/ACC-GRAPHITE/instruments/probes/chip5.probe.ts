/** ACC-GRAPHITE pass 5 — THE CHIP AT 393 (charter row 13): one payload mintBoard(3, 30), 393x699
 *  dpr3 hasTouch light, a REAL key press so :focus-visible rises, on a cell holding YOUR digit.
 *  Per arm (CSS on the tree dist, one variable): band ink px, digit ink px, band-over-digit px
 *  (layer toggling on one page), and a crop of the focused cell + neighbours for the ballot. */
import { test } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import sharp from "sharp";
import { mintBoard, solution } from "./lib";
const S = process.env.OUTDIR!; mkdirSync(S, { recursive: true });
const T = process.env.TREE_URL ?? "http://127.0.0.1:4237";
const FV = ".game-cell:has(input:focus-visible)";
const ARMS: [string, string][] = JSON.parse(process.env.CHIP_ARMS ?? "[]");
test("chip-393", async ({ browser }, info) => {
  test.setTimeout(170_000);
  const ctx = await browser.newContext({ viewport: { width: 393, height: 699 }, deviceScaleFactor: 3, hasTouch: true, isMobile: false, reducedMotion: "reduce", colorScheme: "light" });
  const page = await ctx.newPage();
  await page.goto(`${T}/?board=${mintBoard(3, 30)}`, { waitUntil: "domcontentloaded" });
  await page.waitForSelector("svg.hand-drawn-grid", { timeout: 60_000 }); await page.waitForTimeout(2500);
  const coarse = await page.evaluate(() => matchMedia("(pointer: coarse)").matches);
  const given = await page.evaluate(() => Array.from(document.querySelectorAll(".game-cell input")).map((i) => /given/i.test(i.getAttribute("aria-label") ?? "")));
  const idx = given.findIndex((g, i) => !g && Math.floor(i / 9) > 2 && Math.floor(i / 9) < 6 && i % 9 > 2 && i % 9 < 6);
  await page.locator(".game-cell input").nth(idx).focus(); await page.keyboard.type(String(solution(3, idx)));
  await page.keyboard.press("Shift"); await page.waitForTimeout(700);
  const fv = await page.evaluate(() => (document.activeElement as HTMLElement)?.matches(":focus-visible"));
  const c = (await page.locator(".game-cell").nth(idx).boundingBox())!;
  const clip = { x: c.x - c.width * 1.05, y: c.y - c.height * 0.55, width: c.width * 3.1, height: c.height * 2.1 };
  const set = async (css: string) => { await page.evaluate((s) => { document.getElementById("arm")?.remove(); const e = document.createElement("style"); e.id = "arm"; e.textContent = s; document.head.append(e); }, css); await page.waitForTimeout(250); };
  const L = (d: Buffer, i: number, ch: number) => 0.2126 * d[i * ch] + 0.7152 * d[i * ch + 1] + 0.0722 * d[i * ch + 2];
  const grab = async () => { const { data, info: im } = await sharp(await page.screenshot({ clip })).raw().toBuffer({ resolveWithObject: true }); return { data, w: im.width, h: im.height, ch: im.channels }; };
  const out: any = { engine: info.project.name, coarse, focusVisible: fv, payload: mintBoard(3, 30).slice(0, 18) + "…", cell: idx, arms: {} };
  const NOGLYPH = `${FV} .glyph-svg{visibility:hidden !important}`, NORING = `${FV} .cell-ghost{visibility:hidden !important}`;
  for (const [name, css] of [["shipped", ""], ...ARMS] as [string, string][]) {
    await set(css + NOGLYPH + NORING); const base = await grab();
    await set(css + NORING); const glyph = await grab();
    await set(css + NOGLYPH); const ring = await grab();
    await set(css); const all = await grab();
    let g = 0, r = 0, both = 0;
    for (let i = 0; i < base.w * base.h; i++) { const gi = L(base.data, i, base.ch) - L(glyph.data, i, glyph.ch) > 60, ri = L(base.data, i, base.ch) - L(ring.data, i, ring.ch) > 60; if (gi) g++; if (ri) r++; if (gi && ri) both++; }
    out.arms[name] = { css, digitPx: g, bandPx: r, bandOverDigitPx: both };
    await sharp(all.data, { raw: { width: all.w, height: all.h, channels: all.ch as 3 | 4 } }).png().toFile(`${S}/chip-${info.project.name}-${name}.png`);
  }
  writeFileSync(`${S}/chip-${info.project.name}.json`, JSON.stringify(out, null, 1));
  await ctx.close();
});
