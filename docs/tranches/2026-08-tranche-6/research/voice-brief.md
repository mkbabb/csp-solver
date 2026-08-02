# Voice brief — the copy recut (T6 research, adjudicated 2026-08-02)

## Decision

**Winner: Design 2 (minimal-delta), with eight grafts from Design 1 and four kills.**
Every file:line claim in both designs was verified against the tree; none is phantom. Design 2
wins on the closed inventory (it names every user-facing string, including the out-of-scope
FilterTuner), on net-negative LOC (the `TECHNIQUE_ARTICLE` deletion is a real structural fix,
not copy churn), and on refusing the copy-layer both designs were tempted by — the strings are
already single-sourced at one site each, so the fix is literal edits in place. No new files, no
new props, no new exports, no dependencies.

Design 1's grafts are the ones that reduce ripple or fix a defect Design 2 itself flagged:

1. **MARK 10 phrasing** — take Design 1's `a number repeats — turn on checking to see where`
   over Design 2's `the same number twice — Ask will show where`. Design 2 listed its own
   coupling risk (the whisper hard-names the `Ask` option literal); Design 1's line names the
   act, not the button, and Design 2's own CheckStatus rewrite ("checking" vocabulary, §D below)
   anchors it. The coupling risk dies instead of being commented around.
2. **KEEP `solved it!`** (GameBoard.vue:560) — no "I" in it; kills Design 2's
   CompletionVignette sticker-width risk and the affordances.spec.ts:204/:206 text pins.
3. **KEEP `not quite — no solution from here.`** (GameBoard.vue:566) — already plain.
4. **KEEP `a fresh N×N`** (BoardHost.vue:117) — "fresh" is plain English; `a new` is churn.
5. **`something went wrong.`** for the unknown error — drop the `try again?` tail; the visible
   `try again` button (SolverErrorNote.vue) already carries the recovery. One fact per note.
6. **Divider aria** — Design 1's `New-game settings` replaces `Staged controls` ("staged" is
   workflow jargon no player owns), merged with Design 2's tail fix (`peek at` → `see`).
7. **KEEP `hold to peek`** washi — the peek chip and the keyboard legend both say `peek`;
   Design 2's `hold to see the answers` breaks that vocabulary for no gain.
8. **KEEP the gallery guard copy whole** (`leave this puzzle?` / `deal over this puzzle?` and
   all subs/buttons) — Design 1 called it the best copy in the estate; it is, and the title
   matches the `deal` button that fires it.

Kills (Design 2 rewrites adjudged ornamental under the parsimony law):

- `cards.ts` `level` → `difficulty`: a synonym swap costing five e2e pins
  (gallery-deal.spec.ts:66,128,175,499,714). "level" is plain. Dead.
- `solved it!` → `solved!`, `a fresh` → `a new`, guard-title noun swaps: dead (grafts 2, 4, 8).
- **Corrupt-link line, adjudicated cut**: keep Design 1's clause, take Design 2's sentence
  split — `this shared link couldn't be read. ${fresh}${measured}` (period, not dash). This
  kills the double-em-dash pileup Design 2 diagnosed AND preserves the exact substring
  share-truth.spec.ts:119/:128 pins with `toContainText` — zero e2e ripple. Neither design
  priced this; the tree did.

## The two marks

| Mark | Site | Current | Ship |
|---|---|---|---|
| 6 | GameBoard.vue:614 | `your pencil case is under the board` | `the controls are under the board` |
| 10 | BoardHost.vue:134 | `mark it and I'll grade` | `a number repeats — turn on checking to see where` |

Mark 6: the drawer tab literally reads `controls` (DrawerTab.vue:44); ink and tab now name one
thing. Mark 10: no first person, states the concrete fact that fired it (the `conflictsFn`
guard on the same line detects a duplicate), names the recovery in the vocabulary the CheckStatus
rewrite establishes.

## Full disposition ledger

All verdicts KEEP unless listed. **24 REWRITE sites, 0 REMOVE** — the margin-note device
survives whole; only its contrived lines die.

