# T9-W7 · pass 7 · CRITIQUE · CTRL-RULE — the ruled page

I wrote neither the charter nor the prototype. Tree `wf_f72f3b5a-83a-28` (detached `74a2b5d9`, 30 M + 3 ??,
+2,470/−1,231, `zone-grammar.spec.ts` `c0ee7563`, `scene.css` `c6e642bb`, unchanged at my return). **Rig:** I rebuilt the
tree to scratch outside it (a two-line config, a private cacheDir outside the root) → `index-DhyGcaFHh9QU.js`, `diff -rq`
against the tree's `dist/` empty. I built `s10` myself (`git archive 74a2b5d9` + `pass6/integrate/s10.diff`, apply `--check` 0)
→ `index-QGTCf7nYCMIb.js`, the lane's hash. Served tree `:4231`, the shared control dist `:4232` (`index-CubiZsMVSwTc.js`),
`s10` `:4233`, each verified by asset hash. Killed by recorded PID (listeners 12950/13008/12982, parents 12584/12586/12588),
ports read free. Payload `ATMuNTMw…MDc5` on every probe, or the tree's own `?size=3&difficulty=EASY` for the spec rows.
Box load: 1-min 76–94, about 260 node processes. None of my rows is a timing row. Instruments are in `critique/CTRL-RULE/instruments/`;
summaries are in `readings/`. No crop is banked.

## 0 · Numbers I re-ran (both engines unless marked)

