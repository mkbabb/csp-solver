# Pass 6 · PROTOTYPE · ACC-GRAPHITE (§3 §4 §12 accent)

Work tree `.claude/worktrees/wf_f72f3b5a-83a-40`, advanced IN PLACE on the chair's bank
`pass5/prototype/ACC-GRAPHITE/pass5.diff`. At open, `git diff --stat` matched the pass-5 README's
list (18 modified + 2 untracked, +1183/−196), and I banked the tree's diff to the scratchpad
before the first edit. Base and π control are `74a2b5d9`: the shared `w7-control` dist
`index-CubiZsMVSwTc.js` on :4236, verified by its asset hash. The tree dist is
`index-CJfpLpblsaS5.js` (43 files) on :4238, built with the lane's scratch dir parked outside the
tree. The two ballot arms were built from the same tree, each with ONE change, then restored by
`shasum -c`:

- the OUTSIDE tally, `TALLY_OUTSIDE = true`: `index-xwWyGr8rbYJq.js` on :4239;
- the OUTSET-110 chip, the PROPOSED diff applied: `index-CVa0BL_QqPWW.js` on :4240.

Dev servers: the tree on :4235, the ablated scratch copy (`FRONT_MIN_MS = 0`) on :4237, and a
dev-mode control on :4241. I killed every server by its recorded PID.

Payloads: `mintBoard(3, 30)` = `ATMuMTAwMDA2MDgw…` (9×9, 30 givens, read back as 30 = 30 through
the aria-label corpus on both arms), `mintBoard(4, 76)` with 77 written (16×16) and
`mintBoard(2, 4)`. The rate rows run on `?size=3&difficulty=EASY` plus a `?wire=local` room;
they are not π rows. The pass-6 number is the CRITIC's.

## Gaps first (open, with the number that holds each)

1. **G2 lands only under the landed statistic. The chair's A.1 statistic compares the band with
   half a line.**
   - Under `band.crit.ts` GATE=1 (the perimeter median), the tree reads 1.370 / 1.443 (chromium,
     desk / phone) and 1.403 / 1.421 (WebKit). The gate exits 0. The margins are thin: chromium
     desk sits 0.14 px over the window's floor and chromium phone 0.03 px under its ceiling. Both
     are inside the instrument's own stated error (≤ 0.169 px). A landing this close is a reading,
     not a margin.
   - Under A.1's per-side statistic (the band against the median of the top and bottom frame
     sides), the tree reads **2.492 / 2.785 / 2.546 / 2.750, RED**, and GATE=1 STAT=tb exits 1.
     To land there, the band would need 5.16–5.54 px at desk and 2.76–2.96 px at phone. No single
     scale of this band reaches both. At the desk that is 0.70–0.75× the frame's own left and
     right lines, so the ring would stop being the heaviest mark on the board.
   - **Why left/right reads twice top/bottom (A.1's question, answered).** It is not a fused grid
     line and not a shadow. The frame's top and bottom lines are centred ON the svg's edge
     (`gridPaths.ts` `FRAME_Y_PAD = 0`, `.frame-line` bbox y −4.76 … 1001.83 at stroke 12). The
     grid paints at rest through four 1000×1000 `<image>` bakes at 0,0, so the outer half of each
     line is cut off. Three readings agree:
     - the top and bottom runs touch the svg's edge row in **100 %** of columns (WebKit phone
       top 97.2 %), against 7.5–10 % on the left and 28–35 % on the right;
     - a crop extended 12 px past the box reads the same top and bottom widths (3.076 / 3.836 px
       against 3.12 / 3.88), so nothing paints beyond the edge;
     - the whole frame stroke is the left/right pair: 7.36 px desk, 4.07 px phone.
   - **The objection, carried here and not in the diff.** A.1's "like with like" sets a whole band
     against half a stroke. Against the whole stroke (left/right) the tree reads 1.294 / 1.399 /
     1.330 / 1.377, and the pass-5 band read 1.414 / 1.51 / 1.462 / 1.515. **No arm clears all
     three statistics.** Which frame G2 divides by is the chair's to name. It is a new charter
     row, as A.1 said.
