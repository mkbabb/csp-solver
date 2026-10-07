# ACC-SIX · pass 8 · adversarial critique (§3 accent, leader)

**Number: 85, held (the prototype claims 86). Verdict: ADVANCE.**

Every pass-7 gap the charter named is closed and reproduced, but two new holes of the SAME two classes turned up. The yield's resize half has no gate: deleting the ResizeObserver keeps `count-yield` 8/8 GREEN while the product paints the count on row two after a resize. The wash reach has a sixth escape: the contrast arm erases the wash, and the source gate, the paint row and every plant still read GREEN. The count line's own glyph AA is still RED at DPR 1. A family whose centre gate is blind to half its mechanism does not earn the rise.

## Gaps first (exact, open)

1. **G-RO: the yield's RESIZE path is ungated. Critic's plant `noro`, new, confirmed both engines.**
   - The plant deletes `new ResizeObserver(readYield)` in `MarginNote.vue` (`index-Cvk7QOosZDBe.js`).
   - `count-yield.spec.ts` stays **8/8 GREEN**, chromium and webkit, exit 0.
   - Resize-driver readings (`instruments/resize-yield.mjs`, `logs/run-ro.log`), taken after 3 presses:

     | resize | engine | tree | noro |
     |---|---|---|---|
     | 1280×800 → 393×699 | chromium | the count yields (`meta=null`) | the count stays and paints on ROW TWO (Range top 573.7 vs voice mid 564.3) |
     | 1280×800 → 393×699 | webkit | yields | row two (574.1 vs 564.0) |
     | 844×390 → 600×390 | chromium | yields | row two (342.8 vs 333.2) |
     | 844×390 → 600×390 | webkit | yields | row two (342.9 vs 332.6) |

   - The product's own comment claims the read "on every resize of the block or the voice (a narrower strip, the hand's font landing)". The spec drives only the text-change path (`watch … flush: 'post'`), and it waits on `document.fonts.ready` before any press, so the font-landing path is unread as well.
   - This is the pass-7 class again: the claim is not gated. The row owes a resize (and rotate) leg with `noro` as its negative.
2. **G-W7: the wash gate's sixth escape, the contrast arm. Critic's plant, new, confirmed.**
   - The plant is `--wash-blue: transparent` inside `@media (prefers-contrast: more) { :root { … } }` (`index-DRW6Je4DN4AP.js`).
   - The results:
     - `check-theme-tokens`: exit 0, wash reach 0 offences.
     - `wash-step.spec.ts`: 2/2 GREEN in both engines.
     - Painted step under `contrast: more`: **1.000** in both themes and both engines (`logs/run-wash.log`). The tree reads 1.143 light / 1.224–1.225 dark.
   - A second variant, W8, sets the DEFAULT arm to `--wash-blue: …1%…`. `check-theme-tokens` still exits 0 (the paint row would catch this one at no-preference).
   - Why: the gate's read stops at the `--ground-wash-unit` declaration, and the ARM tokens (`--wash-blue`, `--wash-graphite`) are never read. This is "a 2 % literal" moved one indirection up.
   - The tree MOVED HEAD's `.cell-peer` contrast rule into `:root`. The paint row emulates PRM and reads only `contrast: no-preference`, against LAWS P7 §E (i).
   - The cure: the reach reads the arms (every declaration of every token the const can name, in every media block), and `wash-step` reads `prefers-contrast: more` with W7 as its plant.
3. **The count line's glyph AA is RED at DPR 1. Declared by the lane; the critic re-derived it identically.**
   - Light: 2.359 in chromium and webkit (78.9 % / 78.4 % of pixels under 4.5).
   - Dark: 4.459 chromium, 3.287 webkit.
   - DPR 2 is GREEN: light 4.667 / 4.600, dark 5.934 / 5.912.
   - Plants: 64/64 RED per engine, 0 holes.
   - The ink (`--ink-press-quiet`, `.margin-note-meta`) is HEAD's, where it serves the solve tally. SIX puts a NEW line in it for the first three writes of every deal.
   - The routing to §INK PRESSURE / NOTE-LEDGER is lawful (no local re-cure), but until that rung lands the §3 feature ships sub-AA text. This caps the number.
