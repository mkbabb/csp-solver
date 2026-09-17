# T9-W8 §8.1 lane A1 — THE BAKE TABLE (attribution, no cure)

Regenerate: `cd web/frontend && node <A1>/summarize.mjs <A1>/raw/*.jsonl` (gunzip first).
Instrument: `bake-census.mjs` (header line says how to run it). Dist FIXED at HEAD 58014efd,
identity banked in `dist-identity-before.txt` / `dist-identity-after.txt`. Host: darwin 25.4.0,
6 sibling lanes concurrent; every block prints its own load average at start and finish.
BOARD-READY = `.board-group` VISIBLE + first `.cell`-class child rect non-zero + one rAF after,
stamped `performance.now()` (navigationStart-relative). WebKit is NOT Safari and never an iOS claim.

### chromium · CPU 1× · net none · cache cold · desk · load { 7.70 10.82 10.26 } → { 5.54 9.76 9.90 } · 3/3 clean windows
file: raw/c-1x-none-cold-desk.jsonl.gz
board-ready (ms from navigationStart): 75.2 · 72.3 · 73.5  → MEDIAN 73.5
FCP 16 · DCL 60.5 · load 73.1 · longtask supported: true

| bake | dims | encodes | t_start | t_end | main-thread ms (sync encode) | vs board-ready | PNG bytes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| grid | 1272×1272 | 8 | 126.4 | 701.8 | 398.9 | AFTER | 1915430 |
| logo | 765×224 | 4 | 590.6 | 664 | 18.4 | AFTER | 87194 |
| toggle-moon | 416×416 | 8 | 107.1 | 653.6 | 35.1 | AFTER | 207180 |
| toggle-sun | 416×416 | 8 | 87.6 | 673 | 37 | AFTER | 371174 |
| **TOTAL** | | 28 | | | **489.4** | | **2580978** |
longtask: median count 8 · median summed ms 400 · median TBT (Σ dur−50) 2 · worst 51
longtask attribution (per window): toggle-moon 1.3× / 67 ms · grid 6.3× / 319 ms
toggle #1 (→ dark): re-bakes 8 encodes {"logo":4,"grid":4} · main-thread ms 221.2 · settle 352.4 ms after click · bytes 1166273
toggle #2 (→ light): re-bakes 0 encodes {} · main-thread ms 0 · settle 0 ms after click · bytes 0

### chromium · CPU 4× · net none · cache cold · desk · load { 7.44 9.30 9.71 } → { 4.25 7.68 9.03 } · 3/3 clean windows
file: raw/c-4x-none-cold-desk.jsonl.gz
board-ready (ms from navigationStart): 283.3 · 301.7 · 302.4  → MEDIAN 301.7
FCP 288 · DCL 240.4 · load 2628.7 · longtask supported: true

| bake | dims | encodes | t_start | t_end | main-thread ms (sync encode) | vs board-ready | PNG bytes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| grid | 1272×1272 | 8 | 537.1 | 2943.2 | 1673.1 | AFTER | 1915430 |
| logo | 765×224 | 4 | 2599.3 | 2870.7 | 77.5 | AFTER | 87194 |
| toggle-moon | 416×416 | 8 | 454.9 | 2726.6 | 151.6 | AFTER | 207180 |
| toggle-sun | 416×416 | 8 | 366.2 | 2715.3 | 154.8 | AFTER | 371174 |
| **TOTAL** | | 28 | | | **2057.0** | | **2580978** |
longtask: median count 10 · median summed ms 1954 · median TBT (Σ dur−50) 1454 · worst 218
longtask attribution (per window): not-a-bake 2.0× / 268 ms · grid 7.0× / 1487 ms · toggle-moon 1.0× / 196 ms
toggle #1 (→ dark): re-bakes 8 encodes {"logo":4,"grid":4} · main-thread ms 907.2 · settle 1321.5 ms after click · bytes 1166273
toggle #2 (→ light): re-bakes 0 encodes {} · main-thread ms 0 · settle 0 ms after click · bytes 0

