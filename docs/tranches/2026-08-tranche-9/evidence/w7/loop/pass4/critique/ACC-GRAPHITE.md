# ACC-GRAPHITE · pass-4 CRITIQUE (adversarial, non-author)

Critic: Opus 5, 2026-09-22. Base and π control `74a2b5d9`. I didn't write the charter, the spec or the
prototype. Read: LAWS, pass-4 and pass-3 CHAIR-RULINGS, registry-v3 §1/§2/§5/§6, the charter, the pass-3
critique, the pass-4 README, the work tree's `git diff` and its interdiff against `pass3.diff`, the four
frames, and the pass-4 READMEs of MRK-LIVE and ACC-FIVE plus their critiques, where they couple.

**Convergence: 68% (62 at pass 3). Verdict: ADVANCE.** Streak 0. Not converged.

Replay: my rebuild of the work tree (private cacheDir, outDir in the scratchpad) matches the
prototype's dist byte for byte (`diff -rq` empty, `index-p5CzZlhoZGR-.js`, 43 files). I served it on
:4245 beside the shared control dist on :4246 (`index-CubiZsMVSwTc.js`), with both ports checked by
asset hash. Both servers were killed by recorded PID and both ports now refuse. The tree's `git diff`
is still identical to `pass4.diff` after my runs. `.accg-crit/` and both vite caches are deleted.
`eslint .` exits 0 bare. `git status` shows product files only. Instruments and summaries are under
`critique/ACC-GRAPHITE/` (100 KB). I banked no new crop: the four-crop cap is full, and the prototype's
own `p4-tally-strips-desk-light-*.png` already shows the §2.2 defect.

---

## 1 · Re-measured by me, both engines (tree dist vs control dist, one encoded payload)

| row | prototype | mine | holds? |
|---|---|---|---|
| G8 filter census, tree dist | 12/12, budget 8 | **12/12 pass, chromium + webkit** (G3.1/3.2/3.3/3.5) | yes |
| G8 born-RED (tree budget vs control dist) | 4 RED, sparkle | **4 failed / 8 passed**: G3.1 + G3.3 × 2 engines, `drop-shadow(rgba(196,181,253,0.3))` | yes |
| G-WASH painted step, light | 1.12 (HEAD 1.078) | **1.120 / 1.120** cr/wk (HEAD 1.078 / 1.078) | yes |
| G-WASH, light + `contrast: more` | 1.262 (HEAD 1.143) | **1.262 / 1.262** (HEAD 1.143) | yes |
| G-WASH, dark | 1.112–1.114 (HEAD 1.10) | **1.112 / 1.114** (HEAD 1.104 / 1.103), both rigs | yes |
| wash hue | achromatic | tree `rgb(240,240,239)`, s 0.03; HEAD `rgb(240,245,249)`, h 207° | yes |
| AA, your digit on paper, painted | 14.87 L / 11.99 D | **14.869 / 11.994**, both engines, both rigs | yes |
| AA, band ink on paper | — | **15.06 cr / 14.87 wk** L; **11.99** D | AA+ |
| authorship given/yours, painted | 1.308 L / 1.321 D | **1.308 / 1.321** (HEAD 3.83 / 2.15) | yes |
| LAW A k (4×4 · 9×9 · 16×16) | 6 · 20 · 24 | **6 · 20 · 24** tally subpaths on the live DOM, both engines | yes |
| band α50, vertical (top/bottom sides; the prototype scanned horizontally) | 10.52–10.54 desk, 6.00 phone | **10.83 / 10.80** desk, **6.27 / 6.25** phone | floors hold |
| π, computed paint, every `body *` node (5 regimes × 2 engines) | 0 moved; +81 retrace; given 5→6; sparkle → none | **+81 / −0 nodes; 32 differ = 30 board givens 5→6 + sparkle filter → none + ONE MORE: `h1 … span.logo-caret svg path` 5→6** | no (§2.3) |
| gates bare | all exit 0 | copy-register (0 dashes, 0 unadmitted) + self-test, ink-pressure + self-test, theme-tokens + self-test, motion self-test, font-coverage, knip, prettier, eslint, `vue-tsc -b --force`: **all 0** | yes |
| VERB's undefined-token census copy | 137 declared, 0/0 | **137 declared, 0 timing / 0 other**. Its self-test run UNMODIFIED exits **2** (control 1 plants into VERB-only text), as the prototype declared | yes |

