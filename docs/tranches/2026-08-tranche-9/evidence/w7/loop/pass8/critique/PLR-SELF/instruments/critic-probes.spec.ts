// PLR-SELF pass-8 critic probes. Appended to a copy of player-mark.spec.ts (bank sha1 9695e53004c1) whose own tests were test.skip'd;
// the helpers (settled, invite, crowd, drawSheet, openSheet, stable, mark, SOLO, edgeGate/EDGE_PLANTS/fmt from ./lib/edge-bands.mjs) are that file's.
test('CRITIC cells', async ({ browser }, info) => {
  test.setTimeout(1800000);
  const cells: [number, number, boolean, number][] = [
    [712, 800, true, 3], [1040, 768, true, 3], [1048, 768, true, 3], [820, 800, true, 3], [820, 830, true, 3], [820, 860, true, 3],
    [768, 1024, true, 3], [834, 1194, true, 3], [1194, 834, true, 3], [1024, 1366, true, 3], [1366, 1024, true, 3],
    [1180, 820, true, 3], [1280, 800, false, 3], [1366, 768, false, 3], [1440, 900, false, 3], [1920, 1080, false, 3],
    [812, 375, true, 4], [1280, 800, false, 4], [1366, 768, false, 4],
  ];
  const out: string[] = [];
  for (const [w, h, coarse, size] of cells) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: coarse });
    const page = await ctx.newPage();
    try {
      await page.goto(`./?size=${size}&difficulty=EASY&wire=local`);
      await settled(page);
      await invite(page);
      await crowd(page, 6, `crit-${w}x${h}`);
      const r = await drawSheet(page);
      const geo = await page.evaluate(() => {
        const s = document.querySelector('[data-lobby].is-open')!.getBoundingClientRect();
        const b = document.querySelector('.board-peek-host')!.getBoundingClientRect();
        const n = document.querySelectorAll('.sudoku-cell').length;
        return { sheet: [s.left, s.top, s.width, s.height].map((v) => +v.toFixed(1)), board: [b.left, b.top, b.width, b.height].map((v) => +v.toFixed(1)), n };
      });
      out.push(JSON.stringify({ engine: info.project.name, w, h, coarse, size, rows: r.rows, lapped: r.lapped, ...geo }));
    } catch (e) {
      out.push(JSON.stringify({ engine: info.project.name, w, h, coarse, size, error: String(e).slice(0, 200) }));
    }
    await ctx.close();
  }
  console.log('CRITIC-CELLS\n' + out.join('\n'));
});

test('CRITIC regimes', async ({ browser }, info) => {
  test.setTimeout(1800000);
  const out: string[] = [];
  const regimes = [
    { name: 'nopref-fine', coarse: false, media: { reducedMotion: 'no-preference' as const } },
    { name: 'reduce-more-fine', coarse: false, media: { reducedMotion: 'reduce' as const, contrast: 'more' as const } },
    { name: 'reduce-coarse', coarse: true, media: { reducedMotion: 'reduce' as const } },
  ];
  for (const rg of regimes) for (const scheme of ['light', 'dark'] as const) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, hasTouch: rg.coarse });
    const page = await ctx.newPage();
    try {
      await page.emulateMedia({ colorScheme: scheme, ...rg.media } as any);
      await page.goto(SOLO);
      await settled(page);
      await mark(page).click();
      await openSheet(page);
      const subject = '.corner-left [data-lobby]';
      const edge = `${subject} .head-sheet-edge`;
      const P = EDGE_PLANTS(edge) as Record<string, unknown>;
      const pick = { X4_opacity_015: P.X4_opacity_015, THIN_1PX: P.THIN_1PX } as any;
      const a = await edgeGate(page, { subject, edge, plants: pick, thick: 1.5 });
      const d = await edgeGate(page, { subject, edge, plants: null });
      out.push(`${info.project.name} ${rg.name} ${scheme} lane(thick1.5): clean ${a.clean.red ? 'RED' : 'GREEN'} ${fmt(a.clean)} :: ${Object.entries(a.plants).map(([k, r]) => `${k}=${r.red ? 'RED' : 'GREEN'}`).join(' ')} || default(thick2): ${d.clean.red ? 'RED' : 'GREEN'} ${d.clean.why.join('; ').slice(0, 300)}`);
    } catch (e) {
      out.push(`${info.project.name} ${rg.name} ${scheme} ERROR ${String(e).slice(0, 300)}`);
    }
    await ctx.close();
  }
  console.log('CRITIC-REGIMES\n' + out.join('\n'));
});

test('CRITIC forgive', async ({ browser }, info) => {
  test.setTimeout(600000);
  const out: string[] = [];
  // each case: tap the mark, then within the 350 ms window a SECOND activation of a kind the guard forgives
  const cases = ['presslessClick100', 'keyEnter100', 'mouseClick100'] as const;
  for (const kind of cases) for (const withheld of [false, true]) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
    if (withheld)
      await ctx.addInitScript(() =>
        addEventListener('click', (e) => { if (e.isTrusted && (e as PointerEvent).pointerType === 'touch') e.stopImmediatePropagation(); }, { capture: true }),
      );
    const page = await ctx.newPage();
    try {
      await page.goto(SOLO);
      await settled(page);
      await mark(page).evaluate((el) => {
        const seen: string[] = [el.getAttribute('aria-expanded')!];
        (window as any).__states = seen;
        new MutationObserver(() => { const v = el.getAttribute('aria-expanded')!; if (v !== seen[seen.length - 1]) seen.push(v); }).observe(el, { attributes: true });
      });
      const states = () => page.evaluate(() => (window as any).__states as string[]);
      await mark(page).tap();
      const t0 = Date.now();
      await page.waitForTimeout(100);
      if (kind === 'presslessClick100') await mark(page).evaluate((el) => (el as HTMLElement).click());
      else if (kind === 'keyEnter100') { await mark(page).focus(); await page.keyboard.press('Enter'); }
      else { const b = (await mark(page).boundingBox())!; await page.mouse.click(b.x + b.width / 2, b.y + b.height / 2); }
      const dt = Date.now() - t0;
      await stable(states);
      out.push(`${info.project.name} ${kind} withheld=${withheld} +${dt}ms states=${JSON.stringify(await states())}`);
    } catch (e) { out.push(`${info.project.name} ${kind} withheld=${withheld} ERROR ${String(e).slice(0, 160)}`); }
    await ctx.close();
  }
  console.log('CRITIC-FORGIVE\n' + out.join('\n'));
});
