/** G2 — THE STAMPED INSTRUMENT (T9-W7 pass 6, the chair's instruments lane; registry-v5 §8 act 3;
 *  from ACC-GRAPHITE's pass-5 critic's `band.crit.ts`). The statistic is `band-stat.mjs`'s, ONE for
 *  numerator and denominator: ink = the board's darkest 0.5 % (every pixel, DPR 1), both crossings
 *  interpolated (SUB=1 is no longer an option — it is the instrument), one capture resolution.
 *    frame  = the perimeter median (every side, the chair's statistic, pass5/CHAIR-RULINGS §1.4)
 *             of the UNFOCUSED board;
 *    band   = the focused cell's ring: the per-side median of the longest dark run crossing its
 *             top and its bottom edge (the middle half of the cell), and the LOWER of the two —
 *             a grid line fused to the ring can only lengthen a side's run, never shorten it
 *             (WebKit desk, first run: top 15.823 fused vs bottom 10.724); both sides printed and
 *             SIDES≠ flagged when they differ by > 2 px (a fused side on the tree; on HEAD's ring a
 *             THIN side, 0.47–2.08 px — the flag names the disagreement, not its cause); focus
 *             reached by a real ArrowRight from the neighbour (focus-visible asserted);
 *    G2     = band / frame inside [1.35, 1.45] (the window, unchanged).
 *  SENSITIVITY (printed, never gated): the frame's perimeter is BIMODAL (top/bottom ≈ 3–4 px,
 *  left/right ≈ 7.3 px at desk), so its median sits at the seam between the modes — the P45/P55
 *  of the same samples are printed beside it so a reader sees how far the denominator can move.
 *  Rigs: desk 1280×800 dpr1 light fine; phone 393×699 dpr1 light COARSE (hasTouch, `pointer:
 *  coarse` asserted). Arms: TREE_URL and CONTROL_URL (serve both dists, verify each by its
 *  index-*.js — printed). GATE=1 asserts G2 on the TREE arm; without it the row reports.
 *  OUTDIR receives one JSON per engine × rig (summarise it; never bank raw runs whole). */