2. **The 16×16 tally: the form arm is BUILT, the owner picks.** Inside, the ticks still collide
   with the glyphs: 431 / 19,378 px chromium, 451 / 19,320 WebKit, reproduced to the pixel. The
   arm `TALLY_OUTSIDE` (16×16 only; scale 1.03 about the centre) lays **0 px** on any glyph in
   both engines (0 / 19,378, 0 / 19,320) and 6 / 1 px on other ink. Its price shows in the crop:
   96 % of its tick pixels (4,717 / 4,910 and 4,735 / 4,935) sit outside the svg's box. The ticks
   stand above the card's top edge and over the card's right-hand shadow, off the paper. At 4×4
   and 9×9 the arm is inert: the same 0 px as the tree, same numbers.
3. **The join ring passes G10 in WebKit with little room.** On the driven 125 Hz clock the worst
   burst across five runs is 53.6–59.8/s against the 62.5/s budget, closer than chromium's
   48.3–52.3/s. The gate is FIVE's `frontGate`, grafted verbatim, so it carries the WebKit fault
   the chair's A.6 names (a forced end-write inside the window; 1 ms quantisation). Five of five
   runs are green here, but the cure is FIVE's product change and this tree does not carry it.
   The WebKit NATIVE clock read **58.8 Hz** on this box (under the 93.75 Hz precondition), so that
   row is REPORTED, not shipped, as A.1 ruling 7 prescribes.
4. **`visual-regression` 'light mode…' is RED on the tree (11/12 in both engines) and GREEN on
   the control (12/12).** `crayonVars.blue` reads `""` at :163. This is the §6.11 fold row. The
   fold applies `pass4/prototype/ACC-GRAPHITE/instruments/visual-regression-crayon.proposed.diff`
   in the SAME commit as the crayon-blue deletion. If it doesn't, the deletion does not fold.
5. **The law-39 hunks** (tier-2 and 2×3 `fill: none`, the `--color-focus-sketch` deletion) are
   carried by MRK-LIVE behind the section fork's const: registry-v5 §6.6, cited and not
   re-landed. `--ring-ink` stays LIVE's one declaration. This tree still paints the ring by
   `var(--color-pencil-graphite)` directly, and the fold re-points that line to `--ring-ink`.
6. **The inherited DARK filter red.** I ran ACC-SIX's `filter-census.spec.ts` (its dark arm)
   read-only against the tree dist and the control dist. Dark reads `svg.crayon-heart.idle`
   `saturate(0.85)` ×2 on BOTH, identically. That is the chair's fold pick (§1.3), not this
   tree's. The same spec's LIGHT rows red on the tree only, because they compare against SIX's
   `filterBudget.ts`, which still lists the sparkle glow this tree deletes. This tree's own
   `filter-census.spec.ts` is 6/6 in both engines.
7. **The seam probe is blind to a hairline.** At `RETRACE_INSET = 8` the band paints solid: seam
   dip median 0.005, 0 % of columns over 0.10, both engines, both rigs. The in-run negative
   `second-2` (a 1 u gap) reds, 55.6–56.5 % of columns at the phone but only 6.3–7.8 % at the
   desk. `second-1` reads SOLID: the probe needs a pass that reaches 0.9 coverage to see an edge
   at all. The desk negative is weak.
8. **The wash still gives up HEAD's hue cue** (207° blue → achromatic). The tally still reads as a
   dashed rule at 9×9. Both are priced, not dissolved (U-10).
9. **Not re-run this pass**, because nothing in the diff moved their surfaces: G1/G1b, G4's deck
   decomposition, the print row, forced colours, goldens, R3 σ and F1 (G6). Pass-5 numbers stand
   and are cited, not re-claimed. The `more` wash arm is script arithmetic only (1.259 L / 1.281
   D); I did not photograph it this pass.
10. **The wave's image cap** is the chair's. This lane adds 37,922 B: four replacement crops,
    pngquant 60–90.

## Numbers: the charter's twelve rows (tree dist vs control dist, one payload)

