# PASS-1 CHARTER · NOTE-ERASE · The eraser

Section: §7 the hint note's lifecycle (and the refusal note's)
Lane port: 127.0.0.1:4249
Evidence dir: `docs/tranches/2026-08-tranche-9/evidence/w7/loop/r1/NOTE-ERASE/`

## The task

This is pass 1 (RESEARCH) of the T9-W7 convergent design loop for ONE family. Develop
this family alone, on its own terms, as far as one lane can take it: verify its
substrate on this tree, run its first prototype without touching a product file, answer
its research variable(s) with measurements, run the named instruments before and after,
and return a record and a recommendation. Do not design around any other approach; you
have not been shown one. Do not close a mark (U-10). Do not soften the idea to make it
pass: if it dies, say where and on which number.

## The idea

A margin note is pencil, and pencil leaves by being RUBBED OUT. The note's arrival is
defined (`ink-write-in`, 250 ms, `--ease-noteWrite`, fill `backwards`); it gains its
mirror — a rub-out on the same curve reversed, a short wipe from the end of the line
backward (opacity and clip only; text never boils), the erase asymmetry the laminate
already proves — collapsing to a same-frame removal under PRM. A note's LIFE is its own
kind: a HINT note ages (advice goes stale); a CONFLICT verdict does not (it is a fact
about the board and leaves when the fact does); a REFUSAL note ages fast (it answered one
act). Retraction is by the NEXT THING THAT CHANGES WHAT THE NOTE SAID: your own write,
the board leaving (deal, clear, fill, solve, Escape to the gallery — a note may not
outlive its board), a newer note. The peer-digit wipe (a peer's keystroke nulling YOUR
hint note through `applyCellValue`) becomes an authorship-and-cell test: a peer writing
elsewhere leaves your note standing; a peer writing THE CELL the note names erases it.
No dismiss control: a hand-drawn page does not get an ✕, and a 44px target is chrome a
note has not earned.

The family's research fork is THE CLOCK: (a) a note ages on a clock measured from the
reader's LAST BOARD ACTION (never from its birth, so it does not vanish while being
stared at), N beats generous, and rubs out when the clock ends; or (b) NO clock — the note
never leaves on its own; after eight beats it SETTLES to the quiet rung (`--ink-press-
quiet` 68%, 5.23:1 light / 6.06:1 dark on the card) and waits for an act. Measure both:
what a reader loses under (a) during a long think; whether (b)'s quiet rung on the phone's
16px hand face holds AA on the note's real backdrop.

## Substrate on this tree (verify first, cite file:line)

