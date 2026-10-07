# NOTE-LEDGER · pass-8 CRITIQUE

I'm the critic. I didn't write the charter, the prototype or the spec. Base and π control: `74a2b5d9`.

**Convergence: 92 (+1). Verdict: ADVANCE. §7 on the union: 91.** The fence is gated, but ERASE's ghost-name plant repaints the pass-7 double paint on the union (156–167 ms), and the union can't read above a defect it ships (§10).

Pass 8 closed what pass 7 refused on the rows it was given. The behavioural row now ships and reds the control. The shipped plants cover every clause, and deleting any clause reds the self-test (I did it literally, 6 of 6). The corpus pin holds the pass-7 split. The composite is re-shot on the fenced union. Every number I re-derived reproduces to the hundredth.

What holds the number is the same class, on its fifth pass:

1. **A double evasion paints the defect the reserve exists for, with every gate green, in both engines.** One rule, `.margin-note-block > p:first-child:has(.margin-note-ink) { line-height: 2.2 }`:
   - `lint:ink` (bare) reads **0**.
   - The shipped spec's own predicate holds on the empty voice in every phone cell, both engines, both themes.
   - On the first sentence the strip grows **+14.39 px** at 390×844, **+15.27/+15.30 px** at 844×390 (docH 410 → 426) and **+16.34 px** at 1280×800 (docH 800 → 811).

   The source law reads the voice's line from CLASS sites only, and the spec reads the EMPTY voice only. Neither reads "rest = spoken", which is the invariant the row exists for.
2. **The source law misses five one-line edits that paint the empty voice at 0 px** (`lint:ink` 0; the spec reds each in paint, both engines, both themes):
   - N3: a seat through a guaranteed-invalid `var()`
   - N4: the voice's font set through an element-keyed selector (line 52 over a 20.80 reserve)
   - N5: the seat in a dead `@supports`
   - N6: the seat in a `@container` that never matches
   - N7: the seat narrowed to `:not([role])`

   CI is browserless (O-12), so CI's only reserve gate is `lint:ink`, and it's green on all five.
