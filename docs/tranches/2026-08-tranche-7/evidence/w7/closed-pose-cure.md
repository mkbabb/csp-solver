# W7 · the CLOSED-drawer pose comes inside its fence — 2026-08-03 addendum

Sibling of `overflow-768.json` (the OPEN pose, cured) and `closed-pose.json` (the CLOSED pose,
disclosed and handed off). This is the handoff, executed. The row named "the 768/720-tall
overflow" now closes WHOLE — see §5.

Surface: vite dev, `localhost:4247`, `?game=sudoku&difficulty=EASY`, `csp-drawer-open=0` for the
closed pose, chromium + webkit (playwright 1.61.1). Rig: `rig/closed-pose-cure.mjs`, one file,
both phases. Settle is polled, never slept — fonts first, then two identical measurement reads
250ms apart.

---

## 1. The defect, restated in one line

Closed, the desk grows twice: the board cap loosens `100dvh − 10rem → 9rem` (+16px, GameBoard's
scoped CSS) and the masthead takes `--logo-scale: 1.05` (+5.61px, App.vue). Neither growth asked
the page whether it had the room. At 768/720/800 it does not.

## 2. The threshold — 896px, DERIVED

Closed, the desk asks the page's height for four authored things:

| term | value | source |
|---|---|---|
| masthead at `--logo-scale: 1.05` | **124.53** (webkit 123.94) | measured, invariant across width — 1024/1280/1366/1440/1920 all read it |
| board | `min(46rem, 100dvh − 9rem)` | the 9×9 rung's own two numbers |
| `.board-margin` `margin-top` | **6.40** | `0.4rem`, authored one block above the cap |
| the strip's one caption line | **≤ 28.60** | `--type-body` ceiling `1.375rem` × `--type-leading-caption` 1.3 (typography.css) |

The column centres inside `.page-root`'s content box, so an over-tall column hangs HALF above the
fold and half below:

```
overflow      = (demand − vh) / 2
mastheadTop   = −(demand − vh) / 2          ← the same number, opposite sign
```

which is why every measured pair reads `ovf 6 / top −5.42`, `ovf 5 / top −4.83`, and so on.

**While the dvh cap binds, the pose cannot be saved by height.** Substituting `board = vh − 144`:

```
demand − vh = 124.53 + (vh − 144) + 6.4 + noteH − vh = noteH − 13.07
```

`vh` cancels. `noteH` runs 22.72–25.88 across the desktop widths, so the excess is **positive at
every height** — a cap that grows with the page can never be paid off by a bigger page. That is
the whole reason 1366×768, 1280×720, 1024×768 and 1280×800 all overflow by the same 5–6px and
none of it is a width problem.

The pose comes clean only where the **width** rung binds instead (`46rem` = 736; `85vw` exceeds
736 at every viewport this ≥1024 regime covers, so 736 always binds):

```
demand ≤ vh   ⇔   124.53 + 736 + 6.4 + noteH ≤ vh   ⇔   vh ≥ 866.93 + noteH
```

At the type ceiling: **866.93 + 28.60 = 895.53 → `min-height: 896px`**, width-independent by
construction.

Checked against the two cells the chair named, before either was touched:

- **1280×800** asks `124.53 + 656 + 6.4 + 23.61 = 810.54` of 800 — over by 10.54, predicting
  overflow 5.27 and masthead top −5.27. Measured: **−5.27 / ovf 6** (chromium), **−4.97 / 5**
  (webkit). So 800 sits below the gate.
- **1440×900** asks `124.53 + 736 + 6.4 + 24.19 = 891.12` of 900 — under by 8.88, predicting a
  masthead top of +4.44. Measured: **+4.45** (chromium), **+4.75** (webkit). So 900 sits above.

The derivation is not split between them: it lands at 895.53 on its own arithmetic and the two
cells fall on either side of it.

## 3. The cure — one condition, written twice

```css
@media (min-width: 1024px) and (min-height: 896px) { … }
```

