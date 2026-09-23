# CTRL-FACE · pass 5 prototype

Work tree `.claude/worktrees/wf_f72f3b5a-83a-33`, base `74a2b5d9`, pass-4 diff advanced in place and left uncommitted. The final proto dist is `index-CNVNTjZawUmM.js`. The control is `74a2b5d9`, served from w7-control's dist (`index-CubiZsMVSwTc.js`) and never rebuilt. The second control for the mark rows is main HEAD `1e6cfbbf` (`index-ChSrVSqM0j8q.js`), built from a scratch archive. Readings are both engines unless a row says otherwise.

## Gaps first

1. **viewport-law §2.5 @1440×900 is RED on both engines. The control is green.** At scroll end, the pinned `new game` tape covers the Easy/Medium/Hard chips (665 / 424 / 27 px²). Mechanism, from `readings/tape-daylight.log`:
   - The printed tape is 30.2px tall, against the control's 23.3px.
   - Pinned at the case edge, its bottom sits 12.07px below the 20px paper band. The paper band is the only band the census forgives.
   - M17's shorter head zone cut the scroll range from 504 to 163. At scroll end the new-game well is still in view, so its tape stays pinned. On the control, the well bottom pushes the tape out.
   - The class is inherited. At scrollTop 285 on the control, a pose the row never samples, the pinned tape is 5.44px out of band and 1.78px over Medium.
   - Not cured here, because every cure moves another lane's number. Put to a ballot (B-1 below).
