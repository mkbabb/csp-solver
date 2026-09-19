/**
 * NOTE-ERASE pass 2 · A — THE VERB AND THE AGE.
 *   A1  the exit exists (G1) + the frame bar is the engine's (G14) + PRM (G7)
 *   A2  the settle by painted bytes, cross-checked against the computed colour (G2)
 *       + verdicts never settle (G3), `is-quiet` asserted first
 */
import { test, expect } from "@playwright/test";
import {
  armHint,
  bank,
  boardReady,
  paintedBytes,
  readNote,
  refuseAGiven,
  say,
  traceRetraction,
} from "./lib";

test("A1 the rub-out on the whisper rung, frame-traced (G1, G7, G14)", async ({
  page,
  browserName,
}) => {
  const rows: unknown[] = [];
  for (const [vp, w, h] of [
    ["phone 390x844", 390, 844],
    ["desk 1280x800", 1280, 800],
  ] as const) {
    for (const prm of [false, true]) {
      await page.setViewportSize({ width: w, height: h });
      await page.emulateMedia({
        reducedMotion: prm ? "reduce" : "no-preference",
        colorScheme: "light",
      });
      await boardReady(page);
      const armed = await armHint(page);
      const trace = traceRetraction(page, prm ? 400 : 800);
      await page.waitForTimeout(40);
      await page.keyboard.press("5"); // the reader's own ink — retracts the hint
      const t = await trace;
      const leaveFrames = t.samples.filter((s) => s.leaving);
      const distinctClip = new Set(leaveFrames.map((s) => s.clip)).size;
      // `animationDuration` is a LIST (two keyframes on one element) — take the first.
      const rub =
        Number((t.leaveDuration ?? "0s").split(",")[0].trim().replace("s", "")) * 1000;
      const bar = t.medianRafMs > 0 ? Math.floor(rub / t.medianRafMs) : null;
      rows.push({
        viewport: vp,
        prm,
        armedText: (armed as { text?: string } | null)?.text,
        rungs: (armed as { rungs?: unknown } | null)?.rungs,
        leaveSeen: t.leaveSeen,
        leaveAnimation: t.leaveAnimation,
        leaveDuration: t.leaveDuration,
        leaveEasing: t.leaveEasing,
        medianRafMs: t.medianRafMs,
        frameBar: bar,
        distinctClipStates: distinctClip,
        distinctOpacityStates: new Set(leaveFrames.map((s) => s.opacity)).size,
        clearsFrameBar: bar === null ? null : distinctClip >= bar,
        leaveFrames: leaveFrames.length,
        absentAtMs: t.absentAtMs,
        reappearedAfterAbsent: t.reappearedAfterAbsent,
        anyFilter: t.samples.some((s) => s.filter !== "none"),
        anyTransform: t.samples.some((s) => s.transform !== "none"),
        dirtyAncestors: t.dirtyAncestors,
        clipHead: leaveFrames.slice(0, 3).map((s) => `${s.t}:${s.clip}`),
        clipTail: leaveFrames.slice(-2).map((s) => `${s.t}:${s.clip}`),
        animNameDuringLeave: [...new Set(leaveFrames.map((s) => s.anim))],
      });
    }
  }
  bank(`a1-exit-${browserName}.json`, { engine: browserName, rows });
  say("A1", rows);
  expect(rows.length).toBe(4);
});

test("A2 the settle and the verdicts, painted + cross-checked (G2, G3)", async ({
  page,
  browserName,
}) => {
  const rows: unknown[] = [];
  for (const scheme of ["light", "dark"] as const) {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ reducedMotion: "no-preference", colorScheme: scheme });
    await boardReady(page);
    await page.evaluate(() => {
      const inputs = Array.from(
        document.querySelectorAll(".game-cell input"),
      ) as HTMLInputElement[];
      inputs.find((i) => !i.value)?.focus();
    });
    const clock = page.evaluate(() => {
      const t0 = performance.now();
      return new Promise<{ textAtMs: number; settledAtMs: number | null }>((res) => {
        let textAt = -1;
        let settledAt: number | null = null;
        const poll = () => {
          const ink = document.querySelector<HTMLElement>(".margin-note-ink");
          if (ink && textAt < 0 && (ink.textContent || "").trim())
            textAt = performance.now() - t0;
          if (ink && settledAt === null && ink.getAttribute("data-note-age") === "settled")
            settledAt = performance.now() - t0;
          if (performance.now() - t0 > 2600)
            res({
              textAtMs: Math.round(textAt),
              settledAtMs: settledAt === null ? null : Math.round(settledAt),
            });
          else requestAnimationFrame(poll);
        };
        requestAnimationFrame(poll);
      });
    });
    await page.keyboard.press("h");
    await page.waitForTimeout(1017); // 8 beats + 1 frame
    const atSettlePlusFrame = await readNote(page);
    const paintedAtSettlePlusFrame = await paintedBytes(page, null);
    await page.waitForTimeout(700); // the dusk step complete
    const settledSteady = await readNote(page);
    const paintedSettled = await paintedBytes(
      page,
      browserName === "chromium" ? `settled-390-${scheme}` : null,
    );
    const clockRead = await clock;
    await boardReady(page);
    await page.evaluate(() => {
      const inputs = Array.from(
        document.querySelectorAll(".game-cell input"),
      ) as HTMLInputElement[];
      inputs.find((i) => !i.value)?.focus();
    });
    await page.keyboard.press("h");
    await page.waitForTimeout(500);
    const fresh = await readNote(page);
    const paintedFresh = await paintedBytes(page, null);
    rows.push({
      scheme,
      clock: clockRead,
      fresh,
      paintedFresh,
      atSettlePlusFrame,
      paintedAtSettlePlusFrame,
      settledSteady,
      paintedSettled,
    });
  }

  // THE VERDICTS — the same eight beats, on kinds that must not age.
  const verdicts: unknown[] = [];
  for (const scheme of ["light", "dark"] as const) {
    await page.emulateMedia({ reducedMotion: "no-preference", colorScheme: scheme });
    await boardReady(page);
    await refuseAGiven(page);
    await page.waitForTimeout(1030); // 8 beats + 1 frame
    const red = await readNote(page);
    const redPainted = await paintedBytes(page, null);
    await page.waitForTimeout(600);
    const redLater = await readNote(page);
    const redLaterPainted = await paintedBytes(page, null);
    await boardReady(page);
    await page
      .getByRole("button", { name: /^solve/i })
      .first()
      .click({ timeout: 6000 })
      .catch(() => {});
    await page.waitForTimeout(3200);
    const goldArrival = await readNote(page);
    await page.waitForTimeout(1200);
    const gold = await readNote(page);
    // past the star: `.note-star` is `overflow: visible`, so the crop starts at its RIGHT edge
    const goldPainted = await paintedBytes(page, null, true);
    verdicts.push({
      scheme,
      red,
      redPainted,
      redLater,
      redLaterPainted,
      goldArrival,
      gold,
      goldPainted,
    });
  }
  bank(`a2-settle-${browserName}.json`, { engine: browserName, rows, verdicts });
  say("A2", { rows, verdicts });
  expect(rows.length).toBe(2);
});
