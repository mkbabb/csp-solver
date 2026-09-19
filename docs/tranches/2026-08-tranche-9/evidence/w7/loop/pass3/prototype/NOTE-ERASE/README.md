# NOTE-ERASE · pass-3 prototype — THE SETTLED NOTE LEAVES

Worktree `.claude/worktrees/wf_f72f3b5a-83a-47`, branch `agent/wf_f72f3b5a-83a-47`, cut from
`74a2b5d9`. RUNS on the real surface: prototype server `:4248`, HEAD control `74a2b5d9` on
`:4247`, both killed, band re-scanned free of this lane. Nothing committed. Evidence 272 KB.

## The replay

`git` aimed at the pass-2 worktree was refused by the isolation (both `-C` and a `cd`), so the
route was the chair's stated fallback, one better: the pass-2 record banks its own whole delta at
`pass2/prototype/NOTE-ERASE/note-erase-p2.diff` (973 lines, 12 files), and that applied with
`git apply --3way` onto `74a2b5d9` — **twelve files, all clean, zero conflicts**. Fidelity
checked file by file against the live pass-2 worktree: **ten byte-identical**; `BoardHost.vue`
(32 diff lines) and `GameBoard.vue` (97) differ by exactly the fold's own hunks, which the
3-way kept — `cellAuthors`, the coarse tape's focus law, `onGridFocusout` (3C-4b) all present
after the replay. The two untracked pass-2 test files were copied from the same bank.

## What pass 3 changed, and what each half buys — MEASURED

Pass 2's settled exit was broken twice. Both halves are here, and the live controls separate
them: **each cures one defect, and neither cures the other.**

| live control (source deleted, HMR re-served, restored) | drop clock | restored-ink frames |
| --- | --- | --- |
| **as built** (both halves) | **156.5 ms** | **0** |
| the compound clock deleted, the rest pose kept | 363 ms | 0 |
| the rest pose deleted, the compound clock kept | 165.6 ms | 0 |
| both neutralised (`!important`, in-page) — pass 2's shape | 370.3 chromium / 382 webkit | **29 chromium / 15 webkit** |

So the spec's sentence needs one correction, carried as an objection, not a diff: the
`.note-leave-to` rest pose is **not** "the load-bearing half" on its own. The compound selector
is what fixes the CLOCK (363 → 156 ms); the rest pose is what fixes the POSE, and its number only
appears once a transition outranks the rub-out. Together they read 156 ms and 0 restored frames;
apart, each still reads 0 restored frames, because the other one is holding that end up. The
spec's own parenthesis ("arm C alone still reads 0 restored frames") is confirmed exactly.

## The gates