| row | tree | control / s10 | verdict |
|---|---|---|---|
| `zone-grammar` + `mobile-affordances` WHOLE | **77 passed, 1 skipped, exit 0** (1.2 m) | — | REPRODUCED |
| `visual-regression` + `viewport-law` WHOLE | **50 passed, 2 failed, exit 1**: the seal `:814` **1246.53 / 1246.72** vs 1227.5 | (control 0, lane's) | REPRODUCED RED (gap 1) |
| **Row 28 on paint under CDP inset 34** (the lane's `p7-inset-rule.mjs`, copied, chromium) | lowest ink clears the inset line by **3.0 / 3.5 (390c DPR 1/2) · 3.0 / 3.0 (430c)**, pad 36.4px, both themes. Inset 0: 3.0–3.5, pad 2.4px. WebKit inset 0: 3.0 / 3.5 | — | REPRODUCED |
| in-spec row 28 (my whole run) | inset 34 **3.5** · `max()` planted **1.0 RED** · inset 0 3.5 | — | REPRODUCED |
| `--vv-height` at the consumer | published = consumer `top` = unpublished = innerHeight at every cell (webkit unpublished 843.999939) | — | REPRODUCED, dead-equal at rest |
| **Row 28's WebKit arm (the source regex, the only arm WebKit runs), under SHAPE plants** (`row28-source.mjs`: the spec's regex, verbatim, on planted copies of `scene.css`) | shipped GREEN · **E4 `@media (pointer:coarse){.card-foot{padding-bottom:max(…) !important}}` GREEN · E3 `#card-foot.card-foot{padding-bottom:.15rem}` GREEN · a shadowing `padding-bottom:.15rem` in the SAME block GREEN** | — | **CANNOT FAIL** (gap 2) |
| **M18, the lane's plants** (my `rc7-critic.spec.ts` = the spec's `PAINT_DIFF`/`FOOT_RULE`/`RULE_INK`/`FOOT_RULE_HOLDS` verbatim) | shipped holds 8/8. R55 RED 8/8 (alpha 0.549–0.553) | — | REPRODUCED |
| **M18 under MY plants: the R55 painted ink by another longhand** | **C1 `path{stroke-opacity:.81}` GREEN 7/8** (median **3.530 = R55's own**, alpha 0.676–0.682; only chromium light 390c reds, 2.802). **C2 `path{opacity:.81}` GREEN 8/8.** **C3 `svg{filter:opacity(.81)}` GREEN 7/8** | — | THE CLASS IS NOT HELD (gap 3) |
| M18, a mid-rule break (C4 mask 48–52.5 %) | stationsUnder3 0.047–0.053. GREEN at 2/8 (chromium 390c L/D), RED 6/8 | — | reading, within the 0.05 bound as designed |
| **Row 1 π vs 74a2b5d9's stamp** (1280×800 hasTouch) | drift **0.00** · pass-5 face 294.38 RED · P1a 275.13 / masthead 154.44 RED · P1b 228.78 / 177.61 RED | — | REPRODUCED, pass-6 gap 2 CLOSED |
| **Residue row, WebKit** | k **0.53 / 1.53 / 2.53**, p98 1 / 1 / **1.322**. Struck: 5.236 | chromium 1 / 1 / 1.285 | REPRODUCED, pass-6 gap 6 CLOSED |
| Seam 390/360 fine | chr 8.02 / 8.02 · wk **8.2 / 7.61**. Band alone −19.9 / −8.4 RED | — | REPRODUCED (7.61 against 7.5: declared) |
| **Drawer tab π + content** (the lane's `p7-tab-pi.mjs`, copied; 4 cells) | Δtab (tree \| s10): 390×844c **+9.61 \| +37.23** · 360×800f +26.13 \| +56.67 · 768×1024c **+39.22 \| −31.26** · 430×932c −10.11 \| +20.99; webkit equal ±0.4. Content c / tree / s10: 628/540/512 · 584/484/452 · **681/564/634** · 675/607/575. Sideways 0 on all three | — | REPRODUCED to the hundredth |
| **Painted-text AA on the ruled page's OWN names** (the chair's `glyph-pop.mjs`, copied; 390×844c DPR 2) | `.rp-name` (Fraunces, `--color-muted-foreground` 115,115,115) light **4.659, frac under 4.5 0.198–0.225**, pop 3,331–5,201; dark 7.681 | control: `marks` 4.40 / 4.338 RED (HEAD's), `checking` tape 6.048 chr / 11.956 wk. **s10: `marks` 19.451 · `checking` 17.362** (L), 15.839 / 9.122 (D) | NO ROW GATES IT; UNSTATED BALLOT LOSS (gap 4) |
| the verbs' sublabel `clear` (the hand's tag rung) | light **4.40 RED (G2)** both engines, dark 7.41 | control 4.527 chr / 4.159 wk · s10 4.42 / 4.06 | T9-R8's row (all three arms under). Cited, not the family's to cure |
| the chips' face (computed, 390c) | `"Fira Code", monospace`, title case, `BUTTON.ctrl-btn` | control **identical** · s10 `"Patrick Hand"`, `text-transform: lowercase`, `SPAN.ctrl-word` | π 0 against HEAD. But the B13(b) pair varies it (gap 5) |
| `git apply --check`: cumulative on fresh 74a2b5d9 · on 74a2b5d9+s10 · pass-7 delta on s10 | **0** · **22 files refuse** (the lane's list, verbatim) · **refuses in both files** | — | REPRODUCED |
| `check-copy-register` bare | 0 dashes, 0 unadmitted, exit 0 | — | M16 clean |
| `check-property-block` src + served `:4231` | **GREEN**, 48 registrations, stamp `index-DhyGcaFHh9QU.js` | — | clear |
| undefined-token census (chair's, copied) | **exit 1**: `ConfirmRibbon.vue:140/141 --tap-floor`, `RuledGroup.vue:92 --rp-margin` + 1 STALE; TIMING 0 | control archive exit 1 (0 + 1 STALE) | REPRODUCED, declared (chair's rows) |
| `eslint .` (net of my scratch dir) · lint:lanes · lint:sleep | 0 · 0 · 0 | (0, lane's) | — |
| `check-pw-projects` | **exit 1**, check 8 (webkit floor 212 vs live 253) | (0, lane's) | declared, chair's restamp |
| the lane's portable-row shas on s10 | affordances `a80dca14`, futoshiki `ff00255d`, permalink `13687a4e`, sudoku-interaction `1e8d7175`: the SAME bytes on s10 and on the tree. share-truth, zone-grammar, viewport-law and check-font-coverage are s10's own | — | the sha pairing holds |

Not re-run by me: vitest (831), vue-tsc, the filter census (lane: light 12/12 both arms; dark 8/4 on both, identical), `lint:theme-tokens`/`copy`/`motion`, prettier.

## 1 · GAPS (each closable; numbers attached)

1. **The iPad seal is still RED: 1246.53 / 1246.72 against 1227.5, unchanged from pass 6.** Nothing this pass
   touched the rail card. Pass-6 gap 1 asked for an arm at case 224 whose card is ≤ 1227.5, or f4 put to the owner
   with both costs. The README reclassifies the seal as "B13(b)'s cost". That's a disposition, not a cure: if B13(b)
   fires, the fold inherits a red seal. Close: the deal receipt stays in the deal row's line at the rail (the +19 is the
   receipt's wrap, per pass 6's f4), or the ballot states that firing (b) ships `:814` red at +19.03/+19.22 and names who
   re-stamps it.
2. **Row 28 has no failable arm in WebKit.** WebKit runs only the source regex (`.card-foot\s*\{[^}]*\}` in
   `scene.css` alone, `some()` over blocks). It passes an `!important` `max()` in a coarse media block, a compound
   `#card-foot.card-foot` override, and a shadowing `padding-bottom` in the same block, all GREEN (readings
   `rc7-row28-source-arm-shape.txt`). This is LAWS P6 §F's SHAPE law: every stylesheet, subject compound,
   last-wins, `!important`, and the E-plants. A hand-rolled source reader is also a row against §I, since the chair's
   `shape-census.mjs` is the one copy. Close: the source arm calls `census(fe, "card-foot", "padding-bottom")` from
   `pass7/instruments/shape-census.mjs`, resolves last-wins at the consumer, and ships E3/E4 plus a shadowing plant in-run,
   each RED.
3. **M18 holds the R55 token, not the R55 ink.** The alpha clause's FULL reference re-strokes the path, so any
   plant that lowers ink without touching `stroke` carries into the reference and cancels. `stroke-opacity: .81`
   paints exactly R55's ink (station median **3.530**, R55's own figure) and holds at 7/8 cells. `path { opacity: .81 }`
   holds at 8/8, and `filter: opacity(.81)` at 7/8. The chain clause reads `opacity` from the svg upward, so it can't see the
   path's own opacity or stroke-opacity. That leaves pass-6 gap 3 (the 68 % cure has no holding gate) cured for its plant,
   not its class. It's LAWS P6 §E's own sentence: "a relative clause is never the only clause". Here it is the only clause
   that separates 55 % from 68 %. Close: add an ABSOLUTE station-median floor between the two inks. The shipped rule
   reads 5.165–5.236 L and 5.959–6.069 D. R55/C1/C2/C3 read 3.53 L and 4.32–4.37 D. A floor of ≥ 4.8 L and ≥ 5.5 D per
   quarter (or one of 4.8 in both themes) reds all four at 8/8. Ship C1/C2/C3 in the plant list, and extend the chain to the
   path's `opacity` and `stroke-opacity`.
4. **The ruled page's own names have no painted-AA row, and they sit 0.159 over the floor.** `.rp-name` is
   `--color-muted-foreground` and reads a glyph-population median of **4.659 in light, both engines**, with **19.8–22.5 %
   of the population under 4.5**. It is the family's central text subject, and no row in `e2e/` photographs it (every
   `screenshot` in `zone-grammar` is the foot's rule or ink). The same names on `s10` read **19.451 / 17.362** (light),
   and the control's `checking` tape reads 6.048 / 11.956. The B13(b) ballot's "(b) loses" list omits it (LAWS §G). Close:
   a glyph-pop row on `.rp-name` (G1–G4, FAINT30 + TAIL12/35 in-run, fraction bound = shipped + 0.05) both themes, both
   engines. Add the ballot line "(b)'s names read 4.66:1 against s10's 17–19:1 (light)". Or ink the names at
   `--foreground`, which is the arm's design call.
5. **The B13(b) pair varies more than the page's ruling, and the caption says "the only variable is the page".**
   The ruled arm carries HEAD's chips (`Fira Code`, title case, `BUTTON.ctrl-btn`, π 0 to 74a2b5d9), while s10 carries FACE's
   (`Patrick Hand`, lowercase, `SPAN.ctrl-word`). s10 also groups marks and what fits under a `pencils` tape, and it centres
   the deal. An owner reading the pair will credit the typewriter chips to "the ruled page". Firing (b) reverts FACE's chip
   voice, and no line says so. Close: the caption lists what (b) brings (the rules, the name column, the receipt placement)
   and what (b) drops of the fold's page (FACE's chip face and case, the `pencils` group, the centred deal). Or re-frame
   with FACE's chips grafted onto the ruled arm, so the one variable is the ruling.
6. **The filter census was not read at boot** (LAWS P6 §E: at rest AND at boot, tree vs 74a2b5d9). The lane read it
   at rest only (light 12/12; dark 8/4 on both arms, identical). Close: the boot read, both themes, beside the control's.
7. **Carried and declared (chair's rows or estate rows, not this family's to close alone):** the census's 3
   findings (`--rp-margin` is this family's own cross-file token, and the PROPOSED ledger rows are pass 6's); check 8 (the
   restamp); the chair's `EDGE_PLANTS.FADE15` is a no-op on descendant-stroked subjects (the lane's find, correct:
   `edge-bands.mjs:94` writes the edge element only); WebKit has no inset emulation; `scene.css:580
   var(--vv-height, 100dvh)` is dead-equal at rest (W2's line); row 29 is OPEN at s10's coarse rail at 64 (FACE's); the seam's
   0.11 WebKit margin; `--toggle-foot`'s 0.54 as a gated duplicate (the `scale(1.25)` plant reds, 818.24, reproduced);
   T9-R8 on the verbs' sublabel (4.40 on the tree, 4.527/4.159 on the control, 4.42/4.06 on s10).

## 2 · Checklist

- **Gates that cannot fail:** row 28's WebKit arm (gap 2). M18 against the painted-ink class, where the relative
  alpha clause is blind to any longhand the reference inherits (gap 3).
- **Vacuous convergence / spec-cites-itself:** row 1 is cured. It now reads the control's stamped numbers, and P1a/P1b red.
- **The constraint it forgot:** painted AA on its own names (gap 4, which clears 4.5 by 0.159 with 20 % under). The SHAPE
  law on its only WebKit arm (gap 2). The boot filter read (gap 6).
- **Unverified gestalt:** the pair is looked at and it's real on both themes. The ruled arm reads coherent (heavy
  graphite rules, a gray name column), and its names are visibly lighter than s10's black names. The pair's variable is
  not single (gap 5).
- **The pixel it moves that it did not declare (π):** none new. The pass-7 delta is π 0 at inset 0 (pad 2.4px either
  way, both engines, my read). The tab π is now a NAMED row, reproduced.
- **Generic default:** none. Title-case monospace chips are HEAD's, not this family's.
- **Clear:** M16 (0 unadmitted), `check-property-block` src + served, census TIMING slots 0, W2's mechanics (the sheet
  slides, and `--vv-height` is untouched), the decided history (R3 GREEN, nothing in r0 moved), filterBudget at rest
  (lane's, tree = control), the frame retirees named (pass-5 f1/f2, 35,052 B out, 142,070 B in: **net +107 KB of the
  wave's ~150 KB headroom**, stated for the chair).

## 3 · Strengths (reproduced)

1. **Row 28 is cured on paint where it can be measured.** The stacked `calc(0.15rem + env())` moves the lowest ink
   from 0–1.5 to 3.0–3.5 above the inset line, at every chromium cell, DPR and theme, with the `max()` plant red in-run
   (1.0). It converges with TAPE's `calc(<pad> + env())` on s10.
2. **Row 1 now reads π, not a self-ruler.** It checks 74a2b5d9's stamped `[x, width]` on four surfaces, and all three
   width plants red, including both of the pass-6 critic's.
3. **The residue row visits the band's worst pose in WebKit** (k 2.53, p98 1.322), so the pose is chosen from the
   reachable set rather than tolerated.
4. **The 1.4.11 statistic is named** (per-station best 0 % under; per-pixel core@50 printed, not claimed). The tab π
   is a named row at ten cells with the tablet price (−117) stated, and it reproduces to the hundredth in both engines.
5. **Honest record.** The seal red, check 8, the census, the FADE15 no-op, the chip wrap and the 22 un-appliable files
   are all declared. The cumulative diff applies 0 on a fresh 74a2b5d9, and the sha pair (battery = bank) holds.

## 4 · Convergence: **80** (from 77), ADVANCE

The pass closes four of pass 6's gaps outright (the self-ruler, the unnamed statistic, the tab π row, the WebKit
residue pose), closes one on paint in the engine that can measure it (row 28), and states two (the seam margin,
`--toggle-foot`). It does not close the seal (gap 1). It cures M18 for its token and not its ink (gap 3). It leaves its
only WebKit row-28 arm unable to fail (gap 2). It never photographs its own names, which sit 0.159 over AA and 13–15:1
under the page it competes with (gap 4). None of these is a missing primitive: each closes with a floor, the chair's
library, a glyph-pop row or a caption. The family is alive on T9-B13(b) alone, and the fold carries none of its centre.
**Earliest 100: pass 9.** Pass 7 is not clean for this family, so two clean passes can't end before pass 9.

