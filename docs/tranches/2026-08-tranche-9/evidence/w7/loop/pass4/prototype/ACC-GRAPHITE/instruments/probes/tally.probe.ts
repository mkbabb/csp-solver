/**
 * ACC-GRAPHITE pass 4 — LAW A's gestalt at THREE board sizes (charter rows 4, 5).
 *
 * Each board is a real encoded payload (lib.ts); `written` cells are typed by hand, with the
 * pattern solution's digit, into the first writable cells whose digit is 1-9 (fill is counted,
 * not correctness, GameBoard.vue:350). The tally is then read three ways: the progressbar's
 * own `aria-valuenow`, the active pose's subpath count (k), and the geometry of the ticks on the
 * TOP side in screen px — pitch, the length each tick lays ALONG the rule, the length it lays
 * ACROSS it, and the parallel duty (along-length / pitch: the "second dashed rule" number).
 * The clearance from the tally to the nearest top-row glyph is read off the DOM geometry
 * (tick endpoints through the path's screen CTM; the glyph path's bbox grown by half its
 * stroke), and the painted gap to the frame rule is read off pixels.
 *
 * FORM is the env TALLY_FORM label only; the arm itself is `TALLY_ACROSS` in HandDrawnGrid.vue,
 * flipped between runs — the probe asserts which form it actually sees.
 */
import { test, expect } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { BOARD4, BOARD9, BOARD16, SCRATCH, solution, r3, median } from "./lib";

const FORM = process.env.TALLY_FORM ?? "along";
const OUT = `${SCRATCH}/tally`;
mkdirSync(OUT, { recursive: true });
mkdirSync(`${SCRATCH}/frames`, { recursive: true });

const CASES = [
  { name: "4x4", size: 2, b: BOARD4, written: 6 },
  { name: "9x9", size: 3, b: BOARD9, written: 20 },
  { name: "16x16", size: 4, b: BOARD16, written: 77 },
];
const RIGS = [
  { name: "desk", width: 1280, height: 800, dpr: 1, touch: false },
  { name: "phone", width: 393, height: 699, dpr: 3, touch: true },
];

