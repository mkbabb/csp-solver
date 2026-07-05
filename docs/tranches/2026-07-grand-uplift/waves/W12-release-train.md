# W12 — Cross-repo release train

**One ratified window (OD-6 supplies the date), no partially-migrated intermediate states.** Single-maintainer constellation, four repos keyed off the same bumps. The never-push standing order on bbnf-lang's origin holds throughout—every bbnf edit is local, coordinated, unpushed.

**Dependencies**: ← W1/W2 (the 0.2.0 content), ← W7/W8 (the frontend consumers), ← W11 phase 1. W11 phase 2 rides *inside* this window (after the crates.io publish). **Effort**: M (2–3 days inside the window + coordination).

---

## The train, in order

### 1. `csp-solver 0.2.0` → crates.io

Semver rationale (all pre-1.0 minor-bump class, [`morph-excision-spec.md`](../evidence/morph-excision-spec.md) §2.1): `Ordering::DomWdeg → Mrv` (public enum-variant rename), `SolveConfig::backjumping` deletion (breaks exhaustive literals), `SolveConfig::default()` value changes (behavior-visible). Publishes from CI on tag push—orthogonal to the repo-split question (booked next tranche; the directory's stale `mkbabb/csp-solver` remote landmine stands: **never push this monorepo's origin either**).

### 2. bbnf-lang re-vendor + sync-gate upgrade (local, never pushed)

- Re-vendor the rewritten `csp-solver/src` at the new pin; **the coordinated one-line skinny edit lands in the same motion** (OD-7): append `..Default::default()` to `skinny/crates/passes/src/decision_csp.rs:85`'s exhaustive literal—B2 has no csp-side fix; `#[non_exhaustive]` breaks it harder ([`constraint-trait-bound-spike.md`](../evidence/constraint-trait-bound-spike.md) §7).
- **Land the enforced-compile sync gate** (ibid. §8—the full spec): `--verify` compiles `{root: bbnf, bbnf-ir, egraph}` ∪ `{skinny: passes}` (a separate workspace invisible to every root alias—the only command anywhere that catches B2) ∪ `{vendored csp-solver × (default, py)}` (both cfg branches, because the ThreadSafe fix is cfg-gated). Structural pre-build tripwires: trait-surface allow-list `{Debug, ThreadSafe}` on `Constraint`/`Domain`/`LatticeDomain` (grep for raw `Send`/`Sync` re-added), and a `SolveConfig`/`SolveStats` field-set delta warning. `--update`'s printed reminders become enforcement; the pre-push hook runs `--check` (drift) **and** `--verify` (build).
- The B1 `Arc<Mutex>` fallback is **not required**—W1's ThreadSafe marker honored the DO-NOT-BREAK contract csp-side with zero bbnf edits (the skinny line is B2, a different, unavoidable thing).

### 3. pencil-boil train: 0.5.0 → 0.5.1 → 0.6.0

- **0.5.0**: centralized PRM gate (the required design—per-hook `watchEffect` can't reach imperatively-constructed glyph handles; Pass-2 prototype 10's upstream amendment) + `advance(steps)` + the `sequence` subscriber kind (the celebration's substrate) + the `acquireHold/releaseHold` gate input (the union's third corroboration that the gate lives at the scheduler).
- **0.5.1**: `useBoilFrames`.
- **0.6.0**: celestial proofs land; **`useCelestialSun()` stays parked** (the M4 second-consumer gate failed on direct inspection—Pass-2 D7; spec-ready, unscheduled).
- M2 (reactive-PRM teardown, chronic ×3): its own changeset in 0.5.0, never bundled with M4.

### 4. sudoku frontend `^0.6.0` bump

- Swap the app-local `boilScheduler.ts` for the library scheduler; **the grep gate proves `src/pencil/composables/boilScheduler.ts` is deleted at the bump** (the T11 tripwire—otherwise it becomes the duplication the train exists to kill).
- File the **keyframes.js engine export-split ask** upstream (W8's logged item: value.js symbols in the emitted chunk for a single-key consumer; a subpath/export split or app-side dynamic `import()` closes it).

### 5. morph republish + consumer bump

- W11 phase 2 executes here (after step 1 confirms 0.2.0 live): repo cut, then `@mkbabb/morph` 0.2.0 (point_pairs + provenance).
- bbnf-buddy: `pointPairs: req.hints.pointPairs ?? []` at `src/composables/wasm/morph.ts:162` + the range bump—one line + one manifest field, its own repo's ordinary commit.

## Acceptance gates

| Gate | Value | Evidence |
|---|---|---|
| Sync gate | `--check` (byte drift) green AND `--verify` green: root crates + skinny `passes` + vendored×{default, py} all compile | [`constraint-trait-bound-spike.md`](../evidence/constraint-trait-bound-spike.md) §8 (spec) + §5 (the mirror shapes proven) |
| Tripwires | trait-surface + field-add greps fire on planted violations once (negative-control the gate itself) | ibid. §8.2 |
| Scheduler deletion | `grep -r boilScheduler.ts web/frontend/src` → zero at the bump commit | Pass-3 #10 (T11 tripwire) |
| Train coherence | one window; every consumer bump lands inside it; no repo left mid-migration | ratification (2026-07-04) |
| Publishes | crates.io + npm artifacts resolvable at the new versions; `cargo search` pre-flights green | [`morph-excision-spec.md`](../evidence/morph-excision-spec.md) R2 |

## Seed artifacts

- `pass2/bbnf-sync-gate.md` — the original `--check` gate; §8 of the spike report is the upgrade spec.
- `pass2/pencil-boil-release-train.md` — the 0.5.0/0.5.1/0.6.0 content ordering.
- The skinny edit: verified shape in `pass3/blast/repro/` consumer mirrors.

## Residual risks

- The full bbnf workspace has still never compiled against the rewritten crate in any harness (never-push + sibling-repo graph)—`--verify` inside bbnf-lang's own checkout is the first true full-graph compile; schedule it early in the window so a surprise has room to land.
- Behavioral confluence of the kernel's revise/cascade changes for bbnf's monotonic-lattice sweep is argued, not executed (`pass3/bbnf-vendor-blast-radius.md` residual)—the lattice test suite (944 L, vendored) runs under `--verify`'s test stage as the practical check.
- Coordination is single-human—the window's honest failure mode is calendar slip, which is why nothing outside this wave depends on it except W11 phase 2.
