import { describe, it, expect, vi } from "vitest";
import { MOTION } from "@pencil/config/pencilConfig";

// PASS-9 CRITIC PROBE (ACC-FIVE): the window MINIMUM vs a 30 Hz panel whose tween starts MID-FRAME.
// frontTween's first tick is dt = (first rAF ts) - (start()'s performance.now()), a PARTIAL frame
// (0..33 ms on a 30 Hz panel). Keyed on the minimum of 32 ticks, one partial tick < stepMs pins the
// cap at stepMs for the next 32 frames (~1.07 s at 30 Hz): every 33 ms frame then travels 17 ms,
// the half-speed class the observed cap was minted to cure (pass 7/8's 30 Hz row).
const F = 1000 / 30;
const load = async () => {
  vi.resetModules();
  let carrier: { onProgress: (e: number, raw: number) => void; durationMs: number } | null = null;
  vi.doMock("@mkbabb/pencil-boil", async (orig) => ({
    ...(await orig<typeof import("@mkbabb/pencil-boil")>()),
    createSequenceSubscription: (o: typeof carrier) => {
      carrier = o;
      return { start() {}, stop() {} };
    },
  }));
  const { frontTween } = await import("@pencil/grid/gridPaths");
  vi.spyOn(performance, "now").mockImplementation(() => 1000);
  // run one 240 ms tween over the given rAF elapsed times (ms from its start()); frames to its end
  const run = (elapsed: number[]) => {
    let n = 0;
    let done = -1;
    frontTween({
      durationMs: 240,
      easing: (x) => x,
      onProgress: () => void n++,
      onComplete: () => (done = n + 1),
    }).start();
    for (const ms of elapsed) if (done < 0) carrier!.onProgress(0, ms / carrier!.durationMs);
    return done;
  };
  return run;
};

describe("CRITIC p9 — a 30 Hz panel with a partial first tick", () => {
  for (const partial of [2, 5, 9, 12, 16])
    it(`first tick ${partial} ms then 30 Hz frames: a 240 ms front ends by frame 11 (the 30 Hz cure)`, async () => {
      const run = await load();
      const done = run(Array.from({ length: 40 }, (_, k) => partial + k * F));
      vi.doUnmock("@mkbabb/pencil-boil");
      // whole-frame start ends on frame 10 (the tree's own unit row); one partial frame adds <= 1
      expect(done).toBeLessThanOrEqual(11);
    });

  it("a SECOND front 12 frames after a partial-start front still runs at the panel's frame", async () => {
    const run = await load();
    run(Array.from({ length: 12 }, (_, k) => 5 + k * F)); // front A, 5 ms partial first tick
    // front B starts on a frame boundary of the SAME page (window shared); its ticks are whole frames
    const done = run(Array.from({ length: 40 }, (_, k) => (k + 1) * F));
    vi.doUnmock("@mkbabb/pencil-boil");
    expect(done).toBeLessThanOrEqual(11);
  });

  it("NEGATIVE CONTROL: a whole-frame start ends on frame 10 (MOTION.hand.stepMs read)", async () => {
    const run = await load();
    const done = run(Array.from({ length: 40 }, (_, k) => (k + 1) * F));
    vi.doUnmock("@mkbabb/pencil-boil");
    expect(MOTION.hand.stepMs).toBe(17);
    expect(done).toBe(10);
  });
});
