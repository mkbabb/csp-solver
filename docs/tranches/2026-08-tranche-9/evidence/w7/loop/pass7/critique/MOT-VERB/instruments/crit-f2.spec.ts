import { test, expect, type Page } from '@playwright/test';
import { loadavg } from 'node:os';
import { encodeSudoku } from '../e2e/wire';

// PRM: live, because the subject is the fold's motion: under reduce both verbs are a same-frame
// cut and there is no first frame to read.

/**
 * T9-M19 · THE FOLD'S FIRST PAINTED FRAME IS ITS FIRST POSE (GA1, INTAKE row 30; T9-W7 §13
 * MOT-VERB pass 6, charter row 8).
 *
 * THE DEFINITION (pass-6 chair §1.4, written here so the gate carries it): enter frame 1 = the
 * first frame after the reparent on which the fold's mover exists; on it the board's centre is
 * within 3 px of its rest pose (the playing board it left, read before the press) AND its width
 * within 3 px — the RAW delta, never a residual against a fitted curve. READ POST-PAINT (pass 7,
 * LAWS P6 §D): each frame is read in a task queued from its rAF (a MessageChannel message runs after
 * that frame's rendering update, whatever order the product's rAFs ran in), with the frame's
 * `document.timeline` time captured in the rAF — the chair's post-paint sampler
 * (`pass7/instruments/postpaint.mjs`, `installSampler`/`analyse`), whose semantics this reader
 * carries. The pass-6 reader sampled IN rAF, registered before the product's own, so it read the
 * pre-callback state: a runtime plant that painted frame 1 at ct 150, 142.9 px off, passed it 8/8.
 * The CLOCK IDENTITY rides the same frames: ct(frame k) = tl(k) − tl(frame 1) ± 2 ms for k = 2, 3
 * (a first frame that is at rest but whose clock then jumps is the same skip one frame later).
 * Gated in Chromium; printed in WebKit, whose post task can run after its next animation-time
 * update (the chair's reading) — WebKit's clock is read on the recorder's ladder. Both engines;
 * 1280 fine (light and dark) and 390×844 coarse. PLANT skip (every explicit `startTime` write lands
 * 150 ms early) is the negative, in this file, and it must RED. A residual gate would pass a verb that starts part-way in on the right curve, which is
 * the defect: at 74a2b5d9 frame 1 sits 92.9 px off at 1280 in Chromium, and in WebKit the UA's
 * own resolution of a pending start put it 3.76 px off and 7.37 px narrow (pass 5).
 *
 * GA2 rides the same frames: while the fold runs, the board is never clipped by an ancestor
 * (the visible fraction, every ancestor's overflow on each axis, is 1.0 on every frame; 0.235 at
 * 74a2b5d9). Born RED on the control (74a2b5d9) at every cell and engine.
 */
// prettier-ignore
const SOLVED_9 = [
  5, 3, 4, 6, 7, 8, 9, 1, 2,  6, 7, 2, 1, 9, 5, 3, 4, 8,  1, 9, 8, 3, 4, 2, 5, 6, 7,
  8, 5, 9, 7, 6, 1, 4, 2, 3,  4, 2, 6, 8, 5, 3, 7, 9, 1,  7, 1, 3, 9, 2, 4, 8, 5, 6,
  9, 6, 1, 5, 3, 7, 2, 8, 4,  2, 8, 7, 4, 1, 9, 6, 3, 5,  3, 4, 5, 2, 8, 6, 1, 7, 9,
];
const BLANKS = new Set([0, 4, 10, 22, 36, 40, 55, 61, 73, 80]);
const BOARD = encodeSudoku(
  3,
  Object.fromEntries(SOLVED_9.map((v, i) => [i, BLANKS.has(i) ? 0 : v])),
  81,
);

// The last cell is the deck at a NON-ZERO index (INTAKE row 31): kenken is card 5 of 5, so the
// deck opens scrolled, and the fold's lift (`overflow-x: clip`) resets that scroll. Chromium then
// reported a snap for a position no hand chose, the centre went to card 1 in the fold's first
// frame and the fold ran on a board parked out of sight (frame 1 at 0×0, 569 px off; pass 6).
// Its board is dealt, not pinned: the row reads geometry, never the givens.
const CELLS = [
  { name: '1280x800 fine light', w: 1280, h: 800, touch: false, scheme: 'light', game: 'sudoku' },
  { name: '1280x800 fine dark', w: 1280, h: 800, touch: false, scheme: 'dark', game: 'sudoku' },
  { name: '390x844 coarse light', w: 390, h: 844, touch: true, scheme: 'light', game: 'sudoku' },
  { name: '1280x800 fine light, kenken (deck index 4)', w: 1280, h: 800, touch: false, scheme: 'light', game: 'kenken' },
] as const;

type Frame = {
  i: number;
  tl: number;
  ct: number | null;
  x: number;
  y: number;
  w: number;
  vis: number;
};

/** Every frame from the press until the fold's mover has run its course, each read POST-PAINT.
 *  The window is keyed on the VERB (it closes on the first frame after the mover releases, or at
 *  `cap` frames if it never starts), never on a clock. */
