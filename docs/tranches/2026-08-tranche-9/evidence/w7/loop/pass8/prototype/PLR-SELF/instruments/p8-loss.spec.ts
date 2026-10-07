import { test } from '@playwright/test';
import fs from 'node:fs';
import { settled, stable, mark } from './lib';
const OUT = process.env.OUT!;
/** (b)'s loss, measured on the cured guard: tap, wait W, one press-less click. The gap between the release
 *  and the click is read off the two events' own time stamps; toggles counted. Both deliveries. */
for (const withheld of [false, true]) for (const wait of [0, 150, 300, 450, 1500]) test(`loss withheld=${withheld} wait=${wait}`, async ({ browser }, info) => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
  if (withheld) await ctx.addInitScript(() => addEventListener('click', (e) => { if (e.isTrusted && (e as PointerEvent).pointerType === 'touch') e.stopImmediatePropagation(); }, { capture: true }));
  const page = await ctx.newPage();
  await page.goto('./?size=3&difficulty=EASY&wire=local');
  await settled(page);
  await mark(page).evaluate((el) => {
    const w = window as any; w.__st = [el.getAttribute('aria-expanded')]; w.__up = 0; w.__ck = 0;
    new MutationObserver(() => { const v = el.getAttribute('aria-expanded'); if (v !== w.__st.at(-1)) w.__st.push(v); }).observe(el, { attributes: true });
    addEventListener('pointerup', (e) => { if (el.contains(e.target as Node)) w.__up = e.timeStamp; }, { capture: true });
    addEventListener('click', (e) => { if (el.contains(e.target as Node) && !e.isTrusted) w.__ck = e.timeStamp; }, { capture: true });
  });
  const read = () => page.evaluate(() => ({ st: (window as any).__st as string[], gap: +((window as any).__ck - (window as any).__up).toFixed(1) }));
  await mark(page).tap();
  if (wait) await page.waitForTimeout(wait);
  await mark(page).evaluate((el) => (el as HTMLElement).click());
  await stable(read);
  const r = await read();
  const l = JSON.stringify({ eng: info.project.name, withheld, wait, gapMs: r.gap, states: r.st, clickToggled: r.st.length === 3 });
  fs.appendFileSync(OUT, l + '\n'); console.log(l);
  await ctx.close();
});
