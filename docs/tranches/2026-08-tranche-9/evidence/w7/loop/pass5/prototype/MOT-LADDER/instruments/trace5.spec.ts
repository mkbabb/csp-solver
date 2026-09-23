import { test, type Browser, type Page } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";
import { PINNED_URL, PAYLOAD } from "./board";

const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass5/prototype/MOT-LADDER/readings";
mkdirSync(OUT, { recursive: true });
const AFTER = process.env.PW_AFTER ?? "http://127.0.0.1:4246";
const CONTROL = process.env.PW_CONTROL ?? "http://127.0.0.1:4237";

/**
 * MID-GESTURE π (charter row 9; §7(k)). A rest census cannot see a timing delta, and this
 * family's whole delta is timing. Each gesture is driven on AFTER, on CONTROL and on CONTROL
 * again (the noise arm), in fresh pages of one context. A rAF sampler records every mover's rect
 * and opacity from the gesture's own input event (t0 = the event's timeStamp) for WINDOW ms; the
 * three series are resampled onto a 1000/60 ms grid and differenced. A mover that moves in AFTER
 * and not in CONTROL — or the same distance on a different clock — shows as a max |Δ| above the
 * noise arm's. Speed 1×.
 */
const WINDOW = 1300;
const MOVERS = [
  ".board-peek-host",
  "h1.masthead > *",
  ".gallery-track",
  ".game-card.is-center",
  ".drawer-case",
  ".controls-card",
  ".sun-moon-toggle .toggle-icon.is-active",
  ".sun-moon-toggle .toggle-rest.is-active",
];

type Pose = { w: number; h: number; touch: boolean };
type Gesture = {
  name: string;
  pose: Pose;
  prep?: (p: Page) => Promise<void>;
  act: (p: Page) => Promise<void>;
};
const DESK: Pose = { w: 1440, h: 900, touch: false };
const PHONE: Pose = { w: 390, h: 844, touch: true };
const TAB: Pose = { w: 768, h: 1024, touch: true };
const LAND: Pose = { w: 844, h: 390, touch: true };
const openGallery = async (p: Page) => {
  await p.locator("button.logo-trigger").first().click();
  await p.locator(".gallery-viewport").first().waitFor();
};
const GESTURES: Gesture[] = [
  { name: "gallery-in desk", pose: DESK, act: openGallery },
  { name: "gallery-out desk (Escape)", pose: DESK, prep: openGallery, act: (p) => p.keyboard.press("Escape") },
  { name: "card-step desk (ArrowRight)", pose: DESK, prep: openGallery, act: (p) => p.keyboard.press("ArrowRight") },
  { name: "card-step-back desk (ArrowLeft)", pose: DESK, prep: async (p) => { await openGallery(p); await p.keyboard.press("ArrowRight"); await p.waitForTimeout(1200); }, act: (p) => p.keyboard.press("ArrowLeft") },
  { name: "theme-flip desk", pose: DESK, act: (p) => p.locator("button.sun-moon-toggle").first().click() },
  { name: "gallery-in phone", pose: PHONE, act: openGallery },
  { name: "gallery-out phone (Escape)", pose: PHONE, prep: openGallery, act: (p) => p.keyboard.press("Escape") },
  { name: "theme-flip phone", pose: PHONE, act: (p) => p.locator("button.sun-moon-toggle").first().click() },
  { name: "dock-open phone", pose: PHONE, act: (p) => p.locator(".drawer-tab").first().click() },
  { name: "dock-close phone", pose: PHONE, prep: async (p) => { await p.locator(".drawer-tab").first().click(); await p.waitForTimeout(1200); }, act: (p) => p.locator(".drawer-tab").first().click() },
  { name: "dock-open tablet", pose: TAB, act: (p) => p.locator(".drawer-tab").first().click() },
  { name: "dock-close tablet", pose: TAB, prep: async (p) => { await p.locator(".drawer-tab").first().click(); await p.waitForTimeout(1200); }, act: (p) => p.locator(".drawer-tab").first().click() },
  { name: "dock-open landscape", pose: LAND, act: (p) => p.locator(".drawer-tab").first().click() },
  { name: "gallery-in landscape", pose: LAND, act: openGallery },
  { name: "gallery-out landscape (Escape)", pose: LAND, prep: openGallery, act: (p) => p.keyboard.press("Escape") },
];

