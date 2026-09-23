import { test, expect, type Page } from '@playwright/test';
import { encodeSudoku } from '../../e2e/wire';

// PRM: live, because the subject is the fold's motion: under reduce both verbs are a same-frame
// cut and there is no first frame to read.

/**
 * T9-M19 · THE FOLD'S FIRST PAINTED FRAME IS ITS FIRST POSE (GA1, INTAKE row 30; T9-W7 §13
 * MOT-VERB pass 6, charter row 8).
 *
 * THE DEFINITION (pass-6 chair §1.4, written here so the gate carries it): enter frame 1 = the
 * first frame after the reparent on which the fold's mover exists; on it the board's centre is
 * within 3 px of its rest pose (the playing board it left, read before the press) AND its width
 * within 3 px — the RAW delta, never a residual against a fitted curve. Measured by rAF
 * sampling, the frame index printed; both engines; 1280 fine (light and dark) and 390×844
 * coarse. A residual gate would pass a verb that starts part-way in on the right curve, which is
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
  t: number;
  ct: number | null;
  x: number;
  y: number;
  w: number;
  vis: number;
};

/** Every frame from the press until the fold's mover has run its course, read in rAF. The
 *  window is keyed on the VERB (it closes on the first frame after the mover releases, or at
 *  `cap` frames if it never starts), never on a clock. */
async function foldFrames(page: Page, cap = 240): Promise<Frame[]> {
  await page.evaluate((cap) => {
    const w = window as unknown as { __fold: Frame[]; __foldDone: boolean };
    w.__fold = [];
    w.__foldDone = false;
    const t0 = performance.now();
    let i = 0;
    let seen = false;
    const tick = () => {
      const board = document.querySelector('.board-peek-host');
      // the fold's mover is the board's one SCRIPT animation (WAAPI), whatever the tree tags it
      const anim =
        board
          ?.getAnimations()
          .find((a) => !(a instanceof CSSTransition) && !(a instanceof CSSAnimation)) ?? null;
      if (board) {
        const r = board.getBoundingClientRect();
        let [l, t, rr, b] = [r.left, r.top, r.right, r.bottom];
        for (let a = board.parentElement; a; a = a.parentElement) {
          const cs = getComputedStyle(a);
          const ar = a.getBoundingClientRect();
          if (cs.overflowX !== 'visible') [l, rr] = [Math.max(l, ar.left), Math.min(rr, ar.right)];
          if (cs.overflowY !== 'visible') [t, b] = [Math.max(t, ar.top), Math.min(b, ar.bottom)];
        }
        const area = r.width * r.height;
        w.__fold.push({
          i: i++,
          t: performance.now() - t0,
          ct: anim ? Number(anim.currentTime ?? 0) : null,
          x: r.left + r.width / 2,
          y: r.top + r.height / 2,
          w: r.width,
          vis: area > 0 ? (Math.max(0, rr - l) * Math.max(0, b - t)) / area : 0,
        });
      }
      seen ||= !!anim;
      if ((seen && !anim) || i >= cap) w.__foldDone = true;
      else requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, cap);
  await page.keyboard.press('g');
  await expect
    .poll(() => page.evaluate(() => (window as unknown as { __foldDone: boolean }).__foldDone), {
      timeout: 15000,
    })
    .toBe(true);
  return page.evaluate(() => (window as unknown as { __fold: Frame[] }).__fold);
}

for (const cell of CELLS) {
  test(`GA1 · the fold's first painted frame is its first pose · ${cell.name}`, async ({
    browser,
  }) => {
    const ctx = await browser.newContext({
      viewport: { width: cell.w, height: cell.h },
      hasTouch: cell.touch,
      colorScheme: cell.scheme,
      reducedMotion: 'no-preference',
    });
    if (process.env.PLANT === 'skip') await ctx.addInitScript(() => { const d = Object.getOwnPropertyDescriptor(Animation.prototype, 'startTime')!; Object.defineProperty(Animation.prototype, 'startTime', { get() { return d.get!.call(this); }, set(v) { d.set!.call(this, typeof v === 'number' ? v - 150 : v); }, configurable: true }); });
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

    const frames = await foldFrames(page);
    const inFold = frames.filter((f) => f.ct !== null);
    const f1 = inFold[0];
    expect(f1, 'the fold never ran a mover (the cut, or the verb is gone)').toBeTruthy();
    const centre = Math.hypot(f1.x - rest.x, f1.y - rest.y);
    const dw = f1.w - rest.w;
    const f2 = inFold[1];
    console.log(
      `GA1 ${test.info().project.name} ${cell.name}: frame ${f1.i} (ct ${f1.ct}) centre ${centre.toFixed(2)} px, width ${dw.toFixed(2)} px; frame ${f2?.i} ct ${f2?.ct}; ${inFold.length} fold frames, visible min ${Math.min(...inFold.map((f) => f.vis)).toFixed(3)}`,
    );
    expect(centre, `frame ${f1.i}: the board starts ${centre.toFixed(2)} px off its rest pose`).toBeLessThanOrEqual(3);
    expect(Math.abs(dw), `frame ${f1.i}: the board starts ${dw.toFixed(2)} px off its rest width`).toBeLessThanOrEqual(3);
    // the glide MOVES after frame 1 (a hold that never releases would pass the two rows above)
    expect(inFold[inFold.length - 1].w, 'the fold never shrank the board').toBeLessThan(rest.w - 3);
    // the deck kept its card: the centre is still the game that folded into it
    if (cell.game !== 'sudoku')
      expect(
        await page.locator('.game-card.is-center .board-peek-host').count(),
        'the centre card lost the live board (the deck re-centred under the fold)',
      ).toBe(1);
    // GA2: never clipped while it folds
    for (const f of inFold)
      expect(f.vis, `frame ${f.i}: the folding board is clipped (visible ${f.vis.toFixed(3)})`).toBeGreaterThanOrEqual(0.999);
    await ctx.close();
  });
}
