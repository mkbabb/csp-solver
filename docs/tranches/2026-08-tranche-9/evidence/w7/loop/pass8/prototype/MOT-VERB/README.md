# MOT-VERB · pass 8 prototype (§13, after MOT-LADDER)

Work tree `.claude/worktrees/wf_f72f3b5a-83a-59` (the one §13 tree), base and π control `74a2b5d9`. Bank tree **`8c12b15c`** (BANKED.txt). Section §13 stood at 83 in v7; the pass-8 number is the critic's.

**The un-clipped frame landed at `8c12b15c` (§13 tree) and at `77345798` (the union `caa4898a` + `pass8.delta.on-s13-s7-s3.diff`).** It is read in paint at desk, phone and the three 1× touch rigs, keyed on the board's device-pixel span, in both engines and both themes, on both trees. GRAPHITE's unblock condition (i) is met. Conditions (ii) and (iii) are the chair's and GRAPHITE's.

## 1 · Gaps first (open at return)

1. **GA1 WebKit reads 15/20 GREEN, not 20/20** (tree, ×5 per cell, load 25–37). Five runs red:
   - CI off 13, 8 and 7 ms: the 390 coarse cell twice, 1280 light once.
   - F1 off 21.8, 11.0 and 86.3 px: three cells of repeat 3, all at load ~29 (one of them is also the third CI red).

   Under chair §2.4 this is a named defect in WebKit, "the flush lag", not noise. The mover's first painted frame sometimes carries a started clock. The cause is not attributed and no product cure was attempted. Chromium reads 20/20 GREEN. Both plants red 5/5 in both engines.
2. **INTAKE-23 rows 2, 3, 4, 10, 11, 12, 13 and 15, plus T9-B24 and T9-B26: UNBUILT.** Each is declared in §6 with the number it dies on. These are the owner's rows, and this lane did not land them in this batch.
3. **Row 7 (the §2.11 painted gate over all inks): UNBUILT.** The freeze instrument is not replaced by the postpaint recorder.
4. **Rows 10 and 14 are not run:**
   - Row 10: the stack-open move, the late-deal regime, G-D12.
   - Row 14: P7-π, goldens 4/4 and the dark-boot census on the merged tree. Row 14's other half (ink-rub-out's consumer, 11-vs-9) is not read either.
   - π, whole-DOM, is not run this pass. The frame move is a claimed surface: 7.63 CSS px at 1280.
   - The filter census is not re-run. No filter-bearing byte moved: the product diff is gridPaths geometry, the bootHand clock and MOTION.