## 2 · Gaps first: what's open, and what I found that the return doesn't say

### 2.1 G2's ratio is still RED, and its denominator isn't one number

- **α50 is RED on both instruments.** The prototype reads 1.460–1.474 at desk. Mine, with the band
  measured on its top/bottom sides (10.83 px) over the left/right frame at the focused row
  (7.26/7.13 px α50), reads **1.50 cr / 1.50 wk** at desk and **1.46 cr / 1.52 wk** on the phone.
  Window [1.35, 1.45].
- **The mass form is sensitive to the instrument.** Mine reads 1.47–1.50. It includes ~0.24 px of
  neighbour wash per edge; with that removed it comes to ~1.43. So the one form the prototype
  proposes to bind to is GREEN or RED depending on the window's width by ±0.05. Proposing mass
  *after* α50 failed is the re-wording LAWS forbids unless the chair rules it. **I don't accept mass
  as the binding form.**
- **The painted frame is anisotropic at HEAD, identically on both arms** (`readings/frame-perimeter.txt`).
  At desk the α50 medians are top **3**, bottom **4**, left **8**, right **7** px, and the p5–p95
  range around the whole perimeter is 2–8 px. On the phone they are top 2, bottom 2, left/right 4.33.
  The outer half of the frame is clipped at the svg edge, and how much depends on the wobble. Against
  the top/bottom frame the band is **3.4×**, not 1.4×. G2 never names which frame statistic it binds.
- **The feasible region is sub-half-pixel.** With the frame at ~7.15 px, the ≥10.0 px floor and the
  ≤1.45 ceiling leave **10.0–10.37 px** at desk. Shipped 12+12 overshoots (10.52–10.83), and second-10
  undershoots (9.97). An 11 u second pass was not built.

### 2.2 The shipped tally occludes top-row digits at 16×16 (new)

