# PAL-TIN pass 2 — the paper's own five-stick ceiling, in ΔE, both arms at once
CELL reserved set: light 9 (user-ink, focus-sketch, teacher-red, crayon-blue, solver-ink-1, solver-ink-2, solver-ink-3, solver-ink-4, solver-ink-5)
bands: light L 0.545 on #fbfaf9/#fdfdfc · dark L 0.78 on #110f0e/#131211
sticks are at the sRGB gamut's own chroma at their (L,h) — the ceiling, not a chosen number.

## spread ≥40deg · AA ≥4.5:1 → FLOOR ΔE **0.058**
| h | light hex | ΔE(cell,light) | nearest | AA light | dark hex | ΔE(cell,dark) | nearest | AA dark |
|---|---|---|---|---|---|---|---|---|
| 26 | #d3001d | 0.081 | teacher-red | 5.32 | #ff968c | 0.093 | solver-ink-1 | 8.90 |
| 102 | #7e7200 | 0.059 | solver-ink-5 | 4.69 | #cdba00 | 0.152 | solver-ink-5 | 9.46 |
| 191.5 | #00817e | 0.059 | solver-ink-4 | 4.54 | #00d2cd | 0.089 | solver-ink-4 | 9.89 |
| 306 | #9a00ed | 0.069 | solver-ink-2 | 5.60 | #ce9eff | 0.058 | solver-ink-2 | 8.87 |
| 346 | #c4008c | 0.060 | solver-ink-1 | 5.41 | #ff8acd | 0.066 | solver-ink-1 | 8.70 |
- min pairwise ΔE among the five, worse arm: **0.104**

## spread ≥50deg · AA ≥4.5:1 → FLOOR ΔE **0.051**
| h | light hex | ΔE(cell,light) | nearest | AA light | dark hex | ΔE(cell,dark) | nearest | AA dark |
|---|---|---|---|---|---|---|---|---|
| 12 | #cf004d | 0.052 | solver-ink-1 | 5.36 | #ff92a1 | 0.073 | solver-ink-1 | 8.80 |
| 98.5 | #817000 | 0.052 | solver-ink-5 | 4.74 | #d2b700 | 0.153 | solver-ink-5 | 9.37 |
| 185.5 | #008278 | 0.052 | solver-ink-4 | 4.51 | #00d3c4 | 0.081 | solver-ink-4 | 9.90 |
| 235.5 | #0079aa | 0.051 | focus-sketch | 4.67 | #56c4ff | 0.055 | solver-ink-3 | 9.57 |
| 304 | #9700f1 | 0.064 | solver-ink-2 | 5.62 | #cba0ff | 0.053 | solver-ink-2 | 8.92 |
- min pairwise ΔE among the five, worse arm: **0.092**

## spread ≥55deg · AA ≥4.5:1 → FLOOR ΔE **0.050**
| h | light hex | ΔE(cell,light) | nearest | AA light | dark hex | ΔE(cell,dark) | nearest | AA dark |
|---|---|---|---|---|---|---|---|---|
| 23 | #d2002b | 0.076 | teacher-red | 5.34 | #ff9590 | 0.089 | solver-ink-1 | 8.87 |
| 97.5 | #827000 | 0.051 | solver-ink-5 | 4.72 | #d4b700 | 0.151 | solver-ink-5 | 9.42 |
| 184.5 | #008277 | 0.050 | solver-ink-4 | 4.52 | #00d3c2 | 0.081 | solver-ink-4 | 9.89 |
| 273 | #4a4fff | 0.056 | user-ink | 5.23 | #a0b2ff | 0.050 | solver-ink-2 | 9.18 |
| 328 | #b600b7 | 0.130 | solver-ink-1 | 5.48 | #ff7bfd | 0.128 | solver-ink-1 | 8.47 |
- min pairwise ΔE among the five, worse arm: **0.144**

## spread ≥40deg · AA ≥0:1 → FLOOR ΔE **0.105**
| h | light hex | ΔE(cell,light) | nearest | AA light | dark hex | ΔE(cell,dark) | nearest | AA dark |
|---|---|---|---|---|---|---|---|---|
| 35.5 | #c53400 | 0.106 | teacher-red | 5.21 | #ff977c | 0.112 | solver-ink-1 | 8.88 |
| 142.5 | #008900 | 0.105 | solver-ink-4 | 4.40 | #00de00 | 0.167 | solver-ink-4 | 10.20 |
| 319.5 | #ad00cc | 0.118 | solver-ink-2 | 5.52 | #e98dff | 0.106 | solver-ink-1 | 8.66 |
| 35.5 | #c53400 | 0.106 | teacher-red | 5.21 | #ff977c | 0.112 | solver-ink-1 | 8.88 |
| 142.5 | #008900 | 0.105 | solver-ink-4 | 4.40 | #00de00 | 0.167 | solver-ink-4 | 10.20 |
- min pairwise ΔE among the five, worse arm: **0.000**

## the pass-1 tin on the same ruler
- the tin's own floor against the CELL set, worse arm: **ΔE 0.046** (dark #a4b1ff vs --color-solver-ink-2)
- spreads: light 48.4 / 124.6 / 200.6 / 276.6 / 332.2 · dark 48.7 / 124.7 / 200.3 / 276.2 / 332.1
- min adjacent spread: **55.6deg**
