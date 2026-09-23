# T9-W7 pass 6 · CRITIQUE · MRK-ABS (the absolute wobble, §5 §6)

Adversarial, non-author. I wrote neither the charter, the prototype nor any earlier artefact of this
family. Base and π control `74a2b5d9`. Work tree `.claude/worktrees/wf_f72f3b5a-83a-39`, read in
place and never edited (its `git status` reads the same 13 M + 1 ?? before and after).

The pass-6 delta against the chair's `pass5/prototype/MRK-ABS/pass5.diff` (applied to a `git archive`
of `74a2b5d9` in scratch, then compared file by file) is **comments only** in three product files
(`index.css`, `GameCard.vue`, `pencilConfig.ts`) plus the spec growing from 518 to 715 lines. The
other ten product files are byte-identical to pass 5. The shipped pixels have not moved since pass 5.

I rebuilt the returned tree from a `git archive` of `74a2b5d9` plus the tree's own
`git diff --binary`. I built it to scratch with a private cacheDir and got **`index-CJzSS7mwBmS6.js`,
37 assets**, the identity the README names. `diff -r` of src, e2e and scripts against the work tree
was empty.

Servers:
- lane on :4239;
- the shared control's prebuilt `index-CubiZsMVSwTc.js` on :4240, verified by hash;
- my arm H on :4244;
- my paint plant on :4245.

All four were killed by recorded PID (listen 58935/58934/59943/59956, npx 58871/58874/59898/59899)
and all four ports read free. No `rm` was used. Scratch lives under `<scratchpad>/crit6-abs/` and
the configs under `trash-crit6abs/`. Nothing was committed, stashed, installed or deployed, and the
control tree was never git-touched.

**CONVERGENCE: 78 %. VERDICT: ADVANCE** (pass 5: 76).

What moved it up:
- the pass-5 plant now reds;
- the whole ring is declared and truth-gated;
- the dropped-station bias is gone from the board rows;
- the hosts are reached;
- the px figures are restated in DOM px;
- π drives focus.

What holds it at 78:
- the family's OWN geometry causes the 16×16 regression, the README says the opposite, and the
  geometry pair was never built;
- G-ABS-3 passes when a chrome ring paints nothing;
- the product has not changed since pass 5.

---

## 0 · Gaps first (each closable, numbers attached)

1. **The 16×16 frame regression is the family's own geometry, and the README misattributes it.**
   - I built **arm H**: this tree with only `gridPaths.ts` back at 74a2b5d9 (roughness 0.4,
     segments 2 at 16×16, no inset). The ink stays the tree's #3a7bc4 @ 0.95. It is
     `instruments/arm-H-head-geometry.PROPOSED.diff`, dist `index-BdNR-DF28BSv.js`.
   - I ran the landed G-ABS-5 on it, both engines (`logs/armH-g-abs-5.txt`).
   - **16×16 frame cell, whole ring under 3:1 of 240:**

     | engine | arm H | tree | control 74a2b5d9 (this run) |
     |---|---|---|---|
     | chromium | **44 / 44** | 78 / 78 | 45 / 51 |
     | webkit | **24 / 24** | 78 / 78 | 24 / 27 |

   - **WebKit left-side worst:**

     | theme | arm H | tree | HEAD spread |
     |---|---|---|---|
     | light | **3.328** | 2.85 | — |
     | dark | **3.144** | 2.404 | 2.851–3.157 |

   - So the lane's gaps 1 and 2 (the frame regression and the WebKit left-side regression) both
     vanish when only the geometry reverts.
   - The same revert costs the **9×9 corner cell**: tree 0/240, worst 3.92 / 3.989 → arm H
     **66/240**, worst 2.812 / 2.404 (chromium light / dark). HEAD reads 66/240 at 2.693 / 2.309.
   - The truth, then: **the absolute-wobble geometry trades the 9×9 corner (66 → 0) for the 16×16
     frame (44/24 → 78).**
   - The README says instead that "nothing on this tree cures it" and "the inset does not cause it".
     Arm I90 only varies the inset inside the new recipe, so it could not see the cause.
   - The ballot has no A-vs-H geometry pair. The ink pair (A/B/C), the inset pair (0.86/0.90), the
     deck and law 39 are all framed, but the family's own thesis is not.
   - Chair A.5 withdrew the premise (§2.6) that justified shipping this geometry as the tree's
     default. LAWS P5 says a firing default may not lose to the control on the named statistic.
     The tree's default loses at 16×16 (78 vs 24–51) and wins at 9×9 (0 vs 66). The ballot names
     the loss but not its cause or the win.
   - Close:
     - frame A|H on ONE `mint(4)` payload, cell 0, both themes, one variable (the geometry);
     - print both boards' whole-ring counts in the ballot row;
     - restate gap 1 as the geometry's trade, not an uncurable debt;
     - either hand the size-keyed recipe to LIVE's pass-7 row with both numbers attached, or build
       it here (inset/wander keyed on `boardSize`, one const). It should read ≤ 44 at 16×16 and 0 at
       9×9.
