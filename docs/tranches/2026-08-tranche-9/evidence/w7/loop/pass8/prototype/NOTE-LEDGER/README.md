# NOTE-LEDGER · pass 8 prototype

Work tree `.claude/worktrees/wf_f72f3b5a-83a-46`, detached at `74a2b5d9` (base and π control), advanced in place. The number is the critic's.

**Payload.** One: the section's classic easy 9×9, 30 givens (`encodeSudoku(3, …)`, `ATMuNTMwMDcw…MDc5`), read back through the input values AND the aria-label corpus before any read. Row 11's 16×16 is `ATQuMDIwMDAwMDA5MGJjMGVm…` (346 chars, 104 givens).

**Box load (1-min).** 41–131 across the pass (other workflows live); every timing and paint row carries its own load in `logs/`.

## Bank line

| | |
|---|---|
| full diff | `pass8.diff` · **439,547 B** · sha1 `5f96869f77614f257b220aa130f1907f3c66d5f3` · `22 files changed, 9067 insertions(+), 112 deletions(-)` · tree `6cd3e25d4187dac8e6e744d3be8b13ce164ceee7` · `git apply --check` **0** on `74a2b5d9` (temporary index; the result writes `6cd3e25d`) |
| of which | the pass-7 bank (15 files, tree `7cfcdce2`) + `homes.diff` (sha1 `a1d8adeb…`) + this pass's interdiff: **7 files +712/−1093** over `7cfcdce2 + homes` (`7e8b7ced`) |
| on-union delta | `pass8.delta.on-s13-s7-s3.diff` · **45,783 B** · sha1 `856edbe07b4c61f6a72c83bbb7c8780f7ce73662` · `5 files changed, 693 insertions(+), 210 deletions(-)` · cut against `74a2b5d9 + s13-s7-s3.diff + homes.on-s13-s7-s3.diff + NOTE-ERASE pass8.delta` = `1f104003` (ERASE's result tree, reproduced) · `apply --check` **0** there (result tree `5da86099`) and **0** on `74a2b5d9 + s13-s7-s3.diff + ERASE8` without the homes (it applies; it RUNS only with `homes.on`: `check-ink-pressure` imports `effectiveAt`/`elementSites`/`lengthPx`/`sabotage` from the one library) |
| full diff on the union | refuses by construction (`font-census.spec.ts:119`, `knip.json:84`: the union already carries both) — the on-union delta is the union's form |
| battery = bank | every battery ran on `git archive 74a2b5d9` + `pass8.diff` (tree `6cd3e25d`, `t8`) or on the union + the delta (tree `5da86099`, `L8`); the worktree re-cut at return reads the same sha1 `5f96869f…` |

## Open at return: the dead attempts' hunks, decided

The tree's diff through a temporary index (`GIT_INDEX_FILE`) at open: 23 files +9078/−112 (tree `e5435fd6`, with a scratch `.ledger8/`). Against `pass7.diff` (verified: it rebuilds `7cfcdce2`) + `homes.diff` (tree `7e8b7ced`), the dead attempts had left 8 paths:

| hunk | decision |
|---|---|
| `homes.diff` applied (7 files) | KEPT: byte-identical to `homes.diff` on `7cfcdce2` |
| `scripts/shape/{shape-census,reserve-law}.mjs` deleted (−993) | KEPT (charter row 1: the lane's copy is deleted) |
| `check-ink-pressure.mjs` +312: the reserve law re-cut on the ONE library | KEPT, re-measured below |
| `check-font-coverage.mjs` +228: MUST_CLOSE over every margin extractor, keyed on strings, split plants | KEPT; FINISHED: `npm run lint` read 1 on it (prettier); re-formatted (one `console.error` wrapped) |
| `MarginNote.vue` +21: the seat re-spelled to the union's `line-height: calc(var(--type-body) * var(--type-leading-caption)); min-height: 1lh` | KEPT: the union's (and ERASE8's) exact spelling, so the fold carries no conflict |
| `e2e/note-reserve.spec.ts` (new) + its `check-pw-projects` manifest row | KEPT; FINISHED: `lint:motion` read 1 (no PRM declaration) and `typecheck:e2e` read 2 (`el.remove()` on a `Node`) on the dead attempt's bytes; a `PRM: live, because …` head and two `(el as Element)` casts |
| `web/frontend/.ledger8/pw.config.mts` (scratch) | MOVED to `<scratchpad>/trash-ledger8-3/` |

Nothing was reverted. Every number below was re-measured this pass on the final bytes; none is carried from the dead attempts' logs.

## Gaps first

1. **Two R1–R4 compositions exist.** `lint:ink`'s reserve row (`check-ink-pressure.mjs`) parses no CSS: every site, media evaluation, length and token comes from `./shape-census.mjs`. The library carries its own `reserveReading` for its fixture and `--tree`. They agree on this tree (lint:ink 23 rows as the law; `--tree` 28/28) and neither is a fork of an instrument, but two compositions of one law can drift. The fold should collapse `lint:ink` onto an exported library reader. Named for the chair, not cut.
2. **The glyph-text statistic is a COPIED pass-6 instrument** (`instruments/p6aa.ts`, no product home). On the union it failed 3 of 8 cell-runs at its colour-restore poll (`p6aa.ts:35`): HOLD's line settles (~1.2 s after the ask) inside the measure. Readings below come from the completed cells only.
3. **An unexplained glyph-pop read.** WebKit light on the union read line one at pop 49 / median 1.092 in 2 of 6 reads (+500 ms and +800 ms after the ask; `logs/probe-askcurve.txt`), with the ink `rgb(38, 38, 38)`, age `fresh`, no running animation and the voice at opacity 1 at the read. The same instants read 658 px / 5.194 on the next run. My reading: the four photographs straddle the ~1.2 s settle and the stable-pixel rule keeps 49. Not proven.
4. **The 2lh seat is a numbers-only ballot, unframed.** Ruling 18 books no crop for it and it has no retiree. The shipped const stays `1lh`.
5. **The berth through the tab is unbooked.** Neither `pass8/CHAIR-RULINGS.md`, `pass7/CHAIR-RULINGS.md` nor registry-v7 books it (v7 §5 row 11 only says the chair books it). Not built.
6. **@property C4 and TIMING 4 still breach on THIS tree** (row 9). Cured on the union.
7. **The `MarginNote.vue` comment cites `+18/+19px` desk.** Re-measured: +18 in both engines (row 7). Left as is: the comment is ERASE8's bytes on the union too, and a comment edit re-hashes the scope id.
8. **Inherited on the union, declared** (the same on `u8`, the union without this delta): `test:e2e:projects` / `check-pw-projects` exit 1, check 8 FLOOR BAND ×4 (chromium 214 vs band 238, webkit 212 vs 237, filter-census ×2), the chair's restamp. `lint:bands` exit 1 in a non-git copy (B6 needs `74a2b5d9`).
9. **ERASE's critic's ghost plant is open on the section** (a computed `animation-name` naming no `@keyframes` makes the hook write the rung: 156–167 ms on both lines). It is ERASE's hook and ERASE's row; §7 ships with it until then.
10. **No non-author has read this.**

## Numbers, the charter's eleven rows

### Row 1 · R3 EVALUATES the media query, through the ONE library · CLOSED

- `lint:ink` reads the seat's regimes from the library's `evalMedia` (every site carries `regimes`): R3 wants every phone regime (390×844, 375×812, 844×390, 812×375) and no desk regime (1280×800, 1440×900).
- `node scripts/check-ink-pressure.mjs --self-test --plants --sabotage-battery`, tree `t8`, bare: **exit 0**; `logs/src-battery.txt` quotes each verdict. M2 `@media not all and (…)` → R3 `holds in [tablet-1024x768-coarse, desk-1280x800, desk-1440x900]`; M3 the seat in the landscape block only → R3 `holds in [phone-landscape-844x390, phone-landscape-812x375]`; M8 `(min-width: 2000px) and (max-width: 1023.98px)` → R3 `holds in []`.
- The lane's `scripts/shape/` copy is DELETED. The R4 lower bound is in the one copy already (the chair folded it as clause `r4-bound`, `pass8/instruments/README.md`); switched off, the clean tree reds (`19.20px < 20.80px`). No PROPOSED diff is owed.
- The union's `calc()` reserve reads GREEN on the union (`L8` lint:ink exit 0); the library's `--tree` reads 28/28 on the tree.
- Born-RED: the tree's gate over the control's `MarginNote.vue` (`br8`): `lint:ink` bare **exit 1** (R1 at 15 sites, R2 `16rem`, R3: with no seat on the class, the library's element-keyed clause admits 14 other files' `min-height` rules to the voice, which I read as its conservative reading of the control template's `:class="tone"` prop; not traced further) and `shape-census --tree` **exit 2** (anchor absent, 14 FAIL).

### Row 2 · R4 over every block site, resolved at the block · CLOSED

- R4 reads the block's WINNING reserve at each phone regime from every site under any context (`effectiveAt`), resolved by `lengthPx` against the block's own font-size and line-height.
- M1 `min-height: 1px` inside the < 1024 block → `R4 phone-portrait-390x844: the block reserves 1.00px … under the voice's 20.80px line`. M4 `line-height: 1px` inside < 1024 → 1.00 px. M4em `1.3em` on a `font-size: 1px` block → 1.30 px. E3 1px, half-line `calc(1lh / 2)` → 10.40 px. All RED.
- Negative-negatives GREEN: `font-size: 1px` on the block alone (its line is a length, the reserve holds); `.margin-note-previous:not(.margin-note)`.

### Row 3 · the BEHAVIOURAL RECT row · SHIPPED (`e2e/note-reserve.spec.ts`, sha1 of the final bytes in `logs/spec-*.txt`)

At 390×844, 844×390 and 360×800, `hasTouch`, `(pointer: coarse)` witnessed, DPR 2, both themes, both engines. The empty voice's rect height must be ≥ its own computed line − 0.5 and ≥ the block's computed reserve − 0.5. Each plant is a stylesheet at the component's scope attribute (M3 is a CSSOM move of the seat rule), must RED, and the page must read GREEN once it is taken out.

| plant | 390×844 | 844×390 | 360×800 | verdict |
|---|---|---|---|---|
| clean | 20.80 | 22.09 | 20.80 | GREEN |
| M1 block reserve 1px < 1024 | 1.00 | 1.00 | 1.00 | RED ×12 |
| M3 seat in the landscape block only | 0.00 | 22.09 (holds, GREEN as required) | 0.00 | RED ×8 portrait |
| M4 block line 1px < 1024 | 1.00 | 1.00 | 1.00 | RED ×12 |
| M4em 1.3em on a 1px block | 1.30 | 1.30 | 1.30 | RED ×12 |
| M5 `display: contents` | 0.00 (`contents`) | 0.00 | 0.00 | RED ×12 |
| M6 `> p:first-child { min-height: 0 }` | 0.00 | 0.00 | 0.00 | RED ×12 |
| M7 `[role="status"] { min-height: 0 }` | 0.00 | 0.00 | 0.00 | RED ×12 |
| negative: `font-size: 1px` on the block | holds | holds | holds | GREEN |

Every cell above is chromium and WebKit × light and dark, identical to the hundredth. Final bytes: **tree 6/6 passed** (`index-DJCNAPCsWtTd.js`), **union 6/6 passed** (`index-C_SlSGoMXD5k.js`), **control 6/6 FAILED** (`index-CubiZsMVSwTc.js`: the clean voice reads **0 px** in every cell; at 844×390 the control's block reserves 20.80 under its own 22.10 line).

### Row 4 · pass 6's plants restored + the CLAUSE-SABOTAGE battery · CLOSED

`RESERVE_PLANTS` now holds 20 plants + 2 negative-negatives: seat deleted, E1, E2, E2b, E3, E4, half-line; **zeroed, number (1.3em), wide, desk, `inherit !important`** (restored); M1, M2, M3, M4, M4em, M6, M7, M8. All read as the law (`plant ok` ×23 incl. the clean tree, `plant BAD` ×0).

**Clause-sabotage table** (`--sabotage-battery`, each clause switched off in turn; the library clauses through the library's own `sabotage()`):

| clause off | the first plant that then misreads | self-test |
|---|---|---|
| R1 | seat deleted: GREEN | RED |
| R2 | zeroed: the seat at 0: GREEN | RED |
| R3-important | inherit !important: GREEN | RED |
| R3-seat | wide: the seat outside any media block: GREEN | RED |
| R4-every-site | M1 the block at 1px inside < 1024: GREEN | RED |
| R4-consumer | clean tree: RED (19.20 px < 20.80) | RED |
| media-eval (library) | M2 `not all and`: GREEN | RED |
| em-lh (library) | clean tree: RED (20.80 < 27.04) | RED |
| r4-bound (library) | clean tree: RED (19.20 < 20.80) | RED |
| element-keyed (library) | M6 `> p:first-child`: GREEN | RED |

**Literal deletion** (the clause's test replaced by `false` in a scratch copy of the gate, `node --check` clean, then `--self-test` bare): R1 **exit 1**, R2 **exit 1**, R3-important **exit 1**, R3-seat **exit 1**. The switch and the deletion agree.

### Row 5 · MUST_CLOSE over EVERY margin extractor, with split plants · CLOSED

`MUST_CLOSE = Object.keys(EXTRACT).filter(/^margin/)` (2 extractors today: `marginRecordCopy`, `marginVerdictCopy`), and an open group reds if it names one OR derives any string a margin extractor derives, whatever its extractor is called. `test:font-coverage --self-test` bare **exit 0**, 7 rows:

| plant | findings |
|---|---|
| the margin group with `closed: true` deleted | 1 (RED) |
| SPLIT: the verdicts in an open twin deriving `marginVerdictCopy` | 1 |
| SPLIT through a renamed extractor | 1 |
| SPLIT + `setMargin("solved it!")` deleted (the pass-7 critic's evasion) | 1 |
| `setMargin("solved it!")` deleted | 1 |
| CONTROL: the margin extractors pinned | 2 |
| CONTROL: the tree as it stands | 0 |

Born-RED in the same run: the pass-7 pin (`["marginRecordCopy"]` by name) spliced into a scratch copy under the same plants: **exit 1**, the three SPLIT rows BAD at 0 findings.

### Row 6 · THE SWAP FENCE on the union, and the composite re-shot WITH it · CLOSED

**The gate** (ERASE8's `drop clock, the SWAP` rows in `affordances.spec.ts`, run from the union `L8` against its dist `index-C_SlSGoMXD5k.js`, `--repeat-each=5`, both engines, both themes, 1280 fine, HOLD push, line two asserted to hold the displaced record): **30/30 passed**, box 50–73.

| arm | runs | the old line-one node's life · painted frames |
|---|---|---|
| light | 5 cr + 5 wk | cr 4.6–13.3 ms · wk 7–12 ms · 0–2 frames |
| dark | 5 cr + 5 wk | 5.3–13 ms across both engines · 1–2 frames |
| in-run negative (the fence blinded), asserted to hold | 5 cr + 5 wk | 154.3–167.7 ms · 10–24 frames |

The lines interleave across two workers, so the dark column is pooled; WebKit's `performance.now()` reads whole ms. ERASE's critic reproduced 7.1–16 ms on the same union.

**The composite** — `T9-B-LEDGER-union+homes+ERASE8+LEDGER8-fenced-HOLD-AGE-STEP-TINT-P4-cr+wk-light+dark-390x844-coarse-dpr2-at-0.5+1280x800-fine-dpr1-left460.png`, **30,375 B**, 1696×492, 12-colour palette, undithered.
- Caption (also on the image): union + homes + ERASE8 + LEDGER8 with the SWAP fence gated · one payload (classic easy 9×9, 30 givens) · one variable, `LEDGER_FULFILLED` (HOLD the default; one const flipped per arm, restored by sha1 `beaa5efa70c1`; dists hold `C_SlSGoMXD5k` · age `BUZ1c7mSqMoY` · step `Dnbc4zP4GXCO` · tint `CbufQBgl2SRT`) · P4 = ask, answer, ask, answer, photographed +100 ms and +2.6 s · 390×844 coarse DPR 2 panels at 0.5 (chromium/WebKit light +100 ms and rest, dark rest) · 1280×800 fine DPR 1 panels at 1:1, the left 460 px.
- What it shows, checked against the frame: at +100 ms **no arm paints a sentence on both lines** (the fenced base). HOLD and STEP paint line one ("only 2 fits here") at full graphite over line two ("only 5 fits here"); TINT paints line one at the quiet rung at once; AGE paints ONE line (line one empty, "only 2 fits here" on line two): the thesis pose lost. At rest HOLD = STEP = TINT; AGE one line. Chromium AGE at +100 ms: the old record's line-two node was still connected at the DOM read after the photograph, not painted in it.
- Retires `pass7/prototype/NOTE-LEDGER/T9-B-LEDGER-union+ERASE7+LEDGER7-HOLD-AGE-STEP-TINT-P4-cr+wk-light+dark-390x844-coarse-dpr2-at-0.5+1280x800-fine-dpr1.png` (31,660 B) BY NAME; ≤ its size.
- **Headroom** (ruling 18, "the post-fence T9-B-LEDGER replacement"): spends **30,375 B** of the 151,826 B; net **−1,285 B** once the chair sweeps the retiree. `check-evidence-policy` bare: **PASS** (exit 0).

### Row 7 · the 2lh seat · NUMBERS-ONLY BALLOT (default 1lh, the shipped const)

Re-measured on the union dist, one stylesheet (`.margin-note-block { min-height: 2lh !important }`) the only variable, three poses (rest, spoken, pushed with line two holding the record), both engines (`logs/probe-hold-seat.txt`):

| cell | docH 1lh → 2lh | block | what else moves |
|---|---|---|---|
| 1280×800 fine | 800 → 818 (**+18**, both engines, all three poses) | 23.63 → 47.25 | line two sits beside line one at the desk (`static`): 2lh buys nothing painted |
| 844×390 coarse | 410 → 433 (**+23**) | 22.09 → 44.19 | line two is out of flow (clipped): a reserved line nobody paints |
| 812×375 coarse | 395 → 417 (**+22**) | 21.98 → 43.97 | same |
| 390×844 coarse | 844 → 844 (+0) | 20.80 → 41.59 | the board lifts **10.40 px** (221.73 → 211.33 cr; 221.42 → 211.02 wk) |

Pass 6's +22/+23 landscape reproduce; its desk "+18/+19" reads +18 in both engines. The ballot's default is `1lh`; `2lh`'s loss is the four numbers above for a line that paints nothing at any cell measured.

### Row 8 · the colour chain with 0 callers and 20 `@public` tags · CLOSED on this tree

- The lane's copy is deleted, and its 20 `@public` tags with it (`grep -rn @public scripts src e2e`: **0**).
- The colour chain now lives in the ONE library only (the chair's home). Its callers there: `colorLiterals` and `parseColor` → `darkArmCensus` (GRAPHITE's R1 second path) and the self-test; `deltaE` → the library's self-test only (three rows).
- The fold consumer is `e2e/theme-bake-freshness.spec.ts:205`, which carries its own `deltaE` (a private copy of the same arithmetic) and is the one caller the library could take over. Named for the chair.

### Row 9 · @property clause 1 / C4 · THE FOLD'S, with the union's reading

| | `check-property-block` source · `--dist` | undefined-token census |
|---|---|---|
| this tree (`t8`, dist `DJCNAPCsWtTd`) | **1 · 1**: C4 `src/pencil/config/motionRungs.ts:26` emits `@property` from script (served 42) | **1**: TIMING 4 (`MarginNote.vue:316/330/331/538`) + the declared STALE |
| control `74a2b5d9` (`w7-control` dist) | 0 · 0 (served 42) | 1: the declared STALE only |
| the union + this delta (`L8`, dist `C_SlSGoMXD5k`) | **0 · 0** (served 50) | **0** |

`motionRungs.ts` is this tree's pass-6 emitter; the union carries the static `@property` block instead. Dead-by-fold, declared. A tree that breaches does not read 100.

### Row 10 · the berth through the tab · UNBOOKED (gap 5)

### Row 11 · the glyph-text 4.357 and the 16×16 read-back RE-RUN on the union's dist · CLOSED

**Glyph-text** (the copied pass-6 statistic, core median over coverage ≥ 0.5) beside the ONE `glyph-pop` whole population, 1280×800 fine DPR 1, the union `C_SlSGoMXD5k` vs the control, line one after the ask:

| cell | control text · pop | union fresh text · pop | union SETTLED text · pop | plants (FAINT30, TAIL12, TAIL35, EMPTY) |
|---|---|---|---|---|
| cr light | 14.517 · 4.534 / 0.498 | 14.517 · 2.563 | **5.172 / 0.458 · 2.563 / 0.675** | RED ×4 |
| cr dark | 11.656 · 8.93 / 0.324 | 11.656 · 8.93 | **5.857 / 0.272 · 4.668 / 0.472** | RED ×4 |
| **wk light** | 11.419 · 5.194 / 0.468 | 11.419 · (gap 3) | **4.357 / 0.515 · 2.866 / 0.691** | RED ×4 |
| wk dark | 11.41 · 7.4 / 0.375 | 11.41 · 4.099 | **5.691 / 0.315 · 4.099 / 0.543** | RED ×4 |

The fresh column's whole-population read follows its text read by ~4 photographs and lands after the ~1.2 s settle in the cells where it equals the settled number (cr light, wk dark); it is not a fresh reading there. The 4.357 reproduces to the thousandth on the union's dist, as do pass 7's whole-population 2.563 / 2.866 / 4.099. **T9-R8 is CITED, not bent**: HOLD pays 2.563 / 2.866 whole-population at DPR 1 light at rest; the control clears 4.5. The whole-population read at the proof pose reproduces the same four numbers at +500 and +2600 ms (`logs/probe-hold-glyph.txt`).

**16×16 read-back** (`logs/probe-hold-glyph.txt`): 256 inputs, **104 of 104 givens, 0 mismatched, 0 extra**, glyphs `1…9 A…G`, chromium and WebKit, the union AND the control.

## Leader duties (§7)

- **The section's number.** The critic's. Registry-v7 holds §7 at 91 with LEDGER leading; ERASE's pass-8 critic reads ERASE at 91. The fence is GATED on the union (row 6), not declared.
- **The T9-B-LEDGER composite:** the path and caption are in row 6.
- **The reserve law's clause-sabotage table:** row 4.
- **ERASE rows the union carries whatever the owner answers** (LAWS §H): `stopTheClock` on `@leave` keyed on the leave's COMPUTED `animation-name`, for both lines (it supersedes S2); the two-axis clock (duration AND delay, inline `!important`); line two on the same fence; the consumer row (`leave` consumed, `chromeLeaveMs` deleted, `step`/`throw`/`rise` named by union file); the registration row through the library.
- **Grafts to ERASE, riding the union** (`L8`, lint:ink 0, test:font-coverage 0, the spec 6/6): the reserve law, MUST_CLOSE and its plants, the `nowrap` clip.

## π · AA · constraints

**π** — tree `DJCNAPCsWtTd` vs `74a2b5d9`, whole DOM (`#app *` rects + line-height + min-height), in-run floor = the control read twice, both engines (`logs/probe-pi-tree.txt`):

| cell | elements | note-block diffs | unclaimed | docH | floor |
|---|---|---|---|---|---|
| 390×844 coarse, rest · spoken | 1052 · 1054 | 2 · 2 | **0 · 0** | 844 = 844 | 0/0 |
| 844×390 coarse, rest | 1051 | 2 | **19**: `div.board-group` 394.48 vs 393.19 (+1.29 px) and what sits below it | 410 vs 409 | 0/0 |
| 844×390 coarse, spoken | 1053 | 2 | cr 0 · wk 19 (394.48 vs 394.45, +0.03 px) | 410 = 410 | 0/0 |
| 1280×800 fine, rest · spoken | 1092 · 1094 | 1 · 1 | **1 · 1**: `.board-margin` 23.63 vs 20.80 (+2.83 px) at rest, 23.63 vs 23.61 spoken | 800 = 800 | 0/0 |

CLAIMED by the reserve row, by name: the control's block reserves `1.3em` of its inherited 16 px (20.80 px) under a voice whose line is 22.10 px at 844×390 and 23.61 px at 1280, so the control's strip GROWS the first time its voice speaks. The tree holds the line at rest: at rest it reads the control's spoken height to ≤ 0.03 px. No other element moves.

**AA** — row 11; no ink moved this pass (the served CSS is the pass-7 bank's with the union's seat spelling: 20 tree-only rules vs the control, every one a `MarginNote` rule; `@property` 42 = 42; 43 files = 43).

**filterBudget** — no filter declaration moved (the rule diff above carries none).

**M16** — `check-copy-register` bare 0 (tree, control, union). No new UI string: the pass's strings are gate messages and a spec comment.

## Pre-return battery (bare)

`t8` = `git archive 74a2b5d9` + `pass8.diff` · `c8` = `git archive 74a2b5d9` · `L8` = union + homes.on + ERASE8 + this delta · `u8` = union + homes.on + ERASE8 (the union's control).

| gate | tree | control | union + Δ | union |
|---|---|---|---|---|
| lint:lanes · lint:theme-tokens · lint:sleep | 0 · 0 · 0 | 0 · 0 · 0 | 0 · 0 · 0 | 0 · 0 · 0 |
| lint:bands · lint:verbs | 1 · 1 (no such script) | 1 · 1 (same) | 1 (B6: not a git copy) → **0** with `GIT_DIR` read-only · 0 | same: 1 → 0 · 0 |
| lint:motion · lint:copy · lint:ink · lint:knip | 0 · 0 · 0 · 0 | 0 · 0 · 0 · 0 | 0 · 0 · 0 · 0 | 0 · 0 · 0 · 0 |
| test:e2e:projects · check-pw-projects | 0 · 0 | 0 · 0 | 1 · 1 (FLOOR BAND, gap 8) | 1 · 1 (the same) |
| typecheck:e2e · test:font-coverage · lint:live-regions · lint:catch · lint:theme-selectors · lint:boundary | 0 ×6 | 0 ×6 | 0 ×6 | 0 ×6 |
| check-copy-register · `eslint . --max-warnings 0` · `npm run lint` · `vue-tsc -b` | 0 · 0 · 0 · 0 | 0 · 0 · 0 · 0 | 0 · 0 · 0 · 0 | 0 · 0 · 0 · 0 |
| check-property-block source · `--dist` · census | 1 · 1 · 1 (row 9) | 0 · 0 · 1 (STALE) | 0 · 0 · 0 | 0 · 0 · 0 |
| the whole `note-reserve.spec.ts`, both engines | **6/6** | **0/6** (born-RED) | **6/6** | — |
| ERASE's `the SWAP` rows ×5 | — | — | **30/30** | — |

**vitest**, chunked by directory, tree: `src/games` 57 files / 758 · `src/pencil` 9 / 75 · `src/composables` 3 / 16 = **69 files / 849 tests, 0 failed** (pass 7: 69 / 849). Union + Δ (`L8`): `src/pencil` 14 / 123 · `src/games/shared` 36 / 465, 0 failed. `src/lib` holds no test file.

## Instruments (every import by relative PRODUCT path)

- `scripts/check-ink-pressure.mjs` → `./shape-census.mjs` (`census`, `effectiveAt`, `elementSites`, `lengthPx`, `resolve`, `sabotage`, `sfc`, `sources`, `tokens`).
- `e2e/note-reserve.spec.ts` → `@playwright/test` only (no instrument).
- Scratch probes (in `instruments/`, run from an out-of-tree copy only): `l8.probe.ts` → `../e2e/wire`, `../e2e/lib/glyph-pop.mjs`; `glyphtext.probe.ts` → `../e2e/lib/glyph-pop.mjs` (`glyphPopulation`, `TEXT_PLANTS`, `applyPlant`) + the copied `./p6aa.ts` (gap 2).
- No file in `e2e/` or `scripts/` imports from `docs/`. No instrument was forked or ported.

## Replay route

1. Open: the tree's diff through `GIT_INDEX_FILE` against `pass7.diff` + `homes.diff` (both rebuilt through temporary indexes); decide per hunk (table above).
2. Edit in place: `e2e/note-reserve.spec.ts` (PRM head, two casts), `scripts/check-font-coverage.mjs` (prettier).
3. Cut: `instruments/cut.sh` (temporary index, `.ledger8` excluded) → `pass8.diff`.
4. Copies: `instruments/mkcopy.sh` (`git archive 74a2b5d9` + diffs; node_modules symlinked; an existing copy is MOVED to trash). Tree `t8` = + `pass8.diff`. Union `L8` = + `s13-s7-s3.diff`, `homes.on-s13-s7-s3.diff`, ERASE8's delta, then `instruments/port.py <worktree> <L8>` and `scripts/shape/` moved out → the delta by `git diff 1f104003 <L8 tree>`.
5. Builds: `instruments/build.sh` (two-line `.mts`, private cacheDir outside every root); arms by `instruments/build-arms.sh`.
6. Serves: `instruments/serve.sh up|down` (up never frees a held port; down kills only the recorded listener with the recorded wrapper among its ancestors, the recorded cwd and the recorded identity).
7. Rows: `src-battery.sh` (rows 1, 2, 4, 5 + born-REDs + literal deletions), `run-a.sh` (row 3 tree/control + π), `run-b.sh` (row 3 union, row 6 gate + panels, rows 7, 11), `run-d.sh` (row 3 on the final bytes, row 11 glyph-text), `run-e.sh` (gap 3), `battery.sh`, `vitest.sh`, `composite8.mjs` then `pngquant 12 --nofs`.

## Incidents (self-declared)

1. **A resumed lane, twice over.** The chair named one dead attempt (`wf_a564d4fb-2e7`, 21:4x–23:3x). A SECOND one (03:12–03:25, in this session's scratchpad `ledger8/p8/`) had also worked the tree: its edits at 03:19–03:22 are the `check-ink-pressure`/`check-font-coverage`/spec hunks above, and it left two servers up on MY ports, `:4249` (wrapper 58130, listener 58173, cwd `ledger8/p8/t8`, `DJCNAPCsWtTd`) and `:4250` (58213/58259, `w7-control`, `CubiZsMVSwTc`), recorded in its `servers.txt`. I verified cwd, ancestry and identity, reused both, and stopped both through that guard (`logs/servers.txt`). No sibling's port was touched (`:4236` and `:4251` were held by ACC-FIVE's tree and a control throughout).
2. **A dead attempt's scratch file overwritten.** At open I wrote my temporary index to `ledger8/idx`, a name the first dead attempt had used. It held no evidence.
3. **Gates red on the dead attempt's bytes, then finished:** `lint:motion` 1, `typecheck:e2e` 2 and `npm run lint` 1 on the tree (`logs/battery-t8.txt` is the final run: all 0 but row 9's). Every row that ran on the pre-fix spec was re-run on the final bytes (run-d).
4. **One background run double-counted:** the `glyphask` call had no file filter, so it also ran `glyphtext.probe.ts`; both runs are logged and both are read.
5. **One wait was blocked:** a foreground `sleep 45` was refused by the harness before it ran.
5b. **A stall-law breach:** one foreground `until grep …` wait on the source battery ran to the 115 s harness limit and was moved to the background (box 1-min 120–162 at the time). Nothing was lost; the battery's own log carries every exit.
5c. **The source battery ran twice.** The first run (03:32) was on the pre-prettier `check-font-coverage.mjs` (sha1 `610f7b52…`); its logs are moved aside and every row cited is the second run on the final bytes (`2108b1a2…`, `logs/src-battery.txt`).
6. **An apply-check line printed no exit code** (zsh has no `PIPESTATUS`); that row is reported by its error lines only.
7. **No `rm` of any form, no `git clean`, no git in the control tree, no git in a sibling's tree.** Discards were MOVED to `<scratchpad>/trash-ledger8-3/`. `/tmp` untouched.
8. **Worktree at return:** product files only (13 M, `e2e/lib/`, `e2e/note-reserve.spec.ts`, `scripts/shape-census.mjs`, `src/pencil/chrome/MarginNote.test.ts`, `src/pencil/config/motionRungs.ts`); `.ledger8/` moved out.
9. **Servers:** every server stopped by the guard; `:4249` and `:4250` read free at return.

## Ballot rows for the owner (U-10; nothing fires before the eye)

- **T9-B-LEDGER** — HOLD (default) · AGE · STEP · TINT, framed on the fenced union (row 6). HOLD's loss is T9-R8's settled rung, the same as TINT's (row 11). TINT quiets at the proof; STEP equals HOLD at P4; AGE loses the thesis pose.
- **The 2lh seat** (§2.3d) — 1lh (default, shipped) · 2lh: numbers only (row 7), unframed (gap 4).
- **The landscape depth** and **the hand's cut** (R6 law 30, 46 → 54 codepoints, ≈ +750 B) — unchanged from pass 7.
