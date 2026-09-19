/**
 * ACC-GRAPHITE pass-3 CRITIQUE — G3's CLEARANCE, which the prototype copied but did not run.
 *
 * The violet gauge's disease was that a retrace of a rule IS a rule. The cure is an inward
 * offset (`.progress-pose { scale(0.968) }`) that is asserted at +2.1 px desk / +1.3 px phone
 * and measured nowhere. This scans VERTICALLY down through the tally's own columns on the
 * board's top edge and reports, per column: the painted rule's run, the paper between, and the
 * tick's run. A column whose paper run is 0 is a tick fused to the rule.
 */
import { test, expect } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import sharp from "sharp";

const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass3/critique/ACC-GRAPHITE/readings";
mkdirSync(OUT, { recursive: true });

const RIGS = [
  { name: "desk", width: 1280, height: 800, dpr: 1 },
  { name: "phone", width: 393, height: 699, dpr: 3 },
];

for (const rig of RIGS)
  test(`clearance-${rig.name}`, async ({ browser }, info) => {
    const engine = info.project.name;
    const ctx = await browser.newContext({
      viewport: { width: rig.width, height: rig.height },
      deviceScaleFactor: rig.dpr,
      hasTouch: rig.name === "phone",
      colorScheme: "light",
      reducedMotion: "reduce",
    });
    const page = await ctx.newPage();
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.waitForSelector(".hand-drawn-grid", { timeout: 60_000 });
    await page.waitForTimeout(2500);

    // write enough digits that the tally wraps the top edge
    const inputs = page.locator(".game-cell input:not([readonly])");
    const n = await inputs.count();
    const target = Math.min(20, n);
    for (let i = 0; i < target; i++) {
      await inputs.nth(i).focus();
      await page.keyboard.type("1");
    }
    await page.locator("h1, body").first().click({ position: { x: 2, y: 2 } }).catch(() => {});
    await page.waitForTimeout(900);

    const info2 = await page.evaluate(() => {
      const board = document.querySelector("svg.hand-drawn-grid") as SVGSVGElement;
      const r = board.getBoundingClientRect();
      const bar = document.querySelector('[role="progressbar"]');
      const active = document.querySelector(".progress-pose.is-active .progress-trace");
      const d = active?.getAttribute("d") ?? "";
      const subpaths = (d.match(/M/g) || []).length;
      const pose = active
        ? getComputedStyle(active.parentElement as Element).transform
        : null;
      const cs = active ? getComputedStyle(active) : null;
      return {
        board: { x: r.x, y: r.y, w: r.width, h: r.height },
        valuenow: bar?.getAttribute("aria-valuenow") ?? null,
        valuetext: bar?.getAttribute("aria-valuetext") ?? null,
        subpaths,
        pose,
        strokeWidth: cs?.strokeWidth ?? null,
        strokeLinecap: cs?.strokeLinecap ?? null,
        dash: cs?.strokeDasharray ?? null,
        pathLength: active?.getAttribute("pathLength") ?? null,
        stroke: cs?.stroke ?? null,
      };
    });
    expect(info2.subpaths).toBeGreaterThan(0);

    // clip the top edge of the board, full width, 40 css px tall
    const clip = {
      x: info2.board.x,
      y: Math.max(0, info2.board.y - 4),
      width: info2.board.w,
      height: 40,
    };
    const buf = await page.screenshot({ clip });
    const img = sharp(buf);
    const meta = await img.metadata();
    const raw = await img.raw().toBuffer();
    const W = meta.width!;
    const H = meta.height!;
    const ch = meta.channels!;
    const S = rig.dpr;
    const lum = (x: number, y: number) => {
      const i = (y * W + x) * ch;
      return 0.2126 * raw[i] + 0.7152 * raw[i + 1] + 0.0722 * raw[i + 2];
    };

    // per column: the vertical runs of ink from the top
    const cols: {
      x: number;
      runs: { start: number; len: number }[];
    }[] = [];
    for (let x = 0; x < W; x++) {
      const runs: { start: number; len: number }[] = [];
      let cur: { start: number; len: number } | null = null;
      for (let y = 0; y < H; y++) {
        if (lum(x, y) < 110) {
          if (!cur) cur = { start: y, len: 1 };
          else cur.len++;
        } else if (cur) {
          runs.push(cur);
          cur = null;
        }
      }
      if (cur) runs.push(cur);
      cols.push({ x, runs });
    }

    // a TICK column has >= 2 ink runs in this strip (rule, then tick); a bare column has 1.
    const tickCols = cols.filter((c) => c.runs.length >= 2);
    const fusedCols = cols.filter((c) => c.runs.length === 1 && c.runs[0].len / S > 11);
    const gaps = tickCols.map((c) => (c.runs[1].start - (c.runs[0].start + c.runs[0].len)) / S);
    gaps.sort((a, b) => a - b);
    const median = gaps.length ? gaps[Math.floor(gaps.length / 2)] : null;
    const tickThick = tickCols.map((c) => c.runs[1].len / S);
    tickThick.sort((a, b) => a - b);
    const ruleThick = cols.map((c) => (c.runs[0] ? c.runs[0].len / S : 0)).filter((v) => v > 0);
    ruleThick.sort((a, b) => a - b);

    const out = {
      engine,
      rig: rig.name,
      ...info2,
      columnsScanned: W / S,
      tickColumns: tickCols.length,
      fusedColumns: fusedCols.length,
      gapMedianCss: median,
      gapMinCss: gaps[0] ?? null,
      negativeOrZeroGapColumns: gaps.filter((g) => g <= 0).length,
      tickThicknessMedianCss: tickThick.length ? tickThick[Math.floor(tickThick.length / 2)] : null,
      ruleThicknessMedianCss: ruleThick.length ? ruleThick[Math.floor(ruleThick.length / 2)] : null,
    };
    writeFileSync(`${OUT}/clearance-${rig.name}-${engine}.json`, JSON.stringify(out, null, 2));

    if (rig.name === "desk" && engine === "chromium") {
      await page.screenshot({
        path: `${OUT}/../frames-crit/tally-top-desk-light-chromium.png`,
        clip: { x: info2.board.x, y: Math.max(0, info2.board.y - 6), width: 300, height: 44 },
      });
    }
    await ctx.close();
  });
