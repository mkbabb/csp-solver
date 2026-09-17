
### chromium · CPU 4× · net fast3g · cache cold · desk · load { 3.72 4.53 5.85 } → { 4.98 4.72 5.83 } · 3/3 clean windows
file: /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w8/attribution/refute/A1/raw/re-c-4x-fast3g-cold-desk.jsonl
board-ready (ms from navigationStart): 1373.6 · 1384.8 · 1411.5  → MEDIAN 1384.8
FCP 824 · DCL 1328.7 · load 1383 · longtask supported: true

| bake | dims | encodes | t_start | t_end | main-thread ms (sync encode) | vs board-ready | PNG bytes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| grid | 1272×1272 | 8 | 1630.2 | 4067.8 | 1765.8 | AFTER | 1915430 |
| logo | 765×224 | 4 | 3791.2 | 4007.2 | 79.2 | AFTER | 87194 |
| toggle-moon | 416×416 | 8 | 1541.7 | 3914 | 158.8 | AFTER | 207180 |
| toggle-sun | 416×416 | 8 | 1457.8 | 3880.2 | 160.7 | AFTER | 371174 |
| **TOTAL** | | 28 | | | **2164.5** | | **2580978** |
longtask: median count 10 · median summed ms 2055 · median TBT (Σ dur−50) 1555 · worst 231
longtask attribution (per window): not-a-bake 2.0× / 266 ms · grid 7.0× / 1546 ms · toggle-moon 1.0× / 225 ms
toggle #1 (→ dark): re-bakes 8 encodes {"logo":4,"grid":4} · main-thread ms 942.4 · settle 1341.7 ms after click · bytes 1166273
toggle #2 (→ light): re-bakes 0 encodes {} · main-thread ms 0 · settle 0 ms after click · bytes 0

### webkit · CPU 1 (webkit: CDP unavailable)× · net unthrottled (webkit: CDP unavailable) · cache cold · desk · load { 4.90 4.70 5.82 } → { 7.92 5.60 6.08 } · 3/3 clean windows
file: /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w8/attribution/refute/A1/raw/re-w-1x-none-cold-desk.jsonl
board-ready (ms from navigationStart): 504 · 441 · 414  → MEDIAN 441
FCP 143 · DCL 109 · load 113 · longtask supported: false

| bake | dims | encodes | t_start | t_end | main-thread ms (sync encode) | vs board-ready | PNG bytes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| grid | 1272×1272 | 8 | 156 | 781 | 513 | BEFORE | 1487011 |
| logo | 762×224 | 4 | 944 | 1101 | 38 | AFTER | 88795 |
| toggle-moon | 416×416 | 4 | 496 | 781 | 28 | AFTER | 95114 |
| toggle-sun | 416×416 | 4 | 461 | 780 | 34 | AFTER | 172101 |
| **TOTAL** | | 20 | | | **613.0** | | **1843021** |
longtask: NOT MEASURED (engine ships no `longtask` entry type)
rAF gaps >33.4 ms: median count 5 · median worst 340 ms · median summed 1042 ms
toggle #1 (→ dark): re-bakes 8 encodes {"logo":4,"grid":4} · main-thread ms 281 · settle 344 ms after click · bytes 994542
toggle #2 (→ light): re-bakes 0 encodes {} · main-thread ms 0 · settle 0 ms after click · bytes 0
