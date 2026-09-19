# MRK-WASH · pass 1 (PROTOTYPE) — THE WASH, BUILT AND MEASURED

T9-W7 §5 / §6. The prototype is the PRODUCT: the diff lives in the worktree
`.claude/worktrees/wf_e58b4764-0fc-45` (branch `worktree-wf_e58b4764-0fc-45`, off `aab67b92`,
uncommitted), served by `npx vite --host 127.0.0.1 --port 4240 --strictPort` from that tree's
`web/frontend`. Nothing is injected for the prototype arm; the CONTROL arm restores HEAD's own
tier 2 by overlay, so every before/after pair comes from one session and one deal.

Two product files, 41 insertions / 10 deletions:

| file | change |
|---|---|
| `src/games/shared/gameCell.css:246-283` | tier 2 rewritten: `paint-order: stroke`, `--wash-a` / `--wash-rim-w` / `--wash-rim-o`, `wash-fill-in` on the ghost's own 180ms · `--ease-ghostDraw` · `backwards`; the false modality comment replaced by the measured sentence |
| `gameCell.css:119-131` | the rank written where the unit wash is declared |
| `gameCell.css:363-370` | `prefers-contrast: more` → `--wash-rim-o: 1` |
| `src/games/shared/DigitCell.vue:261-268` | `.cell-peer` gated `isPeer && !isPeerCursor && !isBecause` |

Nothing mounted: no node, no filter, no hex, no string. `index.css` is byte-identical to the
main tree's, so R6's hue census is unmoved by construction.

**Verdict: TAKE THE RIM, LEAVE THE BODY.** The family's whole measured gain is the rim
(3.68 → 3.97); the body raise from HEAD's 0.08 to the spec's 0.12 buys 2.2 L\* of separability —
still short of its own floor — and spends 0.28 of the digit's ratio, which the light theme does
not have. `--wash-a` therefore ships at **0.08**, which is the spec's own §1.5 escape clause
executed on the measured read.

---

## 1 · The gates

