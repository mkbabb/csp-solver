import { test, expect } from '@playwright/test';
import { encodeSudoku } from '../../e2e/wire';
// CRITIC copy of fold-verb.spec GA1 (MOT-VERB pass 6). Adds: (1) a POST-PAINT read of every
// frame (setTimeout 0 queued from the rAF — runs after that frame's rendering update), beside the
// lane's in-rAF read; (2) the per-frame centre/width STEP over the whole fold; (3) PLANT=skip:
// a runtime plant that makes every explicit startTime write land 150 ms EARLY (the fold jumps
// 150 ms in AFTER the held frame).
// prettier-ignore
const SOLVED_9 = [5,3,4,6,7,8,9,1,2,6,7,2,1,9,5,3,4,8,1,9,8,3,4,2,5,6,7,8,5,9,7,6,1,4,2,3,4,2,6,8,5,3,7,9,1,7,1,3,9,2,4,8,5,6,9,6,1,5,3,7,2,8,4,2,8,7,4,1,9,6,3,5,3,4,5,2,8,6,1,7,9];
const BLANKS = new Set([0, 4, 10, 22, 36, 40, 55, 61, 73, 80]);
const BOARD = encodeSudoku(3, Object.fromEntries(SOLVED_9.map((v, i) => [i, BLANKS.has(i) ? 0 : v])), 81);
const CELLS = [
  { name: '1280 fine light', w: 1280, h: 800, touch: false },
  { name: '390x844 coarse light', w: 390, h: 844, touch: true },
];
const PLANT = process.env.PLANT ?? '';
for (const cell of CELLS)
  for (const rep of [1, 2])
    test(`GA1crit ${cell.name} r${rep} ${PLANT}`, async ({ browser }) => {
      const ctx = await browser.newContext({ viewport: { width: cell.w, height: cell.h }, hasTouch: cell.touch, colorScheme: 'light', reducedMotion: 'no-preference' });
      if (PLANT === 'skip')
        await ctx.addInitScript(() => {
          const d = Object.getOwnPropertyDescriptor(Animation.prototype, 'startTime')!;
          Object.defineProperty(Animation.prototype, 'startTime', {
            get() { return d.get!.call(this); },
            set(v) { d.set!.call(this, typeof v === 'number' ? v - 150 : v); },
            configurable: true,
          });
        });
      const page = await ctx.newPage();
      await page.goto('/?game=sudoku&board=' + BOARD);
      await page.locator('.board-cells').first().waitFor();
      expect(await page.locator('.board-cells [aria-label*="given clue"]').count()).toBe(71);
      if (cell.touch) expect(await page.evaluate(() => matchMedia('(any-pointer: coarse)').matches)).toBe(true);
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(600);
      const rest = await page.evaluate(() => { const r = document.querySelector('.board-peek-host')!.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width }; });
      await page.evaluate(() => {
        const w = window as any; w.__f = []; w.__p = []; w.__done = false;
        let i = 0, seen = false;
        const read = () => {
          const b = document.querySelector('.board-peek-host');
          const a = b?.getAnimations().find((x) => !(x instanceof CSSTransition) && !(x instanceof CSSAnimation)) ?? null;
          if (!b) return null;
          const r = b.getBoundingClientRect();
          return { ct: a ? Number(a.currentTime ?? 0) : null, ps: a ? a.playState : null, x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, tl: document.timeline.currentTime };
        };
        const tick = () => {
          const k = i++;
          const s = read(); if (s) w.__f.push({ i: k, ...s });
          setTimeout(() => { const p = read(); if (p) w.__p.push({ i: k, ...p }); }, 0);
          const a = s?.ct != null;
          seen ||= a;
          if ((seen && !a) || i >= 240) w.__done = true; else requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
      await page.keyboard.press('g');
      await expect.poll(() => page.evaluate(() => (window as any).__done), { timeout: 20000 }).toBe(true);
      await page.waitForTimeout(100);
      const { f, p } = await page.evaluate(() => ({ f: (window as any).__f, p: (window as any).__p }));
      const inF = f.filter((x: any) => x.ct !== null);
      const inP = p.filter((x: any) => x.ct !== null);
      const d = (s: any) => ({ c: Math.hypot(s.x - rest.x, s.y - rest.y), dw: s.w - rest.w });
      let maxStep = 0, maxAt = -1;
      for (let k = 1; k < inF.length; k++) { const st = Math.hypot(inF[k].x - inF[k - 1].x, inF[k].y - inF[k - 1].y) + Math.abs(inF[k].w - inF[k - 1].w); if (st > maxStep) { maxStep = st; maxAt = inF[k].i; } }
      const fmt = (s: any) => s ? `i${s.i} ct ${s.ct?.toFixed?.(1)} ${s.ps} c ${d(s).c.toFixed(2)} dw ${d(s).dw.toFixed(2)}` : '-';
      console.log(`GA1CRIT ${test.info().project.name} ${cell.name} r${rep} ${PLANT || 'clean'} | inRAF f1 ${fmt(inF[0])} ; f2 ${fmt(inF[1])} ; f3 ${fmt(inF[2])} | POSTPAINT f1 ${fmt(inP[0])} ; f2 ${fmt(inP[1])} | step(f1->f2) ${inF[1] ? (Math.hypot(inF[1].x - inF[0].x, inF[1].y - inF[0].y) + Math.abs(inF[1].w - inF[0].w)).toFixed(2) : '-'} | maxStep ${maxStep.toFixed(2)} @i${maxAt} | frames ${inF.length} | travel c ${inF.length ? d(inF[inF.length - 1]).c.toFixed(1) : '-'} dw ${inF.length ? d(inF[inF.length - 1]).dw.toFixed(1) : '-'}`);
      await ctx.close();
    });