### chromium · CPU 4× · net fast3g · cache cold · desk · load { 5.34 9.65 9.86 } → { 7.74 9.39 9.74 } · 3/3 clean windows
file: raw/c-4x-fast3g-cold-desk.jsonl.gz
board-ready (ms from navigationStart): 1387.1 · 1391.1 · 1375.7  → MEDIAN 1387.1
FCP 828 · DCL 1330.3 · load 1384.7 · longtask supported: true

| bake | dims | encodes | t_start | t_end | main-thread ms (sync encode) | vs board-ready | PNG bytes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| grid | 1272×1272 | 8 | 1623.7 | 3911 | 1672.3 | AFTER | 1915430 |
| logo | 765×224 | 4 | 3636 | 3885.3 | 77.7 | AFTER | 87194 |
| toggle-moon | 416×416 | 8 | 1539.6 | 3750.7 | 151.2 | AFTER | 207180 |
| toggle-sun | 416×416 | 8 | 1458.4 | 3747.4 | 150 | AFTER | 371174 |
| **TOTAL** | | 28 | | | **2051.2** | | **2580978** |
longtask: median count 10 · median summed ms 1955 · median TBT (Σ dur−50) 1455 · worst 213
longtask attribution (per window): not-a-bake 2.0× / 262 ms · grid 6.7× / 1399 ms · toggle-moon 1.3× / 279 ms
toggle #1 (→ dark): re-bakes 8 encodes {"logo":4,"grid":4} · main-thread ms 905.5 · settle 1282.2 ms after click · bytes 1166273
toggle #2 (→ light): re-bakes 0 encodes {} · main-thread ms 0 · settle 0 ms after click · bytes 0

### chromium · CPU 6× · net fast3g · cache cold · desk · load { 4.25 7.68 9.03 } → { 6.30 7.60 8.81 } · 3/3 clean windows
file: raw/c-6x-fast3g-cold-desk.jsonl.gz
board-ready (ms from navigationStart): 1531.5 · 1558.6 · 1606.4  → MEDIAN 1558.6
FCP 848 · DCL 1468.5 · load 1555.2 · longtask supported: true

| bake | dims | encodes | t_start | t_end | main-thread ms (sync encode) | vs board-ready | PNG bytes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| grid | 1272×1272 | 8 | 1941.5 | 5568.5 | 2598.9 | AFTER | 1915430 |
| logo | 765×224 | 4 | 5167.6 | 5463.6 | 120.1 | AFTER | 87194 |
| toggle-moon | 416×416 | 8 | 1809.5 | 5318.8 | 230.6 | AFTER | 207180 |
| toggle-sun | 416×416 | 8 | 1676.1 | 5312.2 | 238.2 | AFTER | 371174 |
| **TOTAL** | | 28 | | | **3187.8** | | **2580978** |
longtask: median count 11 · median summed ms 3114 · median TBT (Σ dur−50) 2564 · worst 340
longtask attribution (per window): not-a-bake 2.7× / 477 ms · toggle-moon 0.7× / 216 ms · grid 7.3× / 2446 ms
toggle #1 (→ dark): re-bakes 8 encodes {"logo":4,"grid":4} · main-thread ms 1399.8 · settle 1920.7 ms after click · bytes 1166273
toggle #2 (→ light): re-bakes 0 encodes {} · main-thread ms 0 · settle 0 ms after click · bytes 0

### chromium · CPU 4× · net fast3g · cache cold · mobile · load { 5.49 7.00 8.30 } → { 6.06 7.01 8.17 } · 3/3 clean windows
file: raw/c-4x-fast3g-cold-mobile.jsonl.gz
board-ready (ms from navigationStart): 1351.4 · 1366 · 1354.4  → MEDIAN 1354.4
FCP 832 · DCL 1299.2 · load 1352.5 · longtask supported: true

