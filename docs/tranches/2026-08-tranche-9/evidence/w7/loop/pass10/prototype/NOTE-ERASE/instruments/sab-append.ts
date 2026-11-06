
// ── SAB (NOTE-ERASE pass-10 scratch, never banked): the teeth, clause by clause ───────────────
// A hook that writes a NEAR-bound length in place of 0s on the ghost still leave (the pass-9
// critic's plant, widened): the WHOLE gate must red each, and each clause's own verdict is logged.
for (const near of [17, 33, 50, 100, 140, 149])
  test(`SAB near-bound write ${near}ms on the ghost still leave`, async ({ page }) => {
    await page.addInitScript(`(() => {
      const real = CSSStyleDeclaration.prototype.setProperty;
      CSSStyleDeclaration.prototype.setProperty = function (p, v, pr) {
        if (p === 'animation-duration' && v === '0s') v = '${near}ms';
        return real.call(this, p, v, pr);
      };
    })();`);
    const leave = await redLineLeaves(page, (p) =>
      p
        .addStyleTag({ content: `.margin-note-ink.note-leave-active { animation-name: ${GHOST} !important; }` })
        .then(() => undefined),
    );
    const durIs0s = leave.animationDuration === '0s';
    const frames = leave.painted <= ZERO_LEAVE_FRAMES;
    const timeOld = leave.ms < MOTION.rungs.whisper;
    console.log(
      `SAB|${near}|dur=${leave.animationDuration}|ms=${leave.ms}|conn=${leave.painted}|vis=${leave.visible}|durIs0s=${durIs0s ? 'GREEN' : 'RED'}|frames<=2=${frames ? 'GREEN' : 'RED'}|struck time<150=${timeOld ? 'GREEN' : 'RED'}`,
    );
    expect(zeroLengthLeave(leave)).toBe(false);
  });
