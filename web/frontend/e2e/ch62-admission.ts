import type { Page, TestInfo } from "@playwright/test";

/**
 * CH-62 · THE ADMISSION CENSUS, spec side (T7-W3).
 *
 * `window.__bakeAdmission` is the instrument `src/pencil/composables/rasterPose.ts` publishes
 * under `import.meta.env.DEV` or a `--mode ch62-probe|ch62-ablate` build, and nowhere else
 * (proof: the prod-shake grep in `evidence/w3/ch62-instrument-smoke.txt`). It holds one field
 * per `posePaints` exit, per surface, so the probe's verdict arithmetic can be computed
 * instead of asserted:
 *
 *   retire CH-62 ⟺ ARM B red ≥2/6 ∧ ARM A red 0/6 ∧ ARM A `refused` > 0
 *                  ∧ decodeRejected = noCtx = taintRejected = noEnv = maxRebakesExhausted = 0
 *
 * A green ARM A with any fail-open fired is a masked blank, not a clean pass — which is the
 * whole reason the counters exist rather than a reading of `posePaints`.
 *
 * WHY THIS FILE IS PLUMBING AND NOT A CALL SITE. The two specs that read a baked bitmap —
 * `wordmark-integrity` and `theme-bake-freshness` — are another executor's rows this wave, so
 * nothing here is wired into them yet. `attachBakeAdmission` is written to be dropped in
 * beside the existing `attachBakeEvidence` call (same shape, same best-effort contract): the
 * probe workflow meanwhile takes its census from its own pass over the same five surfaces,
 * which is a seam the record names rather than hides.
 */

export type BakeAdmissionCounters = {
  probed: number;
  admitted: number;
  /** The real NEGATIVE — decoded and inked, the gate standing down. Not a term of the retire
   *  conjunction; it is what makes a surface's row add up
   *  (`probed = noEnv + decodeRejected + noCtx + taintRejected + painted + refused`), so a lost
   *  exit shows as arithmetic rather than as silence. T7-W3 residue, non-author FINDING 5. */
  painted: number;
  refused: number;
  rebakes: number;
  decodeRejected: number;
  noCtx: number;
  taintRejected: number;
  noEnv: number;
  maxRebakesExhausted: number;
  ablatedAdmits: number;
};

export type BakeAdmission = {
  ablated: boolean;
  surfaces: Record<string, BakeAdmissionCounters>;
};

/** The five fail-open exits. A green ARM A with any of these non-zero is a masked blank. */
export const FAIL_OPEN_FIELDS = [
  "decodeRejected",
  "noCtx",
  "taintRejected",
  "noEnv",
  "maxRebakesExhausted",
] as const;

/**
 * Read the census off the page. `null` means the instrument is not in this bundle at all —
 * which is a REFUSAL to report, never a zero: an ordinary production build has no
 * `__bakeAdmission`, and reading its absence as "all counters clean" is exactly the false
 * green the probe exists to prevent.
 */
export async function readBakeAdmission(page: Page): Promise<BakeAdmission | null> {
  return page.evaluate(() => window.__bakeAdmission ?? null);
}

/** Sum every surface into one row — the shape the probe's verdict arithmetic reads. */
export function totalBakeAdmission(dump: BakeAdmission): BakeAdmissionCounters {
  const out: BakeAdmissionCounters = {
    probed: 0,
    admitted: 0,
    painted: 0,
    refused: 0,
    rebakes: 0,
    decodeRejected: 0,
    noCtx: 0,
    taintRejected: 0,
    noEnv: 0,
    maxRebakesExhausted: 0,
    ablatedAdmits: 0,
  };
  for (const row of Object.values(dump.surfaces))
    for (const k of Object.keys(out) as (keyof BakeAdmissionCounters)[])
      out[k] += row[k] ?? 0;
  return out;
}

/**
 * Attach the census to a test, so a bake red arrives with the admission state that produced
 * it. Best-effort, exactly like `attachBakeEvidence`: an instrument that can fail a test is
 * an instrument that changes the thing it measures.
 */
export async function attachBakeAdmission(
  page: Page,
  testInfo: TestInfo,
  name: string,
): Promise<void> {
  try {
    const dump = await readBakeAdmission(page);
    await testInfo.attach(`${name}-admission.json`, {
      body: JSON.stringify(
        dump === null
          ? { absent: true, why: "no __bakeAdmission — this bundle carries no instrument" }
          : { ...dump, totals: totalBakeAdmission(dump) },
        null,
        1,
      ),
      contentType: "application/json",
    });
  } catch {
    // Best-effort — the census must never become the failure.
  }
}
