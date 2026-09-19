# ACC-GRAPHITE — pass-2 PROTOTYPE (it runs)

Built 2026-09-18 by the pass-2 prototyper against `docs/…/pass2/synthesize/ACC-GRAPHITE.md`
and `pass2/CHAIR-RULINGS.md` (read first). Worktree
`/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_8630d340-e56-40`,
branch `worktree-wf_8630d340-e56-40`, base `a8fee1f5`. Uncommitted by instruction; the diff is
banked here as `prototype.diff` (14 files, +557 / −151).

Dev server 127.0.0.1:4235 (private `cacheDir`), preview of the worktree's own dist on :4238,
both killed. Three crops kept of the four allowed; 53 the instrument banked were deleted.

## What the replay carried

The pass-1 worktree could not be read through git from here (this agent is worktree-isolated;
`git -C <other worktree>` is refused by the harness), so the replay used the BANKED
`pass1/prototype/ACC-GRAPHITE/prototype.diff` — the same artifact, cited by the spec at 14
files / +441 / −141. It applied **clean, all 14 files, no conflicts** (`git apply --3way`);
HEAD had moved by docs only. `vue-tsc -b --force` exits 0 on the replayed tree and on the
finished one; the full unit battery is 66 files / 812 tests green.

Note for the agglomerator: `git apply --3way` STAGES what it applies, which would have hidden
pass 1 from `git diff`. The index was reset (`git reset`, worktree untouched) so
`git diff --stat` shows the WHOLE prototype, pass 1 and pass 2 together.

## The pass-2 deltas, in the plan's order