4. **The OUTSIDE tally (B-TALLY-16) is not built** (the lane declared it). The phone clearance caption (10 px vs 15–16) is unread.
5. **The kenken `+`/`÷` coverage row is pinned OPEN with no chair cite.** The cite is owed.
6. **Check 8 FLOOR BAND is RED on the tree** (critic's bare run: `test:e2e:projects` tree 1 | control 0; `filter-census-chromium` floor 6 vs live 8). It is declared the fold's.
7. **The T9-B-ACC6-1 caption names one variable where the arms carry two.** The const flips `--accent-ink` (the trace, which is framed) AND `--accent-glow` (the sparkle glow, which is neither framed nor read). LAWS P7 §C requires a pair's caption to name every variable the arms carry.
8. **Trace AA per arm is read on the paper core only.** The line and border split is carried from FIVE (gold) and the pass-6 ledger (violet). The critic did not re-derive it.
9. **The instrument homes are forked in the lane's tree.**
   - The tree's `e2e/lib/glyph-pop.mjs` (+40), `e2e/lib/postpaint.mjs` (+57, which also carries FIVE's `len:`) and `scripts/shape-census.mjs` (+63) differ from `homes.diff`'s ONE copy. Both deltas CARRY those edits, so a fold of SIX's delta lands instrument changes past the chair's fold (LAWS P7 §I).
   - The PROPOSED diffs are banked with plants, which is lawful. Applying them into the lane's copy is the fork.
   - `count-yield`'s PAINT clause depends on `range:`. On the seed home `read()` throws, no post-paint frames are pushed, and the ≥ 10-frame clause reds, so the gate fails loud, not vacuous.
   - Ruling owed: the chair folds the three PROPOSED rows before SIX's delta lands, or the delta drops them.

## Re-derived by the critic (critic's own archive: `git archive 74a2b5d9` + `pass8.diff`, built out of tree)

- **Dist identities reproduce byte-for-byte:**
  - tree `index-BeeuiY3JtpuQ.js`
  - overyield `index-CIWhsWYZdxWI.js`
  - late150 `index-CeCZpcJsgq2A.js`
  - graphite `index-DEgoa8MlnG89.js`
  - Served `@property`: tree 42 = control 42 = graphite 42. No Tailwind-minted `.[--…]` or `.backdrop-filter` rule is in the tree's CSS.
- **Row 1–3, `count-yield.spec.ts` on the tree:** 8/8 GREEN, exit 0 in both engines (load 7.1–7.7). Every YIELD line matches the lane's:
  - strip 20.8 at rest in every cell;
  - tab 508.73/508.42 at 393, 159.09→159.67 at 812, 398.45/398.16 at 1280, 166.59→167.23 (wk 167.22) at 844, equal to the control's own at every pose;
  - post-paint frames 33–35 chromium / 25–26 webkit, row two 0.
- **The pass-7 plants, run first:**
  - `overyield` reds FIT at 1280 and 844 (4/4 tests, exit 1 in both engines) and leaves 393/812 GREEN.
  - `late150` reds PAINT at 393/812 with 19 and 20 row-two frames (chromium) and 14 and 15 (webkit). The lane reported 19 and 14 with 812 unstated; the delta is 1 frame. It exits 1 in both engines.
- **The critic's sharper plants:**
  - `late16` (the report one frame late) **reds PAINT with 1–2 row-two frames at 393/812 in both engines**: the recorder resolves a single painted frame.
  - `raf` (the report deferred to rAF) reads GREEN. That is correct, not a hole: from the click task the rAF callback runs before this frame's paint.
  - `noro` reads GREEN, which is gap 1.
- **Row 5, count glyph AA:** light DPR1 2.359 / 2.359, dark DPR1 4.459 / 3.287, light DPR2 4.667 / 4.600, dark DPR2 5.934 / 5.912. Identical to the lane, and the same under reduce and under no-preference.
- **Row 9, wash painted step (critic driver + `wash-step.spec.ts`):**
  - tree 1.078 light / 1.103–1.104 dark = control 1.078 / 1.103–1.104;
  - graphite arm 1.120 light / 1.112 (cr) 1.114 (wk) dark;
  - in-run W1 1.016–1.026 and W5 1.000.
  - **π on the moved contrast arm:** tree = control on all 8 readings (1.143 light, 1.224/1.225 dark under `contrast: more`, both engines). The move is π-clean, and it is the move that opened G-W7.
  - The graphite arm under contrast (new): 1.262 light / 1.287 dark.
