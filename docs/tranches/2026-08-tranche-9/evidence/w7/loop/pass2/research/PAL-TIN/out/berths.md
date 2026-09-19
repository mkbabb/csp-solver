# PAL-TIN pass 2 — each berth swept, band and chroma held
`score` = min(ΔE light, ΔE dark) against the CELL set; AA must clear 4.5 in both arms.

| berth | hue now | score now | best hue in arc | score there | light hex | dark hex | nearest light | nearest dark | AA l/d | Δhue |
|---|---|---|---|---|---|---|---|---|---|---|
| amber | 48.4 | **0.068** | **37.5** | **0.111** | #c23a00 | #ff9879 | teacher-red 0.111 | solver-ink-1 0.115 | 5.17/8.93 | -10.9 |
| green | 124.6 | **0.097** | **120.75** | **0.101** | #667b00 | #a7c800 | solver-ink-4 0.101 | solver-ink-4 0.145 | 4.58/9.72 | -3.8 |
| teal | 200.6 | **0.071** | **212.5** | **0.089** | #007e91 | #00cdea | solver-ink-4 0.089 | solver-ink-3 0.092 | 4.59/9.73 | 11.9 |
| violet | 276.6 | **0.046** | **310** | **0.069** | #a000e3 | #d59aff | solver-ink-2 0.082 | solver-ink-2 0.069 | 5.59/8.82 | 33.4 |
| pink | 332.2 | **0.107** | **327.5** | **0.132** | #b500b8 | #ff7aff | solver-ink-1 0.133 | solver-ink-1 0.132 | 5.51/8.45 | -4.7 |

- the re-cut tin: hues 37.5 / 120.75 / 212.5 / 310 / 327.5 · min adjacent spread 17.5deg · min pairwise ΔE (worse arm) **0.084** · gate-1 floor **ΔE 0.069**
- light: #c23a00 #667b00 #007e91 #a000e3 #b500b8
- dark:  #ff9879 #a7c800 #00cdea #d59aff #ff7aff
- pass-1 tin's own gate-1 floor on this ruler: **ΔE 0.046** (dark violet vs --color-solver-ink-2)
