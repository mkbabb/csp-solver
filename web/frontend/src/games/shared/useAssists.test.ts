import { describe, it, expect } from "vitest";
import { ref } from "vue";
import { useAssists } from "./useAssists";

// FE-unit layer (T4-W8 ROW 2 + ROW 3): the board-assist settings — the error-check MODE cadence
// over the same pure `findConflicts` derivation, and the persistent auto-candidates toggle. Covers
// the on-demand default (§B3: never live-by-default, never a mistake-counter), the arm-on-select /
// disarm-on-edit snapshot that IS the on-demand↔live distinction, the live-ignores-edits invariant,
// the mode cycle, and the candidates toggle defaulting OFF (the NYT clutter lesson) surviving a
// board edit as a standing preference.

describe("useAssists — error-check mode (T4-W8 ROW 2)", () => {
  it("defaults to on-demand, unarmed — no proactive check until asked (never live-by-default, §B3)", () => {
    const a = useAssists(ref({}));
    expect(a.errorCheckMode.value).toBe("on-demand");
    expect(a.checkArmed.value).toBe(false);
    expect(a.proactiveCheck.value).toBe(false);
  });

  it("selecting on-demand arms a one-shot check; live is continuous, off shows nothing", () => {
    const a = useAssists(ref({}));
    a.setErrorCheckMode("on-demand");
    expect(a.checkArmed.value).toBe(true);
    expect(a.proactiveCheck.value).toBe(true);
    a.setErrorCheckMode("live");
    expect(a.checkArmed.value).toBe(false); // live needs no arming
    expect(a.proactiveCheck.value).toBe(true);
    a.setErrorCheckMode("off");
    expect(a.proactiveCheck.value).toBe(false);
  });

  it("a board edit disarms the on-demand snapshot (the live↔on-demand distinction)", async () => {
    const values = ref<Record<string, number>>({ "0": 0 });
    const a = useAssists(values);
    a.setErrorCheckMode("on-demand");
    expect(a.proactiveCheck.value).toBe(true);
    values.value = { "0": 5 }; // an edit
    await Promise.resolve(); // let the watcher flush
    expect(a.checkArmed.value).toBe(false);
    expect(a.proactiveCheck.value).toBe(false);
  });

  it("live ignores edits — it stays on as-you-go", async () => {
    const values = ref<Record<string, number>>({ "0": 0 });
    const a = useAssists(values);
    a.setErrorCheckMode("live");
    values.value = { "0": 5 };
    await Promise.resolve();
    expect(a.proactiveCheck.value).toBe(true);
  });

  it("cycles off → on-demand → live → off", () => {
    const a = useAssists(ref({}));
    a.setErrorCheckMode("off");
    a.cycleErrorCheckMode();
    expect(a.errorCheckMode.value).toBe("on-demand");
    a.cycleErrorCheckMode();
    expect(a.errorCheckMode.value).toBe("live");
    a.cycleErrorCheckMode();
    expect(a.errorCheckMode.value).toBe("off");
  });
});

describe("useAssists — persistent candidates (T4-W8 ROW 3)", () => {
  it("defaults OFF (the NYT clutter lesson; peek-gating already gets opt-in right)", () => {
    const a = useAssists(ref({}));
    expect(a.candidatesPinned.value).toBe(false);
  });

  it("toggles on and off", () => {
    const a = useAssists(ref({}));
    a.toggleCandidates();
    expect(a.candidatesPinned.value).toBe(true);
    a.setCandidatesPinned(false);
    expect(a.candidatesPinned.value).toBe(false);
  });

  it("survives a board edit — a standing preference, not board state", async () => {
    const values = ref<Record<string, number>>({ "0": 0 });
    const a = useAssists(values);
    a.setCandidatesPinned(true);
    values.value = { "0": 3 }; // an edit voids the on-demand snapshot, never the pin
    await Promise.resolve();
    expect(a.candidatesPinned.value).toBe(true);
  });
});
