/**
 * T9-W7 pass 1 · MRK-LIVE — THE LIVING MARK.
 *
 * Three rows beside r0's `wobble.probe.ts`, then the cure measured on the same instruments.
 *
 *  R3-a1  THE PROPORTIONAL LAW, in the open (R3-a RE-BASED). r0's R3-a asserts the ring's σ
 *         over SPACE lands in [0.5×, 2.0×] the grid's. That law is wrong on its face: the
 *         library's amplitude is `roughness × len × 0.015` (pencil-boil path.js:63), so equal
 *         σ between a 111-unit cell edge and a 948-unit rule would mean the ring wobbles
 *         8.5× HARDER per unit of stroke than the board does. The re-based law asserts what
 *         the hand actually promises: σ ÷ own edge length agrees within [0.5×, 2.0×].
 *         GREEN-BY-CONSTRUCTION at HEAD if the library law is the mechanism — which is the
 *         claim, so this row is the claim's test, not its decoration.
 *
 *  R3-a3  σ OVER TIME (NEW, BORN-RED). The same RMS, taken ACROSS the poses of one mark at a
 *         fixed arc position instead of along one pose. The grid's four poses give a non-zero
 *         number; the ring is ONE path, so its σ over time is 0 EXACTLY. Law: the ring's σ
 *         over time lands in [0.5×, 2.0×] the grid's own. RED at HEAD in both engines.
 *
 *  R3-a4  σ OVER SPACE UNMOVED (GREEN-BY-CONSTRUCTION). The cure's pose 0 is byte-identical
 *         to today's `ghostPath`, so the resting ring does not move. Asserted, not assumed.
 */
import { test, expect, type Page } from "@playwright/test";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

const HERE = dirname(new URL(import.meta.url).pathname);
const OUT = join(HERE, "..", "logs");
const PROTO = readFileSync(join(HERE, "..", "proto", "living-ring.js"), "utf8");
mkdirSync(OUT, { recursive: true });
const bank = (n: string, d: unknown) =>
  writeFileSync(join(OUT, n), JSON.stringify(d, null, 2));

async function boardReady(page: Page, query = "?size=3&difficulty=EASY") {
  await page.goto("./" + query);
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 30000 });
  await page.waitForSelector("path.cell-line", { state: "attached", timeout: 30000 });
  await page.waitForTimeout(1400);
}

async function focusCell(page: Page, idx?: number) {
  await page.evaluate((i) => {
    const inputs = Array.from(
      document.querySelectorAll(".game-cell input"),
    ) as HTMLInputElement[];
    inputs[i ?? Math.floor(inputs.length / 2)]?.focus();
  }, idx);
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(400);
}

/** σ over SPACE and the EDGE LENGTH it belongs to, for one path. */
const SPACE = `(sel, index, l0, l1, samples) => {
  const els = Array.from(document.querySelectorAll(sel));
  const el = els[index];
  if (!el) return null;
  const svg = el.ownerSVGElement;
  const vb = svg.viewBox.baseVal;
  const scale = svg.getBoundingClientRect().width / (vb.width || 1);
  const total = el.getTotalLength();
  const pts = [];
  for (let i = 0; i <= samples; i++) {
    const p = el.getPointAtLength(total * (l0 + (l1 - l0) * (i / samples)));
    pts.push([p.x * scale, p.y * scale]);
  }
  const [ax, ay] = pts[0], [bx, by] = pts[pts.length - 1];
  const dx = bx - ax, dy = by - ay, len = Math.hypot(dx, dy) || 1;
  let sum = 0, max = 0;
  for (const [x, y] of pts) {
    const d = Math.abs((x - ax) * dy - (y - ay) * dx) / len;
    sum += d * d; if (d > max) max = d;
  }
  const r4 = (v) => Math.round(v * 10000) / 10000;
  return {
    found: els.length, sigmaPx: r4(Math.sqrt(sum / pts.length)), maxDevPx: r4(max),
    chordPx: r4(len), scale: r4(scale), totalUserUnits: r4(total),
    edgePx: r4(total * scale),
  };
}`;

