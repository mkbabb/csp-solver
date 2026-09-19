regime: chromium · 4× · fast3g · cold · desk   (cured arm: chromium · 4× · fast3g · cold · desk)
base  : fold/refute/raw/cr-4x-f3g-cold-desk/base.jsonl · load { 7.81 12.68 11.24 } → { 6.89 10.99 10.73 }
cured : fold/refute/raw/cr-4x-f3g-cold-desk/cured.jsonl · load { 6.86 12.16 11.09 } → { 7.50 10.87 10.69 }
taint : base 0/0/0 · cured 0/0/0

### base — 3 windows
| w | encodes | discardedMs | encodeMs | lastEncodeMs | boardReadyMs | tbtMs |
|---|---|---|---|---|---|---|
| 1 | 28.0 | 975.0 | 2027.5 | 3894.2 | 1386.7 | 1423.0 |
| 2 | 28.0 | 984.3 | 2055.5 | 3927.9 | 1382.0 | 1444.0 |
| 3 | 28.0 | 978.9 | 2041.0 | 3887.8 | 1366.3 | 1431.0 |

### cured — 3 windows
| w | encodes | discardedMs | encodeMs | lastEncodeMs | boardReadyMs | tbtMs |
|---|---|---|---|---|---|---|
| 1 | 16.0 | 0.0 | 1058.5 | 2913.9 | 1344.0 | 775.0 |
| 2 | 16.0 | 0.0 | 1063.8 | 2949.7 | 1352.4 | 792.0 |
| 3 | 16.0 | 0.0 | 1057.9 | 2869.2 | 1332.9 | 792.0 |

### the deltas, each against the arms' own spreads
| quantity | base median | base spread | cured median | cured spread | Δ median | outside both spreads |
|---|---|---|---|---|---|---|
| encodes | 28.0 | 28.0–28.0 | 16.0 | 16.0–16.0 | -12.0 | YES |
| discardedMs | 978.9 | 975.0–984.3 | 0.0 | 0.0–0.0 | -978.9 | YES |
| encodeMs | 2041.0 | 2027.5–2055.5 | 1058.5 | 1057.9–1063.8 | -982.5 | YES |
| lastEncodeMs | 3894.2 | 3887.8–3927.9 | 2913.9 | 2869.2–2949.7 | -980.3 | YES |
| boardReadyMs | 1382.0 | 1366.3–1386.7 | 1344.0 | 1332.9–1352.4 | -38.0 | YES |
| tbtMs | 1431.0 | 1423.0–1444.0 | 792.0 | 775.0–792.0 | -639.0 | YES |
