> **SPENT 2026-09-17, by the chair seal (lane S1).** Its subject is now the dated ADJUSTED note at `../../../waves/T9-W3-spoken-product.md` §3.1: the chair ruled CENTRE-UNDER-SHEET the metric of record (81/63/54) and named the cure MODAL, and `e2e/spoken-controls.spec.ts`'s header was aligned to the same metric in the same commit.

> **NOT LANDED 2026-09-17** — `docs/tranches/2026-08-tranche-9/specs/T9-W3-spoken-product.md` is a wave spec and sits outside the Restamp lane's fence (which names the two formation records, the README pins, the manifest and the stamp, and no spec). The occlusion census there is still stale against 3C's own measurement; the literal correction in this file stands and is owed to W7 intake or the chair.

# FA5-1 (W3) → the wave spec's occlusion figures are stale, and nothing corrected them

The chair's fold order carried a belief worth checking: that lane 3C had already corrected
`docs/tranches/2026-08-tranche-9/waves/T9-W3-spoken-product.md`'s header. **It did not.**
Verified at the tree, 2026-09-17:

- `git status --porcelain docs/tranches/2026-08-tranche-9/waves/T9-W3-spoken-product.md` →
  empty. The file is untouched in this worktree.
- `grep -c CORRECTION` on it → **0**.

3C re-measured honestly and banked the honest table — in its own RETURN
(`../panel-3C.md` §3.1, from `../panel-census-head.txt`). The spec it was executing still states
the inherited numbers, so the spec and the wave's own evidence now disagree.

## The seam

`T9-W3-spoken-product.md:11` and `:16-17`, §3.1 "The occlusion law (the P0)":

```
The portrait controls sheet occludes 81/81 board cells and the grid stays tabbable
```
```
is `inert`. One mechanism, every viewport class it covers (V1/B1 measured 81/81 at
390×844, 63/81 at 768×1024, 46/81 at 820×1180).
```

Measured at HEAD on this tree, both engines, sheet up (`../panel-census-head.txt`, tabled at
`../panel-3C.md`):

| pose | covered / 81 chromium | covered / 81 webkit | focusable cells |
| --- | --- | --- | --- |
| 390×844 | 59 | 62 | **81** |
| 768×1024 | 47 | 46 | **81** |
| 820×1180 | 40 | 42 | **81** |

So `81/81` at 390×844 overstates coverage by roughly a third, `63/81` at 768×1024 is 47/46, and
`46/81` at 820×1180 is 40/42. Sheet shut: 0 covered at all three, the instrument's own control.

## What does NOT change, and why the row is still a P0

The **focusable** column is the P0 and it is unmoved: **81 of 81 cells take focus at every
pose**, and a Tab walk started inside the risen sheet landed on 20 covered cells with `.focus()`
succeeding on every covered empty cell (`../panel-born-red-e2e.txt`). The law §3.1 states — a
region painted out end to end must not answer — is untouched, and so is the cure that shipped.
Only the coverage census was inherited rather than measured.

Under the freeze law this is an APPEND, not a rewrite: a dated
`**CORRECTION (T9-W6 fold, 2026-09-17):**` block carrying the table above, with the original
lines left legible. The sibling form is already in the tree at
`../../formation/registry.md` and `../../formation/recap-matrix.md`, appended by this same fold.

Outside FA5's fence (which names the two formation records and no wave spec), hence this file.
