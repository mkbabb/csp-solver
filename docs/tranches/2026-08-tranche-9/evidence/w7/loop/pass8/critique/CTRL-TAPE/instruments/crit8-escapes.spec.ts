import { test, expect, type Page } from "@playwright/test";
import { onOff, maxDelta, settle } from "./lib/paint-lib.mjs";
async function loadSudoku(page: Page) {
  await page.goto("./?size=3&difficulty=EASY");
  await page.waitForSelector("svg.handwritten-logo", { timeout: 15000 });
  await page.addStyleTag({ content: ".tuner-toggle { display: none !important; }" });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 15000 })
    .toBeGreaterThan(0);
}
const FRAME_OFF = ".bar-frame .outline-svg { visibility: hidden !important }";
const CASE_QUIET = ".drawer-case > .outline-svg { visibility: hidden !important }";

/** The frame's stable ink inside `clip` (css px): its bounding box and the lowest ink row per column
 *  window `[x0, x1]`, in css px of the page. `count` 0 = no frame painted in the clip. */
async function frameInk(page: Page, clip: { x: number; y: number; width: number; height: number }, x0 = -Infinity, x1 = Infinity) {
  const quiet = await page.addStyleTag({ content: CASE_QUIET });
  await settle(page);
  const a = await onOff(page, clip, FRAME_OFF);
  const b = await onOff(page, clip, FRAME_OFF);
  await quiet.evaluate((n) => (n as Element).remove());
  const { w, h } = a.on;
  const s = w / clip.width;
  let count = 0;
  let [top, bottom, left, right] = [Infinity, -Infinity, Infinity, -Infinity];
  let lowest = -Infinity;
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 3;
      if (maxDelta(a.on.data, a.off.data, i) <= 24 || maxDelta(b.on.data, b.off.data, i) <= 24) continue;
      if (maxDelta(a.on.data, b.on.data, i) > 24) continue;
      count++;
      const [cx, cy] = [clip.x + (x + 0.5) / s, clip.y + (y + 0.5) / s];
      [top, bottom, left, right] = [Math.min(top, cy), Math.max(bottom, cy), Math.min(left, cx), Math.max(right, cx)];
      if (cx >= x0 && cx <= x1) lowest = Math.max(lowest, clip.y + (y + 1) / s);
    }
  const r = (v: number) => (Number.isFinite(v) ? +v.toFixed(2) : null);
  return { count, top: r(top), bottom: r(bottom), left: r(left), right: r(right), lowest: r(lowest), dpr: +s.toFixed(3) };
}

/** The foot's geometry: the viewport, the foot, the bar, the case, the pad, the verbs' lowest box. */
const FOOT_GEOM = () => {
  const f = document.getElementById("card-foot")!;
  const r = (e: Element | null) => {
    const b = e!.getBoundingClientRect();
    return { top: +b.top.toFixed(2), bottom: +b.bottom.toFixed(2), left: +b.left.toFixed(2), right: +b.right.toFixed(2) };
  };
  const verbs = [...f.querySelectorAll(".action-verbs button, .action-bar > .info-btn")].filter((e) => e.getClientRects().length);
  return {
    vw: innerWidth,
    vh: innerHeight,
    foot: r(f),
    bar: r(f.querySelector(".action-bar")),
    case: r(f.closest(".drawer-case")),
    padB: parseFloat(getComputedStyle(f).paddingBottom),
    verbsBottom: verbs.length ? +Math.max(...verbs.map((e) => e.getBoundingClientRect().bottom)).toFixed(2) : null,
  };
};

/** The sheet (or the rail's case) has stopped moving: no running animation on the foot or an
 *  ancestor, and the foot's box unmoved across 80 ms (the dock sheet SLIDES on a long tail). */
async function footSettled(page: Page) {
  await expect
    .poll(
      async () => {
        // one read, then the same read two painted frames later (no fixed sleep: the frames ARE the settle)
        const [a, b] = await page.evaluate(async () => {
          const f = document.getElementById("card-foot")!;
          const read = () => ({
            moving: document
              .getAnimations()
              .some((x) => x.playState === "running" && (x.effect as KeyframeEffect | null)?.target?.contains(f)),
            top: f.getBoundingClientRect().top,
          });
          const first = read();
          await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
          return [first, read()];
        });
        return !a.moving && !b.moving && Math.abs(a.top - b.top) < 0.01;
      },
      { timeout: 8000 },
    )
    .toBe(true);
}

