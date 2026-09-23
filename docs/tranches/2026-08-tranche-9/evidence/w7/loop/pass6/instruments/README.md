# pass6/instruments — the ONE copy of each instrument every pass-6 lane runs

The chair's instruments lane (Opus, batch 0; pass6/CHAIR-RULINGS §1.3, registry-v5 §8 act 3), 2026-09-23.
Every instrument here was run with its negative control in the same batch. The exit codes below are
bare (unpiped). Scratch trees are `git archive 74a2b5d9` (web/frontend, .github, csp-solver/data) with
the pass-5 banks applied `--3way`. They live under `<scratchpad>/instr-*`, and the chair cleans them.
No lane worktree and no main `src/e2e/scripts` file was written. The control tree was served with
its own `.vite-control.config.ts` and never git-touched. `logs/` holds the classified readings,
about 25 KB of text in total, with no PNGs and no raw JSON.

| # | instrument (this dir) | from | what changed |
|---|---|---|---|
| 1 | `check-property-block.mjs` | registry-v5 §2.13 (no critic file; new) | five clauses + C6 (well-formed, PROPOSED), a plant per clause in `--self-test`, served-CSS read + `--served` stamp |
| 2 | `undefined-token-census.mjs` · `plant-k.sh` · `plantk.spec.ts` | `pass5/prototype/MOT-VERB/instruments/undefined-token-census.copy.mjs`; `critique/MOT-VERB/instruments/plant-mask.sh`, `plantk.spec.ts` | scoped-root + tailed-root (+ conditional at-rule) holes cured; controls 7–10 (S1/S2/S3/S4, 3 negative-negatives, @media); self-test made tree-agnostic; Plant K parameterised |
| 3 | `rate-clock.ts` · `front-rate-60hz.spec.ts` | `critique/ACC-FIVE/instruments/front-rate-60hz.CRITIC.spec.ts` | CLOCK=60 (the critic's shim) / driven 125 Hz / native; a ≥93.75 Hz clock PRECONDITION on every rate row |
| 4 | `l5b.mjs` · `l5b.plants.mjs` · `l5b.law-probe.PROPOSED.diff` | `critique/PLR-SELF/instruments/l5b.mjs` | keyed on EVERY consumer site (HeadSheet's rules, every hook passed on `<HeadSheet …>`, its utility classes, any `top:100%` sheet); R3's third-re-cut edge set; plants A–H |
| 5 | `band.crit.ts` · `band-stat.mjs` · `band-lib.ts` | `critique/ACC-GRAPHITE/instruments/band.crit.ts` + `lib.ts` | STAMPED: ink = board p0.5, paper p95, α50, both crossings interpolated with a CORRECTED formula, one capture (DPR 1) for numerator and denominator; band = lower side; GATE=1 asserts G2 |
| 6 | `viewport-law-2.6-settle.diff` · `…on-RULE.diff` · `…plants.ts` · `sticky-ladder.mjs` | `pass5/prototype/CTRL-TAPE/instruments/PROPOSED-viewport-law-2.6-settle.carried-from-pass4.diff`, `p5-sticky.mjs`; `critique/CTRL-TAPE/instruments/sticky.mjs` | an applyable settle; the lag is counted and bounded (≤ 2 frames); the subject is named once so RULE's re-aim is four constants |
| + | `lint-sleep-getAttribute.PROPOSED.diff` | CHAIR-RULINGS §1.3 (PLR-PLACE's critic) | `getAttribute` in LIVE_CALL + a RED and a GREEN fixture |

## 1 · check-property-block.mjs

`node check-property-block.mjs --fe <web/frontend> [--dist <dist>] [--served <url>] [--self-test]`.
Exit codes: 0 GREEN, 1 RED, 2 when a self-test plant does not red.

| tree | reading | exit |
|---|---|---|
| 74a2b5d9 + CTRL-FACE + MOT-VERB (`<scratchpad>/instr-prop`; 2 conflicts resolved by hand: `GameControlPanel.vue` headingClass, `OptionSelector.vue` class) | source 26 registrations / 20 names: **C1 ×6** (every rung 2×, index.css:271–296 FACE and :619–644 LADDER) + **C2** (2 blocks) | **1** |
| same, served dist | 70 registrations, 0 duplicates. **The minifier dedups the served CSS**: the index css hash is identical before and after the hand-dedup (`index-D4NMIwD6JAQl.css`), so the served clause alone cannot see the collision. The source clause is the gate | (in the run above) |
| the triple: the same + VERB's BANK-arm nested `:root {}` copy planted | C1: 7 names 3×; C2: 3 blocks; C3: 7 nested | **1** (15 breaches) |
| hand-dedup (FACE's six rungs deleted; LADDER's seven + `--live-fit` seated beside FACE's twelve lengths, one block of 20; `logs/prop-faceverb-hand-dedup.diff`) + dist + `--served :4230` (`index-C1Lgu2bGlyg1.js`) + self-test | GREEN; plants C1–C6 each RED; the lawful in-block addition green | **0** |
| file plants on the dedup tree (`logs/prop-2-file-plants.txt`) | clean 0 · C1 second home (MarginNote `<style>`) 1 · C2 split 1 · C3 `@media` 1 · C4 `pencilConfig.ts` emitter 1 · C5 `inherits: false` 1 · C6 no `syntax` 1 · clean-after 0 | as listed |
| control 74a2b5d9 (+ its dist, + self-test on a synthetic rung) | 0 source, 42 served (Tailwind's), 0 dup | **0** |
| control dist read against the `:4230` server (the stamp plant) | `STAMP … serves index-C1Lgu2bGlyg1.js, the dist read is index-CubiZsMVSwTc.js` | **1** |
| real banks, source only | NOTE-LEDGER **1** (C4 `motionRungs.ts:26`, the emitter the rehearsal names) · NOTE-ERASE 0 (7, one block) · CTRL-FACE 0 (18) · MOT-LADDER `pass5-ladder.diff` 0 (8) | as listed |

The chair expected a TRIPLE on FACE + VERB. The chair's `MOT-VERB/pass5.diff` is the LIVE §13 tree,
where VERB registers once, so FACE + VERB reads ×2. The ×3 is the bank arm's nested copy, and the
planted triple reproduces it.

## 2 · the undefined-token census (cured) and Plant K

`FE=<web/frontend> node undefined-token-census.mjs --self-test`.

| run | pass-5 copy | pass-6 copy |
|---|---|---|
| clean §13 tree (74a2b5d9 + MOT-VERB) | 0 | **0** (0 conditional-only tokens; 7 tailed/at-rule tokens all have a bare-root twin) |
| **S1**: `:root { --critic-ghost-ms }` inside MarginNote's `<style scoped>`, consumed in SolverErrorNote's animation slot | **0** (the hole) | **1**: `SolverErrorNote.vue:65 --critic-ghost-ms (declared by a scoped root in: pencil/chrome/MarginNote.vue — dead)` |
| **S2**: declared only on `html.theme-turning` in index.css | **0** (the hole) | **1**: `(declared only under: assets/index.css .theme-turning)` |
| the negative-negative: the same token on the bare `:root` | 0 | **0** |
| self-test, §13 tree | — | **0**: controls 1–6 and 7 S1 · 7b S4 · 7c S3 · 7d `:global(:root)` green · 8 S2 · 8b same-class consumer green · 8c tail + bare root green · 9 `@media`-only root RED, all as required |
| self-test, FACE × VERB | — | **0** |
| self-test, control 74a2b5d9 | the pass-5 copy's controls FAIL there (anchored on §13's bytes) | every control passes; **exit 1** from ONE `STALE --refuse-dur` ledger row, the inherited row PLR-PLACE's critic read on the control too |

Plant K (`plant-k.sh <tree> <scratch> <build.mts>`, then `plantk.spec.ts` with TREE_URL and PLANT_URL):
on the §13 tree the clean dist `index-DWMUHdQr1EaZ.js` paints **6.5 %** dark and the planted
`index-CgRNrC725-Uu.js` paints **99.7 %**, in both engines. The spec passed 2/2 (exit 0), so the plant
is visible in paint. The payload is the golden pinned-givens codec, which is why the clean arm differs
from the critic's 11.3 %.

## 3 · the 60 Hz negative control for any rate row (G10)

The tree is 74a2b5d9 + ACC-FIVE. The gated arm keeps `FRONT_MIN_MS = 16` (:4233) and the ablated arm
sets it to 0 (:4234). Both arms run on dev servers, since `?wire=local` is DEV-only.
`BASE=… CLOCK=60|driven|native [PRECOND=0] npx playwright test …/front-rate-60hz.spec.ts`.

| engine | tree | driven 125 Hz | 60 Hz shim | 60 Hz, PRECOND=0 (the critic's arm) | native |
|---|---|---|---|---|---|
| chromium | gated | **0** (51.1/51.1/50.4 per s; clock 126.6 Hz) | **1** (clock 62.5 Hz < 93.75) | 0 | 0 (53.9/47.4/48.6; 128.2 Hz) |
| chromium | ablated | **1** (124.9/127.5/124.5) | **1** (clock 61.3 Hz) | **0 (59.0/61.4/59.9, the hole reproduced)** | 1 (132.8/135.7/134.0) |
| webkit | gated | **0** (55.6/57.2/53.7; 125.0 Hz) | **1** (52.6 Hz) | 0 | 0 (51.4/50.7/50.0; 100.0 Hz) |
| webkit | ablated | **1** (125.6/121.5/125.2) | **1** (52.6 Hz) | **0 (60.3/61.4/61.5)** | 1 (97.8/103.4/98.2) |

The driven clock is the default. A rate row ships beside the CLOCK=60 run, which must red by the
precondition, and the CLOCK=driven run on its own ablation, which must red by the rate.

## 4 · L5b at every consumer site (PROPOSED for r0's probe; the chair lands it)

`node l5b.mjs <web/frontend>` returns 0 GREEN or 1 RED. `node l5b.plants.mjs <web/frontend>` returns 0 when the clean tree is green and every plant reds.

| run | pass-5 PROPOSED body | pass-6 l5b |
|---|---|---|
| PLR-SELF tree (`w7-p4-PLR-SELF`, read-only) | GREEN (1 rule) | **GREEN**, 7 sheet sites (`.hover-card`, `::before`, HeadSheet ×4, `.player-lobby`), exit 0 |
| control 74a2b5d9 | RED | **RED** (`.hover-card` border 2px, no drawn edge), exit 1 |
| **A**: the pass-4 border on AttributionCard `.hover-card` (file copy) | **GREEN** (the hole) | **RED**, exit 1 |
| **B**: the same on PlayerLobby `.player-lobby` (the pass-4 site) | **GREEN** (the hole) | **RED**, exit 1 |
| C–H (in memory): HandDrawnOutline deleted · Tailwind `border` on `<HeadSheet class>` · `border-block-start` on `.player-lobby.is-open` · `box-shadow: 0 0 0 2px` on `.head-sheet` · a border on `[data-lobby]` · a gradient on `.hover-card` | — | all **RED** (plants runner exit 0) |
| PROPOSED probe (`l5b.law-probe.PROPOSED.diff`, which imports `l5b.mjs`) on main / control / PLR-SELF | — | exit 0 / 0 / 0. L5b reads RED/RED/**GREEN** (born-RED, "4 born-RED (3 still red)" on PLR-SELF); every other row is unchanged |

## 5 · G2's stamped instrument

`node band-stat.mjs --self-test` is the math. `GATE=1 OUTDIR=… TREE_URL=… CONTROL_URL=… npx playwright test band.crit.ts` is the row.

- **The pass-5 crossing formula is wrong.** It computed `e − a + fa + fe`, where fa and fe are the
  above-threshold fractions of the two outside pixels. The geometric width is
  `e − a + 2 − fa − fe`. On 42 synthetic box-integrated bars of known width, the stamped form errs
  ≤ **0.169 px**, the pass-5 form up to **2.000 px**, and the integer count ≤ 1.000 px
  (self-test exit 0). The critic's sub-pixel frame of 6.45 / 3.457 reproduces EXACTLY under the pass-5 form on these bytes, so those
  numbers are the formula's, not the frame's.
- **The stamped reading** (tree = 74a2b5d9 + ACC-GRAPHITE, `index-CelsBcwyiLkj.js`; control
  `index-CubiZsMVSwTc.js`; `mintBoard(3,30)`; DPR 1 light; desk fine / phone 393×699 coarse
  witnessed; focus-visible witnessed): the frame's perimeter median is **6.951 cr / 6.953 wk desk**
  and **3.944 / 3.947 phone**. It is identical on the tree and the control (π). The band (lower
  side) is **10.408 cr / 10.724 wk desk** and **6.140 / 6.169 phone**. **G2 = 1.497 / 1.542 desk and
  1.557 / 1.563 phone, RED at every rig and engine** against [1.35, 1.45]. The control reads
  0.300 / 0.300 desk and 0.270 / 0.118 phone. With GATE=1 the run gives 4 failed, exit 1.
- **Why the lower side.** The first run took the median of top ∪ bottom, and WebKit's desk top side
  read 15.823 fused to the grid line against a bottom of 10.724. A fused side can only lengthen. On
  HEAD's ring the two sides disagree because one side is THIN (0.47–2.08 px), and the `SIDES≠` flag
  names only the disagreement. First-run ratios: 1.533 / 1.555 / 1.569 / 1.571 (`logs/band-1-…`).
- **The denominator is fragile** (printed, never gated). The perimeter is bimodal: top and bottom
  read 3.1–3.9 px and left and right 7.3–7.4 px at desk, so its median sits on the seam. P45–P55
  spans **5.64–7.06 desk** and **3.09–3.99 phone**. G2 stays RED across that span (desk
  1.475–1.844).

## 6 · the §2.6 settle

The settle reads one group per call, at sync and after rAF1…rAF8. It asserts the frame-8 read and
`lagFrames ≤ 2`. Trees: TAPE `index-T6edeNHCmbrz.js` (:4237), control (:4236), RULE
`index-BEfGHg9Q2Vmx.js` (:4238). All runs are `-g "§2.6"`, both engines, both cells.

| arm | tree | result | exit |
|---|---|---|---|
| the row as landed (sync read) | TAPE | 4 failed (the critic's 4 reds) | 1 |
| **settled** | TAPE | 4 passed; `pencils` ladder `static → static → sticky…`, **lagFrames 2** at every cell × engine | **0** |
| plant **nosticky** (`.washi-tag {position:absolute!important}`) | TAPE | 4 failed on visibility | 1 |
| plant **pub300** (every `scroll` listener delivered 300 ms late) | TAPE | 4 failed on visibility (static through frame 8) | 1 |
| plant **pub30** (30 ms late) | TAPE | 4 failed on the LAG ceiling alone (lag 3–5, the tag visible at frame 8) | 1 |
| as landed / settled | control | 4 / 4 passed (π; reads `new game` only, `pencils` unreachable 599.2/504 and 361.7/248) | 0 / 0 |
| as landed / settled (`on-RULE` arm) | RULE | 4 / 4 passed; lag 0 everywhere (native sticky, no publisher) | 0 / 0 |

`git apply --check` of `viewport-law-2.6-settle.diff` exits 0 on 74a2b5d9 + TAPE, + GRAPHITE, + FIVE,
+ VERB and + FACE×VERB, and exits 1 on + RULE. `…on-RULE.diff` exits 0 on + RULE.
`sticky-ladder.mjs <url> [group] [tag]` is the probe. On TAPE it reads pencils lag 2 in both
engines at both cells, and on RULE it reads lag 0 (`logs/settle-5/6`).

**Finding for CTRL-TAPE.** The first settle cut read 4 frames and was checked against an
IntersectionObserver-delay plant, and that plant PASSED 4/4 (`logs/settle-1-…`). The release pose on
TAPE's tree is NOT published by an IntersectionObserver. It is a `scroll` listener that republishes in
a rAF (`GameControlPanel.vue` `publishFold`, ~829–858). `SheetWashiLabel.vue`'s comment ("published
by one `IntersectionObserver` at threshold 0.5") is false, and so is the pass-4 PROPOSED's premise.
The plants were re-aimed at the scroll publisher.

## + · lint:sleep's `getAttribute` verb (PROPOSED; main's scripts stay untouched)

The run is on a pristine 74a2b5d9 archive of `web/frontend/{scripts,e2e}`:

- Before: exit 0.
- With the verb: exit 1. The one finding is the inherited `viewport-law.spec.ts:111` (`stepDeckTo`), as PLR-PLACE's critic read it. Both new fixtures pass as required.
- Negative control: the fixtures without the verb make the self-test FAIL, because the RED fixture stays green (exit 1).

## Replay

1. Build each scratch tree: `git archive 74a2b5d9 web/frontend .github .gitignore csp-solver/data`, then apply the bank `--3way` and symlink main's `node_modules`.
2. Build and serve it with a two-line `.mts` config and its own cacheDir.
3. Copy the instrument into `<tree>/web/frontend/.chair-instr/` (so `../e2e/wire` resolves).
4. Run the command named in each section.

The scripts are in `<scratchpad>/instr-*.sh`.
