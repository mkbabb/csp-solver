import { computed, ref, watch, type Ref } from "vue";

/**
 * Board assists (T4-W8 ROW 2 + ROW 3) — the player's own check settings, beside the
 * authoring store (`useUserMarks`) and the engine marks (`usePencilMarks`). Two preferences,
 * one home, game-agnostic by construction (it closes over `values` alone), so both games mount
 * the identical thing.
 *
 * ROW 2 — error-check MODE (off / on-demand / live). Today conflicts fire only after a Solve
 * grades wrong (`SudokuBoard.vue`'s `solveState === 'failed'` gate over the pure `findConflicts`
 * derivation). This adds the market-standard user-chosen cadence over that SAME pure derivation:
 *   · off      — train yourself: no proactive check (the Solve grade still grades — orthogonal).
 *   · on-demand — check-anytime: a Check gesture arms a point-in-time snapshot; the next board
 *                 edit disarms it (re-check to confirm). THE DEFAULT — never live-by-default,
 *                 and never a mistake-counter / hearts / lives (§B3 preserves this as design law).
 *   · live     — as-you-go: the derivation feeds continuously.
 * The board ORs `proactiveCheck` with its own `solveState === 'failed'` — the teacher's red pencil
 * grades actual work regardless of this setting; the mode governs only the proactive display.
 *
 * ROW 3 — persistent auto-candidates. The engine-domains marks (`usePencilMarks`) already
 * compute the solver's surviving candidates; today they show only while the peek gesture is held.
 * `candidatesPinned` un-gates them behind a persistent, opt-in toggle — no new compute, the game
 * just holds `marksActive` on. Default OFF (the NYT clutter lesson; the peek-gating already gets
 * opt-in right). Orthogonal to ROW 1's user marks: this shows the engine's domains, that the
 * player's notes.
 *
 * Both settings are standing preferences — they survive a board swap (never voided by a fresh
 * deal), exactly like the pencil mode. Only the on-demand snapshot (`checkArmed`) is board-state:
 * it clears on any value mutation, which IS the on-demand↔live distinction (live never clears).
 */
export type ErrorCheckMode = "off" | "on-demand" | "live";

/** The mode cycle for a bare-key/programmatic toggle: off → on-demand → live → off. */
const ERROR_CHECK_CYCLE: ErrorCheckMode[] = ["off", "on-demand", "live"];

export function useAssists(values: Ref<Record<string, number>>) {
  // ── ROW 2 — error-check mode ────────────────────────────────────────
  const errorCheckMode = ref<ErrorCheckMode>("on-demand");
  // on-demand is a point-in-time check: a Check gesture arms the snapshot, an edit disarms it.
  const checkArmed = ref(false);

  function setErrorCheckMode(mode: ErrorCheckMode) {
    errorCheckMode.value = mode;
    // Entering (or re-tapping) on-demand IS the check act; off/live carry no snapshot.
    checkArmed.value = mode === "on-demand";
  }
  function cycleErrorCheckMode() {
    const i = ERROR_CHECK_CYCLE.indexOf(errorCheckMode.value);
    setErrorCheckMode(ERROR_CHECK_CYCLE[(i + 1) % ERROR_CHECK_CYCLE.length]);
  }

  // The proactive display gate: live is continuous, on-demand shows only while armed, off never.
  // The board ORs this with `solveState === 'failed'` (the grade is orthogonal to the setting).
  const proactiveCheck = computed(
    () =>
      errorCheckMode.value === "live" ||
      (errorCheckMode.value === "on-demand" && checkArmed.value),
  );

  // A board mutation invalidates the on-demand snapshot — freezing the live derivation to a
  // point in time is precisely the on-demand↔live distinction. live ignores it (always on);
  // off has nothing armed. Reassigning `values` (clear / randomize / restore) lands here too.
  watch(values, () => (checkArmed.value = false), { deep: true });

  // ── ROW 3 — persistent auto-candidates ──────────────────────────────
  const candidatesPinned = ref(false); // default OFF (the NYT clutter lesson)
  function setCandidatesPinned(on: boolean) {
    candidatesPinned.value = on;
  }
  function toggleCandidates() {
    candidatesPinned.value = !candidatesPinned.value;
  }

  return {
    // ROW 2
    errorCheckMode,
    checkArmed,
    proactiveCheck,
    setErrorCheckMode,
    cycleErrorCheckMode,
    // ROW 3
    candidatesPinned,
    setCandidatesPinned,
    toggleCandidates,
  };
}
