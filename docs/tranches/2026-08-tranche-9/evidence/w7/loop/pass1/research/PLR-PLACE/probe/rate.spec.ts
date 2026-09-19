/**
 * PLR-PLACE · PROBE 1 — THE RATE.
 *
 * The family's first measurement: `cur` is throttled at CUR_MS = 120 (useSession.ts:910),
 * a ~8.3 Hz CEILING. The question is not the ceiling, it is the REAL rate over 60 s of
 * ordinary play — because a dot in the masthead moving at the real rate is either ambient
 * motion (the family's first kill) or it is not.
 *
 * Read-only. Two pages in ONE browser context on `?wire=local` (BroadcastChannel is
 * per-origin and per-context). The tap is `BroadcastChannel.prototype.postMessage` wrapped
 * in an `addInitScript` on the SENDING page: it records every frame the product puts on the
 * wire, with `performance.timeOrigin + performance.now()` timestamps, and forwards
 * unchanged. The product is not modified; nothing is dropped.
 *
 * Two arms, because "ordinary play" and "the worst thing a keyboard can do" are different
 * numbers and the masthead has to survive both:
 *   ORDINARY — 60 s, seeded human pacing (120…1400 ms between moves, a digit every ~6
 *              moves, two 4 s pauses to think).
 *   SWEEP    — 20 s of held-arrow key repeat at 30 ms (macOS's fast repeat), which is the
 *              only thing that actually reaches the 120 ms throttle.
 *
 * Prints `PLC|…` rows. The damping arms are computed off the SAME recorded trace, so the
 * comparison is not four runs, it is one trace read four ways.
 */
import { test, expect, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const SOLO = "./?size=3&difficulty=EASY&wire=local";
// The lane runs its specs from a scratchpad copy (node_modules resolution), so the
// evidence home is named rather than inferred. PLC_HOME = this file's parent dir.
const HOME = process.env.PLC_HOME || join(__dirname, "..");
const OUT = join(HOME, "logs");
const say = (k: string, v: unknown) =>
  console.log(`PLC|${k}|${typeof v === "string" ? v : JSON.stringify(v)}`);

type Frame = { t: number; kind: string; p: number | null };

async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 })
    .toBeGreaterThan(0);
}

async function invite(page: Page): Promise<string> {
  const verb = page.locator(
    '.controls-card button[aria-label="Play together on this board"]',
  );
  await expect(verb).toBeEnabled();
  await verb.click();
  await expect.poll(() => new URL(page.url()).searchParams.get("s")).not.toBeNull();
  return page.url();
}

/** Wrap BroadcastChannel.postMessage before the app boots. Records, forwards, changes nothing. */
async function tap(page: Page) {
  await page.addInitScript(() => {
    const w = window as unknown as { __frames: Frame[] };
    w.__frames = [];
    const orig = BroadcastChannel.prototype.postMessage;
    BroadcastChannel.prototype.postMessage = function (msg: unknown) {
      try {
        const m = msg as { kind?: string; data?: { p?: number | null } };
        w.__frames.push({
          t: performance.timeOrigin + performance.now(),
          kind: String(m?.kind ?? "?"),
          p: m?.kind === "cur" ? (m?.data?.p ?? null) : null,
        });
      } catch {
        /* a tap that throws would change the product's behaviour */
      }
      return orig.call(this, msg as never);
    };
  });
}

const frames = (p: Page) =>
  p.evaluate(() => (window as unknown as { __frames: Frame[] }).__frames.slice());
const clearFrames = (p: Page) =>
  p.evaluate(() => {
    (window as unknown as { __frames: Frame[] }).__frames.length = 0;
  });