- `GameBoard.vue` — the three `html.drawer-closed .board-shell.shell-*` **`max-width:
  calc(100dvh − 9rem)`** declarations move into the gated block; the WIDTH allowances stay
  ungated (below the gate the 10rem cap is the smaller number at every rung, so the widened
  width never renders).
- `App.vue` — `html.drawer-closed .masthead { --logo-scale: 1.05 }` moves into a block with the
  identical condition. The CENTRING (`align-items: center`, `.logo-menu align-self`) stays
  ungated: it costs the column nothing.

Plain CSS has no shared custom media, so the condition is duplicated and **each site names the
other** — the estate's pair idiom. They must flip together: gate the cap alone and the masthead
keeps its +5.61 over a board that gave back 16; gate the masthead alone and the cap keeps its
+16. Either half alone trades one overflow for another.

## 4. The proof

`closed-pose-cure-before.json` / `closed-pose-cure-after.json`. `ovf` = documentElement
scrollHeight − innerHeight; `top` = the masthead BOX's top; `bd` = `.board-shell`.

### CLOSED — the row

| cell | chromium before | chromium after | webkit before | webkit after |
|---|---|---|---|---|
| 1366×768 | ovf 6 · top −5.42 · bd 624 | **ovf 0 · top +5.38 · bd 608** | ovf 5 · top −5.13 · bd 624 | **ovf 0 · top +5.67 · bd 608** |
| 1280×720 | ovf 6 · top −5.27 · bd 576 | **ovf 0 · top +5.53 · bd 560** | ovf 5 · top −4.97 · bd 576 | **ovf 0 · top +5.83 · bd 560** |
| 1024×768 | ovf 5 · top −4.83 · bd 624 | **ovf 0 · top +5.98 · bd 608** | ovf 5 · top −4.53 · bd 624 | **ovf 0 · top +6.28 · bd 608** |
| 1280×800 | ovf 6 · top −5.27 · bd 656 | **ovf 0 · top +5.53 · bd 640** | ovf 5 · top −4.97 · bd 656 | **ovf 0 · top +5.83 · bd 640** |
| 1024×600 | ovf 5 · top −4.83 · bd 456 | **ovf 0 · top +5.98 · bd 440** | ovf 5 · top −4.53 · bd 456 | **ovf 0 · top +6.28 · bd 440** |

Below the gate the closed pose now reads the OPEN pose's geometry to the hundredth — same board,
same masthead top, same 0. 1024×600 was never in the row's name and is cured with it.

### TALL control — the grow must still apply

| cell | chromium | webkit |
|---|---|---|
| 1440×900 closed | ovf 0 · top +4.45 · **bd 736** · `--logo-scale: 1.05` | ovf 0 · top +4.75 · **bd 736** · 1.05 |
| 1440×900 open | ovf 0 · top +39.25 · bd 672 | ovf 0 · top +39.55 · bd 672 |
| 1920×1080 closed | ovf 0 · top +93.59 · bd 736 · 1.05 | ovf 0 · top +93.89 · bd 736 · 1.05 |

The grow is whole above the gate: the board still grows 672 → 736 on close (+64) and the wordmark
still takes 1.05. Before and after are byte-identical at both tall cells.

### OPEN control — the cap is untouched

Every open-pose cell is **byte-identical before and after**, both engines, at all seven
viewports (programmatic diff over the full measurement objects: *no drift, anywhere*).
The golden subjects hold: 1280×800 `.board-cells` **636**, `.sudoku-cell` **70.66** — the
numbers `overflow-768.json`'s golden control banked.

### BOUNDARY control — both sides of the flip are clean

The number is only worth its ink if neither side of it overflows. 1920×896 is the tightest cell
the gate covers (widest type ⇒ tallest caption ⇒ 892.81 of demand against 896 of supply):

