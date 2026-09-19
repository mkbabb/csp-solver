regime: webkit · 1 (webkit: CDP unavailable)× · unthrottled (webkit: CDP unavailable) · cold · desk   (cured arm: webkit · 1 (webkit: CDP unavailable)× · unthrottled (webkit: CDP unavailable) · cold · desk)
base  : fold/refute/raw/wk-cold-desk/base.jsonl · load { 13.72 8.76 9.57 } → { 6.97 7.76 9.11 }
cured : fold/refute/raw/wk-cold-desk/cured.jsonl · load { 11.46 8.51 9.47 } → { 6.39 7.59 9.02 }
taint : base 0/0/0 · cured 0/0/0

### base — 3 windows
| w | encodes | discardedMs | encodeMs | lastEncodeMs | boardReadyMs | tbtMs |
|---|---|---|---|---|---|---|
| 1 | 20.0 | 272.0 | 622.0 | 1080.0 | 480.0 | 0.0 |
| 2 | 20.0 | 256.0 | 562.0 | 747.0 | 392.0 | 0.0 |
| 3 | 20.0 | 255.0 | 569.0 | 769.0 | 387.0 | 0.0 |

### cured — 3 windows
| w | encodes | discardedMs | encodeMs | lastEncodeMs | boardReadyMs | tbtMs |
|---|---|---|---|---|---|---|
| 1 | 16.0 | 0.0 | 298.0 | 561.0 | 173.0 | 0.0 |
| 2 | 16.0 | 0.0 | 300.0 | 577.0 | 175.0 | 0.0 |
| 3 | 16.0 | 0.0 | 310.0 | 595.0 | 183.0 | 0.0 |

### the deltas, each against the arms' own spreads
| quantity | base median | base spread | cured median | cured spread | Δ median | outside both spreads |
|---|---|---|---|---|---|---|
| encodes | 20.0 | 20.0–20.0 | 16.0 | 16.0–16.0 | -4.0 | YES |
| discardedMs | 256.0 | 255.0–272.0 | 0.0 | 0.0–0.0 | -256.0 | YES |
| encodeMs | 569.0 | 562.0–622.0 | 300.0 | 298.0–310.0 | -269.0 | YES |
| lastEncodeMs | 769.0 | 747.0–1080.0 | 577.0 | 561.0–595.0 | -192.0 | YES |
| boardReadyMs | 392.0 | 387.0–480.0 | 175.0 | 173.0–183.0 | -217.0 | YES |
| tbtMs | 0.0 | 0.0–0.0 | 0.0 | 0.0–0.0 | 0.0 | no — inside the spread |