### A. Margin voice
| Site | Current | Verdict → text |
|---|---|---|
| GameBoard.vue:560 | `solved it!` | KEEP |
| GameBoard.vue:565 | `not quite — check row ${n}` | KEEP |
| GameBoard.vue:566 | `not quite — no solution from here.` | KEEP |
| GameBoard.vue:573 | `still sharpening the pencil…` | REWRITE → `still solving…` |
| GameBoard.vue:614 | `your pencil case is under the board` | REWRITE → `the controls are under the board` (MARK 6) |
| GameBoard.vue:647 | `a fresh page.` | REWRITE → `the board is clear` |
| BoardHost.vue:117 | `a fresh ${n}×${n}` | KEEP |
| BoardHost.vue:121 | ` — you asked for ${difficulty}` | REWRITE → ` — ${difficulty}` |
| BoardHost.vue:125 | `this shared link couldn't be read — ${fresh}${measured}` | REWRITE → `this shared link couldn't be read. ${fresh}${measured}` |
| BoardHost.vue:134 | `mark it and I'll grade` | REWRITE → `a number repeats — turn on checking to see where` (MARK 10) |
| techniqueVoice.ts:39/:42 | naked/hidden-single hint notes | KEEP (technique names are precision, not contrivance) |
| techniqueVoice.ts:47 | `no one-step reason — here's ${c}` | REWRITE → `no simple step here — the answer is ${c}` |
| techniqueVoice.ts:113 | `beyond these techniques` | REWRITE → `too hard to grade` |
| techniqueVoice.ts:115 | `needs ${article}${name}` | REWRITE → `hardest step: ${name}` — **and `TECHNIQUE_ARTICLE` (:90, 13 lines) is deleted**; the colon needs no article, closing the two-table defect the file's own pass-6 comment apologizes for |
| solveTally.ts statLine | `128 backtracks — 42ms` | KEEP |

### B. Tally a11y (techniqueVoice.ts describeTally)
| :188 | `difficulty not yet measured — deal a board to grade it` | REWRITE → `difficulty not graded yet — deal a board to grade it` |
|---|---|---|
| :196 | `difficulty — beyond these techniques (5 of 5)` | auto-follows :113 → `difficulty — too hard to grade (5 of 5)` |
| :204 | `difficulty — no technique needed` | REWRITE → `difficulty — no steps needed` |
| :212 | signature line | auto-follows :115 → `difficulty — hardest step: naked single (1 of 5)` |

