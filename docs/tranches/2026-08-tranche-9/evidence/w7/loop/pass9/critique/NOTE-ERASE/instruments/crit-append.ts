// ── CRIT (pass-9 critic of NOTE-ERASE; scratch, never banked) ──────────────────────────────
// The fence's contract: "read on @leave it returns the leave's own CSS animation when, and only
// when, one runs". Class siblings of the ghost name: an animation that EXISTS but does not RUN.
async function critProbe(page: Page, sel: string) {
  await page.evaluate((s) => {
    const w = window as unknown as { __crit: { anims?: string[] } };
    w.__crit = {};
    new MutationObserver(() => {
      const el = document.querySelector(s);
      if (el && !w.__crit.anims)
        w.__crit.anims = el.getAnimations().map(
          (a) => `${(a as unknown as { animationName?: string }).animationName}:${a.playState}:${a.currentTime}:${a.timeline === null ? 'tl-null' : 'tl'}`,
        );
    }).observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['class'] });
  }, sel);
}
const critOpacities = (page: Page) =>
  page.evaluate(() => {
    const w = window as unknown as { __pf: { post: { r: { x: unknown } | null }[] }; __crit: { anims?: string[] } };
    return {
      anims: w.__crit.anims ?? [],
      op: w.__pf.post.filter((p) => p.r !== null).map((p) => +parseFloat(String(p.r!.x)).toFixed(2)),
    };
  });
const CRIT_LINE_TWO: { name: string; css: string }[] = [
  { name: 'paused', css: `${TWO} { animation-play-state: paused !important; }` },
  { name: 'timeline none', css: `${TWO} { animation-timeline: none !important; }` },
  { name: 'control (as shipped)', css: '' },
];
for (const c of CRIT_LINE_TWO)
  test(`CRIT line two: ${c.name}`, async ({ page }) => {
    await holdDeal(page, 'light', c.css ? (p) => p.addStyleTag({ content: c.css }).then(() => undefined) : undefined);
    await ask(page);
    await answer(page);
    await page.waitForTimeout(MOTION.rungs.note * 2);
    await critProbe(page, LINE_TWO_LEAVING);
    const done = await watchLeave(page, LINE_TWO_LEAVING);
    await ask(page);
    const leave = await done();
    const o = await critOpacities(page);
    console.log(`CRIT line two ${c.name}: ${leave.ms} ms dur=${leave.animationDuration} name=${leave.animationName} connected=${leave.painted} visible=${leave.visible} anims=${JSON.stringify(o.anims)} op=${o.op.join(',')}`);
  });
const CRIT_SWAP: { name: string; css: string }[] = [
  { name: 'real verb paused', css: `.margin-note-ink.note-swap-leave-active { animation-name: ink-rub-out !important; animation-duration: 150ms !important; animation-play-state: paused !important; }` },
  { name: 'real verb timeline none', css: `.margin-note-ink.note-swap-leave-active { animation-name: ink-rub-out !important; animation-duration: 150ms !important; animation-timeline: none !important; }` },
  { name: 'real verb running (positive control)', css: `.margin-note-ink.note-swap-leave-active { animation-name: ink-rub-out !important; animation-duration: 150ms !important; }` },
];
for (const c of CRIT_SWAP)
  test(`CRIT swap: ${c.name}`, async ({ page }) => {
    await holdDeal(page, 'light', (p) => p.addStyleTag({ content: c.css }).then(() => undefined));
    const held = await lineOne(page);
    await critProbe(page, LINE_ONE_LEAVING);
    const done = await watchLeave(page, LINE_ONE_LEAVING);
    await ask(page);
    const leave = await done();
    await expect.poll(() => lineTwo(page)).toBe(held);
    const o = await critOpacities(page);
    console.log(`CRIT swap ${c.name}: ${leave.ms} ms dur=${leave.animationDuration} name=${leave.animationName} connected=${leave.painted} visible=${leave.visible} anims=${JSON.stringify(o.anims)} op=${o.op.join(',')}`);
  });
for (const c of [
  { name: 'paused', css: `.margin-note-ink.note-leave-active { animation-play-state: paused !important; }` },
  { name: 'timeline none', css: `.margin-note-ink.note-leave-active { animation-timeline: none !important; }` },
  { name: 'control (as shipped)', css: '' },
])
  test(`CRIT line one red-line leave: ${c.name}`, async ({ page }) => {
    const leave = await redLineLeaves(page, async (p) => {
      if (c.css) await p.addStyleTag({ content: c.css });
      await critProbe(p, '.margin-note-ink.note-leave-active');
    });
    const o = await critOpacities(page);
    console.log(`CRIT line one ${c.name}: ${leave.ms} ms dur=${leave.animationDuration} name=${leave.animationName} connected=${leave.painted} visible=${leave.visible} anims=${JSON.stringify(o.anims)} op=${o.op.join(',')}`);
  });
// Threshold edge (LAWS P8 §F): a hook that writes a NEAR-bound length instead of 0s on the ghost swap.
for (const near of [100, 140, 149])
  test(`CRIT edge: the ghost swap held ${near} ms by a near-bound write`, async ({ page }) => {
    await page.addInitScript(`(() => {
      const real = CSSStyleDeclaration.prototype.setProperty;
      CSSStyleDeclaration.prototype.setProperty = function (p, v, pr) {
        if (p === 'animation-duration' && v === '0s' && pr === 'important') v = '${near}ms';
        return real.call(this, p, v, pr);
      };
    })();`);
    await holdDeal(page, 'light', GHOST_SWAP);
    const done = await watchLeave(page, LINE_ONE_LEAVING);
    await ask(page);
    const leave = await done();
    const clauses = {
      durIs0s: leave.animationDuration === '0s',
      msUnderRung: leave.ms < MOTION.rungs.whisper,
      visLe2: leave.visible <= 2,
      connLe2: leave.painted <= 2,
    };
    console.log(`CRIT edge ${near}: ${leave.ms} ms dur=${leave.animationDuration} connected=${leave.painted} visible=${leave.visible} clauses=${JSON.stringify(clauses)}`);
  });
test('CRIT line two: scroll timeline', async ({ page }) => {
  await holdDeal(page, 'light', (p) => p.addStyleTag({ content: `${TWO} { animation-timeline: scroll(root) !important; }` }).then(() => undefined));
  await ask(page);
  await answer(page);
  await page.waitForTimeout(MOTION.rungs.note * 2);
  await critProbe(page, LINE_TWO_LEAVING);
  const done = await watchLeave(page, LINE_TWO_LEAVING);
  await ask(page);
  const leave = await done();
  const o = await critOpacities(page);
  console.log(`CRIT line two scroll timeline: ${leave.ms} ms dur=${leave.animationDuration} connected=${leave.painted} visible=${leave.visible} anims=${JSON.stringify(o.anims)} op=${o.op.join(',')}`);
});