| cell | chromium | webkit |
|---|---|---|
| 1366×895 (gate OFF) | ovf 0 · top +5.38 · bd 735 · no grow | ovf 0 · top +5.67 · bd 735 |
| 1366×896 (gate ON) | ovf 0 · top +2.58 · bd 736 · 1.05 | ovf 0 · top +2.88 · bd 736 · 1.05 |
| 1920×895 (gate OFF) | ovf 0 · top +4.41 · bd 735 · no grow | ovf 0 · top +4.70 · bd 735 |
| 1920×896 (gate ON) | ovf 0 · top +1.61 · bd 736 · 1.05 | ovf 0 · top +1.91 · bd 736 · 1.05 |

The tightest cell keeps **1.61px** of headroom against a predicted `(896 − 892.81)/2 = 1.595`.
And the BOARD is continuous across the flip — 735 → 736, one pixel — because 896 is exactly where
the two geometries meet. That continuity is the evidence the threshold is derived and not tuned.

### INK

The lane's probe, re-run: the top 6 scanlines across the wordmark's own x-span, pixels under
luminance 140 — **0 dark pixels**, chromium and webkit, before and after. After the cure the box
top is +5.38 rather than −5.42, so nothing is above the fold to clip in the first place. Crops:
`closed-pose-cure-{before,after}-1366x768-{chromium,webkit}.png` (top 150px band, drawer closed).
The visible trade at short heights, disclosed: the closed wordmark is now the open wordmark's
size (box 608 wide, not 624). It reads whole and centred in both engines.

### GATES

`e2e/drawer.spec.ts` + `e2e/zone-grammar.spec.ts` — **38 passed**, both engines, against this
port. drawer.spec.ts runs at 1440×900, above the gate, so its `board grows ≥24px` (64 here), its
page-axis check and its ≤6px close-glide drift bound all read exactly what they read at head.
This is the gate that born-RED the lane's first cut at 18.09.

## 5. FINDING 1 dissolves

> The W7 verify's FINDING 1 (MEDIUM) held that the "768/720-tall overflow" row must close
> PARTIAL, because the closed pose still overflowed 5–6px at 1366×768 / 1280×720 / 1280×800 and
> 5px at 1024×768 with the masthead's box top at −4.8 to −5.4.

**That partial-close is dissolved: the row now closes whole.** Both poses read overflow 0 with
the masthead box on the page at all four named viewports (and at 1024×600, which the row never
claimed), in both engines, with the OPEN pose byte-identical to the cure the lane banked and the
tall pose keeping its grow entire. The finding was correct when written and its named cure is
what landed.

## 6. Residue, disclosed

**The 16×16 desk above the gate.** One condition governs all three rungs. By the same arithmetic
each rung has its own threshold — shell-sm `124.53 + 448 + 6.4 + 28.6 = 607.53`, shell-md
**895.53**, shell-lg `124.53 + 896 + 6.4 + 28.6 = 1055.53` — and the gate is set at the desk's
own rung, the 9×9. So:

| 16×16 (`?game=sudoku&size=4`), closed | chromium | webkit |
|---|---|---|
| 1440×900 | ovf 6 · top −5.55 · bd 756 | ovf 5 · top −5.25 · bd 756 |
| 1366×768 | **ovf 0 · top +5.38 · bd 608** | **ovf 0 · top +5.67 · bd 608** |

Below the gate the 16×16 pose is cured with everything else. Above it, the pose is **unchanged
from head** — above 896 the gated block is byte-identical to the ungated one it replaced, so this
is head's reading, not a regression this cure introduced. Curing it needs shell-lg's own 1056
threshold, which would break the pair (the masthead cannot be rung-aware) and is a separate
election: the 16×16 board is three clicks deep in the Size well and no viewport matrix cell
renders it.

**Not measured here:** the closed pose under the landscape/portrait regimes (<1024), which this
gate never reaches, and the glide's per-frame behaviour across a viewport that straddles 896
mid-gesture (a resize during a drawer glide — the media flip lands in the same one layout step
the §6 contract already governs).
