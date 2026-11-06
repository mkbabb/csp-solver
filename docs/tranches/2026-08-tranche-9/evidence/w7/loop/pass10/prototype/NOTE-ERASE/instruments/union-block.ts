// Pass 10 (LAWS P9 §D): PRESENT IS NOT RUNNING, on the union's two other leaves. The SWAP ships no
// verb (`animation: none`), so its plants give it the real one (`ink-rub-out` on its own length),
// and the POSITIVE control is that verb running: the rung is written and the node fades. Each class
// plant adds one declaration that keeps the verb present and stops it running; line two ships its
// verb, so its plants are that one declaration. Every negative is the pass-9 presence key in-run.
const SWAP_VERB = `.margin-note-ink.note-swap-leave-active { animation-name: ink-rub-out; animation-duration: ${MOTION.rungs.whisper}ms`;
const swapVerb = (decl?: string) => (page: Page) =>
  page
    .addStyleTag({ content: `${SWAP_VERB}${decl ? `; ${decl}` : ''}; }` })
    .then(() => undefined);

async function swapLeaves(page: Page, scheme: 'light' | 'dark', arm: (page: Page) => Promise<void>) {
  await holdDeal(page, scheme, arm);
  const held = await lineOne(page);
  const done = await watchLeave(page, LINE_ONE_LEAVING);
  await ask(page);
  const leave = await done();
  await expect.poll(() => lineTwo(page)).toBe(held);
  return leave;
}

for (const scheme of ['light', 'dark'] as const) {
  test(`drop clock, the SWAP (positive, in-run): a RUNNING verb keeps its rung — ${scheme}`, async ({
    page,
  }) => {
    const leave = await swapLeaves(page, scheme, swapVerb());
    expect(leave.animationName).toBe('ink-rub-out');
    expect(leave.animationDuration).toBe(`${MOTION.rungs.whisper / 1000}s`);
    // Held across frames, not to the millisecond: a running leave's clock IS Vue's rung + 1, read
    // from first sight of the class (149.2 ms once, chromium, pass 10). The time is printed.
    expect(leave.painted).toBeGreaterThan(ZERO_LEAVE_FRAMES);
    console.log(
      `swap running verb ${scheme}: ${leave.ms} ms, ${leave.painted} connected / ${leave.visible} visible frames`,
    );
  });
  for (const plant of NOT_RUNNING) {
    test(`drop clock, the SWAP: a verb PRESENT but not RUNNING has no clock — ${scheme}, ${plant.name}`, async ({
      page,
    }) => {
      const leave = await swapLeaves(page, scheme, swapVerb(plant.decl));
      expect(leave.animationName).toBe('ink-rub-out');
      expect(leave.animationDuration).toBe('0s');
      expect(leave.painted).toBeLessThanOrEqual(ZERO_LEAVE_FRAMES);
      console.log(
        `swap not running ${scheme} ${plant.name}: ${leave.ms} ms, ${leave.painted} connected / ${leave.visible} visible frames`,
      );
    });
    test(`drop clock, the SWAP (negative, in-run): the pass-9 presence key holds ${plant.name} — ${scheme}`, async ({
      page,
    }) => {
      await page.addInitScript(PRESENT_KEY);
      const leave = await swapLeaves(page, scheme, swapVerb(plant.decl));
      expect(leave.animationDuration).toBe(`${MOTION.rungs.whisper / 1000}s`);
      expect(leave.painted).toBeGreaterThan(ZERO_LEAVE_FRAMES);
      console.log(
        `swap presence negative ${scheme} ${plant.name}: held ${leave.ms} ms, ${leave.painted} connected / ${leave.visible} visible frames`,
      );
    });
    test(`drop clock, line two: a verb PRESENT but not RUNNING has no clock — ${scheme}, ${plant.name}`, async ({
      page,
    }) => {
      const leave = await lineTwoLeaves(page, `${TWO} { ${plant.decl}; }`, scheme);
      expect(leave.animationName).toContain('ink-rub-out');
      expect(leave.animationDuration).toBe('0s');
      expect(leave.painted).toBeLessThanOrEqual(ZERO_LEAVE_FRAMES);
      console.log(
        `line two not running ${scheme} ${plant.name}: ${leave.ms} ms, ${leave.painted} connected / ${leave.visible} visible frames`,
      );
    });
    test(`drop clock, line two (negative, in-run): the pass-9 presence key holds ${plant.name} — ${scheme}`, async ({
      page,
    }) => {
      await page.addInitScript(PRESENT_KEY);
      const leave = await lineTwoLeaves(page, `${TWO} { ${plant.decl}; }`, scheme);
      expect(leave.animationDuration).toBe(`${MOTION.rungs.whisper / 1000}s`);
      expect(leave.painted).toBeGreaterThan(ZERO_LEAVE_FRAMES);
      console.log(
        `line two presence negative ${scheme} ${plant.name}: held ${leave.ms} ms, ${leave.painted} connected / ${leave.visible} visible frames`,
      );
    });
  }
}