2. **G-ABS-3 passes when a chrome ring paints nothing** (a gate that cannot fail on its own subject,
   the survivor-bias class this family cured on the board and left on the chrome).
   - `band()` returns `null` when no sample line changes by more than 12, and `judge()` skips null
     stops. The home clause only needs `banded.length ≥ 6`, and the tree bands 7.
   - I appended `.icon-btn:focus-visible{clip-path:inset(0)!important}` to a copy of the lane dist's
     CSS. That paints the ring to zero and leaves the computed outline untouched.
   - Landed G-ABS-3 + G-ABS-4, chromium, bare: **2 passed, exit 0** (`logs/plant-clip-icon-btn.txt`).
     `.icon-btn` simply drops out of the band list (7 → 6 home stops). G-ABS-4 sees the same computed
     ink and passes.
   - The same hole covers the deck row, which bands **5 of 44** lines in chromium light (12 dark) and
     carries no visibility floor. The lane's gap 3 declares that; this is its gate-level form.
   - Close:
     - a stop that G-ABS-4 reached and that bands null (or bands under N lines) is RED;
     - bind the band count to the stop's reachable line count;
     - ship this clip-path plant (and chair A.5.3's faint-ink plant on one chrome stop) as in-run
       negatives in the same file.
3. **The figures in `pencilConfig.ts` and `gridPaths.ts` are restated but still bound by no gate.**
   - G-ABS-5 parses only the `--color-focus-sketch` comment in `index.css`. `RING_GEOMETRY`'s comment
     carries 0.50 / 1.64 / 0.23 / 2.37 / 1.96 / 1.03 px, σ 2.42 / 2.41 / 2.44 u, 0.77 / 1.18 / 1.20 px
     and 2.392 u ±5 %. `gridPaths.ts` carries 58,761 → 119,894 B and 215,431 B.
   - G-ABS-7 prints the clearances but asserts only `≥ 0` and `witness < 0`. σ's DOM read is a probe
     (`p6-sigma.spec.ts`), not a landed row.
   - So a change to `wanderUnits` or `inset` leaves every px figure in that comment stale, with
     nothing turning red. This is pass-5 gap 7's class (a product figure with no row), moved to a
     file the parser doesn't read.
   - Close: extend the figure clause to the `RING_GEOMETRY` comment, bound to G-ABS-7's printed
     readings (±0.01 px) with a planted-figure negative. Strike the byte figures or land a row that
     reads them.
4. **G-ABS-7's witness clause pins the design's premise, not a property.**
   - `expect(witness).toBeLessThan(0)` reds any recipe whose wander, at inset 1.00, clears the cell.
     HEAD's own recipe clears by +1.958 px.
   - So returning to HEAD's geometry (chair A.5.2's first option for LIVE), or reducing the wander,
     reds a landed gate even though the user sees no defect.
   - Close: demote the witness to a printed reading, or key it to `inset < 1` so it can't forbid
     `inset = 1`.
5. **INTAKE §7 row 44 stays OPEN, and its replacement read can run on THIS tree.** The row asks for
   the open "i"/"keys" glyph painted at 2×, both themes, on the glyph-text statistic, with the 4.66
   rest reading held ≥ 4.5 and its distribution stated. That glyph exists here. The lane parked the
   row on the foot edge's arrival (§10), but the read doesn't depend on it. `.info-btn` chromium stays
   ADMITTED at 0.068 (2.608 / 2.418, reproduced).
