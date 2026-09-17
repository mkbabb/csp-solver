### Boot (per cell, median of the cell's windows)

| cell | windows | board-ready ms (med) | boot bakes | idle rAF control fps | control long33 | board-ready element | dpr | board-ready per window |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| chromium-1x-desk-cold-nonet | 3 | 74.7 | 28 | 120.8 | 0 | game-cell | 2 | 71.6 / 75.3 / 74.7 |
| chromium-4x-desk-cold-fast3g-STARTDARK | 3 | 1388 | 28 | 120.5 | 0 | game-cell | 2 | 1399.8 / 1388 / 1385.9 |
| chromium-4x-desk-cold-fast3g | 3 | 1369.9 | 28 | 120.6 | 0 | game-cell | 2 | 1369.9 / 1365.2 / 1472.3 |
| chromium-4x-desk-warm | 3 | 310.9 | 28 | 120.6 | 0 | game-cell | 2 | 310.9 / 314.1 / 301.6 |
| chromium-4x-mobile-cold-fast3g | 3 | 1361.8 | 28 | 120.6 | 0 | game-cell | 3 | 1350.8 / 1377.9 / 1361.8 |
| chromium-6x-desk-cold-fast3g | 3 | 1549 | 28 | 120.4 | 0 | game-cell | 2 | 1547.3 / 1594.3 / 1549 |
| webkit-desk-cold-RETAKE | 3 | 406 | 20 | 60.3 | 0 | game-cell | 2 | 432 / 401 / 406 |
| webkit-desk-cold | 3 | 401 | 24 | 60.5 | 0 | game-cell | 2 | 402 / 398 / 401 |
| webkit-mobile-cold | 3 | 381 | 20 | 60.8 | 0 | game-cell | 3 | 383 / 381 / 368 |

### The toggle table (invocation N, median over the cell's windows)

