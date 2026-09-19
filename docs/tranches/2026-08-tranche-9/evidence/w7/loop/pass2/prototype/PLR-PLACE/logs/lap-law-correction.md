# G8 — the lap law, corrected against six measured arms

All six read off 127.0.0.1:4243, chromium, `iPhone 13` descriptor at 390 wide, the sheet opened
by a real press and settled 800ms, the drawer opened to reach the invite verb and shut again
before anything was measured, `scrollY` 0.

| vh | probe L | drawn `.pl-row` | sheet y | sheet h | sheet bottom | grid top | lap |
|---|---|---|---|---|---|---|---|
| 664 | 0 | 0 | 47.75 | 169.00 | 216.75 | 131.73 | **85.02** |
| 664 | 2 | 2 | 47.75 | 216.98 | 264.73 | 131.73 | **133.00** |
| 664 | 5 | 2 (clamped) | 47.75 | 216.98 | 264.73 | 131.73 | **133.00** |
| 844 | 0 | 0 | 47.75 | 169.00 | 216.75 | 221.73 | **0** (none) |
| 844 | 2 | 4 | 47.75 | 269.78 | 317.53 | 221.73 | **95.80** |
| 844 | 5 | 5 | 47.75 | 293.77 | 341.52 | 221.73 | **119.78** |

## What is exact

**The `−0.5·vh` term.** The grid's top is 131.73 at vh 664 and 221.73 at vh 844: a difference of
**90.00 px for 180 px of viewport**, to the hundredth, twice.

**The 24 px per row, at two rows.** 216.98 − 169.00 = 47.98 over two rows = **23.99 a row**. The
law says 24.0. The same step appears again from four rows to five: 293.77 − 269.78 = **23.99**.

**The zero-row constant.** lap(vh, 0) = sheetBottom + 200.27 − 0.5·vh = 47.75 + 169.00 + 200.27
− 0.5·vh = **417.02** − 0.5·vh. The law says 417.07. Δ **0.05**.

## What is wrong

### 1 · The law is indexed on the ROOM; the sheet draws `ROWS`

`ROWS = { tall: 5, short: 2 }` on `(min-height: 800px)`. At vh 664 the sheet draws at most two
rows, so every L ≥ 2 is the SAME sheet and the same lap. The law as written climbs at 24 px a
head forever.

```
    lap(vh, L) = 417.07 + 24.0·L              − 0.5·vh      as written
    lap(vh, R) = 417.07 + 24.0·min(R, ROWS(vh)) − 0.5·vh    corrected
```

Re-indexed, the 664 × L5 arm moves from **Δ −72.07** to **Δ −0.07**.

### 2 · A +4.7 px residual survives at four and five rows

| arm | measured | corrected law | Δ |
|---|---|---|---|
| 664 × 0 rows | 85.02 | 85.07 | −0.05 |
| 664 × 2 rows | 133.00 | 133.07 | −0.07 |
| 664 × 2 rows (L=5) | 133.00 | 133.07 | −0.07 |
| 844 × 4 rows | 95.80 | 91.07 | **+4.73** |
| 844 × 5 rows | 119.78 | 115.07 | **+4.71** |

The same constant twice, to 0.02 px. It is a term the law is missing, not noise. Candidates the
lane did NOT distinguish: the `.lobby-rows` flex `gap: 0.1rem` accumulating past two rows, the
`and N more` line's own rung (`--type-tag` + `padding-left`, which the 844 × 5 arm draws and the
844 × 4 arm does not), and a row carrying a qualifier being taller than a row that does not.
**Reported as a gap, not closed.**

### 3 · The 844 × 0 delta of 4.93 is the probe's artefact

The law predicts **−4.93** — no lap. A lap cannot be negative and the measurement clamps at 0,
so comparing a clamped reading to an unclamped law manufactures the delta. The right comparison
is `max(0, law)`, which gives **Δ 0**. The design is correct here; the gate's arithmetic was not.

## The tap half is unconditionally green

78 lapped-cell centre taps across the six arms. **Every one dismissed the sheet. Not one reached
a link, a button, an input or anything else focusable.** That is the incumbent `@mbabb` card's
twelve-stolen-cells defect (its GitHub link sits under them on chromium) cured by construction:
the sheet has no `@click.stop` and no focusable children, so a tap on it is a tap through it.
