# MOT-VERB pass 2 — THE SWEEP, DECLARATION BY DECLARATION

Charter item 1. Every changed `transition:`/`animation:` in the pass-1 diff, with its old and
new **resolved** ms and curve. Derived by `probe/sweep-tabulate.mjs` from
`git -C .claude/worktrees/wf_e58b4764-0fc-52 diff` (nothing written to any tree), with the
multi-line declarations the pairer could not align read by hand out of the same diff and marked
`†`. Curve points: HEAD's `--ease-*` ledger is `src/assets/index.css:349-358` on the main tree;
the new side is the published block (`--rung-*` 520/440/280/250/200/150,
`--verb-layDown/slide-ease` = glass `(0.32,0.72,0,1)`, `--verb-lift/rubOut-ease` =
`(0.32,0,0.67,0)`, `--verb-writeIn-ease` = `(0.22,1,0.36,1)`, `--verb-dusk-*` = `ease`/350ms).
Curve deltas are `readings/curve-deltas-p2.txt`.

Line numbers are the PROTOTYPE's. **D** = the five surfaces the record declares (gallery,
drawer, dusk/toggle, margin note, hover rows). A blank D column is paint the record moved and
did not name.

| # | site | D | old dur · delay | new dur · delay | Δ | old curve | new curve | max\|Δp\| |
|---|---|---|---|---|---|---|---|---|
| 1 | `assets/index.css:637` `.solve-success .grid-line` stroke | | 500 | 520 page | +20 | (none → UA `ease`) | layDown | 0.375 |
| 2 | `assets/index.css:655` `.solve-success` box-shadow | | 500 | 520 page | +20 | (none → UA `ease`) | layDown | 0.375 |
| 3 | `assets/index.css:716` `html.theme-turning` bg + color † | D | 350 ×2 | 350 dusk-ms ×2 | 0 | `ease` ×2 | dusk (= `ease`) | 0.000 |
| 4 | `App.vue:1155` `.gallery-fade-leave-active` opacity | D | 200 | 200 breath | 0 | glassGlide | **lift** | **0.852** |
| 5 | `CaretOverlay.vue:64` opacity | | 200 | 200 breath | 0 | fadeOut | lift | 0.000 |
| 6 | `DrawerTab.vue:144` tongue transform | D | 150 | 150 touch | 0 | `ease-out` | layDown | 0.406 |
| 7 | `GameBoard.vue:1265` opacity | | 200 | 200 breath | 0 | fadeOut | lift | 0.000 |
| 8 | `GameControlPanel.vue:1724` `.player-row.is-arriving` | | 320 | **280** sheet | −40 | glassGlide | layDown | 0.000 |
| 9 | `GameControlPanel.vue:1728` `.is-arriving .player-name` † | | 380 · 140 | **250** mark · **150** touch | −130 · +10 | drawOn | writeIn | 0.189 |
| 10 | `GameControlPanel.vue:1736` `.player-row.is-returning` | | 280 | 280 sheet | 0 | glassGlide | layDown | 0.000 |
| 11 | `GameControlPanel.vue:1740` `.is-returning .player-name` † | | 320 · 120 | **250** mark · **150** touch | −70 · +30 | drawOn | writeIn | 0.189 |
| 12 | `GameControlPanel.vue:1746` `.player-row.is-leaving` † | | 320 · 420 | **250** mark · **440** step | −70 · +20 | glassGlide | **lift** | **0.852** |
| 13 | `GameControlPanel.vue:1752` `.is-leaving .player-name` † | | 260 · 260 | 250 mark · 250 mark | −10 · −10 | standard | layDown | 0.548 |
| 14 | `GameControlPanel.vue:1814` `.players-leave` color | D | 150 | 150 touch | 0 | standard | layDown | 0.548 |
| 15 | `GameControlPanel.vue:1961` `.icon-btn` bg + color † | D | 150 ×2 | 150 touch ×2 | 0 | (none → UA `ease`) ×2 | layDown | 0.375 |
| 16 | `GameControlPanel.vue:2087` `.sparkle-icon` † | | **`all`** 200 | filter + transform, 250 mark | +50, set narrowed | (none → UA `ease`) | layDown | 0.375 |
| 17 | `GameControlPanel.vue:2138` `.action-bar::before` opacity | | 150 | 150 touch | 0 | (none → UA `ease`) | layDown | 0.375 |
| 18 | `GameControlPanel.vue:2458` `.share-pop` | | 500 | 520 page | +20 | `ease` | layDown | 0.375 |
| 19 | `GameControlPanel.vue:2479` `.eraser-scrub` | | 400 | 440 step | +40 | `ease` | slide (glass) | 0.375 |
| 20 | `SolverErrorNote.vue:63` `note-in` | | 250 | 250 mark | 0 | noteWrite | writeIn | 0.000 |
| 21 | `SolverErrorNote.vue:97` background | | 150 | 150 touch | 0 | (none → UA `ease`) | layDown | 0.375 |
| 22 | `gameCell.css:35` `.pencil-marks` marks-fade-in | | 250 | 250 mark | 0 | `ease-out` | layDown | 0.406 |
| 23 | `gameCell.css:154` `.cell-because` marks-fade-in | | 250 | 250 mark | 0 | `ease-out` | layDown | 0.406 |
| 24 | `gameCell.css:239` ghost-draw-on (pointer tier) | | 180 | **200** breath | +20 | ghostDraw | writeIn | 0.167 |
| 25 | `gameCell.css:257` ghost-draw-on (focus-visible tier) | | 180 | **200** breath | +20 | ghostDraw | writeIn | 0.167 |
| 26 | `scene.css:378` `.controls-card::before` opacity | | 150 | 150 touch | 0 | (none → UA `ease`) | layDown | 0.375 |
| 27 | `scene.css:612` `.scene-controls` controls-fade-in † | D | 250 · 150 | 250 mark · 150 touch | 0 | drawOn | writeIn | 0.189 |
| 28 | `scene.css:618` `.scene-leaving .scene-controls` | D | 200 | 200 breath | 0 | fadeOut | lift | 0.000 |
| 29 | `scene.css:630` `html.gallery-leaving .scene-controls` | D | 200 | 200 breath | 0 | fadeOut | lift | 0.000 |
| 30 | `ThermoTube.vue:114` opacity | | 200 | 200 breath | 0 | fadeOut | lift | 0.000 |
| 31 | `DarkModeToggle.vue:717` `.sun-moon-toggle` transform | D | 200 | **250** mark | +50 | `ease` | layDown | 0.375 |
| 32 | `DarkModeToggle.vue:774` `.toggle-icon:not(.is-active)` | D | 100 · 240 | **150** touch · **250** mark | +50 · +10 | standard | **lift** | **0.663** |
| 33 | `DarkModeToggle.vue:780` `.toggle-icon.is-active` | D | 300 · **60** | **280** sheet · **150** touch | −20 · **+90** | standard | layDown | 0.548 |
| 34 | `DarkModeToggle.vue:795` `.toggle-icon .warp` wring-down | D | 340 | **250** mark | −90 | accelIn | lift | 0.032 |
| 35 | `DarkModeToggle.vue:874` star/dot tuck-out scale † | D | 150 | 150 touch | 0 | `ease-in` | lift | 0.214 |
| 36 | `DarkModeToggle.vue:875` star/dot tuck-out opacity † | D | 100 | **150** touch | +50 | `ease-in` | lift | 0.214 |
| 37 | `DarkModeToggle.vue:883` star ARRIVAL scale † | D | 150 · **560** | 150 touch · **520** page | 0 · **−40** | anticipatePop | **lift** | **0.749** |
| 38 | `DarkModeToggle.vue:884` star ARRIVAL opacity † | D | 120 · **560** | **150** touch · **520** page | +30 · **−40** | `ease-out` | **lift** | **0.569** |
| 39 | `CrayonHeart.vue:329` `.face` opacity | D | 240 | **250** mark | +10 | `ease` | layDown | 0.375 |
| 40 | `CompletionVignette.vue:133` voice + meta ink-write-in | | 250 | 250 mark | 0 | noteWrite | writeIn | 0.000 |
| 41 | `GameCard.vue:593` `.game-card-range` color | | 150 | 150 touch | 0 | standard | layDown | 0.548 |
| 42 | `GameGallery.vue:1320` `.gallery-pip` background-color | | 200 | **250** mark | +50 | standard | layDown | 0.548 |
| 43 | `GameGallery.vue:1421` deal-btn bg + color † | | 150 ×2 | 150 touch ×2 | 0 | standard ×2 | layDown | 0.548 |
| 44 | `GameGallery.vue:1473` guard ribbon transform + opacity † | | 240 ×2 | **250** mark ×2 | +10 | glassGlide ×2 | layDown (= glass) | 0.000 |
| 45 | `HandwrittenLogo.vue:647` `.logo-caret` transform | | 200 | 200 breath | 0 | noteWrite | writeIn | 0.000 |
| 46 | `MarginNote.vue:149` ink-write-in | D | 250 | 250 mark | 0 | noteWrite | writeIn | 0.000 |
| 47 | `MarginNote.vue:163` **NEW** `.is-rubbing-out` | D | — | 200 breath | new | — | rubOut | — |
| 48 | `MarginNote.vue:194` meta ink-write-in | D | 250 | 250 mark | 0 | noteWrite | writeIn | 0.000 |
| 49 | `AnswerKeyLaminate.vue:225` lift-away opacity + transform † | | 200 ×2 | 200 breath ×2 | 0 | accelIn ×2 | lift | 0.032 |
| 50 | `AnswerKeyLaminate.vue:237` lay-down opacity + transform † | | 280 ×2 | 280 sheet ×2 | 0 | glassGlide ×2 | layDown (= glass) | 0.000 |
| 51 | `AttributionCard.vue:184` opacity + transform + visibility-delay † | | 150 ×2 · 150 | 150 touch ×2 · 150 touch | 0 | standard ×2 | layDown | 0.548 |
| 52 | `AttributionCard.vue:206` opacity + transform † | | 150 ×2 | 150 touch ×2 | 0 | standard ×2 | layDown | 0.548 |
| 53 | `HandDrawnGrid.vue:589` progress trace stroke-dashoffset † | | 240 | **250** mark | +10 | `ease` | writeIn | 0.380 |
| 54 | `HandDrawnGrid.vue:590` progress trace opacity † | | 500 | **520** page | +20 | `ease` | layDown | 0.375 |
| 55 | `SheetWashiLabel.vue:109` opacity | D | 150 | 150 touch | 0 | (none → UA `ease`) | layDown | 0.375 |