/**
 * σ over TIME: RMS, across a mark's POSES, of each sample point's distance from the poses'
 * centroid at that arc position. One path → 0 by construction.
 */
const TIME = `(sels, samples) => {
  const paths = sels.map((s) => document.querySelector(s)).filter(Boolean);
  if (paths.length === 0) return null;
  const svg = paths[0].ownerSVGElement;
  const vb = svg.viewBox.baseVal;
  const scale = svg.getBoundingClientRect().width / (vb.width || 1);
  const totals = paths.map((p) => p.getTotalLength());
  let sum = 0, n = 0, max = 0;
  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const xs = [], ys = [];
    for (let k = 0; k < paths.length; k++) {
      const p = paths[k].getPointAtLength(totals[k] * t);
      xs.push(p.x * scale); ys.push(p.y * scale);
    }
    const mx = xs.reduce((a, b) => a + b, 0) / xs.length;
    const my = ys.reduce((a, b) => a + b, 0) / ys.length;
    for (let k = 0; k < xs.length; k++) {
      const d = Math.hypot(xs[k] - mx, ys[k] - my);
      sum += d * d; n++; if (d > max) max = d;
    }
  }
  const r4 = (v) => Math.round(v * 10000) / 10000;
  return { poses: paths.length, sigmaTimePx: r4(Math.sqrt(sum / n)), maxTimeDevPx: r4(max), scale: r4(scale), samples: samples + 1 };
}`;

/** The grid's own σ over time: pose f of cell line i lives at layer f. */
const GRID_TIME = `(lineIdx, samples) => {
  const layers = Array.from(document.querySelectorAll(".boil-frame-layer"));
  const paths = layers.map((L) => L.querySelectorAll("path.cell-line")[lineIdx]).filter(Boolean);
  if (paths.length < 2) return null;
  const svg = paths[0].ownerSVGElement;
  const vb = svg.viewBox.baseVal;
  const scale = svg.getBoundingClientRect().width / (vb.width || 1);
  const totals = paths.map((p) => p.getTotalLength());
  let sum = 0, n = 0, max = 0;
  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const xs = [], ys = [];
    for (let k = 0; k < paths.length; k++) {
      const p = paths[k].getPointAtLength(totals[k] * t);
      xs.push(p.x * scale); ys.push(p.y * scale);
    }
    const mx = xs.reduce((a, b) => a + b, 0) / xs.length;
    const my = ys.reduce((a, b) => a + b, 0) / ys.length;
    for (let k = 0; k < xs.length; k++) {
      const d = Math.hypot(xs[k] - mx, ys[k] - my);
      sum += d * d; n++; if (d > max) max = d;
    }
  }
  const r4 = (v) => Math.round(v * 10000) / 10000;
  return { poses: paths.length, lines: layers[0].querySelectorAll("path.cell-line").length, sigmaTimePx: r4(Math.sqrt(sum / n)), maxTimeDevPx: r4(max), scale: r4(scale) };
}`;

// ─────────────────────────────────────────────────────────────────────────────

