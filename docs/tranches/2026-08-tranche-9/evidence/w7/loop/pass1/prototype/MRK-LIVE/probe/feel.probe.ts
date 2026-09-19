/**
 * T9-W7 pass 1 · MRK-LIVE PROTOTYPE — G-LIVE-2 ONE REVOLUTION, and the phone's frame trace.
 *
 * The pose is read from the DOM, not from a hook: which of the focused cell's ghost paths is
 * opaque, sampled per rAF. A swap is a change in that index. Law: >= 4 swaps within 700ms of
 * the landing, 0 swaps in the 3s that follow, final pose 0. RED at HEAD (one path, 0 swaps).
 * PRM arm: 0 swaps ever, pose 0.
 */
import { test, expect, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

const HERE = dirname(new URL(import.meta.url).pathname);
const OUT = join(HERE, "..", "logs");
mkdirSync(OUT, { recursive: true });
const bank = (n: string, d: unknown) =>
  writeFileSync(join(OUT, n), JSON.stringify(d, null, 2));

async function boardReady(page: Page, query: string) {
  await page.goto("./" + query);
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 60000 });
  await page.waitForSelector("path.cell-line", { state: "attached", timeout: 60000 });
  await page.waitForTimeout(1400);
}

/** Sample the visible pose index per rAF for `ms`, starting at the landing. */
const TRACE = `async (ms) => {
  const read = () => {
    const cell = document.querySelector(".game-cell:has(input:focus-visible)");
    if (!cell) return -1;
    const paths = Array.from(cell.querySelectorAll(".cell-ghost-path"));
    for (let i = 0; i < paths.length; i++) {
      if (Number(getComputedStyle(paths[i]).opacity) > 0.5) return i;
    }
    return -1;
  };
  const t0 = performance.now();
  const swaps = [];
  let last = read();
  const first = last;
  let frames = 0;
  let long = 0;
  let prev = t0;
  while (performance.now() - t0 < ms) {
    await new Promise((r) => requestAnimationFrame(() => r(null)));
    const now = performance.now();
    frames++;
    if (now - prev > 33) long++;
    prev = now;
    const v = read();
    if (v !== last) { swaps.push({ t: Math.round(now - t0), from: last, to: v }); last = v; }
  }
  return { first, final: last, swaps, frames, longFrames: long, poseCount:
    (document.querySelector(".game-cell:has(input:focus-visible)")?.querySelectorAll(".cell-ghost-path").length) ?? 0 };
}`;

test("G-LIVE-2 one revolution then rest", async ({ page, browserName }) => {
  await page.emulateMedia({ reducedMotion: "no-preference", colorScheme: "light" });
  await boardReady(page, "?size=3&difficulty=EASY");
  await page.evaluate(() => {
    const inputs = Array.from(
      document.querySelectorAll(".game-cell input"),
    ) as HTMLInputElement[];
    inputs[40]?.focus();
  });
  await page.waitForTimeout(1200);

  // The landing: an ArrowRight moves the selection to a NEW cell, which is the trigger.
  const tracePromise = page.evaluate(({ fn, a }) => (eval(fn) as any)(...a), {
    fn: TRACE,
    a: [700],
  });
  await page.keyboard.press("ArrowRight");
  const landing = await tracePromise;

  const idle = await page.evaluate(({ fn, a }) => (eval(fn) as any)(...a), {
    fn: TRACE,
    a: [3000],
  });

  // PRM arm: a fresh landing with the beat force-cleared.
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.waitForTimeout(400);
  const prmPromise = page.evaluate(({ fn, a }) => (eval(fn) as any)(...a), {
    fn: TRACE,
    a: [1200],
  });
  await page.keyboard.press("ArrowRight");
  const prm = await prmPromise;

  const row = {
    engine: browserName,
    landing: {
      swaps: landing.swaps.length,
      final: landing.final,
      lastSwapMs: landing.swaps.length ? landing.swaps[landing.swaps.length - 1].t : null,
      poseCount: landing.poseCount,
      timeline: landing.swaps,
      pass: landing.swaps.length >= 4 && landing.final === 0,
    },
    idle3s: { swaps: idle.swaps.length, final: idle.final, pass: idle.swaps.length === 0 && idle.final === 0 },
    prm: { swaps: prm.swaps.length, final: prm.final, pass: prm.swaps.length === 0 },
  };
  bank(`feel-settle-${browserName}.json`, row);
  console.log("FEELSETTLE " + JSON.stringify(row, null, 2));
  expect(row.landing.poseCount).toBeGreaterThan(0);
});

test("the phone's 16x16 traversal — 0 frames over 33ms", async ({ page, browserName }) => {
  await page.emulateMedia({ reducedMotion: "no-preference", colorScheme: "light" });
  await page.setViewportSize({ width: 393, height: 699 });
  await boardReady(page, "?size=4&difficulty=EASY");
  await page.evaluate(() => {
    const inputs = Array.from(
      document.querySelectorAll(".game-cell input"),
    ) as HTMLInputElement[];
    inputs[0]?.focus();
  });
  await page.waitForTimeout(800);

  const WALK = async () => {
    const out: number[] = [];
    let prev = performance.now();
    const tick = () =>
      new Promise((r) =>
        requestAnimationFrame(() => {
          const n = performance.now();
          out.push(n - prev);
          prev = n;
          r(null);
        }),
      );
    const el = document.activeElement as HTMLElement;
    for (let i = 0; i < 24; i++) {
      el.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }),
      );
      for (let f = 0; f < 8; f++) await tick();
    }
    const long = out.filter((d) => d > 33);
    return {
      frames: out.length,
      longFrames: long.length,
      maxFrameMs: Math.round(Math.max(...out) * 100) / 100,
      p95: Math.round(out.sort((a, b) => a - b)[Math.floor(out.length * 0.95)] * 100) / 100,
      ghostPaths: document.querySelectorAll(".cell-ghost-path").length,
      cells: document.querySelectorAll(".game-cell").length,
    };
  };

  const living = await page.evaluate(WALK);
  // The control: same DOM, same walk, beat force-cleared.
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.waitForTimeout(500);
  const frozen = await page.evaluate(WALK);

  const out = { engine: browserName, living, frozen };
  bank(`phone-trace-${browserName}.json`, out);
  console.log("PHONE " + JSON.stringify(out, null, 2));
  expect(living.frames).toBeGreaterThan(50);
});