Script land, same diff, not in the table above (no CSS declaration):

| site | old | new |
|---|---|---|
| `App.vue:376` fold | `useFlipGlide({durationMs: MOTION.boardFoldMs})` | `spend("turn","page")` → 520 + glass, **unchanged values** |
| `useControlsDrawer.ts:86` | `GLIDE_MS = 520` + primitive's default easing | `spend("turn","page")` → identical |
| `useCarouselGlide.ts:331` | 440 + `MOTION.curves.drawerGlide` | `spend("slide","step")` → identical |
| `App.vue:461` | — | `if (animKey(a) === "") continue;` (the I1 cure) |

## The counts

- **55 declarations changed** (54 edited, 1 new). The record declares **two** visible retimes.
- **DURATION moved on 22 of them** (rows 1, 2, 8, 9, 11, 12, 13, 16, 18, 19, 24, 25, 31, 32,
  33, 34, 36, 38, 39, 42, 44, 53, 54). Range −130 ms (row 9) to +90 ms (row 33's delay).
- **DELAY re-spelled on 10 terms across 7 declarations; MOVED on 8** (rows 9 +10, 11 +30,
  12 +20, 13 −10, 32 +10, 33 **+90**, 37 **−40**, 38 **−40**).
- **CURVE moved on 43 declarations**, 13 distinct substitutions. Largest: **glass → lift,
  max |Δprogress| 0.852 at t=0.40, ΔAUC −0.560** (rows 4 and 12). Pass 1 banked 0.749 as the
  maximum; it did not cost glass→lift, standard→lift (0.663), ease-out→lift (0.569) or
  ease→writeIn (0.380).
- **32 of the 55 are outside the five declared surfaces.**
- At a mid-gesture frame the two curves read `glass 0.955` vs `lift 0.128`: a player row leaving
  the well is **7.5× less far along at its own midpoint** than it was.
