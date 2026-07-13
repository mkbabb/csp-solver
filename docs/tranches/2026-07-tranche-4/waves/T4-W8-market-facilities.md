# T4-W8 — Market facilities

**The one affordance every serious sudoku client ships and we lack: a place for the player to reason on the board. A solver can't play the game for you — give the board editable pencil marks, a mistake-check mode the player chooses, persistent candidates, and peer highlighting, all game-agnostic in `games/shared/`.** These are x1's Tier-1/2 wins — cheap because they ride facilities the engine already exposes (`findConflicts` is a pure derivation; `propagateBoard` already computes candidates; marks already render). The market's monetization noise — hearts, streaks, mistake-limits, forced login — is our contrast; this wave adds table stakes and, on the record, retires the engagement stack that clashes with the calm, ad-free, permalink-stateless product (ballot B3).

**Dependencies**: ← W7 (the fill-forced partial-solve button consumes W7's naked+hidden-single detector; the rest of the wave is W7-independent — it rides existing derivations). ∥ W9 (both after W7; no shared surface except the honesty spine). **Effort**: M.

---

## Scope

### ROW 1 — editable user pencil marks (corner/center) · A1 + A8

Today's marks are **engine-domains only, non-editable, peek-gated** — `usePencilMarks.ts` renders the solver's propagated surviving candidates (root AC-3/GAC, zero search), visible only while hold-to-peek is held, no corner/center split, no user authorship (`usePencilMarks.ts:1-30`; render `SudokuCell.vue:142-165`). The player has nowhere to think.

- A **user-mark store in `games/shared/`** beside the engine marks — game-agnostic by construction, both games mount it. A pencil-mode toggle; **corner vs center** placement (Snyder notation, the setter-grade standard in SudokuPad/f-puzzles). Distinct visually and in the store from the engine's peek marks — the two never collide (engine marks are the solver's domains; user marks are the player's notes).
- The corner/center split (A8) is the setter-grade nicety and rides A1's store — one component, two placement slots, not two implementations.

### ROW 2 — error-check MODE choice (off / on-demand / live) · A3

Today conflicts fire **only after a Solve grades wrong** — `findConflicts` is already a pure row/col/box duplicate derivation (`conflicts.ts`), but it is gated on `solveState === 'failed'` (`SudokuBoard.vue:185`). No live mode, no toggle, no as-you-go. The market norm is a **user-chosen mode**, and turning it *off* is itself promoted as skill-building.

- A **3-state setting** in `games/shared/` — **off** (train yourself) / **on-demand** (check-anytime) / **live** (as-you-go). Ungate `findConflicts` from the `'failed'`-only gate; feed the same pure derivation at the chosen cadence. The cheapest high-value win in the assay.
- **Honor the market lesson: default to on-demand, never a mistake-counter.** No hearts, no lives, no 3-mistakes-and-out (§B3 preserves this as a design law).

### ROW 3 — persistent auto-candidates toggle · A2

`propagateBoard` already exists (`useSolver.ts:217`) but its display is **peek-only** — the marks vanish on release. NYT ships "Show Candidates" as a persistent, opt-in overlay and flags the cost ("can clutter the grid / massive visual noise").

- Ungate the existing engine-domain marks behind a **persistent toggle** — no new compute, a UI gate change. **Keep opt-in** (the NYT clutter lesson; the peek-gating already gets this right). This is orthogonal to ROW 1's *user* marks — one shows the engine's domains, the other the player's notes.

### ROW 4 — peer-unit highlight on selection · A14

Selecting a cell highlights nothing but conflict/reveal tints today. The market highlights the related row/col/box on selection to aid scanning.

- A **pure derivation over `focusedPos`** — a faint pencil wash over the active unit (row + col + box for sudoku; row + col for futoshiki). Game-agnostic; low cost, high everyday utility.

### ROW 5 — attribution parity + the third-party fetch localized · FAM-14

`AttributionCard` is **sudoku-only** and is the app's **sole third-party network hit** (FAM-14, r2). A share-centric offline-leaning app should not reach the network per-game, and futoshiki has no attribution card at all.

- **Parity** — futoshiki gets the attribution surface too (both games or a game-agnostic mount).
- **Localize the third-party fetch** — the sole outbound hit is bundled/self-hosted, removing the app's only per-game network dependency. (Ties to W3's no-telemetry-by-design declaration and the browser-support matrix.)

### ROW 6 — non-goal retirements · ballot B3 (DECIDED, pending owner word)

The engagement stack demands dated-puzzle infra + persistent identity + a competitive frame that clashes with the calm, ad-free, permalink-stateless product. Retire on the record with rationale — **do not re-book** (M2/M6 forbid the silent drop). DECIDED rows, ratified at B3:

| Affordance | x1 | Rationale | Disposition |
|---|---|---|---|
| **Dailies / streak / calendar** | A12 | Needs dated-puzzle infrastructure + persistent identity; the streak-pressure frame is the engagement stack we define ourselves against. | **DECIDED-retire** (owner may elect at B3) |
| **Statistics / leaderboard / trophies** | A13 | Competitive/monetization-adjacent; clashes with the calm, ad-free product; needs persistent identity our stateless `?board=` model doesn't carry. | **DECIDED-retire** |
| **Pressure timers** | A11 | A countdown clashes with the calm pencil idiom. If the owner elects a timer at all, it lands **off-by-default and non-punitive** — never a mistake-limit. | **DECIDED-retire** (elect → off-by-default) |

**Preserve as differentiators, not gaps** (declared, not built): A15 accessibility (ARIA grid + roving tabindex + live regions + DigitPad — a genuine market lead), A16 permalink/auto-save (at/above market), A17 ad-free / no-mistake-limit / no-forced-login (a design law). The market's monetization noise is our contrast; guard it.

---

## Gates

Verbatim. Born RED wherever the defect is live at this wave's base SHA.

| Gate | Value |
|---|---|
| Headline | the player can author editable corner/center marks; choose an error-check mode (off/on-demand/live); toggle persistent candidates; see the selected cell's unit highlighted — all in `games/shared/`, both games, no per-game reimplementation; the B3 non-goals carry DECIDED rows |

Component checks:

| Gate | Value |
|---|---|
| editable marks (**born RED**) | today `usePencilMarks.ts` marks are engine-domains-only, non-editable, peek-gated (`:1-30`, `SudokuCell.vue:142-165`) — the player cannot write a note. After: a user-mark store in `games/shared/`; pencil-mode toggle; corner and center placement; user marks distinct from the engine's peek marks. |
| error-check mode (**born RED**) | today conflicts fire only when `solveState === 'failed'` (`SudokuBoard.vue:185`) — no live mode, no toggle. After: a 3-state setting (off/on-demand/live) over the same pure `findConflicts`; default on-demand; no mistake-counter. |
| persistent candidates (**born RED**) | today `propagateBoard` marks show only while peek is held (`usePencilMarks.ts`). After: a persistent, opt-in toggle un-gates them; default off (NYT clutter lesson). |
| peer highlight (**born RED**) | today selection highlights no related unit (only conflict/reveal tints, `x1:82`). After: a faint pencil wash over the focused cell's row/col/box (sudoku) or row/col (futoshiki), pure over `focusedPos`. |
| attribution parity (**born RED**) | today `AttributionCard` is sudoku-only and the app's sole third-party network hit (FAM-14). After: both games carry attribution; the outbound fetch is localized — zero per-game third-party network dependency. |
| game-agnostic | every facility lands in `web/frontend/src/games/shared/`; the diff adds identical wiring to `FutoshikiBoard.vue` and `SudokuBoard.vue` — no second implementation. |
| B3 non-goals | dailies/streaks, stats/leaderboard, pressure-timers each carry a DECIDED-retire row with rationale in the tranche ledger; none is silently dropped; if a timer is elected it is off-by-default + non-punitive. |

**π/DELTA** (the facilities are visible):
- **π (editable marks)**: golden capture of a cell carrying user corner marks + center marks, distinct from an engine peek mark; compare against the born-RED capture (no user marks possible).
- **DELTA (error-check live)**: before = board accepts a duplicate silently until Solve; after = live mode red-ghosts the duplicate as-you-go. One pair banked.
- **DELTA (peer highlight)**: before = selection highlights nothing; after = the unit wash appears on `focusedPos`. Both games.
- **DELTA (attribution parity)**: before = sudoku-only card; after = futoshiki card present, fetch localized (network panel shows zero third-party hit).

## Seeds

- `x/x1-market-assay.md` — the affordance matrix (A1/A2/A3/A8/A14 anchored OURS vs best-in-class), the KISS-weighted shortlist (Tier 1 cheap wins, Tier 2 table stakes), §4 explicit non-goals (A11/A12/A13, "decide, don't re-book"), §preserve-as-differentiators (A15/A16/A17), the monetization-noise-to-avoid census.
- `x/x3-hint-heuristics.md` §partial-solving — fill-forced-cells is R1's detector (W7 owns it; this wave wires the button).
- FAM-14 (r2, `registry/families.md:85`) — `AttributionCard` sudoku-only + the app's sole third-party network hit; no-telemetry-by-design undeclared (ties W3).
- Anchors verified at base SHA: `usePencilMarks.ts:1-30`, `SudokuCell.vue:142-165`, `conflicts.ts` + `SudokuBoard.vue:185` (`'failed'` gate), `useSolver.ts:217`, `x1-market-assay.md:33` (no peer highlight / no board-fill / no technique names).

## Residual risks