| gate | reading | verdict |
| --- | --- | --- |
| G1 exit, BOTH states | fresh gone **156.0** chromium / **174** webkit from the press; settled **160.7** / **167**; `animation-name` `ink-rub-out, ink-rub-out-fade`; 0 post-verb `clip-path: none` frames | GREEN |
| G2 rest pose | in the built dist: `.note-leave-to[data-v-6954e57d]{clip-path:inset(0 100% 0 0);opacity:0}`; deleted at source the ink stands back up only once the clock rule goes too (29/15 frames) | GREEN, with the split above |
| G3 no literal, no fallback | `var(--motion-*,` = **0** in MarginNote.vue, index.css, GameBoard.vue and the built CSS (HEAD 4 in MarginNote); no `\d+m?s` anywhere in the SFC, comments included (three comment literals were re-worded to name rungs) | GREEN |
| G4 PRM at the site | static block present (enter + leave `animation: none`, the age rule `transition: none`); live `animationDuration 0s`, `transitionDuration 0s`, rungs `0s`, node gone **17.5 ms chromium / 43–49 ms webkit** (2–3 frames) | GREEN |
| G5 rungs consumed | `MOTION.note` holds two waits and nothing else; three rungs read bare. **The ladder itself is in this tree as a declared §13 GRAFT** (see gaps) | GREEN by declaration |
| G6 the repeat, one beat | margin `[X, '', X]`, hole **133.4 ms chromium** (was 13); `ink-rub-out` starts **once**; the board's voice **123.6 chromium / 127 webkit** (was ~0) | GREEN |
| G7 delete the publisher → the exit reds | `publisherNodes 0`, `--motion-whisper` computes to **empty**, `distinctClipStates 1`, node gone **19.5 ms**, 2 frames of standing ink — the note vanishes with no verb | GREEN (row I, not row E — see gaps) |
| G8 gap 8 | `applyHintInk` gains `if (origin === "self") lastRefusal.value = null`; unit row "your own REVEAL retracts the refusal it answers" | GREEN |
| G9 the park per kind | reply: fold starts 217.8 chromium / 240 webkit after `g`, empties at 380.3 / 420 — **gap 162.5 / 180 ms**, one rub-out + a frame. record: never empties, reads in the folded card at 300.18 × 11.21 | GREEN, re-clocked |
| G10 G-hold | present at 23 beats, `""` after 24 + whisper; `3000 ≥ 2582` as a unit row | GREEN |
| G11 seam required | bare `applyCellValue` → `useGameState.ts(535,21): error TS2554: Expected 3 arguments, but got 2`; bare `applyHintInk` → `(777,5)` same; clean tree `vue-tsc` exit 0 | GREEN |
| G12 verdicts never settle | `AGES = ["record", "state"]`; the gate's own painted witness NOT re-measured this pass | OWED |
| G13 no fill, no filter | `filterBudget.ts` untouched, `FILTER_BUDGET` total **9** over four rows; `FILL_ALLOWLIST` gains nothing | GREEN (config half) |
| G14 frame bar | chromium 20–21 distinct clip states against a bar of 18–19; webkit 10–11 against 10 | GREEN |
| G15 gateNote carries the consumer | this family's `check-ink-pressure.mjs` hunk DELETED and handed over as `instruments/gateNote-handoff-to-NOTE-LEDGER.diff` | HANDED, not assertable here |
| G16 the (0,1,0) audit | during a SETTLED leave, computed `transition-duration` **`0s`** with `data-note-age="settled"` on the element, both engines, both viewports | GREEN |
| G17 refusal vs peer | the hold arm ran on both engines; the PEER arm did not reach the wire | OWED |

## π against `74a2b5d9`

Board, controls card and `scrollHeight` deltas across empty → fresh → settled → mid rub-out →
parked-and-back: **0 at 390×844 and 0 at 1280×800**, on the prototype AND on the HEAD control.
The one non-zero is the strip's own box at 1280, `empty→fresh` **2.81 px** — and the HEAD control
reads the same 2.81, so it is HEAD's (`.margin-note-block{min-height:1.3em}` is 1.3em of the
block's inherited 16 px = 20.8, while the voice sets `--type-body` 18.18 → 23.61). Reported as a
reading, not a delta; `docH` is 0 either way, so nothing below the strip moves.

`filter: none` and `transform: none` on the span and every ancestor through the verb, all four
P1 rows, both engines.

## Censuses

- **R6 hue census** (r0 copy, SUBJECT re-pointed at this worktree, OUT into `census/`):
  `diff` against `r0/r6-idiom-history/hue-census-HEAD.txt` is **empty — byte-identical**. R6 row
  **UNMOVED**; this family mints no colour.
- **Mechanical estate, all exit 0**: `lint:ink`, `lint:copy` (0 em dashes, 0 unadmitted jargon,
  0 admissions), `lint:motion` (34 specs), `lint:live-regions` (10 regions, 0 born speaking),
  `lint:theme-selectors`, `lint:theme-tokens` (52 declared, 0 unreferenced), `lint:sleep`.
- **vitest**: `src/games/shared` + `src/pencil/chrome` = **43 files, 511 tests, all passing.**

## Gaps, every one

1. **The ladder is a graft, and G5 is green only by declaration.** MOT-LADDER's pass-3 diff does
   not exist yet, so there was nothing to copy. `MOTION.rungs` + `publishMotionRungs()` are in
   this tree, re-cut to §13's pass-3 shape (`@property … initial-value: 0ms` ×6, emitted by the
   same publisher, PRM arm beside it) and bannered as §13's. They fold with §13, never with §7.
   The `rise` rung is MOT-LADDER's ballot and was not landed.
2. **G7 fires as row I, not row E.** In this tree the registration rides the same publisher, so
   deleting the call takes both: `--motion-whisper` computes to empty, the shorthand is invalid
   at computed-value time, `animation-name: none`. If §13 ships the registration statically the
   observed mode becomes 0 ms instead. Loud either way; the row reds either way.
