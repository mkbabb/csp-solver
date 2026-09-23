# ACC-GRAPHITE · pass-6 CRITIQUE (adversarial, non-author)

Critic: Opus, 2026-09-23. Base and π control `74a2b5d9`. I didn't write the charter or the prototype.
Read: pass-6 LAWS (P5), pass-6 CHAIR-RULINGS whole (addenda A.1–A.6), the pass-5/4/3 chairs, registry-v5
§2/§6/§9, the charter, the pass-5 critique, the prototype README and return, the four frames, the tree's
`git diff`, and the pass-6 INTERDIFF (the tree against `pass5/prototype/ACC-GRAPHITE/pass5.diff` applied
to a clean `git archive 74a2b5d9`: nine files, 741 lines, exactly the edits the README lists).

**Convergence: 75 % (72 at pass 5). Verdict: ADVANCE.** Streak 0. Not converged.

Replay: I rebuilt the tree with a two-line config (in-tree `.accg6crit/`, cacheDir and outDir in the
scratchpad). The result is **byte-identical** to the cited dist (`index-CJfpLpblsaS5.js`, 43 files,
`diff -rq` empty). I also rebuilt the OUTSIDE arm from a scratch copy with ONE line changed
(`TALLY_OUTSIDE = true`). It reproduces the prototype's `index-xwWyGr8rbYJq.js`, so that ballot has
one variable. Servers: tree :4243, control :4244 (`index-CubiZsMVSwTc.js`, verified by hash), OUTSIDE
:4245. I killed all five PIDs (listeners 41702/41722/57790, parents 41636/41638/57761), and the
three ports read free. I ran every gate attack on a scratch COPY of the tree (`<scratchpad>/accg6crit/atk`),
never on the tree. I moved the scratch config out with `mv` to `<scratchpad>/trash-accg6crit-1/`. The tree's
`git status` is 17 M + 3 ?? product files, +1423/−184, unchanged. I used no `rm` and ran no git in the
control. Summaries: `critique/ACC-GRAPHITE/readings/critic-readings.summary.txt`. Instruments:
`critique/ACC-GRAPHITE/instruments/`. No crop banked. I looked at all four of the prototype's.

---

## 1 · Re-measured by me, both engines