async function foldFrames(page: Page, cap = 240): Promise<{ frames: Frame[]; kPaint: number }> {
  await page.evaluate((cap) => {
    const w = window as unknown as {
      __fold: Frame[];
      __foldDone: boolean;
      __foldR: number[];
      __foldIo: number | null;
    };
    w.__fold = [];
    w.__foldDone = false;
    // WHICH FRAME FIRST PAINTED THE MOVER (pass 7). The post-paint read is a TASK, and a task the
    // page queued earlier (the chrome-leave timeout that runs the fold) can run between a frame's
    // paint and that read: the read then sees a mover the frame never painted, and the next frame
    // reads as a second copy of the first pose (chromium 1280, 1-4 of 20 runs: ct 0 twice, step 0).
    // An IntersectionObserver's entry is computed inside the first rendering update the mover
    // exists in, and its `time` falls after that frame's rAF stamp and before the next one's: that
    // frame is frame 1, and the reads before it are dropped.
    w.__foldR = [];
    w.__foldIo = null;
    const animate = Element.prototype.animate;
    Element.prototype.animate = function (this: Element, ...a: Parameters<Element['animate']>) {
      const anim = animate.apply(this, a);
      if (w.__foldIo === null && this.classList.contains('board-peek-host')) {
        w.__foldIo = -1;
        const io = new IntersectionObserver((es) => {
          w.__foldIo = es[0].time;
          io.disconnect();
        });
        io.observe(this);
      }
      return anim;
    };
    const read = (i: number, tl: number): Frame | null => {
      const board = document.querySelector('.board-peek-host');
      if (!board) return null;
      // the fold's mover is the board's one SCRIPT animation (WAAPI), whatever the tree tags it
      const anim =
        board
          .getAnimations()
          .find((a) => !(a instanceof CSSTransition) && !(a instanceof CSSAnimation)) ?? null;
      const r = board.getBoundingClientRect();
      let [l, t, rr, b] = [r.left, r.top, r.right, r.bottom];
      for (let a = board.parentElement; a; a = a.parentElement) {
        const cs = getComputedStyle(a);
        const ar = a.getBoundingClientRect();
        if (cs.overflowX !== 'visible') [l, rr] = [Math.max(l, ar.left), Math.min(rr, ar.right)];
        if (cs.overflowY !== 'visible') [t, b] = [Math.max(t, ar.top), Math.min(b, ar.bottom)];
      }
      const area = r.width * r.height;
      return {
        i,
        tl,
        ct: anim ? Number(anim.currentTime ?? 0) : null,
        x: r.left + r.width / 2,
        y: r.top + r.height / 2,
        w: r.width,
        vis: area > 0 ? (Math.max(0, rr - l) * Math.max(0, b - t)) / area : 0,
      };
    };
    const mc = new MessageChannel();
    const q: (() => void)[] = [];
    mc.port1.onmessage = () => q.shift()?.();
    let i = 0;
    let seen = false;
    const tick = () => {
      const k = i++;
      w.__foldR[k] = performance.now();
      const tl = Number(document.timeline.currentTime ?? 0);
      q.push(() => {
        const f = read(k, tl);
        if (f) w.__fold.push(f);
        seen ||= f?.ct != null;
        if ((seen && f?.ct == null) || k + 1 >= cap) w.__foldDone = true;
      });
      mc.port2.postMessage(0);
      if (!w.__foldDone) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, cap);
  await page.keyboard.press('g');
  await expect
    .poll(() => page.evaluate(() => (window as unknown as { __foldDone: boolean }).__foldDone), {
      timeout: 15000,
    })
    .toBe(true);
  return page.evaluate(() => {
    const w = window as unknown as { __fold: Frame[]; __foldR: number[]; __foldIo: number | null };
    const io = w.__foldIo ?? -1;
    // the last frame whose rAF stamp precedes the observer's entry; -1 when it never reported
    const kPaint = io < 0 ? -1 : w.__foldR.reduce((k, r, i) => (r <= io ? i : k), -1);
    return { frames: w.__fold, kPaint };
  });
}

/** PLANT skip (the pass-6 critic's; the chair's `SKIP_PLANT`): every explicit `startTime` write
 *  lands 150 ms early, so the fold jumps 150 ms in on the frame after the hold. */
function skipPlant() {
  const d = Object.getOwnPropertyDescriptor(Animation.prototype, 'startTime')!;
  Object.defineProperty(Animation.prototype, 'startTime', {
    get() {
      return d.get!.call(this);
    },
    set(v) {
      d.set!.call(this, typeof v === 'number' ? v - 150 : v);
    },
    configurable: true,
  });
}

type Verdict = {
  f1: Frame;
  centre: number;
  dw: number;
  ci: { k: number; off: number }[];
  inFold: Frame[];
  /** reads of the mover taken before the frame that first painted it (dropped) */
  dropped: number;
};

/** Open the cell, fold, and read frame 1 + the clock identity post-paint. */
async function readFold(
  browser: import('@playwright/test').Browser,
  cell: (typeof CELLS)[number],
  plant: boolean | 'f2' = false,
): Promise<Verdict> {
  const ctx = await browser.newContext({
    viewport: { width: cell.w, height: cell.h },
    hasTouch: cell.touch,
    colorScheme: cell.scheme,
    reducedMotion: 'no-preference',
  });
  if (plant === true) await ctx.addInitScript(skipPlant);
  if (plant === 'f2') await ctx.addInitScript(frame2Plant);
  const page = await ctx.newPage();
  await page.goto(cell.game === 'sudoku' ? '/?game=sudoku&board=' + BOARD : '/?game=' + cell.game);
  await page.locator('.board-cells').first().waitFor();
  // the payload read back through the aria-label corpus (LAWS P5), never innerText
  if (cell.game === 'sudoku')
    expect(await page.locator('.board-cells [aria-label*="given clue"]').count()).toBe(71);
  if (cell.touch)
    expect(await page.evaluate(() => matchMedia('(any-pointer: coarse)').matches)).toBe(true);
  await page.evaluate(() => document.fonts.ready);
  const rest = await page.evaluate(() => {
    const r = document.querySelector('.board-peek-host')!.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width };
  });
  const { frames, kPaint } = await foldFrames(page);
  expect(kPaint, 'the mover never reported its first painted frame').toBeGreaterThanOrEqual(0);
  const seen = frames.filter((f) => f.ct !== null).sort((a, b) => a.i - b.i);
  const inFold = seen.filter((f) => f.i >= kPaint);
  const f1 = inFold[0];
  expect(f1, 'the fold never ran a mover (the cut, or the verb is gone)').toBeTruthy();
  const ci = [2, 3]
    .filter((k) => inFold[k - 1])
    .map((k) => ({ k, off: inFold[k - 1].ct! - (inFold[k - 1].tl - f1.tl) }));
  if (cell.game !== 'sudoku')
    expect(
      await page.locator('.game-card.is-center .board-peek-host').count(),
      'the centre card lost the live board (the deck re-centred under the fold)',
    ).toBe(1);
  await ctx.close();
  return {
    f1,
    centre: Math.hypot(f1.x - rest.x, f1.y - rest.y),
    dw: f1.w - rest.w,
    ci,
    inFold: inFold.map((f) => ({ ...f, w: f.w - rest.w })),
    dropped: seen.length - inFold.length,
  };
}

/** The gate's clauses; returns every failure (empty = GREEN). CI is gated in Chromium only. */
function failures(v: Verdict, engine: string): string[] {
  const out: string[] = [];
  if (v.centre > 3) out.push(`frame ${v.f1.i}: the board starts ${v.centre.toFixed(2)} px off its rest pose`);
  if (Math.abs(v.dw) > 3) out.push(`frame ${v.f1.i}: the board starts ${v.dw.toFixed(2)} px off its rest width`);
  if (engine === 'chromium')
    for (const { k, off } of v.ci)
      if (Math.abs(off) > 2) out.push(`clock identity: ct(frame ${k}) is ${off.toFixed(1)} ms off tl(${k}) − tl(1)`);
  if (engine === 'chromium' && v.ci.length < 2) out.push('clock identity: fewer than three fold frames');
  return out;
}


/** PLANT f2 (the pass-7 critic's): frame 1 is left at its held rest pose; on the SECOND rAF after the
 *  fold's animate() the mover's clock jumps 150 ms, so frame 2 paints 150 ms in. */
function frame2Plant() {
  const animate = Element.prototype.animate;
  let armed = false;
  Element.prototype.animate = function (this: Element, ...a: Parameters<Element['animate']>) {
    const anim = animate.apply(this, a);
    if (!armed && this.classList.contains('board-peek-host')) {
      armed = true;
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          anim.currentTime = Number(anim.currentTime ?? 0) + 150;
        }),
      );
    }
    return anim;
  };
}
for (const idx of [0, 2]) {
  test(`CRIT · PLANT f2 (frame 2 jumps 150 ms) · ${CELLS[idx].name}`, async ({ browser }) => {
    const engine = test.info().project.name.includes('webkit') ? 'webkit' : 'chromium';
    const v = await readFold(browser, CELLS[idx], 'f2');
    const red = failures(v, engine);
    const [a, b] = v.inFold;
    console.log(`CRIT f2 ${engine} ${CELLS[idx].name}: f1 ct ${v.f1.ct} centre ${v.centre.toFixed(2)}; frame2 ct ${b?.ct} tl-gap ${b ? (b.tl - a.tl).toFixed(1) : 'n/a'} step ${b ? (Math.hypot(b.x - a.x, b.y - a.y) + Math.abs(b.w - a.w)).toFixed(1) : 'n/a'} px; CI ${v.ci.map((c) => `k${c.k} ${c.off.toFixed(1)}`).join(', ')}; verdict ${red.join(' | ') || 'GREEN'}; load ${loadavg()[0].toFixed(1)}`);
  });
}
