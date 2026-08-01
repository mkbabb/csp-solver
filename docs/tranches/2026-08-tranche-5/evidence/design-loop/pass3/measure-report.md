# MEASURE — stage report, pass 3

Record of record: **`measure/RESULTS.md`** (this file is its verdict sheet). Raw under
`measure/out/`, `measure/gates-*.log`, `perf-rig/runs/m3-*`, `stall/runs/m3-*`. Shots:
`measure/shots/` (64) + `measure/shots-sim/` (5), indexed by `measure/contact-sheet.html`.

**Single tree.** MAIN `5873a920`, one build (`index-DTLxUr3ZTp-8.js`, byte-hash-identical to
F3's `dist-F3head`), one run of everything, after the last edit of the pass. **BASE is
`6800af04`** — the sealed P1 patch — so every delta below is the WHOLE pass-3 design delta, not a
stage's own. Nothing committed, pushed, or deployed; tree clean at exit. `:4894`/`:4895` alive
and untouched; :4896 served the sim per the ballot-server pattern and was stopped; :4188 was
verified free, used, and killed.

| stage | its own threshold | verdict |
|---|---|---|
| **estate** | vue-tsc 0 · vitest · e2e default · built-dist lane · census + theme-bake green, budget unmoved | **GREEN** — 0 · **332/31** · **101/101** · **14/14** · budget unmoved |
| **C** coarse-regime gates | −33px at every coarse cell, regime asserted | **PART** — 390×844 **−32.55/−32.49 GREEN**; **375×812 −11.23 RED** (banked −32.57); **1280×800 coarse +36.80 RED, sign inverted** (banked −27.89). Both attributed to `a2865f29` by serving B's and A's closes side by side |
| **C** rank/floor/announce | 7 names at 3 ranks · 2 eyebrows · 44px · 0 unannounced | **GREEN** on all four, both engines |
| **B** chip separation | ≥6px, both axes | **GREEN — 7.19px** at every cell, both engines, base 4.00/0.00; **7.19 confirmed on real MobileSafari** |
| **B** idle long-frames vs base | no regression | **GREEN — 0/0/0 both arms**, promoted layers **8 = 8**, Δfps +0.17 |
| **B** ink dominance | the recut table, washi included | **GREEN as a refutation** — Deal **8th of 13 by mass**; F1's 1.52–1.54× does not reproduce; die out-inks its eyebrow by density |
| **A** rendered filter census | zero new surfaces, area growth ≤0 | **GREEN — 17/17 gallery, 9/9 board, area Δ exactly 0**, control fires in all 8 cells |
| **A** staging band cells | sibling of listbox, 8 tab stops, 44px, marked verb | **GREEN** 6/6 cells; `deal` carries the die, `resume` carries no mark |
| **D** `.deal-btn` | die square + no wrapper/card growth | **GREEN** — die 17.63→**28×28**, wrapper and card box **unchanged**, **+10px scroll**, both engines, both regimes |
| **D** AA rows | 4 rungs, both themes, falsifiable self-test | **GREEN** — ladder strictly increasing; sabotaged `sources()` **reds the self-test**, repo untouched |
| **F3** co-visibility stack | board + first control, one screen | **GREEN** — 390×664 **1.800→1.705**, band 51→21, board→Deal **285.34→229.56 on glass**; landscape board fits (3.895→2.533); whole stack **1.705 vh, not claimable** |
| **F3** sheet detents | — | **GREEN by construction** — zero detent/drag-sheet/vaul in `src/` or `e2e/` |
| **F3** keyboard coexistence | 296px band, Deal clears | **NOT MEASURED** — the sim's soft keypad would not rise (vv **699→699**, both builds, four probe shapes incl. pass 2's verbatim); **the fixed-tray control is vacuous this session (0% occluded)** |
| **sim battery** ×5 | nothing regresses the sealed numbers | **PASS** — idle **59.25 ≥59** · gallery **50.51 ≥49** · theme **53.41 ≥45**; worst Δ vs base **−0.56 fps** against a ±2.5 law; device census `filter` 17=17, `will-change` 39=39 |
| **goldens** | nothing re-baselined | `logo-light` reds **identically on base and head** (3948 px, ratio 0.03, 3/3 each); other three pass 6/6. **Nothing re-baselined** |

**Red, verbatim, in the order's own words:**

- `coarse-375x812  panelH 590.84 -> 579.61  Δ=-11.23` (Lane C banked **−32.57**)
- `coarse-1280x800 panelH 1098.25 -> 1135.05 Δ=+36.80` (Lane C banked **−27.89**; head is now
  **taller than the P1-sealed base**)
- `keypadRose: false · keypadBandPx: 0 · trayOccludedPct: 0` — the F3 keyboard cell and its own
  negative control, both builds
- `logo-light ✘ 3948 pixels (ratio 0.03) — on BASE 6800af04 as well as on HEAD, 3/3 runs each`

**Routed:** the 375/1280 pair to the adjudicator with both sides priced (7.19px of separation
bought at 21.34px and 64.69px of card height); the keypad to the owner/team-lead rig row — the
third mandated device cell in three passes foreclosed by the rig rather than the tree; the golden
to the standing traps ledger, with the correction that on darwin it is **not** non-deterministic —
it is off its baseline on the seal.
