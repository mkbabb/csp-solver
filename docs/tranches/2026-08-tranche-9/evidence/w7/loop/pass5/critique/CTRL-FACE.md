# CTRL-FACE · pass 5 adversarial critique

**Verdict: ADVANCE at 85** (pass 4: 84). The M16 cure is the strongest thing on this tree. I re-ran it over 24 cells the lane never ran, keyboard included, and it held in both engines. M17's head numbers reproduce to the hundredth. Most of the pass-4 critic's struck gates were re-cut with real negative controls.

The number moves only one point, for five reasons:
- The tree reds a W2 row the control passes (viewport-law §2.5 at 1440×900).
- The family's own case-wide occlusion gate cannot see that red. Four of its sixteen ceilings sit at 100 %, so they cannot fire.
- The stamped engine gate still passes on a stale dist.
- M16's settle-only publisher row wasn't addressed. The bar writes `--action-bar-h` 24 times per open where the row asks for 1.
- M17 ships with no standing gate: its G1–G8 live only in an evidence instrument.

**Bases.**
- Prototype dist: `index-CNVNTjZawUmM.js`. I rebuilt it in scratch with a private cacheDir, and every file is sha-identical to the tree's `dist/`.
- π control: `74a2b5d9`, served from `w7-control`'s dist `index-CubiZsMVSwTc.js`.
- Both were served on 127.0.0.1: the prototype on `:4246`, the control on `:4247`. Each was verified by its asset hash.
- Every π row uses the sudoku payload `?size=3&difficulty=MEDIUM&board=ATMuNTMw…MDc5`. Both arms read back the same givens (`530070000600195000098000060800…`).

**Housekeeping.**
- Servers killed by recorded PID: 42362, 42364 and the npx parents 42308, 42309. 4246 and 4247 read empty.
- The scratch Playwright dir `web/frontend/.facecrit/` is deleted. The worktree's `git status` is the lane's 24 product entries, unchanged.
- My face-law runs rewrote the ignored `.face-engine/*.json`. The gate reads them PASS: `readings/battery.log`.
- Instruments and readings: `critique/CTRL-FACE/`.

---

## 1 · What I re-ran (both engines unless stated)

