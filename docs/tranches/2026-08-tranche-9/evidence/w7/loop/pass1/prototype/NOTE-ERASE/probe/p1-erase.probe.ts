/**
 * T9-W7 §7 · NOTE-ERASE — PASS-1 PROTOTYPE PROBE (runs against the BUILT cure, no injection).
 *
 *   P1  the exit exists, frame-traced (G1) + the PRM immortality guard (G7)
 *   P2  the settle by painted bytes (G2) + verdicts never settle (G3)
 *   P4  the refusal's clock (G5)
 *   P5  the repeat speaks (G6)
 *   P6  arm-(b) control (E7) + the note cannot outlive its board (G9)
 *   P7  the frames
 *
 * Banks JSON under ../logs, frames under ../frames.
 */
import { test, expect, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import sharp from "sharp";

const HERE = dirname(new URL(import.meta.url).pathname);
const OUT = join(HERE, "..", "logs");
const FRAMES = join(HERE, "..", "frames");
mkdirSync(OUT, { recursive: true });
mkdirSync(FRAMES, { recursive: true });
const bank = (n: string, d: unknown) =>
  writeFileSync(join(OUT, n), JSON.stringify(d, null, 2));
const say = (k: string, v: unknown) => console.log(`P1|${k}|${JSON.stringify(v)}`);

const BOARD = "?size=3&difficulty=EASY";

async function boardReady(page: Page, query = BOARD) {
  await page.goto("./" + query);
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 40000 });
  await page.waitForSelector("path.cell-line", { state: "attached", timeout: 40000 });
  await page.waitForTimeout(1200);
}

const readNote = (page: Page) =>
  page.evaluate(() => {
    const n = document.querySelector<HTMLElement>(".margin-note");
    const ink = document.querySelector<HTMLElement>(".margin-note-ink");
    if (!n) return null;
    const cs = getComputedStyle(n);
    const ics = ink ? getComputedStyle(ink) : null;
    const r = (ink ?? n).getBoundingClientRect();
    const r1 = (x: number) => Math.round(x * 10) / 10;
    return {
      text: (n.textContent || "").replace(/\s+/g, " ").trim(),
      tone: (n.getAttribute("class") || "").replace("margin-note", "").trim(),
      inkPresent: !!ink,
      age: ink?.getAttribute("data-note-age") ?? null,
      color: ics?.color ?? cs.color,
      opacity: ics?.opacity ?? cs.opacity,
      fontSize: cs.fontSize,
      filter: ics?.filter ?? "none",
      transform: ics?.transform ?? "none",
      transitionProperty: ics?.transitionProperty ?? null,
      vars: {
        write: ink ? getComputedStyle(ink).getPropertyValue("--note-write-ms").trim() : null,
        rub: ink ? getComputedStyle(ink).getPropertyValue("--note-rub-ms").trim() : null,
        settle: ink ? getComputedStyle(ink).getPropertyValue("--note-settle-ms").trim() : null,
      },
      box: { w: r1(r.width), h: r1(r.height), x: r1(r.left), y: r1(r.top) },
      becauseCells: document.querySelectorAll(".game-cell.is-because").length,
    };
  });

async function armHint(page: Page) {
  await page.evaluate(() => {
    const inputs = Array.from(
      document.querySelectorAll(".game-cell input"),
    ) as HTMLInputElement[];
    inputs.find((i) => !i.value)?.focus();
  });
  await page.keyboard.press("h");
  await page.waitForTimeout(900);
  return readNote(page);
}

function ratio(a: number[], b: number[]) {
  const lum = (c: number[]) => {
    const f = (x: number) => {
      const v = x / 255;
      return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]);
  };
  const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
  return Math.round(((l1 + 0.05) / (l2 + 0.05)) * 100) / 100;
}

