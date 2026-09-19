/**
 * ACC-SIX pass-2 RESEARCH probe — HEAD, on the BUILT dist (no rebuild).
 *
 * Five rows the charter names and pass 1 never measured on a shipped artifact:
 *  R3  the estate's FILTER CENSUS counting rule (own computed filter ≠ none AND own display ≠ none)
 *      against FILTER_BUDGET_TOTAL / FILTER_BUDGET_UNION_AREA, both regimes.
 *  R5  the MASTHEAD as INK, not as a box: the masthead's painted text rects vs the board box,
 *      and the notional tape box measured against BOTH.
 *  R7  the tape-vs-trace occlusion, from the board's real geometry.
 *  R18 the WEBKIT DASH LAW on the SHIPPED `.progress-trace`: pathLength 1000 + dasharray
 *      "1000 1000" is a period of 2x the path. Counted as contiguous violet runs round the ring.
 *  R11 the grounds, resolved, so the arithmetic ledger can be checked against painted bytes.
 */
import { test, expect, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const OUT = join(__dirname, "..", "readings");
mkdirSync(OUT, { recursive: true });
const SCENE = "./?size=3&difficulty=EASY";

const VIEWPORTS = [
  { id: "desk", width: 1280, height: 800, dsf: 1 },
  { id: "phone", width: 393, height: 699, dsf: 3 },
] as const;

async function settle(page: Page) {
  await page.goto(SCENE);
  await page.waitForSelector(".hand-drawn-grid", { timeout: 30000 });
  await page.waitForFunction(() => document.getAnimations().filter(a => a.playState === "running").length === 0, null, { timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(800);
}

const CENSUS = () => {
  const hits: { path: string; filter: string; area: number; box: number[] }[] = [];
  const pathOf = (el: Element) => {
    const bits: string[] = [];
    let n: Element | null = el;
    for (let i = 0; n && i < 4; i++, n = n.parentElement) {
      bits.unshift(n.tagName.toLowerCase() + (n.className && typeof n.className === "string" ? "." + n.className.trim().split(/\s+/).slice(0, 2).join(".") : ""));
    }
    return bits.join(">");
  };
  for (const el of Array.from(document.querySelectorAll("*"))) {
    const cs = getComputedStyle(el);
    if (cs.filter === "none" || cs.display === "none") continue;
    const r = el.getBoundingClientRect();
    hits.push({ path: pathOf(el), filter: cs.filter, area: r.width * r.height, box: [r.x, r.y, r.width, r.height] });
  }
  // scanline union of the counted population's boxes
  const rects = hits.map(h => h.box).filter(b => b[2] > 0 && b[3] > 0);
  const xs = Array.from(new Set(rects.flatMap(b => [b[0], b[0] + b[2]]))).sort((a, b) => a - b);
  const ys = Array.from(new Set(rects.flatMap(b => [b[1], b[1] + b[3]]))).sort((a, b) => a - b);
  let union = 0;
  for (let i = 0; i + 1 < xs.length; i++)
    for (let j = 0; j + 1 < ys.length; j++) {
      const cx = (xs[i] + xs[i + 1]) / 2, cy = (ys[j] + ys[j + 1]) / 2;
      if (rects.some(b => cx > b[0] && cx < b[0] + b[2] && cy > b[1] && cy < b[1] + b[3]))
        union += (xs[i + 1] - xs[i]) * (ys[j + 1] - ys[j]);
    }
  return { count: hits.length, union, hits: hits.map(h => ({ path: h.path, filter: h.filter, area: Math.round(h.area) })) };
};

const GEOM = () => {
  const svg = document.querySelector(".hand-drawn-grid") as SVGSVGElement | null;
  const board = svg?.getBoundingClientRect();
  const mast = document.querySelector(".masthead") as HTMLElement | null;
  const mastBox = mast?.getBoundingClientRect();
  // masthead INK: the union of rects of every TEXT node inside the masthead, plus any
  // painted (non-transparent) leaf box.
  const inkRects: number[][] = [];
  if (mast) {
    const walker = document.createTreeWalker(mast, NodeFilter.SHOW_TEXT);
    let t: Node | null;
    while ((t = walker.nextNode())) {
      if (!t.textContent || !t.textContent.trim()) continue;
      const rg = document.createRange();
      rg.selectNodeContents(t);
      for (const r of Array.from(rg.getClientRects())) if (r.width && r.height) inkRects.push([r.x, r.y, r.width, r.height]);
    }
    for (const el of Array.from(mast.querySelectorAll("svg, img, canvas"))) {
      const r = el.getBoundingClientRect();
      if (r.width && r.height) inkRects.push([r.x, r.y, r.width, r.height]);
    }
  }
  const ink = inkRects.length
    ? inkRects.reduce((a, b) => [Math.min(a[0], b[0]), Math.min(a[1], b[1]), Math.max(a[2], b[0] + b[2]), Math.max(a[3], b[1] + b[3])], [Infinity, Infinity, -Infinity, -Infinity])
    : null;
  const cs = getComputedStyle(document.documentElement);
  const tok = (n: string) => cs.getPropertyValue(n).trim();
  const paint = (n: string) => { const d = document.createElement("div"); d.style.color = tok(n) || "rgba(0,0,0,0)"; document.body.appendChild(d); const v = getComputedStyle(d).color; d.remove(); return v; };
  return {
    board: board ? { x: board.x, y: board.y, w: board.width, h: board.height } : null,
    masthead: mastBox ? { x: mastBox.x, y: mastBox.y, w: mastBox.width, h: mastBox.height } : null,
    mastheadInk: ink ? { x0: ink[0], y0: ink[1], x1: ink[2], y1: ink[3] } : null,
    mastheadInkRects: inkRects.length,
    tokens: Object.fromEntries(["--color-card", "--color-background", "--color-foreground", "--color-accent", "--grid-line-color", "--color-progress-ink", "--color-red-ink", "--color-focus-sketch", "--color-crayon-blue", "--color-user-ink", "--color-solver-ink-2"].map(n => [n, paint(n)])),
  };
};

for (const vp of VIEWPORTS) {
  for (const theme of ["light", "dark"] as const) {
    test(`census+geom ${vp.id} ${theme}`, async ({ page, browserName }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.emulateMedia({ colorScheme: theme });
      await settle(page);
      const census = await page.evaluate(CENSUS);
      const geom = await page.evaluate(GEOM);
      writeFileSync(join(OUT, `head-${browserName}-${vp.id}-${theme}.json`), JSON.stringify({ census, geom }, null, 1));
      expect(census.count).toBeGreaterThan(0);
    });
  }
}

test("dash law on the shipped trace", async ({ page, browserName }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.emulateMedia({ colorScheme: "light" });
  await settle(page);
  // write one digit so the trace mounts
  const cell = page.locator(".game-cell input:not([readonly])").first();
  await cell.click();
  await page.keyboard.type("5");
  await page.waitForTimeout(600);
  const mounted = await page.locator(".progress-trace").count();
  // Force a 25% front on every pose, then read the painted geometry back out of the DOM by
  // asking each path where its dash lands. The claim under test is a RENDER claim, so it is
  // settled by pixels, taken by the caller from the screenshot beside this JSON.
  const info = await page.evaluate(() => {
    const paths = Array.from(document.querySelectorAll<SVGPathElement>(".progress-trace"));
    const out = paths.map(p => {
      const cs = getComputedStyle(p);
      return {
        pathLength: p.getAttribute("pathLength"),
        dasharray: cs.strokeDasharray,
        dashoffset: cs.strokeDashoffset,
        totalLength: (p as SVGGeometryElement).getTotalLength(),
        strokeWidth: cs.strokeWidth,
      };
    });
    for (const p of paths) p.style.strokeDashoffset = "750";
    const svg = document.querySelector(".hand-drawn-grid");
    const b = svg?.getBoundingClientRect();
    return { n: paths.length, out, board: b ? { x: b.x, y: b.y, w: b.width, h: b.height } : null };
  });
  await page.waitForTimeout(300);
  const b = info.board!;
  await page.screenshot({ path: join(OUT, `dash-${browserName}.png`), clip: { x: Math.max(0, b.x - 12), y: Math.max(0, b.y - 12), width: b.w + 24, height: b.h + 24 } });
  writeFileSync(join(OUT, `dash-${browserName}.json`), JSON.stringify({ mounted, ...info }, null, 1));
  expect(mounted).toBeGreaterThan(0);
});
