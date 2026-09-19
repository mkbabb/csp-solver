/**
 * NOTE-ERASE pass 2 · B — THE TRAJECTORY, THE CLOCK, THE PARK.
 *   B1  the repeat speaks, as a TRAJECTORY (G6): a MutationObserver on the region, textContent
 *       read INSIDE each callback, the same given refused twice → [X, "", X]
 *   B2  the reply leaves (G5): present at 23 beats, gone by 24 + whisper + 1 frame; a second
 *       refusal at beat 12 restarts the clock
 *   B3  the park, per kind (G9): a record survives g + cancel at the same box; a reply is ""
 *       within one rub-out OF THE PARK, not at the hold; g then Deal → ""
 */
import { test, expect } from "@playwright/test";
import { armHint, bank, boardReady, readNote, refuseAGiven, say } from "./lib";

const BEAT = 125;
const WHISPER = 150;

test("B1 the repeat speaks, as a trajectory (G6)", async ({ page, browserName }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "no-preference", colorScheme: "light" });
  await boardReady(page);

  // The observer is armed BEFORE the first refusal and reads textContent inside the callback:
  // a poll cannot see a hole shorter than its interval, and the hole is one rub-out wide.
  const watcher = page.evaluate(() => {
    const region = document.querySelector(".margin-note");
    if (!region) return Promise.resolve({ error: "no region" });
    const t0 = performance.now();
    const seen: { t: number; text: string }[] = [];
    const anims: { t: number; name: string }[] = [];
    document.addEventListener(
      "animationstart",
      (e) => {
        const a = e as AnimationEvent;
        if ((e.target as HTMLElement)?.classList?.contains("margin-note-ink"))
          anims.push({ t: Math.round(performance.now() - t0), name: a.animationName });
      },
      true,
    );
    const obs = new MutationObserver(() => {
      const text = (region.textContent || "").replace(/\s+/g, " ").trim();
      const last = seen[seen.length - 1];
      if (!last || last.text !== text)
        seen.push({ t: Math.round(performance.now() - t0), text });
    });
    obs.observe(region, { childList: true, characterData: true, subtree: true });
    return new Promise<{ seen: { t: number; text: string }[]; anims: unknown[] }>(
      (res) => {
        setTimeout(() => {
          obs.disconnect();
          res({ seen, anims });
        }, 3000);
      },
    );
  });
  await page.waitForTimeout(60);
  const idx = await refuseAGiven(page, "5");
  await page.waitForTimeout(900);
  const afterFirst = await readNote(page);
  await page.locator(".game-cell input").nth(idx).click();
  await page.keyboard.press("5"); // the SAME sentence, a second time
  const result = (await watcher) as { seen: { t: number; text: string }[]; anims: unknown[] };
  const trail = result.seen.map((s) => s.text);
  const sentence = "that's a given clue";
  const first = trail.indexOf(sentence);
  const emptyAfter = trail.findIndex((t, i) => i > first && t === "");
  const second = trail.findIndex((t, i) => i > emptyAfter && t === sentence);
  const row = {
    engine: browserName,
    trail,
    timestamps: result.seen,
    animations: result.anims,
    rubOutStarts: (result.anims as { name: string }[]).filter(
      (a) => a.name === "ink-rub-out",
    ).length,
    trajectoryIsXEmptyX: first >= 0 && emptyAfter > first && second > emptyAfter,
    afterFirst,
    afterSecond: await readNote(page),
  };
  bank(`b1-repeat-${browserName}.json`, row);
  say("B1", row);
  expect(trail.length).toBeGreaterThan(0);
});

test("B2 the reply leaves, and a second refusal restarts it (G5)", async ({
  page,
  browserName,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "no-preference", colorScheme: "light" });

  // ARM 1 — one refusal, walked across the hold.
  await boardReady(page);
  const t0 = Date.now();
  await refuseAGiven(page, "5");
  const marks: Record<string, unknown> = {};
  const at = async (beats: number, extraMs = 0, label?: string) => {
    const want = t0 + beats * BEAT + extraMs;
    const wait = want - Date.now();
    if (wait > 0) await page.waitForTimeout(wait);
    const n = await readNote(page);
    marks[label ?? `beat${beats}`] = {
      atMs: Date.now() - t0,
      text: n?.text,
      inkPresent: n?.inkPresent,
      leaving: await page.evaluate(
        () => !!document.querySelector(".margin-note-ink.note-leave-active"),
      ),
    };
  };
  await at(23);
  await at(24, 20);
  await at(24, WHISPER + 40, "afterHoldPlusWhisper");

  // ARM 2 — a second refusal at beat 12 restarts the clock from there.
  await boardReady(page);
  const s0 = Date.now();
  await refuseAGiven(page, "5");
  const second: Record<string, unknown> = {};
  const sAt = async (beats: number, extraMs = 0, label?: string) => {
    const want = s0 + beats * BEAT + extraMs;
    const wait = want - Date.now();
    if (wait > 0) await page.waitForTimeout(wait);
    const n = await readNote(page);
    second[label ?? `beat${beats}`] = {
      atMs: Date.now() - s0,
      text: n?.text,
      inkPresent: n?.inkPresent,
    };
  };
  const waitTo12 = s0 + 12 * BEAT - Date.now();
  if (waitTo12 > 0) await page.waitForTimeout(waitTo12);
  await refuseAGiven(page, "5"); // the second attempt — restarts the hold at ~beat 12
  await sAt(30);
  await sAt(35);
  await sAt(36, WHISPER + 60, "beat36PlusWhisper");

  const row = { engine: browserName, oneRefusal: marks, twoRefusals: second };
  bank(`b2-hold-${browserName}.json`, row);
  say("B2", row);
  expect(Object.keys(marks).length).toBe(3);
});

