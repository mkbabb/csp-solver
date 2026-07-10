# F3 — Completion-Metadata Integration Spec

Lane: design (Fable, frontend-design invoked). Read-only audit + spec — nothing ships from this lane.
Coordinate note: `audit32/f2-completion-formulation.md` did not exist at audit time (the `audit32/` dir was created by this lane); this spec therefore states its own standalone constraints and exposes an explicit interface contract for F2 to consume (§6).

---

## 1. What exists — the audited surfaces

### 1.1 The stat-line (W6 item 4) — duplicated per game

- Derivation: `web/frontend/src/games/sudoku/SudokuBoard/SudokuBoard.vue:296-310` — computed `statLine`; `"${backtracks} ${word}${time}"`, time as ` — Nms` (<1s, floored at 1ms) or ` — N.Ns`. Byte-identical twin at `games/futoshiki/FutoshikiBoard/FutoshikiBoard.vue:350-363`.
- Render: `SudokuBoard.vue:419` — `<p v-if="statLine" :key="statLine" class="stat-line">`, deliberately **outside** the `role=status` live region ("the voice announces the grade; the tally is there for whoever leans in", `SudokuBoard.vue:417-418`). Futoshiki twin at `FutoshikiBoard.vue:485`.
- Style: `SudokuBoard.vue:475-501` — `--font-hand`, `--type-small`, `--type-leading-caption`, tracking `0.02em`, `--color-pencil-graphite` at `opacity: 0.7`, 250ms clip-path write-in, `animation: none; clip-path: none` under PRM (`:496-501`). Futoshiki twin from `FutoshikiBoard.vue:545`.
- Data: `SolveStats { backtracks, solutionCount, elapsedMs? }` (`games/sudoku/types.ts:16-20`); worker-measured wall clock, backtracks bigint→string on the wire (`solver/protocol.ts:38`, `solver/useSolver.ts:44-49,171-173`).
- Lifecycle (`games/sudoku/composables/useSudoku.ts`): set once post-solve at `:229-233` — **for both `'solved'` and `'failed'` grades** (line 227 branches the grade, stats set unconditionally after). Nulled at: init `:107`, clear `:120`, any user edit reverting the grade `:156` ("the stat-line goes stale with the grade"), randomize `:173`, solve-start `:208` ("never show a previous solve's numbers mid-solve"), hint fill `:290`, restore `:367`. Never set on the `'error'` path (the catch at `:236-246`). Futoshiki mirrors (`useFutoshiki.ts:227`).

### 1.2 MarginNote — the voice

`src/pencil/chrome/MarginNote.vue` — pencil-layer generic (renders `text` + `tone`, owns no derivation, `:10-11`). `role="status"` polite, always-mounted region (`:26`), tones `graphite | teacher-red | gold-star` (`:19`), `--type-body` / `--type-leading-caption` / tracking `0.02em` (`:33-36`), `min-height: 1.3em` line reserve (`:37`), 250ms clip wipe, instant under PRM (`:67-72`).

Voice copy is set by the board (`SudokuBoard.vue:225-254`): `solved it!` (gold), `not quite — check row N` / `not quite — no solution from here.` (red), `still sharpening the pencil…` (graphite, 2.5s slow-solve timer), fresh-board graphite copy (`:259-283`); marginalia stays silent on `'error'` — that's the paper note's domain (`:251-252`).

### 1.3 SolverErrorNote — the paper note

`games/sudoku/SudokuBoard/SolverErrorNote.vue` — `role="alert"`, HandDrawnOutline card, teacher-red `--type-body` text (`:64-71`), retry button at `--type-small` (`:73-77`), slide-in / PRM fade (`:96-120`). Shows only on `solveState === 'error'` (`SudokuBoard.vue:286`). Not a metadata surface — F3 leaves it untouched except spacing constraints (§4).

### 1.4 The collision (owner shot `solved-star.png`)

Two anchors claim the same corner below the board:

- `CelebrationStar.vue:126-134` — `position: absolute; left: 0.25rem; top: calc(100% + 0.25rem); width/height: 3.25rem; z-index: 3`, child of `.board-wrapper` (`SudokuBoard.vue:408`).
- `.board-margin` (`SudokuBoard.vue:451-470`) — stacked (<lg): in-flow, `margin-top: 0.4rem`; row regime (≥lg): `position: absolute; top: 100%; inset-inline: 0.25rem; z-index: 50`, child of `.board-shell`.

The note strip paints over the star (z 50 vs 3) but occupies the same 3.25rem square: the shot shows the star glyph tangled through "solved it!" with the graphite stat-line running beneath. Geometric by construction in both regimes — the star grows down-right from the exact origin the voice writes from (the H6 enlargement 2.5→3.25rem, `CelebrationStar.vue:123-125`, widened the overlap).

---

## 2. Design position

The completion metadata is **marginalia about marginalia** — the pencil's own tally under the teacher's verdict. Three principles fall out of the existing fiction:

1. **One margin, one composition.** The verdict, the sticker, and the tally are a single below-board annotation block, not three absolutely-positioned strangers. The collision is not a nudge-the-star bug; it's the symptom of two anchor systems.
2. **The tally is always graphite.** Gold and red belong to the verdict alone. The meta line never inherits tone — it's the same pencil hand whether the grade is a star or a red mark. (Current behavior already agrees: `.stat-line` is unconditionally graphite.)
3. **The tally is never announced.** Keep it outside the live region (the deliberate W6 choice, `SudokuBoard.vue:417-418`). AT hears the grade; the tally is legible to whoever navigates to it.

---

## 3. The spec

### 3.1 Structure — hoist the star into the margin block

Retire the star's independent `.board-wrapper` anchor. The completion block becomes one two-column composition inside `.board-margin`:

```
.completion-note                    (replaces the loose MarginNote + stat-line pair)
├─ [sticker slot]  3.25rem square, present only when tone === 'gold-star' & celebrating
└─ [text column]
   ├─ voice   — MarginNote (unchanged component, role=status)
   └─ meta    — the tally line (outside the live region)
```

- Grid: `grid-template-columns: auto 1fr; column-gap: 0.5rem; align-items: start`. Sticker slot collapses (`display: none` → no reserved gap) when absent, so graphite/red states are visually identical to today.
- `CelebrationStar` becomes `position: static` within the slot (keep its draw-on + gleam internals verbatim — `CelebrationStar.vue:52-90` is sound; only the scoped `.celebration-star` positioning block `:126-134` changes). The star is now the foil sticker stuck **beside** the verdict — the grade-school fiction sharpened, and the collision impossible by construction in both layout regimes.
- Stacked (<lg): the block is in flow (current H9 behavior, `SudokuBoard.vue:351-356`) — the sticker adds real height, which is correct there. Row regime (≥lg): overlay strip as today, no layout shift.

### 3.2 Type scale — the golden rungs

Current flaw: voice `--type-body` (16→22px) vs tally `--type-small` (14→20px) — 2px apart at both clamp ends (`typography.css:32-33`), a hierarchy too flat to read as hierarchy (visible in the owner shot: the stat-line reads nearly as loud as the verdict).

| Line | Size rung | Leading | Tracking | Cite |
|---|---|---|---|---|
| voice (verdict) | `--type-body` (16→22px) | `--type-leading-caption` (1.3) | `0.02em` bespoke hand voice | `MarginNote.vue:33-36`; bespoke tracking documented `index.css:365` |
| meta (tally) | **`--type-caption`** (12→16px) | `--type-leading-caption` (1.3) | `--type-tracking-wide` (0.025em) | rungs `typography.css:31,51,63` |