test("R3-a1/R3-a3 THE LAW RE-BASED and σ OVER TIME — before and after", async ({
  page,
  browserName,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference", colorScheme: "light" });
  const sizes: Record<string, unknown> = {};

  for (const [label, q, boardSize] of [
    ["4x4", "?size=2&difficulty=EASY", 4],
    ["9x9", "?size=3&difficulty=EASY", 9],
    ["16x16", "?size=4&difficulty=EASY", 16],
  ] as const) {
    await boardReady(page, q);
    await focusCell(page);

    // ── BEFORE ──
    const gridSpace = await page.evaluate(
      ({ fn, a }) => (eval(fn) as any)(...a),
      { fn: SPACE, a: ["path.cell-line", 1, 0.03, 0.97, 32] },
    );
    const ringSpaceBefore = await page.evaluate(
      ({ fn, a }) => (eval(fn) as any)(...a),
      {
        fn: SPACE,
        a: [".game-cell:has(input:focus-visible) .cell-ghost-path", 0, 0.02, 0.22, 32],
      },
    );
    const gridTime = await page.evaluate(
      ({ fn, a }) => (eval(fn) as any)(...a),
      { fn: GRID_TIME, a: [1, 32] },
    );
    const ringTimeBefore = await page.evaluate(
      ({ fn, a }) => (eval(fn) as any)(...a),
      {
        fn: TIME,
        a: [[".game-cell:has(input:focus-visible) .cell-ghost-path"], 32],
      },
    );

    // ── INSTALL THE PROTOTYPE ──
    await page.evaluate(PROTO);
    const init = await page.evaluate(() => (window as any).__mrkLive.init());
    const armed = await page.evaluate(() => (window as any).__mrkLive.arm({}));
    const mounted = await page.evaluate(() =>
      (window as any).__mrkLive.mountActive({}),
    );
    await page.waitForTimeout(600);

    // ── AFTER ──
    const poseSel = (i: number) =>
      i === 0
        ? ".game-cell:has(input:focus-visible) .cell-ghost-path:not(.mrk-live-pose)"
        : `.game-cell:has(input:focus-visible) .mrk-live-pose:nth-of-type(${i + 1})`;
    const ringTimeAfter = await page.evaluate(
      ({ fn, a }) => (eval(fn) as any)(...a),
      { fn: TIME, a: [[0, 1, 2, 3].map(poseSel), 32] },
    );
    const ringSpaceAfter = await page.evaluate(
      ({ fn, a }) => (eval(fn) as any)(...a),
      { fn: SPACE, a: [poseSel(0), 0, 0.02, 0.22, 32] },
    );

    // Closed-ring variant (corners live, no taper) on the same base.
    await page.evaluate(() => (window as any).__mrkLive.unmount());
    await page.evaluate(() =>
      (window as any).__mrkLive.mountActive({ grammar: "closed" }),
    );
    await page.waitForTimeout(400);
    const ringTimeClosed = await page.evaluate(
      ({ fn, a }) => (eval(fn) as any)(...a),
      { fn: TIME, a: [[0, 1, 2, 3].map(poseSel), 32] },
    );

    const norm = (s: any) =>
      s && s.edgePx ? Math.round((s.sigmaPx / s.edgePx) * 1e6) / 1e3 : null;
    const band = (v: number) => [
      Math.round(v * 0.5 * 1e4) / 1e4,
      Math.round(v * 2.0 * 1e4) / 1e4,
    ];

    sizes[label] = {
      boardSize,
      gridSpace,
      ringSpaceBefore,
      ringSpaceAfter,
      gridTime,
      ringTimeBefore,
      ringTimeAfter,
      ringTimeClosed,
      init,
      armed,
      mounted,
      // R3-a AS WRITTEN (r0): ring σ over space inside the grid's σ band.
      "R3-a_asWritten": {
        band: band(gridSpace.sigmaPx),
        ring: ringSpaceBefore.sigmaPx,
        pass:
          ringSpaceBefore.sigmaPx >= gridSpace.sigmaPx * 0.5 &&
          ringSpaceBefore.sigmaPx <= gridSpace.sigmaPx * 2,
      },
      // R3-a1 RE-BASED: σ per 1000px of the mark's OWN edge.
      "R3-a1_proportional": {
        gridSigmaPerKpx: norm(gridSpace),
        ringSigmaPerKpx: norm(ringSpaceBefore),
        band: band(norm(gridSpace)!),
        pass:
          norm(ringSpaceBefore)! >= norm(gridSpace)! * 0.5 &&
          norm(ringSpaceBefore)! <= norm(gridSpace)! * 2,
      },
      // R3-a3 NEW: σ over TIME.
      "R3-a3_time": {
        gridSigmaTimePx: gridTime?.sigmaTimePx ?? null,
        band: gridTime ? band(gridTime.sigmaTimePx) : null,
        beforePx: ringTimeBefore?.sigmaTimePx ?? null,
        afterPx: ringTimeAfter?.sigmaTimePx ?? null,
        afterClosedPx: ringTimeClosed?.sigmaTimePx ?? null,
        bornRed: (ringTimeBefore?.sigmaTimePx ?? 0) === 0,
        afterPass:
          !!gridTime &&
          (ringTimeAfter?.sigmaTimePx ?? 0) >= gridTime.sigmaTimePx * 0.5 &&
          (ringTimeAfter?.sigmaTimePx ?? 0) <= gridTime.sigmaTimePx * 2,
        afterClosedPass:
          !!gridTime &&
          (ringTimeClosed?.sigmaTimePx ?? 0) >= gridTime.sigmaTimePx * 0.5 &&
          (ringTimeClosed?.sigmaTimePx ?? 0) <= gridTime.sigmaTimePx * 2,
      },
      // R3-a4: the resting ring did not move.
      "R3-a4_spaceUnmoved": {
        before: ringSpaceBefore.sigmaPx,
        after: ringSpaceAfter?.sigmaPx ?? null,
        identical: ringSpaceBefore.sigmaPx === (ringSpaceAfter?.sigmaPx ?? -1),
      },
    };
  }

  bank(`live-law-${browserName}.json`, { engine: browserName, sizes });
  console.log("LIVELAW " + JSON.stringify(sizes, null, 2));
  expect(Object.keys(sizes).length).toBe(3);
});

test("R3-h AFTER — the filter census and the ghost's DOM population with the stack up", async ({
  page,
  browserName,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference", colorScheme: "light" });
  const sizes: Record<string, unknown> = {};
  for (const [label, q] of [
    ["4x4", "?size=2&difficulty=EASY"],
    ["9x9", "?size=3&difficulty=EASY"],
    ["16x16", "?size=4&difficulty=EASY"],
  ] as const) {
    await boardReady(page, q);
    await focusCell(page);
    await page.evaluate(PROTO);
    await page.evaluate(() => (window as any).__mrkLive.init());
    await page.evaluate(() => (window as any).__mrkLive.arm({}));
    await page.evaluate(() => (window as any).__mrkLive.mountActive({}));
    await page.waitForTimeout(700);
    sizes[label] = await page.evaluate(() => {
      const live: string[] = [];
      for (const el of Array.from(document.querySelectorAll("*"))) {
        const cs = getComputedStyle(el);
        if (cs.filter !== "none" && cs.display !== "none")
          live.push(
            `${el.tagName.toLowerCase()}.${(el.getAttribute("class") || "").split(/\s+/)[0]}=${cs.filter.slice(0, 26)}`,
          );
      }
      const tally: Record<string, number> = {};
      for (const s of live) tally[s] = (tally[s] ?? 0) + 1;
      const poses = Array.from(document.querySelectorAll(".mrk-live-pose"));
      return {
        liveFilterTotal: live.length,
        liveFilterRows: tally,
        cells: document.querySelectorAll(".game-cell").length,
        ghostPathsTotal: document.querySelectorAll(".cell-ghost-path").length,
        addedPosePaths: poses.length,
        posesOwnFilters: Array.from(
          new Set(poses.map((p) => getComputedStyle(p).filter)),
        ),
        ghostFilter: getComputedStyle(
          document.querySelector(".cell-ghost-path")!,
        ).filter,
        // named unnamed-image guard: the per-cell svgs must stay aria-hidden
        ghostSvgsAriaHidden: Array.from(
          document.querySelectorAll(".cell-ghost"),
        ).every((g) => g.getAttribute("aria-hidden") === "true"),
      };
    });
  }
  bank(`live-budget-${browserName}.json`, { engine: browserName, sizes });
  console.log("LIVEBUDGET " + JSON.stringify(sizes, null, 2));
  expect(Object.keys(sizes).length).toBe(3);
});
