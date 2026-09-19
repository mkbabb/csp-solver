/**
 * ACC-GRAPHITE pass-2 CRITIC's own re-run. Not the prototype's instrument: written here so a
 * GREEN it claimed is re-derived by a second hand, and measured on the same worktree it built.
 *
 * Re-derives, both engines, light + dark, desk + phone:
 *   W  G-WASH   .cell-peer count, sub-unit-opacity nodes ON THE BOARD, painted background
 *   R  G2       the focused cell's painted band vs the frame line, from a raw pixel strip
 *   T  G3       the tally's painted geometry: bbox against the frame line's own bbox
 *   P  pi       a rect census of the page's boxes (compared against the HEAD control run)
 */
import { test, expect, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass2/critique/ACC-GRAPHITE/readings";
mkdirSync(OUT, { recursive: true });

const VP = (process.env.VP || "desk") as "desk" | "phone";
const THEME = (process.env.THEME || "light") as "light" | "dark";
const SOLO = "./?size=3&difficulty=HARD";

async function boot(page: Page) {
  await page.emulateMedia({ colorScheme: THEME });
  await page.goto(SOLO);
  await page.waitForSelector(".sudoku-cell", { timeout: 30000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 30000 })
    .toBeGreaterThan(0);
  await page.waitForTimeout(1200);
}

/** Write `n` digits into the first n empty cells — the tally's denominator moves with it. */
async function writeN(page: Page, n: number) {
  const empties = await page.evaluate(() => {
    const out: number[] = [];
    document.querySelectorAll(".sudoku-cell").forEach((c, i) => {
      const inp = c.querySelector("input") as HTMLInputElement | null;
      if (inp && !inp.value && !inp.disabled && !inp.readOnly) out.push(i);
    });
    return out;
  });
  for (const i of empties.slice(0, n)) {
    await page.locator(".sudoku-cell").nth(i).locator("input").fill("5");
    await page.waitForTimeout(30);
  }
  await page.waitForTimeout(600);
}

test("critic re-run", async ({ page }, info) => {
  const engine = info.project.name;
  const tag = `${VP}-${THEME}-${engine}`;
  const R: Record<string, unknown> = { vp: VP, theme: THEME, engine };

  await boot(page);

  // ── W · G-WASH ────────────────────────────────────────────────────────────
  // Focus a cell so the peer wash lights, then count what it costs the compositor.
  const cells = page.locator(".sudoku-cell");
  await cells.nth(40).locator("input").focus();
  await page.waitForTimeout(400);

  R.wash = await page.evaluate(() => {
    const board = document.querySelector(".sudoku-cell")?.closest("[class]")
      ?.parentElement as HTMLElement | null;
    const scope = board ?? document.body;
    const peers = Array.from(document.querySelectorAll(".cell-peer")) as HTMLElement[];
    const subUnit: string[] = [];
    scope.querySelectorAll("*").forEach((el) => {
      const o = parseFloat(getComputedStyle(el).opacity);
      if (o > 0 && o < 1) subUnit.push(el.className?.toString().slice(0, 60) || el.tagName);
    });
    const one = peers[0] ? getComputedStyle(peers[0]) : null;
    return {
      peerNodes: peers.length,
      peerSubUnitOpacity: peers.filter((p) => {
        const o = parseFloat(getComputedStyle(p).opacity);
        return o > 0 && o < 1;
      }).length,
      subUnitOpacityOnBoard: subUnit.length,
      subUnitSample: subUnit.slice(0, 8),
      paintedBackground: one?.backgroundColor ?? null,
      groundToken: getComputedStyle(document.documentElement)
        .getPropertyValue("--ground-wash-unit")
        .trim(),
      crayonBlue: getComputedStyle(document.documentElement)
        .getPropertyValue("--color-crayon-blue")
        .trim(),
      focusSketch: getComputedStyle(document.documentElement)
        .getPropertyValue("--color-focus-sketch")
        .trim(),
      userInk: getComputedStyle(document.documentElement)
        .getPropertyValue("--color-user-ink")
        .trim(),
    };
  });

  // ── R · G2 the band, measured off raw pixels ──────────────────────────────
  // A horizontal strip through the focused cell's mid-height. The band is the longest run of
  // ink at the cell's left edge; the frame line is the longest run at the board's own edge.
  const geom = await page.evaluate(() => {
    const cell = document.querySelectorAll(".sudoku-cell")[40] as HTMLElement;
    const r = cell.getBoundingClientRect();
    const boardSvg = document.querySelector(".progress-trace")?.closest("svg") as SVGSVGElement | null;
    const br = boardSvg?.getBoundingClientRect();
    return {
      cell: { x: r.x, y: r.y, w: r.width, h: r.height },
      board: br ? { x: br.x, y: br.y, w: br.width, h: br.height } : null,
      dpr: window.devicePixelRatio,
    };
  });
  R.geom = geom;

  const shot = await page.screenshot({ type: "png" });
  const { data, info: img } = await sharp(shot).raw().toBuffer({ resolveWithObject: true });
  const ch = img.channels;
  const dpr = geom.dpr;
  const lum = (i: number) =>
    (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) / 255;

  // paper = the cell's own centre
  const cx = Math.round((geom.cell.x + geom.cell.w / 2) * dpr);
  const cy = Math.round((geom.cell.y + geom.cell.h / 2) * dpr);
  const paper = lum((cy * img.width + cx) * ch);
  const isInk = (x: number, y: number) => {
    const i = (y * img.width + x) * ch;
    return Math.abs(lum(i) - paper) > 0.06;
  };
  // scan left from the cell centre to past its left edge; the band is the run we cross
  const runAt = (y: number, xFrom: number, xTo: number) => {
    const runs: number[] = [];
    let cur = 0;
    const step = xTo > xFrom ? 1 : -1;
    for (let x = xFrom; x !== xTo; x += step) {
      if (isInk(x, y)) cur++;
      else if (cur) { runs.push(cur); cur = 0; }
    }
    if (cur) runs.push(cur);
    return runs;
  };
  const yMid = cy;
  const leftEdge = Math.round(geom.cell.x * dpr);
  const bandRuns = runAt(yMid, Math.round(leftEdge + geom.cell.w * dpr * 0.45), leftEdge - Math.round(20 * dpr));
  const bandPx = (bandRuns.length ? Math.max(...bandRuns) : 0) / dpr;

  // an UNFOCUSED interior line: same row, one cell further left
  const farEdge = Math.round((geom.cell.x - geom.cell.w) * dpr);
  const ruleRuns = runAt(yMid, farEdge + Math.round(geom.cell.w * dpr * 0.45), farEdge - Math.round(20 * dpr));
  const rulePx = (ruleRuns.length ? Math.max(...ruleRuns) : 0) / dpr;

  R.band = {
    paperLum: +paper.toFixed(4),
    focusedBandPx: +bandPx.toFixed(2),
    neighbourRulePx: +rulePx.toFixed(2),
    ratio: rulePx ? +(bandPx / rulePx).toFixed(3) : null,
    bandRuns,
    ruleRuns,
  };

  // ── T · G3 the tally ──────────────────────────────────────────────────────
  await page.locator("body").click({ position: { x: 5, y: 5 } }).catch(() => {});
  await writeN(page, 20);
  R.tally = await page.evaluate(() => {
    const active = document.querySelector(".progress-pose.is-active .progress-trace") as SVGPathElement | null;
    if (!active) return { present: false };
    const d = active.getAttribute("d") || "";
    const subpaths = (d.match(/M/gi) || []).length;
    const cs = getComputedStyle(active);
    const poseEl = active.parentElement as HTMLElement;
    const frame = document.querySelector(".grid-pose.is-active path, .frame-pose.is-active path") as SVGPathElement | null;
    const box = active.getBoundingClientRect();
    const fbox = frame?.getBoundingClientRect() ?? null;
    return {
      present: true,
      subpaths,
      dasharray: cs.strokeDasharray,
      pathLength: active.getAttribute("pathLength"),
      strokeWidth: cs.strokeWidth,
      linecap: cs.strokeLinecap,
      stroke: cs.stroke,
      poseTransform: getComputedStyle(poseEl).transform,
      tallyBox: { x: box.x, y: box.y, w: box.width, h: box.height },
      frameBox: fbox ? { x: fbox.x, y: fbox.y, w: fbox.width, h: fbox.height } : null,
      transition: cs.transition,
    };
  });

  // ── P · pi — the page's own rect census (a control the HEAD run is compared to) ──
  R.rects = await page.evaluate(() => {
    const out: Record<string, number[]> = {};
    const sel = [
      ".game-board", ".control-panel", ".sudoku-cell", "button", ".player-row",
      "header", "main", "footer", "h1", "h2",
    ];
    for (const s of sel) {
      const els = Array.from(document.querySelectorAll(s)).slice(0, 4);
      els.forEach((e, i) => {
        const r = e.getBoundingClientRect();
        out[`${s}#${i}`] = [
          +r.x.toFixed(2), +r.y.toFixed(2), +r.width.toFixed(2), +r.height.toFixed(2),
        ];
      });
    }
    out.__doc = [document.documentElement.scrollWidth, document.documentElement.scrollHeight];
    return out;
  });

  writeFileSync(join(OUT, `verify-${tag}.json`), JSON.stringify(R, null, 2));
  console.log(tag, JSON.stringify({ wash: R.wash, band: R.band, tally: R.tally }));
});