| file | what moved |
|---|---|
| `index.css` | `--ground-wash-unit` minted in the §INK PRESSURE block, OUTSIDE `LADDER`, 12% under `prefers-contrast: more`; **`--color-focus-sketch` RESTORED verbatim** (pass 1 deleted it; chair §6.1 — this lane reads §6's token, never writes it) |
| `gameCell.css` | `.cell-peer { background: var(--ground-wash-unit) }`; pass 1's `opacity: .06 / .12` rules die with their media arm |
| `HandDrawnGrid.vue` | LAW A at the caller (`TICK_INK 45`, `TICK_GAP 25`, slots/m/k per pose); `writable` REQUIRED (`?? 51` dies); `.progress-pose` → `scale(0.968)`; `.join-pose` back to HEAD's `0.984`; the dash comment re-cut to the bounded law |
| `gridPaths.ts` | `linearPathLength` exported (LAW A prices slots against the pose's own perimeter); `tickMarksAlong`'s docstring re-cut — the caller owns the law, the 4×-in-WebKit claim replaced by what pass 2 measured |
| `useSession.ts` | `inkIndex` is a `ref` (`.value` at five sites); `:315`'s "the incumbent blue" re-cut |
| `useSession.test.ts` | the adopt-AFTER-join unit (pass 1's before-join unit kept as a second regression) |
| `HandwrittenGlyph.vue` | the unreachable `var(--color-user-ink, …)` fallback dies |

Unchanged from pass 1 and re-verified: the sparkle glow's two `rgba(196,181,253,…)` shadows and
`transition: all` (dead), `filterBudget`'s sparkle row (dead, TOTAL 8), the 240 ms dashoffset
tween (dead), 6 / 5 / 4.5 authorship weights, the retrace ring at `RETRACE_INSET 10`.

## Gates, measured

| gate | reading | verdict |
|---|---|---|
| **G0 dash bound** | four declaration arms (attr/CSS × attr/CSS) × chromium/webkit × dpr 1/3, pose-0 `d`, `pathLength=1000`, `1000 1000` @ 750: painted share **0.167 / 0.167 / 0.167 / 0.167** chromium, **0.166 ×4** webkit at dpr 1; 0.165 / 0.164 at dpr 3. Spread **0.0 points** in every cell of the matrix | **DOES NOT REPRODUCE** the 0.921 WebKit arm — see §"What the section has to re-read" |
| **G0b subpaths** (new) | same page, same dash, SUBPATH count varied over one point list: 1 → 0.167/0.166, 2 → 0.367/0.363, 4 → **0.859/0.859**, 8 → 1.000/1.000 (chromium/webkit) | the 4× is real and **engine-identical**; it is a subpath effect, not an engine one |
| **G1 census** | chromatic share rest / focused / mid-board, desk 1280×800: chromium light 0.01913 / 0.01913 / 0.01913; chromium dark 0.01050 / 0.01050 / 0.01126; webkit light 0.01919 / 0.01919 / 0.01992; webkit dark 0.01048 / 0.01048 / 0.01125. Largest move **+0.077 points of viewport** | **GREEN** (±0.1 pt). Dark residue binned: 90–110° = 86.9% of chromatic px (the warm paper and the dark pencil themselves), 140–150° = 10.5% (the EASY chip), 250–260° = 0.47%; writing adds one bin, 10–20° / 726 px = the teacher's red conflict ring — a decided danger, not an accent this family paints |
| **G2 ring weight** | desk light chromium peak **15.0 px**, rank **1 of 81**, runner-up 9.49, margin 1.58, **0 rivals** within 10%; desk dark 15.0 / 7.83 / 1.92 / 0; mid-board 15.0 / 11.0 / 1.36 / 0. Band over the frame line (12 u = 7.63 px desk): **1.97×** | **GREEN desk**, both engines, both themes |
| | phone 393 dpr3: dark 8.33 / 4.89 / 1.70 / **0 rivals**; light **8.66 / 8.33 / 1.04 / 1 rival** (chromium), 9.00 / 1 rival (webkit) | **AMBER at phone light** — rank 1 holds, the "0 rivals within 10%" clause does not |
| **G2b edge correlation** | on the generators, 8 cells per board, deviation sampled at 256 equal arc positions against each pass's own ideal rect, the retrace read backwards: mean r **−0.042** (9×9), −0.134 (4×4), −0.073 (16×16); per-cell spread −0.732 … +0.684. Single-stroke control **1.000** | **GREEN on the mean** (< 0.35, far from the control's 1.000); **the per-cell max does not clear 0.35** (0.684 at 9×9, 0.697 at 16×16) — the gate has to say mean or max, and it does not. The spec's 0.269 is NOT what this instrument reads |
| **G3 tally form** | LAW A on the shipped generators, all four poses: perimeter 3960.2–3963.9 u. 4×4 (writable 11) slots 11, m 1, ticks 11; 9×9 (57) slots **56**, m **2**, ticks 29; 16×16 (163) slots 56, m **3**, ticks 55. `subpaths == min(ceil(written/m), slots)` **exact at k = 1, 3, 20, full on all three boards**; every pose agrees. Tick ink 45.00 u (min 44.99, max 45.01), **aspect 4.50** at every board | **GREEN** |
| | in the browser: stroke 6.36 px desk / 3.65 px phone, `stroke-dasharray: none`, `pathLength: null`, pose `matrix(0.968, …)`; painted runs = k (desk k3 → 2 runs, k20 → 10; phone k3 → 3, k20 → 20 — the phone deal has a different `writable`); tally ink over paper **14.87 light / 11.99 dark**, over-rule pixels **0 at k3 both engines**; first ink **4.00 px INSIDE** the board box desk, 2.75 px phone (pass 1: −3 px, i.e. into the rule) | **GREEN**, both engines |
| **G4 authorship** | declared 6 / 4.5 = 1.333; rendered clue 6.89 px vs entry 5.17 px desk, 2.96 px entry at phone (floor 1.6 ✓). Painted thickness ratio, clue over entry: **1.641** desk chromium, 1.641 desk webkit, 1.554 / 1.668 phone | **GREEN on ratio**; measured on ONE clue / ONE entry per arm, not the gate's 8 cells, and the deck delta was NOT re-measured this pass (see gaps) |
| **G5 kinship** | rows 4 and 5 GREEN both engines (no chromatic accent outside the token estate; the exceptions pay their toll). Rows 1/2 **FAIL**: the only non-kin accent is **`--color-focus-sketch`, 106.3° light / 105.0° dark from the nearest anchor** — because retiring `--color-crayon-blue` removed the anchor it was 1.9° from, and the wheel that remains is all warm. Row 3 fails as at HEAD (chromium: the control ring is not drawn in that token; webkit: no control reached by Tab — the subject-count guard, standing) | **RED, and it is a COUPLING, not a defect of this palette** — see §"What §6 has to carry" |
| **G7 consumers** | `196, 181, 253` → **0** in `src/`, `#2563eb` → **0**, `progress-ink` → **0**. `crayon-blue` → **3**, every one of them PROSE inside the restored `--color-focus-sketch` comment, zero `var()` or class references. Zero-consumer hex tokens: **`--color-focus-sketch` (0 var / 0 class)** | **AMBER** — the literals are gone; the one zero-consumer hex is the token chair §6.1 forbids this lane to touch |
| **G8 π** | `e2e/filter-census.spec.ts` against a dist built INSIDE the worktree, served on :4238: **12 / 12 pass**, both engines, both regimes, hovered and at rest. `FILTER_BUDGET_TOTAL` **8**; union row **44,642**, coarse **5,743** (the spec's 44,672 ± 2% → 0.07% apart). `law-probe.mjs` L1 re-cut in the copy: **GREEN at 8** | **GREEN** |
| **G-WASH** | 9×9 with a cell selected: `.cell-peer` nodes **20**, of which sub-unit-opacity **0**; sub-unit-opacity nodes anywhere on the board **0** (pass 1: 20). Painted wash `color(srgb 0.15 0.15 0.15 / 0.06)` light, `color(srgb 0.82 0.812 0.78 / 0.06)` dark — **byte-identical to graphite@6% resolved by the browser itself**, both engines, both themes. `check-ink-pressure` green with the token in `index.css` and NOT in `LADDER` | **GREEN** |
| **G9 forced colours / print** | focused cell's outline is the UA's own system colour (chromium light `rgba(5,0,73,.8)`, webkit `rgba(128,188,254,.6)`), style `solid`; `.cell-ghost-retrace` `outline-style: none` — the retrace paints no outline. Print: grid line, glyph and ring all `rgb(0, 0, 0)` | **GREEN**, with one hole: the tally was not measured under print (an unwritten board renders no ticks) |
| **G10 guard** | **NOT RUN this pass** | gap |
| **G11 scripts** | `check-ink-pressure` 0 (three scopes, the ladder strictly increasing in light / dark / print), `check-copy-register` 0 (0 em dashes, 2 admitted jargon, 0 unadmitted, 0 new strings), `check-font-coverage` 0 (no new glyphs), `check-motion-contract` 0 (34 specs, 34 declaring) | **GREEN** |
| **units** | `vue-tsc -b --force` 0; vitest **66 files / 812 tests**, 0 failed. ABLATION: with `inkIndex` put back to a non-reactive holder, **exactly one test reds** — the adopt-after-join unit — and pass 1's before-join unit stays green. The unit is born-RED against the `let`, and the two regressions are genuinely different | **GREEN** |

## What the section has to re-read: the dash law did not reproduce

The spec's §1 states the bound as WHERE THE DASH IS DECLARED: attribute mis-scales under
`pathLength` in WebKit (0.921), CSS is engine-identical (0.249 / 0.251). Run as G0 specifies —
one bare page, the board's own pose-0 `d`, `pathLength="1000"`, `1000 1000` at offset 750 —
**all four declaration arms agree to three decimals in BOTH engines, at dpr 1 and dpr 3**
(`readings/g0-dash-*.json`). There is no attribute arm and no engine arm in this instrument.

The variable that DOES move the painted share is subpath count, and it moves both engines the
same way (`readings/g0b-subpaths-*.json`): the identical point list cut into 4 subpaths paints
**0.859** in chromium and **0.859** in webkit, which is within a hand's breadth of the 0.921
that was attributed to WebKit. Dashing restarts per subpath; `pathLength` normalises per
subpath; four sides of a ring means four patterns. The frame path this lane read has ONE
subpath (`sourceSubpaths: 1`).

So: the shipped gauge's 4× is reproduced, and it is not an engine difference on this instrument.
Either the three lanes' subjects differed in subpath count, or the law's cause is elsewhere. The
handoff to §10 / W8 should carry the population and the MECHANISM AS MEASURED, not
"attribute-declared dasharray is a WebKit bug". This lane's meter is immune either way — it
carries no dash and no `pathLength` at all, and that argument is unchanged.

## What §6 has to carry

1. **The focus token is restored, and it is now the estate's only zero-consumer hex.**
   `--color-focus-sketch: #3a7bc4` is back verbatim at `index.css:219` and live at runtime
   (`#3a7bc4` on the dev root and in the built dist's CSS). No state this family paints reads
   it, so the palette survives on every MRK-LIVE candidate — and the row `consumers` prints is
   `0 var / 0 class`. §6 either re-points a ring at it or retires it; this lane may do neither.
2. **Retiring `--color-crayon-blue` collapses the kinship anchor `--color-focus-sketch` was
   measured against.** At HEAD the token sat 1.9° from the blue wax. With the wax gone the
   nearest anchor is crayon-green and the distance is 106.3°, so R2's kinship rows 1 and 2 go
   red on a token this lane does not own. The instrument's ANCHOR LIST is what moved; the
   r0 row is reported **MOVED**, and the re-cut belongs in §6's diff, beside whatever value the
   ring ends up with.
3. `--color-user-ink` now reads achromatic (C = 0), so the kinship instrument scores it "kin at
   0°" against an anchor that is itself undefined. That is a true statement about a wheel with
   nothing on it, not a passing row. Read it as MOVED too.

## Gaps, stated as gaps

- **G10 not run.** The armed-ribbon guard at 393 dpr3 with `hasTouch` on a dirty board was not
  measured this pass, in either engine. Pass 1's readings stand; the ribbon's code did not move.
- **G4's 8 cells and the deck delta.** The ratio is measured on one clue and one entry per arm
  (4 arms × 2 themes), not over 8 cells, and the deck's +3.89% ink delta was NOT re-measured:
  `HandwrittenGlyph.vue`'s weights are byte-identical to pass 1, so pass 1's deck numbers are
  carried, not re-derived. The wave record still has to DECLARE the delta.
- **No 16×16 browser arm.** LAW A at 16×16 is proven on the generators (slots 56, m 3, ticks 55,
  aspect 4.50, subpath identity exact) but never rendered in a browser this pass. Crop 2 is a
  9×9 at k = 20 standing in for the briefed 16×16 at k = 24.
- **G3's clearance is not the briefed instrument.** The gate asks for a tick-to-rule clearance
  median over ≥ 200 sampled columns with a tick-LENGTH floor. What is measured here is the
  pass-1 instrument's own reading: over-rule pixels **0** at k3 (desk, both engines) and first
  ink 4.00 px inside the board box — the same claim, read as "no tick ink lands on the rule"
  rather than as a per-column median. At k20 desk, 6 over-rule px survive (168 phone chromium,
  146 phone webkit), which the per-column instrument would price properly and this one cannot.
- **G2b's gate is under-specified.** Mean and max disagree (−0.042 against +0.684 at 9×9). The
  spec's 0.269 is a different instrument's number; this one is banked whole
  (`readings/geom-pass2.json`) so the adjudicator can pick the statistic before the gate lands.
- **Stale-CSS artifact in the first six proto arms.** `tokensDeclared["--color-focus-sketch"]`
  reads `""` in the arms that ran first and `#3a7bc4` in the last two, off the same server: the
  dev CSS had not re-transformed after the restore. The dist carries the token
  (`dist-throttle/assets/index-*.css`), and the kinship probe resolved it live at
  `rgb(58, 123, 196)` in all four of its arms. The `""` readings are the instrument, not the tree.
- **`check-ink-pressure` does not know about ground tokens.** It passes because
  `--ground-wash-unit` is outside `LADDER` and inside the one file `gateOwnership` allows. That
  is the mechanism the spec asked for, and it means the gate asserts NOTHING about the wash. If
  the ground rank is to be enforced, someone has to write that gate.
- **`e2e/visual-regression.spec.ts` still asserts `crayon-blue === ""`** (pass 1's edit). It is a
  correct assertion for this prototype and a row the agglomerator must reconcile if another
  family keeps the wax.

## Instruments

Copied and re-pointed (r0 is frozen; every copy writes to `readings/` here):
`instruments/consumers.COPY.mjs`, `instruments/hue-census.COPY.probe.ts`,
`instruments/accent-kinship.COPY.probe.ts`, `instruments/oklch.ts`, `instruments/lane.config.ts`,
`instruments/law-probe.COPY.mjs` (L1 re-cut applied from
`pass2/synthesize/ACC-GRAPHITE/instruments/law-probe-L1.diff`: population 9 → 8; reads GREEN at
8 on this tree). r0 rows reported MOVED: **L1** (filter population), **R2 rows 1/2** (the
kinship anchor list), **R2's `--color-user-ink` row** (its subject is achromatic now). R1 is
untouched and still reads RED exactly as at HEAD.

New this pass: `probe/geom.probe.test.ts` (G2b + G3 on the generators, run through
`probe/vitest.lane.mjs`), `probe/dash-g0.probe.ts` (the four declaration arms),
`probe/dash-g0b.probe.ts` (the subpath arms), `probe/wash.probe.ts` (G-WASH + G9).
`probe/proto-board.probe.ts` is pass 1's, re-pointed.

## Crops (3 of 4 spent)

- `frames/tally-k3-desk-light-chromium.png` — 300×44, the board's top strip at scale 0.968,
  light chromium, k = 3: paper between every tick and the rule.
- `frames/tally-k20-desk-light-chromium.png` — the same strip at k = 20 under LAW A (10 ticks,
  one mark, m = 2). Standing in for the briefed 16×16 crop, which was not rendered.
- `frames/ring-proto-phone-dark-chromium.png` — 393 dpr3 dark, the focused cell and its eight
  neighbours: the band's clearance to the neighbour's painted rule (3.65 px interior inset).

## Re-running it

```
ln -s <main>/web/frontend/node_modules/<each entry> <worktree>/web/frontend/node_modules/
npx vite --config probe/vite.lane.mjs --host 127.0.0.1 --port 4235 --strictPort
npx playwright test --config lane-probe/pw.config.ts <probe> --project=chromium --project=webkit
npx vitest run --config probe/vitest.lane.mjs
node instruments/law-probe.COPY.mjs ; node instruments/consumers.COPY.mjs
```

A worktree's `node_modules` must be a real directory of per-package symlinks, not one symlink:
vite resolves its config's temp bundle against the nearest REAL `node_modules` and, given a
symlink, wrote to `~/node_modules/.vite-temp` and then could not resolve `@vitejs/plugin-vue`.
