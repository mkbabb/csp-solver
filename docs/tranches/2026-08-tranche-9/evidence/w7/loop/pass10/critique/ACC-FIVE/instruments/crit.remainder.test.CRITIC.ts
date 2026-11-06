import { describe, it, expect, vi, afterEach } from "vitest";

// PASS-10 CRITIC PROBE (ACC-FIVE): the stall's-remainder exclusion is keyed PER TWEEN (`held`), the
// window it guards is PAGE-GLOBAL (`ticks`). A tween that did not see the stall (started at the long
// task's end: its first tick is a ~1 ms partial, not held) reads the remainder into the window, and
// every front on the page then travels 17 of every 33 ms for 32 frames. Literal bounds only.
const F30 = 1000 / 30;
afterEach(() => {
  vi.doUnmock("@mkbabb/pencil-boil");
  vi.restoreAllMocks();
});

// a page: every frontTween's carrier recorded; performance.now() is the page clock, so a tween's
// origin is its true start and `at` is the frame's own time for every tween (one reading a frame)
async function page() {
  vi.resetModules();
  const subs: { o: { onProgress: (e: number, raw: number) => void; durationMs: number }; t0: number; on: boolean }[] = [];
  let now = 0;
  vi.spyOn(performance, "now").mockImplementation(() => now);
  vi.doMock("@mkbabb/pencil-boil", async (orig) => ({
    ...(await orig<typeof import("@mkbabb/pencil-boil")>()),
    createSequenceSubscription: (o: (typeof subs)[number]["o"]) => {
      const s = { o, t0: 0, on: false };
      subs.push(s);
      return { start: () => ((s.t0 = now), (s.on = true), void 0), stop: () => void (s.on = false) };
    },
  }));
  const { frontTween } = await import("./gridPaths");
  const tween = (durationMs: number) => {
    const clock: number[] = [];
    let done = -1;
    const tw = frontTween({
      durationMs,
      easing: (x) => x,
      onProgress: (v) => clock.push(v * durationMs),
      onComplete: () => (clock.push(durationMs), (done = clock.length)),
    });
    return { tw, clock, done: () => done, travel: () => clock.map((c, k) => c - (k ? clock[k - 1] : 0)) };
  };
  const at = (ms: number) => void (now = ms);
  const frame = (ms: number) => {
    now = ms;
    for (const s of [...subs]) if (s.on) s.o.onProgress(0, (ms - s.t0) / s.o.durationMs);
  };
  return { tween, frame, at };
}

describe("CRITIC p10 — the stall's remainder read by a tween that did not see the stall", () => {
  it("SOLO: a front started at a long task's end (1 ms partial, then a 6 ms remainder) on a warm 30 Hz page ends by frame 11", async () => {
    const p = await page();
    const w = p.tween(1e7);
    p.at(0);
    w.tw.start();
    for (let k = 1; k <= 12; k++) p.frame(k * F30); // the window: eleven whole 33 ms readings
    w.tw.stop();
    const T = 12 * F30;
    const c = p.tween(240);
    p.at(T + 149); // the long task's own commit starts the front
    c.tw.start();
    p.frame(T + 150); // the late frame
    p.frame(T + 156); // the timer clock's remainder
    for (let k = 1; k <= 20 && c.done() < 0; k++) p.frame(T + 156 + k * F30);
    const tr = c.travel();
    expect(c.done(), `travel ${tr.map((x) => x.toFixed(1)).join("/")}`).toBeLessThanOrEqual(11);
    for (let k = 2; k < tr.length - 1; k++) expect(tr[k]).toBeGreaterThanOrEqual(F30 - 1e-6);
  });

  it("TWO TWEENS: W runs through the stall (held), C starts at its end; the remainder is no reading for either", async () => {
    const p = await page();
    const w = p.tween(1e7);
    p.at(0);
    w.tw.start();
    for (let k = 1; k <= 12; k++) p.frame(k * F30);
    const T = 12 * F30;
    const c = p.tween(240);
    p.at(T + 149);
    c.tw.start();
    p.frame(T + 150); // W: a 150 ms stall, held; C: a 1 ms partial
    p.frame(T + 156); // W: its remainder (excluded); C: a 6 ms tick, not held
    for (let k = 1; k <= 20; k++) p.frame(T + 156 + k * F30);
    const tc = c.travel();
    const tw = w.travel().slice(14);
    expect(c.done(), `C travel ${tc.map((x) => x.toFixed(1)).join("/")}`).toBeLessThanOrEqual(11);
    for (let k = 2; k < tc.length - 1; k++) expect(tc[k]).toBeGreaterThanOrEqual(F30 - 1e-6);
    for (const x of tw) expect(x, `W after the remainder ${tw.map((y) => y.toFixed(1)).join("/")}`).toBeGreaterThanOrEqual(F30 - 1e-6);
  });

  it("NEGATIVE CONTROL: C started EARLY in the task (a 140 ms partial, held) — the remainder is excluded, every whole frame travels", async () => {
    const p = await page();
    const w = p.tween(1e7);
    p.at(0);
    w.tw.start();
    for (let k = 1; k <= 12; k++) p.frame(k * F30);
    const T = 12 * F30;
    const c = p.tween(240);
    p.at(T + 10);
    c.tw.start();
    p.frame(T + 150);
    p.frame(T + 156);
    for (let k = 1; k <= 20; k++) p.frame(T + 156 + k * F30);
    const tc = c.travel();
    expect(c.done(), `C travel ${tc.map((x) => x.toFixed(1)).join("/")}`).toBeLessThanOrEqual(11);
    for (let k = 2; k < tc.length - 1; k++) expect(tc[k]).toBeGreaterThanOrEqual(F30 - 1e-6);
    for (const x of w.travel().slice(14)) expect(x).toBeGreaterThanOrEqual(F30 - 1e-6);
  });
});
