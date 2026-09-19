/**
 * NOTE-ERASE pass 3 · P3 — THE SETTLED EXIT, THE REST POSE, THE HONEST CLOCK, THE REPEAT.
 *
 * Pass 2's fresh exit was green and its SETTLED exit was broken twice over: Vue took the
 * 350ms colour settle as the leave's clock, and the rub-out (no fill, correctly) released
 * into a cascade that stood the line back up. This probe measures both defects directly.
 *
 *   P1  the exit, FRESH and SETTLED (G1, G14, G16)
 *   P2  the rest pose, with the compound selector removed as a negative control (G2)
 *   P3  the repeat, one beat wide, on the margin AND on the board's voice (G6)
 *   P4  PRM live at the site (G4)
 */
import { test, expect } from "@playwright/test";
import {
  armHint,
  bank,
  boardReady,
  readNote,
  refuseAGiven,
  say,
  traceRetraction,
} from "./lib";

/** A rAF-sampled trace that also records the computed TRANSITION duration while leaving —
 *  the number that decides when Vue drops the node — and every clip value after the verb. */
function traceLeave(page: import("@playwright/test").Page, ms = 900) {
  return page.evaluate((ms) => {
    return new Promise<{
      medianRafMs: number;
      leaveSeen: boolean;
      leaveAnimation: string | null;
      leaveAnimDuration: string | null;
      leaveTransitionDuration: string | null;
      leaveAge: string | null;
      absentAtMs: number | null;
      reappearedAfterAbsent: boolean;
      distinctClipStates: number;
      leaveFrames: number;
      restoredInkFrames: number;
      lastPresentSample: { t: number; clip: string; opacity: string } | null;
      postVerbNoneFrames: number;
      anyFilter: boolean;
      anyTransform: boolean;
      samples: {
        t: number;
        clip: string;
        opacity: string;
        anim: string;
        leaving: boolean;
      }[];
    }>((res) => {
      const t0 = performance.now();
      const samples: {
        t: number;
        clip: string;
        opacity: string;
        anim: string;
        leaving: boolean;
      }[] = [];
      const ticks: number[] = [];
      let leaveSeen = false;
      let leaveAnimation: string | null = null;
      let leaveAnimDuration: string | null = null;
      let leaveTransitionDuration: string | null = null;
      let leaveAge: string | null = null;
      let absentAtMs: number | null = null;
      let reappeared = false;
      let anyFilter = false;
      let anyTransform = false;
      let last = t0;
      const tick = () => {
        const now = performance.now();
        ticks.push(now - last);
        last = now;
        const t = Math.round((now - t0) * 10) / 10;
        const el = document.querySelector<HTMLElement>(".margin-note-ink");
        if (el) {
          if (absentAtMs !== null) reappeared = true;
          const cs = getComputedStyle(el);
          const leaving = el.classList.contains("note-leave-active");
          if (leaving && !leaveSeen) {
            leaveSeen = true;
            leaveAnimation = cs.animationName;
            leaveAnimDuration = cs.animationDuration;
            leaveTransitionDuration = cs.transitionDuration;
            leaveAge = el.getAttribute("data-note-age");
          }
          if (cs.filter !== "none") anyFilter = true;
          if (cs.transform !== "none") anyTransform = true;
          samples.push({
            t,
            clip: cs.clipPath,
            opacity: cs.opacity,
            anim: cs.animationName,
            leaving,
          });
        } else if (absentAtMs === null) {
          absentAtMs = t;
        }
        if (performance.now() - t0 > ms) {
          const sorted = ticks.slice(1).sort((a, b) => a - b);
          const leaveFrames = samples.filter((s) => s.leaving);
          // THE DEFECT, COUNTED. After the rub-out's own length, any frame still on the page
          // reading an unclipped line at full opacity is the ink standing back up.
          const rub =
            Number((leaveAnimDuration ?? "0s").split(",")[0].trim().replace("s", "")) *
            1000;
          const after = leaveFrames.filter((s) => s.t >= rub);
          const restored = after.filter(
            (s) => s.clip === "none" && Number(s.opacity) > 0.5,
          );
          const present = samples[samples.length - 1] ?? null;
          res({
            medianRafMs:
              Math.round((sorted[Math.floor(sorted.length / 2)] ?? 0) * 10) / 10,
            leaveSeen,
            leaveAnimation,
            leaveAnimDuration,
            leaveTransitionDuration,
            leaveAge,
            absentAtMs,
            reappearedAfterAbsent: reappeared,
            distinctClipStates: new Set(leaveFrames.map((s) => s.clip)).size,
            leaveFrames: leaveFrames.length,
            restoredInkFrames: restored.length,
            lastPresentSample: leaveFrames.length
              ? {
                  t: leaveFrames[leaveFrames.length - 1].t,
                  clip: leaveFrames[leaveFrames.length - 1].clip,
                  opacity: leaveFrames[leaveFrames.length - 1].opacity,
                }
              : present
                ? { t: present.t, clip: present.clip, opacity: present.opacity }
                : null,
            postVerbNoneFrames: after.filter((s) => s.clip === "none").length,
            anyFilter,
            anyTransform,
            samples,
          });
        } else requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }, ms);
}

test("P1 the exit, FRESH and SETTLED (G1, G14, G16)", async ({ page, browserName }) => {
  const rows: unknown[] = [];
  for (const [vp, w, h] of [
    ["phone 390x844", 390, 844],
    ["desk 1280x800", 1280, 800],
  ] as const) {
    for (const age of ["fresh", "settled"] as const) {
      await page.setViewportSize({ width: w, height: h });
      await page.emulateMedia({
        reducedMotion: "no-preference",
        colorScheme: "light",
      });
      await boardReady(page);
      const armed = await armHint(page);
      // SETTLED: past 8 beats + 1 frame, so the dusk transition is the one on the element.
      if (age === "settled") await page.waitForTimeout(1100);
      const before = await readNote(page);
      const trace = traceLeave(page, 900);
      await page.waitForTimeout(40);
      await page.keyboard.press("5"); // the reader's own ink — retracts the hint
      const t = await trace;
      const rub =
        Number((t.leaveAnimDuration ?? "0s").split(",")[0].trim().replace("s", "")) *
        1000;
      const bar = t.medianRafMs > 0 ? Math.floor(rub / t.medianRafMs) : null;
      rows.push({
        viewport: vp,
        age,
        ageAttrAtLeave: t.leaveAge,
        armedText: (armed as { text?: string } | null)?.text,
        rungs: (before as { rungs?: unknown } | null)?.rungs,
        leaveSeen: t.leaveSeen,
        leaveAnimation: t.leaveAnimation,
        leaveAnimDuration: t.leaveAnimDuration,
        leaveTransitionDuration: t.leaveTransitionDuration,
        medianRafMs: t.medianRafMs,
        frameBar: bar,
        distinctClipStates: t.distinctClipStates,
        clearsFrameBar: bar === null ? null : t.distinctClipStates >= bar,
        leaveFrames: t.leaveFrames,
        absentAtMs: t.absentAtMs,
        goneWithinWhisperPlusFrame:
          t.absentAtMs !== null && t.absentAtMs <= rub + (t.medianRafMs || 17) + 8,
        reappearedAfterAbsent: t.reappearedAfterAbsent,
        restoredInkFrames: t.restoredInkFrames,
        postVerbNoneFrames: t.postVerbNoneFrames,
        lastPresentSample: t.lastPresentSample,
        anyFilter: t.anyFilter,
        anyTransform: t.anyTransform,
      });
    }
  }
  bank(`p1-exit-${browserName}.json`, { engine: browserName, rows });
  say("P1", rows);
  expect(rows.length).toBe(4);
});

test("P2 the rest pose, with a live negative control (G2)", async ({
  page,
  browserName,
}) => {
  const rows: unknown[] = [];
  for (const control of [false, true] as const) {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ reducedMotion: "no-preference", colorScheme: "light" });
    await boardReady(page);
    if (control) {
      // THE NEGATIVE CONTROL, live: delete the compound clock AND the rest pose by overriding
      // them at a higher order, which is what their absence would look like.
      await page.addStyleTag({
        content:
          ".margin-note-ink.note-leave-active[data-note-age]{transition:color 350ms}" +
          ".note-leave-to{clip-path:none;opacity:1}",
      });
    }
    await armHint(page);
    await page.waitForTimeout(1100); // settled
    const trace = traceLeave(page, 900);
    await page.waitForTimeout(40);
    await page.keyboard.press("5");
    const t = await trace;
    rows.push({
      control: control ? "compound selector + rest pose REMOVED" : "as built",
      leaveTransitionDuration: t.leaveTransitionDuration,
      absentAtMs: t.absentAtMs,
      restoredInkFrames: t.restoredInkFrames,
      postVerbNoneFrames: t.postVerbNoneFrames,
      lastPresentSample: t.lastPresentSample,
    });
  }
  bank(`p2-restpose-${browserName}.json`, { engine: browserName, rows });
  say("P2", rows);
  expect(rows.length).toBe(2);
});

test("P3 the repeat, one beat wide, margin AND voice (G6)", async ({
  page,
  browserName,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "no-preference", colorScheme: "light" });
  await boardReady(page);

  // THE MARGIN. Refuse the same given twice; watch the live region's text, mutation by
  // mutation, with the timestamps the AT would see.
  await refuseAGiven(page);
  await page.waitForTimeout(700);
  const marginWatch = page.evaluate(() => {
    const p = document.querySelector<HTMLElement>(".margin-note");
    const t0 = performance.now();
    const trail: { t: number; text: string }[] = [];
    const read = () => (p?.textContent || "").replace(/\s+/g, " ").trim();
    trail.push({ t: 0, text: read() });
    return new Promise<{ trail: { t: number; text: string }[]; rubOuts: number }>(
      (res) => {
        let rubOuts = 0;
        let sawLeave = false;
        const poll = () => {
          const t = Math.round((performance.now() - t0) * 10) / 10;
          const now = read();
          if (now !== trail[trail.length - 1].text) trail.push({ t, text: now });
          const leaving = !!document.querySelector(".margin-note-ink.note-leave-active");
          if (leaving && !sawLeave) {
            rubOuts += 1;
            sawLeave = true;
          }
          if (!leaving) sawLeave = false;
          if (performance.now() - t0 > 1400) res({ trail, rubOuts });
          else requestAnimationFrame(poll);
        };
        requestAnimationFrame(poll);
      },
    );
  });
  await page.waitForTimeout(30);
  await page.keyboard.press("5"); // the same given, the same refusal, a second time
  const margin = await marginWatch;

  // THE BOARD'S VOICE. Deal twice at the same size/difficulty: the identical sentence.
  await boardReady(page);
  const voiceWatch = page.evaluate(() => {
    const t0 = performance.now();
    const trail: { t: number; text: string }[] = [];
    const node = () =>
      Array.from(document.querySelectorAll<HTMLElement>('[aria-live="polite"]')).filter(
        (n) => !n.classList.contains("margin-note"),
      )[0];
    const read = () => (node()?.textContent || "").replace(/\s+/g, " ").trim();
    trail.push({ t: 0, text: read() });
    return new Promise<{ t: number; text: string }[]>((res) => {
      const poll = () => {
        const t = Math.round((performance.now() - t0) * 10) / 10;
        const now = read();
        if (now !== trail[trail.length - 1].text) trail.push({ t, text: now });
        if (performance.now() - t0 > 2600) res(trail);
        else requestAnimationFrame(poll);
      };
      requestAnimationFrame(poll);
    });
  });
  await page.waitForTimeout(30);
  await page
    .getByRole("button", { name: /deal|new board|new puzzle/i })
    .first()
    .click({ timeout: 8000 })
    .catch(() => {});
  const voice = await voiceWatch;

  const holeOf = (trail: { t: number; text: string }[]) => {
    const i = trail.findIndex((r, k) => k > 0 && r.text === "");
    if (i < 0 || i + 1 >= trail.length) return null;
    return Math.round((trail[i + 1].t - trail[i].t) * 10) / 10;
  };
  const out = {
    engine: browserName,
    margin: {
      trail: margin.trail,
      rubOutsStarted: margin.rubOuts,
      holeMs: holeOf(margin.trail),
      shape: margin.trail.map((r) => (r.text === "" ? "''" : "X")).join(","),
    },
    voice: { trail: voice, holeMs: holeOf(voice) },
  };
  bank(`p3-repeat-${browserName}.json`, out);
  say("P3", out);
  expect(margin.trail.length).toBeGreaterThan(0);
});