3. **Declared and carried:**
   - @property C4 and TIMING 4 on this tree (the fold's; 0/0/0 on the union)
   - the berth is unbooked
   - the 2lh ballot is unframed
   - two compositions of the reserve law (lane gap 1)
   - T9-B-LEDGER awaits the owner

## 0 · Setup (mine; the lane's tree read only, through a temporary index)

- **The bank.** I re-cut the work tree with `GIT_INDEX_FILE=<scratch>` (`read-tree HEAD`, `add -A`, `diff --cached --binary HEAD`). The result is 439,547 B, sha1 `5f96869f77614f257b220aa130f1907f3c66d5f3`, tree `6cd3e25d`, 22 files +9067/−112. It's `cmp`-equal to `pass8.diff`.
- **Apply checks** (fresh `git archive 74a2b5d9`, `logs/apply.txt`):
  - `pass8.diff`: check 0 / apply 0.
  - `pass7.diff` then `homes.diff`: 0 / 0.
  - The union `s13-s7-s3.diff` → `homes.on-s13-s7-s3.diff` → ERASE8 delta → LEDGER8 delta: all four 0 / 0.
- **The pass-8 advance** (`74a2b5d9 + pass7.diff + homes.diff` vs `74a2b5d9 + pass8.diff`): 7 files, +712/−1093. I read it whole:
  - `MarginNote.vue` +21: the seat re-spelled `line-height: calc(var(--type-body) * var(--type-leading-caption)); min-height: 1lh`
  - `check-ink-pressure.mjs` +312: R1–R4 composed from the library's `census`/`elementSites`/`effectiveAt`/`lengthPx`/`resolve`/`sabotage`
  - `check-font-coverage.mjs` +230: `deriveGroup` factored out, MUST_CLOSE by `/^margin/` plus a string-held clause, 7 self-test rows
  - `check-pw-projects.mjs` +1
  - `e2e/note-reserve.spec.ts` +248
  - `scripts/shape/` −993
- **Homes.** Against a homes-only copy, the tree's `scripts/shape-census.mjs` and `e2e/lib/*` are byte-identical. No fork.
- **Imports.** `check-ink-pressure.mjs` → `./shape-census.mjs`. The spec imports `@playwright/test` only. `grep` finds no `docs/` import anywhere under `e2e/` or `scripts/`.
- **Builds** (two-line `.mts`, cacheDir outside every root):
  - tree `index-DJCNAPCsWtTd.js`
  - union `index-C_SlSGoMXD5k.js`

  Both are the lane's, reproduced.
- **Served CSS, tree vs control** (my clean out-of-tree build):
  - `@property` 42 = 42 (union 50); 37 assets = 37.
  - 15 top-level rules are tree-only, every one a `MarginNote` scope rule. The one `@layer utilities` difference is the pass-7 `ink-rub-out`/`-fade` keyframes, and no utility class differs. **Not contaminated.**
- **Servers.** Everything went through `instruments/serve.sh`, which never frees a held port and kills only after checking the recorded listener, wrapper ancestry, cwd and identity:
  - :4249 served the tree `DJCNAPCsWtTd`, then the union `C_SlSGoMXD5k`.
  - :4250 served `w7-control` `CubiZsMVSwTc` through its own `.vite-control.config.ts`.

  Both ports read free at return. No sibling port was touched.
- **Box load (1-min).** 17–230 across the critique. Every browser log line carries its own load.

## 1 · The pass-7 plants FIRST, on every re-cut gate

**Reserve law** (`instruments/plant.mjs` + `run-plants.sh`, each plant written to a scratch copy's `MarginNote.vue`, bare `node scripts/check-ink-pressure.mjs`, restored by copy; sha1 `d5d8f3d3ffb2` before and after; `logs/plants-src.txt`):

| pass-7 critic's plant | pass 7 | **pass 8** |
|---|---|---|
| M1 block `min-height: 1px` inside <1024 | 0 | **1** (R4 1.00 px) |
| M2 seat under `not all and` | 0 | **1** (R3 holds in tablet/desk) |
| M3 seat in the landscape block only | 0 | **1** (R3 holds in landscape only) |
| M4 block `font-size: 1px` <1024 | 0 | 0, **correctly**: the block's line is now a length, so `1lh` holds (the spec's negative agrees: 20.80 px) |
| M5 `display: contents` | 0 | 0 (a source law can't see it; the spec reds it) |
| M6 `> p:first-child { min-height: 0 }` | 0 | **1** (R1, element-keyed) |
| M7 `[role="status"] { min-height: 0 }` | 0 | **1** (R1) |
| M8 unsatisfiable conjunction | 0 | **1** (R3 holds in []) |
| M9 NN `max-height: 0` | 0 | 0 (correct) |
| M10 NN dead `@supports` zero | 0 | **1: a FALSE RED.** The library reads `@supports` as live, the conservative side of N5 below |
| OLD number · wide · desk | — | **1 · 1 · 1** |

**Clause sabotage, by LITERAL deletion** (mine; `instruments/literal-del.sh`). Each clause's test is replaced by `false` in a scratch copy, `node --check` reads 0, then `--self-test` runs bare (`logs/literal-deletions.txt`):

| clause | exit | the plant that went GREEN |
|---|---|---|
| R1 | **1** | seat deleted |
| R2 | **1** | zeroed |
| R3-important | **1** | `inherit !important` |
| R3-seat | **1** | wide |
| R4-every-site | **1** | M1 |
| R4-consumer | **1** | clean tree reds (19.20 < 20.80) |

The lane's switch battery also reproduces: `--self-test --plants --sabotage-battery` exits 0, with 23 `plant ok`, 0 BAD, and 10 of 10 clauses RED (`logs/ink-t8.txt`, 41.8 s).

**Corpus pin** (`logs/fc-*.txt`):

| plant | self-test | bare |
|---|---|---|
| clean | 0 | — |
| pass-7 critic's split (`font-coverage-split.plant.cjs`, the verdicts moved to an open twin deriving `marginVerdictCopy`) | **1** | — |
| the same + `setMargin("solved it!", …)` deleted | **1** | **1** (the open twin "derives the margin's vocabulary") |
| **mine**: NARROW `marginVerdictCopy` (its `setMargin` grab removed), a new extractor `boardVerdicts` not named `/^margin/`, the four `setMargin` verdicts moved to an OPEN group deriving it, the call site deleted (`instruments/fc-narrow.plant.cjs`) | **1** | **0**, the deletion printed as a departure |

On my plant the CI form reds. The red comes from the self-test row "`setMargin("solved it!")` deleted", which reads 0 findings once the named extractor no longer reads call sites (a vacuity catch keyed on `marginVerdictCopy` BY NAME), not from the pin. The pin itself is still keyed on the extractor's NAME prefix. **Held in CI; noted, not a red.**

## 2 · New plants (mine), source and paint

**Source** (`lint:ink` bare on a planted copy; `logs/plants-src.txt`):

| plant | `lint:ink` |
|---|---|
| N1 voice `min-block-size: 0` <1024 | **1** (R1: the logical longhand is a site) |
| N2 block `min-block-size: 1px` <1024 | **1** (R4 1.00) |
| **N3** `--seat: inherit; min-height: var(--seat)` | **0** |
| **N4** `.margin-note-block > p:first-child { font-size: 40px }` | **0** |
| **N5** seat inside `@supports (display: nonsense)` | **0** |
| **N6** seat inside `@container (min-width: 5000px)` | **0** |
| **N7** seat narrowed to `.margin-note:not([role])` | **0** |
| N8 seat `and (hover: hover)` | **1** |
| N9 seat `and (prefers-color-scheme: dark)` | **1** |
| N10 seat `and (pointer: fine)` | **1** |
| N11 `.margin-note:not(:empty) { line-height: 2.2 }` | **1** (R4 35.20) |
| N12 voice `font-size: 30px` by class | **1** |
| N13 `min-height: calc(1lh − 12px)` | **1** (8.80) |
| N14 block `font: 16px/1px serif` <1024 | 1, but for the wrong reason: it reads 19.20 (`normal`), not the 1.00 that paints |
| N15 seat inside `@layer` | 0 (a true negative: nothing competes) |
| N16 `:where(.margin-note-block) > * { min-height: 0 !important }` | **1** (R1) |
| N17 seat `and (orientation: portrait)` | **1** |
| N18 seat `and (min-resolution: 3dppx)` | **1** |
| **N19** `.margin-note-block > p:first-child:has(.margin-note-ink)` / `:not(:empty)` `{ line-height: 2.2 }` | **0 / 0** |

The media evaluation is real: hover, pointer, theme, orientation and resolution each evaluate. **The holes sit outside `@media`:**
- `@supports`/`@container` read as live;
- a selector the template never matches is counted as the seat (element keying is used for R1's COUNT, not to prove the seat reaches the voice);
- a custom property carrying a CSS-wide keyword resolves to the keyword;
- R4's voice line and font read CLASS sites only (`at("margin-note", …)`), while R1 is element-keyed. That's the lane's own composition disagreeing with itself.

**The chair's ONE library reads the same holes** (`instruments/tree-plants2.sh`: each plant written to `tp`'s `MarginNote.vue`, then `node scripts/shape-census.mjs --tree .` bare, and its own `clean` row read; `tp` restored by copy, `cmp`-equal; `logs/tree-plants2.txt`):

| plant | library `--tree` exit | library's `clean` row | `lint:ink` |
|---|---|---|---|
| N3 `var(--seat)` holding `inherit` | 2 (a library plant's anchor is absent on the planted source) | **GREEN** | 0 |
| N4 voice font by element | 0 | **GREEN** | 0 |
| N5 dead `@supports` | 0 | **GREEN** | 0 |
| N6 dead `@container` | 0 | **GREEN** | 0 |
| N7 `:not([role])` | 2 (anchor) | **GREEN** | 0 |
| N19 `:has(.margin-note-ink)` line 2.2 | 0 | **GREEN** | 0 |

So these aren't the lane's composition drifting from the library (lane gap 1): both compositions agree, and both are wrong in the same place. The cure belongs to the one copy, as PROPOSED clauses with their plants. The earlier run of this script (`logs/tree-plants.interrupted.txt`) was cut off by the session's end mid-N4, with `tp` left planted; I restored it before re-running.

**Paint** (`instruments/crit8.probe.ts`, the shipped spec's `read` + `holds` verbatim, the tree `DJCNAPCsWtTd` on :4249, 390×844 + 844×390 coarse DPR 2 `hasTouch`, pointer witnessed, both themes, both engines; `logs/pw-probe-plants*.txt`):

| plant | 390×844 | 844×390 | verdict (all 4 engine×theme cells) |
|---|---|---|---|
| clean | 20.80 | 22.09 | holds |
| N1 | 0.00 | 0.00 | RED |
| N2 | 1.00 | 1.00 | RED |
| N3 | **0.00** | **0.00** | RED (source 0) |
| N4 | 20.80 under line 52 | 22.09 under 52 | RED (source 0) |
| N5 | **0.00** | **0.00** | RED (source 0) |
| N6 · N7 (390 only) | **0.00 · 0.00** | — | RED (source 0) |
| N8 | 0.00 | 0.00 | RED |
| N9 | 0.00 light / holds dark | same | RED light, holds dark (correct) |

Every plant came back GREEN once removed. **The behavioural row catches everything the source law misses, as the SHAPE law's clause (iii) intends.** It runs locally only, and CI's reserve arm is the source law.

**The spoken half** (`MODES=spoken,double`; the strip is `.board-margin`'s rect; the hint is the product's `h` key; `logs/pw-probe-spoken.txt`, `logs/pw-probe-double.txt`):

| arm | cell | strip rest → spoken | docH | engines |
|---|---|---|---|---|
| tree | 390 · 844 · 1280 | 20.80 → 20.80 · 22.09 → 22.09 · 23.63 → 23.63 | = | both |
| control | 390 · 844 · 1280 | 20.80 → 20.80 · 20.80 → 22.09/22.06 · 20.80 → 23.61 | 409 → 410 at 844 | both |
| **N19 `:has(.margin-note-ink)`** | 390 · 844 · 1280 | **20.80 → 35.19 · 22.09 → 37.39/37.36 · 23.63 → 39.97** | **410 → 426 · 800 → 811** | **both, both themes; the spec's `holds` TRUE at rest in every phone cell** |
| N19 `:not(:empty)` | same | same in chromium; WebKit doesn't re-match `:empty` (0 growth) | | chromium |

The product holds its claim: at rest the tree reads the control's spoken strip, and it never grows. But no shipped gate reads that claim, so the double evasion ships green.

## 3 · Re-derived measurements (both engines)

| lane row | the lane's number | mine |
|---|---|---|
| **3** · `note-reserve.spec.ts` on the tree | 6/6 | **6/6 passed** (`DJCNAPCsWtTd`, 10.5 s; spec sha1 `fe1c2d6c3ccb` = the work tree's). WebKit reserve 20.796875 (LayoutUnit) vs line 20.799999, inside the 0.5 slack |
| 3 · on the control | 0/6 | **6 failed**. The clean voice is 0 px in every cell (light). **The control's DARK arm is never read**: the test aborts at the light expect |
| 3 · on the union | 6/6 | **6/6 passed** (`C_SlSGoMXD5k`, 11.5 s) |
| **π** 1280 fine, `.board-margin` | 23.63 vs 20.80 rest; 23.63 vs 23.61 spoken | **23.63 vs 20.80 (+2.83) · 23.63 vs 23.61**, both engines, docH 800 = 800 |
| π 844×390 | +1.29 board-group, docH 410 vs 409 | strip **22.09 vs 20.80 (cr +1.29, wk +1.26)**, docH **410 vs 409**; control spoken → 410 |
| π 390×844 | 0 | 20.80 = 20.80, docH 844 = 844 |
| **7** · the 2lh seat on the union | +18 desk, +23/+22 landscape, portrait board +10.40 | **desk 800 → 818 (+18), 844×390 410 → 433 (+23), 390×844 board 221.73 → 211.33 cr / 221.42 → 211.02 wk (10.40)**, both engines, rest = spoken |
| 9 · @property / census, tree | 1 · 1 · TIMING 4 | **cpb source 1, `--dist` 1** (C4 `motionRungs.ts:26`, served 42, stamp `DJCNAPCsWtTd`) · **census 1** (`MarginNote.vue:316/330/331/538`); control 0 · 0 · 1 (STALE) |
| 9 · union + Δ | 0 · 0 · 0 | **0 · 0 · 0**; `lint:ink` 0, `test:font-coverage` 0 |
| filterBudget (static, built CSS/JS) | no filter moved | tree `filter:` 9 · css `url(#` 3 · js `url(#` 16 = control 9 · 3 · 16; union 8 (the ratified crayon-heart) |
| evidence policy | PASS | **PASS**, exit 0 |

Not re-derived (cited): row 6's 30/30 fence gate (ERASE's critic reproduced the fence at 7.1–16 ms on the same union), row 11's glyph-text 4.357 and 16×16 read-back, the vitest counts.

**Battery (bare; tree `t8` | control `c8`; `logs/battery-*.txt`):**

| gate | tree | control |
|---|---|---|
| lint:motion · lint:copy · lint:knip | 0 · 0 · 0 | 0 · 0 · 0 |
| test:e2e:projects · check-pw-projects | 0 · 0 | 0 · 0 |
| typecheck:e2e · test:font-coverage · check-copy-register | 0 · 0 · 0 | 0 · 0 · 0 |
| eslint `--max-warnings 0` on the five changed files | 0 | 2 (the files don't exist there: not a reading) |
| `npm run lint` (prettier) | 0 | 0 |
| cpb source · `--dist` · census | **1 · 1 · 1** | 0 · 0 · 1 |

## 4 · The frame, checked against the image

`T9-B-LEDGER-union+homes+ERASE8+LEDGER8-fenced-…-left460.png`: 30,375 B, 1696×492, colour type 3, `check-evidence-policy` PASS. The retiree `pass7/…/T9-B-LEDGER-union+ERASE7+LEDGER7-…-dpr1.png` is 31,660 B. What I checked:
- **The caption is on the image** and names the payload, the one variable, P4, the engines, the themes, both viewports, pointer and DPR.
- **At +100 ms** HOLD and STEP paint line one at full graphite over line two, TINT is quiet at once, and AGE paints one line lower in the strip. No arm shows one sentence twice.
- **At rest** HOLD = STEP = TINT, and AGE has one line. The same holds in the dark rest column and in both 1280 panels.

The claims hold. Two points:
- The dark theme is framed at rest only (the losing instant for T9-R8 is rest, so that's lawful).
- The 1280 panel is light only.

The composite spends 30,375 B of the 151,826 B headroom by name (net −1,285 B once the chair sweeps the retiree).

## 5 · Failure-mode checklist

| item | verdict |
|---|---|
| vacuous convergence | clear: the control reds the spec 6/6 and the gate 15 R1 sites |
| spec-cites-itself | clear |
| **gates that cannot fail** | **HIT (narrowed).** N19 evades both gates and paints +14–16 px of strip growth, both engines. N3/N4/N5/N6/N7 are green in CI's only reserve arm. The sabotage battery itself is honest (literal 6/6) |
| elegant-reduction trap | narrow: "the fold should collapse `lint:ink` onto an exported library reader" is named, not done |
| legacy aliases | clear |
| masked fallbacks | clear. `fontOf` defaults to 16 and `lineOf` to 1.2 × size when no site is found. Both are silent defaults, and neither is exercised by a plant |
| unverified gestalt | clear: frame looked at; RECTs read both engines, both themes |
| consumer-less substrate | moved: `deltaE` now lives in the chair's home, silenced by knip `entry` (not `@public`); its only caller is the library self-test; the named fold consumer (`theme-bake-freshness.spec.ts:205`) carries its own copy |
| the generic default | clear |
| π | CLAIMED and reproduced: +2.83 at 1280 rest and +1.29/+1.26 at 844 are the control's growth-on-first-speech, held at rest by the tree; spoken ≤ 0.03 |
| the constraint it breaks silently | AA: no ink moved (served CSS). filterBudget = control. M16 0/0. @property: **breach on this tree (fold's; union 0)** |
| instrument from `docs/` or hand-rolled | clear: every import by relative product path, homes byte-identical; `p6aa.ts` is a copied scratch statistic, not a product import |
| a number the critic did not re-derive | row 6 gate, row 11, vitest: cited above |

## 6 · Gaps, exactly

1. **The spoken half of the reserve is ungated** (N19): a shipped row must read the strip (and the board's top) at rest and after a sentence at the three phone cells + 1280, both engines, with `:has(.margin-note-ink)`-keyed line growth as its plant.
2. **R4 reads the voice's (and the block's) font-size/line-height from CLASS sites only** while R1 is element-keyed (N4 reads 0 at source, and the library's `--tree` reads it GREEN too). Use `elementSites` for all four, in the library.
3. **The source law reads `@supports`/`@container` as live, counts a seat whose selector matches no template element, and resolves `var()` to a CSS-wide keyword** (N3/N5/N6/N7 green at source, 0 px in paint). The chair's library reads every one GREEN in its own `--tree` reading (§2), so all of them are PROPOSED clauses to the ONE copy, each with its plant. None of them is only the lane's composition.
4. **CI's reserve arm is `lint:ink` alone** (the spec is a local instrument under O-12). Say so in the row's head, or give it a browserless pin.
5. **M10 false-RED:** a dead `@supports` zero on the block reds `lint:ink`. That's conservative, so it isn't a hole, but it's the same missing clause as gap 3.
6. The corpus pin is keyed on the `/^margin/` NAME; my narrowing plant is caught by a vacuity row keyed on `marginVerdictCopy` by name, not by the pin.
7. Two reserve compositions (the lane's gap 1), @property C4 + TIMING 4 on this tree (the fold's), the berth unbooked, the 2lh ballot unframed, ERASE's ghost-name plant and registration row (ERASE's critic), the control's dark arm unread by the spec, glyph-text on a copied statistic, no second non-author reading of the frame. The T9-B-LEDGER composite frames STEP pixel-identical to HOLD at every framed instant (the lane: "STEP = HOLD at P4"), so the owner can't see the one variable STEP carries on this payload. Frame STEP's distinguishing instant, or strike the arm to its numbers.

## 7 · Verdict

**ADVANCE at 92** (pass 7: 91). §7's number on the union: **91**. The fence is gated (ERASE's), but its ghost-name plant is open and repaints the defect the fence exists for, so the union is held at ERASE's 91 (§10).

**+1 earned:**
- the behavioural row shipped, born-RED on the control, both engines, both themes, three cells, reproduced on the tree and the union;
- every clause has a plant, and deleting any clause literally reds (6/6);
- M1/M2/M3/M6/M7/M8 red at source, plus five media axes I added;
- the pass-7 corpus split reds;
- the frame is lawful, re-shot fenced, and matches its caption;
- π, the 2lh cost, and the bank and identities all reproduce to the hundredth.

**8 refused:**
- The row's own invariant (nothing under the voice moves when it speaks) has no gate, and one CSS rule paints +14–16 px with every gate green in both engines.
- Five one-line edits pass CI's only reserve arm.
- The tree still breaches `@property` (the fold's).
- The section waits on the owner's T9-B-LEDGER answer and ERASE's ghost plant.

## 8 · Replay

1. `instruments/mk.sh <dest> <diffs…>` builds the copies:
   - `c8` = `git archive 74a2b5d9`
   - `p7h` = + `pass7.diff` + `homes.diff`
   - `t8`, `tp`, `tf`, `ts` = + `pass8.diff`
   - `u8` = + `s13-s7-s3` + `homes.on` + ERASE8 delta
   - `L8` = `u8` + LEDGER8 delta
2. `instruments/build.sh t8|L8`.
3. `instruments/serve.sh up 4249 …` (tree, then union) and `up 4250` (control, its own config).
4. Source:
   - `run-plants.sh` (plant.mjs)
   - `literal-del.sh`
   - `tree-plants.sh`
   - `fc-narrow.plant.cjs` + pass-7's `font-coverage-split.plant.cjs` on `tf`
5. Paint: `pw.sh spec-tree spec 4249`, `pw.sh spec-control spec 4250`, `pw.sh probe-plants probe plants`, then `spoken`, `double`, `plants2`, `spec-union`, `seat2` (from `ts/web/frontend/.lcrit8/`).
6. `battery.sh t8 <dist>` / `c8 <control dist>`.

## 9 · Incidents (mine)

- **I stopped my own battery mid-run.** My first source battery ran `shape-census --tree` per plant (~90 s each, 31 plants). I stopped it: first my script (PID 40181, verified by its command path), then its orphaned child (PID 46173, cwd verified as my `tp` copy). I re-ran without `--tree`. The partial log is moved aside as `logs/plants-src.aborted.txt`.
- One foreground `sleep 30` was refused by the harness before it ran.
- **Temporary-index cut.** I ran `git read-tree`/`add -A`/`diff`/`write-tree` in the lane's worktree with `GIT_INDEX_FILE` pointing at my scratch, as the brief asks. It writes blobs into the shared object store. The worktree's own index and files were untouched. I ran no git in the control tree or in any sibling's tree.
- No `rm` of any form, no `/tmp`. All scratch lives under `<scratchpad>/lcrit8/`, the chair's to clean.

## 10 · Resumed critique (2026-09-25 09:42–09:56): the disk audited, the load-bearing rows re-derived

The first critique session ended at about 04:24, after this README was written and before the return. Its last script (`tree-plants.sh`) had been cut off mid-N4 with the `tp` copy left planted, and one placeholder in §2 was never filled. I audited the disk against the scratch (`<scratchpad>/lcrit8/`, intact, same session):
- the README;
- 31 logs, all copied 04:23;
- the eight instruments.

Then I finished the critique rather than redoing it:
- **`tp` restored** by copy from `t8`, `cmp`-equal, before anything ran.
- **The library row** (§2, `instruments/tree-plants2.sh` + `plant19.mjs`, `logs/tree-plants2.txt`) now fills the placeholder. The chair's `shape-census --tree` reads its own `clean` row GREEN on N3/N4/N5/N6/N7/N19, and `lint:ink` reads 0 on each. That moves gaps 2 and 3 from "the lane's composition" to the ONE library.
- **N19 re-derived, both engines, both themes** (`logs/pw-probe-double-r2.txt`: tree `DJCNAPCsWtTd` on :4249, 24 rows, 6 passed, load 34–37). Every cell reproduces the first session's to the hundredth:

  | cell | strip | docH | engines |
  |---|---|---|---|
  | 390×844 | 20.80 → 35.19 | 844 | both |
  | 844×390 | 22.09 → 37.39 (cr) / 37.36 (wk) | 410 → 426 | both |
  | 1280×800 | 23.63 → 39.97 | 800 → 811 | both |

  - The spec's `holds` reads TRUE at rest in every phone cell.
  - WebKit doesn't grow on the `:not(:empty)` twin (it doesn't re-match `:empty`), while `:has(.margin-note-ink)` grows in both engines.
- **Row 3 re-derived.** `note-reserve.spec.ts` (sha1 `fe1c2d6c3ccb` = the work tree's):
  - on the tree :4249: **6/6 passed** (13.1 s, exit 0, `logs/pw-spec-tree-r2.txt`);
  - on the control :4250 (`w7-control`, `CubiZsMVSwTc`): **6 failed** (exit 1, `logs/pw-spec-control-r2.txt`), clean voice `height 0` against line 20.80 (360×800 cr) and 22.10 (844×390 wk).
- **Servers.** My servers went up and down through `instruments/serve.sh` by recorded listener + wrapper ancestry + cwd + identity: :4249 listener 70552 and :4250 listener 70834, both killed by that check (`logs/servers.txt`), and both ports read free at return. The box was shared with two foreign Playwright estates (value.js, fourier-analysis). I touched no process of theirs. Load (1-min) was 7–46.

**What changes on my reading.**
1. **The union number.** The first session printed §7 on the union at 92 with ERASE's ghost-name plant "open". I don't accept that. A computed `animation-name` naming no `@keyframes` repaints the sentence on both lines for 156–167 ms on the fenced union, both engines. That's the pass-7 defect the fence and this lane's composite exist to retire, so the union ships it. §7 on the union is **91** (ERASE's critic's number), and it rises when the fence is keyed on a live `@keyframes` and the ghost plant reds.
2. **The composite's STEP arm.** STEP is pixel-identical to HOLD at every framed instant, so the ballot frames an arm the owner can't tell from the default (gap 7).
3. **The family number holds at 92.** Everything the pass-7 critic refused is closed on the rows chartered, and I reproduced it twice across two sessions. Three things keep it off 93:
   - N19, plus the rest=spoken invariant having no gate;
   - five source evasions that pass CI's only reserve arm, now shown to live in the chair's library;
   - a tree that still breaches `@property`.

**Incidents (this session).**
- Five `until`-loop waiters (two Monitors, three background Bash) were killed together with exit 144 while the plant run itself survived. I then waited in foreground loops of 108 s or less.
- One foreground `sleep 50` was refused by the harness before it ran.
- No `rm`, no git anywhere (the bank was already `cmp`-verified in §0), and no write outside `<scratchpad>/lcrit8/` and this directory.