/** Deterministic pacing. mulberry32, the house's own seeded generator shape. */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Moves per minute a dot would make under one damping rule, read off one trace. */
function damp(
  curs: Frame[],
  windowMs: number,
  rule: "raw" | "beat" | "settled",
  settleMs = 0,
): { moves: number; perMin: number } {
  if (!curs.length) return { moves: 0, perMin: 0 };
  const span = (curs[curs.length - 1].t - curs[0].t) / 60000 || windowMs / 60000;
  let moves = 0;
  if (rule === "raw") {
    let last: number | null | undefined;
    for (const f of curs) {
      if (f.p !== last) moves++;
      last = f.p;
    }
  } else if (rule === "beat") {
    // Quantise to the shared 125 ms boil beat: at most one visible move per beat, and only
    // when the beat's held value differs from the last painted one.
    const t0 = curs[0].t;
    let bucket = -1;
    let held: number | null | undefined;
    let painted: number | null | undefined;
    for (const f of curs) {
      const b = Math.floor((f.t - t0) / 125);
      if (b !== bucket) {
        if (bucket >= 0 && held !== painted) {
          moves++;
          painted = held;
        }
        bucket = b;
      }
      held = f.p;
    }
    if (held !== painted) moves++;
  } else {
    // SETTLED-CELL, as a RECEIVER can actually implement it. The wire sends `cur` only when
    // focus MOVES — there is no "still here" frame — so "settled" cannot be read off arrivals;
    // it is a local timer. Hold the latest arrival; start a settleMs timer; a newer arrival
    // restarts it; when it fires, paint. (The first pass of this probe read it off arrivals
    // and scored 0 moves on every arm, which is the artefact, not the answer.)
    let pending: number | null | undefined;
    let pendingAt = 0;
    let painted: number | null | undefined;
    for (const f of curs) {
      if (pending !== undefined && f.t - pendingAt >= settleMs) {
        if (pending !== painted) {
          painted = pending;
          moves++;
        }
      }
      pending = f.p;
      pendingAt = f.t;
    }
    // the trace ends; the last timer always fires
    if (pending !== undefined && pending !== painted) moves++;
  }
  return { moves, perMin: +(moves / Math.max(span, 1e-9)).toFixed(1) };
}

function report(label: string, curs: Frame[], windowMs: number) {
  const gaps: number[] = [];
  for (let i = 1; i < curs.length; i++) gaps.push(curs[i].t - curs[i - 1].t);
  gaps.sort((x, y) => x - y);
  const q = (f: number) => (gaps.length ? +gaps[Math.floor(f * (gaps.length - 1))].toFixed(1) : 0);
  const secs = windowMs / 1000;
  const row = {
    window_s: +secs.toFixed(1),
    cur_frames: curs.length,
    cur_per_s: +(curs.length / secs).toFixed(2),
    gap_min: q(0),
    gap_p50: q(0.5),
    gap_p90: q(0.9),
    gap_max: q(1),
    nulls: curs.filter((c) => c.p === null).length,
    distinct_cells: new Set(curs.map((c) => c.p)).size,
    raw: damp(curs, windowMs, "raw"),
    beat125: damp(curs, windowMs, "beat"),
    settled_400: damp(curs, windowMs, "settled", 400),
    settled_700: damp(curs, windowMs, "settled", 700),
    settled_1200: damp(curs, windowMs, "settled", 1200),
  };
  say(`rate.${label}`, row);
  return row;
}