- **Two mark systems must not collide** — engine peek marks (the solver's domains) and user marks (the player's notes) share the cell but mean different things. The store separates them; the render distinguishes them (tone/placement). The editable-marks gate asserts a user mark survives a peek toggle and an engine-mark refresh unchanged.
- **B3 is an owner ballot, not a fait accompli** — the retirements are DECIDED-recommended, ratified at B3 (recommendation: retire all three; elect → off-by-default timer). If the owner elects any, it lands under the preserved design laws (no mistake-limit, off-by-default), never the market's punitive form.
- **The localized fetch must not regress attribution content** — bundling the third-party asset removes the network hit but must preserve the credited content and the OFL/license obligations (ties W0/W14 font-license shipping).
- **Live error-check is a cadence change, not new logic** — `findConflicts` is already pure; the risk is only the re-eval frequency on the hot input path. Default on-demand keeps live opt-in; profile the live cadence against the E7 idle-paint invariant if it ships enabled.
- **fill-forced belongs to W7** — do not duplicate the naked+hidden-single detector here; W8's partial-solve button calls `games/shared/techniqueEngine.ts`.

## Execution record (2026-07-13)

Workflow `wf_7690e767-28a`, 4 lanes (M1 editable marks ∥ M2 modes: error-check + persistent candidates + peer wash ∥ M3 parity: attribution localization + fill button + B3 rows → adversarial VERIFY vs built dist :4188). Verify verdict: **RED — one blocking regression**: all seven feature gates green individually, but the two new control rows grew the desktop card to **936 px** against an 800 px viewport (W8 +417 px: pencil-mode-toggle 149 + assist-settings 268), pushing the wordmark to y=−127 and redding 6 e2e specs + the darwin `logo-light` golden from one root cause.

**Seal fix (team lead, `scene.css`)**: `max-height: calc(min(42rem, 85vw, 100dvh - 10rem) - 2rem)` + `overflow-y: auto` on `.controls-card` — the cap derives from the boards' OWN row-regime side (SudokuBoard/FutoshikiBoard shellClasses), not a dvh constant. Probe-measured why the constant failed: the 42rem arm binds on tall viewports (board 672 px at 1440×900), so a `100dvh − 12rem` cap (708 px) still out-grew the sheet and redded the drawer's never-above-the-sheet contract by 14 px. The board-derived cap seats the rail 16 px inside the sheet's top edge at every viewport. After: **e2e 61/61 · goldens 4/4** — `logo-light` self-resolved with NO re-baseline, exactly as verify predicted.

| Gate | Born-RED | Close |
|---|---|---|
| editable marks | `useUserMarks.ts` absent; engine-domains-only, non-editable | corner/center Snyder notes authored per cell, two-slot split; user notes survive a full engine pin/unpin cycle AND the ref-identity collision gate (peek→refresh→re-peek) |
| error-check mode | conflicts gated `solveState==='failed'` only | 3-state over the same pure `findConflicts`: default **on-demand silent** → Ask arms a snapshot → an edit disarms → live as-you-go persists; NO mistake counter anywhere in the DOM |
| persistent candidates | engine marks peek-only | default OFF; On → 46 cells marked persistently, no gesture held; user notes coexist throughout |
| peer highlight | no peer wash (`peerCells` absent) | pure over `focusedPos`, focus-gated: sudoku 0→20→0 (row+col+box), futoshiki 0→8→0 (2·(n−1), Latin square) |
| attribution parity | sudoku-only card; `avatars.githubusercontent.com` = the app's sole third-party hit (FAM-14) | zero third-party hits (67 reqs all same-origin/data:); avatar BUNDLED (`avatar.png` via `.gitignore` negation, Vite-emitted content-hashed); CSP `img-src` allowance retired from `_headers`; futoshiki card present ("CSP-powered logic puzzles") |
| fill-forced (W7 seam) | whole-board or one-cell, no middle | button drives W7's `fillAllForced` — grep proves no second detector; sweep animates (+5 reveal-animated), stops at Δ0 both games; Share recut 4th→5th action icon (`share-truth.spec.ts`) |
| game-agnostic | — | all facilities in `games/shared/` (`useUserMarks`, `useAssists`, `PencilModeToggle.vue`, `AssistSettings.vue`); identical wiring both boards; no second implementation |
| B3 non-goals | — | A12 dailies/A13 stats/A11 timers each carry a DECIDED-retire row + re-entry criteria (`m3-parity.md`); A15/A16/A17 preserved; nothing silently dropped |
| battery (π) | — | vue-tsc 0 · unit 244/244 (21 files; +41 W8) · eslint 0 · knip 0 · prettier clean · build 0 (avatar emitted 6.09 kB same-origin) · e2e 61/61 vs dist · darwin goldens 4/4 · E7 idle-paint: live-on == baseline (0 layouts / 40 recalcs) · mobile smoke (iPhone 13 coarse) all facilities by touch |

Seal reconciliations: `avatar.png` explicitly `git add`-ed (the negation alone doesn't stage it — a fresh clone would 404). The B3 ballot books to the owner. The T4-WU re-partition (staged/live zones) owns the panel's real-estate redesign; the cap is the layout-safety floor beneath it.