I measured glyph ink against tick ink by toggling layers on one page (`instruments/occl.crit.ts`,
1280×800, light, LAW A's own k):

| board | ticks | top-row glyph px | **occluded by ticks** |
|---|---|---|---|
| 4×4 | 6 | 2611 / 2622 | 0 / 0 |
| 9×9 | 20 | 3316 / 3319 | 0 / 0 |
| 16×16 | 24 | 1490 / 1487 | **193 (12.95 %) cr / 197 (13.25 %) wk** |

The prototype's own frame shows it: the `16x16 ALONG (shipped)` row of
`p4-tally-strips-desk-light-{chromium,webkit}.png`, where the ticks sit on the tops of 1, 2, 3, 5, 6
and 7. The ballot says ACROSS "enters the glyph band" as a cost against it. The default ALONG already
does at 16×16, and no clearance row covers tick-to-glyph (G3 measured tick-to-rule at 9×9 only).

### 2.3 Undeclared π: authorship weight reaches the wordmark (new)

`HandwrittenGlyph.vue`'s 5→6 given weight applies to every `is-given` glyph, and the logo caret
(`HandwrittenLogo.vue:474`, `:is-given="true"`) is one. Tree vs control at 1280×800 dpr2:
**stroke 5→6 px; ink 188→232–235 px (+23–25 %); 113–115 px differ; both engines, both themes.**
The logo golden can't see it, because its locator is `svg.handwritten-logo` and the caret is a
sibling span. Futoshiki's clue carets (`FutoshikiCaret.vue`, `is-given`) take the same change,
unmeasured. The README's π row says "given stroke 5→6 (9 board, 58 gallery) … nothing else".

### 2.4 An estate e2e is RED on the tree, undeclared, and it lets crayon-blue re-mint (new)

The chair's §6.11 revert is correct, and it has a consequence the return doesn't state.
`visual-regression.spec.ts` "light mode: layout, styles, filters, DOM contract" **fails on both
engines on the tree** (`crayonVars.blue` Received `""`, :163) and **passes on both on the control**.
Because that spec still reads `getPropertyValue("--color-crayon-blue")`, `check-theme-tokens` counts
it as a reference. **Re-adding a dead `--color-crayon-blue: #4a90d9` exits 0** (mutation M4). So G7's
"no hex token with zero consumers" has no source-side guard for the token this family retires.
Re-adding `--color-focus-sketch` REDs correctly (M5).

### 2.5 A gate that cannot fail on the component (new): `lawA.test.ts`

The test restates LAW A in a local `lawA()` with its own `TICK_INK`/`TICK_GAP` and imports nothing
from `HandDrawnGrid.vue`. I reverted the COMPONENT to the ceil form the test was written to catch
(`k = ceil(written / ceil(writable/slots))`) on a scratch copy: **6/6 still pass**. The docstring
says "asserted on the same geometry it applies it to rather than on a restated constant", and it
restates both constants and the formula. **Struck (registry §2.10's form).** The re-cut: export the
law from `gridPaths.ts`, have `tallyFrames` consume it, and test the export. The live DOM k (6/20/24,
my §1 row) is the evidence that stands.

### 2.6 G-WASH's `prefers-contrast: more` arm is ungated (new)

Setting the more-arm to 3% (below the 6% base) leaves `check-ink-pressure` **exit 0** (M3). The ground
gate does go RED on 20% and on 5% (M1, M2: the tie breaks, both themes), so it can fail. It just
doesn't read the contrast arm. The declared floor, "never a smaller painted step than HEAD's" (1.12 vs
1.078; 1.262 vs 1.143), exists only in a probe. No estate row holds it.

### 2.7 Five unreachable fallbacks minted, in a form §6's leader strikes (new)

The diff adds `var(--color-pencil-graphite, var(--grid-line-color))` five times: index.css ×2 in
`--ground-wash-unit`, and gameCell.css ×3 in `.user-marks` and the tier-2 path and retrace. MRK-LIVE's
pass-4 diff strikes exactly this form in gameCell.css ("the property is declared at `:root`"). The
same diff strikes `var(--color-user-ink, #2563eb)` in HandwrittenGlyph with the argument "a fallback
that cannot be reached is a second value to keep in step". The tally in the same tree writes
`var(--color-pencil-graphite)` bare. At the fold this collides with LIVE's strikes.

### 2.8 The grafted `poseFronts` docstring describes a consumer this tree doesn't have (new)

ACC-FIVE's text came over verbatim (`gridPaths.ts:640–650`): "the fill gauge's front … the consumer
eases the FRACTION … calls this on a RATE-GATED subset of its frames (HandDrawnGrid) … never once per
vsync". This tree has **no fill-gauge front** (it is a tally), **no `frontGate` / `FRONT_MIN_MS`**
(grep = 0), and two ungated consumers: `DifficultyTally.frontOf` and `HandDrawnGrid.joinFrontFrames`,
which is a `computed` on the per-frame `traceProgress`. FIVE's critic measured the tally consumer at
134.2/s on a 128 Hz panel. The sentence is false where it ships.

### 2.9 Law 39 is reported as STANDS while the diff moves it; its hunks have no owner

R6 law 39 names the board form: "`--color-focus-sketch` ring at stroke-width 7 / opacity 0.9 drawn on
over 180ms". This diff deletes that token, and the ring becomes a 12+12 u graphite band at opacity 1
with `fill: none` (the tier-2×3 red fill 0.16 goes too). That is a MOVED row for the chair to book,
but the return says "STANDS per MRK-LIVE". LIVE's README (item 9) records these hunks **UNCARRIED**,
so at the fold they belong to nobody. LIVE also binds `--ring-ink` to the token this family deletes
(the prototype's own gap 9).

### 2.10 Carried from the prototype's own list, confirmed open

- **G4 deck ink** +6.8 % cr / +7.8 % wk vs the prediction of +3.9 ± 0.3: RED.
- **G2 rank p95** is 0.79 (junctions).
- **G9 tape print row** is untested (solo only).
- **The tally still reads as a dashed rule** (parallel duty 0.579 / 0.635): priced, not dissolved (U-10).
- **The wash drops HEAD's hue cue.** Selection is now shown by value step alone (U-10).
- **The chip at 393.** In the frames the focus still reads as a heavy square, with 0–0.99 px of paper
  to the grid line. The ballot's arms are near-indistinguishable: square-join equals shipped in
  straight rows, and second-8 fails both floors. The owner is being offered a choice without a
  visible difference.

**Not charged here:** R3 σ (the ring's σ is 0.08 px at HEAD too, so it is inherited, MRK's law), and
the section's violet/gold/graphite fork at one board (the leader's duty, ACC-SIX critique §2.6).

## 3 · Checklist

- **Gates that cannot fail:** `lawA.test.ts` on the component (§2.5); the theme-tokens guard on a
  crayon-blue re-mint (§2.4); ink-pressure on the contrast arm (§2.6).
- **Spec-cites-itself:** `lawA.test.ts` asserts its own copy of the law.
- **Masked fallbacks / legacy alias:** five unreachable `var(--color-pencil-graphite, …)` (§2.7).
- **The pixel it moves that it didn't declare:** the wordmark caret +23–25 % ink and the futoshiki
  carets (§2.3); tick-over-glyph at 16×16 (§2.2).
- **The constraint it forgot:** the decided history (law 39 misreported, §2.9); the estate e2e left
  RED and undeclared (§2.4).
- **Elegant-reduction trap:** G2 is "re-cut to mass and it's green". The frame has no single painted
  width (§2.1).
- **Unverified gestalt:** the ballot arms don't differ visibly at 393 (§2.10).
- **Clear:** AA (painted, both themes); filterBudget (8 ≤ 9 on the built dist, both engines, both
  regimes, born-RED shown); M16 (0/0); @property (none registered, `--ring-ink` not consumed);
  undefined-token census (0/0); W2's landed mechanics (no scene/dock/tab/sticky file in the diff);
  generic-default tells (none: an achromatic state layer, no eyebrows or cards).

## 4 · Strengths

- Every number I re-ran reproduces to the third decimal on both engines: wash steps, painted AA,
  authorship, LAW A's k at three sizes, the census and its born-RED. The dist is deterministic and
  `pass4.diff` replays byte-identically.
- Pass 3's hard reds are closed honestly. §6.11 is reverted. "Pressed twice" is restated to match the
  paint. `--color-user-ink` is booked MOVED with proposed census diffs. G8, G-WASH, G1, G6 and G9 all
  ran, with negative controls. The malformed/vacuous pass-3 L1 and kinship instruments are re-cut, and
  their vacuity is self-declared.
- The ground gate can fail (M1/M2). The census can fail on the control dist. G6's F1 arm REDs when
  flipped. The deletions are real: the sparkle glow, crayon-blue, progress-ink, focus-sketch, one
  filter row.
- The return's incidents are candid, and its gap list is mostly the right one. What it misses are
  surfaces it didn't visit: 16×16 glyph clearance, the wordmark, the estate e2e, and the component the
  unit test doesn't import.

## 5 · Cross-pollination

- **Every §3 lane, and PAL-TIN:** measure the frame around its whole perimeter (`instruments/perim.mjs`)
  before quoting any "× the frame" ratio. HEAD's frame paints 2–8 px depending on the side.
- **ACC-FIVE / ACC-SIX:** the tick-to-glyph occlusion probe (`instruments/occl.crit.ts`) for any mark
  riding the frame's inner edge at 16×16.
- **MRK-LIVE:** the fallback strikes in §2.7 and the law-39/focus-sketch ownership in §2.9 are one
  fold row.
- **Estate:** the logo golden's locator misses `span.logo-caret`. Any glyph-weight change needs the
  caret in a painted row.

## 6 · Replay route

Rebuild: `npx vite build` in the work tree with a two-line config and a private cacheDir, outDir in
the scratchpad; the result equals the prototype's dist. Serve with `vite preview` on :4245 beside the
control on :4246. Then run, in this order: `accg-crit-gates.sh` (bare); `playwright-throttle.config.ts`
filter-census projects with `PLAYWRIGHT_BASE_URL` set to each dist; `ring.crit.ts` (5 regimes × 2
engines, `hasTouch` on phone, regime witnessed by matchMedia); `occl.crit.ts`; `caret.crit.ts`; and
the estate `visual-regression` light test through a scratch config with no webServer. The mutations
(M1–M5, lawA) run on a scratch copy of src/scripts/e2e with node_modules symlinked, never on the
tree. `readings/frame-leftright-midrow.txt`: only its `fl`/`fr` columns are used (its band columns
merged with the col-3 box line).