/** PAINTED BYTES — the engine's own raster of the note's box (erase.probe.ts's reader). */
async function paintedBytes(page: Page, name: string | null) {
  const box = await page.evaluate(() => {
    const ink = document.querySelector<HTMLElement>(".margin-note-ink");
    if (!ink) return null;
    const r = ink.getBoundingClientRect();
    return {
      x: Math.floor(r.left) - 2,
      y: Math.floor(r.top) - 2,
      width: Math.ceil(r.width) + 4,
      height: Math.ceil(r.height) + 4,
    };
  });
  if (!box || box.width <= 4 || box.height <= 4) return null;
  const buf = await page.screenshot({ clip: box, animations: "disabled" });
  if (name) writeFileSync(join(FRAMES, name + ".png"), buf);
  const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
  const ch = info.channels;
  const counts = new Map<string, number>();
  const lum = (r: number, g: number, b: number) => 0.2126 * r + 0.7152 * g + 0.0722 * b;
  const lums: { L: number; px: number[] }[] = [];
  for (let i = 0; i < data.length; i += ch) {
    const px = [data[i], data[i + 1], data[i + 2]];
    counts.set(px.join(","), (counts.get(px.join(",")) ?? 0) + 1);
    lums.push({ L: lum(px[0], px[1], px[2]), px });
  }
  let modal = "255,255,255";
  let best = 0;
  for (const [k, v] of counts) if (v > best) ((best = v), (modal = k));
  const paper = modal.split(",").map(Number);
  const paperL = lum(paper[0], paper[1], paper[2]);
  lums.sort((a, b) => Math.abs(b.L - paperL) - Math.abs(a.L - paperL));
  const extreme = lums[0].px;
  const p005 = lums[Math.min(lums.length - 1, Math.floor(lums.length * 0.005))].px;
  return {
    bytes: buf.length,
    devicePixels: { w: info.width, h: info.height },
    paper: `rgb(${paper.join(", ")})`,
    inkCorePx: `rgb(${extreme.join(", ")})`,
    extremeRatio: ratio(extreme, paper),
    p005Ratio: ratio(p005, paper),
    coverageP:
      Math.round(
        (lums.filter((l) => Math.abs(l.L - paperL) > 12).length / lums.length) * 1000,
      ) / 10,
  };
}