- **Row 4, clause sabotage:**
  - `shape-census --self-test` 0 and `--sabotage-battery` 0.
  - The per-clause table on `check-theme-tokens` / `check-font-coverage` reproduces the lane's 15 rows exactly (`logs/sab.log`). url-dyn, decode, const-carried, tok-sites, tw-arbitrary and at-property-site red ctt-self; tag-unresolved, h-spread, barrel, pin-binds and alias red fc-self; strip-regex, sfc-toplevel, longhand and element-keyed are 0/0/0/0, as the lane declares.
- **Row 7, FIVE's cures by sha:** `DifficultyTally.vue`, `gridPaths.poseFronts.test.ts`, `front-rate.spec.ts`, `rate-clock.ts` and `tally-flash.spec.ts` are blob-IDENTICAL to FIVE's pass-8 bank (applied through a temporary index). `gridPaths.ts` differs in two comment words only ("gold" → "violet"). `HandDrawnGrid.vue` differs by FIVE's gold-specific doc and aria literal, and SIX takes only the REQUIRED props, as declared. **G10 was not re-run by the critic** (the lane's 16/16 and slow49 3/3 stand as the lane's own readings).
- **Instrument imports:** `count-yield` imports `./lib/postpaint.mjs`, `wash-step` `./lib/paint-lib.mjs`, `tally-flash` `./lib/postpaint.mjs`, and `check-theme-tokens` / `check-font-coverage` `./shape-census.mjs`. All are relative product paths, with no `docs/` import in e2e/ or scripts/. `scripts/lib/` is gone.
- **Bank:**
  - Re-cut through `GIT_INDEX_FILE`: the tree is `3fa7af64`, and the diff is byte-identical to `pass8.diff` (585,315 B, sha1 2ee89a53).
  - `git apply --check` exits 0 on a fresh `git archive 74a2b5d9`.
  - Through temporary indexes: 74a2b5d9 + s13 = `98454964`, + homes.on = `1f8a729a`, + the on-union delta = `8bc516d0`; 74a2b5d9 + pass7 + homes (knip excluded) = `cbbc0800`, + delta = `3fa7af64`. Every tree the lane banked reproduces.
- **Battery, bare, tree | control:**

  | row | tree | control |
  |---|---|---|
  | lint:theme-tokens | 0 | 0 |
  | lint:copy (M16) | 0 | 0 |
  | lint:motion | 0 | 0 |
  | lint:ink | 0 | 0 |
  | lint:sleep | 0 | 0 |
  | lint:theme-selectors | 0 | 0 |
  | test:font-coverage | 0 | 0 |
  | lint:lanes | 0 | 2 * |
  | test:e2e:projects | **1** | 0 |

  \* the control's 2 on `lint:lanes` is the critic's archive, which has web/frontend only and no ci.yml; it is not a control reading.
- **Evidence policy:** `check-evidence-policy` exits 0 bare, and the w7 wave is at 2,043,730 B.
- **Frame, looked at:** four strips, gold over violet, light left and dark right. It is legible, and the arm is the only visible difference on the trace. See gap 7.

## Constraints checklist

- AA painted: RED on the count line at DPR 1 (gap 3). The trace passes on core only (gap 8).
- filterBudget: not re-derived. The lane reads tree 27 = control 27 dark.
- M16: `lint:copy` 0.
- π: ABSOLUTE strip and tab = control; wash = control in 16 readings; served `@property` 42 = 42.
- @property law: tree 42, no contamination.
- Ballot pair: one payload. The caption is short one variable (gap 7).
- Vacuous gate: `noro` (gap 1) and W7 (gap 2).
- Fork after batch 0: gap 9.

## Incidents (critic)

- The critic's control archive holds web/frontend only, so `lint:lanes` refuses there; that row is declared, not read.
- `check-property-block` is absent at `74a2b5d9`, so it exits 1 on both sides; the row is not applicable.
- Servers on 4237 (PIDs 27930/27993) and 4250 (89287/89320) were started by this critic and killed by recorded PID after an ancestry and cwd check. No other listener was touched.
- No git ran in the control tree. No rm was used. Nothing was committed, pushed or installed.
- Box load (1-min) was 7.1–32.6 across runs.

## Replay

Everything is under `instruments/`.

1. Build: `build.mts` with `PLANT=none|overyield|late150|late16|raf|noro|graphite|w7`.
2. Serve: `serve.sh <plant>` asserts the served identity.
3. Run `spec.sh <label> count-yield.spec.ts | wash-step.spec.ts`.
4. Run `wash-contrast.mjs <engine> <label> <url>` and `resize-yield.mjs <engine> <label> <url>`.
5. Run `sab.sh` and `bat.sh`.

Logs are under `logs/`.