import { test, expect } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import sharp from "sharp";
import { mintBoard } from "./band-lib";
import { luma, median, quantile, thresholdOf, firstRun, longestRun, runWidthPass5, G2_WINDOW } from "./band-stat.mjs";
const S = process.env.OUTDIR!;
mkdirSync(S, { recursive: true });
const GATE = process.env.GATE === "1";
const ARMS: [string, string][] = [["tree", process.env.TREE_URL!], ["control", process.env.CONTROL_URL!]];
const RIGS = [
  { n: "desk", vp: { width: 1280, height: 800 }, touch: false },
  { n: "phone", vp: { width: 393, height: 699 }, touch: true },
];
for (const R of RIGS)
  test(`band-${R.n}`, async ({ browser }, info) => {
    const out: any = { engine: info.project.name, rig: R.n, payload: mintBoard(3, 30), stat: "ink=p0.5 · paper=p95 · α50 · both crossings interpolated · dpr1" };
    for (const [arm, base] of ARMS) {
      const ctx = await browser.newContext({ viewport: R.vp, deviceScaleFactor: 1, hasTouch: R.touch, isMobile: false, reducedMotion: "reduce", colorScheme: "light" });
      const page = await ctx.newPage();
      await page.goto(`${base}/?board=${mintBoard(3, 30)}`, { waitUntil: "domcontentloaded" });
      await page.waitForSelector("svg.hand-drawn-grid", { timeout: 60_000 });
      await page.waitForTimeout(3000); // PRM reduce; the resting bake
      const index = await page.evaluate(() => [...document.scripts].map((s) => s.src).find((s) => /index-/.test(s))?.split("/").pop());
      const coarse = await page.evaluate(() => matchMedia("(pointer: coarse)").matches);
      expect(coarse, `${arm}: the pointer regime`).toBe(R.touch);
      const img = async (clip: any) => { const { data, info: i } = await sharp(await page.screenshot({ clip })).raw().toBuffer({ resolveWithObject: true }); return { data, w: i.width, h: i.height, ch: i.channels }; };
      const Lp = (im: any, x: number, y: number) => { const i = (y * im.w + x) * im.ch; return luma(im.data[i], im.data[i + 1], im.data[i + 2]); };
      const b = await page.evaluate(() => { const r = document.querySelector("svg.hand-drawn-grid")!.getBoundingClientRect(); return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) }; });
      const B = await img({ x: b.x, y: b.y, width: b.w, height: b.h });
      const Ls: number[] = [];
      for (let y = 0; y < B.h; y++) for (let x = 0; x < B.w; x++) Ls.push(Lp(B, x, y));
      const { paper, ink, thr } = thresholdOf(Ls);
      const side: Record<string, number[]> = { top: [], bottom: [], left: [], right: [] };
      const span = 16, m = 24;
      for (let x = m; x < B.w - m; x++) { side.top.push(firstRun((t) => Lp(B, x, t), span, thr)); side.bottom.push(firstRun((t) => Lp(B, x, B.h - 1 - t), span, thr)); }
      for (let y = m; y < B.h - m; y++) { side.left.push(firstRun((t) => Lp(B, t, y), span, thr)); side.right.push(firstRun((t) => Lp(B, B.w - 1 - t, y), span, thr)); }
      const all = [...side.top, ...side.bottom, ...side.left, ...side.right];
      // the pass-5 critic's crossing form on the SAME bytes, reported (never gated) so a pass-5
      // number can be read against the stamp
      const all5: number[] = [];
      for (let x = m; x < B.w - m; x++) { all5.push(firstRun((t) => Lp(B, x, t), span, thr, runWidthPass5), firstRun((t) => Lp(B, x, B.h - 1 - t), span, thr, runWidthPass5)); }
      for (let y = m; y < B.h - m; y++) { all5.push(firstRun((t) => Lp(B, t, y), span, thr, runWidthPass5), firstRun((t) => Lp(B, B.w - 1 - t, y), span, thr, runWidthPass5)); }
      const idx = await page.evaluate(() => { const ins = Array.from(document.querySelectorAll(".game-cell input")); const g = ins.map((i) => /given/i.test(i.getAttribute("aria-label") ?? "")); for (const i of [30, 31, 39, 40, 41, 48, 49, 32]) if (!g[i] && i % 9 > 0) return i; return 40; });
      await page.locator(".game-cell input").nth(idx - 1).focus();
      await page.keyboard.press("ArrowRight");
      await page.waitForTimeout(1500);
      const fv = await page.evaluate(() => document.activeElement?.matches(":focus-visible") ?? false);
      expect(fv, `${arm}: the band is the focus-visible ring`).toBe(true);
      const c = await page.locator(".game-cell").nth(idx).boundingBox();
      const pad = 16;
      const C = await img({ x: Math.round(c!.x - pad), y: Math.round(c!.y - pad), width: Math.round(c!.width + 2 * pad), height: Math.round(c!.height + 2 * pad) });
      const bt: number[] = [], bb: number[] = [], b5: number[] = [];
      const x0 = Math.round(pad + c!.width * 0.25), x1 = Math.round(pad + c!.width * 0.75);
      for (let x = x0; x < x1; x++) {
        const g = (y: number) => Lp(C, x, y);
        bt.push(longestRun(g, 0, Math.round(pad + c!.height * 0.35), thr, C.h));
        bb.push(longestRun(g, Math.round(pad + c!.height * 0.65), C.h, thr, C.h));
        b5.push(longestRun(g, 0, Math.round(pad + c!.height * 0.35), thr, C.h, runWidthPass5), longestRun(g, Math.round(pad + c!.height * 0.65), C.h, thr, C.h, runWidthPass5));
      }
      await ctx.close();
      const frame = median(all), band = Math.min(median(bt), median(bb));
      const sidesDisagree = Math.abs(median(bt) - median(bb)) > 2;
      const ratio = band / frame;
      out[arm] = { index, coarse, focusVisible: fv, cell: idx, paper: +paper.toFixed(1), ink: +ink.toFixed(1), thr: +thr.toFixed(1),
        frameSides: Object.fromEntries(Object.entries(side).map(([k, v]) => [k, +median(v).toFixed(3)])), frame: +frame.toFixed(3), frameP5: +quantile(all, 0.05).toFixed(3), frameP45: +quantile(all, 0.45).toFixed(3), frameP55: +quantile(all, 0.55).toFixed(3), frameP95: +quantile(all, 0.95).toFixed(3), sidesDisagree,
        bandTop: +median(bt).toFixed(3), bandBottom: +median(bb).toFixed(3), band: +band.toFixed(3), ratio: +ratio.toFixed(3),
        g2: ratio >= G2_WINDOW[0] && ratio <= G2_WINDOW[1] ? "inside" : "RED",
        pass5Form: { frame: +median(all5).toFixed(3), bandUnion: +median(b5).toFixed(3), ratio: +(median(b5) / median(all5)).toFixed(3) } };
      console.log(`G2 ${info.project.name} ${R.n} ${arm} ${index}: frame ${frame.toFixed(3)} [P45 ${out[arm].frameP45} · P55 ${out[arm].frameP55}] (t/b/l/r ${Object.values(out[arm].frameSides).join("/")}) · band ${band.toFixed(3)} (top ${median(bt).toFixed(3)} · bottom ${median(bb).toFixed(3)}${sidesDisagree ? " SIDES≠" : ""}) · ratio ${ratio.toFixed(3)} → ${out[arm].g2} · ink ${ink.toFixed(1)} paper ${paper.toFixed(1)} · [pass-5 form: frame ${out[arm].pass5Form.frame} band(top∪bottom) ${out[arm].pass5Form.bandUnion} ratio ${out[arm].pass5Form.ratio}]`);
    }
    writeFileSync(`${S}/band-${info.project.name}-${R.n}.json`, JSON.stringify(out, null, 1));
    if (GATE) {
      expect(out.tree.ratio, `G2 ${R.n}: band/frame ${out.tree.ratio} outside [${G2_WINDOW}]`).toBeGreaterThanOrEqual(G2_WINDOW[0]);
      expect(out.tree.ratio, `G2 ${R.n}: band/frame ${out.tree.ratio} outside [${G2_WINDOW}]`).toBeLessThanOrEqual(G2_WINDOW[1]);
    }
  });