/** Start an in-page rAF trace of the ink span across a retraction; resolves after `ms`. */
function traceRetraction(page: Page, ms = 800) {
  return page.evaluate((ms) => {
    return new Promise<{
      frames: number;
      leaveSeen: boolean;
      leaveAnimation: string | null;
      leaveDuration: string | null;
      leaveEasing: string | null;
      absentAtMs: number | null;
      reappearedAfterAbsent: boolean;
      dirtyAncestors: string[];
      samples: {
        t: number;
        clip: string;
        opacity: string;
        filter: string;
        transform: string;
        anim: string;
        leaving: boolean;
      }[];
    }>((res) => {
      const t0 = performance.now();
      const samples: {
        t: number;
        clip: string;
        opacity: string;
        filter: string;
        transform: string;
        anim: string;
        leaving: boolean;
      }[] = [];
      const dirty = new Set<string>();
      let leaveSeen = false;
      let leaveAnimation: string | null = null;
      let leaveDuration: string | null = null;
      let leaveEasing: string | null = null;
      let absentAtMs: number | null = null;
      let reappeared = false;
      const tick = () => {
        const t = Math.round((performance.now() - t0) * 10) / 10;
        const el = document.querySelector<HTMLElement>(".margin-note-ink");
        if (el) {
          if (absentAtMs !== null) reappeared = true;
          const cs = getComputedStyle(el);
          const leaving = el.classList.contains("note-leave-active");
          if (leaving && !leaveSeen) {
            leaveSeen = true;
            leaveAnimation = cs.animationName;
            leaveDuration = cs.animationDuration;
            leaveEasing = cs.animationTimingFunction;
          }
          samples.push({
            t,
            clip: cs.clipPath,
            opacity: cs.opacity,
            filter: cs.filter,
            transform: cs.transform,
            anim: cs.animationName,
            leaving,
          });
          for (let n: HTMLElement | null = el; n; n = n.parentElement) {
            const c = getComputedStyle(n);
            if (c.filter !== "none" || c.transform !== "none")
              dirty.add(
                `${n.className || n.tagName}: filter=${c.filter} transform=${c.transform}`,
              );
          }
        } else if (absentAtMs === null) {
          absentAtMs = t;
        }
        if (performance.now() - t0 > ms)
          res({
            frames: samples.length,
            leaveSeen,
            leaveAnimation,
            leaveDuration,
            leaveEasing,
            absentAtMs,
            reappearedAfterAbsent: reappeared,
            dirtyAncestors: [...dirty],
            samples,
          });
        else requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }, ms);
}

// ── P1 · THE EXIT EXISTS, AND PRM DOES NOT MAKE IT IMMORTAL ──────────────────────────────
test("P1 the rub-out, frame-traced under the build (G1, G7)", async ({
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
      const distinctOpacity = new Set(leaveFrames.map((s) => s.opacity)).size;
      rows.push({
        viewport: vp,
        prm,
        armedText: (armed as { text?: string } | null)?.text,
        leaveSeen: t.leaveSeen,
        leaveAnimation: t.leaveAnimation,
        leaveDuration: t.leaveDuration,
        leaveEasing: t.leaveEasing,
        leaveFrames: leaveFrames.length,
        distinctClipStates: distinctClip,
        distinctOpacityStates: distinctOpacity,
        absentAtMs: t.absentAtMs,
        reappearedAfterAbsent: t.reappearedAfterAbsent,
        anyFilter: t.samples.some((s) => s.filter !== "none"),
        anyTransform: t.samples.some((s) => s.transform !== "none"),
        dirtyAncestors: t.dirtyAncestors,
        clipHead: leaveFrames.slice(0, 3).map((s) => `${s.t}:${s.clip}`),
        clipTail: leaveFrames.slice(-2).map((s) => `${s.t}:${s.clip}`),
        animNameDuringLeave: [...new Set(leaveFrames.map((s) => s.anim))],
        frames: t.frames,
      });
    }
  }
  bank(`p1-exit-${browserName}.json`, { engine: browserName, rows });
  say("P1", rows);
  expect(rows.length).toBe(4);
});

// ── P2 · THE SETTLE, AND THE VERDICTS THAT DO NOT ────────────────────────────────────────
test("P2 the settle and the verdicts, by painted bytes (G2, G3)", async ({
  page,
  browserName,
}) => {
  const rows: unknown[] = [];
  for (const scheme of ["light", "dark"] as const) {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ reducedMotion: "no-preference", colorScheme: scheme });
    await boardReady(page);
    // Arm with a precise clock: note the ms at which the ink text lands.
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
    // 8 beats + 1 frame after the write: the settle has just been applied, mid colour step.
    await page.waitForTimeout(1017);
    const atSettlePlusFrame = await readNote(page);
    const paintedAtSettlePlusFrame = await paintedBytes(page, null);
    // …and the steady state, 4 beats later (the colour step complete).
    await page.waitForTimeout(700);
    const settledSteady = await readNote(page);
    const paintedSettled = await paintedBytes(
      page,
      browserName === "chromium" ? `settled-390-${scheme}` : null,
    );
    const clockRead = await clock;
    // the fresh reading, from a second arm on a clean board (full pressure, pre-settle)
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

  // THE VERDICTS — the same eight beats, a tone that must not move.
  const verdicts: unknown[] = [];
  for (const scheme of ["light", "dark"] as const) {
    await page.emulateMedia({ reducedMotion: "no-preference", colorScheme: scheme });
    // teacher-red: the refusal
    await boardReady(page);
    const givenIdx = await page.evaluate(() =>
      [...document.querySelectorAll(".sudoku-cell input")].findIndex(
        (i) => !!(i as HTMLInputElement).value,
      ),
    );
    const cell = page.locator(".sudoku-cell input").nth(givenIdx);
    await cell.click();
    await page.keyboard.press("5");
    await page.waitForTimeout(1030); // 8 beats + 1 frame
    const red = await readNote(page);
    const redPainted = await paintedBytes(page, null);
    await page.waitForTimeout(600);
    const redLater = await readNote(page);
    const redLaterPainted = await paintedBytes(page, null);
    // gold: a solve
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
    const goldPainted = await paintedBytes(page, null);
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
  bank(`p2-settle-${browserName}.json`, { engine: browserName, dpr: 1, rows, verdicts });
  say("P2", {
    settle: rows.map((r: any) => ({
      scheme: r.scheme,
      textAt: r.clock.textAtMs,
      settledAt: r.clock.settledAtMs,
      freshPainted: r.paintedFresh?.p005Ratio,
      atPlusFrame: r.paintedAtSettlePlusFrame?.p005Ratio,
      steady: r.paintedSettled?.p005Ratio,
      steadyColor: r.settledSteady?.color,
    })),
    verdicts: verdicts.map((v: any) => ({
      scheme: v.scheme,
      redAge: v.red?.age,
      redPainted: v.redPainted?.p005Ratio,
      redLaterAge: v.redLater?.age,
      goldText: v.gold?.text,
      goldAge: v.gold?.age,
      goldPainted: v.goldPainted?.p005Ratio,
    })),
  });
  expect(rows.length).toBe(2);
});

test("P2b the settle at DPR 3 — the real phone's raster", async ({
  browser,
  browserName,
}) => {
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    reducedMotion: "no-preference",
    colorScheme: "light",
  });
  const page = await ctx.newPage();
  const rows: unknown[] = [];
  for (const scheme of ["light", "dark"] as const) {
    await page.emulateMedia({ reducedMotion: "no-preference", colorScheme: scheme });
    await boardReady(page);
    await page.evaluate(() => {
      const inputs = Array.from(
        document.querySelectorAll(".game-cell input"),
      ) as HTMLInputElement[];
      inputs.find((i) => !i.value)?.focus();
    });
    await page.keyboard.press("h");
    await page.waitForTimeout(500);
    const fresh = await paintedBytes(page, null);
    await page.waitForTimeout(1300);
    const note = await readNote(page);
    const settled = await paintedBytes(page, null);
    rows.push({ scheme, age: note?.age, color: note?.color, fresh, settled });
  }
  bank(`p2b-dpr3-${browserName}.json`, { engine: browserName, dpr: 3, rows });
  say("P2b", rows.map((r: any) => ({ scheme: r.scheme, fresh: r.fresh?.p005Ratio, settled: r.settled?.p005Ratio })));
  await ctx.close();
  expect(rows.length).toBe(2);
});