- `MarginNote.vue:147-150, :180` (`ink-write-in`; the only animation; `data-*` state hooks if any); `GameBoard.vue:614-624` (`setMargin`), `:685-707` (the falsy arm, W1 §1.2); `useGameState.ts:272` (`hintReasoning`), `:375` (`sessionSource.applyValue`), `:434, :474-497, :604, :770, :786-830` (the null sites) — the authorship test needs the write's SOURCE, which `applyCellValue` does not receive: name the seam, write the `.diff`, do not cut it here.
- `index.css` the ink-pressure ramp (quiet 68%); `scripts/check-ink-pressure.mjs`; the note's backdrop (the board's paper, both themes).
- `--ease-accelIn` (the laminate's lift, `AnswerKeyLaminate.vue:237-238`) for the wipe's curve; `pencilConfig.ts` MOTION for the beat (125 ms) if the clock is in beats.
- `GameBoard.receipt.test.ts` (the board-caption law) — the note is not a caption and may not become one.
- The refusal note (`--color-red-ink`, W1) and the conflict verdict (names the violated unit) — the three voices whose lives this family rules; W1 owns their WORDS.

## What the family must answer

1. THE LIVES — hint / conflict / refusal: each life stated (what retracts it, whether it ages), against R3's fifteen-act census; the retraction set and the survivors listed with the file:line each rides on.
2. THE CLOCK — arm (a) vs (b): born-RED rows at HEAD (opacity 1.000 after 30 s idle): (a) gone N beats after the last board action; (b) settled to 0.68 after eight beats and standing at 30 s; the reader's-long-think cost of (a) argued with a number (N) and a reason.
3. THE PEER ROWS — two live pages: a peer's digit elsewhere leaves the note standing (RED at HEAD: wiped); a peer's digit on the named cell erases it; a join leaves it; the seam the authorship test needs, as a `.diff`.
4. THE WIPE — the rub-out demonstrated over the live note by injection, frame-traced at 390×844 and 1280×800: opacity/clip only, no filter, no transform on glyphs, no text boil; ≤ one beat of residue at the quiet rung; PRM same-frame; the curve named (`--ease-accelIn`?) and its home.
5. THE QUIET RUNG — 68% on the phone's 16px hand face on the paper, light and dark: AA by painted bytes; if it fails, the settle rung moves up and the ramp's law is cited.
6. THE BOARD LEAVING — Escape to the gallery erases (a note may not outlive its board); deal/clear/fill/solve rows re-read (they replace or retract today — say which under the family).
7. ONE GRAMMAR — does the refusal note share the wipe and the conflict verdict the write-in, or does each voice age differently? State it and show one crop per voice if a number cannot carry it (prefer the table).
8. COPY — no string minted; if one is, the register and the font check.

## First runnable prototype

`page.evaluate` injecting the rub-out keyframes and the state hooks over the live `MarginNote` on your dev server, 390×844 and 1280×800, both engines, both themes; R3's `marks.probe.ts` / `marks2.probe.ts` re-run with your rows added; two pages on `?wire=local` for the peer rows; the `.diff` for the authorship seam banked, not applied (or applied only in a throwaway worktree). At most one crop per voice.

## Instruments (re-run unchanged; add rows beside them)

- `r0/r3-marks/probe/marks.probe.ts` R3-d (the note against ten non-mutating acts) and `marks2.probe.ts` R3-g (the note against the five board-changing acts) — GREEN censuses at HEAD; add your family's rows beside them, born-RED at HEAD where the census contradicts the family.
- Two live pages on `?wire=local` (R5's `probe.spec.ts` rig) for the peer rows: a peer's digit elsewhere; a peer's digit on the cell the note names; a join.
- A frame trace over the note's arrival and exit at 390×844 and 1280×800: text must not boil (opacity/clip only; no filter, no transform on the glyphs); PRM emulation collapses it to a same-frame step.
- `access.spec.ts` 2.3-style contrast on every rung the note is drawn at, both themes, on the note's real backdrop (the board's paper), light and dark.
- `GameBoard.receipt.test.ts` (the board-caption law) — read it; your family must not become a caption.
- `web/frontend/scripts/check-copy-register.mjs` and `check-font-coverage.mjs` over any string the family mints.

## Kill conditions and risk

- Ageing removes information the reader may still want, and a clock from the last action ends during a long think, exactly when a hint is most useful; a generous N is indistinguishable from HEAD on most sessions, which makes arm (a) hard to PROVE even when right.
- The authorship test is a seam change in W1's file (`applyCellValue` gets a source); the family may specify it and may not cut it.
- The quiet rung at 16px on paper may sit at the AA floor's edge.

## Census ground (read before designing)

- `r0/r3-marks/R3-census.md` §hint note (+ `logs/hintnote-chromium.json`, `hintnote2-chromium.json`, `phone-*.json`): six board acts retract or replace the note (second H, deal, clear → 'the board is clear', fill forced, solve → 'solved it!', any digit) via `GameBoard.vue:685-707`'s falsy arm off five null sites in `useGameState.ts` (:434, :487, :604, :770, :790); nine non-mutating acts leave it at opacity 1.000 (30 s idle, arrow, no-op undo, dark toggle, P, K, blur, scroll, Escape to the gallery — so a note outlives its board); a PEER's digit wipes YOUR note (`useGameState.ts:375 sessionSource.applyValue → applyCellValue → :487`); a join touches no value and leaves it standing; on the phone it is 16px Patrick Hand, 188×21 at y 523.
- `r0/r4-transition-grammar/census.md`: the note has a defined arrival (`ink-write-in 250ms var(--ease-noteWrite) backwards`, `MarginNote.vue:149, :180`) and literally no exit, no ageing, no dismissal; the erase asymmetry (`--ease-accelIn`) the laminate already proves; NO TEXT BOILS, ever.
- `r0/r6-idiom-history/R6-census.md`: the ink-pressure ramp (rule 55% = 3.53:1 light, quiet 68% = 5.23:1 light / 6.06:1 dark on `--color-card`; 60% fails at 4.10:1); the board-caption may not come back (T8-W6 M16, `GameBoard.receipt.test.ts` guards both directions); M16 register; W1 §1.2 landed the falsy arm; the conflict verdict names the violated unit (W1's truth); the refusal note paints `--color-red-ink`.
- `web/frontend/src/pencil/chrome/MarginNote.vue:147-150, :180`; `src/games/shared/GameBoard.vue:614-624 (setMargin), :685-707`; `src/games/shared/useGameState.ts:272, :375, :434, :474-497, :604, :770, :786-830`; W2 §2.5's note berth (the invite verb's note moved into the card's one berth because the scrollport could not hold it).

## Deliverables

1. `docs/tranches/2026-08-tranche-9/evidence/w7/loop/r1/NOTE-ERASE/README.md` — the lane record: what you verified on the tree (with file:line), what the prototype showed (numbers, both engines, every cell), the family's research variable(s) answered or narrowed, every instrument's reading before/after, the kill conditions met or cleared, and a one-paragraph recommendation: DEVELOP / ADJUST (how) / KILL (why), in that family's own terms.
2. Probe and instrument sources under the same dir (`probe/`), runnable, with the config they ran on. Instruments reused from `r0` are re-run, not re-written; new rows are added beside them and marked born-RED or GREEN-by-construction.
3. Crops only where a number cannot carry the claim; each cited.
4. Prototype overlays (stylesheets / evaluate scripts / `.diff`) banked under `proto/` so the next pass can replay them.

## The laws (bind every pass-1 lane; read them before the first command)

- Repo root: `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion`. Frontend: `web/frontend` (run npm/npx FROM there). The tree carries other lanes' uncommitted work: read it as the truth of the product and NEVER edit a product file (`src/`, `e2e/`, `scripts/`, docs outside `docs/tranches/2026-08-tranche-9/evidence/w7/`). Your writes go ONLY under `docs/tranches/2026-08-tranche-9/evidence/w7/loop/r1/NOTE-ERASE/` (create it) or the scratchpad.
- Prototype WITHOUT touching this tree: Playwright `addStyleTag` / `page.evaluate` overlays against your own dev server, or a static page under your evidence dir. If the family cannot be shown without a source patch, write the patch as a `.diff` under your evidence dir and apply it only in a throwaway `git worktree` under the scratchpad (never committed, removed with `git worktree remove` when done), and say so in the record.
- NEVER `git commit` / `push` / `stash` / deploy / publish; never touch bbnf-lang.
- Dev server: `npx vite --host 127.0.0.1 --port 4249 --strictPort` (your port; the 4230-4260 band only). Never :3000. No osascript, no `open -a Safari` (M19: zero focus theft). Playwright drives chromium + webkit headless on your OWN scratch config (copy `playwright.config.ts`, drop `webServer`/`globalSetup`, set `baseURL`); never the estate's default config.
- Frames: every screenshot is a CROP of the region it proves, PNG, ≤150 KB, under your evidence dir, each cited in your `.md`. The wave's bucket is capped at 2 MiB and already holds ~555 KB; bank few. Prefer measured numbers and text.
- Numbers are re-derived at citation, on THIS tree, with their viewport. The census lanes under `docs/tranches/2026-08-tranche-9/evidence/w7/loop/r0/` are your ground; say where a number moved.
- Every string you mint obeys M16 (plain English; no jargon, no metaphor, no em dashes, no machine's name) and Patrick Hand's cut (lowercase only; no `j`, no `x` in the hand face). A rendered-string change is a woff2 re-cut: price it with `node scripts/check-font-coverage.mjs`.
- filterBudget stays 9 by exact match (`src/pencil/config/filterBudget.ts`); `FILTER_BUDGET_UNION_AREA` may not grow. A drawn edge is `HandDrawnOutline :pose="0"` or pre-baked geometry, never a live filter, never a second `BoilDivider`.
- AA 4.5:1 for text and 3:1 for non-text on `--color-card` AND `--color-background`, light AND dark, read from the engine's painted bytes (canvas read-back), never hex arithmetic. The 44px tap floor holds in BOTH dimensions with a per-dimension negative control.
- The dock sheet SLIDES: settle ~700 ms before measuring an open sheet.
- U-10: this wave proposes, the owner disposes. Nothing closes here.
- Return DATA per the schema you were launched with; the narrative lives in your evidence `.md`.
