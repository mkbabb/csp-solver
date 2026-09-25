import { test, expect, devices, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

async function loadSudoku(page: Page) {
  await page.goto("./?size=3&difficulty=EASY");
  await page.waitForSelector("svg.handwritten-logo", { timeout: 15000 });
  await page.addStyleTag({ content: ".tuner-toggle { display: none !important; }" });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 15000 })
    .toBeGreaterThan(0);
}
/** Two photographs of one clip, the subject shown and then hidden by `hideCss`, decoded in the
 *  page: per column, whether any pixel moved (> 24 on a channel), and every moved pixel's contrast
 *  against its own ground pixel. The CORE is the moved pixels whose luminance moved ≥ half the
 *  p98 move (CTRL-TAPE's `EDGE_COVERAGE` recipe, pass 6, cut to one band). A RECT IS NOT PAINT. */
const PAINT_DIFF = async (
  page: Page,
  clip: { x: number; y: number; width: number; height: number },
  hideCss: string,
) => {
  const on = (await page.screenshot({ clip })).toString("base64");
  const hide = await page.addStyleTag({ content: hideCss });
  const off = (await page.screenshot({ clip })).toString("base64");
  await hide.evaluate((n) => (n as Element).remove());
  return page.evaluate(
    async ({ on, off }) => {
      const px = async (b64: string) => {
        const bmp = await createImageBitmap(await (await fetch(`data:image/png;base64,${b64}`)).blob());
        const c = new OffscreenCanvas(bmp.width, bmp.height);
        const g = c.getContext("2d")!;
        g.drawImage(bmp, 0, 0);
        return g.getImageData(0, 0, bmp.width, bmp.height);
      };
      const [a, b] = [await px(on), await px(off)];
      const { width: w, height: h } = a;
      const lin = (c: number) => ((c /= 255) <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
      const L = (d: Uint8ClampedArray, o: number) =>
        0.2126 * lin(d[o]) + 0.7152 * lin(d[o + 1]) + 0.0722 * lin(d[o + 2]);
      const moved: { move: number; r: number }[] = [];
      let cols = 0;
      const x0 = Math.floor(w * 0.05);
      const x1 = Math.ceil(w * 0.95);
      for (let x = x0; x < x1; x++) {
        let hit = false;
        for (let y = 0; y < h; y++) {
          const o = (y * w + x) * 4;
          const d = Math.max(
            Math.abs(a.data[o] - b.data[o]),
            Math.abs(a.data[o + 1] - b.data[o + 1]),
            Math.abs(a.data[o + 2] - b.data[o + 2]),
          );
          if (d <= 24) continue;
          hit = true;
          const [la, lb] = [L(a.data, o), L(b.data, o)];
          moved.push({ move: Math.abs(la - lb), r: (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05) });
        }
        if (hit) cols++;
      }
      const moves = moved.map((p) => p.move).sort((m, n) => m - n);
      const ref = moves.length ? moves[Math.floor(0.98 * (moves.length - 1))] : 0;
      const core = moved.filter((p) => p.move >= 0.5 * ref).map((p) => p.r).sort((m, n) => m - n);
      const all = moved.map((p) => p.r).sort((m, n) => m - n);
      return {
        coverage: +(cols / Math.max(1, x1 - x0)).toFixed(3),
        coreMedian: core.length ? +core[core.length >> 1].toFixed(3) : 1,
        p98: all.length ? +all[Math.floor(0.98 * (all.length - 1))].toFixed(3) : 1,
      };
    },
    { on, off },
  );
};

/** The sheet SLIDES (~700 ms): poll the case's top until two reads agree, never a fixed sleep. */
const SHEET_SETTLED = async (page: Page) => {
  let last = NaN;
  await expect
    .poll(
      async () => {
        const t = await page.evaluate(() => document.querySelector(".drawer-case")!.getBoundingClientRect().top);
        const same = Math.abs(t - last) < 0.01;
        last = t;
        return same;
      },
      { intervals: [100] },
    )
    .toBe(true);
};

/** T9-M18 on the ruled page (T9-B13 arm (b)): the foot's ONE drawn top rule is present, IS
 *  PAINTED across the foot, and is SEEN (core median ≥ 3.0 — pass-6 rulings A.5.3: existence is
 *  not visibility). Its ancestor opacity chain is read too, because an `opacity: 0` ancestor
 *  paints nothing a computed stroke can report. */
const FOOT_RULE = async (page: Page) => {
  const rule = page.locator("#card-foot svg.ruled-line");
  if ((await rule.count()) !== 1) return null;
  const box = await rule.boundingBox();
  if (!box) return null;
  const chain = await rule.evaluate((el) => {
    let o = 1;
    for (let e: Element | null = el; e; e = e.parentElement) o *= parseFloat(getComputedStyle(e).opacity);
    return o;
  });
  const clip = { x: box.x, y: box.y - 3, width: box.width, height: box.height + 6 };
  const paint = await PAINT_DIFF(page, clip, "#card-foot svg.ruled-line { visibility: hidden !important; }");
  const ink = await RULE_INK(page, clip);
  return { chain: +chain.toFixed(3), ...paint, ...ink };
};

/** PASS 7 (the pass-6 critic's gaps 3/4; LAWS P6 §E). Two holes the median above leaves:
 *  · THE INK THIS PASS CHOSE. A core median ≥ 3.0 passed the pass-5 ink (`--ink-press-rule`, 55 %)
 *    at 11 of 12 cells, WebKit 6/6 at 3.530 — that is 55 %'s own full-coverage ceiling, so no
 *    contrast floor between 3.0 and 3.53 can tell 55 % from 68 %. What CAN is the ink's painted
 *    ALPHA: a third photograph with the stroke forced to its base graphite at full strength, and
 *    per core pixel (on − off) / (full − off) on the channel that moved most. Antialiasing scales
 *    both photographs by the same coverage, so the ratio IS the painted alpha whatever the DPR or
 *    engine: 0.68 for the quiet rung, 0.55 for the rule rung. The floor is 0.62. It is RELATIVE
 *    (the reference is photographed on the subject's own element, so an opacity plant on the svg
 *    carries into it) — which is why it is never the only clause: the absolute median above stays.
 *  · FOUR BANDS. A drawn edge is read in four bands (the chair's four-band probe); a rule has one
 *    drawn side, so its four bands are its four QUARTERS along the stroke. A STATION is one device
 *    column, its value the best contrast over the strip's depth (ON vs OFF, the probe's
 *    statistic); a dropped station reads 1.00 and COUNTS. Each quarter needs ≥ 8 stations and a
 *    station median ≥ 3.0, and the fraction of ALL stations under 3:1 is bounded at 0.05. The
 *    per-pixel core fraction is printed beside it and not claimed (it is the statistic the pass-6
 *    README mis-named). */
const RULE_INK = async (page: Page, clip: { x: number; y: number; width: number; height: number }) => {
  const shot = async (css: string | null) => {
    const tag = css ? await page.addStyleTag({ content: css }) : null;
    const b64 = (await page.screenshot({ clip })).toString("base64");
    if (tag) await tag.evaluate((n) => (n as Element).remove());
    return b64;
  };
  const on = await shot(null);
  const off = await shot("#card-foot svg.ruled-line { visibility: hidden !important; }");
  const full = await shot(
    "#card-foot svg.ruled-line path { stroke: var(--color-pencil-graphite, var(--grid-line-color)) !important; }",
  );
  return page.evaluate(
    async ({ on, off, full }) => {
      const px = async (b64: string) => {
        const bmp = await createImageBitmap(await (await fetch(`data:image/png;base64,${b64}`)).blob());
        const c = new OffscreenCanvas(bmp.width, bmp.height);
        const g = c.getContext("2d")!;
        g.drawImage(bmp, 0, 0);
        return g.getImageData(0, 0, bmp.width, bmp.height);
      };
      const [a, b, f] = [await px(on), await px(off), await px(full)];
      const { width: w, height: h } = a;
      const lin = (c: number) => ((c /= 255) <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
      const L = (d: Uint8ClampedArray, o: number) =>
        0.2126 * lin(d[o]) + 0.7152 * lin(d[o + 1]) + 0.0722 * lin(d[o + 2]);
      const cr = (o: number) => {
        const [la, lb] = [L(a.data, o), L(b.data, o)];
        return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
      };
      const med = (v: number[]) => (v.length ? [...v].sort((m, n) => m - n)[v.length >> 1] : 1);
      const x0 = Math.floor(w * 0.05);
      const x1 = Math.ceil(w * 0.95);
      const stations: number[] = [];
      const fullMoves: { d: number; o: number; k: number }[] = [];
      for (let x = x0; x < x1; x++) {
        let best = 1;
        for (let y = 0; y < h; y++) {
          const o = (y * w + x) * 4;
          best = Math.max(best, cr(o));
          let k = 0;
          for (let c = 1; c < 3; c++) if (Math.abs(f.data[o + c] - b.data[o + c]) > Math.abs(f.data[o + k] - b.data[o + k])) k = c;
          const d = Math.abs(f.data[o + k] - b.data[o + k]);
          if (d > 24) fullMoves.push({ d, o, k });
        }
        stations.push(best);
      }
      const q = stations.length / 4;
      const quarters = [0, 1, 2, 3].map((i) => {
        const s = stations.slice(Math.round(i * q), Math.round((i + 1) * q));
        return { n: s.length, median: +med(s).toFixed(3) };
      });
      // the CORE, as PAINT_DIFF cuts it: pixels whose full-ink move is ≥ half the p98 move
      const ds = fullMoves.map((m) => m.d).sort((m, n) => m - n);
      const ref = ds.length ? ds[Math.floor(0.98 * (ds.length - 1))] : 0;
      const alphas = fullMoves
        .filter((m) => m.d >= 0.5 * ref)
        .map((m) => (a.data[m.o + m.k] - b.data[m.o + m.k]) / (f.data[m.o + m.k] - b.data[m.o + m.k]));
      const coreR = fullMoves.filter((m) => m.d >= 0.5 * ref).map((m) => cr(m.o));
      return {
        quarters,
        stationsUnder3: +(stations.filter((v) => v < 3).length / Math.max(1, stations.length)).toFixed(3),
        alpha: alphas.length ? +med(alphas).toFixed(3) : 0,
        alphaN: alphas.length,
        pixelCoreUnder3: +(coreR.filter((v) => v < 3).length / Math.max(1, coreR.length)).toFixed(3),
      };
    },
    { on, off, full },
  );
};
const FOOT_RULE_HOLDS = (d: Awaited<ReturnType<typeof FOOT_RULE>>) =>
  !!d &&
  d.chain > 0.9 &&
  d.coverage >= 0.9 &&
  d.coreMedian >= 3.0 &&
  d.quarters.every((q) => q.n >= 8 && q.median >= 3.0) &&
  d.stationsUnder3 <= 0.05 &&
  d.alphaN >= 40 &&
  d.alpha >= 0.62;

// ── CRITIC pass 7: plants the shipped M18 row does not carry ─────────────────────────────
for (const cell of [
  { name: "1280x800 fine", use: { viewport: { width: 1280, height: 800 } } },
  { name: "390x844 coarse", use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
]) {
  test.describe(`rc7 M18 critic plants @ ${cell.name}`, () => {
    test.use(cell.use);
    for (const theme of ["light", "dark"] as const) {
      test(`${theme}`, async ({ page }) => {
        await page.emulateMedia({ colorScheme: theme });
        await page.addInitScript((t) => { try { localStorage.setItem("sudoku-color-scheme", t); } catch {} }, theme);
        await loadSudoku(page);
        if (await page.evaluate(() => document.documentElement.classList.contains("drawer-closed")))
          await page.locator(".drawer-tab").tap();
        await expect(page.locator("#card-foot svg.ruled-line")).toHaveCount(1);
        await SHEET_SETTLED(page);
        const d = await FOOT_RULE(page);
        console.log(`[rc7] ${cell.name} ${theme} SHIPPED holds=${FOOT_RULE_HOLDS(d)} ${JSON.stringify(d)}`);
        for (const [plant, css] of [
          ["C1 stroke-opacity .81 (=55% painted, the R55 ink by another longhand)", "#card-foot svg.ruled-line path { stroke-opacity: 0.81 !important; }"],
          ["C2 path opacity .81", "#card-foot svg.ruled-line path { opacity: 0.81 !important; }"],
          ["C3 svg filter opacity(.81)", "#card-foot svg.ruled-line { filter: opacity(0.81) !important; }"],
          ["C4 mid gap 4.5% (mask)", "#card-foot svg.ruled-line { -webkit-mask-image: linear-gradient(to right,#000 48%,transparent 48%,transparent 52.5%,#000 52.5%) !important; mask-image: linear-gradient(to right,#000 48%,transparent 48%,transparent 52.5%,#000 52.5%) !important; }"],
          ["C5 R55 (the lane's own, control of the rig)", "#card-foot svg.ruled-line path { stroke: var(--ink-press-rule) !important; }"],
        ] as const) {
          const tag = await page.addStyleTag({ content: css });
          const r = await FOOT_RULE(page);
          console.log(`[rc7] ${cell.name} ${theme} plant ${plant} holds=${FOOT_RULE_HOLDS(r)} ${JSON.stringify(r)}`);
          await tag.evaluate((n) => (n as Element).remove());
        }
      });
    }
  });
}
