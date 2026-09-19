regime: chromium · 4× · fast3g · cold · mobile   (cured arm: chromium · 4× · fast3g · cold · mobile)
base  : fold/refute/raw/cr-4x-f3g-cold-mob/base.jsonl · load { 6.39 7.59 9.02 } → { 7.51 7.50 8.83 }
cured : fold/refute/raw/cr-4x-f3g-cold-mob/cured.jsonl · load { 6.81 7.60 8.99 } → { 6.50 7.27 8.71 }
taint : base 0/0/0 · cured 0/0/0

### base — 3 windows
| w | encodes | discardedMs | encodeMs | lastEncodeMs | boardReadyMs | tbtMs |
|---|---|---|---|---|---|---|
| 1 | 28.0 | 679.9 | 1430.7 | 3255.5 | 1382.0 | 1059.0 |
| 2 | 28.0 | 636.6 | 1355.2 | 3130.3 | 1349.8 | 957.0 |
| 3 | 28.0 | 640.7 | 1379.7 | 3194.5 | 1355.0 | 978.0 |

### cured — 3 windows
| w | encodes | discardedMs | encodeMs | lastEncodeMs | boardReadyMs | tbtMs |
|---|---|---|---|---|---|---|
| 1 | 16.0 | 0.0 | 716.0 | 2491.9 | 1316.6 | 533.0 |
| 2 | 16.0 | 0.0 | 710.8 | 2481.2 | 1320.9 | 536.0 |
| 3 | 16.0 | 0.0 | 707.8 | 2525.2 | 1313.3 | 529.0 |

### the deltas, each against the arms' own spreads
| quantity | base median | base spread | cured median | cured spread | Δ median | outside both spreads |
|---|---|---|---|---|---|---|
| encodes | 28.0 | 28.0–28.0 | 16.0 | 16.0–16.0 | -12.0 | YES |
| discardedMs | 640.7 | 636.6–679.9 | 0.0 | 0.0–0.0 | -640.7 | YES |
| encodeMs | 1379.7 | 1355.2–1430.7 | 710.8 | 707.8–716.0 | -668.9 | YES |
| lastEncodeMs | 3194.5 | 3130.3–3255.5 | 2491.9 | 2481.2–2525.2 | -702.6 | YES |
| boardReadyMs | 1355.0 | 1349.8–1382.0 | 1316.6 | 1313.3–1320.9 | -38.4 | YES |
| tbtMs | 978.0 | 957.0–1059.0 | 533.0 | 529.0–536.0 | -445.0 | YES |
