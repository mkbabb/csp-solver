// ACC-FIVE pass-8 CRITIC probe (scratch archive only): how many CONSECUTIVE stalls uncap D10's displacement clause?
import { it, expect, vi } from "vitest";
import { MOTION } from "../config/pencilConfig";
for (const nStall of [1, 2, 3, 4, 5, 6, 9]) {
  it(`after 12 healthy 60 Hz frames, ${nStall} consecutive 150 ms stalls: the last stall's travel`, async () => {
    vi.resetModules();
    let carrier: { onProgress: (e: number, raw: number) => void; durationMs: number } | null = null;
    vi.doMock("@mkbabb/pencil-boil", async (orig) => ({
      ...(await orig<typeof import("@mkbabb/pencil-boil")>()),
      createSequenceSubscription: (o: typeof carrier) => { carrier = o; return { start() {}, stop() {} }; },
    }));
    const { frontTween } = await import("./gridPaths");
    vi.spyOn(performance, "now").mockImplementation(() => 1000);
    const seen: number[] = [];
    frontTween({ durationMs: 100000, easing: (x) => x, onProgress: (v) => seen.push(v * 100000), onComplete: () => {} }).start();
    const F = 1000 / 60; let t = 0;
    for (let k = 0; k < 12; k++) { t += F; carrier!.onProgress(0, t / carrier!.durationMs); }
    const travel: number[] = [];
    for (let s = 0; s < nStall; s++) { const b = seen[seen.length - 1]; t += 150; carrier!.onProgress(0, t / carrier!.durationMs); travel.push(+(seen[seen.length - 1] - b).toFixed(2)); }
    console.log(`CRIT-STALLRUN n=${nStall} travel per stall ${travel.join("/")} ms (cap stepMs ${MOTION.hand.stepMs})`);
    expect(Math.max(...travel)).toBeLessThanOrEqual(MOTION.hand.stepMs + 1e-6);
    vi.doUnmock("@mkbabb/pencil-boil");
  });
}