6. **The chrome floor's coverage is the landing pose only.**
   - G-ABS-3 bands 10 stop keys: 7 home keys, the deck, a staging face and a guard face. `stops()`
     keeps the first element per `tag.firstClass` and skips anything inert or hidden.
   - The opened surfaces have no painted-floor row: the attribution hover card's links, the controls
     drawer at 390×844 coarse (G-ABS-11 reads reach, not contrast), and the lobby's input.
   - Nor does any ring on a tinted fill (PAL-TIN's own-ground vs tinted-fill statistic, unrun).
   - Close: band each opened surface's stops, both engines, both themes, with a hasTouch arm on the
     drawer.
7. **The deck frame's payload does not bind the painted card.**
   - `p6-2` names `?view=gallery&size=3&board=mint(3)`. The centre card paints the deck's own deal:
     cells 0 and 1 read 5 and 3, and `mint()` holds both EMPTY.
   - The two arms show the same givens by eye, so the pair is lawful in practice, but the named
     payload is not the painted one.
   - Close: state the card's deal and read its given-set back through the aria-label corpus in both
     arms (LAWS P5).
8. **One false table cell.**
   - The README's deck table says HEAD's positions under 3 are "all visible positions". The lane's own
     `deck-summary.txt` reads dark **950 / 1333** (chromium) and **567 / 953** (webkit). All is true
     in light only.
   - Close: print per theme.
9. **Carried, declared by the lane, reproduced where read:**
   - The landed G-ABS-5 minimum is one photograph pair. The second bare photograph appears only in
     the arms probe.
   - G-ABS-4/4f's "host REACHED" clause has no planted negative.
   - G-ABS-11's WebKit hasTouch arm reads `fv false`, so it is a reading, not a gate.
   - WebKit forced colours is emulation only, and G-ABS-4f asserts equality with Highlight, not
     contrast.
   - The phone perf price of the pinned segments (the resident `d` at 16×16 goes 58,761 → 119,894 B)
     is unmeasured.
   - The `visual-golden` strike is lawful: grep finds no focus pose in it, and Plant K is cited. The
     real-Safari row is struck by M19. Neither is counted against the lane.

---

## 1 · What I re-ran myself (critic's build `CJzSS7mwBmS6` vs control `CubiZsMVSwTc`, both engines)

| row | my reading | the lane's |
|---|---|---|
| **The pass-5 plant FIRST**: "1.8" planted in a copy of `index.css`, landed G-ABS-5 bare, chromium | **1 failed, exit 1**, `unguarded ["1.8"]` (`logs/plant-p5-1.8.txt`) | B1 exit 1 |
| **Landed `focus-ring.spec.ts`, whole file, bare** | lane **10 passed, exit 0** (3.7 min) | 10 passed |
| same, control | **10 failed, exit 1**, each for its named reason: computed 0.9 (G-ABS-5); G-ABS-8 identity; G-ABS-4 `auto` ×4 with two inks; G-ABS-4f chromium deck/staging `rgb(0,0,0)`, webkit off Highlight; G-ABS-3 logo-trigger | same |
| G-ABS-5, 16×16 (chromium / webkit) | paper 3.972 / 3.965 light, 3.989 / 3.997 dark · frame **2.812 / 2.85** light, **2.404 / 2.404** dark · whole ring **78 / 78** every cell · 9×9 3.92 / 3.965, 3.989 / 3.989 · in-run: 0.9 → 3.679, faint → 1.316 with 240/240 under, X1/X2 null | identical to the third decimal |
| control, same printout | frame 2.69 / 3.124 light, 2.32 / 2.927 dark · whole ring 45 / 24 light, 51 / 27 dark · **9×9 corner 66/240**, 2.693 / 2.309 | 43–51 cr, 24–41 wk (within) |
| **NEW · arm H (HEAD geometry, tree ink)** | 16×16 frame whole ring **44 / 24**; webkit left **3.328 / 3.144**; 9×9 corner **66/240**, 2.812 / 2.404 | not built |
| G-ABS-7, both engines | product +1.639 / +2.373 · I90 +1.027 / +1.761 · witness −0.501 / +0.232 · **HEAD +1.958 / +2.691** · identity 256/256 · 0.489 / 0.636 px/u | identical |
| G-ABS-3 chrome floor | chromium light: page stops 4.188, ctrl 4.289, `.icon-btn` 3.574, `.info-btn` 2.608 (admitted 0.068), tab 1.043 / 0.154, deck 4.188 (**5 lines**), staging 4.289, guard 4.227 · webkit dark: deck 3.788 (12), guard 4.283, `.icon-btn` 3.603 | identical |
| **NEW · paint plant (`.icon-btn` clip-path)** | G-ABS-3 + G-ABS-4 **2 passed, exit 0**; `.icon-btn` absent from the band list | — |
| G-ABS-4f Highlight | chromium `rgba(5, 0, 73, 0.8)`, webkit `rgba(128, 188, 254, 0.6)` | same |
| **Filter census**, built dists, 4 projects | lane **20 passed / 4 failed**; control **20 / 4, the same four** (dark G3.1 / G3.3, both engines, the inherited `crayon-heart`); light 12/12 on both, **filterBudget 9**; the diff adds no filter | same |
| **Battery**, bare, lane \| control (clean archives; `logs/battery.txt`) | check-copy-register (M16) 0\|0 · lint:copy 0\|0 · lint:lanes 0\|0 (with `.github`) · lint:theme-tokens 0\|0 · lint:theme-selectors 0\|0 · lint:sleep 0\|0 · lint:motion 0\|0 · lint:ink 0\|0 · test:e2e:projects 0\|0 · check-pw-projects 0\|0 · `eslint .` 0\|0 · prettier (`npm run lint`'s form: src, scripts, ../../scripts, ../relay) 0\|0 · check-property-block (pass6) 0\|0 · undefined-token census (pass6) 1\|1 = the one STALE `--refuse-dur` row, 0 findings (A.1 ruling 4, GREEN net) · lane `vue-tsc -b` 0 · lane typecheck:e2e 0 | same |
| **@property / tokens** | the diff adds 0 `@property`; `--ring-ink` is declared once and consumed bare ×5; `--color-ring` has no remaining consumer in src (the one `.ring` utility in the dist uses `--tw-ring-color`, unaffected) | — |
| **Figure-clause attacks** (read from the spec) | every numeral token is matched; `indexOf ≥ 0` is guarded; a second count line, a fourth row, a duplicate row value and a `tier 3.5` all red by construction. The allowlist (`N×M`, `§N`, `12 units`, `3:1`) admits a figure only inside a named phrase | — |

## 2 · Failure-mode checklist

| item | verdict |
|---|---|
| vacuous convergence | CLEAR on G-ABS-5 (every clause has an in-run control, and the pass-5 plant reds) and on G-ABS-4 / 4f |
| spec-cites-itself | **HIT**: G-ABS-7's witness clause makes "the inset is load-bearing" a gate, so a return to HEAD's geometry reds (§0.4). R1-moved is unchanged from pass 5 (PROPOSED; its truth half is G-ABS-5) |
| gates that cannot fail | **HIT**: G-ABS-3 passes a ring painted to zero (clip-path plant, 2 passed, exit 0; §0.2); the deck row bands 5/44 with no visibility floor |
| elegant-reduction trap | **HIT**: "nothing on this tree cures it; the inset does not cause it". Arm H cures the 16×16 frame at the price of the 9×9 corner. The hard part (a size-keyed recipe) is deferred as LIVE's row without the numbers that define it (§0.1) |
| legacy aliases | CLEAR (`--color-ring` deleted with its only reader; `--ring-ink` is LIVE's one declaration, cited) |
| masked fallbacks | **HIT (minor)**: `band() → null` is a masked default in the chrome floor (§0.2). The `var(…, crayon-blue)` fallbacks were struck from tier 2 (good) |
| unverified gestalt | **HIT (minor)**: p6-2's named payload is not the painted card (§0.7). The frames are labelled in-frame, under PRM, one variable per adjacent pair. I looked at all four. At 16×16 the ring reads as a lopsided pentagon (5.4 u wander on a 53.75 u edge); that look is the owner's to judge on an A-vs-H pair that doesn't exist yet |
| consumer-less substrate | CLEAR (`--ring-ink` ×5, `--focus-offset` ×4) |
| the generic default | CLEAR |
| π it moved and did not declare | **CLEAR on paint** (whole-DOM π with focus, control-vs-control floor, both engines, both themes; the one unclaimed delta sits in the C-v-C floor). **HIT on attribution**: the 16×16 regression is declared but blamed on "no cure here" rather than on the recipe (§0.1) |
| the constraint it forgot | M16 0\|0; filterBudget 9 (built, both engines, light 12/12; the dark four inherited on both trees); AA from painted bytes (G-ABS-5 on the board, G-ABS-3 on the chrome, both reproduced); @property law (0 added, check-property-block 0\|0); undefined-token census (GREEN net); decided history (law 39 NOT moved and re-banked PROPOSED; R3-a unchanged; R1-moved PROPOSED; no r0 row applied; the deck offset left to its owners per chair §1.4). **HIT**: LAWS P5's "the firing default must not lose to the control on the named statistic". It loses at 16×16 and the ballot names it, but the arm that doesn't lose there (H) is unbuilt, and H's own loss (9×9) is unprinted (§0.1). **HIT (minor)**: the README's HEAD deck cell (§0.8) |

## 3 · Strengths

1. **The reproducibility is still the wave's best.** Every lane figure I re-ran matched to the
   third decimal in both engines, on a dist I built whose identity is the README's. The control
   failed 10/10, each for the reason the lane printed.
2. **The pass-5 plant now reds.** The figure clause reads every numeral, guards the splice and
   ships six shape plants plus the one-decimal-opacity plant in-run. Those are pass-5 gaps 1 and 10
   closed at the gate.
3. **The survivor bias is cured on the board.** An unpainted station counts under. X1, X2 and
   faint-ink are in-run negatives on the whole-ring and visibility clauses. The regression is
   written into the product comment as a REGRESSION and truth-gated to ±6 stations.
4. **The hosts are reached.** G-ABS-4 walks the gallery and the armed guard and must reach each
   descendant host. G-ABS-4f is a real forced-colours row that reds the control's CanvasText and
   `rgb(0,0,0)` faces.
5. **Honest measurement of its own refutations.** The deck's larger-offset premise is refuted with
   a sweep, the arm is built (D0) and left PROPOSED per the chair, two false comments are struck,
   the `.live-face-slot` radius claim is corrected against the DOM, and σ is read in the DOM.

## 4 · Ballot rows (U-10), as the owner should receive them

- **The ring token (T9-B8)**, A | B | C, frame p6-1 (lawful: one payload, one variable per adjacent
  pair, labels in-frame):
  - whole ring A 78 | B 0–1 | C 0 of 240;
  - left-side worst A 2.81 / 2.40 | B 3.33 / 3.09 | C 3.57 / 3.30;
  - dark paper at 90 % mass A 0 | B 9–17 | C 3–9 of 60;
  - the chrome costs 0.7–1.0 under B and C, with `.icon-btn` WebKit dark at 2.813.

  Default A per the chair.
- **The geometry, A | H (NEW, owed; not framed)**: 16×16 frame whole ring 78 vs 44 cr / 24 wk; 9×9
  corner 0 vs 66; WebKit left 2.85 / 2.404 vs 3.328 / 3.144. The owner can't rule on the ring's shape
  without this pair.
- **The inset, 0.86 vs 0.90**, frame p6-3: +1.639 vs +1.027 px; whole ring 78 vs 80. This is a
  within-recipe pair and does not stand in for A | H.
- **The deck offset, 3 vs 0**, frame p6-2 (the deck owners'): 23 / 40 % vs 51 / 79 % visible, 0 under
  3 in either; HEAD 88 % light with every visible position under 3, and 63–88 % dark with 59–71 %
  under.
- **Law 39's tab, dashed vs token**, frame p6-4 (the chair's row): worst 1.043 vs 4.009 in chromium
  light; median 6.246 vs 4.188.

## 5 · Cross-pollination

- **MRK-LIVE (pass-7 row 1, RING_GEOMETRY):** take arm H's numbers as the ballot's HEAD arm.
  - The graft's trade is 9×9 corner 66 → 0 against 16×16 frame 44/24 → 78, with the ink held.
  - A size-keyed recipe has to beat both columns.
  - G-ABS-7's witness clause must not travel with the graft.
- **Every chrome-floor gate (CTRL-FACE, CTRL-RULE, CTRL-TAPE, PLR-SELF, the chair's R3):** the
  clip-path plant.
  - A ring painted to zero with its computed outline unchanged passes any gate that drops an
    unbanded stop.
  - An unbanded stop that was reached is RED.
- **The deck owners (GameCard / GameGallery):** D0 is built and priced (51 / 79 % visible, 0 under
  3, 7.59 px of end-card air). The card's payload is its own deal, so state it.
- **§10 (INTAKE row 44):** the painted "i"/"keys" glyph re-read runs on any tree that has the glyph.
  Don't wait for the foot.

## 6 · Incidents (mine)

- My first build failed because the scratch archive lacked `csp-solver/data`: the `sudoku-templates`
  plugin refuses a missing bank. I added it and rebuilt. No reading came from the failed build.
- The chained script's `--grep "G-ABS-(3|4 )"` word-split on the space, and the plant run exited 1
  on a regex SyntaxError before any test ran. I re-ran it with a quoted grep, and only that re-run is
  cited.
- `lint:lanes` first exited 2 on both trees because the scratch archive lacked `.github`, and the
  gate refuses without its workflow. I archived `.github` and re-ran it: 0 | 0. The first reading is
  not cited.
- Vite wrote its bundled-config temp file to the shared `node_modules/.vite-temp/`, which is the
  standard behaviour every lane triggers. Nothing else was written outside `<scratchpad>/crit6-abs/`,
  `<scratchpad>/trash-crit6abs/` and this evidence directory.
