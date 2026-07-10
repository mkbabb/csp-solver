# T3-WGATE — Record + recert

**The closing wave: re-sweep the docs, re-stamp the counts at the gate SHA, file the one backlog item, record the defer-closed and clean-bill dispositions, delete the recovery cron, and carry the owner-side reminders that outlive the tranche.** Nothing new is designed or built here — WGATE is the ledger that makes the tranche auditable: every retruthed number traces to a wave artifact, every deferred item has a recorded disposition, and the three owner reminders are actions carried, not questions left open.

**Dependencies**: ← all waves. **Effort**: S.

---

## Scope

### Doc re-sweep + recertification probe set

- **Blacklist grep-zero** including the retired triplet (the pre-tranche 7–57× / 10–25% figures + the stale headline) — the W2 doc-truth batch retruthed them; WGATE confirms zero survivors at the gate SHA.
- **Counts re-stamped at the gate SHA**: G6's baseline was **rust 151/0/6 across 18 harnesses · tests-py 27/2 · e2e 33/33 · lean wasm 90,602 B source==dist** at base `3b75eca2` (the citable set — the stale system-prompt CLAUDE.md cache of 150/17/87,853 is dead, K45). Post-W4 **tests-py reads 27/0** (the two Timeout-gated tests deleted, R-3). Re-stamp all four at the merged gate SHA; if the integers moved, the mechanics carried and only the SHA/counts refresh (RES-2).
- **Convergence appendix** finalized (appendix D — 64 → 72/83 → 91, the loop record).
- **Evidence dir per the G2 policy**: `docs/tranches/2026-07-tranche-3/evidence/` closes with the banked gate artifacts, pruned to load-bearing (the A24-G2 lesson: tranche-II was 47 MB / 287 files / 115 PNGs — do not repeat). The session scratchpad corpus (`.../scratchpad/tranche3/`) does not survive cleanup; its conclusions are already folded into this directory.

### The RES-5 memo edit (before archival)

The pass-2 memo carries a three-site "13" that K28 killed everywhere — the sweep is **12+2+1**, not 13. **Edit the three sites "13" → 12+2+1** in the memo before it's archived into the tranche record. This is a recorded correction, load-bearing for the memo's use as the `propagate_stratified` backlog spec.

### The recovery-cron delete — job `efaae137`

The recovery cron `efaae137` (a session-recovery job spun during the loop) is **deleted at the gate** (`CronDelete`). It has no post-tranche role — the tranche closes, the recovery scaffold comes down. *(WGATE-execution action, not a doc edit; recorded here as the disposition.)*

### Backlog + defer-closed records

- **`propagate_stratified` wire-in backlog item FILED** (ballot Q2, DISCHARGED → REMOVE + backlog): the symbol was removed in W3; the wire-in is filed as a **scoped backlog item with the RES-5 memo as its spec** (the memo, now "13"→12+2+1-corrected, is the design record for the future stratified-propagation driver).
- **Defer-closed records** (permanent recorded dispositions, not deferrals — the "no third defer" discipline honored): **mimalloc** (ROW-4/L25-13), **PGO** (L25-14), **opt-level=s** (ROW-5) — all closed on evidence (user-imperceptible / defer-closed), recorded with their re-entry criteria in the KISS ledger (appendix A §10).
- **GAC on/off gate re-litigation** (ROW-2): REJECT — default-ON stands on fresh evidence; recorded.

### The G8 clean bill + INFO notes

Record G8's clean-bill dispositions (the LOW finding itself is homed in W11): **G8-H1** CSP complete + correctly scoped for the wasm-only topology; **G8-P1** decoders fail-closed 33/33; **G8-W1** worker validation N/A by construction (dedicated Worker, no cross-context surface — K44); **INFO notes** G8-H3 (blanket `access-control-allow-origin: *`, CF-edge default, benign), G8-H4 (no Permissions-Policy / COOP/COEP, optional defense-in-depth — not required, single-thread wasm no SAB), G8-P3 (parser leniency, non-canonical, no security impact). The clean bill is the record that the security surface was probed and passed.

### Owner reminders carried (actions, not questions — none gate the tranche)

