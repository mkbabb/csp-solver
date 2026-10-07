# THE WAVE · s10 ∘ s13-s7-s3 on `74a2b5d9` (T9-W7 pass 8, batch 6)

Opus integrator lane, 2026-10-06 12:5x–19:3x. The union no lane had built: `pass8/integrate/s13-s7-s3.diff` on a fresh `74a2b5d9`, then `pass8/integrate/s10.diff` with `--3way`. Nothing is committed. **The union does not come up clean: three product reds and one gate red are new to this record, each with its side and its mechanism proven below.** The box ran at a 1-minute load of 200–660 with 17.2 of 18.4 GB of swap in use from 13:17 on, so the WebKit spec column is mostly unread. Gaps come first.

## Numbers first

| read | value |
|---|---|
| bank | `WAVE.diff`: **2,257,707 B**, sha1 `0dc4fd850883abec8be9ba2d08a1bb4110b0e654`, `git diff --binary 74a2b5d9 acb9c08e`. **132 files, +39,419 / −1,585.** Two binary patches (`fraunces-subset.woff2`, `patrickhand-subset.woff2`, CTRL-FACE's re-cuts) |
| tree at bank | **`acb9c08e60fecd936d1e2fe247baab62029ce3a5`** (base tree `5fd59288`, the `docs/precepts` gitlink `160000 8781ebb0` in both) |
| `git apply --check` | **0** on a fresh `git archive 74a2b5d9` outside any repo, read from the BANKED file. `git apply --cached` on a temporary index read from `74a2b5d9` writes tree `acb9c08e`, equal |
| file census | 132 = s13-s7-s3's 105 ∪ s10's 57, **30 touched by both**, 0 outside either. **28 files differ from both sides** (7 textual conflicts, 3 hand-merged add/adds, the seams, and the clean two-sided merges) |
| dist | **`index-CE3XQS98H6cx.js` / `index-Bu9O3erN_whL.css`**, config and cacheDir outside the tree. Rebuilt AFTER the last edit into a second outDir: `diff -rq` exit 0 against the dist every browser row below was read on |
| layer dists | s13-s7-s3 alone `index-Bly6TsdxG-s8.js` / `index-BPUcfpWqdzxv.css`; s10 alone `index-BKmcmdzXEWvT.js` / `index-BmtOj0gi5s9w.css`. Both equal their banks' recorded identities |
| the seal | union at rest **928.13 chromium / 928.00 WebKit, 3/3 each**; control 1227.09 / 1227.06, 3/3. Reproduced inside ±0.13, so **`SEAL = 928.76` stands** (928.13 + 0.13 + 0.5, registry-v6 §2.4(c)) and is stamped ONCE with a comment at `e2e/visual-regression.spec.ts:911`. Read at load 42–55 |
| check 8 | restamped ONCE: chromium **235 → 351** (listed 392, live 391), webkit **234 → 350** (392 / 389), filter-census-chromium and -webkit **6 → 8**; 4 floors move, 7 unmoved; live census 855 of 859. Stamp `74a2b5d9 · 2026-10-06 · darwin`. `check-pw-projects` after: **0** (47 specs, 859 resolved tests) |
| ONE `@property` block | source **16 registrations / 16 names in one contiguous run** (§10's 8 lengths, then §13's 7 rungs and `--live-fit`, seam W1). Served: **58 = control's 42 + 16**, GREEN on `index-CE3XQS98H6cx.js` (C2 and the other five clauses). The charter's "10 + 8" is stale: s10 pass 8 registers 8 lengths |
| ONE SHAPE library | `scripts/shape-census.mjs` at the product home, one copy. `--self-test` **107/107, clauses planted 55/55**. `--sabotage-battery` **55/55 red when deleted**. `--tree`: 28 ok, 0 FAIL. Five gates import it by `./shape-census.mjs` |
| filter census, boot AND rest | union **boot-max 21 / rest 9** in chromium and WebKit, light and dark. Control light 21 / 9; dark 23 / 11 (the crayon heart, RATIFIED deletion). **Net of the heart: 0 at boot and at rest in both themes.** (Control WebKit dark boot-max read 27 over a 22-frame sample at load 266: a starved sample, not a count) |
| undefined-token census | union **2 undefined, both `--tap-floor`** (`ConfirmRibbon.vue:140–141`, chair pick 12's A.3 row), 0 timing, 0 stale. Net of the A.3 row: **0** |
| `lint:bands` · `lint:verbs` · `lint:motion` | **0 · 0 · 0** on the frozen tree. `lint:bands` self-test 126 RED + 30 HELD, 0 holes |
| `vue-tsc -b` | **0** |
| vitest, chunked | **77 files / 955 tests, 0 failed.** Every chunk has one complete green read on the frozen tree; three reads were lost to `Failed to start forks worker` at load 330–370 (table) |
| π, whole DOM, PRM, vs `74a2b5d9` | three cells, engine-identical: **111 / 111 / 122 paint deltas**, floor 0 / 0 / 0. Every delta and every only-row sits on a claimed surface (π table) |
| AA, T9-R9 and T9-R8 | sublabels: the union reads **exactly s10's own numbers** (Deal 4.659, verbs 3.84–4.42, under 4.5). Selected chip 19.451 light / 15.839 dark, equal to the control |
| T9-R7 | chromium rail 1440×900 **0 / 101**, dock 390×844 **0 / 101**. WebKit rail **0 / 101**; WebKit dock UNREAD (the row timed out at boot) |
| born-RED | every seam RED on a plant copy of `acb9c08e`, GREEN arms in the same run (table) |
| evidence | **0 frames, 0 B of the wave's headroom spent.** `check-evidence-policy` (bare, main): PASS |
| box load (1-min) | 40–55 at the seal; 40–183 through the chromium discovery; **200–660 from 13:17 to the bank**. Sibling sessions' pytest, vitest and Playwright runs shared the box. Every row below prints its load |

## Gaps first

| # | row | reading | side | status |
|---|---|---|---|---|
| G1 | `viewport-law.spec.ts:396` (§2.5, no tape covers a control, 1440×900) | **RED, deterministic**: chromium 4/4 valid reads identical (23.9 / 23.9 / 24.1 / 6 / 6 px²); WebKit 1/1 (31 / 31 / 31.2 / 12.6 / 12.4) | **union-born**: §3 ACC-SIX's seed × §10 CTRL-TAPE's foot berth | declared, not cured |
| G2 | `face-law.spec.ts:781` ("pencils" keeps its ink inside its paper) | **RED, deterministic**: −1.4384765625 against > −0.5, 2/2 valid reads | **union-born**: §3 ACC-SIX's seed × §10 CTRL-FACE's clause | declared, not cured |
| G3 | `share-truth.spec.ts:150` and `:159` (a corrupt `?board=` says so) | **RED**: the margin reads `""`. The sentence is painted in **0 of 562** frames | **inherited from s13-s7-s3**, whose record has no share-truth row. A product regression | declared, not cured |
| G4 | `lint:theme-tokens` | exit 1: 2 bare `--tap-floor` + **2 MASKED defaults** `top: var(--head-rule, 0.75rem)` (`src/App.vue:1215`, `AttributionCard.vue:132`) | tap-floor: the chair's A.3 row. Masked: **union-born gate red**, §3's masked-default check × §10's `@property --head-rule` | declared, not cured (PLR-SELF's pass8.diff strikes both fallbacks) |
| G5 | `count-yield` 0/4 chromium | inherited from s13-s7-s3, and **one clause is worse on the union**: ABSOLUTE tab 246.38 vs control 166.59 at 844×390 (+79.79, §10's tongue strip); strip 22.09 vs 20.8 | inherited + §10 | the chair's ruling, as s13's record asks |
| G6 | `join-language.spec.ts:115` chromium; `front-rate` G10-panel | 2/3; 1/2 (the panel row imports `/src/…` and needs the dev graph) | inherited from s13-s7-s3 | not re-read on the dev graph here |
| G7 | `lint:sleep` 1; `lint:face-engine` 1 | `keys-crib.spec.ts:333/337`; no engine census on disk | inherited from s10 | face-engine needs face-law in both engines first |
| G8 | **WebKit section specs** | only `viewport-law` was read whole (12/16: `:396` is G1, three rows died at a 20 s boot wait at load 347). The other 23 files are UNREAD in WebKit | — | UNREAD |
| G9 | `affordances` chromium | no single 31/31 on the final spec file. 24/31 before W9 (the 7 reds are W9's rows) and 29/31 after (two 15 s boot timeouts at load 279–500, both green in the first read). Every row green at least once | — | declared |
| G10 | filter-census and theme-bake SPECS, goldens | UNREAD (the queue did not reach them). The boot/rest probe above carries the count | — | UNREAD |
| G11 | the control battery | 21 of 34 rows read on a `74a2b5d9` archive before the bank (below); the rest are the two banks' own columns | — | partial |
| G12 | ACC-GRAPHITE's five-rig read | not in this lane's rows; not run | — | not run |
| G13 | sublabel AA | under 4.5 on four verbs, identical to s10's bank. T9-R9's row, cited | inherited from s10 | not cured |

### G1 and G2: one deleted term, two families' clearances

ACC-SIX deletes `+ props.text.charCodeAt(0)` from the tape's seed (`SheetWashiLabel.vue:104`), so every tape re-rolls its tilt once. Its comment declares up to 4.82 px of box movement and says none of the fourteen is a golden's subject. Two of them are §10's subjects.

| tape (seed) | tilt before → after | what it meets |
|---|---|---|
| `wipe every digit you've written` (23), Clear's hover note | −0.76° → **+1.21°** | CTRL-TAPE berths the note `0.1rem` (1.6 px) under the bar. A 201 px tape at 1.21° raises its box 2.12 px, 0.52 px into the five verbs |
| `pencils` (29), the compartment tag | +0.44° → **−0.92°** | CTRL-FACE's ink-inside-paper clause reads −1.44 against > −0.5 |

Port-free probe (`tape-probe-wave8.mjs`, the gate's own predicate, dists served from disk):

| arm | dist | tilt | tape box top | verbs' bottom | covered (> 0.5 px²) |
|---|---|---|---|---|---|
| union | `index-CE3XQS98H6cx.js` | 1.21° | 755.26 | 755.78 | Clear 6 (11.5×0.52) · Fill 23.9 (46×0.52) · Solve 23.9 · Share 24.1 · keys 6 |
| union, repeat | same | 1.21° | 755.26 | 755.78 | identical |
| **ablation**: the union with the one seed term put back | `index-B5MNrXUbJ_3G.js` | −0.76° | 756.05 | 755.78 | **NONE** |
| s10 alone | `index-BKmcmdzXEWvT.js` | −0.76° | 756.05 | 755.78 | **NONE** |

The spec agrees: `face-law:781` on the ablation dist is **1 passed** (22.5 s, load 204), and RED again on the union 35 minutes later at the same −1.4384765625. The `viewport-law:396` spec row on the ablation dist is UNREAD (global setup and boot timed out twice at load 228–265); the probe above stands in for it and says so.

Not cured here because the cure is a choice between two families. SIX's comment refuses to pin the tilt. On TAPE's side the arithmetic is: a tape capped at 15rem and tilted up to 1.5° raises its box 3.14 px, so a berth of `0.2rem` is tilt-proof and `0.1rem` never was (s10's own margin was 0.27 px of luck). That moves every foot note 1.6 px and has not been read against `check-tape-foot` or the foot's reserve.

### G3: the corrupt-link notice is dead in s13-s7-s3

Port-free probe (`notice-probe-wave8.mjs`): the margin's text sampled every frame for 6 s after `?board=Zm9vYmFyYmF6`.

| arm | sudoku: frames that paint the sentence | futoshiki |
|---|---|---|
| control `74a2b5d9` | 606 of 615 | — |
| s10 alone | 646 of 654 | 675 of 683 |
| **s13-s7-s3 alone** | **0 of 606** | **0 of 701** |
| **union** | **0 of 562** | **0 of 604** |
| ablation 2: the union with one condition changed | 653 of 662 | 344 of 462 |

The spec agrees: 2 failed on the s13 layer alone and 2 failed on the union, 4/4 on a re-read. Locus, proven by ablation 2: `GameBoard.vue:1263`, in the generation watch. `freshBoardCopy()` hands the sentence out ONCE. The givens watch takes it and writes it; the generation watch fires in the same flush, gets `""`, and `if (!line || …)` writes `""` over it. Ablation 2 changes `!line ||` to `line &&` (`index-_vSOuo-D_g3j.js`) and the sentence stands. **That is a locus, not a cure**: the `!line` arm is what empties the column on an ordinary re-deal, which is §7's caption law. The owner is NOTE-LEDGER.

### G4: a gate from one section met a registration from the other

§3's `check-theme-tokens` reds a fallback on a REGISTERED token. §10 registers `--head-rule`. The two fallbacks are the base's. Striking them is zero paint by construction and PLR-SELF's pass8.diff already does it, so this lane left both lines alone to keep that fold conflict-free.

## Order and route

1. `git archive 74a2b5d9 | tar -x`, a scratch repo with alternates to the repo's objects, the gitlink restored: tree `5fd59288`.
2. `git apply --index s13-s7-s3.diff` → **`f1c9c3fe`**, the bank's tree.
3. `git apply --3way s10.diff`, eight add/add paths excluded (`--3way` refuses them): **7 files with conflicts**. The eight were merged by hand against their common ancestor, the instruments' PRODUCT HOMES (`homes.diff`, tree `bd437751`).
4. Cross-check: `git merge-tree --write-tree --merge-base=<homes>` over the two sides. Every file the two routes both left clean is byte-equal between them. `shape-census.mjs` merges clean against the homes ancestor (`git merge-file`, blob `4062dcad`, equal to merge-tree's).
5. s10's write-tree here is `a15da8e6`; its BANKED.txt says `7d2b1fdc`. The difference is the gitlink alone (verified by dropping it from a temporary index).
6. Seams W1–W12, each born RED first. The seal read. Check 8 restamped. Freeze at `acb9c08e`. Rebuild. Battery, plants, probes.

## Conflicts (ours = s13-s7-s3 already on the tree; theirs = s10)

| file | ours | theirs | taken |
|---|---|---|---|
| `knip.json` | `homes.on-s13`'s form | equals the homes copy | **ours** (clean under merge-tree with the homes base) |
| `scripts/census.stamp.json` | MOT-VERB's pass-8 stamp | s10's | ours, then **restamped once** |
| `scripts/check-font-coverage.mjs`, 5 blocks | §7/§3: margin extractors, `countLine`, `deriveGroup(face, group)`, closed groups, self-test | CTRL-FACE: `deckOptionLabels`, `iconSublabels`, the `.icon-sublabel` group, `atLeast`, `strict`, checks 6 and 7 | **both.** Import: ours. Extractors: both. Corpus groups: both. Loop: ours's `deriveGroup` call, with FACE's `atLeast` and `strict` clauses carried INTO `deriveGroup` (W2). EOF: both, with the closing `  }\n}\n\n` restored between the two blocks |
| `src/assets/index.css`, 2 blocks | a ring-ink comment; gold `--color-progress-ink: var(--accent-ink)` | `--ring-ink: var(--color-focus-sketch)` and its note; §3.5's comment | ring: ours's comment + theirs's declaration and note. Progress: theirs's comment + **ours's gold** |
| `GameControlPanel.vue`, 2 blocks | §13's rung-pointed spellings of the heading's duration and of the `.action-bar::before` fade | CTRL-FACE: `return [activeColorClass(section) ?? "text-foreground"]`; the fade DELETED with the sticky bar | **theirs** on both (the duration is FACE's CSS rule, re-verbed by W8) |
| `OptionSelector.vue` | `duration-[var(--motion-whisper)]` | `pt-1.5 pb-0` | **union**: `ctrl-btn rounded-md px-3 pt-1.5 pb-0 text-center transition-colors duration-[var(--motion-whisper)]` |
| `pencilConfig.ts` | §13's `rungs` / `characters` / `verbs` / `note` | INK LIFT comment, `confirmWindowMs: 2500` | **ours + theirs's tail** |
| `e2e/lib/paint-lib.d.mts` (add/add) | §13's declarations | s10's superset | s10's + `export type Rgb = Shot`, `grey` / `lum` widened to `ArrayLike<number>` (W3) |
| `e2e/lib/postpaint.d.mts` (add/add) | VERB's typed `Arm`, `Mover`, `readMover`, `SKIP_PLANT`, `F2_PLANT`, `fmtArm`, `installTimeline` | TAPE's `PPRead`, `PP`, `installSampler`, `kPaintOf` + `unknown` stubs | ours's types + theirs's four, the stubs ours types are dropped |
| `scripts/shape-census.mjs` (add/add) | §3/§7's clauses | §10's clauses | clean three-way against the homes copy, then W7 |
| `e2e/lib/{edge-bands,paint-lib,rest-probes}.mjs` | identical on all three | — | — |
| `e2e/lib/{glyph-pop,postpaint}.mjs` | changed by s13-s7-s3 only | equals the homes copy | ours |

## Silent defects and seams

Every seam is integrator-provisional and named in place with `WAVE union (pass 8)`. Born-RED is on a plant copy of `acb9c08e` (`plants.sh`, `plants2.sh`); the GREEN arm ran first in the same run.

| # | defect the clean merge hid | seam | born-RED → GREEN |
|---|---|---|---|
| W1 | TWO `@property` runs in `index.css` (§10's lengths, §13's rungs further down): `check-property-block` C2 | §13's block moved to follow §10's, `index.css:278–317` | exit 1 → 0 (16 / 16) |
| W2 | FACE's `atLeast` floor and `strict` departure lived in a loop §7 had replaced with `deriveGroup` | both clauses carried into `deriveGroup` (`check-font-coverage.mjs:1039`) | plant `atLeast: 5` exit 1; plant a ghost string in the strict group exit 1 → 0 |
| W3 | s10's `paint-lib.d.mts` makes two of §13's `@ts-expect-error` lines unused, and §13's `Rgb` tuple no longer fits `grey` | two directives struck (`wash-step.spec.ts`, `progress-corridor.spec.ts`), the d.mts widened | `typecheck:e2e` TS2578 ×2 + TS2345 → 0; re-plant exit 2 |
| W4 | §10 adds a second sentinel pair in `scene.css` copying the literal `opacity 150ms` that §13 had re-pointed | `opacity var(--motion-whisper) var(--verb-layDown-ease)` (`scene.css:458`) | `lint:bands` B1 + B5 + B8 → 0 |
| W5 | §13's ratchet banks `GameControlPanel.vue :: .action-bar::before :: opacity` at 150 ms; §10 deletes it and its mirror moves to `scene.css` | a MOVED row with `newKey` and `ms: 150` (`check-motion-bands.mjs:415`). A DELETED row left B6's decoy clause red | B6 ×2 → 0 |
| W6 | `MOTION.confirmWindowMs = 2500` is outside §13's ladder | `EXEMPT_KEYS.confirmWindowMs`, a WINDOW (`check-motion-bands.mjs:174`) | B2 → 0 |
| W7 | the library's SECOND `setProperty` reader (`tokenSites`) reads CTRL-FACE's `put(name, v)` as an unresolved write of every token: `lint:bands` B3 at `GameControlPanel.vue:894` | **PROPOSED library extension**, clause `tok-param-carried`, with its plant (`shape-census.mjs:140, :1888, :3732`; cut alone in `WAVE.logs/W7-shape-census.PROPOSED.diff`) | B3 → 0; `SHAPE_SABOTAGE=tok-param-carried` self-test 106/107 exit 1 |
| W8 | FACE's heading tween spends `--ease-standard`; two PRM blocks zero a duration the rung already zeroes | `color var(--motion-whisper) var(--verb-layDown-ease)` (`GameControlPanel.vue:3109`); both blocks struck with a comment | `lint:verbs` 3 → 0 |
| W9 | §7's two new Solve presses in `affordances.spec.ts` click `.controls-card button[…]`; §10 moved the verbs to the foot and asks first | `pressDestructive(page, '.drawer-case button[aria-label="Solve puzzle"]', 'solve')` at `:344` and `:498` | chromium 7 failed / 24 passed → those 7 green (29/31, G9) |
| W10 | §7 admits `A` and `E` as absent from the hand; FACE's re-cut carries them and the gate orders the strike | two admissions struck, six remain | `test:font-coverage` 1 → 0 |
| W11 | §10's `ConfirmRibbon` binds four props the pinned census does not carry | four `BOUND_TAPES` pins (`check-font-coverage.mjs:471`) | same gate, 1 → 0 |
| W12 | FACE's `script-style-object` library clause feeds `check-theme-tokens`' wash-reach 8 sites it reads as offences | `WASH.scriptObjects` pin table (`GameCard.vue` 4, `filterBudget.ts` 4), closed both ways, plants W7 and W8 in the gate's self-test (`check-theme-tokens.mjs:1008`) | wash-reach CONTROL "8 offence(s) — FAILED" → "0 — GREEN"; `SHAPE_SABOTAGE=script-style-object` exit 2 |
| seal | — | a comment paragraph above `const SEAL = 928.76`; the value is unchanged | — |

Silent-defect scans that found nothing: duplicate custom-property declarations per block; per-token declaration counts against ours + theirs − base; duplicate top-level names in the 11 shared JS/TS files; duplicate JSON keys; stale `image.boil-frame-bitmap` selectors; every one of s13-s7-s3's `GameControlPanel.vue` hunks present.

## The wave's rows: browserless battery on the frozen tree

Bare, exit captured first, one log per gate, the tree not edited until it ended (`git diff-files --quiet` 0 and write-tree `acb9c08e` after it). Control (`74a2b5d9` archive, 21 rows read at load 340–460 before the bank): `lint:theme-tokens` 0, `lint:sleep` 0, `lint:bands` 1, `lint:verbs` 1, `lint:tape-foot` 1 (three scripts the base does not have), `lint:face-engine` 1, the other 15 rows 0. The remaining control exits are the two banks' own columns (G11).

| gate | exit | note |
|---|---|---|
| `vue-tsc -b` | 0 | |
| `lint:lanes` · `lint:ink` · `lint:copy` · `lint:catch` · `lint:theme-selectors` · `lint:live-regions` · `lint:tdz` · `lint:boundary` · `lint:knip` | 0 each | |
| `lint:bands` · `lint:verbs` · `lint:motion` | 0 · 0 · 0 | |
| `lint:theme-tokens` | **1** | G4 |
| `lint:sleep` | **1** | G7 |
| `lint:tape-foot` | 0 | 93 plants red, 10 clauses hold |
| `lint:face-engine` | **1** | G7 |
| `test:e2e:projects` · `check-pw-projects` | 0 · 0 | after the one restamp |
| `typecheck:e2e` · `typecheck:node` | 0 · 0 | |
| `test:font-coverage` | 0 | FACE's `--sabotage` 4/4; `--print-7` 31 plants red, 8 lawful green |
| `test:support-floor` · `test:e2e:retries` · `check-copy-register` | 0 each | |
| `eslint --max-warnings 0` · prettier | 0 · 0 | |
| `shape-census --self-test` · `--sabotage-battery` · `--tree` | 0 · 0 · 0 | 107/107 · 55/55 · 28 ok |
| `check-property-block` source · self-test · served | 0 · 0 · 0 | pass 6's copy, sha1 `54e7774a` |
| undefined-token census · self-test | **1 · 1** | the two `--tap-floor`; pass 6's copy, sha1 `e35597f7` |

35 rows (34 in the battery and the served `@property` read): **30 exit 0.** The five reds are G4 (the gate and the census), G7 (two rows) and the census's self-test, which fails only on the same two tokens.

vitest on the frozen tree, two passes (`bat-fin`, `bat-fin2`):

| chunk | files / tests | reads |
|---|---|---|
| `src/composables` | 3 / 16 | green ×2 |
| `src/games/shared` | 36 / 472 | green ×2 |
| `src/games/futoshiki` | 5 / 78 | green ×2 |
| `src/games/kenken` | 4 / 35 | green ×2 |
| `src/games/killer` | 4 / 32 | green ×1; one pass `Failed to start forks worker` at load 366 |
| `src/games/sudoku` | 4 / 52 | green ×2 |
| `src/games/thermo` | 4 / 96 | green ×2 |
| `src/pencil` | 15 / 155 | green ×1; one pass `Failed to start forks worker` at load 330 |
| `src/games/*.test.ts` | 2 / 19 | green ×1; one pass `Failed to start forks worker` at load 347 |
| **total** | **77 / 955, 0 failed** | s13-s7-s3's bank: 77 / 947 |

## Section specs

Chromium, whole file, `--workers 4`, the union's dist, 13:12–13:20. `affordances` and `share-truth` re-read 15:23–15:53.

| spec | chromium | load | note |
|---|---|---|---|
| affordances | 24/31, then 29/31 | 43, 279 | G9 |
| boot-hand | 1/1 | 39 | |
| count-yield | **0/4** | 40 | G5 |
| fold-verb | 6/6 | 41 | |
| frame-halfstroke | 12/12 | 41 | |
| front-rate | 1/2 | 40 | G6 |
| join-language | 2/3 | 40 | G6 |
| ladder-prm | 4/4 | 40 | |
| live-fit-ablation | 2/2 | 41 | |
| note-reserve | 3/3 | 42 | |
| progress-corridor | 8/8 | 41 | |
| tally-flash | 1/1 | 61 | |
| wash-step | 2/2 | 62 | |
| font-census | 2/2 | 58 | |
| visual-regression | 12/12 | 69 | the seal's row among them |
| face-law | 52 + 1 skip, **1 F** | 184 | G2 |
| keys-crib | 8/8 | 155 | |
| zone-grammar | 31/31 | 132 | |
| mobile-affordances | 13/13 | 108 | |
| viewport-law | 15/16 | 92 | G1 |
| share-truth | 3/5 | 77, 218 | G3 |
| sudoku-interaction | 7/7 | 74 | |
| futoshiki | 4/4 | 79 | |
| permalink | 10/10 | 89 | |

**17 of 24 files green in chromium.** Seven red files: three are the new reds (G1, G2, G3), three are inherited (G5, G6 ×2), one is G9's load. WebKit: `viewport-law` 12/16 at load 347 (G1's row red; `:742`, `:951`, `:1119` died at a 20 s boot wait). The rest is G8.

## π, whole DOM, PRM (boil parked), union vs `74a2b5d9`, one real payload, 113 labelled cells

| cell | chromium paint Δ / only-union / only-control | WebKit | floor (control vs control) |
|---|---|---|---|
| 1280×800 fine, dpr 1 | 111 / 375 / 282 | 111 / 375 / 282 | 0 / 0 / 0 |
| 1280×800 coarse, dpr 1 | 111 / 357 / 282 | 111 / 357 / 282 | 0 / 0 / 0 |
| 390×844 coarse, dpr 3 | 122 / 234 / 147 | 122 / 234 / 147 | 0 / 0 / 0 |

688 delta rows over the six cells and three poses (board, deck open, dark): **640** in the controls card and its case (§10's re-face, §13's rungs), **36** on the margin strip (§7's reserve: line-height 23.63 against 24), **12** on the two crayon hearts (the ratified deletion). **0 on the board's cells, the header or the deck.** Only-rows outside the card: the grid's raster bake moved from `svg > image.boil-frame-bitmap` to `div.grid-ink > div.boil-frame-bitmap` (§13), the drawer tab moved into `.tongue-strip` with `.quick-set` (§10), the deck's option words gained `.ctrl-word` (§10), one `head > style`. All claimed. Read at load 266–309; the counts are engine-identical and the floor is zero in every cell.

## AA through the ONE home (`node e2e/lib/glyph-pop.mjs`, 1280×800 fine, dpr 2, PRM)

Core medians. T9-R9, the icon-sublabel rung, light:

| subject | union chromium | control chromium | union WebKit | control WebKit |
|---|---|---|---|---|
| Deal | **4.659** (G4: one slice at 2.54) | 1.333 | **4.659** | 1.273 |
| Clear | 4.420 | 4.527 GREEN | 4.235 | 4.400 |
| Fill | 4.060 | 4.400 | 3.841 | 3.831 |
| Solve | 4.296 | 4.400 | 4.235 | 4.277 |
| keys | 4.296 | no sublabel | 4.235 | no sublabel |

Equal to s10's banked table to the third decimal: §13, §7 and §3 move nothing here. Plants RED 8/8 in all 20 cells (the two control `keys` cells red at G0, no subject).

T9-R8's instance, the selected chip: **19.451** light and **15.839** dark, union and control, both engines, CLEAN GREEN. The instrument's `FADE80` plant stays GREEN on this subject in both arms (7/8 in seven cells, 6/8 in the dark control chromium cell): an 80 % fade of 19.45 is still 11.02. That is a hole in the plant on high-contrast subjects, on the control as much as the union.

## Incidents

1. **Two `git commit`s and two `commit-tree`s in my scratch repo** (`base74`, the s13 replay, the s10 and homes trees) before I re-read "never git commit anywhere". Nothing touched main, a worktree or a remote. None after; the freeze and the bank use `git add -u` and `git write-tree` only. For the restamp the scratch HEAD was re-pointed with `git update-ref --no-deref` at the real `74a2b5d9`, so the stamp names the base and not a scratch sha.
2. **A provisional battery ran while I was still editing scripts.** Voided. The table above is the re-run on the frozen tree.
3. **The box.** Load 200–660 and swap exhaustion from 13:17. One chromium re-read took 1,321 s and failed on closed pages; a global setup took 913 s. API turns were silent for up to 50 minutes. Rows read above load 200 say so.
4. **Late queue only**: the server-sanity global setup was skipped (`pw-nogs.config.ts`; `swap.sh` proves the served identity by curl) and the test budget was 300 s. A clock budget, not a gate's wording.
5. **Two port-free scratch probes** (`tape-probe-wave8.mjs`, `notice-probe-wave8.mjs`) serve dists from disk through `context.route` on `wave8.local`. They are not product instruments.
6. **My `:4257` server was re-pointed six times** between the union, ablation and layer dists. `swap.sh` stops only the listener whose cwd is this lane's tree. No foreign listener was touched; `:4258` served the control throughout.
7. W5 was first cut as a DELETED row and left B6's decoy clause red; re-cut as MOVED.
8. `cmd | tail; echo $?` reported 0 for a failing `git apply --check` once; re-run bare.
9. `vite build --emptyOutDir` empties my own out-of-tree dist directories. No `rm` was run by this lane.
10. Nothing was re-baselined. No gate was re-worded.

## Replay

```
git archive 74a2b5d9 | tar -x -C <dir>          # outside any repo
cd <dir> && git apply --check --binary WAVE.diff   # 0
# or, in the repo, without a worktree:
GIT_INDEX_FILE=<tmp> git read-tree 74a2b5d9
GIT_INDEX_FILE=<tmp> git apply --cached --binary WAVE.diff
GIT_INDEX_FILE=<tmp> git write-tree                # acb9c08e60fecd936d1e2fe247baab62029ce3a5
```

Build: `VITE_BASE_URL=/ npx vite build` with a config and cacheDir outside the tree → `index-CE3XQS98H6cx.js`. The derivation is the Order section; the scratch tree and every log are left at `<scratchpad>/wave8/` (`tree`, `dist-wave8`, `dist-abl`, `dist-abl2`, `dist-layer-s13`, `dist-layer-s10`, `plants`, `bat-fin`, `bat-fin2`, `disc`, `logs`).

## Instruments, by import path

- `e2e/*.spec.ts` → `./lib/{paint-lib,postpaint,glyph-pop,edge-bands,rest-probes}.mjs` (11 spec files). AA is `node e2e/lib/glyph-pop.mjs` from the tree's `web/frontend`.
- `scripts/check-{font-coverage,ink-pressure,motion-bands,tape-foot,theme-tokens}.mjs` → `./shape-census.mjs`.
- **0** imports from `docs/` and **0** absolute-path imports in `e2e/`, `scripts/` or `src/` (grep on the frozen tree).
- Scratch, not banked as product: pass 6's `check-property-block.mjs` and `undefined-token-census.mjs` (run with `--fe` / `FE=`), `boot-filter.mjs`, `pi-wave.mjs` (the s13 integrator's π with a `CELLS` env), the two probes above. They import Playwright from main's `node_modules` by absolute path.
- `WAVE.logs/`: text only. The plant transcripts, the battery's result tables, the probes' output, the pre-seam RED logs, W7's PROPOSED diff.