5. **Row 11 is NOT met.** INTAKE-22 rows 31, 32, 34, 36 (GB1 WebKit) and 41 (GB7) were not re-read. Chromium's 34 ms clause was not read.
6. **Row 12 (row 37's fourth-pass candidate): NOT RUN.** No candidate among the device-px mask, the mask `<image>` resolution and `warm()` on 0.12.1 was run.
7. **Row 13 (T9-B22's built arm; pass-7 charter rows 7/8/9): NOT BUILT.**
8. **Row 2's per-tier caps (7.8 / 16.3 / 27.1 % per frame) are not restated per tier.** The boot-hand row reads the RULED SUM as a rate instead (§2.2).
9. **The on-union delta carries this tree's `census.stamp.json`.** On the union, `check-pw-projects` reds FLOOR BAND with 3 findings, against 4 on the union base `caa4898a` without this delta (inherited). The restamp needs git and a full census: the fold's.
10. **The postpaint key change is a PROPOSED extension to the ONE copy** (`instruments/postpaint.kpaint.PROPOSED.diff`, with its plant). It is landed in this tree's `e2e/lib/postpaint.mjs` and is not yet folded by the chair (§I). The chair's `homes.diff` bytes differ from this tree's copy by that diff alone. The same is already true of LADDER's `shape-census.mjs` +84 lines.

## 2 · Numbers

### 2.1 Row 8: THE UN-CLIPPED FRAME (INTAKE-23 rows 1–2; GRAPHITE's unblock)

**Product.** In `gridPaths.ts`, `FRAME_Y_PAD = FRAME_X_PAD` (12 units on all four sides; it was 0 top and bottom). The comments in gridPaths and GameBoard are restated.

**Geometric row.** `gridPaths.frame.test.ts`: 4×4, 6×6, 9×9 and 16×16 hold every pose's stroke inside [0, 1000] within 2 units. HEAD's ring (FRAME_Y_PAD 0) is the in-file negative and reds top and bottom on every pose. The trace stays in registration. 6/6 on the tree, and 16/16 (with bootHand) on the union extraction.

**Paint row.** `e2e/frame-halfstroke.spec.ts` imports `./lib/paint-lib.mjs`. It photographs the grid ON and OFF, then reads the coverage sum across each side on the cell-centre lines:
- F1: top and bottom each ≥ 0.85 × the sides.
- F2: every side ≥ 0.6 × the stroke's device width.

It is keyed on the SVG's device-pixel span (printed). The value below is the smaller of top and bottom divided by the mean of the sides.

| rig (span) | tree chromium L/D | tree webkit L/D | control 74a2b5d9 cr / wk | union 77345798 cr / wk | union base caa4898a cr / wk |
|---|---|---|---|---|---|
| desk 1280×800 fine DPR1 (636 dpx) | 1.008 / 1.008 | 1.000 / 0.999 | 0.441 / 0.436–0.438 | 1.008 / 0.999–1.000 | 0.430 / 0.449 |
| phone 390×844 coarse DPR2 (724) | 1.003 / 1.002 | 0.999 / 1.000 | 0.435–0.436 / 0.432–0.453 | 1.002–1.003 / 1.000 | 0.445 / 0.445 |
| tablet 768×1024 coarse DPR1 (668) | 0.999 / 0.999 | 0.999 / 1.000 | 0.450 / 0.433–0.434 | 0.999 / 0.999 | 0.430 / 0.433–0.446 |
| tablet 1024×768 coarse DPR1 (604) | 1.002 / 1.002 | 1.000 / 1.000 | 0.440–0.441 / 0.432–0.433 | 1.002 / 0.999–1.000 | 0.414 / 0.445–0.446 |
| laptop 1280×800 coarse DPR1 (636) | 1.002 / 1.008 | 1.000 / 1.000 | 0.441 / 0.447 | 1.008–1.016 / 1.000 | 0.430 / 0.447 |
| **exit** | 12 passed | 12 passed | 10 failed (born-RED 10/10 per engine) | 12 / 12 passed | 10 failed per engine |

- **Depths in px.** Tree desk, chromium: t 7.70, b 7.76, l 7.64, r 7.64, against a 7.63 px stroke. Control desk, chromium: t 3.37, b 3.96, sides 7.63–7.64.
- **PLANT, in-run.** `.grid-ink { clip-path: inset(0.9% 0 0.9% 0) }` reds on the tree at 0.780 (desk) and 0.755 (phone) in chromium, and 0.686 and 0.696 in WebKit. The union reads the same. On the control and the union base the plant rows pass only because the clean read is already red, so the verdict is uninformative there.

### 2.2 Rows 2–3: the hand as a RATE, the wave hold, the stacks. `e2e/boot-hand.spec.ts`, both engines

**Rows.** The spec reads the RULED SUM post-paint, per frame, through `./lib/postpaint.mjs` `installTimeline('ruled:…')`. The wave onset is the first given digit's stroke drawn past 5 %. Bakes are counted as blob URLs minted.
- **W:** the wave ≥ ruled 95 % − one interval.
- **R:** the 60 and 30 Hz ruling ≤ 1.2 × native.
- **S (new this pass, `stacksResident`):** 0 pose bakes between the first stroke and 95 %, and `data-hand-ceiling` absent.

**The display shim.** 60 and 30 Hz are a rAF shim over the native panel. WebKit's native frame is 10 ms, so its "60 Hz" arm runs at a 20 ms interval (50 Hz) and its "30 Hz" arm at 39–40 ms (25 Hz). This is declared. Load is printed per line: 18–41 across the pass.

**THE RATE TABLE** (tree `index-paO7tVLM_11M.js`; ruling = first stroke → ruled 95 %):

| engine · display (observed interval) | ruling ms | wave (digits) ms | worst %/s | max held ms | bakes in ruling | ×native |
|---|---|---|---|---|---|---|
| chromium native (8.0 ms, driven ~125 Hz) | 2105 | 2687 | 101 | 11.8 | 0/56 | 1 |
| chromium 60 Hz (16.7) | 2121 | 2733 | 98 | 23.1 | 0/56 | 1.008 |
| chromium 30 Hz (36.7) | 2131 | 2715 | 89 | 40.1 | 0/56 | 1.012 |
| webkit native (10.0) | 2110 | 2842 | 99 | 20.0 | 0/40 | 1 |
| webkit "60" (20.0) | 2039 | 2810 | 94 | 24.0 | 0/40 | 0.966 |
| webkit "30" (39.0) | 2254 | 3215 | 87 | 43.0 | 0/40 | 1.068 |

**T9-B25's price restated per rate** (the digits' onset on the default boot): chromium 2.69 / 2.73 / 2.72 s and WebKit 2.84 / 2.81 / 3.22 s, at native / 60 / 30. Pass 7 read 4.7 s at 30 Hz, and that is cured by the rate. The control inks its digits at 0.28–0.36 s in chromium and 0.49–0.63 s in WebKit. Row 1's per-frame caps restated as the ruled sum's rate: ≤ 101 %/s at every display, both engines. The per-tier restatement is still owed (gap 8).

**Born-RED and plants**, each a build OUTSIDE the tree (`instruments/plants.sh`, one asserted replacement per build):

| arm | chromium verdict | webkit verdict |
|---|---|---|
| control `74a2b5d9` | **W** at native/60/30: the wave 253–288 ms before 95 %. **S** 44/28/28 bakes under the hand. Worst 576–646 %/s, held 74–109 ms | **W** 79–137 ms early. **S** 16/4/4. Held 66–126 ms |
| `bypass` (`afterRuling` → null) | **W** 2137–2243 ms early | **W** 2149–2367 ms early |
| `hold0` (`holdRuling` holds nothing) | **W** 2173–2303 ms early | **W** 2138–2396 ms early |
| `stacks0` (`stacksResident` resolves at once) | **S** 32/28/28 bakes under the hand (held 85–93 ms) | **S** 24/4/4 (held 64–138 ms) |
| `p7clock` (pass 7's flat `stepMs` 17 cap) | **R** 30 Hz 2.08× (4148 vs 1994 ms, 52 %/s); 60 Hz 1.11× | **R** 30 Hz 2.27× (4519 vs 1988 ms, 53 %/s); 60 Hz 1.20× (under the 1.2 bar at 50 Hz by construction) |
| **tree** | **GREEN** | **GREEN** |

**The unit rows** (`bootHand.test.ts`, 10 tests):
- 125, 60 and 30 Hz keep ≥ 0.95 of the wall's pace.
- A 300 ms stall advances the hand exactly one frame at the panel's own rate (33.3 at 30 Hz, 16.7 at 60 Hz).
- A run of stalls is capped at `maxStepMs` 34.

**The product.** `bootHand.ts` advances by min(dt, pace), where pace is the median of the last `MOTION.hand.paceWindow` (5) intervals, seeded with `stepMs` 17 and capped at `maxStepMs` 34. `stepMs` stays as the seed, banked with a ratchet reader count of 2.

### 2.3 Row 3 (hinge) · G-HINGE in `lint:bands`

`MOTION.hinge = { dark: 0.343, light: 0.249, curve }` holds each `html.theme-turning.ink-{hinge,sheet}` delay to round(dusk × fraction), at 0 s on `var(--verb-dusk-ease)`, and the dusk verb's curve to `hinge.curve`.

**Self-test, bare, exit 0.** Each of these plants reds:
- `dusk` 330
- `dusk` 340
- ONE FRAME: the dark delay 120 → 137 ms with dusk unmoved
- the step becomes a tween (50 ms)
- the dusk curve moves to `ease-in`
- the sheet's light rule is deleted
- the fractions leave MOTION

Two NEGATIVE-NEGATIVEs hold: the shipped state, and a lawful retune (dusk 330 with the delays re-derived to 113 / 82).

**Clause sabotage (§2.5)**, each clause switched off by `MOTION_SABOTAGE`, exits 1. Each clause's own plants go vacuous:
- `hinge-derive`: 4 plants
- `hinge-curve`: 1
- `hinge-present`: 1

That is 3/3 clauses biting. Every consumer is referenced by a row: `ink-hinge` by G-HINGE; `afterRuling`, `holdRuling` and `stacksResident` by boot-hand's W, W (hold0) and S.

### 2.4 Row 1: GA1 in BOTH engines, CI gated ±2 ms, PLANT f2 in-run (`e2e/fold-verb.spec.ts` through `./lib/postpaint.mjs` `readMover`)

| arm | chromium | webkit |
|---|---|---|
| tree ×5 per cell (4 cells), new key | **20/20 GREEN**: F1 ct 0 c 0 dw 0 on all 20; CI off 0 on all 20; GA2 1.000 on all 20 | **15/20 GREEN**: 3 CI reds (off 13 / 8 / 7) and 3 F1 reds (repeat 3), 5 distinct runs (gap 1). GA2 1.000 on all 20 |
| same frames through the homes' rAF-time key | **19/20 RED** (F1 read at ct 15.8–36.5, 5.7–81.9 px: frame 2 read as frame 1) | same as the new key (the entry time equals a rAF stamp) |
| PLANT skip | RED 5/5 (f1red; ct 150, 142.9 px) | RED 5/5 |
| PLANT f2 | RED 5/5 (ciRed; off 150) | RED 5/5 (ciRed; off 150–160). Pass 7 read GREEN 6/6 here |
| control `74a2b5d9` | RED 4/4 (F1 ct 22–33, 26–188 px; GA2 0.000–0.467) | RED 4/4 (F1 ct 68–89; GA2 0.077–0.558) |

**THE KEY DEFECT, found and cured in the ONE copy (PROPOSED, gap 10).**
- **The defect.** The homes key frame 1 as "the last frame whose rAF time ≤ the IntersectionObserver entry". Chromium back-dates a late frame's rAF time to the vsync it missed. After a long first frame (the reparent's layout), the next frame's rAF time precedes the entry, and frame 2 is read as frame 1.
- **The first run of this pass** (battery 1, the homes key) read chromium tree RED 4/4 on F1 at ct 13–22.
- **The cure.** Take the frame whose rAF time EQUALS the entry (WebKit), or else the last frame whose callback `performance.now()` ≤ the entry (Chromium).
- **The plant, in the ONE self-test.** A HEAVY mover starts at rest in a 30 ms frame. Chromium: new key GREEN 2/2, rAF-time key RED 2/2 (ct 28–29, 167–174 px). WebKit: both keys GREEN 2/2.
- **The rest of the self-test** is unchanged, both engines, exit 0: RAF-mover clean GREEN 2/2, skip RED, f2 RED, TASK-mover born-RED held 2/2, and the recorder rows.

### 2.5 Row 4: the census's six shapes through the ONE library

`node scripts/shape-census.mjs --self-test` passes 95/95 with 43/43 clauses planted, and `--sabotage-battery` reds 43/43. VERB's rows each read "ok" in the self-test:
- `is-where-arms` (X16/X16b)
- `stem-all` (X15/X15b)
- `setprop-computed` (X17)
- `const-carried` (X18)

This tree carries no census fork. `check-motion-bands.mjs` and `check-theme-tokens.mjs` import `./shape-census.mjs`. No import from `docs/` exists in `e2e/`, `scripts/` or `src/` (grep, exit 0 on an empty match).

### 2.6 Row 5: the clean dist (§2.17)

- **The pass-7 bank identity**, re-cut from a `git archive e7cc2ae8` OUTSIDE any worktree with a private cacheDir: `index-BHJMbOny6cIs.js` / `index-DyUCrBvpPVyw.css`, **49** `@property`. That is re-stamped.
- **This tree**: `index-paO7tVLM_11M.js` / `index-DHs860g5jK_C.css`, **49** served `@property` (check-property-block served, exit 0). `diff -r` against the clean out-of-tree archive build of the same write-tree gives **0**, at 31586472 and at 8c12b15c.
- **The arm dists**, re-cut out of tree from 8c12b15c: SHEET `index-BoNiZwre736v.js` (49), and hinge = the tree.
- **The union** 77345798: `index-BXCX8cciUN4Q.js` (50). The union base caa4898a: `index-Bqn6P2cEWqaQ.js` (50).
- No scratch spec exists under the project root.

### 2.7 Row 6: T9-B23's pair at the default's LOSING instant

Frame `t9-b23-ink-at-flip-t122-hinge-left-sheet-right-chromium-light2dark-390x844-coarse-dpr2-retires-p7-t9-b23-t100.png`: **12,007 B**, sha1 `a8f4616aeb82`, 600×292.

- **What the frame is.** Chromium, light→dark, 390×844 coarse (hasTouch), DPR 2. Payload: the 71-given 9×9 of `frame-halfstroke.spec.ts` (`board.txt`), with the user digit 5 typed in r1c1. Every animation is frozen at **+122 ms** of the flip (35 animations in hinge, 33 in sheet), and 71 givens were read back in each arm.
- **Left, (c) HINGE, the default:** paper rgb(112,111,110) mid-dusk, and the user 5 at **1.97:1** (p98 of the r1c1 cell).
- **Right, (d) SHEET** (`VITE_INK_AT_FLIP=sheet`): paper rgb(19,18,17), user 5 at **7.36:1**.
- **Variables the pair carries.** The one variable is `VITE_INK_AT_FLIP`. Both arms carry the un-clipped frame and the gold/violet trace alike.
- **The contrast figures** are a caption statistic of the crop from the scratch `ink122.mjs`, not a gate (row 7's gate is unbuilt).
- **Retires** `pass7/prototype/MOT-VERB/t9-b23-ink-at-flip-t100-…png` (11,717 B). **Headroom spent: +290 B net** (12,007 − 11,717), once the chair sweeps the retiree.
- **The wave now:** 102 PNGs, 2,010,840 B, 86,312 B under the 2 MiB cap. `check-evidence-policy` exit 0.

### 2.8 Row 15: `lint:knip`

The inherited red (`cubicBezier` exported and unused, `pencilConfig.ts:489`; control 0) is cured by making it module-local. It is `handStroke`'s one reader. knip now reads **0** on the tree and 0 on the control. The EXEMPT rows keep their pins, and four EXEMPT_KEYS were added:
- `hand.maxStepMs` 34
- `hand.paceWindow` 5
- `hinge.dark` 0.343
- `hinge.light` 0.249

One ADMITTED_ARITH row was added: the pace median.

## 3 · The replay route and the resumption

**The resumption.** A dead VERB attempt (2026-09-25 20:07–20:50, the scratch `verb8/`) had edited the tree after LADDER's bank `547b50d5`. I diffed the temp-index write-tree against it at open: `31586472`, 15 files +920/−219. I read every hunk.
- **KEPT and re-measured here:**
  - `bootHand.ts` + its test (the rate)
  - `pencilConfig.ts` (`hand.maxStepMs`, `paceWindow`, `MOTION.hinge`, `cubicBezier` local)
  - `gridPaths.ts` + `gridPaths.frame.test.ts` (the frame)
  - `GameBoard.vue` (a comment)
  - `check-motion-bands.mjs` (G-HINGE + plants, EXEMPT rows, ADMITTED_ARITH, `BANK_SHA256`)
  - `motion-bank.json`
  - `check-pw-projects.mjs` (manifest +2)
  - `fold-verb.spec.ts` (re-pointed to `readMover`, CI gated both engines, PLANT f2)
  - `boot-hand.spec.ts`, `frame-halfstroke.spec.ts`
  - `e2e/lib/{paint-lib,postpaint}.d.mts` (type declarations for the TS specs, not readers)
- **FINISHED:**
  - boot-hand clause S and the hold0 / stacks0 plants.
  - The postpaint key.
  - The census stamp re-labelled. The dead attempt stamped it "unlabelled restamp"; it is re-run with the wave named, 0 floors moved.
  - The dead frame and the dead PROPOSED diff were moved to `<scratchpad>/trash-verb8-1/`, and both were re-made on final bytes.
- **REVERTED:** none.
- The dead attempt's own logs are not cited anywhere above.

**Replay.**
1. Run `instruments/build.sh <name>`: the tree plus the clean out-of-tree build, then `diff -r`.
2. Run `instruments/plants.sh`.
3. Run `instruments/battery1.sh`: frame, fold and boot, tree | control, then the plants. It uses `pw.sh` with a scratch PW config OUTSIDE the tree that imports the tree's `playwright.config.ts`, has no webServer, and uses `--project=<engine>`.
4. Land `postpaint.kpaint.PROPOSED.diff` and run `node e2e/lib/postpaint.mjs --self-test --engine chromium|webkit`.
5. Run `instruments/battery2.sh`: GA1 ×5 on the tree, then the control.
6. Run `instruments/union.sh`, then the merge (`resolve.py`) and `archbuild.sh` for union, unionbase, hinge and sheet.
7. Run `instruments/battery3.sh`: the union frame, the union base, and the T9-B23 shots and compose.
8. Run `instruments/prereturn.sh <fe> <url> <label> <dist>` for the tree and for `git archive 74a2b5d9`.

Every figure above ran on write-tree `8c12b15c` or on a dist byte-identical to it. The exceptions are battery 1's frame, boot and plant rows, which ran before the postpaint and fold-verb edits; those edits touch no file those rows read, apart from `postpaint.mjs`'s `installTimeline`, which is unchanged. `e2e-rows.txt` and `battery.txt` in `logs/` are the transcripts.

## 4 · The on-union delta (row 8's second half)

The union is built through a temp index: `74a2b5d9` + `pass7/integrate/s13-s7-s3.diff` + `pass8/instruments/homes.on-s13-s7-s3.diff` + LADDER's `pass8.delta.on-s13-s7-s3.diff`, giving `caa4898a` (LADDER's own record). The raw delta rejects 3 files, and `git merge-file` produces 4 conflict hunks:
- **`check-pw-projects.mjs`**, 2 hunks: the manifest is the union of both sides, alphabetical (boot-hand, count-yield; frame-halfstroke, front-rate).
- **`pencilConfig.ts`**, 1 hunk: the union's comment is taken whole; it already un-exports `cubicBezier`.
- **`gridPaths.ts`**, 1 hunk: VERB's frame comment in the union's palette word ("gold trace").

Line counts: 1530+2 = 1532; 980+16 = 996; 819 − 11 + 17 = 825 (both sides rewrote the same 5 lines).

On the union extraction:
- `apply --check` 0.
- vitest (frame + bootHand) 16/16.
- `vue-tsc -b` 0.
- The frame paint row passes 12/12 per engine (§2.1).
- `check-pw-projects` reds FLOOR BAND 3 (union base 4; gap 9).

## 5 · Pre-return battery (bare; tree `8c12b15c` | control `git archive 74a2b5d9`)

| gate | tree | control |
|---|---|---|
| lint:lanes · lint:theme-tokens · lint:sleep · lint:motion · lint:copy · lint:ink | 0 · 0 · 0 · 0 · 0 · 0 | 0 · 0 · 0 · 0 · 0 · 0 |
| lint:bands | 0 | 1 (inherited: the script does not exist at 74a2b5d9) |
| lint:verbs | 0 | 1 (same) |
| test:e2e:projects · check-pw-projects | 0 · 0 | 0 · 0 |
| check-property-block source · served | 0 · 0 (49 served) | 0 · 0 |
| shape-census --self-test | 0 (95/95) | 1 (the library is absent at 74a2b5d9) |
| npm run lint (prettier) · eslint . --max-warnings 0 · lint:knip | 0 · 0 · 0 | 0 · 0 · 0 |
| vue-tsc -b (archive) · typecheck:e2e (archive) | 0 · 0 | — |
| vitest, chunked | pencil 11 files / 96, games/shared 34 / 429, games 57 / 741 (incl. shared), composables 3 / 16: 0 failed. src/lib has no test files (exit 1 = "No test files found") | — |
| the whole spec files: frame-halfstroke · boot-hand · fold-verb | 12/12 · 1/1 · 30/30 cr, 25/30 wk (gap 1), per engine | 2/12 · 0/1 · 2/6 per engine (born-RED) |
| postpaint self-test (ONE copy + PROPOSED) | 0 cr · 0 wk | — |

M16: no user-visible string was added (the product diff is geometry, clock and config). The filterBudget is untouched.

## 6 · Charter rows and INTAKE-23 §4 by number

**Charter:**
1. GA1 WebKit gated, f2 in-run: **GATE LANDED.** chromium 20/20. WebKit 15/20 (gap 1). Plants 5/5 both engines.
2. The rate: **CLOSED** on the ruled sum (§2.2). Per-tier caps OPEN (gap 8).
3. Shipped gates on the hinge, the wave, the stacks and hold: **CLOSED** (§2.2, §2.3).
4. The six shapes: **CLOSED** on the ONE library.
5. Clean dist: **CLOSED** (§2.6).
6. T9-B23 at +122: **FRAMED** (§2.7).
7. The §2.11 gate: **OPEN** (gap 3).
8. The frame: **LANDED** (§2.1, §4).
9. The owner's rows: **OPEN**, per row below.
10. **OPEN** (gap 4).
11. **NOT met** (gap 5).
12. **NOT run** (gap 6).
13. **NOT built** (gap 7).
14. **NOT served**: the union was built and read for the frame only.
15. knip: **CLOSED**.

**INTAKE-23 §4 (VERB):**
- **1. The hand:** the rate form CLOSED (§2.2), both engines, 3 displays, with plants. PAINTED-recorder n ≥ 5 not re-run.
- **2. The layer, both arms: UNBUILT.** It dies on the number the intake names: the ghost-crossing stubs in k1 and the band p95 of 25–29 (cap 4/255), which were never re-read.
- **3. The point: UNBUILT.** `path.grid-tip` is not on this tree.
- **4. The rubbing: UNBUILT.** G-D9's re-cut feather is still 0.34 em.
- **5. PARTLY:**
  - The ruling waits on both pose-0s (S: 0 bakes under the hand, ceiling 0, n = 3 per engine).
  - The stack-open move, the late-deal regime and G-D12 are unread.
- **6. Not re-read** this pass.
- **7. The recorder:** the chair's, self-test GREEN (§2.4).
- **8. The wave hold: CLOSED**, both engines, 3 displays, 2 plants (§2.2).
- **9. The hinge: G-HINGE shipped.** The §2.11 painted gate is UNBUILT (gap 3).
- **10. The Bloom K/R (T9-B24): UNBUILT.** No `VITE_STORYBOOK_ARM` on this tree.
- **11. The boil: UNBUILT.** Chromium hand-off 1.00/1.44 unread.
- **12. The settle: UNBUILT.** R 32/34 unread.
- **13. The fence and the PRM cut: UNBUILT.**
- **14. P7-π on the merged tree: NOT RUN.**
- **15. M21-a/b: UNBUILT.** RED in both arms per the intake.
- **16. The theme-color OPTION:** unchanged from pass 7 (settled read only). Not framed mid-flip.
- **T9-B26 (the digits' hand): UNBUILT.**

## 7 · Incidents (self-declared)

1. **Resumed lane.** A dead attempt's 15 files and two of its listeners were found at open:
   - :4247, node PID 28723 under wrapper 28519, cwd this tree, serving the dead attempt's scratch dist `index-CKiRKxV-ImYI.js`.
   - :4250, node PID 36337 under wrapper 36272 (= its recorded `ctl.pid`), serving the control `index-CubiZsMVSwTc.js`.

   The :4247 pair was killed by PID after the ancestry and dist check. The control was adopted and killed at return by PID (36337 and 36272), together with this lane's own listener, PID 76068.
2. **The first e2e battery was VOID.** `pw.sh` passed `--project chromium <spec>`, and Playwright's variadic `--project` ate the spec path (every row exit 1, "Project(s) … not found"). Its logs were moved to `logs/void-1/` in scratch, and the battery was re-run whole with `--project=<engine>`.
3. **One build ran under a shell `&`** instead of `run_in_background` (`build.sh p8a`, about 10 s). Its exit lines were read.
4. **GA1 chromium RED 4/4 in the first valid battery** was an instrument defect (the homes' rAF-time key), not the product. It is diagnosed and cured in the ONE copy as a PROPOSED diff with its plant (§2.4), and re-read ×5.
5. **`census.stamp.json`** was restamped by the dead attempt as "unlabelled restamp". I re-ran it with the wave named. The file's own note says a restamp is a WGATE act; the FLOOR BAND clause red without it (new specs grew both projects past 85 %).
6. **The union restamp** failed in the scratch extraction (not a git repository), so the union carries this tree's stamp (gap 9).
7. **No `rm`** was used anywhere. Discards went to `<scratchpad>/trash-verb8-1/`. No git was run in the control tree. No commit.

## 8 · Instruments by import path (relative, product)

- `e2e/frame-halfstroke.spec.ts` → `./lib/paint-lib.mjs`
- `e2e/boot-hand.spec.ts` → `./lib/postpaint.mjs` (`installTimeline`)
- `e2e/fold-verb.spec.ts` → `./lib/postpaint.mjs` (`readMover`, `SKIP_PLANT`, `F2_PLANT`, `fmtArm`)
- `scripts/check-motion-bands.mjs` and `scripts/check-theme-tokens.mjs` → `./shape-census.mjs`

Scratch-only (never imported by the product): `frame-b23-8.mjs` (photograph + compose; sharp via createRequire) and `ink122.mjs` (the caption statistic). The pass-6 `check-property-block.mjs` was run from scratch, byte-identical to its docs copy.