test("P4 PRM live at the site (G4)", async ({ page, browserName }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  await boardReady(page);
  await armHint(page);
  const fresh = await readNote(page);
  await page.waitForTimeout(1100);
  const settled = await readNote(page);
  const trace = traceLeave(page, 400);
  await page.waitForTimeout(40);
  await page.keyboard.press("5");
  const t = await trace;
  const out = {
    engine: browserName,
    freshAnimationDuration: fresh?.animationDuration,
    freshTransitionDuration: fresh?.transitionDuration,
    settledAnimationDuration: settled?.animationDuration,
    settledTransitionDuration: settled?.transitionDuration,
    settledAge: settled?.age,
    rungsUnderPRM: settled?.rungs,
    leaveSeen: t.leaveSeen,
    leaveAnimDuration: t.leaveAnimDuration,
    leaveTransitionDuration: t.leaveTransitionDuration,
    absentAtMs: t.absentAtMs,
    medianRafMs: t.medianRafMs,
    removedSameFrame: t.absentAtMs !== null && t.absentAtMs <= (t.medianRafMs || 17) + 30,
    restoredInkFrames: t.restoredInkFrames,
  };
  bank(`p4-prm-${browserName}.json`, out);
  say("P4", out);
  expect(out.engine).toBeTruthy();
});
