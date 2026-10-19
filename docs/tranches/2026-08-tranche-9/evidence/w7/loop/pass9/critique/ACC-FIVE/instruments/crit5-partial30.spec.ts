import { test, expect } from "@playwright/test";
import { clockFor } from "./rate-clock";

// PASS-9 CRITIC ROW (ACC-FIVE, never banked): the window-MINIMUM cap on a 30 Hz panel when a front
// starts BETWEEN frames (a watcher or input handler, as the tally's runDrawIn does). pencil-boil
// stamps startTime = performance.now() at start(), so the tween's first tick is a PARTIAL frame;
// one partial < stepMs pins Math.min(window) below stepMs and every 33 ms frame is capped at 17.
// The 30 Hz cure's own unit row: a 240 ms front ends on frame 10 from a whole-frame start.
test("CRIT-P30: a 240 ms front started mid-frame on a 30 Hz panel ends by frame 11", async ({ page }, testInfo) => {
  const ck = clockFor("driven", 30);
  await page.addInitScript(ck.script as (o: unknown) => void, ck.arg);
  await page.goto("/?size=3&difficulty=EASY");
  await page.waitForSelector(".sudoku-cell", { timeout: 60000 });
  await page.waitForTimeout(1500);
  const off = Number(process.env.CRIT_OFF ?? 6);
  const r = await page.evaluate(
    async ([grid, cfg, off]) => {
      const m = await import(/* @vite-ignore */ grid);
      const c = await import(/* @vite-ignore */ cfg);
      const rec: { at: number; clock: number }[] = [];
      let startedAt = 0;
      let frames = 0;
      await new Promise<void>((done) => {
        const tw = m.frontTween({
          durationMs: 240,
          easing: (x: number) => x,
          onProgress: (e: number, at: number) => (frames++, rec.push({ at, clock: e * 240 })),
          onComplete: (at: number) => (frames++, rec.push({ at, clock: 240 }), done()),
        });
        requestAnimationFrame(() =>
          off < 0
            ? ((startedAt = performance.now()), tw.start())
            : setTimeout(() => ((startedAt = performance.now()), tw.start()), off),
        );
        setTimeout(done, 5000);
      });
      return { rec, frames, startedAt, stepMs: c.MOTION.hand.stepMs as number };
    },
    ["/src/pencil/grid/gridPaths.ts", "/src/pencil/config/pencilConfig.ts", off] as const,
  );
  const first = r.rec.length ? r.rec[0].at - r.startedAt : NaN;
  const steps = r.rec.slice(1).map((x, i) => ({ dt: x.at - r.rec[i].at, travel: x.clock - r.rec[i].clock }));
  const short = steps.filter((s) => s.dt > 25 && s.travel < s.dt - 1);
  const line = `off ${off} ms: first tick ${first.toFixed(1)} ms after start(); front ended on frame ${r.frames}; frame dt ${steps.map((s) => s.dt.toFixed(0)).join("/")}; travel ${steps.map((s) => s.travel.toFixed(1)).join("/")}; ${short.length} of ${steps.length} 30 Hz frames travelled < dt - 1 (stepMs ${r.stepMs})`;
  console.log(`CRIT-P30 ${testInfo.project.name} ${line}`);
  expect(r.rec.length, "the front never ticked").toBeGreaterThan(3);
  expect(r.frames, line).toBeLessThanOrEqual(11);
});