const SAMPLER = ({ movers, window: win }: { movers: string[]; window: number }) => {
  const w = window as unknown as { __trace: unknown[]; __t0: number | null };
  w.__trace = [];
  w.__t0 = null;
  const stamp = (e: Event) => {
    if (w.__t0 === null) w.__t0 = e.timeStamp;
  };
  for (const ev of ["pointerdown", "keydown", "click"]) addEventListener(ev, stamp, { capture: true, once: true });
  const tick = (now: number) => {
    const row: Record<string, number[] | null> = {};
    for (const s of movers) {
      const el = document.querySelector(s);
      if (!el) {
        row[s] = null;
        continue;
      }
      const r = el.getBoundingClientRect();
      row[s] = [r.left, r.top, r.width, r.height, +getComputedStyle(el).opacity];
    }
    w.__trace.push({ now, row });
    if (w.__t0 === null || now - w.__t0 < win) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

async function drive(browser: Browser, base: string, g: Gesture) {
  const ctx = await browser.newContext({ viewport: { width: g.pose.w, height: g.pose.h }, hasTouch: g.pose.touch });
  const p = await ctx.newPage();
  await p.goto(base + PINNED_URL);
  await p.locator(".board-cells").first().waitFor();
  await p.waitForTimeout(1800);
  if (g.prep) {
    await g.prep(p);
    await p.waitForTimeout(1800);
  }
  await p.evaluate(SAMPLER, { movers: MOVERS, window: WINDOW });
  await g.act(p);
  await p.waitForFunction((win) => {
    const w = window as unknown as { __t0: number | null; __trace: { now: number }[] };
    return w.__t0 !== null && w.__trace.length > 0 && w.__trace[w.__trace.length - 1].now - w.__t0 >= win;
  }, WINDOW, { timeout: 15000 });
  const data = await p.evaluate(() => ({ t0: (window as any).__t0 as number, trace: (window as any).__trace as { now: number; row: Record<string, number[] | null> }[] }));
  await ctx.close();
  return data;
}

/** Resample a mover's channel onto the 60 Hz grid by linear interpolation (null = absent). */
function grid(data: { t0: number; trace: { now: number; row: Record<string, number[] | null> }[] }, s: string, ch: number) {
  const pts = data.trace.filter((r) => r.row[s]).map((r) => [r.now - data.t0, r.row[s]![ch]] as const);
  const out: (number | null)[] = [];
  for (let t = 0; t <= WINDOW; t += 1000 / 60) {
    const i = pts.findIndex(([x]) => x >= t);
    if (i <= 0) out.push(i === 0 ? pts[0][1] : pts.length ? pts[pts.length - 1][1] : null);
    else {
      const [x0, y0] = pts[i - 1];
      const [x1, y1] = pts[i];
      out.push(y0 + ((y1 - y0) * (t - x0)) / (x1 - x0 || 1));
    }
  }
  return out;
}
function diff(a: ReturnType<typeof grid>, b: ReturnType<typeof grid>) {
  let m = 0;
  for (let i = 0; i < Math.min(a.length, b.length); i++)
    if (a[i] !== null && b[i] !== null) m = Math.max(m, Math.abs(a[i]! - b[i]!));
  return +m.toFixed(3);
}
const travel = (a: ReturnType<typeof grid>) => {
  const v = a.filter((x): x is number => x !== null);
  return v.length ? +(Math.max(...v) - Math.min(...v)).toFixed(2) : 0;
};

test("trace5 · fifteen gestures at 1x, after vs control with the control-vs-control arm", async ({ browser, browserName }) => {
  test.setTimeout(1800000);
  const rows: unknown[] = [];
  const only = process.env.GESTURES ? new RegExp(process.env.GESTURES) : null;
  const tag = process.env.TAG ?? "";
  for (const g of GESTURES.filter((x) => !only || only.test(x.name))) {
    const [A, C, C2] = [await drive(browser, AFTER, g), await drive(browser, CONTROL, g), await drive(browser, CONTROL, g)];
    const movers: Record<string, unknown> = {};
    for (const s of MOVERS) {
      const per = [0, 1, 2, 3].map((ch) => [grid(A, s, ch), grid(C, s, ch), grid(C2, s, ch)]);
      const op = [grid(A, s, 4), grid(C, s, 4), grid(C2, s, 4)];
      const tr = Math.max(...per.map(([, c]) => travel(c)));
      const trA = Math.max(...per.map(([a]) => travel(a)));
      if (tr === 0 && trA === 0 && travel(op[1]) === 0 && travel(op[0]) === 0) continue;
      movers[s] = {
        travelPx: { after: trA, control: tr },
        rectMaxDelta: { afterVsControl: Math.max(...per.map(([a, c]) => diff(a, c))), controlVsControl: Math.max(...per.map(([, c, c2]) => diff(c2, c))) },
        opacityMaxDelta: { afterVsControl: diff(op[0], op[1]), controlVsControl: diff(op[2], op[1]) },
      };
    }
    // the frames themselves: the longest painted interval after the input, per arm (a timing
    // delta whose cause is a stall reads here, not in any mover)
    const gaps = [A, C, C2].map((d) => {
      const t = d.trace.map((r) => r.now).filter((x) => x >= d.t0);
      let m = 0;
      for (let i = 1; i < t.length; i++) m = Math.max(m, t[i] - t[i - 1]);
      return { maxGapMs: +m.toFixed(1), firstFrameMs: t.length ? +(t[0] - d.t0).toFixed(1) : null, frames: t.length };
    });
    rows.push({ gesture: g.name, browserName, payload: PAYLOAD, samples: [A.trace.length, C.trace.length, C2.trace.length], gaps, movers });
    console.log(`trace5 ${browserName} ${g.name}: gaps ${JSON.stringify(gaps)} ${JSON.stringify(movers)}`);
  }
  writeFileSync(`${OUT}/trace5${tag}-${browserName}.json`, JSON.stringify(rows, null, 1) + "\n");
});