| gate | reading (chromium+webkit × light+dark, painted bytes) | verdict |
|---|---|---|
| **G-WASH-1** the mark by state difference | rim **3.92 / 3.93 / 4.00 / 3.98** minimum over four cells each — 16 cells, all ≥ 3.5; CONTROL (HEAD's 7px ring, same session) 3.68 / 3.69 / 3.76 / 3.76; edge ≠ body everywhere (body 1.08–1.10) | **GREEN** |
| **G-WASH-2** one ground per cell | `peerAlsoUnit: false` four-for-four (HEAD: true); unit cells 19/18 where HEAD paints 20; your cell out-reads the peer's on dL\* in every cell — 13.10 vs 2.20 · 5.90 vs 2.99 · 5.91 vs 1.95 · 12.66 vs 2.99 | **GREEN** |
| **G-WASH-3** the digit through the wash | glyph core **4.58 / 4.56** light, **6.56** dark at the shipped 0.08. At the spec's 0.12: **4.30** light — RED. At the §1.5 fallback 0.10: **4.45** — RED. At 0.09: 4.50 chromium, **4.49 webkit** — RED by one hundredth | **GREEN at 0.08 only** |
| **G-WASH-4** separability by dL\* | margin **0.70 / 0.67 light, −1.00 / −0.92 dark** at 0.08; **2.90 / 2.90 / 0.90 / 0.94** at the spec's 0.12. Never ≥ 3.0 at any alpha the digit permits | **RED, carried with its reading** |
| **G-WASH-5** the filter census in both schemes | chromium 9 light / **11** dark, webkit 9 light / **11** dark — re-derived under the prototype; the two extras are `svg.crayon-heart` `saturate(0.85)` (`CrayonHeart.vue:315`), pre-existing and wave-level | **RED at HEAD in dark, unmoved by this family** |

Guards, all green: population 16/81/256 ghost svgs and paths at 4×4 / 9×9 / 16×16, ghost
`filter: none`, `liveFilterTotal` 9 at every size, both engines · forced-colors `2px solid` at
`-2px` (`rgba(5,0,73,0.8)` chromium, `rgba(128,188,254,0.6)` webkit) · a11y 3.5 · access
2.1/2.2/2.3 · spoken-gallery 16/16 · tap = click = key (stroke `rgb(58,123,196)` 3px @ 0.95 on
all three, `tapFocusVisible: 1`) · phone trace 0 frames > 33ms over 12 interleaved runs.

`58 passed` on the estate's own `a11y.spec.ts` + `access.spec.ts` + `spoken-gallery.spec.ts`
against :4240, both engines. `vue-tsc -b` exit 0. `vitest run` **810/810** across 66 files.
`check-copy-register` 0 unadmitted (no string minted). Prettier and ESLint clean on both files.

---

## 2 · The digit is the wall, and it was already at the wall

The §1.5 hypothesis — that the lane's 4.30 was a box-sampler artefact including the glyph's
anti-aliased edge — is **REFUTED**. The glyph core, isolated by 4-neighbour erosion of the ink
set inside the cell's inner box, returns the box sampler's figure to the hundredth in all twelve
readings (4.58 / 4.58, 4.30 / 4.30, 4.45 / 4.45 …). There was no headroom hiding in the sampler.

The curve, light, chromium (`logs/sweep.json`):

| `--wash-a` | 0.08 | 0.09 | 0.10 | 0.11 | 0.12 | 0.14 | 0.16 | 0.18 | 0.20 |
|---|---|---|---|---|---|---|---|---|---|
| digit (glyph core) | **4.58** | **4.50** | 4.45 | 4.37 | 4.30 | 4.20 | 4.06 | 3.97 | 3.85 |
| selection dL\* | 3.71 | 4.42 | 4.85 | 5.24 | 5.91 | 6.98 | 7.80 | 8.87 | 9.62 |
| margin over the unit wash | 0.70 | 1.41 | 1.83 | 2.23 | 2.90 | **3.97** | 4.79 | 5.86 | 6.61 |

The digit clears 4.5 only at α ≤ 0.09. The +3.0 L\* margin arrives at α ≥ ~0.1225. **The windows
do not overlap in light** — the same shape of refutation the research lane found for "the wash
carries 1.4.11", one level down, on the body's other job. In dark both hold from α 0.18 up
(digit 5.54, margin 3.68), because the dark unit wash is itself louder: 5.00 L\* off the ground
against light's 3.01 for the same 7% token.

At HEAD the digit's headroom above the 4.5 floor is **0.08 of a ratio point**. Anything
translucent laid under it is spent out of a budget the tree has already nearly exhausted.

The rendered glyph is **45.9 px** tall, so if the wave scores the cell digit as large-scale text
(1.4.3's 3:1 floor, 24 px / 18.66 px bold) this row dissolves and the body is free to move. That
is a ruling, not a measurement, and it is not this lane's to make — but it is the only door out
of §2 that does not cost something else.

## 3 · G-WASH-4 priced from both sides

The gate asserts a DIFFERENCE, so it has two knobs. Both were swept whole, end to end, in both
engines (`logs/verify.json`, `logs/verify-rimonly.json`, `logs/unit-sweep.json`):

| arm | light digit | light margin | dark digit | dark margin | verdict |
|---|---|---|---|---|---|
| shipped (a 0.08, unit 7%) | 4.58 / 4.56 | 0.70 / 0.67 | 6.56 | −1.00 / −0.92 | G3 ✓ G4 ✗ |
| the spec (a 0.12, unit 7%) | **4.30** | 2.90 | 6.14 | 0.90 | G3 ✗ G4 ✗ |
| a 0.09 light / 0.18 dark, unit 3% / 7% | 4.50 / **4.49** | 3.21 / **2.96** | 5.54 | 3.68 / 3.72 | greens chromium, **misses webkit-light by 0.01 and 0.04** |
| a 0.09/0.18, unit 4% both | 4.50 / 4.49 | 2.89 | 5.54 | 6.13 | G4 ✗ light |
| a 0.08, unit 2% both | 4.58 / 4.56 | 2.90 / 2.87 | 6.56 | 2.72 / 2.76 | G4 ✗ by 0.10, unit nearly gone (dL\* 0.81) |

There is **no setting of the two alphas that greens G-WASH-3 and G-WASH-4 together in light**
while the unit wash is still visible. The nearest miss is a hundredth, and it lands on the wrong
side in WebKit — a margin that thin is not a design, it is a coin.

Three ways out, for the agglomerator, none of them free:

1. **Score the gate on the MARK, not the body.** The rim reads 3.92–4.00 against a unit wash at
   1.08; nothing about this selection is hard to find. G-WASH-4 scores the body alone because
   §1.4 wrote it that way, and §1.1 of the same spec says the rim is what carries the mark. The
   family can ask for its own gate to be restated — it should say so out loud rather than pass by
   a tenth.
2. **Quiet the unit wash instead.** 6% light / 4% dark clears +3.0 at the spec's 0.12 — but the
   spec's 0.12 is refused by the digit, so this only helps in combination with (3) or the
   large-text ruling. Banked either way: the same 7% token measures 3.01 L\* light and 5.00 dark,
   which is an inconsistency worth a row of its own. Under `prefers-contrast: more` the unit goes
   to 13% and the margin gets worse, not better.
3. **Split `--wash-a` by theme.** Dark has a real window (0.18–0.28); light has none.

## 4 · What the research lane left open, closed here

- **The one 34 ms WebKit frame is DISMISSED.** Unpaired, it reappeared (3 long frames over 5
  runs). Paired and interleaved — CONTROL and PROTO alternating in one process, 6 runs each —
  **717 control frames and 718 prototype frames, zero over 33 ms on either arm**, worst max 21 ms
  against 22 ms, medians 17.0 both. The earlier long frames were the machine, not the paint
  (`logs/frames-paired.json`).
- **R3-a (wobble) is unmoved and still RED**, exactly as §1.6 predicted: ring σ **0.092 px**
  against the grid's band [0.722, 2.886], both engines, identical to the r0 reading. The geometry
  is the same `wobbleRect`; only its paint changed. The family does not answer §5 on σ and asks
  the wave to score §5 on stroked marks ≥ 2 px visible width — which its own 0.85 px rim is not.
  **Carried RED with that reading beside it.**
- **π holds.** The r0 controls-estate structural census re-run against the prototype is
  **byte-for-byte identical** to the banked HEAD readings at all three viewports in both engines
  (`census-1280x800`, `-390x844`, `-900x500`). Zero rect deltas on every surface this family does
  not claim. `heading-voice.spec.ts` is still RED with the same numbers (20.35 px / 20.00 px =
  1.0175 on the dock) — N voices, not 1; this family does not claim §1.
- **PRM and prefers-contrast are proven, not asserted.** Every contrast reading in this lane was
  taken under `reducedMotion: reduce`, and the rim and body paint their cascade values there
  (`animationName: none`). Under `prefers-contrast: more` the rim goes 0.95 → 1 and the body does
  not move, both engines (`logs/contrast.json`).

## 5 · Gaps, stated

1. **The rank is enforced for one of three grounds.** The `v-if` drops the unit wash under a peer
   cursor and under the laminate. It does NOT stop the hint laminate composing with your own
   selection: measured, a selected cell that is also a `becauseCell` reads **13.10 L\*** off the
   paper against 5.90 clean (`logs/peer-rank.json`, chromium-light, cell 36). "One ground per
   cell" is therefore false as written. It is not obvious it should be enforced — the laminate is
   information, the other three are location — and the spec never says which the laminate is.
   **The agglomerator must rule: is the laminate a ground or a layer?**
2. **The peer cursor + laminate pair survives too**, for the same reason.
3. **The dark unit wash out-reads the dark selection body** at HEAD and under the prototype
   (margin −1.00). This is a pre-existing defect the family's gate surfaced; it belongs to the
   wave, not to this diff.
4. **§6 is empty from this family**, as its spec says. The cut-out is recorded in the synthesis
   as a ballot row; nothing was built for it here.
5. **The estate's `filter-census.spec.ts` was not run** — it asserts against the BUILT dist under
   `playwright-throttle.config.ts`, and this lane serves a dev server. The census numbers above
   come from the r0 π-guard instrument, which counts by the same rule.
6. **The 16×16 board was measured only for population and the filter census**, not for contrast:
   the rim's visible width scales with the board, and at 16×16 it is thinner than the phone's
   0.43 px. Pass 2 owes that reading.
7. **One deal, `?size=3&difficulty=EASY`.** Every contrast figure here is from the same board
   seed in each session. The four-cell repeat guards the sampler, not the deal.

## 6 · Files

- `probe/mark.mjs` — G-WASH-1/3/4 with HEAD restored as a same-session control; the glyph core by
  erosion · `probe/sweep.mjs` — the two windows per alpha, plus the glyph's rendered height ·
  `probe/unit-sweep.mjs` — the gate's other knob · `probe/verify.mjs` — whole configurations,
  end to end, both engines · `probe/peer2.mjs` — G-WASH-2 on `?wire=local` · `probe/phone2.mjs` —
  the phone pose, the frame trace, forced colors · `probe/frames-paired.mjs` — the interleaved
  control that dismissed the 34 ms frame · `probe/contrast.mjs` — PRM and `prefers-contrast` ·
  `probe/crops2.mjs` — the cited frames · `probe/lib.mjs`, `probe/pw.config.ts`,
  `probe/estate.config.ts` (the estate's specs against :4240)
- `logs/*.json` — every reading above
- `frames/a-desk-peer-{light-chromium,dark-webkit}.png` — 330×210, your selected cell, its unit,
  a peer's cursor two squares along inside that unit carrying ONE ground, a neutral neighbour
- `frames/b-phone-{light-chromium,dark-webkit}.png` — 393×699 dpr3 at 9×9, tapped

To re-run: symlink `web/frontend/node_modules` into `probe/`, serve the worktree on :4240, then
`node probe/<name>.mjs` from `probe/`.
