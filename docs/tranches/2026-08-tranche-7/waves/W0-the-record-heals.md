# W0 — THE RECORD HEALS

The audit's central finding: the estate's code is sound and its record is not. Contrivance
lives in the ledger, the READMEs, and the comments, not the runtime. W0 makes the record
tell the truth and lands the instrument that keeps it true.

## Mechanism families closed here

- **record-cannot-verify-record** — a record asserting a state its own tree refutes.
- **ledger-accretion** — an Open section that never loses a row.
- **doc-cite-rot** — line-number citations into files that grew.
- **numbers-not-re-derived** — counts and LOC figures never recomputed at the citing commit.

## The work

### 0.1 — Empty the Open ledger to terminal states
Per `DISPOSITIONS.md`, every §1 row leaves with a terminal state written the same commit as
its enforcing act. Twelve rows named a T5 wave and are stale by position (T5 sealed at
`055da52c`); each moves to §2 with `LANDED`/`DEFAULTED`/`RETIRE` and a cite, or into a
T7 wave. The disease rows (CH-53, CH-61, CH-62) are decided, not carried.

### 0.2 — Wire and arm `ledger-diff`
`scripts/ledger-diff.mjs` is inert: hardcoded to the T5 corpus (`:82`), fatals against any
other tranche shape (`:240-242`), checks id-presence not currency (`:330-332`), and is
invoked by nothing (`git grep` outside `docs/` → one prettier comment). Fixes:
- Parameterize the corpus per tranche; remove the T5 hardcode and its report-title literal (`:363`).
- Add a **state-currency arm**: a §1 row whose disposition names a sealed wave, or whose
  claim a one-line probe refutes, reds.
- Wire it into CI and the deploy gate.

**Gate 0.2 (born RED):** at `afc72ba1`, `ledger-diff --assert-state` must red on CH-16
(claims UNWIRED; `permalink.spec.ts` proves wired), CH-29/31/37/56 (name sealed waves), and
go green only after 0.1 restamps them. The current `VERDICT GREEN` over four proven-false
rows is the vacuity this arm removes.

### 0.3 — Cure CH-16's inversion, three sites, one commit
- `LEDGER.md:56`, `README.md:62` ("persist to localStorage in v1"), `web/frontend/README.md:161-163` ("writeShareUrl no-ops").
- Add a **doc-truth row** `permalink-games`: derive the wired game set from the `urlCodec`
  presence in `src/games/*/spec.ts`; assert every doc's permalink claim names exactly that set.
**Gate 0.3 (born RED):** the new doc-truth row reds against the three current sites.

### 0.4 — The doc-drift census (D1–D20)
Twenty claims the 13-row doc-truth gate does not cover, each with a proposed gate row in the
gate's own idiom (see the audit's doc-drift table). Land the fixes and their gates together.
The highest-leverage new rows:
- **`cited-paths-exist`** — resolve every backticked source path in the docs; assert it
  exists. Kills D1 (`registry.ts`), D2 (`game.ts`), D3 (worker paths) as a class.
- **`worker-topology`** — one `solver.worker.ts` exists; forbid "five workers"/"each game owns."
- **`e2e-total-arithmetic`** — the three config totals must sum to the "N in all" figure (368, not 354).
- **`constraint-enum-variants`** — parse `ConstraintEnum`; forbid naming `Soft` (retired) or omitting `CageSum`/`CageProduct`.
- Fix the existing `pencil-boil` row to the hot-window idiom so it catches `^0.12.0` vs the doc's `^0.9.2` (line-scoping missed it).
**Gate 0.4 (born RED):** each new row reds against its live false claim; the 13 existing rows stay green.

### 0.5 — The cite-symbols ruling
Replace the four false line-number comment cites (`GameControlPanel.vue:1541`, `BoardHost.vue:143`,
`App.vue:57`, `useFlipGlide.ts:5`) with symbol names. Adopt the convention repo-wide:
comments cite symbols, which move with the code. No gate needed — the convention is the cure;
a `check-comment-lines` gate is optional and priced in W6 if the owner wants enforcement.

### 0.6 — Ledger the unledgered
The fourteen T6-born rows, the PyPI-403 blocker, and the OD residue get homes per
`DISPOSITIONS.md`. The close record's owner block becomes a **diff against LEDGER.md**, not a
hand-copied paragraph, so a row cannot survive in one and vanish from the other.

## Acceptance

Every §1 row terminal; `ledger-diff` wired, armed, and born-RED-proven against the four
current false-greens; the CH-16 sites and the D-series claims true with their gates; the
comment cites symbol-based. `check-doc-truth` green at the new, larger row count.