// ── P4 · THE REFUSAL'S CLOCK ─────────────────────────────────────────────────────────────
test("P4 the refusal leaves, and a second refusal restarts it (G5)", async ({
  page,
  browserName,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "no-preference", colorScheme: "light" });
  await boardReady(page);
  const givenIdx = await page.evaluate(() =>
    [...document.querySelectorAll(".sudoku-cell input")].findIndex(
      (i) => !!(i as HTMLInputElement).value,
    ),
  );
  const cell = page.locator(".sudoku-cell input").nth(givenIdx);

  // ROW 1 — one refusal: present at 23 beats, absent at 24 beats + 1 frame.
  await cell.click();
  const t0 = Date.now();
  await page.keyboard.press("5");
  await page.waitForTimeout(2875 - (Date.now() - t0)); // 23 beats
  const at23 = await readNote(page);
  await page.waitForTimeout(Math.max(0, 3000 + 60 - (Date.now() - t0))); // 24 beats + frames
  const at24 = await readNote(page);
  const at24Ms = Date.now() - t0;

  // ROW 2 — a second refusal at beat 12 restarts the clock.
  await boardReady(page);
  const cell2 = page.locator(".sudoku-cell input").nth(givenIdx);
  await cell2.click();
  const t1 = Date.now();
  await page.keyboard.press("5");
  await page.waitForTimeout(1500 - (Date.now() - t1)); // beat 12
  await cell2.click();
  await page.keyboard.press("6"); // the same sentence, a second time
  await page.waitForTimeout(3750 - (Date.now() - t1)); // beat 30 from the FIRST
  const at30 = await readNote(page);
  await page.waitForTimeout(Math.max(0, 4625 - (Date.now() - t1))); // beat 37
  const at37 = await readNote(page);

  // ROW 3 — your ink that LANDS retracts it before the clock does.
  await boardReady(page);
  const cell3 = page.locator(".sudoku-cell input").nth(givenIdx);
  await cell3.click();
  await page.keyboard.press("5");
  await page.waitForTimeout(700);
  const refused3 = await readNote(page);
  await page.evaluate(() => {
    const inputs = Array.from(
      document.querySelectorAll(".game-cell input"),
    ) as HTMLInputElement[];
    inputs.find((i) => !i.value)?.focus();
  });
  await page.keyboard.press("5");
  await page.waitForTimeout(700);
  const afterLandingInk = await readNote(page);

  const report = {
    engine: browserName,
    single: { at23, at24, at24Ms },
    restart: { at30, at37 },
    landingInk: { refused3, afterLandingInk },
  };
  bank(`p4-refusal-${browserName}.json`, report);
  say("P4", {
    at23: at23?.text,
    at24: at24?.text,
    at30: at30?.text,
    at37: at37?.text,
    afterInk: afterLandingInk?.text,
  });
  expect(at23).not.toBeNull();
});