| bake | dims | encodes | t_start | t_end | main-thread ms (sync encode) | vs board-ready | PNG bytes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| grid | 1092×1092 | 8 | 1473.5 | 3163.3 | 1242 | AFTER | 1592648 |
| logo | 728×213 | 4 | 2898.1 | 3117.5 | 69.9 | AFTER | 79282 |
| toggle-moon | 192×192 | 8 | 1451.7 | 3078 | 35.5 | AFTER | 84938 |
| toggle-sun | 192×192 | 8 | 1429.8 | 3059.8 | 39.4 | AFTER | 153940 |
| **TOTAL** | | 28 | | | **1386.8** | | **1910808** |
longtask: median count 10 · median summed ms 1499 · median TBT (Σ dur−50) 999 · worst 187
longtask attribution (per window): not-a-bake 2.0× / 238 ms · toggle-moon 1.3× / 209 ms · grid 6.7× / 1050 ms
toggle #1 (→ drawer-closed dark): re-bakes 8 encodes {"logo":4,"grid":4} · main-thread ms 690 · settle 1058.9 ms after click · bytes 984206
toggle #2 (→ drawer-closed): re-bakes 0 encodes {} · main-thread ms 0 · settle 0 ms after click · bytes 0

### chromium · CPU 1× · net none · cache warm · desk · load { 7.57 7.53 8.59 } → { 5.49 7.00 8.30 } · 3/3 clean windows
file: raw/c-1x-none-warm-desk.jsonl.gz
board-ready (ms from navigationStart): 42.8 · 45.5 · 44.7  → MEDIAN 44.7
FCP 12 · DCL 33.6 · load 44.4 · longtask supported: true

| bake | dims | encodes | t_start | t_end | main-thread ms (sync encode) | vs board-ready | PNG bytes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| grid | 1272×1272 | 8 | 100.6 | 665.4 | 412.6 | AFTER | 1915430 |
| logo | 765×224 | 4 | 563.8 | 621.8 | 18.3 | AFTER | 87194 |
| toggle-moon | 416×416 | 8 | 76.6 | 645.7 | 35.8 | AFTER | 207180 |
| toggle-sun | 416×416 | 8 | 56.8 | 640.9 | 36.7 | AFTER | 371174 |
| **TOTAL** | | 28 | | | **503.4** | | **2580978** |
longtask: median count 8 · median summed ms 414 · median TBT (Σ dur−50) 14 · worst 53
longtask attribution (per window): toggle-moon 1.3× / 69 ms · grid 6.7× / 345 ms
toggle #1 (→ dark): re-bakes 8 encodes {"logo":4,"grid":4} · main-thread ms 220.5 · settle 343.5 ms after click · bytes 1166273
toggle #2 (→ light): re-bakes 0 encodes {} · main-thread ms 0 · settle 0 ms after click · bytes 0

### chromium · CPU 4× · net fast3g · cache warm · desk · load { 6.59 7.64 8.82 } → { 7.57 7.53 8.59 } · 3/3 clean windows
file: raw/c-4x-fast3g-warm-desk.jsonl.gz
board-ready (ms from navigationStart): 571.1 · 551.3 · 578.8  → MEDIAN 571.1
FCP 576 · DCL 507.6 · load 2366.6 · longtask supported: true

| bake | dims | encodes | t_start | t_end | main-thread ms (sync encode) | vs board-ready | PNG bytes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| grid | 1272×1272 | 8 | 607.1 | 2840.2 | 1652.4 | AFTER | 1885724 |
| logo | 765×224 | 4 | 2616.2 | 2809.1 | 80.5 | AFTER | 87194 |
| toggle-moon | 416×416 | 4 | 1396 | 2723.9 | 76 | AFTER | 103590 |
| toggle-sun | 416×416 | 4 | 1326.4 | 2698.2 | 78.7 | AFTER | 185587 |
| **TOTAL** | | 20 | | | **1887.6** | | **2262095** |
longtask: median count 10 · median summed ms 1890 · median TBT (Σ dur−50) 1390 · worst 232
longtask attribution (per window): not-a-bake 1.7× / 198 ms · toggle-moon 0.7× / 150 ms · grid 7.3× / 1589 ms
toggle #1 (→ dark): re-bakes 8 encodes {"logo":4,"grid":4} · main-thread ms 973.8 · settle 1420.7 ms after click · bytes 1166273
toggle #2 (→ light): re-bakes 0 encodes {} · main-thread ms 0 · settle 0 ms after click · bytes 0

### webkit · CPU 1 (webkit: CDP unavailable)× · net unthrottled (webkit: CDP unavailable) · cache cold · desk · load { 6.77 7.15 8.21 } → { 6.21 6.98 8.06 } · 3/3 clean windows
file: raw/w-1x-none-cold-desk.jsonl.gz
board-ready (ms from navigationStart): 523 · 451 · 420  → MEDIAN 451
FCP 152 · DCL 116 · load 120 · longtask supported: false