### C. Error notes (classifyError.ts PAPER_NOTE_COPY)
| :46 budget | `this one's a real head-scratcher — the solver gave up.` | REWRITE → `the solver ran out of steps on this board.` (literally truer — it's budget exhaustion) |
|---|---|---|
| :47 network | `couldn't reach the solver.` | KEEP |
| :48 unknown | `something went sideways. try again?` | REWRITE → `something went wrong.` (the retry button carries the recovery) |
| SolverErrorNote.vue button `try again` | KEEP |

### D. Check status (CheckStatus.vue) — "checking" vocabulary, anchors MARK 10
| :48 | `not marking` | REWRITE → `not checking` |
|---|---|---|
| :49 | `marking as you go` | REWRITE → `checking as you go` |
| :50 | `marked — showing mistakes` | REWRITE → `checked — mistakes shown` |
| :50 | `board changed — ask again` | KEEP |
| :57–:60 sr strings | KEEP all three (already say "checking") |

### E. Control panel (GameControlPanel.vue)
| :553 | `Tap again to deal a new board` | REWRITE → `Press again to deal a new board` (rest KEEP) |
|---|---|---|
| :587 | `Staged controls above, play tools below` | REWRITE → `New-game settings above, play tools below` |
| :588 | long variant | REWRITE → `New-game settings above, play tools below — press and hold, or press K, to see the answer key` |
| :602 | washi `hold to peek` | KEEP |
| :663 | tape `teacher's` | **KEEP** — a compartment on a desk, not a speaker; the charter's own register is "teacher's-desk". With `I'll grade` dead there's no persona left to impute. Keeping it spares 4 pinned test sites (zone-grammar:68,125,589 + GameControlPanel.test.ts) |
| :686 | `Tap again to clear board` / `Clear board` | REWRITE → `Press again to clear the board` / `Clear the board` |
| :704 | aria `Fill in the forced cells` | REWRITE → `Fill in every cell that has only one possible number` |
| :708 | washi `fill forced` | REWRITE → `fill the certain cells` |
| tapes `new game`/`pencils`, rows `marks`/`candidates`, sublabels Deal/Clear/Fill/Solve/Share/Undo/Redo/Hint + `sure?`, share triad ×9, remaining arias, peek chip | KEEP all |

### F. Specs / selectors
| futoshiki/spec.ts:63–64 + kenken/spec.ts:69–70 | `Board Size`/`Board size` | REWRITE → `Size` both fields (matches the other three games; no e2e pin exists) |
|---|---|---|
| selectors.ts sizes/difficulties, all `Difficulty` headings, grammar nouns | KEEP |
| cards.ts `size`/`level` labels | KEEP (kill adjudicated above) |

### G. Gallery / chrome / cells — KEEP everything, except:
| AttributionCard.vue:66 | `CSP-powered logic puzzles` | REWRITE → `logic puzzles, solved in your browser` |
|---|---|---|
| AttributionCard.vue:77 | `View project on GitHub 🎉` | REWRITE → `View the project on GitHub` |
| index.html:14 | `Sudoku - CSP Solver` | REWRITE → `sudoku — CSP Solver` (App.vue:122 already writes exactly this on every switch; the static tag is the one dissenter) |

KEEP without exception: gallery guard ribbon + subs + buttons + alert, StagingBand verbs/arias,
GameCard/HandwrittenLogo arias, cell names (useGameCell.ts:115–133), grid label, DrawerTab +
GameScene `controls`, DarkModeToggle, ScribbleLoader `solving`, KeyboardLegend, share triad,
CompletionVignette (feeds off :560, unchanged). FilterTuner tooltips: out of scope (dev-only
overlay, never mounted in prod) — listed so the inventory is closed.

### Comment truth (rides along, one line each)
Comments quoting retired copy verbatim get trimmed so the record matches the surface:
GameBoard.vue:608, useControlsDrawer.ts:402, defineGame.ts:108, DifficultyTally.vue:264–276,
techniqueVoice.ts pass-6 article apologia (~30 lines → ~3), sudoku/spec.ts:32,34,
thermo/spec.ts:38,40, killer/spec.ts:37,39. The `requestVoice`/`gradeHint` flags and their spec
rows are untouched — only words change, no behavior.

## Files (all under web/frontend/)

| File | Change |
|---|---|
| src/games/shared/GameBoard.vue | 3 margin literals (:573, :614 MARK 6, :647); trim :608 comment |
| src/games/shared/BoardHost.vue | freshBoardCopy two clauses (:121, :125) + MARK 10 whisper (:134) |
| src/games/shared/techniqueVoice.ts | delete TECHNIQUE_ARTICLE; recut :47, :113, :115, :188, :204; trim apologia |
| src/games/shared/solver/classifyError.ts | PAPER_NOTE_COPY.budget + .unknown |
| src/games/shared/CheckStatus.vue | three status lines (:48–:50) |
| src/games/shared/GameControlPanel.vue | :553, :587–:588, :686, :704, :708 |
| src/games/futoshiki/spec.ts + src/games/kenken/spec.ts | `Board Size` → `Size` (2 fields each) |
| src/pencil/chrome/AttributionCard/AttributionCard.vue | tagline + GitHub link |
| index.html | static `<title>` |
| src/games/{sudoku,thermo,killer}/spec.ts, src/games/shared/{useControlsDrawer,defineGame}.ts, src/games/shared/DifficultyTally.vue | comment trims only |
| **Tests that follow (same commit)** | techniqueVoice.test.ts (:35, :47–:48, :58–:59, :64, :75–:80, :111–:113, :136, :143), DifficultyTally.test.ts:24, CheckStatus.test.ts (:27, :31, :35), GameControlPanel.test.ts:338 (`showing mistakes`), e2e/zone-grammar.spec.ts:595 (`not marking` → `not checking`) |
| **Tests with NO ripple (by adjudication)** | e2e/share-truth.spec.ts (substring preserved), e2e/affordances.spec.ts (`solved it!` kept), e2e/gallery-deal + gallery-guard (kills), zone-grammar `teacher's` pins (kept) |

## Price

- **LOC**: ~24 string sites rewritten in place; `TECHNIQUE_ARTICLE` −13; comment trims ~−35.
  Net **≈ −40 in src**; ~±30 assertion lines follow in unit/e2e. Zero new files, props,
  exports, or indirection.
- **Libraries**: none new. MarginNote, SolverErrorNote, SheetWashiLabel, CheckStatus,
  classifyError taxonomy all structurally untouched.

## Visual verification (the standard of proof)

Iterate on :3001 (HMR); the verdict is read on :4248 (built dist, production byte-twin).
Viewports 1440×900 and 390×844, light AND dark. Screenshots to
`/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/t6-research/`.

1. Fresh deal `?size=3&difficulty=MEDIUM` — margin: `a fresh 9×9 — hardest step: naked single`
   (or the graded signature the deal earns). Colon renders in Patrick Hand — the font-census
   spec parses the live unicode-range and gates every visible string, so a red here is the gate
   working.
2. `?game=futoshiki` — `a fresh 5×5`, no difficulty clause (`requestVoice:false` path intact).
3. Corrupt permalink `?board=zzzz` — `this shared link couldn't be read. a fresh 9×9 — medium`;
   one dash, one period, no pileup.
4. Duplicate digit on an idle sudoku — MARK 10: `a number repeats — turn on checking to see
   where`; at 390 it must hold to ≤2 lines and clear the drawer tab (46 chars — measure, don't
   assume).
5. Clear localStorage, open then close the drawer — MARK 6: `the controls are under the board`.
6. Clear a dealt board — `the board is clear`.
7. Deal 16×16 hard, Solve — `still solving…` appears after the 2.5s threshold.
8. Force a budget error — paper note `the solver ran out of steps on this board.` with the
   `try again` button; force unknown — `something went wrong.` with the button carrying recovery.
9. Cycle the teacher's control Off/Ask/Live, dirty the board — `not checking` / `checking as
   you go` / `checked — mistakes shown` / `board changed — ask again` under the `teacher's` tape.
10. Hover Fill (1440, fine pointer) — washi `fill the certain cells` clears its neighbors.
11. Hover the divider — aria (AX tree read): `New-game settings above, play tools below…`.
12. Attribution card — tagline + emoji-free GitHub link; browser tab reads `sudoku — CSP Solver`
    on a cold load of the static HTML.
13. One AX-tree pass at 1440 confirming every rewritten aria still names its control; run the
    existing a11y spec battery.

**Goldens**: margin ink is rasterized inside golden regions (drawer, affordances, zone-grammar
captures). Freeze the copy FIRST, then re-mint reds from the RUNNER artifact against built dist
per the golden discipline — never re-baseline on a single red, never mid-iteration.

## Risks

1. **String-pinned tests red the same commit** — the unit/e2e ripple table above is the
   complete pin census (grepped, not assumed); land copy + assertions atomically.
2. **Goldens diff wherever margin ink was captured** — deliberate re-mint, runner-side, post-freeze.
3. **Longer tally aria** — `difficulty — hardest step: naked single (1 of 5)` is denser to
   hear than `needs a naked single`. Fallback if a reader pass objects: drop the frame to
   `difficulty — naked single (1 of 5)` (second call shape, still no article table).
4. **390w margin width** — the MARK 10 line (46 chars) is the longest new margin string;
   verify state 4 before freeze; shorten rather than restyle MarginNote if it wraps to 3 lines.
5. **Font census** — all new codepoints (lowercase latin, `—`, `…`, `:`) should sit inside the
   Patrick Hand cut; the census spec is the enforcing gate and will say so.

## MVP cut (if phased)

- **Phase 1 — the marks and the contrivance (zero structural change, near-zero test ripple)**:
  GameBoard three literals, BoardHost three clauses + whisper, classifyError two notes,
  AttributionCard, index.html title, spec-comment trims. Ships the owner's two marks whole.
- **Phase 2 — the vocabulary recut (carries the assertion ripple + golden re-mint)**:
  techniqueVoice recut + TECHNIQUE_ARTICLE deletion, CheckStatus "checking" triad, panel
  arias/washi, Board Size → Size, unit/e2e assertion updates, golden re-mint.

Phase 2's CheckStatus rewrite is what anchors MARK 10's "checking" — if only Phase 1 ships,
MARK 10 still reads true (the act is checking regardless of the status-line verb), so the
phases are independently shippable.

---

## AUDIT RIDER (2026-08-02 — overrides the body where they conflict)

1. **Pin census completion** — six pins the ripple tables missed, all priced now:
   `e2e/mobile-affordances.spec.ts:355` (`Tap again to clear board` role-name) and
   `:404` (`Tap again to deal a new board`); `GameControlPanel.test.ts:94` (FILL
   selector const) and `:96` (CLEAR selector const); `e2e/affordances.spec.ts:283`
   (FILL aria selector — strike that file from "NO ripple");
   `e2e/zone-grammar.spec.ts:591` (`marking as you go`, same test as `:595`).
2. **`techniqueVoice.ts:196` joins the source cut** — it is a separate hardcoded
   literal, not derived from `:113`; without it, `techniqueVoice.test.ts:136` reds.
3. **The `GameControlPanel.vue:708` Fill-washi edit DIES** — controls owns that
   tape's final text (README ruling 6). Everything else in §E stands.
4. **Phases 1+2 ship together** — the CheckStatus recut rides; MARK 10's whisper
   must not name a verb no visible control uses. Site count ~29.
5. **Comment truth**: `App.vue:117` quotes the old title literal — retire it in the
   same commit as the `index.html:14` change.