// ── P5 · THE REPEAT SPEAKS ───────────────────────────────────────────────────────────────
test("P5 the same refusal twice yields two mutations (G6)", async ({
  page,
  browserName,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "no-preference", colorScheme: "light" });
  await boardReady(page);
  const givenIdx = await page.evaluate(() =>
    [...document.querySelectorAll(".sudoku-cell input")].findIndex(
      (i) => !!(i as HTMLInputElement).value,
    ),
  );
  const cell = page.locator(".sudoku-cell input").nth(givenIdx);
  await cell.click();
  await page.keyboard.press("5");
  await page.waitForTimeout(700);
  const repeatPromise = page.evaluate(() => {
    const block = document.querySelector<HTMLElement>(".margin-note-block");
    if (!block) return Promise.resolve(null);
    let starts = 0;
    const names: string[] = [];
    let mutations = 0;
    block.addEventListener("animationstart", (e) => {
      starts++;
      names.push((e as AnimationEvent).animationName);
    });
    const mo = new MutationObserver((m) => (mutations += m.length));
    mo.observe(block, { childList: true, subtree: true, characterData: true });
    return new Promise<{
      starts: number;
      names: string[];
      mutations: number;
      text: string;
    }>((res) => {
      (window as unknown as { __neDone: () => void }).__neDone = () => {
        mo.disconnect();
        res({ starts, names, mutations, text: (block.textContent || "").trim() });
      };
    });
  });
  await page.waitForTimeout(200);
  await cell.click();
  await page.keyboard.press("6"); // the SAME refusal, a second time
  await page.waitForTimeout(1000);
  await page.evaluate(() => (window as unknown as { __neDone: () => void }).__neDone());
  const repeatRead = await repeatPromise;
  bank(`p5-repeat-${browserName}.json`, { engine: browserName, repeatRefusal: repeatRead });
  say("P5", repeatRead);
  expect(repeatRead).not.toBeNull();
});

// ── P6 · THE CONTROLS ────────────────────────────────────────────────────────────────────
test("P6 arm-(b) control and the note cannot outlive its board (E7, G9)", async ({
  page,
  browserName,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "no-preference", colorScheme: "light" });

  // E7 — a SETTLED note with the model still armed: the next H press must ink the digit.
  await boardReady(page);
  const armed = await armHint(page);
  await page.waitForTimeout(800); // settle
  const settled = await readNote(page);
  const boardBefore = await page.evaluate(() =>
    [...document.querySelectorAll(".sudoku-cell input")]
      .map((i) => (i as HTMLInputElement).value || ".")
      .join(""),
  );
  await page.keyboard.press("h");
  await page.waitForTimeout(900);
  const boardAfter = await page.evaluate(() =>
    [...document.querySelectorAll(".sudoku-cell input")]
      .map((i) => (i as HTMLInputElement).value || ".")
      .join(""),
  );
  const afterSecondPress = await readNote(page);

  // G9 — `g` then cancel: the same sentence at the same box. `g` then deal: "".
  await boardReady(page);
  const armed2 = await armHint(page);
  await page.evaluate(() => (document.activeElement as HTMLElement)?.blur?.());
  await page.keyboard.press("g");
  await page.waitForTimeout(1400);
  const inDeck = await readNote(page);
  await page.keyboard.press("Escape");
  await page.waitForTimeout(1600);
  const back = await readNote(page);

  await boardReady(page);
  const armed3 = await armHint(page);
  await page
    .getByRole("button", { name: /deal/i })
    .first()
    .click({ timeout: 6000 })
    .catch(() => {});
  await page.waitForTimeout(1600);
  const afterDeal = await readNote(page);

  const report = {
    engine: browserName,
    e7: {
      armed,
      settled,
      settledAge: settled?.age,
      boardChangedByNextH: boardBefore !== boardAfter,
      afterSecondPress,
    },
    g9: {
      armed2,
      inDeck,
      back,
      sameSentence: armed2?.text === back?.text,
      sameBox: JSON.stringify(armed2?.box) === JSON.stringify(back?.box),
      armed3,
      afterDeal,
    },
  };
  bank(`p6-controls-${browserName}.json`, report);
  say("P6", {
    settledAge: settled?.age,
    inked: report.e7.boardChangedByNextH,
    afterSecondPress: afterSecondPress?.text,
    sameSentence: report.g9.sameSentence,
    sameBox: report.g9.sameBox,
    afterDeal: afterDeal?.text,
  });
  expect(report.e7.settled).not.toBeNull();
});