3. **G17's peer arm is OWED.** The in-page hook (`window.__sudokuSession`) does not exist, so the
   refusal-vs-peer row inside the hold was vacuous on both engines. The real route is the pass-2
   two-page room (`probe/c-peer.probe.ts`, ~7 min on both engines); it was not run this pass.
   The unit rows cover the same predicate at the seam (7 rows, green).
4. **G12's painted witness is OWED.** No gold read off `CompletionVignette` after a real solve,
   and no `is-quiet === false` assertion; the 5.19 / 6.14 settled figures are pass 2's, carried,
   not re-measured. This family's `check-ink-pressure` hunk was deleted per plan step 7, which is
   what took the instrument with it — it is NOTE-LEDGER's `gateNote` to re-assert.
5. **G13's built half is OWED.** A dist WAS built in the worktree (`index-BZIXN59CvHfI.js`; main's
   `index-9rZPzI5DEcpe.js` untouched, so **W8 §8.1's freeze held and a worktree build is lawful**),
   and the built CSS carries both halves with 0 fallbacks. But `e2e/filter-census.spec.ts` was not
   run against it — the estate's harness wants its own config and server, and wiring it to a
   scratch one is an instrument this lane did not cut. Goldens 4/4 likewise not run.
6. **`announce()`'s beat re-timed two existing tests.** `GameBoard.receipt.test.ts` asserted the
   re-say on the next microtask; both rows now wait one beat (`afterOneBeat`, the helper carries
   the reason). The behaviour they guard is unchanged. This is the class row's second occurrence,
   in the open.
7. **The spec's helper had a cross-channel collision.** `afterBeat(seq, write)` guarded on the one
   `writeSeq`, and a deal writes the margin AND the region — so the second writer silently dropped
   the first's parked re-say. The helper takes a guard CLOSURE instead; each channel tests its own
   (`parked.seq === writeSeq` for the margin, `boardVoice.value === ""` for the voice). Declared.
8. **Two probe defects found and fixed mid-run, both worth carrying.** `App.vue:786-788` refuses
   the `g` shortcut while focus is in an input, and arming a hint leaves focus in a cell — the
   first park run pressed a key that did nothing. And `parked` is `view !== "playing"`, which
   turns when the FOLD does (217–240 ms after the key), so "within one rub-out of `g`" was the
   wrong clock; the right one is "within one rub-out of the PARK", and it reads 162.5 / 180 ms.
9. **Webkit's G9a record row was vacuous in one run** (the hint failed to arm); the re-shot crop
   run covers it — `only 9 fits here` standing in the folded card at 300.18 × 11.21.
10. **Not re-run this pass**: R3-d / R3-g (`marks.probe.ts` is copied and OUT-re-pointed but was
    not run), `wobble.probe.ts`, `budget.probe.ts`, `heading-voice.spec.ts`. The r3g age+leaving
    amendment and its `instruments/r3g-age.diff` are therefore not proposed; r0 row NOT MOVED
    because nothing was re-cut.

## Crops (4, all ≤ 2.2 KB)

1. `frames/settledExit-390-chromium.png` — 390, chromium, the **settled** exit at whisper + 2
   frames. The strip is empty; `inkPresent false`, text `""`. Pass 2 showed a full line standing
   here for 25 frames.
2. `frames/repeatHole-390-chromium.png` — the repeat's hole at removal + 60 ms, between two
   identical refusals. Text `""`; the line returns 400 ms later.
3. `frames/park-reply-1280-webkit.png` — a reply under the park, in the folded card: empty.
4. `frames/park-record-1280-webkit.png` — a record under the same park, same box: standing.

## Files

`src/pencil/chrome/MarginNote.vue` · `src/games/shared/GameBoard.vue` ·
`src/games/shared/useGameState.ts` · `src/pencil/config/pencilConfig.ts` (the §13 graft) ·
`src/App.vue` · `src/games/shared/GameShell.vue` · `src/games/shared/BoardHost.vue` ·
`src/assets/index.css` · `src/main.ts` · `src/pencil/types.ts` · `src/games/shared/useSession.ts` ·
`src/games/shared/GameBoard.receipt.test.ts` · + 2 new test files.
`scripts/check-ink-pressure.mjs` is back at HEAD by design (plan step 7).
