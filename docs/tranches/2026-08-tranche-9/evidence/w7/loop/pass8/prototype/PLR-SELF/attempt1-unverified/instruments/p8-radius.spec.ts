import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import { settled, stable, mark, lobby } from './lib';
const OUT = process.env.OUT!;
/** Per corner: the drawn frame's nearest point to the ground box's corner, and what a frame of radius
 *  r inset i would give there: (i + r)·√2 − r. Solve for the drawn r: r = (d − i√2)/(√2 − 1). */
const corners = (el: Element) => {
  const g = el.getBoundingClientRect();
  const cs = getComputedStyle(el);
  const edge = el.querySelector('.head-sheet-edge') as HTMLElement;
  const inset = edge.offsetTop;
  const pts: [number, number][] = [];
  for (const p of el.querySelectorAll<SVGPathElement>('.head-sheet-edge path')) {
    const m = p.getScreenCTM()!;
    const L = p.getTotalLength();
    for (let s = 0; s <= L; s += 0.25) {
      const q = p.getPointAtLength(s);
      pts.push([m.a * q.x + m.c * q.y + m.e, m.b * q.x + m.d * q.y + m.f]);
    }
  }
  const cs4 = { tl: [g.left, g.top], tr: [g.right, g.top], br: [g.right, g.bottom], bl: [g.left, g.bottom] } as const;
  const out: Record<string, number> = {};
  for (const [k, [cx, cy]] of Object.entries(cs4)) {
    const d = Math.min(...pts.map(([x, y]) => Math.hypot(x - cx, y - cy)));
    out[k] = +((d - inset * Math.SQRT2) / (Math.SQRT2 - 1)).toFixed(2);
  }
  return { root: cs.fontSize, ground: parseFloat(cs.borderTopLeftRadius), inset, drawnR: out, n: pts.length };
};
for (const root of ['16px', '18px', '24px']) test(`radius ${root}`, async ({ page }, info) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./?size=3&difficulty=EASY&wire=local');
  await settled(page);
  await page.evaluate((r) => (document.documentElement.style.fontSize = r), root);
  await mark(page).click();
  await expect(lobby(page)).toHaveClass(/is-open/);
  const rd = () => lobby(page).evaluate(corners);
  await stable(rd);
  const r = await rd();
  const l = JSON.stringify({ eng: info.project.name, root, ...r, tag: process.env.TAG ?? 'tree' });
  fs.appendFileSync(OUT, l + '\n'); console.log(l);
});
