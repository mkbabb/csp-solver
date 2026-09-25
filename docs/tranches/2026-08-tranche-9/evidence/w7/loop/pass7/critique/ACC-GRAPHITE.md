# ACC-GRAPHITE · pass-7 CRITIQUE (adversarial, non-author)

Critic: Opus, 2026-09-24. Base and π control `74a2b5d9`. I didn't write the charter or the prototype.
I read the pass-6 LAWS (P6), all four pass-7 chair rulings, pass-6 A.1–A.7, the pass-5 and pass-4 chairs,
registry-v6 §2.6, §2.7, §2.10 and §2.12 with this family's rows, the charter, the pass-6 critique,
`pass7/instruments/README.md`, the prototype's README, return, BANKED.txt and both frames, and the
tree's diff.

**Convergence: 71 % (75 at pass 6). Verdict: BLOCK.** Streak 0. Not converged.

The band is the family's defining mechanism, and it can't land under the law in force. The one
statistic it lands on (left/right, the "whole stroke") needs a primitive owned elsewhere: an
un-clipped frame, `FRAME_Y_PAD`, §13's bake row. Its rig key also fails at a regime the prototype
didn't read. The rest of the thesis stands: the wash, measured in PAINT at 1.112–1.120, and the
OUTSIDE tally, 0 px on glyphs. It can be banked as §3 grafts.

## Replay

- **Tree:** I rebuilt it from the work tree with a two-line config (in-tree `.accg7crit/`,
  cacheDir in the scratchpad). The build is **byte-identical** to the prototype's `dist-b3`
  (`index-DAjWznUFrGq7.js`, 43 files, `diff -rq` empty).
- **OUTSIDE arm:** I rebuilt it from a scratch copy with ONE line changed
  (`TALLY_OUTSIDE = true`). It is byte-identical to `index-CbZ0YQyta0cg.js`, so the ballot has one
  variable.
- **The cum diff:** it applies on a fresh `git archive 74a2b5d9` (exit 0). Applied, it reproduces
  the work tree byte for byte (src, scripts, e2e and the three configs).
- **Servers:** tree :4235, control :4236 (`index-CubiZsMVSwTc.js`, verified by hash, served with
  its own `.vite-control.config.ts`), OUTSIDE :4237. I killed all six PIDs (listeners
  23745/23771/53332, parents 23714/23715/53244), and the three ports read free.
- **Attacks and hygiene:** every gate attack ran on a scratch COPY (`accg7crit-atk`, `diff -rq`
  identical to the tree), restored by `cp`. I moved `.accg7crit/` to
  `<scratchpad>/trash-accg7crit-1/`. The tree's `git status` is 21 M + 4 ??, +1800/−187, unchanged.
  I used no `rm` and ran no git in the control.
- **Load:** 34–50 (1-min) throughout.
- **Where things are:** summaries in `critique/ACC-GRAPHITE/readings/critic-readings.summary.txt`,
  instruments in `critique/ACC-GRAPHITE/instruments/`. No crop banked.

## 1 · Re-measured by me, both engines