| row | prototype (chromium / webkit) | control `74a2b5d9` | verdict |
|---|---|---|---|
| `keys-crib.spec.ts` as landed, bare | **8/8** | **8/8 RED** (G1 expected 19, received 0) | reproduced |
| keys-crib EXTENDED (my copy): 1440×900 · 1280×720 · 1280×800 × top/end × **click and Enter** | **24/24**: G1 19/19, dl 8 px above the verbs; G2 Δ0 at scrollTop 0/163/194/274, 0 `scrollIntoView`; G3 drift **0 px** over 67–85 frames, open AND close; G5 parked 0/16. Blinded publisher: 5/16 (1440, 1280×800), 8/16 (1280×720) | — | **the INTAKE row-1 cells the lane skipped all hold** |
| M17 G1 `.new-game-zone` at 1280×800 fine | **303.28 / 303.23** | 503.19 / 503.16 | reproduced |
| M17 G3 Deal bottom vs the fade (bar − 32, scrollTop 0) | **466.14 / 465.80** vs 595.64 / 595.34 | 633.27 / 632.94 (RED) | reproduced |
| fine card scrollHeight | **802** | 1142 | reproduced (README's 802.6) |
| coarse rail 1280×800 hasTouch: Deal bottom vs fade top | **574.11 vs 595.64 · 573.77 vs 578.34** (webkit clears by 4.57 only) | 662.86 / 662.53 (RED) | INTAKE row 11's second half closes; staged groups 2+1 lines vs 3+3 |
| scrollW / clientW at the coarse rail | 282 / 218 | 282 / 218 | HEAD defect, inherited, declared |
| **the crib's publisher: `--action-bar-h` `setProperty` calls per open** | **24 / 20** | 0 / 0 | **RED against INTAKE row 2 (= 1). Not in the lane's return.** |
| whole files: face-law · zone-grammar · viewport-law · visual-regression | 34/34 · 11/11 · **13/14** · **10/12**, both engines | (lane: 11/34 · 10/11 · 14/14 · 11/12) | reproduced; the three reds are the ones declared |
| viewport-law §2.5 @1440 | `new game` over Medium 665.0 / 666.1 px², Easy 424.4 / 425.1 | green | RED, declared (gap 1) |
| VR 8b · VR test 10's negative control | −40.39 / −40.56 · 1060.13 / 1060 (< 1261) | — | MOVED, declared |
| filter-census, built dist | **12/12** | 12/12 | holds (light; 0 filter lines in the src diff) |
| face-law rendered negative control | `.ctrl-word` literal → 14 / 11 / 6 off-law on card-fine / card-coarse / gallery, re-point the same; `.staging-axis-label` 2 on the gallery | — | **pass-4 gap 2 CLOSED**: asserted on every route |
| occlusion ceiling ablation (fade +200 px) | 7 / 7 (1280), 6 / 6 (390) over the ceiling | — | bites, but see §2.3 |
| `check-face-engine-identity`, bare, fresh census | PASS; 14 chips; 32.667 / 32 @dpr3 | script absent (1) | holds on a dev-consistent census; see §2.2 |
| @property census (index.css, comments stripped) | 18 registrations, **0 nested**, no other file; ONE `@property --zone-step` in the built CSS | — | clause shape holds |

An end-pose sweep (my probe) checks the §2.5 "inherited" claim. At 1440×900 I stepped scrollTop by 5 px and read the pinned `new game` tape's raw rect ∩ every staged chip, clipped to the card:
- Prototype: 16 of 33 poses hit (st 55–160), worst 1529.05 px² over `9×9`.
- Control: 61 of 101 poses hit (st 50–390), worst 1573.34 px² over `4×4`.

This is raw rect, not §2.5's band-subtracted predicate. It corroborates the lane: the CLASS is the control's too, and W2's row only samples the poses where the control happens to be clear.

---

## 2 · The measured findings

### 2.1 The tree reds a W2 row the control passes, and the family's own case-wide gate can't see it

viewport-law §2.5 at 1440×900 is RED on both engines at the scroll end. The control is green. The lane declared it with a sound mechanism (M17 cut the scroll range 504 → 163, so the pinned tape never unpins), and my sweep shows the class is inherited.

What is NOT declared: **the family's own "case-wide occlusion gate" stays green on this tree.** It samples 1280 fine and 390 coarse at REST only, so a tape parked over three chips at the scroll end of a third cell is outside what "case-wide" covers. The gate the leader owns for the section missed the section's one live red, and W2's row found it. The cure isn't in this tree. The proposed ballot B-1:
- **Has no frames.** Neither arm is built.
- **Its default moves another lane's sealed quantity.** Arm A grows the card's `padding-top` ≈ +12.9 px, which is the pin band TAPE owns (registry §2.3).

That is the elegant-reduction trap: the hard part is deferred to the owner as a question nobody has framed.

### 2.2 The stamp binds the census to SRC, not to what the spec MEASURED

The pass-4 hole is closed for the dev server, and the in-process plant bites. The spec's `ENGINE_STAMP` is sha1 over the `STAMP_FILES` read from `src/` when the spec loads, whatever `baseURL` it measures. This lane measures a DIST (`:4236`, and mine on `:4246`). On a scratch copy (`instruments/face-engine-stale-dist.sh`, `readings/face-engine-stale-dist.log`):

1. The tree's census, bare: **PASS**, exit 0.
2. Plant `calc(100% + 0.5rem)` → `6ch` in `GameControlPanel.vue`: **RED**, exit 1 (the stamp differs). Good.
3. Emulate re-running face-law against the UNREBUILT dist. The spec writes the planted src's digest over the old dist's numbers. **PASS**, exit 0, on a tree whose next build paints the 6ch mark.

To close it, stamp the ARTIFACT the page served: the `index-*.js`/`.css` names read in-page, checked against a fresh build of the stamped src. Or refuse a dist baseURL. Also, the six `STAMP_FILES` omit `KeyboardLegend.vue`, whose max-content sizes the rail the chips sit in.

### 2.3 The occlusion CEILINGS: four cannot fire, and twelve are the tree's own readings

Each of the sixteen keys carries a number, as pass 4 asked. But:
- **Four ceilings are 100** (`action-bar | checking`, `::after | players`, `::after | marks`, `::before | players`). `h.frac > 100` is impossible, so those four pairs are the same name-keyed amnesty the pass-4 critic struck ("`players` 63 → 100 % stays green").
- **Twelve of sixteen keys name pairs the control does not have.** The spec's own control column reads "—". Charter row 5 asked for "the control's measured fraction + slack". These are THIS tree's readings + 2, which is spec-cites-itself.
- **Three ceilings were raised after the seam cure made the covering WORSE** (67.25 / 68.64 → 85.01 / 86.35; ceiling 88.35). The comment says so. It is still a gate re-read upward to pass a change the lane made.

The +200 px fade ablation bites (6–7 pairs), so the gate isn't vacuous. It's vacuous on four keys and self-referenced on twelve.

### 2.4 CHECK 7 (the source half of the face law) misses the shorthand

Plants on a scratch copy, bare exit codes (`readings/check7-plants.log`):

| plant | exit | caught? |
|---|---|---|
| `.ctrl-word { font-family: "Comic Sans MS", cursive }`, the critic's line | **1** | caught |
| `.ctrl-word { font: 400 1rem "Comic Sans MS", cursive }` | **0** | missed |
| `class="font-[Comic_Sans_MS] ctrl-word"` (Tailwind arbitrary) | **0** | missed |
| `var(--face-printed)` re-point | 0 | by design (the rendered half's job) |

The rendered half catches both misses where it reaches: the owner-of-the-text read is real, and pass-4 gap 1 is closed there. But CHECK 7's header claims "EVERY `font-family` IN src/". A `font:` shorthand sets `font-family` and walks past it. The in-process plant is the same literal the rule was written for, so it proves the regex, not the law.

### 2.5 M17 has no standing gate

`.new-game-zone ≤ 320`, one line per staged group, tape→h2 ≥ 13.6, Deal/dealt baselines, Deal above the fade: every G-PANEL gate lives in `pass5/prototype/CTRL-FACE/instruments/gpanel.mjs`, which is evidence. No e2e file in the tree reads `.new-game-zone`'s height, `.options-line`, the deal row's baseline or `--zone-step`'s rhythm. The one exception is the `@property` row, which reads `--zone-step`'s registration, not the layout. The only shipping rows on the surface are VR 8b and test 10, and both are RED (MOVED, their re-cut PROPOSED and unapplied). So the owner's M17 cure can be reverted to the column and the tree's estate reads the same as it does today. INTAKE rows 7, 8 and 13 name gates, and they aren't landed.

### 2.6 M16 is cured and priced by a publisher that runs every frame

The crib opens inside the strip and nothing scrolls, in every cell I tried. But `useResizeObserver(actionBarEl)` (`GameControlPanel.vue:640`) is unchanged. During the 200 ms `0fr → 1fr` fold it writes `--action-bar-h`, and with it `--card-pad-b` / `--card-pad-t`, **24 times per open (chromium) and 20 (webkit)**. The control writes 0. INTAKE row 2 closes at 1, published on `transitionend` + at rest. G-INFO's critic flagged the same thing as H2 (G6 leaning RED under load), and the WebKit frame budget (G-INFO G6) wasn't measured this pass. Neither the row nor the number is in the return.

### 2.7 What c1–c4 show that the text doesn't

I looked at all four crops:
- **c3 (the open crib) shows G-INFO H5 unresolved.** The pencils well's drawn outline runs its corners out beside the verbs, and the next well's outset brackets frame the strip below them. The crib opens inside a frame drawn by another surface. The return doesn't name H5. INTAKE row 1 orders the crib after TAPE/RULE's edge row for exactly this.
- **c1 panels 2/3** (ARM A / ARM B) are a real one-variable pair (LINE_SCOPE), on one payload (`crops.mjs` states it; the captions don't).
- All four crops were shot on the pre-seam dist `index-BOrSgAqw1-Y5.js`, not on the dist the numbers cite (declared).

**Not framed** (INTAKE rows 4, 11, 12, 15):
- T9-B14's ring arm, which is now a `HandDrawnOutline` whose π, AA and G8 are unmeasured;
- T9-B17 (receipt beside or under), T9-B18 (the kept marks column, built), T9-B19 (intrinsic vs grown chips) and T9-B20 (coarse rail, grown vs kept);
- the 430×932 sheet +22.86 and the Deal hit-box trade 71.19 → 60;
- B-1.

Two of the eight M17 ballot frames exist.

### 2.8 Smaller findings

- **Six §13 rungs are MINTED in this tree's §10 block** (`@property --motion-whisper … --motion-throw`). Five have 0 consumers; `--motion-whisper` has 1 consumer and 0 publishers. That is consumer-less substrate, and a second home for names the merged §13 tree (`-59`) registers seven of. Leader duty says "cited from §13, never re-minted". It's carried from pass 4 and absent from the gaps.
- **`check-font-coverage` lists `"keys"` as a DEPARTURE** ("declared, no longer rendered") while `.icon-sublabel` renders it on every desk card. The lane filed the fifth verb's words under the tapes group. So deleting the sublabel greens, and the report's sentence is false for that word.
- **`KEYS_ARM` keeps the old trailing-`i` arm in source** as `.ring-arm`: a second `<button>`, about 35 lines of CSS and a `HandDrawnOutline`. That's the legacy form under a new name, dead at the default, and never framed. INTAKE row 4's 'scaffold dies with the ballot' is still owed.
- **One control still carries two sentences**: aria-label "what the keys do", note "what each key does" (INTAKE row 5 open). label-in-name holds.
- **`--zone-step` is consumed bare at 5 sites**, not the 6 the intake names. The registration row's `initial` strike reads `0px`, which is visibly failing: correct.
- **`keysUnderline` bakes `#1a1a1a` / `#ffffff` into a data-URI keyed on `isDark`** (declared, gap 9). It's a raster literal the theme tokens can't reach.
- **The AA row is a distribution with the sensitivity cut**: unselected chip median 4.66, WebKit 12 % of columns < 4.5 at the 90 % cut. There is no 40 %-ink plant (INTAKE row 16), so it's a reading, not a gate.

---

## 3 · Constraints

| constraint | verdict |
|---|---|
| M16 plain copy | **clear.** `lint:copy` 0 / 0 bare. New strings: "keys", "what each key does" |
| filterBudget 9 | **clear, light.** filter-census 12/12 on both dists; 0 filter lines in `git diff 74a2b5d9 -- src`. The dark arm is ACC-SIX's |
| AA from painted bytes | clear at the core median; the sensitivity row is present; no plant (§2.8) |
| π on unclaimed surfaces | **partial.** The deck is π by construction (every `OptionSelector` on the deck passes `mobile`, so `.options-line` never applies). The seam and card deltas are declared. G11's full census was not run (declared). The 430 sheet +22.86 is declared but not cropped |
| decided history | the T6-mark-8 reversal is the chair's (booked). **r0 R3** MOVED, named. `.info-btn`'s ring row (MRK-ABS G-ABS-3) MOVED, named |
| W2 landed mechanics | **one landed row RED on this tree, green on the control** (§2.1), declared, uncured |
| @property law | four clauses met for `--zone-step` and the lengths; 0 nested; the INHERITED-value discriminator with an unregistered control in-run. §13 names re-minted (§2.8) |
| undefined-token census | `--zone-step`, `--icon-verb`, `--keys-underline` (inline publisher on the host, consumed by its own child) all resolve |
| ballot pair on one payload, one variable | c1 ARM A/B yes. B-1 no frames. B14–B20 mostly unframed (§2.7) |

## 4 · The pre-return battery (bare; tree | control)

| check | tree | control |
|---|---|---|
| lint:lanes, lint:theme-tokens, lint:sleep, lint:copy, lint:motion, eslint . | 0 | 0 |
| test:e2e:projects | **1** | 0 |
| check-pw-projects | **1** | 0 |
| `npm run lint` (the CI prettier form) | 0 | 0 |
| lint:face-engine | 0 | 1 (script absent) |

- **`test:e2e:projects` / `check-pw-projects`:** check 8 is RED, declared per the chair's §1.4 rule.
- **Bare `prettier --check .`:** reds both trees on `dist/` and `coverage-floor.json`. On this tree it also reds `.face-engine/*.json`: the census dir is outside `.prettierignore` and outside the CI scope, so this is harmless but untidy.

---

## 5 · Strengths (what the fold keeps)

- **M16 is cured.** The crib is the strip's first row, `toggleKeys` is the flip alone, and nothing scrolls. It held in 24 cells I added (four viewports × top/end × click/Enter) as well as the lane's 8. The drift was 0 px on every frame of open and close, and the blinded-publisher control reds 5–8 of 16 in the same run. The e2e row is honest in three ways:
  - G1 is a hit-test, not a self-referenced raster.
  - The press is a centre click, because `locator.click` scrolls a sticky target: a trap worth the ledger.
  - The `scrollIntoView` hook is live.
- **M17's geometry reproduces to the hundredth**: 303 vs 503, the verb 129 px clear of the fade, scrollH 802 vs 1142, and the coarse Deal now above its fade. It uses `contain: inline-size` to keep the rail's max-content, so the card width and board x don't move.
- **The rendered face law now reads the text's owner and asserts its negative control on every route.** That was pass-4 gaps 1 and 2 on the rendered half.
- **REGISTRATION TOOK / PUBLISHER RAN exist** on the declaring host. They assert against the INHERITED value, with an unregistered name as the in-run control. The comment that cited nothing in pass 4 now cites a row.
- **The census left `test-results/` and carries a stamp with a plant.** The press cure (children scale, not the box) sits on all five verbs. The PRM chip snap has a break-test.
- **The seam cure was found by running the whole spec file**, and it is priced at every cell.

## 6 · Open gaps (each closable, numbers attached)

1. viewport-law §2.5 @1440×900 is RED on both engines (`new game` over Medium 665.0 / 666.1 px², Easy 424.4 / 425.1). The control is green. Cure it on this tree, or build and frame B-1's two arms on one payload. B-1's default arm (+12.9 px of `padding-top`) moves TAPE's pin band, so the chair has to seat it.
2. Widen the case-wide occlusion gate to sample the case's scroll poses: at least top, end and every 5 px at 1440×900. As landed it reads 1280 / 390 at rest and stays green over §2.5's red.
3. Four occlusion ceilings are 100 (`checking`, `players` ×2, `marks`) and cannot fire. Twelve of sixteen are this tree's readings, not the control's. Three were raised 67.25 → 85.01 after the seam. Key each ceiling to the control's fraction + slack, or declare the pair as a design debt with a number under 100.
4. The engine stamp hashes `src/`, not the served artifact. A face-law run against an unrebuilt dist restamps a 6ch plant to PASS (step 3 exit 0). Stamp the served `index-*` names checked against a fresh build, or refuse a dist `baseURL`. Also add `KeyboardLegend.vue` to `STAMP_FILES`.
5. CHECK 7 exits 0 on `.ctrl-word { font: 400 1rem "Comic Sans MS", cursive }` and on a Tailwind `font-[…]` class. Parse the `font:` shorthand, and add the shorthand to the in-process plant.
6. M17 has no shipping gate. Land G1 (zone ≤ 320 at 1280×800 fine, a +200 plant must red), G3, G4 (with the `--zone-step: 0px` plant) and G5 as e2e rows, and land the PROPOSED VR diff (8b re-aimed; test 10's control extended to 1354.84) with them. Until then, VR 8b and test 10 stay RED on the tree.
7. INTAKE row 2: `--action-bar-h` is written 24 (chromium) / 20 (webkit) times per crib open against 1. Publish on `transitionend` + at rest, and read G-INFO G6 (WebKit frames > 17.5 ms per open, n ≥ 8, load < 4) against the control.
8. c3 shows G-INFO H5: the wells' outline corners and outset brackets frame the open crib and the verbs. Name it as a gap and sequence it after TAPE/RULE's edge row (INTAKE row 1).
9. B14's ring arm (a `HandDrawnOutline` since this pass) is unmeasured and unframed: π, AA, filter census and G8. Measure and frame it at 2× both themes on one payload, or delete the arm.
10. B17, B18 (kept column BUILT), B19 and B20 frames are missing; two of eight M17 ballot frames exist. The 430×932 sheet +22.86 and the Deal hit box 71.19 → 60 each need a before/after crop (INTAKE rows 11, 12, 15).
11. The six `@property --motion-*` rungs minted here (five with 0 consumers, `--motion-whisper` 1 consumer / 0 publishers) re-mint §13's names. Strike them and cite the `-59` tree's block, per §6.5.
12. `check-font-coverage` reports "keys" as a departure (not rendered) while it renders on every desk card. File the verb's words under the sublabel corpus so deleting the call site reds.
13. One control, two sentences: "what the keys do" / "what each key does" (INTAKE row 5).
14. AA has no 40 %-ink plant (INTAKE row 16). Unselected chip median 4.66, and WebKit has 12 % of columns under 4.5 at the 90 % cut.
15. G6 (die ink-left) is RED: 1.0 / 1.5 against 0.5. Restate it at ≤ 1.5 with the DiceIcon inset named, or earn ≤ 0.5 (INTAKE row 10). G2's ink floor was not re-derived.
16. The coarse rail's `size`/`level` wrap 2+1 with `16×16` orphaned (staged lines 2 / 2), and scrollW 282 ≠ clientW 218 on every arm.
17. Frames c1–c4 predate the seam dist. Re-shoot the crib pose (c3) on `index-CNVNTjZawUmM.js`, since the seam moved the wells it frames.
18. Carried: CHECK 6's 18 MDN constants, the /8 protocol, ROW 2 RED, `pencils` −0.02 / −0.04, check 8 RED (chair's restamp), the dark filter census (ACC-SIX), the seal (the chair's one stamp: shipped 992.94 / 992.81, extended control 1354.84 / 1354.89), TABS' yield not taken, G11's full π census, the keys underline literals, the `line` prop consumer-less under ARM A.

## 7 · Verdict

**ADVANCE, 85.** Nothing here is a missing primitive, so this isn't BLOCK. It isn't RETIRE either:
- AA clears on painted bytes.
- The filter budget holds on the built dist.
- M16 copy is clean.
- The deck is π by construction.
- The decided-history moves are named.
- The W2 red is declared and its class is inherited: the control carries it at 61 unsampled poses.

It isn't higher because of the five holes in the summary at the top, and because most of INTAKE's M16/M17 ballot frames aren't on disk.

**Cross-pollination.**
- **Stamp the served artifact, not the src** → every browserless gate reading a browser census (NOTE-LEDGER, MOT-VERB's undefined-token census).
- **A 100 % ceiling on a fraction is no ceiling** → every occlusion allowlist (TAPE, RULE, W2 §2.5b).
- **§2.5's pose sampling** → W2 / TAPE: the control carries the pinned-tape class at 61 of 101 poses that viewport-law never samples.
- **A ResizeObserver publisher on a transitioning box writes every frame** (24 / 20 per open) → MOT-VERB's M1 slide and TAPE's foot.
- **Press a sticky target at its centre, never with `locator.click`, and use `focus({preventScroll})` + Enter for the keyboard route** → every lane pressing a strip control (TAPE, RULE, MRK-ABS).
- **The children-scale press cure** (`.action-verbs .icon-btn:active > :not(.washi-label)`) → MRK-ABS, whose `.info-btn` ring row changes subject.
