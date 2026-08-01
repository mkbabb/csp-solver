/**
 * T5-W1.1 CANARY — the fe-unit lane, shown able to RED.
 *
 * A1 found 332 test blocks in 31 files running in NO CI lane. The defect is ABSENCE, so
 * the born-RED law is satisfied by proof that the new lane CAN fail rather than by a red
 * at HEAD (HEAD is green: 332/332). This file is that proof.
 *
 * It lives HERE, under the wave's evidence, and never in `web/frontend/src/`. Two uses:
 *   · the local proof — copied to `web/frontend/src/canary-red.test.ts`, run once, removed;
 *     the run's nonzero exit is banked at `evidence/w1/unit-canary-RED.txt`;
 *   · the CI proof — the team lead pushes it on a canary branch at seal so the `fe-unit`
 *     job itself is observed red, and banks that run id.
 *
 * Two arms, because the lane has two ways to be worthless:
 *   1. a failing assertion must exit nonzero (the lane carries the unit signal at all);
 *   2. the count floor must read a real, current census (the `--floor` arm is the
 *     `check-unit-count.mjs --self-test` case at 299; here the arm is the executed count
 *     the report claims, so a lane that runs one file cannot green).
 *
 * Neither arm is a syntax error or a thrown import: a broken file can red a lane for
 * reasons that have nothing to do with the tests, which would prove nothing about the
 * signal. Both arms are ordinary assertions that are ordinarily false.
 */
import { describe, it, expect } from "vitest";

describe("T5-W1.1 canary — the fe-unit lane carries a signal", () => {
  it("ARM 1: a false assertion reds the lane (deliberate)", () => {
    // If this ever passes, arithmetic has changed and the canary is the least of it.
    expect(1 + 1).toBe(3);
  });

  it("ARM 2: the lane runs the estate, not a fragment (deliberate)", () => {
    // The floor's premise, asserted from inside the run: this file is collected together
    // with the rest of `src/**/*.test.ts`. Deliberately false so the arm reds — the honest
    // form of "the lane executed 332 tests" is the JSON report, which check-unit-count.mjs
    // grades; this arm only proves a second failure surfaces beside the first.
    expect(Number.MAX_SAFE_INTEGER).toBeLessThan(300);
  });
});
