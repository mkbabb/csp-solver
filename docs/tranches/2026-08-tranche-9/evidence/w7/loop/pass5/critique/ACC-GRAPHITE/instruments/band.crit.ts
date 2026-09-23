/** CRITIC (pass 5): G2 re-read, independent of ring5. Desk 1280x800 dpr1 light fine and phone 393x699 dpr1 light
 *  COARSE (hasTouch, pointer:coarse witnessed). Tree dist vs control dist, mintBoard(3,30). (1) the frame's perimeter
 *  alpha50 median on the UNFOCUSED board (every side, the chair's statistic); (2) the focused band's alpha50 on its
 *  top+bottom sides over the middle half of the cell, focus reached by a real ArrowRight from the neighbour. */
import { test } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import sharp from "sharp";
import { mintBoard } from "./lib";
const SUB = !!process.env.SUB; const S = process.env.OUTDIR!; mkdirSync(S, { recursive: true });
const ARMS: [string, string][] = [["tree", "http://127.0.0.1:4240"], ["control", "http://127.0.0.1:4241"]];
const RIGS = [{ n: "desk", vp: { width: 1280, height: 800 }, touch: false }, { n: "phone", vp: { width: 393, height: 699 }, touch: true }];
const med = (a: number[]) => { const b = [...a].sort((x, y) => x - y); return b.length ? b[b.length >> 1] : NaN; };
const q = (a: number[], p: number) => { const b = [...a].sort((x, y) => x - y); return b.length ? b[Math.floor(p * (b.length - 1))] : NaN; };
for (const R of RIGS) test(`band-${R.n}`, async ({ browser }, info) => {
  const out: any = { engine: info.project.name, rig: R.n };
  for (const [arm, base] of ARMS) {
    const ctx = await browser.newContext({ viewport: R.vp, deviceScaleFactor: 1, hasTouch: R.touch, isMobile: false, reducedMotion: "reduce", colorScheme: "light" });
    const page = await ctx.newPage();
    await page.goto(`${base}/?board=${mintBoard(3, 30)}`, { waitUntil: "domcontentloaded" });
    await page.waitForSelector("svg.hand-drawn-grid", { timeout: 60_000 }); await page.waitForTimeout(3000);
    const coarse = await page.evaluate(() => matchMedia("(pointer: coarse)").matches);
    const img = async (clip: any) => { const { data, info: i } = await sharp(await page.screenshot({ clip })).raw().toBuffer({ resolveWithObject: true }); return { data, w: i.width, h: i.height, ch: i.channels }; };
    const Lp = (im: any, x: number, y: number) => { const i = (y * im.w + x) * im.ch; return 0.2126 * im.data[i] + 0.7152 * im.data[i + 1] + 0.0722 * im.data[i + 2]; };
    // (1) perimeter: scan inward from the svg edge, first ink run, alpha50 between paper (p95 L of the board) and ink (p1 L)
    const b = await page.evaluate(() => { const r = document.querySelector("svg.hand-drawn-grid")!.getBoundingClientRect(); return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) }; });
    const B = await img({ x: b.x, y: b.y, width: b.w, height: b.h });
    const Ls: number[] = []; for (let y = 0; y < B.h; y += 3) for (let x = 0; x < B.w; x += 3) Ls.push(Lp(B, x, y));
    const paper = q(Ls, 0.95), ink = q(Ls, 0.005), thr = paper - 0.5 * (paper - ink);
    const run = (get: (t: number) => number, span: number) => { let a = -1, e = -1; for (let t = 0; t < span; t++) { if (get(t) < thr) { if (a < 0) a = t; e = t; } else if (a >= 0) break; } if (a < 0) return 0; const fa = a > 0 ? (get(a - 1) - thr) / (get(a - 1) - get(a)) : 0; const fe = e + 1 < span ? (get(e + 1) - thr) / (get(e + 1) - get(e)) : 0; return SUB ? e - a + fa + fe : e - a + 1; };
    const side: Record<string, number[]> = { top: [], bottom: [], left: [], right: [] }; const span = 16, m = 24;
    for (let x = m; x < B.w - m; x++) { side.top.push(run((t) => Lp(B, x, t), span)); side.bottom.push(run((t) => Lp(B, x, B.h - 1 - t), span)); }
    for (let y = m; y < B.h - m; y++) { side.left.push(run((t) => Lp(B, t, y), span)); side.right.push(run((t) => Lp(B, B.w - 1 - t, y), span)); }
    const all = [...side.top, ...side.bottom, ...side.left, ...side.right];
    // (2) band: focus cell 31 (empty in mintBoard(3,30)? pick first empty cell with an empty left neighbour in the middle rows)
    const idx = await page.evaluate(() => { const ins = Array.from(document.querySelectorAll(".game-cell input")); const g = ins.map((i) => /given/i.test(i.getAttribute("aria-label") ?? "")); for (const i of [30, 31, 39, 40, 41, 48, 49, 32]) if (!g[i] && i % 9 > 0) return i; return 40; });
    await page.locator(".game-cell input").nth(idx - 1).focus(); await page.keyboard.press("ArrowRight"); await page.waitForTimeout(1500);
    const fv = await page.evaluate(() => document.activeElement?.matches(":focus-visible") ?? false);
    const c = await page.locator(".game-cell").nth(idx).boundingBox();
    const pad = 16; const C = await img({ x: Math.round(c!.x - pad), y: Math.round(c!.y - pad), width: Math.round(c!.width + 2 * pad), height: Math.round(c!.height + 2 * pad) });
    const bt: number[] = [], bb: number[] = [];
    const x0 = Math.round(pad + c!.width * 0.25), x1 = Math.round(pad + c!.width * 0.75);
    for (let x = x0; x < x1; x++) { // longest dark run crossing each horizontal edge band
      const col = (y: number) => Lp(C, x, y) < thr;
      const longest = (ya: number, yb: number) => { let best = 0, cur = 0, bs = 0, be = 0, st = 0; for (let y = ya; y < yb; y++) { if (col(y)) { if (!cur) st = y; cur++; if (cur > best) { best = cur; bs = st; be = y; } } else cur = 0; } if (!best || !SUB) return best; const g = (y: number) => Lp(C, x, y); const fa = bs > 0 ? (g(bs - 1) - thr) / (g(bs - 1) - g(bs)) : 0; const fe = be + 1 < C.h ? (g(be + 1) - thr) / (g(be + 1) - g(be)) : 0; return be - bs + fa + fe; };
      bt.push(longest(0, Math.round(pad + c!.height * 0.35))); bb.push(longest(Math.round(pad + c!.height * 0.65), C.h));
    }
    await ctx.close();
    out[arm] = { coarse, focusVisible: fv, cell: idx, paper: +paper.toFixed(1), ink: +ink.toFixed(1), frame: Object.fromEntries(Object.entries(side).map(([k, v]) => [k, +med(v).toFixed(3)])), frameMedian: +med(all).toFixed(3), frameP5: q(all, 0.05), frameP95: q(all, 0.95), bandTopMed: +med(bt).toFixed(3), bandBottomMed: +med(bb).toFixed(3) };
  }
  writeFileSync(`${S}/band-${info.project.name}-${R.n}.json`, JSON.stringify(out, null, 1));
});
