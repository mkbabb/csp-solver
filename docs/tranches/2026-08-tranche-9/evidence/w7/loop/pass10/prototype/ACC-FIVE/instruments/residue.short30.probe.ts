import { describe, it, expect, vi } from "vitest";

// ACC-FIVE pass-10 RESIDUE PROBE (evidence only, never banked as a product row): a SHORT tick that is
// not a tween's first. A 30 Hz page, one 6 ms interval mid-run (a frame right after a long task on a
// timer-driven clock), then 30 Hz again. The first-tick exclusion does not see it: the minimum pins at
// 6 and the cap at the step (17) until 32 more frames have filled the window.
const F30 = 1000 / 30;
describe("RESIDUE — a non-first short tick on a 30 Hz panel", () => {
  it("after one 6 ms interval, every later 30 Hz frame still travels its whole frame", async () => {
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
    const clock: number[] = [];
    frontTween({ durationMs: 1e7, easing: (x) => x, onProgress: (v) => clock.push(v * 1e7), onComplete: () => {} }).start();
    const times: number[] = [];
    let t = 5;
    for (let k = 0; k < 12; k++) times.push((t += k ? F30 : 0));
    times.push((t += 6)); // the short interval
    for (let k = 0; k < 12; k++) times.push((t += F30));
    for (const ms of times) carrier!.onProgress(0, ms / carrier!.durationMs);
    vi.doUnmock("@mkbabb/pencil-boil");
    const travel = clock.map((c, k) => c - (k ? clock[k - 1] : 0));
    const after = travel.slice(13);
    console.log(`RESIDUE travel after the 6 ms tick: ${after.map((x) => x.toFixed(1)).join("/")}`);
    expect(Math.min(...after)).toBeGreaterThanOrEqual(F30 - 1e-6);
  });
});