- **R5 worktree purge + `java` branch delete** — standing, owner-side, open since tranche-2 (52 worktrees live; `java` + `origin/java` both present at audit).
- **pencil-boil `v0.7.0` tag at `106a5a2`** — sibling-repo formality (G3): the lockfile sha512 already cryptographically pins 0.7.0 and local HEAD `106a5a2` IS the release state; the missing `v0.7.0` tag is the one gap. **NEVER push bbnf-lang origin** (standing) does not apply to pencil-boil — but the tag is the owner's to cut.
- **CF Pages redeploy** picks up the W2 `_headers` fix (doubled `.wasm` Cache-Control, live-proven G8-H2) when it next ships — recorded as pending-Pages either way.

### mod.rs post-tranche follow-up — noted

The `mod.rs` → self-named-file flip (`clippy.self_named_module_files`) is a **post-tranche one-commit follow-up** per pass-2 §5.5's own recommendation — not tranche work. Noted here as the record of that disposition (default; the owner-veto window to fold it into W4 was at the W4/WGATE boundary, §non-blocking-defaults #3).

## Gates

Verbatim from the reconciliation (§2 DAG, T3-WGATE):

| Gate | Value |
|---|---|
| Headline | blacklist grep-zero; counts re-stamped at the gate SHA; **tests-py reads 27/0** |

Component checks:

| Gate | Value |
|---|---|
| doc-truth | blacklist grep-zero incl. the retired triplet; every retruthed number traces to a wave artifact or a quoted command |
| counts | rust/tests-py/e2e/lean-wasm re-stamped at the gate SHA; tests-py 27/0 (post-W4) |
| cron | job `efaae137` deleted (`CronDelete`) |
| RES-5 | the three memo "13" sites read 12+2+1 before archival |
| backlog | `propagate_stratified` wire-in item filed with the corrected memo as spec |
| records | defer-closed (mimalloc/PGO/opt-s) + G8 clean bill + INFO notes + mod.rs follow-up all recorded; owner reminders carried |
| evidence | evidence dir closed under the G2 policy, pruned to load-bearing |

## Seeds

- [`pass3/reconciliation.md`](../evidence/pass3/reconciliation.md) — the unified decision set, the 12-wave DAG, R-1..R-12, the KISS ledger, the owner-side reminders + non-blocking veto windows (§3).
- [`pass3/G8-security-probe.md`](../evidence/pass3/G8-security-probe.md) — the clean bill (H1/P1/W1) + INFO notes (H3/H4/P3) recorded here; the LOW finding homed in W11.
- [`pass3/G3-pencil-boil-pin.md`](../evidence/pass3/G3-pencil-boil-pin.md) — the pencil-boil pin cryptographically anchored at `106a5a2`; the missing `v0.7.0` tag = the owner reminder.
- [`pass3/G6-baseline-run.md`](../evidence/pass3/G6-baseline-run.md) — the SHA-stamped baseline counts (the citable figure set); the maturin `-i` trap; the criterion `pre-t3` procedure.
- `audit32/A13-deferred-delineation.md` + `A14-chronically-deferred.md` — the 27 folds + the true chronic set; appendix C (deferred disposition) is their durable home.
- The RES-5 memo (pass-2) — the "13"→12+2+1 three-site edit, and the `propagate_stratified` backlog spec.

## Residual risks

- **The RES-5 edit + the re-stamps happen at the gate SHA** — if HEAD advanced during authoring, the counts refresh from `3b75eca2`'s worktree-local values; the mechanics (18 harnesses green, 27/0 py, 33/33 e2e) are the invariant, the integers are the stamp.
- **The owner-side reminders are actions, not gates** — R5's worktree purge, the pencil-boil `v0.7.0` tag, and the CF Pages redeploy are the owner's to execute; WGATE carries them into the record so they aren't lost, but none blocks the tranche's close.
- **The cron delete is an execution action** (`CronDelete efaae137`), not a doc edit — recorded here as the disposition; the actual delete runs at gate execution, not authoring.
- **Defer-closed is a permanent recorded disposition, not a deferral** — the risk is re-litigating mimalloc/PGO/opt-s from zero; each carries its re-entry criterion in the KISS ledger, so re-entry is against the recorded evidence, not a fresh proposal.
- **The evidence dir must open pruned** — the G2 policy is the whole point (the 47 MB lesson); banking every PNG re-creates the problem the policy names.