async function footBottom(page: Page) {
  const g = await page.evaluate(FOOT_GEOM);
  const y = Math.min(Math.max(0, Math.floor(g.foot.top - 12)), g.vh - 2);
  const x = Math.max(0, Math.floor(g.bar.left - 12));
  const clip = { x, y, width: Math.min(g.vw, Math.ceil(g.bar.right + 12)) - x, height: g.vh - y };
  const ink = await frameInk(page, clip);
  const why: string[] = [];
  if (!ink.count) why.push("no frame ink in view");
  else {
    if (ink.top! > g.bar.top - 1) why.push(`the frame's top ink ${ink.top} is not above the bar's top ${g.bar.top}`);
    if (ink.bottom! < g.bar.bottom + 1) why.push(`the frame's lowest ink ${ink.bottom} does not reach under the bar's bottom ${g.bar.bottom}`);
    if (ink.left! > g.bar.left + 1 || ink.right! < g.bar.right - 1) why.push(`the frame's ink ${ink.left}–${ink.right} does not span the bar ${g.bar.left}–${g.bar.right}`);
    if (ink.bottom! > g.vh) why.push(`the painted bottom ${ink.bottom} is past the viewport ${g.vh}`);
    if (ink.bottom! > g.foot.bottom + 0.5) why.push(`the painted bottom ${ink.bottom} is past the foot ${g.foot.bottom}`);
  }
  if (Math.abs(g.bar.bottom - (g.foot.bottom - g.padB)) > 1) why.push(`the bar ${g.bar.bottom} is off its seat ${+(g.foot.bottom - g.padB).toFixed(2)}`);
  if (g.verbsBottom == null || g.verbsBottom > g.vh) why.push(`the verbs end at ${g.verbsBottom} of ${g.vh}`);
  return { holds: why.length === 0, why, ink, g };
}

// CRITIC (pass 8): the gate's GREEN siblings fed to the lane's OWN behavioural row (footBottom), both engines.
const ESCAPES: Record<string, string> = {
  C1_overflowVisible: "@media (min-width: 1024px) { .controls-card { overflow-y: visible !important } } @media (max-width: 1023.98px) { .controls-card { overflow-y: visible !important } }",
  C4_orderMinus1: ".card-foot { order: -1 !important }",
  C6_vacuousCap: ".drawer-case { max-height: 999rem !important }",
  C7_overflowClip: ".controls-card { overflow-y: clip !important }",
  C9_marginTop: ".card-foot { margin-top: 100vh !important }",
  C11_footH0: ".card-foot { height: 0 !important }",
  C12_barH0: ".action-bar { height: 0 !important }",
  C14_casePad: ".drawer-case { padding-bottom: 100vh !important }",
  P7_font0: ".action-bar { font-size: 0 !important }",
  T4_footNone: "#card-foot { display: none !important }",
};
for (const cell of [
  { name: "dock 390x844 coarse", viewport: { width: 390, height: 844 }, hasTouch: true, open: true },
  { name: "rail 1280x800 fine", viewport: { width: 1280, height: 800 }, hasTouch: false, open: false },
] as const)
  test.describe(`crit8 escapes @ ${cell.name}`, () => {
    test.use({ viewport: cell.viewport, hasTouch: cell.hasTouch, deviceScaleFactor: 2 });
    test(`escapes ${cell.name}`, async ({ page, browserName }) => {
      test.setTimeout(240_000);
      await loadSudoku(page);
      if (cell.open) await page.locator(".drawer-tab").click();
      await footSettled(page);
      const clean = await footBottom(page);
      console.log(`[crit8 ${browserName} ${cell.name} clean] holds=${clean.holds} ${JSON.stringify({ why: clean.why, ink: clean.ink, g: clean.g })}`);
      for (const [name, css] of Object.entries(ESCAPES)) {
        const plant = await page.addStyleTag({ content: css });
        await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
        let r: any;
        try { await footSettled(page); r = await footBottom(page); } catch (e) { r = { holds: "ERR", why: [String(e).slice(0, 120)], ink: null, g: null }; }
        console.log(`[crit8 ${browserName} ${cell.name} ${name}] holds=${r.holds} ${JSON.stringify({ why: r.why, ink: r.ink, g: r.g })}`);
        await plant.evaluate((n) => (n as Element).remove());
        await footSettled(page);
      }
    });
  });
