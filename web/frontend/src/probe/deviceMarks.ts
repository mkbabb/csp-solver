/**
 * T9-W8 §8.3 — THE DEVICE INSTRUMENT'S PURE HALF.
 *
 * Every rule the owner-run probe decides a number by lives here, as a function of its
 * inputs and nothing else: the settle rule (A5's), the rAF-gap census and its blocking
 * PROXY, the occlusion taint tell, and the row shape `evidence/w8/attribution/A6/
 * readiness.jsonl` is written in. The DOM half (`devicePaint.ts`) observes; this half
 * decides. That split is what lets a unit assert the decisions without a browser, and it
 * is why `devicePaint.ts` is the only file of the pair excluded from the coverage floor.
 *
 * READING RULES, carried in the code because they are the difference between a number and
 * a claim:
 *   · A rAF-gap sum is NEVER a TBT. WebKit ships no `longtask` entry type, so on the
 *     owner's device there is no task census at all and `rafGapProxyTbtMs` is the only
 *     blocking figure available. It is labelled a proxy at every surface it reaches.
 *   · A mark an engine cannot see is `NOT MEASURED`, never 0. Safari ships no
 *     `first-paint` entry; a 0 there would read as "instant" in every median downstream.
 *   · Occlusion suspends rAF outright in WebKit (perf-rig/README.md, Traps). The tell is a
 *     lone 1,000 to 1,300 ms delta, and a reading carrying one is tainted rather than
 *     quoted: a phone that locked its screen mid-window otherwise reports a spectacular
 *     blocking proxy that belongs to the lock screen.
 */

/** A frame delta the probe kept: when it landed, and how long it was. */
export interface RafGap {
  at: number;
  ms: number;
}

/** The rAF census of one window: the two long-frame counts and the worst delta. */
export interface RafCensus {
  long33: number;
  long50: number;
  worstMs: number;
}

/** A frame longer than this is a dropped frame on a 60 Hz panel (the estate's own grain). */
export const LONG_FRAME_MS = 33.4;

/** TBT's own subtrahend, kept for the PROXY so the two figures are the same quantity. */
export const BLOCKING_FLOOR_MS = 50;

/** A5's settle rule: the quiet the last piece of work must be followed by. */
export const SETTLE_QUIET_MS = 400;

/** A5's settle rule: the whirl is ~1,010 ms, so nothing settles before this. */
export const SETTLE_MIN_ELAPSED_MS = 1100;

/** The observation window. 8 s, not 3.6: at 6x on a slow link the mobile bake lands later. */
export const BOOT_WINDOW_MS = 8000;

/** WebKit suspends rAF under occlusion; a lone delta in this band is the screen, not the app. */
const OCCLUSION_GAP_MIN_MS = 1000;
const OCCLUSION_GAP_MAX_MS = 1300;

/**
 * A5's SETTLE RULE, stated once: a gesture has settled at the LAST of
 *   · the final piece of work it caused (a bake landing, or a frame delta over 33.4 ms),
 *     plus 400 ms of quiet, and
 *   · 1,100 ms after the tap.
 * Work before the tap is not this tap's work and is ignored. With no work at all the floor
 * alone decides, which is what makes N2..N4 (which bake nothing) measurable by the same rule
 * as N1 (which bakes eight poses).
 */
export function settleAtMs(
  tapAtMs: number,
  workAtMs: readonly number[],
  opts: { quietMs?: number; minElapsedMs?: number } = {},
): number {
  const quiet = opts.quietMs ?? SETTLE_QUIET_MS;
  const floor = tapAtMs + (opts.minElapsedMs ?? SETTLE_MIN_ELAPSED_MS);
  let last = -Infinity;
  for (const w of workAtMs) if (w >= tapAtMs && w > last) last = w;
  return last === -Infinity ? floor : Math.max(floor, last + quiet);
}

/**
 * Sum of max(0, gap - 50) over the gaps inside [fromMs, toMs). The same arithmetic TBT does
 * over long tasks, over the only census an engine without `longtask` can give. A PROXY.
 */
export function gapProxyMs(
  gaps: readonly RafGap[],
  fromMs: number,
  toMs: number,
): number {
  let sum = 0;
  for (const g of gaps)
    if (g.at >= fromMs && g.at < toMs) sum += Math.max(0, g.ms - BLOCKING_FLOOR_MS);
  return Math.round(sum);
}

/** long33 / long50 / worst over the gaps inside [fromMs, toMs). */
export function rafCensus(
  gaps: readonly RafGap[],
  fromMs: number,
  toMs: number,
): RafCensus {
  let long33 = 0;
  let long50 = 0;
  let worstMs = 0;
  for (const g of gaps) {
    if (g.at < fromMs || g.at >= toMs) continue;
    if (g.ms > LONG_FRAME_MS) long33 += 1;
    if (g.ms > BLOCKING_FLOOR_MS) long50 += 1;
    if (g.ms > worstMs) worstMs = g.ms;
  }
  return { long33, long50, worstMs: round1(worstMs) };
}

/** The occlusion tell: a lone delta of 1,000 to 1,300 ms is a suspended rAF, not a long task. */
export function isOcclusionGap(gapMs: number): boolean {
  return gapMs >= OCCLUSION_GAP_MIN_MS && gapMs <= OCCLUSION_GAP_MAX_MS;
}

/** Distinct rendered widths over a fold. More than one width is travel; exactly one is not. */
export function distinctWidths(widths: readonly number[]): number {
  return new Set(widths.map((w) => Math.round(w))).size;
}

export function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

/** What a mark holds before it is read: a number, or the reason there is no number. */
export type MarkValue = number | string | boolean | null | string[] | undefined;

/**
 * THE ROW SHAPE. One JSON line per reading, keyed exactly as
 * `evidence/w8/attribution/A6/readiness.jsonl` is keyed, so `A6/summarize-readiness.mjs`
 * folds the device rows and the proxy rows into ONE table with no second reader.
 *
 * Two names for one number, deliberately: the fold reads `firstBoilTickMs` (the proxy rows
 * were written with that key) and the charter's budget row B1 names the same mark
 * `boardDrawnMs`. Both are emitted, from the same observation, so neither reader has to know
 * about the other's spelling.
 *
 * `null` becomes the string NOT MEASURED, never 0: the summariser's median filters
 * non-numbers, so an unseeable mark prints NOT MEASURED there too instead of dragging a
 * median toward zero.
 */
export function toReadingRow(
  marks: Record<string, MarkValue>,
): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(marks)) {
    if (v === undefined) continue;
    row[k] = v === null ? "NOT MEASURED" : typeof v === "number" ? round1(v) : v;
  }
  return row;
}

/** The cell name a device reading folds under. Never claims a throttle rate or an engine. */
export function deviceCell(cache: string): string {
  return `device-${cache}`;
}