Drop the tally two nominal rungs (body → caption, skipping small): at clamp extremes that's 16/12 = 1.33 and 22/16 = 1.375 — a legible subordination in the clamp cascade's own grammar (the sub-φ rungs are a +2px cascade, not strict φ; forcing `body/φ ≈ 13.6px` would mint an off-scale size, which F2's golden formulation should not do). `--type-micro`/`--type-admin-label` (`typography.css:27-28`) are too small for the hand face at grid distance — rejected.

### 3.3 Tone

- Voice: existing tone tokens — `--color-gold-star` (→ crayon-green `#2DC653`/`#3DD968` dark), `--color-teacher-red` (→ crayon-rose), graphite (`index.css:143-156, 205-206`).
- Meta: `--color-pencil-graphite`, but replace `opacity: 0.7` (`SudokuBoard.vue:482`) with `color-mix(in srgb, var(--color-pencil-graphite) 62%, transparent)` — opacity on the element also fades the clip-wipe reveal and any future inline glyphs; color-mix keeps "reduced pressure" a property of the ink, not the layer. 62% keeps ≥ current perceived weight; verify AA (4.5:1) against `--color-card` in both themes at implementation (graphite = `--grid-line-color`, theme-dependent).
- **solver-ink is not a metadata tone.** "Solver-ink" names the solved-cell fill fiction (`useSudoku.ts:286`, `cellKind 'solved'`, `SudokuCell.vue:71-85` — the pastel-gradient digits in the owner shot). It lives on the board; the margin never borrows it. Rejecting a gradient tally line is a deliberate call: the tally is the pencil, not the solver's pen.

### 3.4 What shows when — the state matrix

| Scenario (derivable today) | Sticker | Voice | Meta | Cite |
|---|---|---|---|---|
| Solve, new cells filled | ★ draws at crest | gold `solved it!` | graphite tally | trigger `SudokuBoard.vue:115-126` |
| Idempotent re-solve (already solved, 0 new cells) | none (fanfare skipped today — keep) | gold `solved it!` | graphite tally (stats are fresh, `useSudoku.ts:229`) | `SudokuBoard.vue:113-114` |
| Validate-by-solve on a full board | = one of the two rows above; **no distinct validate flow exists** — `solve()` is the only grader (no validate/check symbol in `useSudoku.ts`/`App.vue`, grep §1.1) | | | |
| Failed (provable UNSAT) | none | red `not quite — check row N` | **graphite tally, shown** — stats are set on `'failed'` (`useSudoku.ts:227-233`); the search effort of the refutation is honest metadata and never turns red | |
| Solving | none | graphite slow-solve line after 2.5s | none (nulled at solve-start, `useSudoku.ts:208`) | `SudokuBoard.vue:240-244` |
| Error (budget/timeout/worker) | none | silent | none (never set on catch) — paper note (`role=alert`) owns the moment | `SudokuBoard.vue:251-252, 286` |
| Grade reverted (edit/hint/randomize/clear/restore) | reset | cleared per stale-note rule | cleared (all seven null sites, §1.1) | `useSudoku.ts:107,120,156,173,208,290,367` |

### 3.5 Copy

- Keep the plain-count formulation as default: `0 backtracks — 1ms`. Optional storybook variant for F2's consideration, zero-backtrack case only: `straight through — 1ms` (truthful — 0 backtracks means propagation alone carried it; charming in the fiction; the count form stays for N ≥ 1). Either way the separator stays the spaced em dash of the current line — inside the hand-lettered margin it reads as a penciled aside, and changing it is not this lane's call (flagged: the owner's prose style is unspaced em dashes).
- Pluralization + ms/s thresholds as implemented (`SudokuBoard.vue:302-309`) are correct; keep.
- `solutionCount` stays unrendered (it's `max_solutions = 1` — trajectory-dependent first solution per CLAUDE.md; surfacing "1 solution" would imply a uniqueness claim the engine didn't make).

### 3.6 PRM

Nothing new moves. Voice + meta share the 250ms clip wipe (Band C one-shot); under PRM both are `animation: none; clip-path: none` (already true: `MarginNote.vue:67-72`, `SudokuBoard.vue:496-501`). Star: instantly drawn, no gleam (already true: `CelebrationStar.vue:61-65, 182-187`) — the hoist changes its anchor, not its motion. Meta arriving in the stacked regime shifts layout exactly as it does today; the row regime is an overlay, shift-free.

### 3.7 A11y

- Voice stays the sole `role=status` content; meta stays plain text outside it (keep the W6 rationale verbatim).
- Star stays `aria-hidden="true"` (`CelebrationStar.vue:104`) in its new slot.
- The meta line should not be `user-select: none` — the current `.stat-line` blocks selection (`SudokuBoard.vue:483`); a tally someone leans in to read is a tally someone may copy. Drop it (MarginNote's own `user-select: none` at `:40` can stay — verdicts aren't data).

---

## 4. Consolidation mandate (NO-duplication)

`statLine` computed + `.stat-line` CSS + the margin markup are byte-identical across the two boards (§1.1). The gestalt move: extend `MarginNote.vue` with an optional `meta?: string` prop rendered as the second line **outside** the status region — the pencil layer stays derivation-free (meta arrives preformatted, same contract as `text`), both games delete their twins, and the tone/type/PRM rules live in exactly one file. Pass-1 R5 already classes MarginNote as legitimately atomic chrome (`pass1/R5-fe-structure-audit.md:122`) — this deepens it without domain leakage. The sticker slot lands in the boards' `.board-margin` (it needs `celebrating`, a board concern), wrapping MarginNote — or F2 may prefer a `CompletionNote` chrome molecule composing star + MarginNote; either satisfies §3.1.

## 5. Defects for the tranche ledger

1. **Star/voice collision** — both anchored to the below-board top-left corner (`CelebrationStar.vue:126-134` vs `SudokuBoard.vue:451-470`); owner-confirmed (`solved-star.png`). Fix = §3.1 hoist.
2. **Flat voice/tally hierarchy** — body vs small are 2px apart across the clamp (`typography.css:32-33`). Fix = §3.2 caption rung.
3. **Verbatim duplication** across SudokuBoard/FutoshikiBoard (computed, CSS, markup). Fix = §4.
4. Minor: `.stat-line` `user-select: none` (§3.7); element-level `opacity: 0.7` vs ink-level color-mix (§3.3).

## 6. Interface contract for F2 (golden formulation)

F3 requires of F2's completion block, whatever its final shape:
- Two text rungs exactly: verdict at `--type-body`, meta at `--type-caption`, shared `--type-leading-caption` — no minted off-scale sizes.
- A sticker slot (3.25rem, `aria-hidden`) inside the margin composition, gold-star tone only; no absolutely-positioned siblings anchored to `.board-wrapper`'s bottom edge.
- Meta is tone-invariant graphite, present on `solved` and `failed`, absent on `solving`/`error`/`idle`, sourced solely from `SolveStats` (no new wire fields needed — everything renders from `backtracks` + `elapsedMs`).
- Live-region topology unchanged: one `role=status` (verdict), one `role=alert` (paper note), meta in neither.