// ── P7 · THE FRAMES ──────────────────────────────────────────────────────────────────────
// The rub-out and the mid-replacement are captured by PAUSING the family's own keyframes at an
// exact offset (`animation-delay: -62ms; animation-play-state: paused`) on a live span, because
// Vue removes the node at the computed duration and no wall-clock screenshot can catch 62ms of
// a 125ms verb. The curve, the keyframes and the duration are the build's own; only the clock
// is held. P1's frame trace is the evidence that the live verb passes through these poses.
test("P7 the frames (chromium)", async ({ page, browserName }) => {
  test.skip(browserName !== "chromium", "frames are banked from one engine");
  const shots: unknown[] = [];

  // the rub-out at t = 62ms, 390x844
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "no-preference", colorScheme: "light" });
  await boardReady(page);
  await armHint(page);
  const rubBox = await page.evaluate(() => {
    const ink = document.querySelector<HTMLElement>(".margin-note-ink");
    if (!ink) return null;
    ink.classList.add("note-leave-active");
    ink.style.animationDelay = "-62ms, -62ms";
    ink.style.animationPlayState = "paused";
    const r = ink.getBoundingClientRect();
    return {
      x: Math.floor(r.left) - 3,
      y: Math.floor(r.top) - 3,
      width: Math.ceil(r.width) + 6,
      height: Math.ceil(r.height) + 6,
      clip: getComputedStyle(ink).clipPath,
      opacity: getComputedStyle(ink).opacity,
    };
  });
  if (rubBox) {
    const buf = await page.screenshot({
      clip: { x: rubBox.x, y: rubBox.y, width: rubBox.width, height: rubBox.height },
      animations: "allow",
    });
    writeFileSync(join(FRAMES, "rubout-62ms-390-chromium.png"), buf);
    shots.push({ frame: "rubout-62ms-390-chromium.png", bytes: buf.length, ...rubBox });
  }

  // a replacement mid out-in at t = 200ms (75ms into the new line's write-in), 1280x800
  await page.setViewportSize({ width: 1280, height: 800 });
  await boardReady(page);
  await armHint(page);
  const repBox = await page.evaluate(() => {
    const ink = document.querySelector<HTMLElement>(".margin-note-ink");
    if (!ink) return null;
    ink.classList.add("note-enter-active");
    ink.style.animationDelay = "-75ms";
    ink.style.animationPlayState = "paused";
    const r = ink.getBoundingClientRect();
    return {
      x: Math.floor(r.left) - 3,
      y: Math.floor(r.top) - 3,
      width: Math.ceil(r.width) + 6,
      height: Math.ceil(r.height) + 6,
      clip: getComputedStyle(ink).clipPath,
      opacity: getComputedStyle(ink).opacity,
    };
  });
  if (repBox) {
    const buf = await page.screenshot({
      clip: { x: repBox.x, y: repBox.y, width: repBox.width, height: repBox.height },
      animations: "allow",
    });
    writeFileSync(join(FRAMES, "replace-200ms-1280-chromium.png"), buf);
    shots.push({ frame: "replace-200ms-1280-chromium.png", bytes: buf.length, ...repBox });
  }
  bank("p7-frames.json", { engine: browserName, shots });
  say("P7", shots);
  expect(shots.length).toBe(2);
});