| row | prototype | mine | holds? |
|---|---|---|---|
| stamped `band.crit.ts` **unmodified** GATE=1, desk / phone 393×699 coarse | desk 1.471 cr / 1.511 wk RED; phone 1.443 / 1.421; exit 1 | **1.471 / 1.511 RED · 1.443 / 1.421 inside · exit 1 ×2**; frame t/b/l/r desk 3.12/3.88/7.389/7.317; control 0.300/0.270/0.300/0.118 | yes, to the thousandth |
| **new: the rig key at 1x coarse on a LARGE board** (`bandc.crit.ts` = the prototype's `band7` + three rigs, STAT=lr) | not read | **tablet 768×1024 coarse: 1.292 cr / 1.335 wk RED · tabletL 1024×768 coarse: 1.312 / 1.313 RED · desk 1280×800 coarse: 1.294 / 1.330 RED**; same bytes, desk fine 1.389 / 1.432 inside, phone coarse 1.399 / 1.377 inside | **the key is wrong** (§2.2) |
| **new: X6-shaped plant on the RING** (`.cell-ghost{clip-path:inset(0 22%)}`, its left and right sides erased) | not read | band **10.224 / 10.507 desk, 5.689 / 5.607 phone: identical to clean**; phone reads "inside" under the plant | **G2 cannot see a ring with no sides** (§2.3) |
| unit wash from **PAINTED bytes** (inner 40 % of an empty peer cell vs an empty non-peer, 9×9, desk and phone coarse) | 1.119 light / 1.115 dark (arithmetic) | tree **1.120 light ·<br>1.112 cr / 1.114 wk dark**; control 1.078 / 1.103–1.104; desk = phone | yes, arithmetic within 0.003; the dark margin over HEAD is **+0.008–0.010** |
| same, plants injected at runtime | — | `.cell-peer{opacity:.2}` **1.017–1.026**; `@property --ground-wash-unit{inherits:false;initial-value:transparent}` **1.000** (computed `rgba(0,0,0,0)`) in both engines and both themes. P-last `.cell-peer{background:transparent}` did not paint: it lost on specificity to the scoped rule, so that arm is **VOID** | the painted probe sees both plants; the source gate sees neither (§2.4) |
| 16×16 OUTSIDE at **812×375 coarse** (W2 §2.2's cell) | not read | INSIDE **140 / 6,408 cr · 157 / 6,512 wk** on glyphs; OUTSIDE **0 / 0**, 1,397 px off the svg; pose y 9.0 against svg 16.0 and viewport 0; no clipping ancestor | OUTSIDE clears; INSIDE collides there too |
| OUTSIDE's clearance to the ink above, 393×699 coarse (per column: the top tick row against the lowest dark pixel above it) | "about 7 px nearer the heading", no gate | OUTSIDE min gap **10 px** (p10 11) cr and wk, over 148–151 of ~250 tick columns, 0 touching; control **15–16 px** (p10 16–17). Negative control: the pose translated up reads **5 px** (the instrument moves) | OUTSIDE spends 5–6 px of HEAD's clearance; not touching |
| `frontGate` units (`poseFronts.test.ts`) | 20/20 (with `tally.test`) | 14/14 in the file. Plant `>` for `>=`: **3 failed**. Plant: no grain allowance: **1 failed** (whole-ms row) | the 15/16 ms rows discriminate |
| A.7 re-apply on `74a2b5d9 + s13-s7-s3.diff` (proper archive) | fails, 14 conflict hunks | **pass6.diff --check 1** (9 files: check-ink-pressure, check-theme-tokens, index.css, GameBoard, GameControlPanel, useGameCell, HandwrittenGlyph, HandDrawnGrid, gridPaths). **cum --check 1** (the same plus pencilConfig, and poseFronts.test "already exists") | yes; A.7 is unmet |
| battery (scratch copy == tree / control), bare | all 0 except census 1/1; lint-lanes 0 in the work tree | copy-register 0/0 · self 0/0 · theme-tokens 0/0 · self 0/0 · ink 0/0 · self 0/0 · lint-sleep 0/0 · lint-motion 0/0 · e2e-projects 0/0 · check-pw-projects 0/0 · property-block src 0/0 · census **1/1** (the declared STALE row, A.1 ruling 4: GREEN net) · eslint 0/0 · knip 0/0 · lint-lanes 2 on the copy (no `.github`), **0 in the work tree** / control 0 | yes |

**Not re-run by me:**
- G10: six runs per engine are the prototype's. I read its summary, and every run's load and minimum
  gap are printed.
- π whole-DOM, filter census (filterBudget 9 → 8 is pass 6's, unchanged here), vitest whole,
  vue-tsc, goldens, print, forced colours.

## 2 · Gaps first

### 2.1 The band dies under both of the chair's statistics (open; the charter's survive-on sentence, confirmed)

Under the stamped gate (perimeter), desk reads **1.471 cr / 1.511 wk, RED**. WebKit's top side
is fused at 15.572 (SIDES≠). Under A.1's ratified t/b statistic the band reads **2.49–2.79 at every rig**.

It lands only on left/right (1.36–1.45). That is the whole-stroke statistic the pass-6 critic
proposed, but registry-v6 §2.7 ruled "read against the frame as PAINTED" and left the gate UNMODIFIED.

**Closable only off-family:**
1. §13 (MOT-VERB INTAKE-23 rows 1–2) un-clips the frame (`FRAME_Y_PAD`), so t/b paints whole
   (≈ 7.3 px).
2. The chair re-stamps G2's frame statistic on the un-clipped frame.
3. The band is then re-read.

The prototype's own sweep shows that, un-clipped, no width lands both engines at desk except 15
(1.389 / 1.432, the upper margin 0.018).

### 2.2 The rig key is a pointer proxy, and it fails on any 1x coarse board of 600+ px (new; refutes row 1's arm)

`@media (pointer: coarse) and (max-resolution: 1dppx)` gives 12 units to every 1x touch surface.
The comment's own law is that the ratio follows the board's DEVICE-pixel size. The key is wrong
at every large 1x touch board:

| rig (1x, coarse) | cr | wk |
|---|---|---|
| tablet 768×1024 (board 668 px) | **1.292** | **1.335** |
| tabletL 1024×768 (604 px) | **1.312** | **1.313** |
| desk 1280×800 (636 px) | **1.294** | **1.330** |

The key also misses in the other direction: a small FINE-pointer 1x board reads 1.441 / 1.45 at
520 wide (the prototype's own edge).

**Closable:** key the inset on the quantity the law names, the board's device-pixel span (a
container query on the board's inline size × resolution, or a `--board-px` publisher), not the
pointer. Then show a plant: the pointer key on tablet 768×1024 coarse reds, and the size key
reads it inside. Until §2.1 moves, this is moot for the gate but not for π: 12 vs 15 units is a
painted weight change on every 1x touch device.

### 2.3 G2 can't see a ring with no sides; the four-band graft was not taken (new; LAWS P6 §E and §I)

The band is `min(top, bottom)` over the middle half of the cell. With the ring's left and right
22 % clipped away, every band number is **identical to clean** in both engines, and phone reads
"inside".

The charter's graft was "the four-band edge probe (the band read is its)". The prototype used
none of the chair's six pass-7 instruments (`edge-bands`, `painted-frames`, `postpaint`,
`glyph-pop` and `rest-probes` are uncited). It read the band with its own `band7.crit.ts`.
§I: "a family row that re-implements one of these is a row against this law."

**Closable:** read the focused ring through `pass7/instruments/edge-bands.mjs`: four bands
against ring-OFF, each with a core-median floor, X6/X4/FADE15 as in-run plants on
`.cell-ghost` both passes. G2's width row then rides beside it.

### 2.4 The wash gate: five escapes, fourth pass on the class (new; the SHAPE law's "resolved AT THE CONSUMER")

`gateWashReach` reads every DECLARATION of `--ground-wash-unit` and never what the consumer
paints. On the scratch copy, each of these exits **0** and prints "base 6 % 1.115 dark":
- **W1** `.cell-peer { opacity: 0.2 }`: painted 1.017–1.026.
- **W2** `.cell-peer { background: transparent }` after the rule (the last wins).
- **W3** `.cell-peer { background: rgb(87 83 78 / 0.02) }`.
- **W4** a Tailwind arbitrary property `[--ground-wash-unit:transparent]` in a template. The
  build SHIPS `.\[--ground-wash-unit\:transparent\]{--ground-wash-unit:transparent}`.
- **W5** `@property --ground-wash-unit { syntax:'<color>'; inherits:false; initial-value:transparent }`.
  Painted **1.000** in both engines and both themes: the consumer never inherits `:root`'s value.
  `check-property-block` stays 0, because the block is well-formed.

W6 (a `style.cssText` write) reds, correctly.

**Closable:**
- The gate reads the CONSUMER: the last `background` on `.cell-peer` in source order resolves to
  the token.
- `opacity` and `filter` on the consumer and its ancestors are folded into the step.
- A `@property` registration of the token with `inherits: false` or an `initial-value` reds.
- `tokenSites` reads Tailwind arbitrary properties (`[--tok:…]`).
- W1, W2, W4 and W5 join `--self-test`.

The painted probe (`instruments/wash.crit.ts`) is the born-RED that already sees W1 and W5.

### 2.5 RETIRED: two escapes (new)

`check-theme-tokens` exits **0** on:
- **R1** a Tailwind arbitrary property `[--color-crayon-blue:#4a90d9]` in a `.vue` template. The
  build SHIPS `.\[--color-crayon-blue\:\#4a90d9\]{--color-crayon-blue:#4a90d9}`.
- **R4** `@property --color-crayon-blue { …; initial-value: #4a90d9 }`, which re-mints the retired
  name as a live value.

It reds `style.cssText`, a `.json` key, a template-literal stem and a computed `['--tok']` key
(R2, R3, R5 and R6: exit 1). So the nine pass-6 escapes are closed and two siblings of the same
class are open.

**Closable:** `tokenSites` reads Tailwind arbitrary properties and `@property` preludes as
declaration sites. Both plants join the self-test. The chair's library README already lists the
Tailwind table as partial, so the cure lands in the ONE library, not a fork.

### 2.6 A.7 unmet: the family has no number on the integrated tree (open; the integrator's seam, confirmed)

`pass6.diff` doesn't apply on `74a2b5d9 + s13-s7-s3.diff`: 9 files, 1 atomic failure. `pass7.cum.diff`
fails too (10 files, plus `gridPaths.poseFronts.test.ts` already exists). The chair's A.7 re-apply is
the fold's row (v6 §2.15). Every §3 number from the integration stays uncited.

**Closable:** the chair (or batch-6 integrator) rebases the pass-6 bank onto `s13-s7-s3` by
`--3way` with the named hunks resolved, then re-runs check-property-block, the filter census both
themes and lint:bands.

### 2.7 Carried and smaller rows (open)

- **G10's clock.** WebKit gated6's DOM minimum gap is **11.0 ms**, against a frame-clock 17.0. A.6's
  "minimum gap ≥ 15.5 ms" is met only on the clock the prototype chose. The rate row did not read the
  chair's painted-frame recorder (§D, §I). Also, the pass-6 negative control is exit 0 in chromium, so
  it proves the defect in one engine only. **Closable:** the chair names the clock A.6 binds, or the
  forced write is re-timed so the DOM gap clears 15.5 ms as well. The recorder is read beside it.
- **FIVE's +1 ms costs WebKit's 60 Hz join:** 39.5/s against 53.0 in chromium. It is inherited by
  sha and declared in the return, but the ballot/fold row doesn't state it.
- **FIVE's docstring cites `e2e/front-rate.spec.ts`,** which this tree lacks. The cite dangles until
  FIVE's spec folds.
- **The library fork.** `scripts/lib/shape-census.mjs` is the chair's library plus `tokenSites`,
  now two copies (§I: ONE copy). **Closable:** the chair lands the PROPOSED diff in
  `pass7/instruments/` and the estate imports it.
- **The OUTSIDE frames crop off the heading** the arm moves toward. The clearance (10 px against
  HEAD's 15–16) is now a number (§1), not a frame and not a gate.
- **The chip pair's scale-only arm** (pass-6 §2.4) is still UNBUILT and not mentioned in the return.
- **Law 39 / `--ring-ink`:** the ring still paints `var(--color-pencil-graphite)`. LIVE re-points it
  at the fold.
- **visual-regression light 11/12:** the §6.11 fold row.
- **Unrun:** G1/G1b, G4, print, forced colours, goldens, R3 σ, F1 and the `more` wash arm painted.
  The `more` arm is still arithmetic only (1.259 / 1.281).
- **The wash drops HEAD's hue cue** (207° → achromatic). Dark is +0.008–0.010 over HEAD's blue in
  paint. U-10, priced.

## 3 · Checklist

- **Gates that cannot fail:**
  - G2 on a sideless ring (§2.3).
  - The wash gate on the consumer's own paint and on registration (§2.4).
  - RETIRED on Tailwind arbitrary properties and `@property` (§2.5).
- **Masked fallbacks / the generic default:**
  - The pointer predicate stands in for board size (§2.2). A `@property inherits:false` silently
    deletes the wash (§2.4, W5).
- **The elegant-reduction trap:** "the chair picks which statistic binds". The only binding reads
  (stamped and A.1) are RED, and the hard part (an un-clipped frame) is §13's (§2.1).
- **The constraint it forgot:**
  - LAWS §I, the chair's instruments, the four-band graft (§2.3).
  - The regime law (read every rig the key touches).
  - π: 12 vs 15 units on every 1x touch device is unframed.
- **Clear:**
  - **M16:** check-copy-register 0/0.
  - **filterBudget:** 8, unchanged from pass 6.
  - **@property:** check-property-block 0/0.
  - **The undefined-token census:** 1/1, the declared STALE row, net GREEN.
  - **W2's landed mechanics:** no scene, dock, tab or sticky file in the delta.
  - **AA:** the wash read from painted bytes, both themes, both engines.
  - **The ballot:** B-TALLY-16 on one payload with one variable; the OUTSIDE hash reproduced from
    a one-line build.
  - **The decided history:** booked MOVED (R1, the shape-census delta, the single-inset arm, the §13
    hand-off). No legacy alias.
  - **Consumer-less substrate:** knip 0, and `MOTION.hand.stepMs` has its consumer.
  - **Generic-default tells:** none.

## 4 · Strengths

- Everything I re-ran reproduces to the thousandth or the byte: both dists, the stamped G2 on both
  arms, the per-side frame and the cum diff's apply.
- The return is candid. It says the band dies, names 1.294 and 1.471 / 1.511, and names the numbers
  the thesis survives on. It declares the `band7` extension, the void DPR-2 run and every incident.
- The wash survives in PAINT, not just arithmetic: 1.120 light and 1.112–1.114 dark on both
  engines, above HEAD's painted 1.078 / 1.104.
- OUTSIDE clears the glyphs at all three rigs (desk, 393×699 and 812×375: 0 px in both engines). It
  stays inside the viewport with no clipping ancestor.
- A.6 is taken by sha, with rows that discriminate:
  - 15 ms is swallowed and 16 ms commits (`>` reds 3, the grain plant reds 1).
  - The consumer is timed on the frame.
  - Room is up from 8.9 to 11.1/s over 6 runs per engine, with the load printed per run.
- The nine pass-6 escapes are all closed, each with its plant red on pass 7 and green on pass 6.

## 5 · Cross-pollination

- **Raster-bake owners (MOT-VERB INTAKE-23 rows 1–2):** the frame's t/b paint at 0.42–0.53× its
  sides at every rig, both engines. That is the one blocker between this family and a landable G2.
- **The chair's shape-census library:** Tailwind arbitrary properties `[--tok:v]` and `@property`
  preludes (`initial-value`, `inherits:false`) are declaration sites nothing reads. Every token
  census (PAL-TIN, PAL-WALK, MRK-LIVE, ACC-SIX, LEDGER's reserve law) inherits both holes.
- **Every "at the consumer" gate:** read the consumer's final paint property (the last declaration,
  opacity and an inherits:false registration), not just the token's declarations.
- **MRK-LIVE (the ring):** the X6 ring plant. A top/bottom band read passes a ring with no sides.
  LIVE's ring gates should run `edge-bands.mjs` with the side-clip plant.
- **Any regime keyed on `pointer`:** 1x touch tablets (768×1024, 1024×768) and touch desks exist.
  Key paint on the box's device-pixel size.

## 6 · Replay route

1. **Build.** `<work>/web/frontend/.accg7crit/vite.build.mts` (`import base from '../vite.config.ts'`,
   cacheDir `<scratchpad>/accg7crit-cache-build`), `npx vite build --outDir
   <scratchpad>/accg7crit-dist-tree`, then `diff -rq` against `<scratchpad>/accg7/dist-b3`.
2. **OUTSIDE.** rsync the tree to `accg7crit-atk`, symlink `node_modules` and `csp-solver`, flip
   `TALLY_OUTSIDE` and build.
3. **Serve.** `vite preview` with a separate serve cacheDir on :4235 / :4237, and the control's own
   config on :4236, each verified by hash.
4. **Band.** `instruments/band.sh stamped band.crit.ts GATE=1` (the pass-6 stamped files copied in),
   then `band.sh tablet bandc.crit.ts GATE=1 STAT=lr RIGS=tablet,tabletL,deskcoarse,desk,phone`,
   then `band-x6.sh`.
5. **Wash.** `band.sh wash wash.crit.ts`.
6. **Clearance and 812.** `clear.sh`, then `occl.sh` (the prototype's `occl7.probe.ts` at
   812×375 TOUCH=1, SIZES=4).
7. **Source plants.** `python3 instruments/plants.py <atk>/web/frontend` (each restored in place).
   The Tailwind emission is proven by a build of the copy with both arbitrary-property plants.
8. **A.7.** `git archive 74a2b5d9 web .github scripts`, apply `pass6/integrate/s13-s7-s3.diff`, then
   `--check` pass6.diff and pass7.cum.diff.
9. **Battery.** `instruments/battery.sh tree <atk>` and `battery.sh control <w7-control>`, plus
   lint-lanes in the work tree.