| # | row | tree | control `74a2b5d9` | state |
|---|---|---|---|---|
| 1 | G2, stamped (perimeter, landed GATE=1), cr desk / cr phone / wk desk / wk phone | band 9.523 / 5.689 / 9.758 / 5.607 → **1.370 / 1.443 / 1.403 / 1.421**, gate exit **0** | 0.300 / 0.270 / 0.300 / 0.118; the gate with the control as its tree arm exits **1** (the negative control, same batch) | LANDED on this statistic (gap 1) |
| 1 | the same band on A.1's t/b and on l/r | t/b 2.492 / 2.785 / 2.546 / 2.750 (GATE=1 STAT=tb exit **1**); l/r 1.294 / 1.399 / 1.330 / 1.377 | t/b 0.545 / 0.521 / 0.543 / 0.229 | RED on A.1 (gap 1) |
| 1 | frame per side, stamped (t / b / l / r) | desk 3.12 / 3.88 / 7.389 / 7.317 cr, 3.135 / 3.904 / 7.391 / 7.295 wk; phone 1.86 / 2.065 / 4.066 / 4.065 | identical (π) | the bake cuts the t/b halves (gap 1) |
| 1 | the re-cut: `RETRACE_INSET` 10 → 8 (20 u band, 4 u overlap). Sweep on the dev tree, perimeter ratio | 8: 1.370 / 1.443 / 1.403 / 1.421 · 8.25: 1.373 / **1.467** / 1.430 / 1.431 · 8.5: 1.407 / **1.479** / **1.457** / 1.442 · 9: 1.417 / **1.48** / **1.491** / **1.473** · 10 (pass 5, the stamped log): **1.497 / 1.557 / 1.542 / 1.563** | — | only 8 holds all four |
| 1 | the seam at inset 8 | median dip 0.005, 0 % of columns over 0.10, 4 / 4 cells | `second-2` negative: 6.3–7.8 % desk, 55.6–56.5 % phone | solid (gap 7) |
| 2 | tick over glyph px at 4×4 / 9×9 / 16×16, INSIDE (shipped) | 0 / 6,630 · 0 / 18,468 · **431 / 19,378** (cr); 0 · 0 · **451 / 19,320** (wk) | — | RED at 16×16 |
| 2 | the same, OUTSIDE arm (`TALLY_OUTSIDE`, built) | 0 · 0 · **0 / 19,378** (cr), **0 / 19,320** (wk); other ink 6 / 1 px; ticks outside the svg box 4,717 / 4,910 and 4,735 / 4,935 | — | BUILT for the owner (frames 3–4) |
| 3 | `DifficultyTally` | **reverted to HEAD** (`stroke-dashoffset`; the file has no diff). The "hygiene" comment is gone with it. G10 asserts `.dt-stroke` writes 0 `d` | — | CLOSED |
| 3 | G10, the join ring, through `frontGate` (grafted verbatim) — driven 125 Hz clock | cr **48.3, 49.5, 51.7, 49.0, 52.3/s**; wk **53.6, 57.5, 56.0, 59.8, 58.1/s**: 10 / 10 exit 0 | ablated (`FRONT_MIN_MS 0`): cr **124.7/s**, wk **123.0/s**, exit 1 | CLOSED (gap 3) |
| 3 | G10 at the 60 Hz shim (negative clock) | exit 1 in both engines, on the tree and the ablation alike (59.9 / 58.8 Hz < 93.75) | — | reds by precondition, as required |
| 3 | G10 native | cr 120.5 Hz: tree 58.0/s exit 0, ablated 120.0/s exit 1 · wk **58.8 Hz**: precondition RED on both (tree 56.2, ablated 60.1/s) | — | wk native REPORTED (gap 3) |
| 3 | `frontGate` unit row (`gridPaths.poseFronts.test.ts`, FIVE's verbatim) | 7 / 7 | `FRONT_MIN_MS = 0` → **1 failed** | born-RED shown; knip's unused-export red cured by it |
| 4 | `check-theme-tokens` RETIRED over every `.css`, `.vue` and `.ts` under `src/` (comments stripped by each file's grammar; keyed on the declaration's SHAPE) | `--self-test` 0. Seven in-memory controls: index.css `@theme`, **gameCell.css `:root`**, an SFC `<style scoped>`, an inline `style="--color-crayon-blue: …"`, a script `setProperty` all **RED**; a comment and a `var()` READ **green**. The FILE plant (`:root { --color-crayon-blue: #4a90d9 }` appended to gameCell.css) → **exit 1**, naming the file; restored `shasum -c` OK | — | CLOSED |
| 5 | the wash-step gate per theme scope (a cascade over every declaration: unlayered over layered, then specificity, then order; `.dark` / `html.dark` reach dark only; any other class is conditional) | `--self-test` 0 with **five** wash modes. The critic's plant (`@media (prefers-contrast: more) { html.dark { … 3% } }` placed BEFORE the `:root` block) reds as mode 4, and a `.dark` 3 % placed after reds as mode 5. The on-disk plant → **exit 1**: "dark: … 1.051:1 against the base's 1.115:1"; restored OK | — | CLOSED |
| 6 | `gridPaths.tally.test.ts` non-integer ratios (57 / 1 → 1; 57 / 29 → 28; 146 / 99 → 38; 146 / 3 → 1) | 6 / 6 | `Math.floor` → **1 failed**; `Math.ceil` → **1 failed**; restored OK | CLOSED |
| 7 | the caret unit row, `HandwrittenGlyph.test.ts` (new): given "5" → 6, written "5" → 4.5, given ">" and "<" → 5, solved → 5 | 3 / 3 | `return 6` for every given → **1 failed** ("keeps a printed caret at 5"); restored OK | CLOSED |
| 8 | R1 re-cut (`instruments/r1.mjs`; PROPOSED law-probe diff) | **GREEN**: 8 chromatic tokens paint in both themes, 0 lack a dark arm; ring strokes `var(--color-pencil-graphite)` and `var(--color-teacher-red, …)`. `--self-test` 0: ring-token plant (#3a7bc4 in `:root` only, the ring's stroke) **RED**; ring-hex plant (stroke written #3a7bc4) **RED** | **RED**: 12 tokens, `--color-focus-sketch` without a dark arm (π shows it: the control's dark ring paints rgb(58,123,196)); main 1d0dc4fd RED the same | CLOSED as PROPOSED (the chair lands it) |
| 9 | AA, the band (ring): core median · fraction < 3.0 at the 50 / 70 / 90 / 100 % rungs · worst column, two bare photographs | light 14.869; DPR 1 fraction 0.022 / 0.001 / 0 / 0 cr, 0.031 / 0.003 / 0 / 0 wk, worst column 6.672 / 6.776. Dark 11.994; 0.003–0.014 at 50 %, worst column 7.131 / 7.218. **DPR 2 worst column 3.347 / 3.304 light and 2.718 / 2.754 dark** (one column under 3 in the 50 % core, dark, both engines; 0 from the 70 % rung up) | 3.626–3.715; 50 % fraction 0.13–0.18; worst column 1.54–1.89 | medians ≥ 3.0, fraction bounded; the dark DPR 2 edge column named |
| 9 | AA, YOUR digit (TEXT, glyph-text statistic): core median · fraction < 4.5 | light **13.271**, fraction 0.227 / 0.224 (DPR 1 cr / wk), 0.143 / 0.145 (DPR 2); dark **10.788 / 10.762**, 0.201 / 0.152 (DPR 1), 0.132 / 0.129 (DPR 2). A printed given on the same tree: 19.451 / 15.839, fraction 0.086–0.189 | your digit 4.709 L / 6.666–6.672 D, fraction **0.356 / 0.357 L** (DPR 1); given identical to the tree | fraction under the control's own (the bound) |
| 9 | the wash (glyph-free ground statistic: every paper pixel of a washed, glyph-free cell) | 1.120 L; 1.112 cr / 1.114 wk D; p10 = p90 (flat), n 4,265–17,274 | 1.078 L; 1.104 / 1.103 D | a ground, ranked by `check-ink-pressure` |
| 10 | chip OUTSET-110, the PROPOSED product diff `arms/chip-OUTSET-110.PROPOSED.diff` (`git apply --check` 0 on this tree), both changes captioned in the diff: (1) the ring scaled 1.1, (2) both passes and the invalid tier 12 → 10 u | built and framed. 393 coarse: band px 6,172 / 6,075 against shipped's 5,942 / 5,941; **0 px** over the digit either way. G2 (perimeter) 1.408 / 1.421 / 1.407 / 1.435, inside | — | CLOSED (frames 1–2) |
| 11 | `visual-regression` whole | 11 / 12 in both engines (gap 4) | 12 / 12, 12 / 12 | DECLARED, the §6.11 fold row |
| 12 | wash pair / 8.75 u seam / F1 / dark census | wash as row 9 (numbers only). The 8.75 u arm is moot at inset 8 (the band re-cut by the inset, not the second pass). F1 not re-shot. Dark census: gap 6 | — | as stated |

**π** (`pi6.probe.ts`: every `body *` node's computed paint properties + tag path; 4 regimes ×
2 engines: desk light and dark at 1280×800, phone light and dark at 393×699 coarse). Givens read
back 30 = 30. Control against control: **0 / 0 in all 8**. Tree against control: load 31 changed
+81 added, focus 61 changed +81, 0 removed, identical in all 8. What differs:

- 81 × `.cell-ghost-retrace` (added);
- 30 given paths, stroke 5 → 6 px;
- 20 `.cell-peer` washes (blue 7 % → graphite 6 %);
- 4 `.progress-pose` scaled 0.968;
- 4 `.progress-trace`, violet 8 → graphite 10 at opacity 1;
- your digit's stroke, blue → graphite;
- the ring: #3a7bc4, 7 u, fill 0.08 → graphite, 12 u, fill none;
- `svg.sparkle-icon`'s drop-shadow → none.

Everything else paints the same. The ring's inset change (10 → 8) is geometry, which π cannot
see. G2's band rows are its reading (A.5 ruling 4).

**The painted-geometry rows** (`clip.probe.ts`) are identical in both engines: svg overflow
visible; four `<image>` bakes 1000×1000 at 0,0; `.frame-line` bbox y −4.76 … 1001.83.

## Gates run bare, each born-RED in the same batch

| gate | tree | born-RED on this tree (edit, run, restore by sha1) |
|---|---|---|
| `band.crit.ts` GATE=1 (the stamped copy, `band6.crit.ts`) | 0 | the control as the tree arm → 1; STAT=tb → 1 |
| G10 (`front-rate-60hz.spec.ts` copy, GATED=join) | 0 (driven, 5 / 5 per engine) | `FRONT_MIN_MS 0` → 1 (cr 124.7, wk 123.0/s); the 60 Hz shim → 1 by precondition |
| `frontGate` unit row | 7 / 7 | `FRONT_MIN_MS 0` → 1 failed |
| `check-theme-tokens --self-test` | 0 | the gameCell.css FILE plant → 1; five in-memory shapes RED, two greens green |
| `check-ink-pressure --self-test` | 0 | the critic's html.dark-before-:root plant ON DISK → 1 |
| `gridPaths.tally.test.ts` | 6 / 6 | floor → 1 failed; ceil → 1 failed |
| `HandwrittenGlyph.test.ts` | 3 / 3 | the caret back to 6 → 1 failed |
| R1 PROPOSED (`r1.mjs`) | GREEN | ring-token plant RED; ring-hex plant RED; the control RED |
| tick clearance (occl6) | 0 at 4×4 / 9×9 inside; 0 at 16×16 OUTSIDE | the INSIDE form at 16×16: 431 / 451, the same run |
| seam (seam6) | 0.005, 0 % | `second-2` → 6.3–56.5 % (gap 7) |
| π | 0 noise | control vs control 0 / 0 in every regime |

## The pre-return battery (bare; the control's exit code beside it)

`.accg6/` was parked OUTSIDE the tree for every lint row (ESLint ignores only `dist*` and
`node_modules`). Scripts: `instruments/scripts/gates.sh` and `final.sh`.

| gate | tree | control `74a2b5d9` |
|---|---|---|
| `check-copy-register` bare · `--self-test` | 0 · 0 (no rendered string added) | 0 · 0 |
| `check-theme-tokens --self-test` | 0 | 0 |
| `check-ink-pressure` bare · `--self-test` | 0 · 0 | 0 · 0 |
| `lint:theme-tokens` | 0 | 0 |
| `lint:lanes` | 0 | 0 |
| `lint:sleep` | 0 | 0 |
| `lint:motion` | 0 | 0 |
| `test:e2e:projects` | 0 | 0 |
| `check-pw-projects` bare | 0 | 0 |
| `knip` | **1 on the first run** (`FRONT_MIN_MS` unused) → the `frontGate` unit row → see final | 0 |
| `eslint .` | 0 | 0 |
| prettier (`npm run lint`, the scoped `--check`) | **1 on the first run** (my two script edits) → `prettier --write` on those two files + the test → see final | 0 |
| the cured undefined-token census (`pass6/instruments`) | exit 1: 0 findings + the ONE declared `STALE --refuse-dur` row (A.1 ruling 4 → GREEN) | the same |
| `check-property-block --fe` | 0 (no registration in the diff) | 0 |
| `vue-tsc -b --force` | 0 | not run |
| vitest, 3 chunks by directory | 26 / 328 · 34 / 431 · 11 / 88 = **71 files / 847 tests, 0 failed** (first run) → see final | not run |
| `visual-regression.spec.ts` whole, dists | 11 / 12 cr, 11 / 12 wk (gap 4) | 12 / 12, 12 / 12 |
| `filter-census.spec.ts` whole, dists | 6 / 6, 6 / 6 | 6 / 6, 6 / 6 |
| ACC-SIX's `filter-census.spec.ts` (dark arm), read-only | dark 2 failed per engine (`crayon-heart` ×2); light 2 failed (SIX's budget lists the sparkle) | dark 2 failed per engine (`crayon-heart` ×2) |
| `multiplayer.spec.ts` whole, dev arms (`?wire=local`) | 17 passed + 1 opt-in skip, both engines | 17 + 1, both engines |

FINAL (after the prettier and knip fixes, dist rebuilt): see §Final at the foot.

## Ballots for the owner (U-10): each pair on ONE payload, one variable, both frames looked at

- **The tally at 16×16: INSIDE (shipped) | OUTSIDE** (frames 3–4). Held: the engine, light,
  1280×800 dpr 1, fine pointer, `mintBoard(4, 76)` with 77 written. The variable is
  `TALLY_OUTSIDE`. The crop is the board's top-right quarter with 24 px of margin.
  - Seen: inside, the ticks cross the tops of F and G and run down through the right column's G,
    4, 8, C and 1. Outside, the ticks stand above the card's top edge and down its right-hand
    shadow, and every glyph is clear.
  - Uncontrolled: none.
  - Default: INSIDE, presented as NOT clear at 16×16 (431 / 451 px).
- **The chip at 393: shipped | OUTSET-110** (frames 1–2). Held: the engine, light, 393×699 dpr 3,
  coarse (hasTouch, `pointer: coarse` witnessed), `mintBoard(3, 30)`, cell 30 holding your 5,
  focused by a real key (focus-visible witnessed). The variable is the ring's placement, built
  from ONE PROPOSED diff that carries **two declarations**: scale 1.1, and 12 → 10 u on both
  passes.
  - Seen: shipped closes the band inside the cell around the 5. OUTSET stands the band on the
    grid line: the 5 gets more paper, and the focused cell's own grid line vanishes into the band.
  - Uncontrolled: none.
  - Default: shipped. A critic may still call the pair unlawful for its two declarations. They
    are one placement, captioned in the diff.
- **The wash**: graphite 6 % (1.120 L / 1.112–1.114 D) against HEAD's blue 7 % (1.078 / 1.103–1.104).
  Numbers only, not framed.
- **G2's frame, for the CHAIR, not the owner**: the perimeter median (the tree lands),
  the top/bottom median (A.1; the tree cannot land, and the top/bottom are half strokes cut by the
  bake), or left/right (the whole stroke; the tree reads 1.29–1.40). Not a picture.
- **F1**: unchanged from pass 4, not re-shot.

## r0 / R6 rows MOVED (PROPOSED, never applied; the chair's rows)

- **R1**: `instruments/law-probe.R1.PROPOSED.diff` replaces the pass-5 re-cut, which read one
  name. The row now imports `instruments/r1.mjs`, and the chair inlines it at the fold, as with
  L5b. Readings: the tree GREEN; the control and main RED (`--color-focus-sketch`); both ring
  plants RED. Run from a scratch copy with FE re-pointed, the other eight rows are unchanged. L1
  is GREEN ("8 of ceiling 9"), and R2/R3 stay RED on all three trees.
- **Law 39's third form**: MOVED to a 20 u graphite band (two 12 u passes, 8 apart) at opacity 1,
  `fill: none`, drawn on over the same 180 ms. The carrier is LIVE behind the fork's const
  (gap 5).
- **L1**: cited, not re-landed; the chair landed it as a ceiling.
- **R2** (`--color-user-ink` MOVED to graphite): pass-4 `hue-census-user-ink.MOVED.proposed.diff`
  stands.
- **Accent kinship**: pass-4 `accent-kinship.proposed.diff` stands.
- **§6.11**: pass-4 `visual-regression-crayon.proposed.diff`, the fold row in gap 4.

## Replay route

In place. No replay, no `git apply`, no line-count check owed. At open the tree's `git diff` file
list equalled the pass-5 README's (18 + 2), and nothing was reset. What moved this pass:

- `DifficultyTally.vue`: back to HEAD, byte for byte. The file leaves the diff, so there are now
  17 modified files.
- `gridPaths.ts`:
  - `FRONT_MIN_MS` + `frontGate` grafted verbatim from ACC-FIVE;
  - `RETRACE_INSET` 10 → 8;
  - the `poseFronts` docstring re-cut to one consumer and its gate.
- `HandDrawnGrid.vue`:
  - the join ring's front commits through `frontGate` (`joinFraction` / `joinFront`, FIVE's
    names);
  - `TALLY_OUTSIDE` (false) + `.progress-pose.is-outside { transform: scale(1.03) }`.