| bake | dims | encodes | t_start | t_end | main-thread ms (sync encode) | vs board-ready | PNG bytes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| grid | 1272×1272 | 8 | 167 | 796 | 508 | BEFORE | 1487011 |
| logo | 762×224 | 8 | 775 | 1082 | 46 | AFTER | 120494 |
| toggle-moon | 416×416 | 4 | 504 | 796 | 26 | AFTER | 95114 |
| toggle-sun | 416×416 | 4 | 469 | 795 | 33 | AFTER | 172101 |
| **TOTAL** | | 24 | | | **613.0** | | **1874720** |
longtask: NOT MEASURED (engine ships no `longtask` entry type)
rAF gaps >33.4 ms: median count 5 · median worst 345 ms · median summed 1048 ms
toggle #1 (→ dark): re-bakes 8 encodes {"logo":4,"grid":4} · main-thread ms 273 · settle 333 ms after click · bytes 994542
toggle #2 (→ light): re-bakes 0 encodes {} · main-thread ms 0 · settle 0 ms after click · bytes 0

### webkit · CPU 1 (webkit: CDP unavailable)× · net unthrottled (webkit: CDP unavailable) · cache warm · desk · load { 5.87 6.90 8.02 } → { 4.44 6.10 7.58 } · 3/3 clean windows
file: raw/w-1x-none-warm-desk.jsonl.gz
board-ready (ms from navigationStart): 382 · 411 · 352  → MEDIAN 382
FCP 90 · DCL 77 · load 79 · longtask supported: false

| bake | dims | encodes | t_start | t_end | main-thread ms (sync encode) | vs board-ready | PNG bytes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| grid | 1272×1272 | 8 | 115 | 703 | 486 | BEFORE | 1487011 |
| logo | 762×224 | 4 | 453 | 702 | 24 | AFTER | 88795 |
| toggle-moon | 416×416 | 4 | 427 | 702 | 25 | AFTER | 95114 |
| toggle-sun | 416×416 | 4 | 396 | 702 | 33 | AFTER | 172101 |
| **TOTAL** | | 20 | | | **568.0** | | **1843021** |
longtask: NOT MEASURED (engine ships no `longtask` entry type)
rAF gaps >33.4 ms: median count 4 · median worst 324 ms · median summed 874 ms
toggle #1 (→ dark): re-bakes 8 encodes {"logo":4,"grid":4} · main-thread ms 258 · settle 323 ms after click · bytes 994542
toggle #2 (→ light): re-bakes 0 encodes {} · main-thread ms 0 · settle 0 ms after click · bytes 0

### webkit · CPU 1 (webkit: CDP unavailable)× · net unthrottled (webkit: CDP unavailable) · cache cold · mobile · load { 4.44 6.10 7.58 } → { 4.18 5.68 7.31 } · 3/3 clean windows
file: raw/w-1x-none-cold-mobile.jsonl.gz
board-ready (ms from navigationStart): 373 · 355 · 379  → MEDIAN 373
FCP 119 · DCL 92 · load 95 · longtask supported: false

| bake | dims | encodes | t_start | t_end | main-thread ms (sync encode) | vs board-ready | PNG bytes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| grid | 728×728 | 8 | 127 | 506 | 313 | BEFORE | 1096151 |
| logo | 724×213 | 8 | 499 | 578 | 44 | AFTER | 101404 |
| toggle-moon | 192×192 | 4 | 403 | 506 | 10 | AFTER | 39244 |
| toggle-sun | 192×192 | 4 | 388 | 505 | 15 | AFTER | 70868 |
| **TOTAL** | | 24 | | | **382.0** | | **1307667** |
longtask: NOT MEASURED (engine ships no `longtask` entry type)
rAF gaps >33.4 ms: median count 3 · median worst 257 ms · median summed 504 ms
toggle #1 (→ drawer-closed dark): re-bakes 8 encodes {"logo":4,"grid":4} · main-thread ms 109 · settle 161 ms after click · bytes 544139
toggle #2 (→ drawer-closed): re-bakes 0 encodes {} · main-thread ms 0 · settle 0 ms after click · bytes 0
