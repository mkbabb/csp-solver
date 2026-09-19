# T9-W7 · pass 3 · PROTOTYPE · CTRL-TABS — the tabbed case

Worktree `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-34`
(branch `master`, base `74a2b5d9`, uncommitted). Prototype server `127.0.0.1:4232`, HEAD control
`127.0.0.1:4233` serving `74a2b5d9` out of a `git archive` checkout (the isolation refuses a second
worktree). Both engines, settle 950 ms. Both servers killed at return.

## The replay — route and what it carried

`git -C <pass-2 worktree>` and `cd <pass-2 worktree>` are both refused by the worktree isolation,
so the replay went the brief's second route: the pass-2 delta was reconstructed against a
`git archive a8fee1f5` baseline and applied file by file. Sixteen files carried:

- **eleven copied wholesale** (pass-2 touched them, the fold did not): `src/assets/index.css`,
  `src/assets/typography.css`, `GameControlPanel.liveRegions.test.ts`, `GameScene.vue`,
  `scene.css`, `GameGallery.vue`, `filterBudget.ts`, `pencilConfig.ts`, `HandDrawnOutline.vue`,
  `gridPaths.ts`, `e2e/access.spec.ts`.
- **five 3-way merged** (the fold's own five): `GameBoard.vue` and `GameControlPanel.test.ts`
  merged clean; `GameControlPanel.vue` was a pass-2 REWRITE (2499 → 2446) that `diff3` mangled to
  214 lines, so it was taken wholesale and the fold's one surviving hunk re-applied by hand
  (`the solver finishes the board` → `finishes the board for you`; pass 2 had already made B1b's
  `candidates` → `what fits` move on its own). `check-copy-register.mjs` resolved **entirely
  toward the fold** — every admission pass 2 was striking the fold had already struck, so the
  file is byte-identical to `74a2b5d9`. `check-font-coverage.mjs` resolved additively: the fold's
  `paperNoteCopy` extractor AND pass 2's `tabWords` / `bareWords` / `guardLines`, with the
  `.zone-row-label` strings taken from the fold.

`vue-tsc --noEmit` exits 0 on the replay and on the finished prototype.

## What pass 3 changed on top of the replay

| # | file | change |
|---|---|---|
| 1 | `GameBoard.vue` | the berth's media key drops `(pointer: coarse)` — it now matches the tongue's own portrait key exactly; `--tongue-tuck: 0.5rem` published beside `--edge-strip-h: 40px`; a duplicate `.board-edge` block (a `diff3` artefact) removed |
| 2 | `DrawerTab.vue` | `top: calc(100% - 0.5rem)` → `top: calc(-1 * var(--tongue-tuck, 0.5rem))` — hung from the berth's TOP |
| 3 | `GameControlPanel.vue` | `.play-controls` portrait: the same cure, same reason |
| 4 | `GameControlPanel.vue` | the desk block re-cut: the flank strip and its `padding-left: calc(3rem + 6px)` / `min-height: var(--strip-len)` lane DELETED; the strip goes on the CASE'S TOP EDGE, `position: absolute; top/left/right: 0; flex-wrap: wrap`, in a berth `padding-top: calc(var(--strip-len, 0px) + 6px)`; `writing-mode: vertical-rl` deleted |
| 5 | `GameControlPanel.vue` | `.action-verbs { contain: inline-size }` and `.keyboard-legend { contain: inline-size }` — the chair's §6.4 as two declarations |
| 6 | `scene.css` | the RAIL PIN DELETED (`inline-size: 324.22px` / `330px` and their two media blocks) |
| 7 | `check-font-coverage.mjs` | one merge-artefact `)` removed; the gate runs and exits 0 |

DERIVED CORRECTION to the spec's §1.2: the case's top edge has no TUCK, it has the drawn form's
6 px SEAM (2 × `TAB_OUTSET`). A berth of `--edge-strip-h` (40 = 48 − 8) on that edge would put the
unraised tabs' feet 14 px inside the lid. The berth is therefore `--strip-len + 6`, measured from
the strip's own `scrollHeight` — which also answers for one row or two without the rule learning
how many words there are. One law (feet on the lid's line), three edges; the board's edge pays a
tuck, the case's edge pays a seam.

## MEASURED — the real surface, both engines, against `74a2b5d9`

### The tuck's closed form — GREEN, exactly, at five portrait cells × two engines

`readings/geometry-both-engines.json`

| cell | tree | berth.h | tongue.top − paper.bottom | tongue.bottom − berth.bottom |
|---|---|---|---|---|
| 390×844 / 375×812 / 430×932 / 360×640 / 412×915 | HEAD | 0.00 | **−6.00** | **+40.00** |
| the same five | proto | **40.00** | **−6.00** | **0.00** |

Identical in chromium and webkit (webkit's `paper.y` differs by 0.32 px; the two differences are
each 0.00). Berth == protrusion. The second half of the closed form was RED at HEAD (+40.00, the
berth being zero) and reads 0.00 here; pass 2's +34 is gone. `390×664` reads the same four numbers
(`readings/cell-390x664.json`).

### The centring arm — GREEN at the gate's two rungs

offCentre = |board centre − viewport centre|:

| cell | HEAD chromium/webkit | proto chromium/webkit |
|---|---|---|
| 390×844 | 11.52 / 11.20 | **1.52 / 1.20** |
| 390×664 | 11.52 / 11.22 | **1.52 / 1.22** |
| 375×812 | 11.52 / 11.22 | 1.52 / 1.22 |
| 430×932 | 11.52 / 11.22 | 1.52 / 1.22 |
| 412×915 | 11.52 / 11.20 | 1.52 / 1.20 |
| 360×640 | 7.11 / 6.80 | 2.89 / 3.20 |

The gate's two named rungs are ≤ 2 px in both engines. **The spec's HEAD figures do not
reproduce**: it cites 19.27 chromium / 19.58 webkit; the control at `74a2b5d9` reads 11.52 / 11.20.
Reported, not reconciled.

### The board's y — **−10.00, not +20.00. The spec's sign and magnitude are both wrong.**

`paper.y` proto − HEAD = **−10.00 at every portrait cell, both engines** (390×844 250.52 → 240.52;
webkit 250.20 → 240.20). The spec declared +20.00 (half of the berth's 40 into a centred block).
The berth does add 40 to flow, but the card's own content fell 595 → 246 in the same tree, and the
centred block nets **10 px UP**. The declaration to carry forward is −10.00, measured, and the
centring arm improves because of it.

### The desk band — RED, mechanism named, the pin refused and not rebuilt

`readings/desk-band-after-containment.json`

| cell | HEAD card.w | proto card.w | Δw | Δ board.x |
|---|---|---|---|---|
| 1024×800 | 296.00 | 296.00 | **0.00** | **0.00** |
| 1280×800 | 324.22 | 328.53 | +4.31 | −2.16 |
| 1360×900 | 327.09 | 331.84 | +4.75 | −2.37 |
| 1440×900 | 330.00 | 335.14 | +5.14 | −2.58 |
| 1600×900 | 335.47 | 341.73 | +6.26 | −3.14 |

webkit within 0.16 px of chromium at every rung. Before the two containments the same band read
Δw **+56.09 / +53.61 / +51.36 / +47.36** and Δ board.x **−28.05 / −26.81 / −25.69 / −23.69**.

**The strip contributes 0.00.** In-page ablation at 1280×800 (`instruments/ablate.mjs`):
`.tab-strip { display: none }` moves the card **not at all** (380.31 → 380.31). Out of flow it has
no intrinsic width — which is the whole reason the rail pin could be deleted rather than re-derived.

**What is left is prose.** The binding max-content is `p.tray-note`: containing it takes the card
1280 → 171.22, so nothing else is near it. The card's desk width is set by its longest sentence in
BOTH trees, and the prototype's longest is 4.31 px wider than HEAD's at 1280. That is not curable
by containment and must not be cured by editing copy to hit a golden. **The fork for the chair:**
either the card's width becomes a derived W2 token, or §6.4's one reviewed re-mint takes the two
goldens at the wave's fold. The pin is withdrawn as an ask and is not rebuilt.

`tabsOverBoard = 0` at all five rungs, both engines — but measured at REST only; the glide was
not sampled (gap).

### The scroll law — GREEN at every cell measured, and the spec's boundary is wrong

`scrollHeight === clientHeight` on `.controls-card`:

| cell | HEAD sh/ch (overflow) | proto sh/ch (overflow) |
|---|---|---|
| 844×390 | 642/302 (+340) | **259/259 (0)** |
| 812×375 | 641/287 (+354) | **259/259 (0)** |
| 900×500 | 642/284 (+358) | **259/259 (0)** |
| 360×560 | 595/344 (+251) | **246/246 (0)** |
| 360×500 | 595/284 (+311) | **246/246 (0)** |
| 390×844, 375×812, 430×932 | 595/595 (0) | **246/246 (0)** |
| 360×640 | 595/424 (+171) | **246/246 (0)** |

`vh − clientHeight` = 216.00 portrait / 88.00 landscape reproduce exactly (360×500: 500 − 284 at
HEAD; 844×390: 390 − 302). **The spec's "overflow by exactly 20 ± 1 at 360×500" is REFUTED**: the
derived boundary is `content ≤ vh − 216`, the measured content is **246.36**, not the spec's 304,
so 360×500 (284 available) fits with 37.64 to spare and the prototype overflows nowhere the wave
measures. Landscape clientHeight reads 302 at 844×390 and 287 at 812×375 as the spec says.

### AX / strip census — GREEN

`role="tablist"` = 1 · `role="log"` = **1 with the tray down** (0 on the pass-2 tree) · tabs 4
phone / 5 desk · **0 tabs under 44 px in either dimension** at all 13 cells × 2 engines ·
`.tab.is-raised::after` computes **`content: "none"`** everywhere (the patch is dead) ·
9 document headings on the phone, 10 at the desk: `H1 sudoku` + `H2` per tab word
(`new game`, `pencils`, `checking`, `players`, `keys` desk) + `H3 Size · Level · marks · what fits`.

### The gates that ran bare

- `vue-tsc --noEmit` — **0**.
- `check-copy-register.mjs` — **0** em/en dashes, **0** unadmitted jargon, **0 admitted**, lexicon
  25, 137 files. M16 = 0.
- `check-font-coverage.mjs` — **0**. Patrick Hand 46 codepoints / 32 declared strings over 5
  derived groups; `keep` and `peek` derived from `BARE_WORD`, the tab words from `TAB_WORD`.
- `vitest run src/games/shared src/pencil` — **492 passed, 10 failed, 42 files (1 failed)**. All
  ten are in `GameControlPanel.test.ts` and all ten name a RETIRED surface (`.tray-well` ×2,
  `.washi-tag` census, `.mobile-heading-row`/`.mobile-heading-btn`, `.section-heading` ×4,
  `.zone-hint` count 4 vs 2, `#keys-fold` + `.info-btn` ×2). They are the spec's plan item 10 —
  the 22 re-aimed bodies — and they were **not done**. The pass's largest gap.

## Crops (3 cited, 114 KB total, all ≤ 47 KB)

1. `frames/f1-390x844-dark-pencils-raised.png` — dark, sheet up, the raised tab running into its
   tray, the floor one piece.
2. `frames/f2-390x844-light-board-edge-{proto,head}.png` — the board's bottom edge: the tongue
   tucked −6.00 in a 40 px berth beside HEAD's same tongue over a zero berth. The three play
   tools are not in frame: `.play-controls` is `(pointer: coarse)`-gated and the emulated
   portrait context has no touch.
3. `frames/f3-1280x800-light-desk-top-edge-{proto,head}.png` — the five tabs on the case's top
   edge beside the HEAD control.

**Frame 3 shows a defect the numbers could not.** The strip wraps to two rows
(`new game · pencils · checking` / `players · keys`) and the raised tab is in the FIRST row, so its
omitted bottom edge opens into the gap between rows rather than into the tray, while the lid's hole
sits under a second-row tab. "The raised one runs into its tray by geometry" holds only when the
raised tab is in the strip's LAST row. Named, not cured.

## Gaps — everything not done, said plainly

1. **The ten stale unit bodies** (above). Not re-aimed. The battery is RED.
2. **The built dist** — no `npx vite build`, no preview, so `filter-census` 12/12, both union arms
   (`row` 45572 / `coarse` 5702), the `url(#` in `.tray[inert]` row and the goldens 4/4 were NOT
   re-derived. `filterBudget.ts` still carries pass 2's DEV-server caveat verbatim; the L1
   proposed diff and its firing negative control were not written.
3. **The join's four unit gates** (`openRing` / `generateRectBoilFrames`: no `Z`, no point inside
   `[x0,x1]`, each fallback's closed ring, `radius !== 0` THROWS) — not written. The browser half
   is half-done: `::after` = none is measured; the open feet within 2.5 of the lid's line is not.
4. **Contrast** — the guard's 4.99 / 6.30, stroke 1.5/2.5, density ≥ 1.5×, armed + hovered ≥ 4.5
   with the `.act-face` fence: not measured. The one-dimming row and its 2.75:1 negative control:
   not measured.
5. **The `confirmWindowMs` LAPSE row**, the press-count row, and W2 §2.2's reachability assertion
   at 844×390 / 812×375 (the tongue is present and 48×92 at both, from the geometry probe, but the
   cued-path probe itself was not run).
6. **The glide** — the desk band was sampled at rest only; no frame-by-frame sweep of a tab switch.
7. **r0 instruments** — the hue census (29), the accent-kinship probe, the R6 law-probes (L1′, L3,
   L5, R3) and the gallery π were NOT copied and re-run. R7's I2 / I3 / I4 were not run.
8. **The ballot** — `#fold-tools` and the sticky tag's four terms are UNTOUCHED; the declared
   fallback is what stands (the board's edge strip duplicates the acts, `#fold-tools` stays), which
   is what the brief asked to be built first. The ballot's two frames were not written up.
9. **`--strip-len` is still named for the flank.** It now measures a horizontal strip's height. The
   name survives the move but reads oddly; a rename belongs to the fold, not to a prototype.
