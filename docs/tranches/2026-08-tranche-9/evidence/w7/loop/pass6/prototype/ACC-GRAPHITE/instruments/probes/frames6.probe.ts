/** ACC-GRAPHITE pass 6 — the two lawful ballot pairs, each on ONE encoded payload, ONE variable, two
 *  built dists (never injected CSS):
 *   chip   shipped (:4238) | OUTSET-110 (:4240, the PROPOSED diff applied and built) — 393x699 dpr3
 *          coarse (hasTouch, pointer: coarse witnessed), light, mintBoard(3, 30), your digit typed in
 *          the centre-block cell and focused by a real key (focus-visible witnessed). Per arm: digit
 *          px, band px, band-over-digit px, by layer toggling on the arm's own page.
 *   tally  inside (:4238) | OUTSIDE (:4239, TALLY_OUTSIDE = true) — 1280x800 dpr1 fine, light,
 *          mintBoard(4, 76) with 77 written, the board's top-right quarter with 24 px of margin.
 *  Each pair is composed side by side (left = shipped) and written for pngquant. */
import { test, expect } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import sharp from "sharp";
import { mintBoard, solution } from "./lib";
const S = process.env.OUTDIR!; mkdirSync(S, { recursive: true });
const FV = ".game-cell:has(input:focus-visible)";
const L = (d: Buffer, i: number, ch: number) => 0.2126 * d[i * ch] + 0.7152 * d[i * ch + 1] + 0.0722 * d[i * ch + 2];
async function compose(parts: { data: Buffer; w: number; h: number; ch: number }[], file: string) {
  const gap = 12, W = parts.reduce((a, p) => a + p.w, 0) + gap * (parts.length - 1), H = Math.max(...parts.map((p) => p.h));
  const comp = parts.map((p, k) => ({ input: p.data, raw: { width: p.w, height: p.h, channels: p.ch as 3 | 4 }, left: parts.slice(0, k).reduce((a, q) => a + q.w + gap, 0), top: 0 }));
  await sharp({ create: { width: W, height: H, channels: 3, background: { r: 128, g: 128, b: 128 } } }).composite(comp).png().toFile(file);
}
test("chip-pair", async ({ browser }, info) => {
  const shots: any[] = []; const out: any = { engine: info.project.name, payload: mintBoard(3, 30), arms: {} };
  for (const [arm, base] of [["shipped", "http://127.0.0.1:4238"], ["outset110", "http://127.0.0.1:4240"]]) {
    const ctx = await browser.newContext({ viewport: { width: 393, height: 699 }, deviceScaleFactor: 3, hasTouch: true, isMobile: false, reducedMotion: "reduce", colorScheme: "light" });
    const page = await ctx.newPage();
    await page.goto(`${base}/?board=${mintBoard(3, 30)}`, { waitUntil: "domcontentloaded" });
    await page.waitForSelector("svg.hand-drawn-grid", { timeout: 60_000 }); await page.waitForTimeout(2500);
    expect(await page.evaluate(() => matchMedia("(pointer: coarse)").matches)).toBe(true);
    const given = await page.evaluate(() => Array.from(document.querySelectorAll(".game-cell input")).map((i) => /given/i.test(i.getAttribute("aria-label") ?? "")));
    const idx = given.findIndex((g, i) => !g && Math.floor(i / 9) > 2 && Math.floor(i / 9) < 6 && i % 9 > 2 && i % 9 < 6);
    await page.locator(".game-cell input").nth(idx).focus(); await page.keyboard.type(String(solution(3, idx)));
    await page.keyboard.press("Shift"); await page.waitForTimeout(900);
    const fv = await page.evaluate(() => (document.activeElement as HTMLElement)?.matches(":focus-visible"));
    expect(fv).toBe(true);
    const c = (await page.locator(".game-cell").nth(idx).boundingBox())!;
    const clip = { x: c.x - c.width * 1.05, y: c.y - c.height * 0.55, width: c.width * 3.1, height: c.height * 2.1 };
    const set = async (css: string) => { await page.evaluate((s) => { document.getElementById("arm")?.remove(); const e = document.createElement("style"); e.id = "arm"; e.textContent = s; document.head.append(e); }, css); await page.waitForTimeout(250); };
    const grab = async () => { const { data, info: im } = await sharp(await page.screenshot({ clip })).raw().toBuffer({ resolveWithObject: true }); return { data, w: im.width, h: im.height, ch: im.channels }; };
    const NOGLYPH = `${FV} .glyph-svg{visibility:hidden !important}`, NORING = `${FV} .cell-ghost{visibility:hidden !important}`;
    await set(NOGLYPH + NORING); const b0 = await grab(); await set(NORING); const g1 = await grab(); await set(NOGLYPH); const r1 = await grab(); await set(""); const all = await grab();
    let g = 0, r = 0, both = 0;
    for (let i = 0; i < b0.w * b0.h; i++) { const gi = L(b0.data, i, b0.ch) - L(g1.data, i, g1.ch) > 60, ri = L(b0.data, i, b0.ch) - L(r1.data, i, r1.ch) > 60; if (gi) g++; if (ri) r++; if (gi && ri) both++; }
    out.arms[arm] = { index: await page.evaluate(() => [...document.scripts].map((s) => s.src).find((s) => /index-/.test(s))?.split("/").pop()), cell: idx, digitPx: g, bandPx: r, bandOverDigitPx: both };
    console.log(`CHIP ${info.project.name} ${arm} ${JSON.stringify(out.arms[arm])}`);
    shots.push(all); await ctx.close();
  }
  await compose(shots, `${S}/chip-${info.project.name}.png`);
  writeFileSync(`${S}/chip-${info.project.name}.json`, JSON.stringify(out, null, 1));
});
test("tally16-pair", async ({ browser }, info) => {
  const shots: any[] = [];
  for (const [arm, base] of [["inside", "http://127.0.0.1:4238"], ["outside", "http://127.0.0.1:4239"]]) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, reducedMotion: "reduce", colorScheme: "light" });
    const page = await ctx.newPage();
    await page.goto(`${base}/?board=${mintBoard(4, 76)}`, { waitUntil: "domcontentloaded" });
    await page.waitForSelector("svg.hand-drawn-grid", { timeout: 60_000 }); await page.waitForTimeout(2500);
    const given = await page.evaluate(() => Array.from(document.querySelectorAll(".game-cell input")).map((i) => /given/i.test(i.getAttribute("aria-label") ?? "")));
    let w = 0;
    for (let i = 0; i < given.length && w < 77; i++) { if (given[i]) continue; const v = solution(4, i); if (v > 9) continue; await page.locator(".game-cell input").nth(i).focus(); await page.keyboard.type(String(v)); w++; }
    await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur()); await page.mouse.move(1, 1); await page.waitForTimeout(1500);
    const b = await page.evaluate(() => { const r = document.querySelector("svg.hand-drawn-grid")!.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; });
    const clip = { x: Math.round(b.x + b.w * 0.62), y: Math.round(b.y - 24), width: Math.round(b.w * 0.38 + 48), height: Math.round(b.h * 0.34 + 24) };
    const { data, info: im } = await sharp(await page.screenshot({ clip })).raw().toBuffer({ resolveWithObject: true });
    console.log(`TALLY16 ${info.project.name} ${arm} written ${w} index ${await page.evaluate(() => [...document.scripts].map((s) => s.src).find((s) => /index-/.test(s))?.split("/").pop())} cls ${await page.evaluate(() => document.querySelector(".progress-pose.is-active")?.getAttribute("class"))}`);
    shots.push({ data, w: im.width, h: im.height, ch: im.channels }); await ctx.close();
  }
  await compose(shots, `${S}/tally16-${info.project.name}.png`);
});