test("THE RATE — cur over 60 s of ordinary play, and over a 20 s key sweep", async ({
  browser,
}, info) => {
  const ctx = await browser.newContext();
  const a = await ctx.newPage();
  await tap(a);
  await a.goto(SOLO);
  await settled(a);
  const link = await invite(a);
  const b = await ctx.newPage();
  await b.goto(link);
  await settled(b);
  await expect(b.locator(".controls-card .players-roster .player-row")).toHaveCount(2);

  // The board's own geometry, so "a move" has a denominator.
  const geo = await a.evaluate(() => {
    const cells = document.querySelectorAll(".sudoku-cell");
    const g = document.querySelector('[role="grid"]') as HTMLElement;
    const r = g?.getBoundingClientRect();
    return {
      cells: cells.length,
      gridW: r ? +r.width.toFixed(1) : 0,
      gridH: r ? +r.height.toFixed(1) : 0,
    };
  });
  say("board", geo);

  // ── ORDINARY: 60 s, seeded human pacing ───────────────────────────────────────────────
  await a.locator(".sudoku-cell").first().click();
  await a.waitForTimeout(300);
  await clearFrames(a);
  const keys = ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"];
  const r = rng(0x9e3779b9);
  const t0 = Date.now();
  let moveN = 0;
  while (Date.now() - t0 < 60000) {
    await a.keyboard.press(keys[Math.floor(r() * 4)]);
    moveN++;
    if (moveN % 6 === 0) await a.keyboard.press(String(1 + Math.floor(r() * 9)));
    // two 4 s thinking pauses, at ~20 s and ~40 s
    const el = Date.now() - t0;
    const think = (el > 20000 && el < 20200) || (el > 40000 && el < 40200);
    await a.waitForTimeout(think ? 4000 : 120 + Math.floor(r() * 1280));
  }
  const ordinaryMs = Date.now() - t0;
  const ord = (await frames(a)).filter((f) => f.kind === "cur");
  const ordAll = await frames(a);
  say("ordinary.moves_pressed", moveN);
  say("ordinary.all_kinds", {
    total: ordAll.length,
    byKind: ordAll.reduce<Record<string, number>>((o, f) => {
      o[f.kind] = (o[f.kind] ?? 0) + 1;
      return o;
    }, {}),
  });
  const ordRow = report("ordinary", ord, ordinaryMs);

  // ── SWEEP: 20 s of key repeat at 30 ms — the only thing that reaches the throttle ─────
  // PING-PONG, not a diagonal: an alternating Right/Down walk pins in the bottom-right corner
  // after ~16 presses and then changes no cell, so it sends nothing. (First pass of this probe
  // measured 6 frames in 20 s for exactly that reason.) Eight right, eight left, forever.
  await clearFrames(a);
  await a.locator(".sudoku-cell").first().click();
  const t1 = Date.now();
  let sweepN = 0;
  while (Date.now() - t1 < 20000) {
    await a.keyboard.press(Math.floor(sweepN / 8) % 2 ? "ArrowLeft" : "ArrowRight");
    sweepN++;
    await a.waitForTimeout(30);
  }
  const sweepMs = Date.now() - t1;
  const swp = (await frames(a)).filter((f) => f.kind === "cur");
  say("sweep.keys_pressed", sweepN);
  const swpRow = report("sweep", swp, sweepMs);

  // ── TAP: a phone's arm — 20 taps on cells, no keyboard at all ─────────────────────────
  await clearFrames(a);
  const t2 = Date.now();
  for (let i = 0; i < 20; i++) {
    await a.locator(".sudoku-cell").nth((i * 7) % geo.cells).click();
    await a.waitForTimeout(400 + Math.floor(r() * 600));
  }
  const tapMs = Date.now() - t2;
  const tapd = (await frames(a)).filter((f) => f.kind === "cur");
  const tapRow = report("tap", tapd, tapMs);

  // ── SLOW: the other end of "ordinary" — a solver who thinks. One move every 2–4 s, 60 s. ──
  await clearFrames(a);
  await a.locator(".sudoku-cell").first().click();
  const t3 = Date.now();
  while (Date.now() - t3 < 60000) {
    await a.keyboard.press(keys[Math.floor(r() * 4)]);
    await a.waitForTimeout(2000 + Math.floor(r() * 2000));
  }
  const slowMs = Date.now() - t3;
  const slow = (await frames(a)).filter((f) => f.kind === "cur");
  const slowRow = report("slow", slow, slowMs);

  // ── LOOKED AWAY: the `null`. Tab out of the grid, and open the deck. ──────────────────
  await clearFrames(a);
  await a.locator(".sudoku-cell").first().click();
  await a.waitForTimeout(200);
  await a.keyboard.press("Tab"); // focus leaves the grid → GameBoard.vue:476 noteFocus(null)
  await a.waitForTimeout(400);
  const away = (await frames(a)).filter((f) => f.kind === "cur");
  say("lookedAway.tabOut", { sends: away.length, cells: away.map((f) => f.p) });
  // ── THE FRAME'S COST — one `cur` on the wire, serialised as the product serialises it. ──
  const cost = await a.evaluate(() => {
    const m = { kind: "cur", data: { p: 40, e: 3, ea: "p-0123456789ab" }, from: "p-0123456789ab" };
    return JSON.stringify(m).length;
  });
  say("cur.bytes", cost);

  // The trailing-edge proof: the throttle's own shape. Two presses inside one window must
  // produce two sends (leading + trailing), not one.
  await clearFrames(a);
  await a.locator(".sudoku-cell").first().click();
  await a.keyboard.press("ArrowRight");
  await a.keyboard.press("ArrowRight");
  await a.waitForTimeout(600);
  const burst = (await frames(a)).filter((f) => f.kind === "cur");
  say("throttle.burst", { sends: burst.length, cells: burst.map((f) => f.p) });

  mkdirSync(OUT, { recursive: true });
  writeFileSync(
    join(OUT, `rate-${info.project.name}.json`),
    JSON.stringify(
      { engine: info.project.name, geo, ordinary: ordRow, sweep: swpRow, tap: tapRow, slow: slowRow, lookedAway: away.length, curBytes: cost, burst: burst.length, trace: { ordinary: ord, sweep: swp, tap: tapd, slow } },
      null,
      1,
    ),
  );
  await ctx.close();
});
