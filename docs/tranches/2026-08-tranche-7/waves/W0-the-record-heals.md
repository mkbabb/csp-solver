# W0 — THE RECORD HEALS

The audit's central finding: the record's defects outnumber the runtime's. The runtime's share
is real but bounded — two CRITICAL product rows (W1, W2) and a fanout with no frame cap (W4);
everything else is ledger, README, and comment. W0 takes the largest share: it makes the record
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
Twenty claims the 13-row doc-truth gate does not cover, enumerated below at HEAD so the gate is
born RED from this table, not from an artifact outside the repo. Each fix lands with its gate.

| # | claim → truth | file:line | sev |
|---|---|---|---|
| D1 | "`registry.ts`, the GAMES card table" → no such file; it is `cards.ts` | frontend README:73,114 | HIGH |
| D2 | "each game dir declares `game.ts`" → no `game.ts` anywhere; every game declares `spec.ts` | frontend README:118 | HIGH |
| D3 | "Five workers … each game owns `solver/solver.worker.ts`" → exactly one, `games/shared/solver/solver.worker.ts` | README:28,62; frontend README:167,169 | HIGH |
| D4 | README's per-game file tree (`SudokuBoard/`, `KillerCage/`, …) → none exist | frontend README:75-80 | HIGH |
| D5 | "Two files sit out WebKit: `mobile-*` and `share-truth`" → mobile runs both engines; only `share-truth` is excluded | README:122 | HIGH |
| D6 | "22 spec files, 354 tests in all" → 368 (325+4+39); the three sub-totals are right, the sum wrong | README:99 | HIGH |
| D7 | "1.8–3.3× slower" → source says 1.6–2.9× | csp-solver/README.md:106 | HIGH |
| D8 | pencil-boil "`^0.9.2`" → `^0.12.0` (existing row line-scoped, misses it) | docs/animation.md:6 | HIGH |
| D9 | `ConstraintEnum` names `Soft` (retired 0.3.0) and omits `CageSum`/`CageProduct` | docs/optimizations.md:7; docs/algorithms.md:20 | HIGH |
| D10 | "cross-game edges are convention, not lint" → `crossGameRules` = 20 lint-enforced ordered pairs | frontend README:135,143-145 | HIGH |
| D11 | "`npm run deploy` # build + wrangler pages deploy" → `bash deploy-gated.sh` | frontend README:29 | MED |
| D12 | "`npm run lint` # prettier --check src/" → adds `--config` + `scripts/ ../../scripts/` | frontend README:23 | MED |
| D13 | "tests/ integration suite (22 files)" → 23 | README:20 | MED |
| D14 | benches list 7 → 9 targets; `gac_ab` and `futoshiki` omitted | README:22-23; csp-solver/README.md:234-235 | MED |
| D15 | "`_redirects`: SPA fallback only" → two rules (the `/assets/* 404` cache-poison guard) | README:41,116 | MED |
| D16 | "zero server dependency" → `_headers` grants `connect-src wss://…workers.dev`; `web/relay` is co-deployed | frontend README:173-174 | MED |
| D17 | scripts roster names 4 of 14 files in `web/frontend/scripts/` | frontend README:52 | LOW |
| D18 | "`eslint.config.js` enforces the layering" → rules 2/3 live in `eslint.boundary.config.js` | frontend README:130 | LOW |
| D19 | root tree names `scripts/dev.sh` as the sole entry → 6 entries | README:31 | LOW |
| D20 | perf-rig README scenario sentence omits `hoverSweep`/`solveWindow` | perf-rig/README.md:104-106 | MED |

The highest-leverage gate rows collapse many of these into a class:
- **`cited-paths-exist`** — resolve every backticked source path in the docs against the `@games`/`@pencil` roots; assert `has()` each. Kills D1, D2, D3, D4 as a class.
- **`worker-topology`** — one `solver.worker.ts` exists; forbid "five workers"/"each game owns"; any "N workers" must equal the count.
- **`e2e-total-arithmetic`** — the three config totals (already derived in-gate) must sum to the "N in all" figure (368, not 354).
- **`constraint-enum-variants`** — parse `ConstraintEnum`; forbid naming `Soft` (retired) or omitting `CageSum`/`CageProduct`.
- **`frontend-scripts-roster`** / **`bench-target-roster`** / **`redirects-rule-count`** — names-any⇒names-all over each roster (D14, D17, D19; D15).
- Fix the existing `pencil-boil` row to the hot-window idiom (`i-2…i+2` around any `/pencil-boil/i` line) so it catches `^0.12.0` vs the doc's `^0.9.2` — the line-scoping is why it misses it.
- Fix the existing `chromium-alone-claim` row (`check-doc-truth.mjs:518`): its failure direction is inverted (an early return at `:534` greens the false case) and the `:521` grep scoops adjacent prose. Correct the direction and tighten the match.
**Gate 0.4 (born RED):** each new row reds against its live false claim in the table above; the 13 existing rows stay green.

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
