# ACC-GRAPHITE — pass-3 PROTOTYPE (it runs)

Prototyper: Opus 5, 2026-09-18. Worktree `/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-40`,
branch `worktree-wf_f72f3b5a-83a-40`, cut from **`74a2b5d9`**. HEAD control = a second read-only
server on the main tree at the same commit. Both servers killed; `:4235` and `:4238` read refused.

## 0 · The replay, and the route taken

`git -C <pass-2 worktree>` is refused by the isolation (chair §"The base moved" anticipated it), so
the replay used the pass-2 diff **already banked** at `pass2/prototype/ACC-GRAPHITE/prototype.diff`
(14 files, +557/−151), applied `git apply --3way` — **14 of 14 clean, zero conflicts**. Fidelity was
then checked against the pass-2 worktree's own files by direct read (no git):

| result | files |
|---|---|
| byte-identical | 10 — `visual-regression.spec.ts`, `index.css`, `DigitCell.test.ts`, `gameCell.css`, `useSession.test.ts`, `useSession.ts`, `filterBudget.ts`, `HandwrittenGlyph.vue`, `HandDrawnGrid.vue`, `gridPaths.ts` |
| differ — and the difference is THE FOLD | 4 — `DigitCell.vue`, `GameBoard.vue`, `GameControlPanel.vue`, `useGameCell.ts` |

Every one of the pass-2 diff's added lines in those four files is present in this tree (36/36,
0 missing, verified line by line): the three-way merge kept pass 2's hunks and `74a2b5d9`'s
cure — `cellAuthors`, the attribution tape, the coarse tape's focus law, `focusout`. Nothing was
re-cut by hand to resolve, so there is no "resolved toward the fold" list to name beyond that.

## 1 · The band, in the ring's own space — the pass-2 15–16 px reading is CORRECTED

`getComputedStyle(ghost).strokeWidth` and `ownerSVGElement` box ÷ its own viewBox, read off the
SAME element, 8 arms (2 rigs × 2 themes × 2 engines), all identical:

| | desk 1280×800 | phone 393×699 dpr3 |
|---|---|---|
| ghost `<svg>` scale | **0.48916 px/u** (spec 0.48927) | **0.28071 px/u** (spec 0.28082) |
| outer pass · inner pass | 12 ghost u · 12 ghost u | same |
| fused band (22 u) | **10.761 px** | **6.176 px** |
| board scale · frame line | 0.636 px/u · 12 board u = **7.632 px** | 0.365 · **4.380 px** |
| **band / frame** | **1.410** | **1.410** |

G2's two-clause floor: 10.761 ≥ 10.0 desk, 6.176 ≥ 5.7 phone, ratio ∈ [1.35, 1.45] at both rigs,
both engines, both themes. The critique's 15–16 px was a PAINTED run (linejoin skirt + AA), not the
ring's own space; it is not refuted, it is a different number, and the family's sentence now hangs
on the one that is falsifiable off a single element.

`fill: none` on the outer pass in every arm. `.cell-ghost-retrace` `display: block` at focus and
`display: none` on the unfocused control (the negative control, all 8 arms).

## 2 · The tally — LAW A's ratio form, and the discontinuity the ceil form hid

