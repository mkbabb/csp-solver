# T9-W7 · pass 6 · CRITIQUE · CTRL-RULE — the ruled page

I wrote neither the charter nor the prototype. Tree `wf_f72f3b5a-83a-28` (detached `74a2b5d9`, 30 M + 3 ??,
+2247/−1231, unchanged at my return). **Rig:** I rebuilt the tree with scratch outside it (a two-line
`.mts`, a private cacheDir, outDir in scratch). The result is `index-6iZX5AxOWmmo.js`, and `diff -rq` against the lane's
`dist/` is empty, so the lane's served artifact is current. I served it on `127.0.0.1:4240` and the shared control dist
on `:4241` (`index-CubiZsMVSwTc.js`). Both were verified by asset hash and killed by recorded PID (listeners 39104/39102,
parents 39051/39049); the ports read free. Browser probes deal the lane's payload `ATMuNTMw…MDc5` unless a row
says `?size=3&difficulty=EASY` (the tree's own spec rows). Instruments are in `critique/CTRL-RULE/instruments/`
(`rc6-critic*.spec.ts`, the R3 copy). Summarised readings are in `readings/`. No crop is banked.

## 0 · Numbers I re-ran (both engines unless marked)

| row | lane | control | verdict |
|---|---|---|---|
| `zone-grammar.spec.ts` + `mobile-affordances.spec.ts` WHOLE, lane dist | **77 passed, 1 skipped, exit 0** (chromium + webkit) | — | REPRODUCED |
| `visual-regression.spec.ts` + `viewport-law.spec.ts` WHOLE | **50 passed, 2 failed, exit 1**: the seal `:814` at **1246.53 / 1246.72** vs 1227.5 | (control 1227.09, lane's figure) | REPRODUCED RED (gap 1) |
| **Row 1 π at 1280×800 hasTouch**: masthead / logo / tab / board host / cell / case `[left, top, w]` | chr 180/180/812/180/182/876, case **224**; wk the same | identical to the hundredth, both engines | REPRODUCED π 0.00 |
| **Row 1's ruler gate under MY width plants** | P1a `.icon-btn{padding-inline:.9rem}`: case **275.13**, masthead x **−25.56**, gate **GREEN**. P1b `#card-foot{padding-inline:1.4rem}`: case 228.78, masthead −2.39, gate **GREEN**. P1c verb gap 1rem: gate RED | — | THE GATE CANNOT SEE π (gap 2) |
| **Row 2 seam**, air = case top − wordmark ink bottom | 390×844f **8.02 / 8.2** · 360×800f **8.02 / 7.61** · 390×800f 8.02 / 8.19 · 390×844c 10.88 / 10.98 · 360×800c 22.3 / 22.39 · 430×932c **8.0 / 7.98** | 3.31 / 3.2 · **−18.11 / −18.39** · −7.52 / −7.81 · 1.27 / 0.98 · 12.69 / 12.39 · 18.11 / 17.98 | REPRODUCED. WebKit 360 fine clears the 7.5 gate by **0.11** |
| the `--masthead-foot` publisher | **1 write at load**, 1 more on a live 390→360 resize, and it follows (air 8.02 / 7.61 after) | no publisher | CLEAN (no per-frame writes) |
| **the drawer tab's top, lane − control** (W2's surface) | 390×844c **+9.61/+10** · 360×800c +9.61/+10 · 390×844f +4.7/+5 · 360×800f **+26.13/+26** · 390×800f +15.53/+16 · 430×932c **−10.11/−10** · **768×1024c +39.22/+39** · **820×1180c +39.22/+39** · 600×960f +3.2/+3 | — | UNDECLARED π (gap 5) |
| card clientHeight lane / control, tablet portrait | 768×1024c **564 / 681 (−117)** · 820×1180c 564 / 681 · 600×960f 519 / 597 | — | missing from the lane's 14-cell price table |
| **Row 4 cross tap**, whole row | green both engines | — | REPRODUCED |
| **my extension**: the re-targeted question's `yes` | deal→clear→yes = a straight clear (61 → 0 glyph cells, same as clear alone); clear→deal→yes = a straight deal (30 cells differ, same as deal alone); both engines | — | the re-target answers the TAPPED verb |
| **Row 5 M18 paint row**, six plants (X1, X2, FAINT 0.15, FAINT ink 25 %, ancestor opacity 0, deletion) | all RED in-run, both engines, 1280f + 390c, both themes | — | REPRODUCED |
| **Row 5 under MY plant: the rule's ink reverted to `--ink-press-rule` (55 %, pass 5's)** | gate **GREEN at 11 of 12 cells**: webkit **6/6** (median 3.530 = the full-ink ceiling), chromium 5/6. Only chromium-L 390c DPR 1 reds (2.802 vs 3.0) | — | THE ROW-3 CURE HAS NO HOLDING GATE (gap 3) |
| the foot rule, per-pixel core fraction under 3:1, light, shipped 68 % (same photographs) | DPR 1: chr 21.8 % (1280f) / **36.0 %** (390c), wk 23.4 / 23.3 %. DPR 2 390c: **chr 16.8 %, wk 11.7 %** | — | README's "0 % at DPR 2" is the per-column-MEAN statistic (gap 4) |
| dark, shipped | median 5.35–6.069, under 3:1 0–0.3 % | — | clears |
| **Row 6 :731** | foot 172.16 = hovered 172.16, overlap 0; scale(1.25) → overlap 818.24, RED | — | REPRODUCED |
| **Row 8 residue**, fade on | chr k 0.53/1.53/2.53 → p98 1/1/**1.285**; wk k **−0.47/0.53/1.53** → 1/1/1; struck 5.236 both | — | WebKit never reaches k 2.5 (gap 6) |
| lines-floor `?? foot` (pass-5 plant, run FIRST) | struck; the rule missing → `not.toBeNull` reds | — | RE-CUT, holds |
| chair's R3 (landed), copied + re-pointed | lane **GREEN**; `RuledLine` line deleted **RED**; `v-if="false"` GREEN (a text law; the M18 paint row's `toHaveCount(1)` catches it) | control RED (lane's) | REPRODUCED |
| `check-property-block` (chair's) + dist | **GREEN**, 6 names, stamp `index-6iZX5AxOWmmo.js` | — | — |
| undefined-token census (chair's) BARE | **exit 1**: 3 findings (`ConfirmRibbon.vue:140/141 --tap-floor`, `RuledGroup.vue:92 --rp-margin`) + 1 STALE `--refuse-dur`; TIMING slots 0 | 0 + 3 STALE (lane's) | declared; green only once the chair lands the two PROPOSED rows |
| filter census (built dist, both engines) | **12/12, exit 0** | 12/12, exit 0 | budget 9 holds (light) |
| `check-copy-register` bare | 0 unadmitted, exit 0 | — | M16 clean |
| lint:lanes · theme-tokens · sleep · copy · motion | 0 each | (0, lane's) | — |
| test:e2e:projects · check-pw-projects | **1 · 1** (check 8 FLOOR BAND, 255/253) | **0 · 0** (read by me) | declared, chair's restamp |
| eslint . · `npm run lint` (scoped prettier) | 0 · 0 (eslint net of my own scratch dir, incident 1) | — | — |
| vue-tsc -b · vitest `src/games/shared` | 0 · 34 files / 430 tests, exit 0 | — | — |

## 1 · GAPS (each closable; numbers attached)

1. **The iPad seal is RED, and neither ballot arm holds both constraints.** `:814` reads 1246.53 / 1246.72 against 1227.5
   (control 1227.09). The gutter arm (shipped) keeps π at 0.00 and loses the seal by +19.03 / +19.22. The padded arm keeps the
   seal (1149.66) and moves five unclaimed surfaces by −35.19. In f4 the deal receipt (`dealt` tally) wraps below the fold on
   the shipped arm, and that wrap is the card's +19. Close: an arm at case 224 whose card is ≤ 1227.5, both engines. For example,
   the receipt stays in the deal row's line at the rail, or the rail's field stacks the tally with the face. Or f4 goes to the
   owner with both costs as the only two arms, and the chair's one stamp then prices the gutter arm.
2. **Row 1's ruler gate is self-referential.** It compares the case to Σ(glyph + the button's own padding) + the foot's
   padding, all read off the same tree, so a width change made through the button or the foot moves both sides. With
   `.icon-btn{padding-inline:.9rem}`, the case goes to 275.13 and the masthead, logo, tab, host and cell all move −25.56 in both
   engines, and the gate stays GREEN. With the foot's padding raised, it's 228.78 / −2.39 and still GREEN. It reds only on the
   face-padding plant it ships with (the pass-5 shape) and on a gap plant. Close: the row reads π itself. The case width is
   compared to 224.00 (the control's number, stamped with its commit) or the five surfaces' x to the control served in-run,
   with P1a/P1b as its negatives in the same batch.
3. **The M18 paint row holds existence, not the ink this pass chose.** Median ≥ 3.0 on a crop-p98-keyed core passes the
   reverted 55 % ink at 11/12 cells. In WebKit it passes 6/6 at median 3.530, the full-ink ceiling of 55 %. So row 3's
   68 % cure has no holding gate in WebKit and one 0.198-margin cell in Chromium. The row also omits the fraction clause
   (pass-6 rulings A.6: "the §2.11 fraction clause is part of the gate", across the estate). Close: gate the fraction under
   3:1 at the core (per-column mean, the section's statistic), bounded at the DPR where 1.4.11 is claimed (DPR 2).
   `--ink-press-rule` goes in as a plant that reds at ≥ 1 cell per engine, both themes.
4. **1.4.11 on the light rule: two statistics, one claim.** The lane's DPR-2 "0 % under" is the per-column-mean core. The
   same photographs, read per pixel, put **11.7 % (webkit) / 16.8 % (chromium)** of core pixels under 3:1 at DPR 2 and
   21.8–36.0 % at DPR 1. The README and the f3 ballot state one statistic without naming it. f3's frame is DPR 2, but its caption
   quotes DPR-1 medians (3.628 vs 2.712). Close: name the statistic in the claim and the ballot, and quote f3's numbers at the
   frame's own DPR.
5. **W2's drawer tab moves at nine portrait cells, and the π table says "tag 0 · rect 0 everywhere".** `p6-pi.tape-copy.mjs`
   skips `.drawer-case, #controls-drawer`, and the tab is a descendant, so its move is invisible to the signature. The lane's
   own named rows record it (dock390 133.61 vs 124; dock430 198.73 vs 208.84). I read +9.61 / +26.13 / +15.53 / +4.7 / −10.11 on the
   phones and **+39.22 at 768×1024 and 820×1180 coarse** (case 641.8 vs 681.02; card clientHeight **564 vs 681, −117**, the
   largest price on the tree and absent from the 14-cell table). 768×1024 coarse is T9-B11's frame cell (LADDER), so this is a
   coupling. Close: the tab's lane − control delta is a named π row at every portrait cell incl. 768/820, and the price
   table gains the tablet-portrait cells.
6. **The residue row's WebKit arm never visits the band's worst pose.** WebKit's integer scroll lands k 2.5 → 1.53 (and 0.5 →
   −0.47, past the clip line) inside the ≤ 1.0 tolerance, so the only pose where Chromium shows residue (k 2.53, p98 1.285) is
   never read in WebKit. Close: pick the target pose from WebKit's reachable integer set, assert |k − target| ≤ 0.1, and
   read k ∈ {0.5, 1.5, 2.5} as reached.
7. **The seam's margin in WebKit is 0.11 css** (360×800 fine 7.61 vs the 7.5 gate; the design says 8). Close: say the
   derivation's 8px is pre-rounding. An integer-snapped case top loses up to 0.39. Or derive with 8.5.
8. **The census is RED bare** (3 findings) until the chair lands `--tap-floor :: App.vue → ConfirmRibbon.vue` and
   `--rp-margin :: GameControlPanel.vue → RuledGroup.vue`. `--rp-margin` is this family's own new cross-file token. A.3
   admits the form, and the row is the chair's.
9. **`--toggle-foot` still bakes the hover as the literal 0.54** (App.vue). The gate now reads the hovered box live and reds on
   drift, so the circularity is cured. The LAWS P5 clause "a derived geometry token reads the live transform, never a literal"
   is still unmet in the product. Close: derive from one token the hover rule also reads, or state the pair as a gated
   duplicate.
10. **Carried and declared by the lane (not re-read here):** check 8 (chair's restamp); @property clause 3 AMBER ×3
    (leader's); σ floor margin 0.002–0.011; INTAKE 28 (`var(--vv-height, 100dvh)`, pad 3.0 vs 2, not re-read with the CDP
    inset); T9-M16's foot arm is the control's class (G2 345–419); the grafts NOT taken (CDP inset re-read, the STUCK sweep, the
    junction's 4 css, one regime for berth/mount/reveal); M12 membership (W1 §1.5); the flake bound; the coarse rail's names
    don't pin (U-10); f1/f2 not re-shot.

## 2 · Checklist

- **Gates that cannot fail (on their class):** row 1's ruler (gap 2); row 5 on the ink it chose (gap 3); row 8's WebKit
  arm on k 2.5 (gap 6). Every pass-5 struck gate is re-cut and holds under its own plant: `?? foot`, :731, R3 on deletion.
- **Spec-cites-itself:** row 1 (ruler read off the tree it rules).
- **The pixel it moves that it did not declare:** the drawer tab at nine portrait cells incl. +39.22 at tablet portrait
  (gap 5).
- **The constraint it forgot:** the seal (gap 1). The §2.11 fraction clause on a drawn stroke's gate (gap 3).
- **Unverified gestalt:** none on what it claims. f3 and f4 are lawful one-variable pairs, looked at. f4's left arm reads
  cramped (labels meet their faces, faces ~6 px apart) and the receipt drops out of the rest view.
- **Clear:** M16 (0 unadmitted); filterBudget (12/12 both arms, built dist); π at the rail (0.00, both engines, my own read);
  the cross tap (behaviour + answers); `check-property-block` GREEN; census TIMING slots 0; W2's landed mechanics (the
  sheet still slides; the publisher writes once and follows a resize); no generic-default tell; the decided history
  (R3 GREEN on the chair's landed re-cut; nothing in r0 edited); the legacy `tag` anchor has a real renderer (StagingBand's
  `new game`), so literalization is correct and the pass-5 "no renderer" was wrong.

## 3 · Strengths (reproduced)

1. **The cross tap is cured correctly, not just un-deadened.** Both directions arm the tapped verb, and the answer performs THAT
   verb's act, identical to a direct arm, in both engines.
2. **The coarse rail's π is 0.00 on all five surfaces in my own read**, both engines, and the sideways scroll is 0 (control 64).
3. **The fine seam is cured where it was worst:** 360×800 fine moves from −18.11 (the case over the wordmark ink) to +8.02. One
   ResizeObserver write per load, following a live resize.
4. **Every pass-5 struck gate is re-cut with its negative in the same run**, and the M18 row carries six paint plants that
   all red (X1/X2/FAINT/FAINT-ink/ancestor/deletion). This is the estate's first drawn-edge row that obeys A.5.3.
5. **Honest record:** the seal red, check 8, the DPR-1 non-claim, the 430 rise and the M16 non-cure are declared.

## 4 · Convergence: **77** (from 73), ADVANCE

The cures are real and reproduced: the cross tap, :731, `?? foot`, the census +4 → +0, the fine seam, the rail's π and
head-clear. What holds the number is a seal regression with no arm that holds both constraints, two new gates blind to their own
class (the rail ruler, the ink), an undeclared tab π up to +39.22 with a −117 content price, and the WebKit residue arm. None is
a missing primitive; each closes with a stamped number, a fraction clause, a named row or a receipt placement.
Earliest 100: pass 8 (a clean pass needs gaps 1–3 closed first).

## 5 · Cross-pollination

- **CTRL-FACE / CTRL-TAPE / the §10 integrator ← gap 2:** any "the case keeps the control's width" row reads the control's
  number or the control live, never a ruler assembled from the tree's own boxes.
- **Every drawn-edge paint row (TAPE, SELF, LIVE, ABS) ← gap 3:** after X1/X2/FAINT, plant the PREVIOUS pass's ink. A median
  at a translucent ink's full-ink ceiling passes a weaker ink in WebKit.
- **Every π census keyed by `closest(<container>)` ← gap 5:** a container key hides the W2 tab. Name the tab as its own row.
- **MOT-LADDER (T9-B11, 768×1024 coarse) ← gap 5:** the §10 case moves the dock tab +39.22 there.
- **Every integer-scroll pose row ← gap 6:** a ≤ 1.0 tolerance in WebKit silently re-targets the pose.

## 6 · Incidents (the critic's own)

1. `eslint .` first exited 1 on MY scratch specs under `.rulecrit6/`. Net of that dir it's 0. The dir was then `mv`ed to
   `<scratchpad>/trash-rulecrit6-1/`.
2. My first cross-tap probe compared null aria-labels (vacuous `sameBoard`), and my `MutationObserver` write-counter read 0
   writes while the value was set. Both were replaced (a glyph-pattern fingerprint with a straight-verb baseline; a
   `setProperty` hook). Only the replacements are cited.
3. A control-arm probe of a straight clear did not complete a clear under the control's different arming machinery. It is not cited.
4. `vue-tsc -b` rewrote the ignored `tsconfig.tsbuildinfo` in the tree; `vite build` ran with outDir in scratch.
5. I did not re-run the pass-5 dist's born-RED arms, the M16 foot arm, row 10 or the σ sweep. Those are the lane's readings.
