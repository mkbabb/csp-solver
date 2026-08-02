# T5-W2 F4 — THE KILL LIST · THE BOUNDARY · CH-19 (moves 2.3, 2.5, 2.6 + the registry's death)

**Lane** Opus, under the Fable team lead · **opened/closed** 2026-08-02 · **base** `e63af853`
(working tree carrying F1 + the three F2 lanes + F3) · **tree** working, uncommitted — the lead
commits.

The charter of record is `../wave-open.md` §2 rows 2.1a, 2.3a–2.3d, 2.5, 2.6 and §3's π schedule.
This directory is the last estate lane's evidence.

| File | What it holds |
|---|---|
| `00-before.txt` | the born-RED bank — every probe failing, measured before a line of F4 |
| `50-kill-census.txt` | **every wave-open kill row re-grepped: 0 hits, all of them**, plus what survived and why |
| `60-ch19-decision.md` | CH-19's proof re-run on this tree (five builds, five shas) and the decision |
| `70-filterbudget-decision.md` | 2.3's recorded verdict on `filterBudget.ts`'s placement |
| `90-exit-gates.txt` | π · unit · tsc · build · boundary · eslint · knip · prettier · golden-bytes · prod-shake · font-coverage · ink · doc-truth · the canary · the live five |

---

## What landed

**The registry is gone, the law is generated and green, and the estate's dead config is dead.**