## 5 · Cross-pollination

- **Every drawn-edge row with a relative alpha/reference clause (TAPE's foot ring, LIVE, SELF, the chair's `edge-bands`)
  ← gap 3:** plant the previous ink through `stroke-opacity`, the path's own `opacity` and `filter: opacity()`. A
  reference photographed by re-stroking inherits all three.
- **The chair's `edge-bands.mjs` ← the lane's gap 4 plus my gap 3:** FADE15 needs the descendant form
  (`<edge>, <edge> *`) and a `stroke-opacity` twin.
- **CTRL-FACE / the §10 fold ← gap 5:** a B13(b) or B12 frame against s10 should declare FACE's chip voice as a
  separate variable, or graft it onto the challenger arm.
- **Every WebKit-only source arm (TAPE's `check-tape-foot`, any inset row) ← gap 2:** where WebKit can't emulate the
  subject, its source arm is the gate, and it must meet the SHAPE law in full.

## 6 · Incidents (the critic's own)

1. I wrote a two-line build config into the worktree (`web/frontend/.vite-rulecrit7-build.config.mts`, its cacheDir
   outside the root) and scratch PW configs plus my spec under `web/frontend/.rulecrit7/`. Both were `mv`ed to
   `<scratchpad>/trash-rulecrit7-1/` before return. The worktree's `git status` at return is 30 M + 3 ??, the lane's own.
2. `eslint .` ran with `--ignore-pattern` on those two scratch paths while they existed.
3. A `sleep 45 && tail` poll was refused by the harness. It was replaced by background runs with notifications.
4. No `rm` was invoked, no git ran in the control tree, and nothing was built into the control or into the tree's `dist/`.