- `gameCell.css`: comments only (the band's numbers).
- `scripts/check-theme-tokens.mjs`: `retiredScan` over every src file, with seven self-test
  controls.
- `scripts/check-ink-pressure.mjs`: `washDecls` / `washArms` as a per-theme cascade, plus self-test
  modes 4–5.
- Tests:
  - `gridPaths.tally.test.ts` gains the non-integer row;
  - `gridPaths.poseFronts.test.ts` gains FIVE's `frontGate` row;
  - `HandwrittenGlyph.test.ts` is new.

## Frames (4 replacement crops, 37,922 B, pngquant 60–90; left = shipped)

| file | engine · theme · viewport · pointer | payload | retires (pass5/SWEEP.md) |
|---|---|---|---|
| `frames/p6-chip-shipped-outset110-phone393-light-chromium-coarse.png` (9,530 B) | chromium · light · 393×699 dpr 3 · coarse | `mintBoard(3, 30)`, cell 30 = your 5 | `prototype/ACC-GRAPHITE/frames/p5-chip-shipped-outset-phone393-light-chromium-coarse.png` |
| `frames/p6-chip-shipped-outset110-phone393-light-webkit-coarse.png` (9,110 B) | webkit · light · 393×699 dpr 3 · coarse | same | `prototype/ACC-GRAPHITE/frames/p5-chip-shipped-outset-phone393-light-webkit-coarse.png` |
| `frames/p6-tally16-inside-outside-desk-light-chromium-fine.png` (9,533 B) | chromium · light · 1280×800 dpr 1 · fine | `mintBoard(4, 76)`, 77 written | `prototype/ACC-GRAPHITE/frames/p5-tally16-along-across-desk-light-chromium-fine.png` |
| `frames/p6-tally16-inside-outside-desk-light-webkit-fine.png` (9,749 B) | webkit · light · 1280×800 dpr 1 · fine | same | `prototype/ACC-GRAPHITE/frames/p5-tally16-along-across-desk-light-webkit-fine.png` |

## Incidents (self-declared)

1. **I wrote a file into the FROZEN `loop/r0/r6-idiom-history/`**: `law-probe.r1-test.mjs`, from a
   bad relative path in a `cp`. I saw it on the next listing and moved it out to
   `<scratchpad>/trash-accg6-1/` (`mv`, no `rm`). The directory's listing is back to the chair's
   eight files, and `git status` on that path is clean. Nothing read it.
2. **The first AA run was void.** It hid its subject cells with `:nth-child`, and the cells are
   not one parent's children, so the ring and the digit read `undefined`. I killed that run by its
   PID (found with `pgrep` on the lane-unique instrument path) and re-cut it with data-attribute
   marks. No number from the void run is cited.
3. **The rate spec's `gauge` row read 0 `d` records.** On this tree the fill tally re-cuts only on
   fill events, and three hints produced none in that window, so the fill tally's per-event rate
   is unmeasured. It is not a per-frame front here.
4. **The first battery read knip 1 and prettier 1 on the tree**, both mine: `FRONT_MIN_MS` was an
   export with no reader, and my two script edits were unformatted. The fix is FIVE's unit row
   (born-RED shown) and `prettier --write` on the three files. The FINAL block re-runs both.
5. **The tree was edited for builds and plants seven times**: `RETRACE_INSET` ×4 in the sweep,
   `TALLY_OUTSIDE`, the OUTSET diff, and the break-tests. Each was restored by `shasum -c` OK
   before anything read the tree.
6. **The dev-mode control (:4241) ran from a config in this tree's `.accg6/`** (`root` = the
   control), so it never wrote into the control tree. The control tree was never git-touched.