| cell | N | to theme | click→settle ms | bakes | Σ bake wall ms | Σ longtask ms | whirl long33 | whirl worst ms | whirl rAF frames | whirl rAF fps | Δ recalc-style ms | taint |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| chromium-1x-desk-cold-nonet | 1 | dark | 311.2 | 8 | 1669.6 | 202 | 2 | 124.9 | 106 | 96.5 | 62.3 |  |
| chromium-1x-desk-cold-nonet | 2 | light | 0 | 0 | 0 | 0 | 0 | 9.4 | 130 | 118.8 | 140.2 |  |
| chromium-1x-desk-cold-nonet | 3 | dark | 0 | 0 | 0 | 0 | 0 | 9.3 | 130 | 118.8 | 137.7 |  |
| chromium-1x-desk-cold-nonet | 4 | light | 0 | 0 | 0 | 0 | 0 | 9.3 | 131 | 119.6 | 141.3 |  |
| chromium-4x-desk-cold-fast3g-STARTDARK | 1 | light | 1202.4 | 8 | 6590.7 | 0 | 1 | 200.8 | 5 | 4.6 | 79.9 |  |
| chromium-4x-desk-cold-fast3g-STARTDARK | 2 | dark | 101.6 | 0 | 0 | 0 | 1 | 58.2 | 99 | 90.5 | 265 |  |
| chromium-4x-desk-cold-fast3g-STARTDARK | 3 | light | 107.9 | 0 | 0 | 0 | 1 | 67.4 | 99 | 90.1 | 263.8 |  |
| chromium-4x-desk-cold-fast3g | 1 | dark | 1213.8 | 8 | 6790.6 | 0 | 1 | 207.6 | 6 | 5.5 | 87.9 |  |
| chromium-4x-desk-cold-fast3g | 2 | light | 195.4 | 0 | 0 | 0 | 2 | 58.3 | 99 | 90.5 | 257.8 |  |
| chromium-4x-desk-cold-fast3g | 3 | dark | 110.3 | 0 | 0 | 0 | 1 | 74.9 | 100 | 91.5 | 276.8 |  |
| chromium-4x-desk-cold-fast3g | 4 | light | 100.7 | 0 | 0 | 0 | 1 | 58.3 | 100 | 91.5 | 279.2 |  |
| chromium-4x-desk-warm | 1 | dark | 1233.9 | 8 | 6820.5 | 0 | 1 | 208.3 | 3 | 2.7 | 87.1 |  |
| chromium-4x-desk-warm | 2 | light | 93.8 | 0 | 0 | 0 | 1 | 41 | 100 | 91.5 | 299.7 |  |
| chromium-4x-desk-warm | 3 | dark | 100.1 | 0 | 0 | 0 | 1 | 57.9 | 100 | 91 | 276.3 |  |
| chromium-4x-desk-warm | 4 | light | 94.4 | 0 | 0 | 0 | 1 | 49.8 | 101 | 91.9 | 272.7 |  |
| chromium-4x-mobile-cold-fast3g | 1 | dark | 981.2 | 8 | 5268.5 | 0 | 1 | 157.8 | 28 | 25.5 | 86.5 |  |
| chromium-4x-mobile-cold-fast3g | 2 | light | 99.2 | 0 | 0 | 0 | 1 | 51 | 102 | 92.9 | 271.6 |  |
| chromium-4x-mobile-cold-fast3g | 3 | dark | 99.5 | 0 | 0 | 0 | 1 | 58.3 | 101 | 92.4 | 294.7 |  |
| chromium-4x-mobile-cold-fast3g | 4 | light | 93.9 | 0 | 0 | 0 | 1 | 58.3 | 104 | 95.1 | 284.3 |  |
| chromium-6x-desk-cold-fast3g | 1 | dark | 1921.1 | 8 | 10130.8 | 0 | 0 | NOT MEASURED | 0 | NOT MEASURED | 140.8 |  |
| chromium-6x-desk-cold-fast3g | 2 | light | 234.1 | 0 | 0 | 0 | 2 | 99.6 | 86 | 78.8 | 285.2 |  |
| chromium-6x-desk-cold-fast3g | 3 | dark | 181.1 | 0 | 0 | 0 | 1 | 100.6 | 88 | 80.1 | 276.9 |  |
| chromium-6x-desk-cold-fast3g | 4 | light | 424.7 | 0 | 0 | 0 | 3 | 91.7 | 89 | 80.9 | 278.9 |  |
| webkit-desk-cold-RETAKE | 1 | dark | 308 | 8 | 1510 | NOT MEASURED | 1 | 275 | 48 | 43.7 | NOT MEASURED |  |
| webkit-desk-cold-RETAKE | 2 | light | 0 | 0 | 0 | NOT MEASURED | 0 | 28 | 63 | 57.7 | NOT MEASURED |  |
| webkit-desk-cold-RETAKE | 3 | dark | 0 | 0 | 0 | NOT MEASURED | 0 | 30 | 63 | 57.5 | NOT MEASURED |  |
| webkit-desk-cold | 1 | dark | 338 | 8 | 1498 | NOT MEASURED | 2 | 271 | 49 | 44.7 | NOT MEASURED |  |
| webkit-desk-cold | 2 | light | 0 | 0 | 0 | NOT MEASURED | 0 | 26 | 63 | 57.6 | NOT MEASURED |  |
| webkit-desk-cold | 3 | dark | 0 | 0 | 0 | NOT MEASURED | 0 | 30 | 63 | 57.7 | NOT MEASURED |  |
| webkit-desk-cold | 4 | light | 0 | 0 | 0 | NOT MEASURED | 0 | 28 | 64 | 58.3 | NOT MEASURED |  |
| webkit-mobile-cold | 1 | dark | 158 | 8 | 635 | NOT MEASURED | 1 | 128 | 58 | 52.8 | NOT MEASURED |  |
| webkit-mobile-cold | 2 | light | 0 | 0 | 0 | NOT MEASURED | 0 | 18 | 65 | 59.3 | NOT MEASURED |  |
| webkit-mobile-cold | 3 | dark | 0 | 0 | 0 | NOT MEASURED | 0 | 18 | 65 | 59.3 | NOT MEASURED |  |
| webkit-mobile-cold | 4 | light | 0 | 0 | 0 | NOT MEASURED | 0 | 18 | 65 | 59.2 | NOT MEASURED |  |
