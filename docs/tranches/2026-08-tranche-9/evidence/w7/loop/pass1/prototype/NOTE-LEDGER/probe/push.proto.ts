/**
 * NOTE-LEDGER pass-1 PROTOTYPE — THE PUSH, measured on the product's own WAAPI FLIP.
 * Settle ≤ 250ms, travel one line box, fill 'backwards', no glyph filter or transform, and
 * PRM collapsed to a single frame.
 */
import { test, expect } from "@playwright/test";
import { boardReady, armHint, armRefusal, bank } from "./lib";

const TRACE = async () => {
  const strip = document.querySelector(".board-margin") as HTMLElement;
  const live = strip.querySelector(".margin-note") as HTMLElement;
  const waitFor = () =>
    new Promise<HTMLElement>((resolve) => {
      const tick = () => {
        const el = strip.querySelector(".margin-note-previous") as HTMLElement | null;
        if (el) resolve(el);
        else requestAnimationFrame(tick);
      };
      tick();
    });
  const mover = await waitFor();
  const t0 = performance.now();
  const frames: Array<{ t: number; y: number; color: string; boardY: number; transform: string }> =
    [];
  const board = document.querySelector(".board-wrapper") as HTMLElement;
  const anims = mover.getAnimations().map((a) => ({
    duration: (a.effect?.getTiming().duration as number) ?? null,
    easing: a.effect?.getTiming().easing ?? null,
    fill: a.effect?.getTiming().fill ?? null,
    playState: a.playState,
    keyframes: (a.effect as KeyframeEffect | undefined)?.getKeyframes?.().map((k) => ({
      transform: (k as unknown as { transform?: string }).transform,
      color: (k as unknown as { color?: string }).color,
    })),
  }));
  await new Promise<void>((resolve) => {
    const tick = () => {
      const now = performance.now() - t0;
      const r = mover.getBoundingClientRect();
      const cs = getComputedStyle(mover);
      frames.push({
        t: Math.round(now * 100) / 100,
        y: Math.round(r.y * 100) / 100,
        color: cs.color,
        transform: cs.transform,
        boardY: Math.round(board.getBoundingClientRect().y * 100) / 100,
      });
      if (now > 600) resolve();
      else requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
  const glyphs = Array.from(
    strip.querySelectorAll(".margin-note-ink, .margin-note-previous"),
  ).map((g) => {
    const cs = getComputedStyle(g);
    return {
      cls: (g as HTMLElement).className,
      filter: cs.filter,
      transform: cs.transform,
      animation: cs.animationName,
      willChange: cs.willChange,
    };
  });
  const ys = frames.map((f) => f.y);
  let settled = 0;
  for (let i = 1; i < frames.length; i++) {
    if (Math.abs(frames[i].y - frames[i - 1].y) >= 0.01) settled = frames[i].t;
  }
  return {
    anims,
    frames: frames.slice(0, 40),
    frameCount: frames.length,
    settledAtMs: settled,
    travelPx: Math.round((Math.max(...ys) - Math.min(...ys)) * 100) / 100,
    boardTravelPx:
      Math.round(
        (Math.max(...frames.map((f) => f.boardY)) - Math.min(...frames.map((f) => f.boardY))) * 100,
      ) / 100,
    maxFrameGapMs:
      Math.round(Math.max(...frames.slice(1).map((f, i) => f.t - frames[i].t)) * 100) / 100,
    colorFirst: frames[0]?.color,
    colorLast: frames[frames.length - 1]?.color,
    liveGlyphTransform: getComputedStyle(live).transform,
    glyphs,
    ease: getComputedStyle(document.documentElement).getPropertyValue("--ease-noteWrite").trim(),
    noteWriteMs: getComputedStyle(
      strip.querySelector(".margin-note-block") as HTMLElement,
    ).getPropertyValue("--note-write-ms"),
  };
};

for (const prm of [false, true]) {
  test(`PUSH — prm=${prm}`, async ({ browser, browserName }) => {
    const ctx = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 3,
      isMobile: browserName === "chromium",
      hasTouch: true,
    });
    const page = await ctx.newPage();
    await page.emulateMedia({
      reducedMotion: prm ? "reduce" : "no-preference",
      colorScheme: "light",
    });
    await boardReady(page);
    await armHint(page);
    await page.waitForTimeout(600);
    const trace = page.evaluate(TRACE);
    await page.waitForTimeout(60);
    await armRefusal(page);
    const out = await trace;
    bank(`push-prm${prm ? "1" : "0"}-${browserName}.json`, { engine: browserName, prm, ...out });
    console.log(
      `PUSH ${browserName} prm=${prm} settled=${out.settledAtMs}ms travel=${out.travelPx}px boardTravel=${out.boardTravelPx}px maxGap=${out.maxFrameGapMs}ms anims=${JSON.stringify(out.anims)} ease=${out.ease} noteWriteMs=${out.noteWriteMs} colour ${out.colorFirst} → ${out.colorLast} glyphs=${JSON.stringify(out.glyphs.map((g) => [g.filter, g.transform]))}`,
    );
    expect(out.boardTravelPx, "the board does not move during the push").toBeLessThanOrEqual(0.5);
    for (const g of out.glyphs) expect(g.filter, "no glyph filter").toBe("none");
    if (prm) {
      // A duration-0 animation is already FINISHED by the first rAF the trace can take, so
      // `getAnimations()` is empty — which is itself the reading: zero travel, one frame.
      expect(out.settledAtMs, "PRM settles in one frame").toBeLessThanOrEqual(20);
      expect(out.travelPx, "PRM travels nothing").toBe(0);
      expect(out.anims.length, "nothing is still running at the first frame").toBe(0);
    } else {
      expect(out.settledAtMs, "settled within the declared 250ms").toBeLessThanOrEqual(260);
      expect(out.anims[0]?.fill, "law 6: fill backwards").toBe("backwards");
      expect(out.anims[0]?.duration).toBe(250);
    }
    await ctx.close();
  });
}