| row | prototype | mine | holds? |
|---|---|---|---|
| G2, `pass6/instruments/band.crit.ts` **unmodified**, GATE=1, `mintBoard(3,30)`, desk fine / phone 393×699 coarse (hasTouch, `pointer: coarse` + focus-visible asserted) | 1.370 / 1.443 / 1.403 / 1.421, exit 0 | **1.370 / 1.443 / 1.403 / 1.421 (cr desk / cr phone / wk desk / wk phone), exit 0**; band 9.523 / 5.689 / 9.758 / 5.607; frame t/b/l/r desk 3.12/3.88/7.389/7.317 | yes, to the thousandth |
| G2 negative (the control dist as the tree arm), same batch | exit 1 | **exit 1** (0.300 / 0.270 / 0.300 / 0.118) | yes |
| G2 against the frame's own P45 / P55 (printed by the stamped instrument, same bytes) | not quoted | P55: **1.349 cr desk (RED)**, 1.383, 1.426, 1.410 · P45: **1.687 / 1.800 / 1.733 / 1.816 (all RED)** | new: the landing lives only at the median sample (§2.1) |
| tick over glyph, 16×16 INSIDE, 1280×800 light | 431 / 19,378 cr · 451 / 19,320 wk | **431 / 19,378 · 451 / 19,320** | yes, to the pixel |
| same, OUTSIDE arm (my one-line rebuild) | 0 / 0; outside the svg 4,717 / 4,735 | **0 / 0; 4,717 / 4,910 and 4,735 / 4,935 outside the svg**; pose bbox y 111.6 vs svg top 124.5 | yes |
| **new: 16×16 at 393×699 coarse (hasTouch)**, INSIDE | not read | **171 / 7,115 (2.40 %) cr · 190 / 7,126 (2.67 %) wk** | the phone collides too |
| **new: OUTSIDE at 393×699 coarse** | not read | **0 / 7,115 · 0 / 7,126**; 1,573 / 1,632 and 1,643 / 1,708 tick px (96 %) outside the svg; pose x 12.5–382.9 vs svg 14–379, viewport 393; **no clipping ancestor** (overflow/clip-path walk empty) | clears; the same off-paper price at phone |
| unit born-REDs (attack copy) | floor 1 failed · FRONT_MIN_MS 0 1 failed · caret `return 6` 1 failed | floor **1 failed** · FRONT_MIN_MS 8 **1 failed** · caret `<` dropped from the rule **1 failed** · restored 16/16 | yes |
| `filter-census.spec.ts` (the tree's spec) vs tree dist / control dist | 6/6 per engine | **tree 12 passed** (both engines); the tree's spec against the **control dist reds 4** (G3.1 + G3.3 per engine: the sparkle's drop-shadow is still there) | the census can see the deletion |
| battery, bare, tree / control | all 0 | copy-register 0/0 · theme-tokens self 0 · ink-pressure 0/0 + self 0 · lint:theme-tokens 0 · lint:lanes 0 · lint:sleep 0 · test:e2e:projects 0 · check-pw-projects 0 · check-property-block 0/0 · undefined-token census 1/1 (0 findings + the ONE declared `STALE --refuse-dur`, A.1 ruling 4 → GREEN) · `eslint .` 0 · `npm run lint` (scoped prettier) 0 · `vue-tsc -b` 0 | yes |

Not re-run by me: AA (sensitivity rows), π, G10, seam, vitest whole, knip, visual-regression, multiplayer.
The π summary's class list matches the diff's declared set line for line (I read the summary and the
diff; I didn't re-shoot π).

## 2 · Gaps first

### 2.1 G2 lands only under the STRUCK statistic, at the bimodal seam (open; the family's central claim)

- **A.1 ruling 1 struck the perimeter median** as bimodal and RATIFIED the per-side statistic. The
  tree's "LANDED" row uses the struck one. Under the ratified statistic (band vs the t/b median) the tree
  is RED at **2.49–2.79** (the prototype's reading; my stamped run prints the same sides). "The pass-6
  number lands" is not a finding under the law in force.
- **The landing is a property of the median's position, not of the band.** On the same bytes, the band
  over the frame's P55 reads **1.349 at chromium desk (RED, under 1.35)** and over the P45 **1.69–1.82
  everywhere (RED)**. One percentile either side of the median reds the gate. That is the struck
  statistic's disease, reproduced on this tree.
- **The margins sit inside the instrument's own error.** 1.370 is 0.14 px of band over the floor at
  desk. 1.443 is 0.03 px under the ceiling at phone. The stamped error is ≤ 0.169 px. The sweep puts
  inset 8.25 RED at chromium phone (1.467).
- **The prototype's objection is REAL and I accept its mechanism.** The top and bottom frame lines touch
  the svg's edge row in 100 % of columns, and an extended crop reads the same widths. The frame's t/b
  strokes are half-clipped by the 1000×1000 bakes (`FRAME_Y_PAD = 0`) on HEAD and on this tree in both
  engines. **The consequence runs against the landing.** The perimeter median sits near 7 px only
  because two of its four sides are clipped. If the estate un-clips the frame (a HEAD defect, §5),
  the perimeter becomes ~7.35 px. The tree then reads the l/r ratio: **1.294 cr desk / 1.330 wk desk,
  RED**. **Closable:** the chair names G2's frame statistic in light of the clip (the whole-stroke l/r
  pair is the only side that isn't cut). Then either a band lands in [1.35, 1.45] at BOTH rigs under
  that statistic, or the family states that no single inset can (inset 8: l/r 1.294 desk / 1.399
  phone; inset 10: 1.414 / 1.51, so the desk wants heavier and the phone lighter). In that case it
  builds a rig-keyed band (one inset per regime, keyed on ONE predicate, LAWS P5) as the arm.

### 2.2 Three of the four re-cut gates still pass a broken tree on the same class (new; the THIRD pass for this family)

Each re-cut closes the plants its critic named and fails a sibling of the same shape (LAWS P5: a gate
that enumerates plants is cured for those plants, not for the class):

- **`check-theme-tokens` RETIRED (row 4)**: exit **0** on a Vue `:style="{ '--color-crayon-blue': '#4a90d9' }"`,
  on a TS style object `{ "--color-crayon-blue": … }`, and on a same-line `url(//a.b/c.png); --color-crayon-blue: …`
  inside an SFC `<style>` (the `//` stripper eats the declaration). The quoted-key style object is **the
  estate's own publisher shape**. `playerIdentity.ts:70` (in this diff) publishes `--color-user-ink`
  that way, and so do `BoardHost.vue:78`, `DigitCell.vue:311` and `OptionSelector.vue:62–77`. `index.html`
  sits outside the scan (exit 0). **Closable:** the declaration regex accepts a quoted key
  (`["'\`]--tok["'\`]\s*:`), the `//` stripper never runs inside CSS text (SFC `<style>` included), and the
  quoted-key plant joins the self-test beside the five it has.
- **The wash-step gate (row 5)**: exit **0** on `.dark .cell-peer { --ground-wash-unit: …3% }` in
  index.css, and on `@media (prefers-contrast: more) { html:is(.dark) {…3%} }` and `{ .dark body {…3%} }`.
  Under each escape the gate still PRINTS "base 6 % 1.115 dark" and "more 12 % 1.281 dark" while the
  cascade paints 3 % at the consumer. It resolves "on `<html>`", but the token is INHERITED and read at
  `.cell-peer`: any rule on an ancestor-or-self of the consumer wins. **Closable:** read every
  declaration of the token whatever its selector (descendant, `:is()`/`:where()` included), class each
  by the theme it can reach, and red any rule that can reach a consumer with a value under the base arm's
  floor. The descendant plant becomes self-test mode 6.
- **The R1 re-cut (row 8, PROPOSED)**: exit **0** when the family's OWN second pass is painted chromatic:
  `.game-cell:has(input:focus-visible) .cell-ghost-retrace { stroke: #3a7bc4 }`. The ring-literal clause
  keys on `.cell-ghost-path` only. It also exits 0 for a ring token whose value is `royalblue` or
  `lch(50% 60 250)`, and for a ring literal `royalblue`: `chroma()` reads hex/rgb/hsl/oklch and scores
  every other colour space and every named colour as 0. Script-published tokens (`playerIdentity.ts`)
  aren't censused at all (the census reads `.css`/`.vue` only). **Closable:** the ring clause keys on
  BOTH ring paths (`.cell-ghost-path` and `.cell-ghost-retrace`, and any `:focus-visible` paint rule under
  `.cell-ghost`); chroma resolves named colours and lab/lch/oklab/hwb/`color()`; the retrace-hex and
  named-colour plants join `--self-test`.
- The fourth re-cut (row 6's non-integer ratios) and the new caret row (row 7) hold: floor reds, and a
  caret rule narrowed to `>` alone reds.

### 2.3 The 16×16 tally: both arms built, neither is clean (owner; priced)

The prototype read INSIDE at desk only. At 393 coarse it also collides (171 / 190 px, 2.40–2.67 %).
OUTSIDE clears the glyphs at both rigs (0 px), but 96 % of its ticks sit off the svg at both rigs, over
the card's edge and shadow (desk frame, looked at). No ancestor clips it at 393. The ballot is lawful:
one payload, one variable, and I reproduced the hash with a one-line build. The default stays INSIDE,
and the ballot says so, NOT clear. **Closable:** the ballot row quotes the phone numbers beside the desk
ones. The 9×9 "dashed rule" reading stays the owner's.

### 2.4 Carried open (the prototype's own gaps, confirmed or not contradicted)

- **G10 WebKit** 53.6–59.8/s against 62.5 (green 5/5, room ≤ 8.9/s). It carries FIVE's A.6 forced-write
  fault verbatim. The cure is FIVE's, so the fold row is "take FIVE's cured `frontGate`, not the pass-5
  copy". The WebKit native clock reads 58.8 Hz: REPORTED. Note that the unit row cannot tell the fault
  form from A.6's cure form: `now - last < FRONT_MIN_MS - 1` passes 16/16.
- **The chip pair** (OUTSET-110) is buildable and captioned (registry-v5 §9's condition), but it still
  moves TWO declarations (scale 1.1 AND 12 → 10 u). §6.12 called that unlawful, and a scale-only arm
  (stroke 12) is UNBUILT, so the owner can't separate placement from weight. **Closable:** build the
  scale-only arm and frame it on the same payload, or have the chair rule that "placement at constant
  painted weight" is one variable.
- **`visual-regression` light 11/12 vs the control's 12/12**: the §6.11 fold row (the pass-4 proposed
  spec diff in the same commit as the crayon-blue deletion).
- **Law 39's hunks** ride on MRK-LIVE behind the fork's const (§6.6). This tree still paints the ring
  with `var(--color-pencil-graphite)`, never `--ring-ink`. The fold re-points it.
- **Unrun this pass**: G1/G1b, G4, print, forced colours, goldens, R3 σ, F1, and the `more` wash arm
  painted (it is arithmetic only). The fill tally's per-event rate is unmeasured (0 `d` records).
- **The seam probe is blind at 1 u** (`second-1` reads solid; the desk negative reads only 6.3–7.8 %).
- **The wash drops HEAD's hue cue** (207° → achromatic): U-10, priced.

## 3 · Checklist

- **Gates that cannot fail (on the claim they carry):** RETIRED on the quoted-key publisher shape;
  the wash gate on descendant or `:is()` scopes; R1 on the retrace and on non-hex colour spaces (§2.2).
- **Vacuous convergence:** G2 "lands" on a struck statistic, at the one percentile where the bimodal
  frame puts its median, with margins under the instrument's error (§2.1).
- **The elegant-reduction trap:** "the chair names the statistic". The prototype's own sweep shows no
  single inset lands the whole-stroke statistic at both rigs, so the hard part (a rig-keyed band) is
  still ahead (§2.1).
- **Unverified gestalt:** the OUTSIDE arm was framed at desk only. I read its phone numbers; the
  phone-OUTSIDE look has no frame, so its "off the paper" price at 393 is stated from numbers, not seen.
- **The constraint it forgot:** A.1's ratified statistic, cited but not gated. Everything else is
  clear:
  - M16 0/0;
  - filterBudget: the census sees the sparkle deletion, and the control reds the tree's spec;
  - @property: check-property-block 0;
  - the undefined-token census: 0 findings + 1 declared STALE row;
  - W2's landed mechanics: no scene/dock/tab/sticky file in the diff;
  - π: the declared set matches the diff.
- **Clear:** legacy aliases (none; DifficultyTally is back to HEAD, byte for byte); masked fallbacks (the
  `--color-user-ink` fallback stays deleted); consumer-less substrate (knip 0, and `FRONT_MIN_MS` is read
  by its unit row); generic-default tells (none); the decided history is booked MOVED (R1, law 39, R2,
  kinship, §6.11), with L1 cited as the chair's ceiling.

## 4 · Strengths

- Everything I re-ran reproduces to the pixel or the thousandth: the dist hash, G2's four ratios and its
  negative control, the 16×16 collision, the OUTSIDE arm's hash from a one-line build, and three
  born-REDs.
- The pass-5 rate defect is cured the right way. DifficultyTally goes back to HEAD, removing a consumer
  rather than gating a front that had no fault to cure. The one real consumer (the join ring) commits
  through the section's primitive, with the rate row and its ablation shown in both engines.
- The prototype found a real HEAD defect while defending its gate: the frame's top and bottom strokes
  are half-clipped by the raster bakes, in both engines, on the control. That finding is worth more
  than the landing it was used to argue for.
- The return rejects its own optimism. It says G2 lands only "by a hair" and not under A.1. It says the
  tally default is NOT clear. It declares the stray write into frozen `r0/` and the void AA run.

## 5 · Cross-pollination

- **The raster-bake owners (MOT-VERB / the T9-M20 draw-in intake, and whoever owns `FRAME_Y_PAD`):** the
  board frame's top and bottom strokes paint at half width on HEAD (3.1–3.9 px against 7.3–7.4 px for
  left and right at desk, 100 % of columns touching the svg edge, both engines). It is an estate row,
  not this family's. Every "× the frame" statistic in the wave rests on it.
- **Every lane with a token census (PAL-TIN, PAL-WALK, MRK-LIVE, ACC-SIX):** the estate publishes
  custom properties through quoted-key style objects (`:style="{ '--x': … }"`, `{ "--x": … }`), which a
  `--tok\s*:` regex can't see. Read inherited tokens at their consumer, not at `<html>`.
- **Every chroma test (ACC-FIVE's corridor, TIN, WALK):** named colours and lab/lch/oklab/hwb/`color()`
  read as achromatic in a hex/rgb/hsl/oklch parser.
- **ACC-FIVE:** the `frontGate` unit row can't tell the A.6 fault from its cure (`FRONT_MIN_MS - 1`
  passes). The cure needs its own row (a 15 ms gap swallowed, a 16 ms gap committed).
- **MRK-LIVE / the §3 integrator:** the ring has TWO paths now, and every ring rule, census and plant
  keys on both.

## 6 · Replay route

Rebuild: in-tree `.accgX/vite.build.mts` (`import base from '../vite.config.ts'`, cacheDir in the
scratchpad), `npx vite build --config … --outDir <scratch>/dist-tree`, then `diff -rq` against
`<scratchpad>/accg6/dist-final`. For the OUTSIDE arm: rsync the tree's `web/frontend` (no node_modules
or dist) to a scratch dir; symlink `node_modules`, `csp-solver/data` and `csp-solver/wasm/pkg`; set
`TALLY_OUTSIDE = true`; build. Serve with `vite preview` on a free port in the band beside the control's
`.vite-control.config.ts`, verified by hash. G2: `instruments/g2.sh` (the stamped `band.crit.ts`
copied beside `band-lib.ts`/`band-stat.mjs`, GATE=1, then the control as the tree arm). Occlusion:
`instruments/occl6.geo.probe.ts` (the prototype's probe plus a clamped pad and a geometry/clip-ancestor
read), SIZES=4, desk and `VW=393 VH=699 TOUCH=1`. Gate attacks: `plant-append.py` / `plant-wash.py` on
a scratch copy, restored by `cp`. Units: `instruments/unit-plants.sh`. Battery:
`instruments/battery.sh`, plus `eslint .`, `npm run lint` and `vue-tsc -b`, all bare.
