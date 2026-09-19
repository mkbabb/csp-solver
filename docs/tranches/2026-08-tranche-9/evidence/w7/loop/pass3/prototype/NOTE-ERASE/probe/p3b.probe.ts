/**
 * NOTE-ERASE pass 3 · P3B — the three readings the first run could not make honestly.
 *
 *   P5  the drop clock, measured FROM THE PRESS (P1 timed from the trace's own t0, which
 *       carried a 40 ms pre-roll; the number that matters is press → node gone)
 *   P6  the rest pose, negative control at the RIGHT specificity. The first control injected
 *       a page-level rule (0,3,0) against a SCOPED rule (0,4,0) and lost — it proved nothing.
 *       `!important` is what "these two rules are not here" actually looks like.
 *   P7  the deal repeat on the board's own voice: the deal button is ARMED (two presses).
 */
import { test, expect } from "@playwright/test";
import { armHint, bank, boardReady, refuseAGiven, say } from "./lib";

type Page = import("@playwright/test").Page;

/** Trace the ink span, with t = 0 at THE PRESS (the page marks it). */
function traceFromPress(page: Page, ms = 700) {
  return page.evaluate((ms) => {
    return new Promise<{
      pressAtMs: number | null;
      medianRafMs: number;
      leaveAnimation: string | null;
      leaveAnimDuration: string | null;
      leaveTransitionDuration: string | null;
      leaveAge: string | null;
      goneAtMsFromPress: number | null;
      restoredInkFrames: number;
      distinctClipStates: number;
      lastPresentFromPress: { t: number; clip: string; opacity: string } | null;
    }>((res) => {
      const t0 = performance.now();
      const w = window as unknown as { __nePress?: number };
      w.__nePress = undefined;
      const ticks: number[] = [];
      const rows: { t: number; clip: string; opacity: string; leaving: boolean }[] = [];
      let last = t0;
      let leaveAnimation: string | null = null;
      let leaveAnimDuration: string | null = null;
      let leaveTransitionDuration: string | null = null;
      let leaveAge: string | null = null;
      let goneAt: number | null = null;
      const tick = () => {
        const now = performance.now();
        ticks.push(now - last);
        last = now;
        const el = document.querySelector<HTMLElement>(".margin-note-ink");
        if (el) {
          const cs = getComputedStyle(el);
          const leaving = el.classList.contains("note-leave-active");
          if (leaving && leaveAnimation === null) {
            leaveAnimation = cs.animationName;
            leaveAnimDuration = cs.animationDuration;
            leaveTransitionDuration = cs.transitionDuration;
            leaveAge = el.getAttribute("data-note-age");
          }
          rows.push({ t: now, clip: cs.clipPath, opacity: cs.opacity, leaving });
        } else if (goneAt === null && w.__nePress !== undefined) {
          goneAt = now;
        }
        if (performance.now() - t0 > ms) {
          const p = w.__nePress ?? null;
          const sorted = ticks.slice(1).sort((a, b) => a - b);
          const rel = (x: number | null) =>
            x === null || p === null ? null : Math.round((x - p) * 10) / 10;
          const leaveRows = rows.filter((r) => r.leaving);
          const rub =
            Number((leaveAnimDuration ?? "0s").split(",")[0].trim().replace("s", "")) *
            1000;
          const afterVerb =
            p === null ? [] : leaveRows.filter((r) => r.t - p >= rub && rub > 0);
          const lastRow = leaveRows[leaveRows.length - 1] ?? null;
          res({
            pressAtMs: p === null ? null : Math.round((p - t0) * 10) / 10,
            medianRafMs:
              Math.round((sorted[Math.floor(sorted.length / 2)] ?? 0) * 10) / 10,
            leaveAnimation,
            leaveAnimDuration,
            leaveTransitionDuration,
            leaveAge,
            goneAtMsFromPress: rel(goneAt),
            restoredInkFrames: afterVerb.filter(
              (r) => r.clip === "none" && Number(r.opacity) > 0.5,
            ).length,
            distinctClipStates: new Set(leaveRows.map((r) => r.clip)).size,
            lastPresentFromPress: lastRow
              ? {
                  t: rel(lastRow.t) ?? -1,
                  clip: lastRow.clip,
                  opacity: lastRow.opacity,
                }
              : null,
          });
        } else requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }, ms);
}

const markPress = (page: Page) =>
  page.evaluate(() => {
    (window as unknown as { __nePress?: number }).__nePress = performance.now();
  });

test("P5 the drop clock, from the press (G1)", async ({ page, browserName }) => {
  const rows: unknown[] = [];
  for (const age of ["fresh", "settled"] as const) {
    for (const prm of [false, true] as const) {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.emulateMedia({
        reducedMotion: prm ? "reduce" : "no-preference",
        colorScheme: "light",
      });
      await boardReady(page);
      await armHint(page);
      if (age === "settled") await page.waitForTimeout(1100);
      const trace = traceFromPress(page, prm ? 350 : 700);
      await page.waitForTimeout(40);
      await markPress(page);
      await page.keyboard.press("5");
      const t = await trace;
      const rub =
        Number((t.leaveAnimDuration ?? "0s").split(",")[0].trim().replace("s", "")) *
        1000;
      rows.push({
        age,
        prm,
        ...t,
        withinWhisperPlusFrame:
          t.goneAtMsFromPress !== null &&
          t.goneAtMsFromPress <= rub + (t.medianRafMs || 17) * 2,
      });
    }
  }
  bank(`p5-dropclock-${browserName}.json`, { engine: browserName, rows });
  say("P5", rows);
  expect(rows.length).toBe(4);
});

test("P6 the rest pose, negative control at the right rank (G2)", async ({
  page,
  browserName,
}) => {
  const rows: unknown[] = [];
  for (const control of ["as built", "rest pose REMOVED", "both REMOVED"] as const) {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ reducedMotion: "no-preference", colorScheme: "light" });
    await boardReady(page);
    if (control !== "as built") {
      // A SCOPED rule is (0,4,0); a page-level rule of the same shape loses. `!important` is
      // what the absence of these two rules actually looks like from the cascade's seat.
      const css =
        control === "rest pose REMOVED"
          ? ".note-leave-to{clip-path:none !important;opacity:1 !important}"
          : ".note-leave-to{clip-path:none !important;opacity:1 !important}" +
            ".margin-note-ink[data-note-age]{transition:color 350ms !important}";
      await page.addStyleTag({ content: css });
    }
    await armHint(page);
    await page.waitForTimeout(1100); // SETTLED — the age rule is on the element
    const trace = traceFromPress(page, 900);
    await page.waitForTimeout(40);
    await markPress(page);
    await page.keyboard.press("5");
    const t = await trace;
    rows.push({ control, ...t });
  }
  bank(`p6-restpose-${browserName}.json`, { engine: browserName, rows });
  say("P6", rows);
  expect(rows.length).toBe(3);
});

test("P7 the deal repeat on the board's voice (G6)", async ({ page, browserName }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.emulateMedia({ reducedMotion: "no-preference", colorScheme: "light" });
  await boardReady(page);

  const deal = async () => {
    const b = page.getByRole("button", { name: /deal a new board/i }).first();
    await b.click({ timeout: 8000 });
    // The act is ARMED: the first press asks, the second deals.
    await page.waitForTimeout(150);
    await page
      .getByRole("button", { name: /press again to deal/i })
      .first()
      .click({ timeout: 4000 })
      .catch(() => {});
  };
  await deal();
  await page.waitForTimeout(2600);

  const watch = page.evaluate(() => {
    const t0 = performance.now();
    const node = () =>
      Array.from(document.querySelectorAll<HTMLElement>('[aria-live="polite"]')).filter(
        (n) => !n.classList.contains("margin-note"),
      )[0];
    const trail: { t: number; text: string }[] = [
      { t: 0, text: (node()?.textContent || "").replace(/\s+/g, " ").trim() },
    ];
    return new Promise<{ t: number; text: string }[]>((res) => {
      const poll = () => {
        const t = Math.round((performance.now() - t0) * 10) / 10;
        const now = (node()?.textContent || "").replace(/\s+/g, " ").trim();
        if (now !== trail[trail.length - 1].text) trail.push({ t, text: now });
        if (performance.now() - t0 > 4200) res(trail);
        else requestAnimationFrame(poll);
      };
      requestAnimationFrame(poll);
    });
  });
  await deal(); // the SAME board size and difficulty → the identical sentence
  const trail = await watch;
  const i = trail.findIndex((r, k) => k > 0 && r.text === "");
  const out = {
    engine: browserName,
    trail,
    shape: trail.map((r) => (r.text === "" ? "''" : "X")).join(","),
    holeMs:
      i >= 0 && i + 1 < trail.length
        ? Math.round((trail[i + 1].t - trail[i].t) * 10) / 10
        : null,
  };
  bank(`p7-voice-${browserName}.json`, out);
  say("P7", out);
  expect(trail.length).toBeGreaterThan(0);
});

test("P8 the hold and the park, both engines (G9, G10, G17)", async ({
  page,
  browserName,
}) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.emulateMedia({ reducedMotion: "no-preference", colorScheme: "light" });
  await boardReady(page);

  // THE HOLD. `refusalHoldBeats` × `beatMs` = 3000. Present at 23 beats, gone after 24.
  await refuseAGiven(page);
  const readText = () =>
    page.evaluate(() =>
      (document.querySelector(".margin-note")?.textContent || "")
        .replace(/\s+/g, " ")
        .trim(),
    );
  await page.waitForTimeout(2875); // 23 beats
  const at23 = await readText();
  await page.waitForTimeout(125 + 150 + 40); // + 1 beat + whisper + a frame
  const afterHold = await readText();

  // REFUSAL vs PEER, asserted INSIDE the hold. A peer's write must not take the reply.
  await boardReady(page, "?size=3&difficulty=EASY&wire=local");
  await refuseAGiven(page);
  await page.waitForTimeout(400);
  const replyBeforePeer = await readText();
  const peerOk = await page.evaluate(() => {
    const w = window as unknown as {
      __sudokuSession?: { applyValue?: (p: number, v: number, s: boolean) => void };
    };
    const s = w.__sudokuSession;
    if (!s?.applyValue) return false;
    s.applyValue(60, 7, false);
    return true;
  });
  await page.waitForTimeout(300);
  const replyAfterPeer = await readText();

  bank(`p8-hold-${browserName}.json`, {
    engine: browserName,
    hold: { at23Beats: at23, afterHoldPlusWhisper: afterHold },
    peer: { wireReachable: peerOk, replyBeforePeer, replyAfterPeer },
  });
  say("P8", { at23, afterHold, peerOk, replyBeforePeer, replyAfterPeer });
  expect(at23.length).toBeGreaterThan(0);
});