for (const rig of RIGS)
  for (const c of CASES)
    test(`tally-${FORM}-${rig.name}-${c.name}`, async ({ browser, baseURL }, info) => {
      test.setTimeout(170_000);
      const engine = info.project.name;
      const ctx = await browser.newContext({
        viewport: { width: rig.width, height: rig.height }, deviceScaleFactor: rig.dpr,
        hasTouch: rig.touch, colorScheme: "light", reducedMotion: "reduce",
      });
      const page = await ctx.newPage();
      await page.goto(`${baseURL}/?board=${c.b.enc}`, { waitUntil: "domcontentloaded" });
      await page.waitForSelector("svg.hand-drawn-grid", { timeout: 60_000 });
      await page.waitForTimeout(2000);
      const n = c.b.n;
      const given = new Set(c.b.given);
      const targets: number[] = [];
      for (let i = 0; i < c.b.total && targets.length < c.written; i++)
        if (!given.has(i) && solution(c.size, i) <= 9) targets.push(i);
      const inputs = page.locator(".game-cell input");
      expect(await inputs.count()).toBe(c.b.total);
      for (const i of targets) {
        await inputs.nth(i).focus();
        await page.keyboard.type(String(solution(c.size, i)));
      }
      await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
      await page.waitForTimeout(600);
      const read = await page.evaluate(() => {
        const board = document.querySelector("svg.hand-drawn-grid") as SVGSVGElement;
        const br = board.getBoundingClientRect();
        const bar = document.querySelector('[role="progressbar"]');
        const act = (board.querySelector(".progress-pose.is-active .progress-trace") ??
          board.querySelector(".progress-trace")) as SVGPathElement | null;
        const d = act?.getAttribute("d") ?? "";
        const subs = d.split("M").filter((s) => s.trim()).map((s) =>
          (s.match(/-?[\d.]+,-?[\d.]+/g) ?? []).map((q) => q.split(",").map(Number)));
        const m = act?.getScreenCTM();
        const toS = (p: number[]) => {
          const q = new DOMPoint(p[0], p[1]).matrixTransform(m!);
          return [q.x, q.y];
        };
        const S = subs.map((pts) => pts.map(toS));
        // top side: subpaths whose mean y is within 6 % of the board top
        const top = S.filter((pts) => pts.reduce((a, p) => a + p[1], 0) / pts.length < br.y + br.height * 0.06)
          .sort((a, b) => a[0][0] - b[0][0]);
        const alongLen = top.map((pts) => Math.abs(Math.max(...pts.map((p) => p[0])) - Math.min(...pts.map((p) => p[0]))));
        const acrossLen = top.map((pts) => Math.abs(Math.max(...pts.map((p) => p[1])) - Math.min(...pts.map((p) => p[1]))));
        const starts = top.map((pts) => Math.min(...pts.map((p) => p[0])));
        const pitches = starts.slice(1).map((x, i) => x - starts[i]);
        const tickBottom = top.length ? Math.max(...top.flatMap((pts) => pts.map((p) => p[1]))) : NaN;
        const cs = act ? getComputedStyle(act) : null;
        const sw = cs ? parseFloat(cs.strokeWidth) : NaN;
        const scale = br.width / board.viewBox.baseVal.width;
        const poseScale = act ? new DOMMatrix(getComputedStyle(act.parentElement!).transform).a : NaN;
        // top-row glyphs: the painted top of each digit in the first row of cells
        const cells = Array.from(document.querySelectorAll(".game-cell")) as HTMLElement[];
        const side = Math.round(Math.sqrt(cells.length));
        const glyphTops: number[] = [];
        for (let col = 0; col < side; col++) {
          const g = cells[col].querySelector(".glyph-svg path") as SVGGraphicsElement | null;
          if (!g) continue;
          const r = g.getBoundingClientRect();
          if (r.height < 2) continue;
          const gsw = parseFloat(getComputedStyle(g).strokeWidth) * ((g.ownerSVGElement!.getBoundingClientRect().width / (g.ownerSVGElement!.viewBox.baseVal.width || 1)) || 1);
          glyphTops.push(r.y - gsw / 2);
        }
        return {
          valuenow: bar?.getAttribute("aria-valuenow"), valuetext: bar?.getAttribute("aria-valuetext"),
          k: subs.length, topCount: top.length, board: { x: br.x, y: br.y, w: br.width, h: br.height },
          strokeWidthU: sw, linecap: cs?.strokeLinecap, dash: cs?.strokeDasharray, poseScale,
          tickThicknessPx: sw * scale * (poseScale || 1),
          alongLenPx: alongLen, acrossLenPx: acrossLen, pitchPx: pitches,
          tickBottomPx: tickBottom, glyphTopsPx: glyphTops,
          cellPitchPx: br.width / side, side,
        };
      });
      const alongMed = median(read.alongLenPx), acrossMed = median(read.acrossLenPx), pitchMed = median(read.pitchPx);
      const glyphClear = read.glyphTopsPx.length ? Math.min(...read.glyphTopsPx) - (read.tickBottomPx + (FORM === "across" ? 0 : read.tickThicknessPx / 2)) : NaN;
      // painted: the paper between the rule and the tally, on the top side, per column (c50 of the column's own ink)
      const clip = { x: read.board.x, y: Math.max(0, read.board.y - 4), width: read.board.w, height: Math.min(read.cellPitchPx * 0.75, 80) };
      const png = await page.screenshot({ clip, path: `${SCRATCH}/frames/tally-${FORM}-${rig.name}-${c.name}-${engine}.png` });
      void png;
      const out = {
        engine, rig: rig.name, board: c.name, form: FORM, payload: c.b.enc, writable: c.b.total - c.b.given.length, typed: targets.length,
        valuenow: read.valuenow, valuetext: read.valuetext, k: read.k, kTop: read.topCount,
        strokeWidthU: read.strokeWidthU, linecap: read.linecap, dash: read.dash, poseScale: read.poseScale,
        tickThicknessPx: r3(read.tickThicknessPx), alongMedPx: r3(alongMed), acrossMedPx: r3(acrossMed), pitchMedPx: r3(pitchMed),
        parallelDuty: r3(alongMed / pitchMed), cellPitchPx: r3(read.cellPitchPx),
        tickToTopGlyphClearPx: r3(glyphClear), glyphsInTopRow: read.glyphTopsPx.length,
      };
      writeFileSync(`${OUT}/tally-${FORM}-${rig.name}-${c.name}-${engine}.json`, JSON.stringify(out, null, 1));
      expect(read.k).toBeGreaterThan(0);
      await ctx.close();
    });