| | before | after |
|---|---|---|
| `games/registry.ts` + its test | 209 lines, `GameDefinition`, a second `defineGame`, `gameRegistry = {}` | **deleted** |
| functions named `defineGame` | 2 | **1** |
| `GameCard`'s mount | a two-arm union (`load` \| `scene`) — F1's declared interim | **one arm**, five rows |
| `npm run lint:boundary` | **12 errors** (23 at W1's bank) | **0** |
| the boundary law's home | a standalone overlay `eslint.config.js` did not carry | **one generator, imported by both** |
| unreferenced `@theme` tokens | **17** of 68 declared | **0** of 51 |
| `PENCIL` keys | 6, one live | **1** |
| the mascot palette | `YOSHI_COLORS`, 5 dead entries + `leaf.vein` | **`MASCOT_COLORS`**, dead entries gone — CH-31 lands whole |
| `Difficulty` | declared twice, imported across games 4× | **one home**, `games/shared/types` |
| selector bands | 3 `ControlPanel/constants.ts`, `difficultyOptions` triplicated | **one** `games/shared/selectors` |
| technique adapters | 2 (`sudokuTechnique`, `futoshikiTechnique`), imported across games 3× | **1** `techniqueAdapter`, `BoardGeometry`-parameterised |
| shipped test-only seams | `__resetStagingBridge` | **0** — the test boots the module instead |
| dead props | `AnswerKeyLaminate.subgridSize` (required, 0 reads) · `GameBoard.cornerMarks/centerMarks` | **gone**, with their binds |
| `index.css` | 842 lines | **808** |

**The boundary went green because nothing a game needs lives in a sibling — not because a rule
was narrowed.** The twelve survivors reached across for exactly three things, and each moved down
to the shared floor rather than being copied sideways:

- **`Difficulty`** — the same three-member union, declared in `sudoku/types.ts` and
  `futoshiki/types.ts`, with thermo/killer reading sudoku's and kenken reading futoshiki's. One
  home in `games/shared/types`; `sudoku/types.ts` had nothing else left and died. The
  `SolveState`/`SolveStats` re-export shells T3 left behind (knip's four rows) died with it.
- **the selector bands** — three `ControlPanel/constants.ts` files whose `difficultyOptions` were
  byte-identical. One `difficultyOptions` and three honestly-distinct size bands
  (`subgridSizes` 2/3/4 · `latinSizes` 4–7 · `cagedLatinSizes` 4–6) in `games/shared/selectors`,
  which is where `SelectorBand` already lived and where BETA said the fold belonged. `cards.ts`
  now imports no game but the eager one.
- **the technique adapters** — `sudokuTechnique.ts` and `futoshikiTechnique.ts` differed in
  exactly what `BoardGrammar.geometry` already names: boxed builds row/col/**box** houses off a
  sub-grid `n`, latin builds row/col off a board-edge `n` and carries the caret constraints.
  Everything else was the same peer-set sweep. So it is one `createBoardAdapter(geometry, n,
  inequalities?)`, and the six per-game wrapper functions (`gradeSudoku`, `fillForcedSudoku`,
  `hintSudoku`, and the futoshiki twins) died with the fork — the five composables call the
  engine's own `gradeBoard`/`fillAllForced`/`findHint` directly.

  Two behaviours were preserved deliberately, not discovered late: a family with no printed
  inequalities supplies `constraints: undefined`, not `[]`, because the engine's `inequality-*`
  rungs short-circuit on `!constraints` and that is the arm the three constraint-free families
  have always taken; and `n` stays polymorphic across the two geometries because `useGameState`
  already hands it that way.

**The law now lands with its enforcing config.** `eslint.boundary.config.js` became the
*generator* — it exports `crossGameRules` and `sharedMayNotImportGames` — and `eslint.config.js`
imports those same blocks, appending the pencil depth pattern into each one's own `patterns`
array (the P2-T5 flat-config append discipline, or a second same-scope block would clobber the
rule it meant to join). One law, one source, two entry points. The hand-enumerated
`sudokuMayNotImportFutoshiki` / `futoshikiMayNotImportSudoku` / `sharedMayNotImportGames` blocks
— which bound 2 of 20 ordered pairs — are deleted.

The generator's second registration-point arm (`game.ts`) died with the last unmigrated family,
leaving `spec.ts` as the sole discriminator, and the CI canary was re-pointed to match.

---

## The gates

| gate | result |
|---|---|
| **π** | **4/4, three consecutive runs** on the built dist — `cell-light` · `grid-corner-light` · `logo-light` · `toggle-crest-dark`. No golden re-baselined; `e2e/goldens/` has no diff |
| `vitest run` | **30 files, 348 tests, 0 failed** |
| `vue-tsc -b` | 0 errors, whole tree |
| `npm run build` | green |
| **`lint:boundary`** | **0 errors** — `gates.W1.boundary.greensAt = "W2.5"` satisfied |
| `eslint .` (main config, now carrying the law) | clean |
| `lint:knip` | **0 rows** (4 at F4 entry) |
| `prettier --check src/` | clean |
| `check-theme-tokens` | **0 unreferenced of 51 declared**, negative control RED as required |
| `test:golden:bytes` · `test:prod-shake` · `test:font-coverage` · `lint:ink` | PASS |
| `check-doc-truth` | **0 RED / 13 GREEN** |
| boundary vacuity canary | throws on a one-family tree — the green is not vacuous |
| **live** | five families mount, deal and **grade** in real chromium off the built dist, zero page errors |

**Fences — held.** `git diff --stat HEAD` on `GameControlPanel.vue`, `GameScene.vue` and
`GameGallery.vue` is **empty**: 0 changed lines across F1 through F4, not even an import.

---

## π, honestly

The entry read cost two runs to take. Run 1 came in 3/4 on `logo-light`; run 2 came in 3/4 on
`toggle-crest-dark` at **1028 ↔ 1194 px between consecutive captures inside one stabilization
loop** (ratio 0.03); runs 3–5 came in 4/4 against the byte-identical dist. Those are the two
surfaces the charter names non-convergent — `logo-light` a WATCH ROW under the sun-crest clause,
`toggle-crest-dark` carrying no π claim at all — and the behaviour is what
`visual-golden.spec.ts:206-215` documents in its own comment and what F3 banked. **The two
LOAD-BEARING surfaces, `cell-light` and `grid-corner-light`, passed 5/5 at entry and 3/3 at
exit.** Banked entry read: 4/4. Banked exit read: 4/4.

The exit CSS bundle differs from the mid-step one by **scoped ids only** — normalise
`data-v-XXXXXXXX` and the two files are identical. Editing a comment inside an SFC's `<script>`
re-hashes its scope id, which relabels selectors without moving a rule; π is what proves that,
and π passed.

## CH-19, in one line

The extraction emits a **byte-identical** stylesheet (`7454d057…` for both monolith and split,
same Vite content hash), the silent-404 footgun reproduces on the un-rebased arm with a **green
build and zero font assets shipped**, and the file **shrank** 842 → 808 rather than growing past
the threshold. **DROP, decided on the hold's own criterion.** Full record and the re-runnable
recipe: `60-ch19-decision.md`.

---

## For the lead

1. **`perGameFilesTarget` is 22; the tree reads 32, enumerated.** No file in the enumeration is
   dead — the residue is `spec.ts` + `clue.ts` + `types.ts` + a poster + a model composable + a
   URL codec, five or six per family, plus futoshiki's two caret components. Reaching 22 means
   folding the five `*UrlState.ts` into the one `persistence.ts` the charter's 2.4 row owns, and
   the four clue-typed `types.ts` into their `clue.ts`. **Both are 2.4's, not 2.3's.** The gap is
   named rather than rounded off; restamp or schedule, but the lane declines to raid 2.4 for it.

2. **The token census landed at 17, not 15 — and the wave-open predicted exactly that.** The
   audit's 15 plus `--color-muted` and `--radius`, which §2.3a already hand-verified at 0/0. Both
   instrument arms (corpus-only and transitive) agree at 17, which is the check that matters: the
   transitive arm exists so an alias chain like `--color-easy: var(--color-crayon-green)` cannot
   kill its own base, and it correctly kept `--color-crayon-green`/`--color-crayon-orange` alive
   through `--color-green-ink`. **Stamp 17 as the enumerated figure** per the wave-open's own
   "the gate's own enumeration fixes the number when it lands".

3. **`--ink-press-firm`'s death re-priced its enforcing script, same act.** `check-ink-pressure`
   hard-codes its ladder and throws on a token that isn't declared, so the rung came out of
   `LADDER` in the same change. The ladder's properties are unchanged — dropping the TOP rung
   cannot invert the ones below it — and `lint:ink` re-derives 2 rungs × 3 scopes green.

4. **CH-19's banked proof was not on disk.** The T3 appendix says the byte-identity bundle and
   the built font-URL guard "live in the evidence dir"; `pass2/` carries `P2-L8.md` and no
   `p6-accepted/`. The method survived as prose, so this lane re-derived the whole thing and
   banked a **runnable recipe** instead of partials (evidence byte caps). Either the LEDGER's
   CH-19 row restamps to `60-ch19-decision.md`, or the T3 §4 claim is corrected — the lane
   recommends the first. This is lessons rule 8 landing on the row that promised otherwise.

5. **The boundary CI lane SURVIVES rather than retiring, and the ci.yml comment now says why.**
   W1 predicted "at W2.5 this whole lane retires … deleting it is part of W2.5's definition of
   done", and the instruction to this lane was to flip the banner instead. The lane agrees with
   the instruction and states the reason in the config: the job carries the **vacuity canary**,
   the negative control proving a generated matrix cannot green on zero games, and `eslint .` has
   nowhere to put one. Deleting the job would delete the only thing standing between a generated
   law and a vacuous green. The banner is off, the expected-red prose is replaced by the green's
   provenance, and `gates.W1.boundary.greensAt = "W2.5"` is cited as satisfied. **One ci.yml edit,
   as licensed.**

6. **Ten prose mentions of `gameRegistry`/`GameDefinition` survive, and are listed by file:line in
   the census.** Every one is past tense and every one is the record of what was severed — the
   TDZ cycle each `spec.ts` header names as the thing it no longer closes. They are history, not
   a live reference; the code rows all read 0. Stale PRESENT-tense mentions were fixed
   (`App.vue`'s "the registry's own `card.scene()` loader", `useStagingBridge`'s import-direction
   invariant, `GameGallery/types.ts`'s "the registry's richer row"). **Two remain inside
   `GameGallery.vue` itself (`:67`, `:297`) and were left untouched — it is fenced. W4's rows.**

7. **`persistKey` is still spelled twice for the four lazy rows** (a literal on the card, the
   `STORAGE_KEY` in the game), guarded by `cards.test.ts` asserting they agree. That is the
   measured chunking trade the table's own header records, and the charter homes its cure in
   2.4's one `persistence.ts`. Not F4's, and not silently absorbed.