2. **M16 ARM A (lid) not built.** The adjudication refused it (`#card-foot` is TAPE's). ARM B, the strip, is the one on this tree.
3. **G6: the die is RED against 0.5.** Die Δ is 1.0 on chromium and 1.5 on webkit. The chip ink Δ is 0. The rate on a quiet box was not read.
4. **G2's ink floor was not re-run** after the hand face.
5. **G3b:** pencils still sit under the bar at 1280 coarse on every arm, including the control and main HEAD.
6. **The coarse rail wraps 2+1**, and 16×16 is an orphan. Coarse scrollW is 282/218 on every arm, a HEAD defect.
7. **The verb hit box shrinks from 71.19 to 60 at fine (M01).**
8. **The `line` prop has no consumer under ARM A.**
9. **The keys underline uses `#1a1a1a`/`#ffffff` literals.** These are the same literals OptionSelector already ships.
10. **G11's full π census was not run.**
11. **The dark filter census was not run.** It belongs to ACC-SIX; this lane added 0 filter lines.
12. **TABS' yield was not taken.**
13. **The /8 protocol has no channel.**
14. **CHECK 6's MDN constants were not re-derived.**
15. **ROW 2 is carried RED.** Pencils read −0.02/−0.04.
16. **`test:e2e:projects` check 8 is RED on this tree and not restamped.** The live counts are 277/275 against the stamped 238/236, so floors 214/212 are out of the 85% band. The chair's §1.4 rule says a lane never restamps; `scripts/census.stamp.json` is at `74a2b5d9`.
17. **Frames c1–c4 were shot on the pre-seam dist `index-BOrSgAqw1-Y5.js`.** The seam moves only the checking/players wells, and none of the four crops is about those wells.

## Numbers

### M16 · the `i` crib (`e2e/keys-crib.spec.ts`)

The spec runs 1280×800 and 1024×768, from the top and from the end, on both engines. Full motion (PRM live).

| row | proto | control 74a2b5d9 = main HEAD 1e6cfbbf |
|---|---|---|
| G1 hit-test, kbd/dd topmost at own centre | 19/19; crib ends 8px above the verbs | 0/19; dl −84 to −87 |
| G2 panel scroll · scrollIntoView calls | 0 · 0 | +534 (1280) / +563 (1024) · 1 |
| G3 verb drift, open / close | ≤0.44px | — |
| G5 controls parked under the open strip | 0/16 (spb 223/220) | — |
| G5 negative control (publisher pinned closed) | 4–5/16 | — |
| file | **8/8 green** | **8/8 RED** |

### M17 · the panel (`instruments/gpanel.mjs`, one encoded board, givens read back and equal)

- **G1:** zone 303.28 / 304.23, against 503.19 / 504.16 on the control and main HEAD. The plant (+200) reads 489.69, RED.
- **G2:** marks and captions each fit on one line at every fine rung, futoshiki 1024 included (the control reads 4+3). Under the hand face the marks fit one line, so the line ballot is moot. The plant (column) reads 3+3, RED.
- **G3:** verb bottom 466.14 / 466.8 against the fade at 595.64 / 595.34. The control's verb bottom is 633.27, under the fade.
- **G4:** tape→h2 is 14.72, against 2.19. The plant (step 0) reads 1.13, RED.
- **G5:** Δbaseline 0, clearX 7.19, no overlap at rest or armed. The control reads 33.57 / −81.15.
- **G8:** card width and boardX Δ0 at every cell. The no-contain plant does nothing at fine. At coarse it takes the card from 224 to 289.48 and the board from 180 to 147.25 (RED).
- **G9 coarse:** ctrlMin is 47.05×44. The rail stages 2+1 lines and the pair stays unwrapped.
- **ARM B** (`index-UesNjrjEFMhu.js`, the same CSS modulo the scope hash): fine scrollH is 973, against ARM A's 793 (802.6 after the seam) and HEAD's 1142. The live wells stack into 3-line columns.

### The seam cure (new this pass: `GameControlPanel.vue`, `.tray-well + .tray-well`)

| | proto before | proto after | control |
|---|---|---|---|
| checking / players tape daylight, rail (1024–1440) | −1.61 / −1.55 | +3.19 / +3.25 | +4.63 … +5.97 |
| the same, dock (320/390) | −5.61 / −5.55 | +3.19 / +3.25 | +4.00 / +4.22 |
| seam | 16 (rail) · 8 (dock, collapsed) | 20.8 · 16.8 | 16 · 8 |

The tape stands 20.8px above its well. On the control it stands 14.55px above.

### Card and sheet deltas (`readings/card-deltas.log`, after the seam cure)

| cell | wrapClientH proto/control | Δ before the cure → after |
|---|---|---|
| 320×568 coarse | 685/675 | −8 → **+10** |
| 390×844 coarse | 646/675 | −47 → −29 |
| 768×1024 coarse | 646/657 | −29 → −11 |
| 1280×800 fine | 726/1066 | −349 → −340 |
| 1280×800 coarse | 993/1227 | −244 → −234 |

WebKit is within 1px of these. The dock deal row is 84.98 against 117.77. At 430×932 the sheet top and drawer tab sit +22.86 lower on chromium and +22.66 on webkit. At 390 the sheet is identical.

### Seal, visual-regression test 10 (reported, not stamped)

- **Proto shipped:** 992.94 / 992.81, below SEAL 1261.
- **Captions on the hand rung:** Δ 31.25 / 31.22.
- **The unpaid control as landed reads 1060.13 / 1060.** That is under the seal, so the row can no longer red. It is MOVED.
- **The EXTENDED unpaid control reads 1354.84 / 1354.89.**
- **The control ships 1227.09 / 1227.06.**

### Occlusion, 1280 fine and 390 coarse, face-law's ceiling gate

- **Proto 390:** 0 hits. The control reads `players` 100% under `::before`.
- **Proto 1280:** 13 inherited pairs, all under their ceilings, 0 novel.
- **The seam re-read three ceilings once.** The players chips sit 4.8px deeper under the foot fade, so `::after` on Off/Ask/Live went from 67.25/68.64 to 85.01/86.35. The ceilings are now 88.35.
- **Ceiling ablation:** growing the fade by 200px leaves 6–7 pairs over their ceilings.

### Rings, registration, AA

- **Every ring site is a dashed 2px `rgb(58,123,196)`** with transition 0s, both engines, at 390 coarse and 1280 fine.
- **PRM break-test:** removing the cure gives transition 0.15s and a mid-tween colour, which is RED.
- **REGISTRATION TOOK and PUBLISHER RAN** at 1280 fine and 390 coarse. The unregistered `--action-bar-h` control reds.
- **AA, light core medians:**
  - unselected chip 4.66, keys sublabel 4.66;
  - selected level 4.90, level h2 4.90;
  - dealt 5.24.
- **AA, dark:** 7.68–10.23.
- **WebKit light, unselected chip:** 12% of ink columns fall under 4.5 at the 90% cut.

### Gates

- **face-engine:** the stale-stamp break (6ch) reds with exit 1 and is restored by sha1. The CHECK 7 plant (`"Comic Sans MS"`) reds with exit 1 and is restored.
- **Filter census:** 12/12 on the proto and the control (light).
- **Goldens:** 4/4 on both.
- **`-1lh` guard:** green.
- **Vitest:** 68 files, 831 tests, run in directory chunks (games 57/742, pencil 8/73, composables 3/16).
- **vue-tsc -b:** 0.

### e2e estate, whole files, bare (`readings/e2e-estate.log`)

| spec | proto chromium | proto webkit | control chromium | control webkit |
|---|---|---|---|---|
| face-law | 34/34 | 34/34 | 11/34 | 11/34 |
| keys-crib | 4/4 | 4/4 | 0/4 | 0/4 |
| zone-grammar | 11/11 | 11/11 | 10/11 (coarse checking-well tap timed out) | 10/11 |
| access | 8/8 | 8/8 | 8/8 | 8/8 |
| font-census | 2/2 | 2/2 | 0/2 (unledgered mixed-face strings) | 0/2 |
| share-truth | 5/5 | 4/4 + 1 skip | 5/5 | 4/4 + 1 skip |
| a11y | 15/15 | 15/15 | 15/15 | 15/15 |
| viewport-law | 13/14 (§2.5, gap 1) | 13/14 | 14/14 | 14/14 |
| visual-regression | 10/12 (8b, test-10 negative control: MOVED) | 10/12 | 11/12 (test 10's printed-rung assert) | 11/12 |

The proposed VR diff (`instruments/PROPOSED-visual-regression.diff`) passes 6/6 on the final dist. On the control it reds 8b and test 10.

### Pre-return battery, bare (`readings/battery.log`): tree | control

All of the following exit 0 on both trees:
- lint:copy, lint:lanes, lint:theme-tokens, lint:theme-selectors, lint:sleep, lint:motion, lint:ink, lint:catch, lint:live-regions;
- test:e2e:retries, test:support-floor, test:font-coverage;
- lint:boundary, eslint ., prettier --check;
- vue-tsc e2e.

The exceptions:
- **test:e2e:projects:** 1 on the tree, 0 on the control. Check 8, not restamped (gap 16).
- **lint:face-engine:** 0 on the tree, 1 on the control. The script is new on this tree.
- **vue-tsc -b:** 0 on the tree. Not run on the control, because it writes tsbuildinfo.

## Ballots (proposed; the chair assigns numbers)

- **B-1 · the paper band vs the printed tape.**
  - Frame A: the card's `padding-top` grows from 20px to the pinned tape's depth (≈2.05rem). That is about +12.9px of card at every width, and the band becomes paper by construction.
  - Frame B: a pinned tape drops to a shorter tag rung while pinned. The band is untouched and the tape changes size at the pin.
  - Default if no vote: A. The §2.5 row's own ruling already calls the band "paper by construction".

## MOVED rows (PROPOSED, never applied)

- **visual-regression 8b ("the deal receipt keeps off the commit verb")** reads −40.39 / −40.56. M17 put the receipt beside the die by design. The proposed diff re-cuts the row to the deal row's grid.
- **visual-regression test 10's negative control** can no longer break the seal (1060 < 1261). The proposed diff extends the unpaid layout to the options-line and the deal row, which reads 1354.84.
- **MRK-ABS G-ABS-3:** the `.info-btn` ring row loses its subject, because the `i` is the fifth verb now.
- **r0's R3 probe:** its 1200-char window now ends inside the Fill verb. The bar template grew from 3124 to 4043 stripped chars.

## Replay route

- **Replay method:** the intake prototypes (`intake-owner-2026-09-22/prototype/G-PANEL/prototype.diff`, 279 lines, 3 files; `G-INFO/prototype.diff`, 390 lines, 5 files) were replayed onto this tree with `git merge-file`, file by file, against a `git archive` base. `git apply --3way` refused with "does not match index".
- **Line-count checks, per file, as recorded when the patches were replayed:**
  - G-PANEL: 18 / 23 / 43;
  - G-INFO: 0 / 3 / 21 / 71 / 0.
- **Intake edits after the replay:** the `?keys=ring` query flag became a const (`KEYS_ARM`). The press cure was widened to all five verbs. Two comments were corrected: tape→name is 14.72, and the wrap is left-flush under the die.
- **Pass-4 work:** already in place in this tree, not replayed.

## Incidents

- **Port 4237 was held by MOT-LADDER's control,** so main HEAD was served on 4240.
- **One backup went to `/tmp`** instead of the scratchpad.
- **The first keys-crib run read "scrollTop 0→185".** `locator.click` scrolls a sticky target. The press is now a mouse click at the button's centre.
- **The first gpanel givens read was empty,** because it read the grid's textContent. It now reads the input values, and all 30 records carry one givens string, the payload.
- **The e2e battery's first pass ran against the dev server (:4234), not the dist.** Everything in the tables above was re-run on the dist.
- **Servers were killed by PID:** 67015, 59339, 67012, 70164 and 77582. The in-tree scratch (`.face5/`, `.vite-cache-face5/`) is deleted.

## Frames (≤150 KB each)

| frame | engine · theme · viewport · pointer | retires (pass4/SWEEP.md) |
|---|---|---|
| `frames/c1-m17-head-armA-armB-chromium-light-1280x800-fine.png` | chromium · light · 1280×800 · fine | `f1-p4-320-light-coarse-chromium-PROTO-caption-is-its-word.png` |
| `frames/c2-m17-dock-deal-row-head-proto-webkit-light-390x844-coarse.png` | webkit · light · 390×844 · coarse | `f2-p4-320-light-coarse-chromium-HEAD-caption-column-60px.png` |
| `frames/c3-m16-crib-open-from-top-head-proto-chromium-light-1280x800-fine.png` | chromium · light · 1280×800 · fine | `f3-p4-390x844-light-coarse-chromium-checking-over-what-fits.png` |
| `frames/c4-caption-column-proto-head-chromium-light-320x568-coarse.png` | chromium · light · 320×568 · coarse | `f4-p4-390x844-light-coarse-webkit-checking-over-what-fits.png` |
