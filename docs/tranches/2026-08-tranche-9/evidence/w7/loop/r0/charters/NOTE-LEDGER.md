# PASS-1 CHARTER · NOTE-LEDGER · The ledger

Section: §7 the hint note's lifecycle (and the refusal note's)
Lane port: 127.0.0.1:4250
Evidence dir: `docs/tranches/2026-08-tranche-9/evidence/w7/loop/r1/NOTE-LEDGER/`

## The task

This is pass 1 (RESEARCH) of the T9-W7 convergent design loop for ONE family. Develop
this family alone, on its own terms, as far as one lane can take it: verify its
substrate on this tree, run its first prototype without touching a product file, answer
its research variable(s) with measurements, run the named instruments before and after,
and return a record and a recommendation. Do not design around any other approach; you
have not been shown one. Do not close a mark (U-10). Do not soften the idea to make it
pass: if it dies, say where and on which number.

## The idea

Notes are not retracted; they ACCUMULATE. The margin holds the last few notes as a
short column — newest at full ink, older ones stepping down the `--ink-press` ramp — and
a new note pushes the oldest off. Nothing an act does can wipe a note, because a note is
a record of something that happened: hints, conflicts, refusals, 'the board is clear',
'solved it!' all join the column in temporal order, so the board's history is legible in
the margin, which is what the margin of a worked problem actually looks like. The
peer-wipe defect dies by construction (a peer's digit ADDS a line, it never removes one).
'What ages a note' is answered by DISPLACEMENT rather than by a timer, so there is no
clock to tune and no note that dies while being read. The five null sites in
`useGameState` stop NULLING and start PUSHING. The ramp exists (rule 55%, quiet 68%,
full) — but the rule rung is 3.53:1, below AA for TEXT, so the honest column is two notes
at full and quiet, and the family must say whether two notes are a ledger.

The one measurement that decides it is HEIGHT: W2 §2.5 moved the invite verb's note into
the card's one note berth precisely because the scrollport could not hold it; three
lines of 16px Patrick Hand is ~63px of board-adjacent vertical space on a phone whose
board is 366px wide in an 844px viewport. If the stack does not fit without moving the
board at 390, the family is dead at 390 and survives only on the desk — a split grammar,
and B6 fired against split grammars.

## Substrate on this tree (verify first, cite file:line)

- `MarginNote.vue` (one note; its box on the phone: 188×21 at y 523, 16px Patrick Hand); `GameBoard.vue:614-624` `setMargin` (one slot today); the note's berth relative to the board and the ribbon at 390×844 and 1280×800.
- `useGameState.ts:434, :487, :604, :770, :790` (the null sites → push sites; the `.diff` shape, not cut here); `:375` (the peer path adds a line).
- The ink-pressure ramp and `check-ink-pressure.mjs`; the quiet rung's AA on the paper; the rule rung's 3.53:1 (sub-AA for text — a third line at that rung is forbidden; say what the third line is, if any: a count? nothing?).
- `GameBoard.receipt.test.ts` (the board-caption law — a column of text under the board is one step from a caption; say why it is not).
- `MarginNote.vue:147-150` (the write-in for each new line; the push motion for the older lines: one curve from the estate's `--ease-*` rows; text never boils; PRM same-frame).

## What the family must answer

1. HEIGHT — the stack at two and three lines at 390×844 (sheet shut and open, settled) and 900×500: the board's position before/after (must not move); the ribbon's; if it does not fit, the family reports death at 390 and stops.
2. THE RAMP — full / quiet / rule on the paper, light and dark, by painted bytes: the AA line drawn; the honest column depth (two? three?); what displaces the oldest.
3. THE VOICES — which notes join (hint, conflict, refusal, 'the board is clear', 'solved it!'): a column with all five in temporal order; whether a conflict verdict that is no longer true may stand in a ledger (a record vs a fact — decide it, since the conflict's truth is W1's).
4. THE PEER ROW — a peer's digit adds a line; the line's author named in the note's own voice? (a new string: the register, the font) or unnamed.
5. THE PUSH — the older lines stepping down: motion (one curve, ≤ one beat, no text boil, PRM same-frame) demonstrated by injection and frame-traced.
6. THE DESK — the column at 1280×800: does a two-line ledger read as a margin or as a log? One crop, light.
7. THE CAPTION LAW — `GameBoard.receipt.test.ts` read and the family's distance from a caption stated.
8. THE COUNT — if the third line is a count ('and 4 more'), its string through the register and the font check.

## First runnable prototype

`page.evaluate` mounting a two-then-three-line stack over the live margin (cloning `MarginNote`'s markup with the ramp applied) on your dev server at 390×844, 900×500 and 1280×800, both engines, both themes; `getBoundingClientRect` on the board, the ribbon and the stack; painted-byte AA per rung; the push motion by injection and a frame trace. One crop at 390 (the stack against the board's foot) and one at 1280.

## Instruments (re-run unchanged; add rows beside them)

- `r0/r3-marks/probe/marks.probe.ts` R3-d (the note against ten non-mutating acts) and `marks2.probe.ts` R3-g (the note against the five board-changing acts) — GREEN censuses at HEAD; add your family's rows beside them, born-RED at HEAD where the census contradicts the family.
- Two live pages on `?wire=local` (R5's `probe.spec.ts` rig) for the peer rows: a peer's digit elsewhere; a peer's digit on the cell the note names; a join.
- A frame trace over the note's arrival and exit at 390×844 and 1280×800: text must not boil (opacity/clip only; no filter, no transform on the glyphs); PRM emulation collapses it to a same-frame step.
- `access.spec.ts` 2.3-style contrast on every rung the note is drawn at, both themes, on the note's real backdrop (the board's paper), light and dark.
- `GameBoard.receipt.test.ts` (the board-caption law) — read it; your family must not become a caption.
- `web/frontend/scripts/check-copy-register.mjs` and `check-font-coverage.mjs` over any string the family mints.

## Kill conditions and risk

- It converts a quiet marginal whisper into a running log — more TEXT on a page whose personality is drawn, not written; and two notes may not be a ledger.
- Height at 390 is the kill, and the family must not move the board to survive it.
- A standing conflict verdict that is no longer true is a lie in the margin; the family must rule it.

## Census ground (read before designing)

- `r0/r3-marks/R3-census.md` §hint note (+ `logs/hintnote-chromium.json`, `hintnote2-chromium.json`, `phone-*.json`): six board acts retract or replace the note (second H, deal, clear → 'the board is clear', fill forced, solve → 'solved it!', any digit) via `GameBoard.vue:685-707`'s falsy arm off five null sites in `useGameState.ts` (:434, :487, :604, :770, :790); nine non-mutating acts leave it at opacity 1.000 (30 s idle, arrow, no-op undo, dark toggle, P, K, blur, scroll, Escape to the gallery — so a note outlives its board); a PEER's digit wipes YOUR note (`useGameState.ts:375 sessionSource.applyValue → applyCellValue → :487`); a join touches no value and leaves it standing; on the phone it is 16px Patrick Hand, 188×21 at y 523.
- `r0/r4-transition-grammar/census.md`: the note has a defined arrival (`ink-write-in 250ms var(--ease-noteWrite) backwards`, `MarginNote.vue:149, :180`) and literally no exit, no ageing, no dismissal; the erase asymmetry (`--ease-accelIn`) the laminate already proves; NO TEXT BOILS, ever.
- `r0/r6-idiom-history/R6-census.md`: the ink-pressure ramp (rule 55% = 3.53:1 light, quiet 68% = 5.23:1 light / 6.06:1 dark on `--color-card`; 60% fails at 4.10:1); the board-caption may not come back (T8-W6 M16, `GameBoard.receipt.test.ts` guards both directions); M16 register; W1 §1.2 landed the falsy arm; the conflict verdict names the violated unit (W1's truth); the refusal note paints `--color-red-ink`.
- `web/frontend/src/pencil/chrome/MarginNote.vue:147-150, :180`; `src/games/shared/GameBoard.vue:614-624 (setMargin), :685-707`; `src/games/shared/useGameState.ts:272, :375, :434, :474-497, :604, :770, :786-830`; W2 §2.5's note berth (the invite verb's note moved into the card's one berth because the scrollport could not hold it).

## Deliverables

1. `docs/tranches/2026-08-tranche-9/evidence/w7/loop/r1/NOTE-LEDGER/README.md` — the lane record: what you verified on the tree (with file:line), what the prototype showed (numbers, both engines, every cell), the family's research variable(s) answered or narrowed, every instrument's reading before/after, the kill conditions met or cleared, and a one-paragraph recommendation: DEVELOP / ADJUST (how) / KILL (why), in that family's own terms.
2. Probe and instrument sources under the same dir (`probe/`), runnable, with the config they ran on. Instruments reused from `r0` are re-run, not re-written; new rows are added beside them and marked born-RED or GREEN-by-construction.
3. Crops only where a number cannot carry the claim; each cited.
4. Prototype overlays (stylesheets / evaluate scripts / `.diff`) banked under `proto/` so the next pass can replay them.

## The laws (bind every pass-1 lane; read them before the first command)

- Repo root: `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion`. Frontend: `web/frontend` (run npm/npx FROM there). The tree carries other lanes' uncommitted work: read it as the truth of the product and NEVER edit a product file (`src/`, `e2e/`, `scripts/`, docs outside `docs/tranches/2026-08-tranche-9/evidence/w7/`). Your writes go ONLY under `docs/tranches/2026-08-tranche-9/evidence/w7/loop/r1/NOTE-LEDGER/` (create it) or the scratchpad.
- Prototype WITHOUT touching this tree: Playwright `addStyleTag` / `page.evaluate` overlays against your own dev server, or a static page under your evidence dir. If the family cannot be shown without a source patch, write the patch as a `.diff` under your evidence dir and apply it only in a throwaway `git worktree` under the scratchpad (never committed, removed with `git worktree remove` when done), and say so in the record.
- NEVER `git commit` / `push` / `stash` / deploy / publish; never touch bbnf-lang.
- Dev server: `npx vite --host 127.0.0.1 --port 4250 --strictPort` (your port; the 4230-4260 band only). Never :3000. No osascript, no `open -a Safari` (M19: zero focus theft). Playwright drives chromium + webkit headless on your OWN scratch config (copy `playwright.config.ts`, drop `webServer`/`globalSetup`, set `baseURL`); never the estate's default config.
- Frames: every screenshot is a CROP of the region it proves, PNG, ≤150 KB, under your evidence dir, each cited in your `.md`. The wave's bucket is capped at 2 MiB and already holds ~555 KB; bank few. Prefer measured numbers and text.
- Numbers are re-derived at citation, on THIS tree, with their viewport. The census lanes under `docs/tranches/2026-08-tranche-9/evidence/w7/loop/r0/` are your ground; say where a number moved.
- Every string you mint obeys M16 (plain English; no jargon, no metaphor, no em dashes, no machine's name) and Patrick Hand's cut (lowercase only; no `j`, no `x` in the hand face). A rendered-string change is a woff2 re-cut: price it with `node scripts/check-font-coverage.mjs`.
- filterBudget stays 9 by exact match (`src/pencil/config/filterBudget.ts`); `FILTER_BUDGET_UNION_AREA` may not grow. A drawn edge is `HandDrawnOutline :pose="0"` or pre-baked geometry, never a live filter, never a second `BoilDivider`.
- AA 4.5:1 for text and 3:1 for non-text on `--color-card` AND `--color-background`, light AND dark, read from the engine's painted bytes (canvas read-back), never hex arithmetic. The 44px tap floor holds in BOTH dimensions with a per-dimension negative control.
- The dock sheet SLIDES: settle ~700 ms before measuring an open sheet.
- U-10: this wave proposes, the owner disposes. Nothing closes here.
- Return DATA per the schema you were launched with; the narrative lives in your evidence `.md`.