7. **The rate battery's ablated arm is a scratch COPY** (rsync of this tree's `web/frontend` minus
   `node_modules`/`dist`, `csp-solver/data` and `wasm/pkg` linked), with `FRONT_MIN_MS = 0`. The
   chair cleans it: `<scratchpad>/accg6/ablated`.

## Layout

- `instruments/`:
  - `r1.mjs` + `law-probe.R1.PROPOSED.diff` (the R1 re-cut);
  - `aa6.mjs` (AA);
  - copies of every probe run (`band6.crit.ts`, `occl6.probe.ts`, `pi6.probe.ts`,
    `frames6.probe.ts`, `seam6.probe.ts`, `clip.probe.ts`, `front-rate-60hz.spec.ts`, `lib.ts`,
    the pw configs);
  - `scripts/` (the batteries as shell scripts).
- `arms/chip-OUTSET-110.PROPOSED.diff`.
- `readings/*.summary.txt`: g2-stamped, occl, rate-g10, aa, pi.
- `frames/`: the four crops.

Raw logs stayed in the session scratchpad.

## Final (after the last edit; `.accg6/` parked; bare)

The dist was rebuilt after the last edit: `index-CJfpLpblsaS5.js`, 43 files, and
`diff -rq` against the cited dist is **empty**, so every painted number above holds for the
returned tree.

| gate | exit |
|---|---|
| knip | **0** |
| `eslint .` | 0 |
| prettier (`npm run lint`) | **0** |
| `check-theme-tokens --self-test` | 0 |
| `check-ink-pressure --self-test` | 0 |
| `lint:theme-tokens` | 0 |
| `check-copy-register` | 0 |
| `vue-tsc -b --force` | 0 |

vitest: 26 / 328 · 34 / 431 · 11 / 89 = **71 files / 848 tests, 0 failed**. That is pass 5's 843
plus the caret file's 3, the non-integer row and FIVE's `frontGate` row.
