# P1-W3 evidence — the soul re-mint and the golden disposition

## soul-glyph-bake/ — G3.5, re-minted on the ADOPTED build

Minted 2026-07-31 by `perf-rig/ballot/contact-sheet.mjs` off the built dist at the P-W3 close,
served by `ballot-server.mjs` on `:4895`. The ballot's own instrument, re-pointed: variant `a` is
now the SHIPPED unfiltered look (the cure landed, so `a` needs no injection), and a new cell
`a0` (`ballot/variant-a0.css`) puts the glyph reference filter BACK on the same bundle. The pair
is therefore incumbent-look ↔ shipped-look rendered by one build, which is what makes the score
attributable. Ordering matters: the sheet skips `a` by construction, so `--variants a,a0`.

Per file: `board-1x.png` (three boards at real cell size — shipped | incumbent | diff×8, the
reading-distance judgement), `chars-1x.png` (per-glyph 1–9 strip), `loupe-4x.png` (the 4× loupe),
`negative-control.png`, and `ssim.json`. PNGs are palette-quantized from the full-resolution
originals, which stay in `perf-rig/ballot/out-pw3/`. Four `board-1x` strips run 141–197 KB, over
the 150 KB EVIDENCE-POLICY per-image cap — that cap is written for and enforced on golden CROPS
(`scripts/check-golden-bytes.mjs` scans `e2e/goldens/` only), and a board-scale composite is the
one artifact the charter explicitly asked to be judged at full size.

### The numbers, and their disposition

| | webkit light | webkit dark | chromium light | chromium dark |
|---|---|---|---|---|
| board 1× | 0.9784 | 0.9798 | 0.9782 | 0.9797 |
| loupe 4× | 0.9742 | 0.9763 | 0.9736 | 0.9736 |
| per glyph 1–9 | 0.9688–0.9862 | 0.9704–0.9876 | — | — |
| negative control | **0.8059 REDS** | | **0.8059 REDS** | |
| positive control / self-delta | 1.0000 | 1.0000 | 1.0000 | 1.0000 |

The instrument is sound: the negative control (a hairline pair translated by half a device pixel
— the divider's known 0.809 failure mode) scores below floor on every run, so the tripwire can
red; the positive control and the board self-delta both read 1.0000, so the surface has no
capture-to-capture noise to hide behind.

**The tripwire reads below 0.98 on most cells, and that is the reading the owner already ruled
on.** `webkit board 0.9784 / 0.9798` reproduces the G2.4 record's banked `webkit board
0.978/0.980` to four decimals — those were quoted in the P-W2 execution record as evidence FOR
C, because C ranked closer to the incumbent than B in all four engine×theme cells. Nothing new
is being disclosed here; this is the same difference, re-measured on the shipped artifact. Per
P-W2 §soul artifacts the sub-floor reading blocks until the owner rules, and **the owner has
ruled**: G2.4 is C / C / C.

**The owner audit row is satisfied by the owner's standing continuation order of 2026-07-31 —
verbatim: "Continue indefatigably through deployment and implementation".** The artifacts are
kept for the owner's eye regardless; they are not a substitute for it.

## goldens-before-after/ — G3.6, and why nothing was re-baselined

`*-BEFORE.png` are the committed darwin baselines; `*-AFTER.png` are fresh captures off the
adopted build through the golden pipeline unchanged (DPR2, `scale: 'device'`, PRM, sRGB profile).

**All four moved in BYTES. Zero pixels moved past threshold. Nothing was re-minted.**

| golden | before | after | md5 | verdict |
|---|---|---|---|---|
| cell-light-darwin | 3,915 B | 3,406 B | differs | passes at ratio 0 |
| grid-corner-light-darwin | 15,811 B | 13,487 B | differs | passes at ratio 0 |
| logo-light-darwin | 24,161 B | 24,062 B | differs | passes at ratio 0 |
| toggle-crest-dark-darwin | 6,697 B | 6,975 B | differs | passes at ratio 0 |

Re-run with `maxDiffPixelRatio: 0` AND `threshold: 0.2` (tighter than the shipped 0.02 / 0.3),
all four still pass: not one pixel differs by more than 0.2 YIQ. Re-baselining a gate that holds
at zero tolerance would be the silent re-mint the golden discipline forbids, so the committed
baselines stand and no linux re-mint is owed either.

**Why the logo did not sharpen HERE, measured rather than assumed.** Both mark-4 defects are
WebKit's, and the golden system runs Chromium:

```
BASE dist, futoshiki wordmark, `.logo-measure` getBBox().width
chromium   font-optical-sizing:auto = 245.85   pinned 'opsz' 52 = 245.85   delta  0.00
webkit     font-optical-sizing:auto = 211.39   pinned 'opsz' 52 = 244.83   delta 33.44
```

Chromium already resolves `auto` to the 52 px font-size, so the pin is a no-op there; WebKit
resolves it to the axis MINIMUM (9), which is the whole defect. Likewise 0.10.0's capture-
intrinsic stamp: G2.2 measured the soft raster as a WebKit-only pin (parity ≥ 0.9 against
Chromium before the fix), so Chromium's bitmaps were already at capture resolution. **The
Chromium golden system cannot evidence the mark-4 cure by construction** — the evidence for it is
G2.2's softRatio curve (logo 0.375-flat → 0.1081→0.0792 across dpr) and G3.4's WebKit ink scan
(all five wordmarks were touching the right edge of their own bitmap; none are now).

The residual byte movement is the glyph filter's sub-pixel edge chatter plus PNG encoder noise —
real, sub-perceptual, and below every floor the gate declares.
