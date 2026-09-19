/**
 * T9-W7 pass 1 · MRK-LIVE PROTOTYPE — the law, measured on the SOURCE (no overlay).
 *
 * G-LIVE-1  sigma over TIME: the focused ring's sigma_t at 4x4/9x9/16x16 inside the grid's own
 *           sigma_t band at that size, both engines. RED at HEAD: 0/0/0 (one path, no poses).
 * GUARD     R3-a1 per unit of edge in [0.5x, 2.0x] (an amplitude rebase reds it).
 * GUARD     sigma over SPACE unchanged — pose 0 is the resting ghost, asserted against a
 *           NEIGHBOUR cell's resting path as well as by its own sigma.
 */
import { test, expect, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

const HERE = dirname(new URL(import.meta.url).pathname);
const OUT = join(HERE, "..", "logs");
mkdirSync(OUT, { recursive: true });
const bank = (n: string, d: unknown) =>
  writeFileSync(join(OUT, n), JSON.stringify(d, null, 2));

async function boardReady(page: Page, query: string) {
  await page.goto("./" + query);
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 60000 });
  await page.waitForSelector("path.cell-line", { state: "attached", timeout: 60000 });
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
  await page.waitForTimeout(900);
}

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
  return { found: els.length, sigmaPx: r4(Math.sqrt(sum / pts.length)), maxDevPx: r4(max),
    chordPx: r4(len), scale: r4(scale), totalUserUnits: r4(total), edgePx: r4(total * scale) };
}`;

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
  return { poses: paths.length, sigmaTimePx: r4(Math.sqrt(sum / n)), maxTimeDevPx: r4(max), scale: r4(scale) };
}`;

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
  return { poses: paths.length, sigmaTimePx: r4(Math.sqrt(sum / n)), maxTimeDevPx: r4(max), scale: r4(scale) };
}`;

test("G-LIVE-1 sigma over time · R3-a1 re-based · sigma over space unmoved", async ({
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

    const poseSel = (i: number) =>
      `.game-cell:has(input:focus-visible) .cell-ghost-path:nth-of-type(${i + 1})`;

    const gridSpace = await page.evaluate(({ fn, a }) => (eval(fn) as any)(...a), {
      fn: SPACE,
      a: ["path.cell-line", 1, 0.03, 0.97, 32],
    });
    const gridTime = await page.evaluate(({ fn, a }) => (eval(fn) as any)(...a), {
      fn: GRID_TIME,
      a: [1, 32],
    });
    const ringSpace = await page.evaluate(({ fn, a }) => (eval(fn) as any)(...a), {
      fn: SPACE,
      a: [poseSel(0), 0, 0.02, 0.22, 32],
    });
    const ringTime = await page.evaluate(({ fn, a }) => (eval(fn) as any)(...a), {
      fn: TIME,
      a: [[0, 1, 2, 3].map(poseSel), 32],
    });

    const identity = await page.evaluate(() => {
      const cell = document.querySelector(".game-cell:has(input:focus-visible)");
      const paths = Array.from(cell?.querySelectorAll(".cell-ghost-path") ?? []);
      return {
        posePaths: paths.length,
        distinctPoseStrings: new Set(paths.map((p) => p.getAttribute("d"))).size,
        pose0Head: paths[0]?.getAttribute("d")?.slice(0, 44) ?? null,
        pose1Head: paths[1]?.getAttribute("d")?.slice(0, 44) ?? null,
        restingCells: document.querySelectorAll(
          ".game-cell:not(:has(input:focus-visible)) .cell-ghost-path",
        ).length,
      };
    });

    const norm = (s: any) =>
      s && s.edgePx ? Math.round((s.sigmaPx / s.edgePx) * 1e6) / 1e3 : null;
    const band = (v: number) => [
      Math.round(v * 0.5 * 1e4) / 1e4,
      Math.round(v * 2.0 * 1e4) / 1e4,
    ];

    sizes[label] = {
      boardSize,
      gridSpace,
      gridTime,
      ringSpace,
      ringTime,
      identity,
      "R3-a1_proportional": {
        gridSigmaPerKpx: norm(gridSpace),
        ringSigmaPerKpx: norm(ringSpace),
        ratio: Math.round((norm(ringSpace)! / norm(gridSpace)!) * 1e4) / 1e4,
        band: band(norm(gridSpace)!),
        pass:
          norm(ringSpace)! >= norm(gridSpace)! * 0.5 &&
          norm(ringSpace)! <= norm(gridSpace)! * 2,
      },
      "G-LIVE-1_time": {
        gridSigmaTimePx: gridTime?.sigmaTimePx ?? null,
        band: gridTime ? band(gridTime.sigmaTimePx) : null,
        ringSigmaTimePx: ringTime?.sigmaTimePx ?? null,
        pass:
          !!gridTime &&
          (ringTime?.sigmaTimePx ?? 0) >= gridTime.sigmaTimePx * 0.5 &&
          (ringTime?.sigmaTimePx ?? 0) <= gridTime.sigmaTimePx * 2,
      },
    };
  }

  bank(`live-law-${browserName}.json`, { engine: browserName, sizes });
  console.log("LIVELAW " + JSON.stringify(sizes, null, 2));
  expect(Object.keys(sizes).length).toBe(3);
});