test("B3 the park, per kind (G9a, G9b)", async ({ page, browserName }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.emulateMedia({ reducedMotion: "no-preference", colorScheme: "light" });

  // G9a — a RECORD under the park, and back.
  await boardReady(page);
  const armed = await armHint(page);
  // App.vue:786 — `g` is ignored while focus is in an input, so the park needs a blur first.
  await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
  await page.waitForTimeout(120);
  await page.keyboard.press("g");
  await page.waitForTimeout(900);
  const parkedRecord = await readNote(page);
  const parkedView = await page.evaluate(() => ({
    gallery: !!document.querySelector(".game-gallery, .gallery-deck"),
    liveFaceFit: !!document.querySelector(".live-face-fit"),
  }));
  const parkedPaint = await page.evaluate(() => {
    const ink = document.querySelector<HTMLElement>(".margin-note-ink");
    if (!ink) return null;
    const cs = getComputedStyle(ink);
    const r = ink.getBoundingClientRect();
    const r1 = (x: number) => Math.round(x * 100) / 100;
    return {
      fontSizePx: cs.fontSize,
      effectivePx: r1(r.height),
      box: { w: r1(r.width), h: r1(r.height) },
      visible: ink.checkVisibility?.() ?? null,
      rects: ink.getClientRects().length,
      offsetParent: !!ink.offsetParent,
    };
  });
  await page.keyboard.press("Escape");
  await page.waitForTimeout(1200);
  const backRecord = await readNote(page);

  // G9b — a REPLY under the park: gone within ONE rub-out of `g`, not at the hold.
  await boardReady(page);
  await refuseAGiven(page, "5");
  await page.waitForTimeout(700);
  const replyBefore = await readNote(page);
  await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
  await page.waitForTimeout(120);
  // The clock reads BOTH moments: `g` starts a page turn, and the board is not parked until
  // the fold puts it in the card. The gate is one rub-out OF THE PARK, not of the keystroke.
  const parkClock = page.evaluate(() => {
    const t0 = performance.now();
    return new Promise<{
      emptyAtMs: number | null;
      parkedAtMs: number | null;
      leaveSeenAtMs: number | null;
    }>((res) => {
      let parkedAt: number | null = null;
      let leaveAt: number | null = null;
      const poll = () => {
        const now = Math.round(performance.now() - t0);
        if (parkedAt === null && document.querySelector(".live-face-fit")) parkedAt = now;
        if (leaveAt === null && document.querySelector(".margin-note-ink.note-leave-active"))
          leaveAt = now;
        const region = document.querySelector(".margin-note");
        const text = (region?.textContent || "").replace(/\s+/g, " ").trim();
        if (!text)
          return res({ emptyAtMs: now, parkedAtMs: parkedAt, leaveSeenAtMs: leaveAt });
        if (performance.now() - t0 > 4000)
          return res({ emptyAtMs: null, parkedAtMs: parkedAt, leaveSeenAtMs: leaveAt });
        requestAnimationFrame(poll);
      };
      requestAnimationFrame(poll);
    });
  });
  await page.keyboard.press("g");
  const parkTiming = await parkClock;
  const replyAfterPark = await readNote(page);
  await page.keyboard.press("Escape");
  await page.waitForTimeout(1200);
  const replyBack = await readNote(page);

  // `g` then DEAL — the reply cannot come back on a new board.
  await boardReady(page);
  await refuseAGiven(page, "5");
  await page.waitForTimeout(600);
  await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
  await page.waitForTimeout(120);
  await page.keyboard.press("g");
  await page.waitForTimeout(700);
  const dealBtn = page.locator('button[aria-label="Deal a new board"]').first();
  const dealVisible = await dealBtn.isVisible().catch(() => false);
  if (dealVisible) await dealBtn.click();
  await page.waitForTimeout(2200);
  const afterDeal = await readNote(page);

  const row = {
    engine: browserName,
    parkedView,
    g9aRecord: {
      armed,
      parked: parkedRecord,
      parkedPaint,
      back: backRecord,
      sameSentence: armed?.text === backRecord?.text,
      sameBox:
        armed && backRecord
          ? Math.abs(armed.box.w - backRecord.box.w) < 1 &&
            Math.abs(armed.box.h - backRecord.box.h) < 1
          : null,
    },
    g9bReply: {
      before: replyBefore,
      emptyAtMsAfterKeypress: parkTiming.emptyAtMs,
      parkedAtMs: parkTiming.parkedAtMs,
      leaveSeenAtMs: parkTiming.leaveSeenAtMs,
      msFromParkToEmpty:
        parkTiming.emptyAtMs !== null && parkTiming.parkedAtMs !== null
          ? parkTiming.emptyAtMs - parkTiming.parkedAtMs
          : null,
      withinOneRubOutOfThePark:
        parkTiming.emptyAtMs !== null && parkTiming.parkedAtMs !== null
          ? parkTiming.emptyAtMs - parkTiming.parkedAtMs <= WHISPER + 34
          : false,
      after: replyAfterPark,
      back: replyBack,
    },
    parkThenDeal: { dealVisible, after: afterDeal },
  };
  bank(`b3-park-${browserName}.json`, row);
  say("B3", row);
  expect(row.g9aRecord.armed).not.toBeNull();
});