Tied to a KNOWN written count (the progressbar's own `aria-valuenow`), never to keystrokes typed:

| arm | 3 written | 20 written | dash | `pathLength` | pose |
|---|---|---|---|---|---|
| desk chromium | valuenow 15% → **3 subpaths** | 100% → **20** | `none` | `null` | `matrix(0.968…)` |
| desk webkit | 7% → **3** | 43% → **20** | `none` | `null` | same |
| phone chromium | 7% → **3** | 43% → **20** | `none` | `null` | same |
| phone webkit | 15% → **3** | 100% → **20** | `none` | `null` | same |

Both engines paint the same k — the cut path has no phase to restart. At 0 written: 0 subpaths and
no node.

Tick: 45 u × scale × 0.968 = **27.70 × 6.16 px desk**, **15.90 × 3.53 px phone**, aspect **4.50**
at both rigs (gate 4.5 ± 0.3), `linecap: butt`.

`src/pencil/grid/HandDrawnGrid/lawA.test.ts` (born on the real generator, 6 cases):

- slots off the poses' own perimeter: `floor(3960.x / 70)` = **56**, four poses within 10 u
- **writable 56 → 56, 57 → 56, 58 → 56** ticks; the ceil form on the same three deals: **56, 29, 29**
- 4×4 E/M/H → 4/9/12 · 9×9 Easy 20 · Medium 46 · every board ≥ 57 writable → 56
- `tickMarksAlong` cuts exactly k subpaths, and the first tick's arc length is 45 ± 0.5 u on every board

## 3 · The ground wash

20 `.cell-peer` nodes on a 9×9 selection, **0 sub-unit-opacity nodes**, all 8 arms. The painted
value is byte-identical to `graphite@6%` over the card, read against a probe element in the same
document: `color(srgb 0.15 0.15 0.15 / 0.06)` light, `color(srgb 0.82 0.812 0.78 / 0.06)` dark.

`check-ink-pressure` now carries a FOURTH gate, `gateGroundRank`, cloned from `gateRank`:

```
grounds — what a mark sits ON, ranked against each other rather than against a floor:
  light  peer-cursor 0.04 < selection 0.06 = unit 0.06 < laminate 0.15
  dark   peer-cursor 0.04 < selection 0.06 = unit 0.06 < laminate 0.15
```

Closed three ways, each shown able to fail by `--self-test`: `ground-planted` (the unit wash
pressed to 12% — a wash climbing over the body it is the reach of), `ground-tie-broken` (the two
6%s become two numbers, so the admitted tie's own sentence is stale), `ground-per-theme`.
`node scripts/check-ink-pressure.mjs` exit 0; `--self-test` exit 0 (no vacuous gate).

**Reported, not smoothed:** the synthesis asked for `selection > peer cursor > hint laminate > unit`.
That is not what the cascade ranks — the laminate is the LOUDEST ground at 15% and the unit wash
TIES the selection body at 6% by design (`.cell-peer`'s own sentence: "tier 1's `fill-opacity`, one
number, not a second value"). The gate ships the measured order with the tie admitted and cited;
the synthesis's string is a claim about which ground outranks which in MEANING, which is MRK-WASH's.

## 4 · Authorship

Givens found by the aria-label the estate already writes ("given clue N"), never by the stroke
width the gate measures. Both engines, both rigs, after a hand has written:

| | given | entry | MAX ratio |
|---|---|---|---|
| desk | 6 u = 6.888 px | 4.5 u = 5.166 px | **1.3333** |
| phone | 6 u = 3.954 px | 4.5 u = **2.965 px** | **1.3333** |

≥ 1.30 in every cell measured (the value is a declaration, so max = median here); entry ≥ 1.6 px at
phone with room.

## 5 · The retired inks

On the LIVE root, all 8 arms: `--color-crayon-blue` **empty**, `--color-progress-ink` **empty**,
`--color-focus-sketch` **empty**. `consumers.mjs` (copied, re-pointed at this tree): all three at
**0 VAR / 0 CLASS**. `grep` over `src/` for `196, 181, 253` / `#2563eb` / `crayon-blue` /
`progress-ink` / `focus-sketch`: **2 hits, both inside the §6-hunk COMMENT** that names the token it
retires — prose, not a consumer.

## 6 · π — the surfaces this wave does not claim

`rect-census-fold.mjs` (copied), prototype `:4235` vs HEAD control `:4238` (`74a2b5d9`), PRM
emulated, board pinned by permalink, 2 routes × 3 viewports × 2 engines:

| | shared boxes | **moved** | max Δ | only in proto |
|---|---|---|---|---|
| chromium, 6 arms | 6,764 | **0** | **0.00 px** | +81 per route |
| webkit, 6 arms | 6,764 | **0** | **0.00 px** | +81 per route |

The +81 is one node per cell — `.cell-ghost-retrace`, the ring's second pass, this family's own
structural claim. Zero boxes lost, zero boxes moved, both engines.

## 7 · The scripts, bare

`check-ink-pressure --self-test` 0 · `check-copy-register --self-test` 0 · `check-theme-tokens
--self-test` 0 (with the §6 hunk) · `check-motion-contract --self-test` 0 · `check-font-coverage` 0
· `check-prod-shake` 0 (against a dist built INSIDE the worktree with its own cacheDir) · `knip` 0 ·
`eslint` 0. `vue-tsc --build --force` 0. `vitest run` **69 files / 838 tests, 0 failed**
(832 at replay + 6 in `lawA.test.ts`).

F1's OFF arm: `const F1_SELF_INK = false` → `vue-tsc` **0**, and exactly the two F1 tests fail
(`binds nothing while you are alone…`, `moves your own digits when the epoch holder…`), which is
the arm's own definition. Restored to `true`; 32/32 green.

## 8 · r0 rows

- **L1 MOVED.** `law-probe.mjs` (copied, re-pointed) on this tree: `FILTER_BUDGET rows sum to 8`,
  so the row pinned to 9 reds. On the MAIN tree at `74a2b5d9` the same probe reads 9 and L1 is
  GREEN. Proposed re-cut banked at `instruments/law-probe-L1.diff`, unapplied.
- **L3 is RED at HEAD too** (1 admitted entry where the row expects B1's two) — not this lane's.
- Law 39, the R2 anchor list and `visual-regression.spec.ts:163` carried from research as
  PROPOSED diffs under `instruments/`, unapplied, per chair §6.11.

## 9 · What did NOT get measured (the gaps, named)

- **G0 segments** — the five-arm segment probe is not run. The mechanism is carried in the source
  prose (both `gridPaths.ts` and `HandDrawnGrid.vue` now name segment count, not syntax), and the
  tally's engine-identical subpath counts are consistent with it, but the section's own instrument
  is unbuilt here.
- **G2 rank** — `rank.probe.ts` ran and CANNOT SEE THE FUSED BAND: it ranks single strokes, and no
  single element paints 10.76 px (two paint 5.87 each). The heaviest single stroke on the board is
  now the **given clue's glyph at 6.888 px desk / 3.954 phone** — named as the runner-up, and worth
  the agglomerator's eye, since the 5→6 move made it so. Rank 1 holds only if the fusion is granted
  (10.761 / 6.888 = 1.56×, outside the 10% window), and that is arithmetic on my numbers, not a
  painted rank. **CARRIED RED.**
- **G2b** edge correlation σ, **G3's** `clearance.probe.ts` per-column median, the **painted** band
  run (11.6 ± 0.8), **G1/G1b** hue census solo and with a peer, **accent-kinship** with the proposed
  anchors, **R3** wobble σ — all unrun. The in-probe census returned `{}` on a selector that does
  not exist in this DOM (`.game-board`), which is an instrument defect, reported as one.
- **G4's** deck delta (+3.9%) and the `cell-light` golden's diff px — unrun, so the DECLARED delta
  is still the research's number, not re-derived here.
- **G8's live-dist** filter census — unrun. The source figure is exact (`FILTER_BUDGET` rows sum to
  **8**; `UNION_AREA` row 44,642 / coarse 5,743) and `prod-shake` passed on the worktree's dist.
- **G9** — print reads `glyph rgb(0,0,0)`, `grid rgb(0,0,0)`; the ring and tally rows read nothing
  because the print pose had no focused cell and no written digit, and `.attribution-tape` is absent
  solo, so the tape's print row is **untestable without a peer**. Forced colours: `outline-style`
  came back `none` under Playwright's emulation with a programmatic focus, which does not raise
  `:focus-visible` — **inconclusive, not a red**.
- **G6's** R5 I2 e2e and **G10's** guard census — unrun.

## Frames (4, cited, 65 KB total)

`frames/crop1-desk-light-k3-{chromium,webkit}.png` — the top strip at k=3, the paper between a tick
and the painted rule. `frames/crop3-phone-light-focus-{chromium,webkit}.png` — the focused cell and
its eight neighbours at 393 dpr3 light: the ring's round corner at 12 u and whether one heavy
graphite band reads as *your pencil is here* (the U-10 frame, §10 of the spec).
