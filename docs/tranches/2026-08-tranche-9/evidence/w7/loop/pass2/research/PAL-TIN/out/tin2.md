# PAL-TIN pass 2 — the tin re-measured off HEAD index.css
reserved tokens RESOLVED: light 19/19 · dark 19/19
grounds: light bg #fbfaf9 card #fdfdfc · dark bg #110f0e card #131211
hex-literal only (what pass 1's gate could see): light 17 · dark 12
aliased or inherited in dark: focus-sketch(inherits light), teacher-red(inherits light), gold-star(inherits light), green-ink, orange-ink, red-ink, gold-ink
of those, on a board surface with a player digit: 14

## gate 1 · arm light
| stick | hex | h | C | L | nearest reserved (deg) | deg | nearest reserved (ΔE) | ΔE | nearest BOARD ink | ΔE(board) |
|---|---|---|---|---|---|---|---|---|---|---|
| peer-1 | #b24f00 | 48.4 | 0.148 | 0.546 | orange-ink | **15.80** | orange-ink | **0.046** | orange-ink | **0.046** |
| peer-2 | #5f7d00 | 124.6 | 0.137 | 0.546 | crayon-green | **22.35** | green-ink | **0.059** | green-ink | **0.059** |
| peer-3 | #008086 | 200.6 | 0.093 | 0.545 | solver-ink-4 | **34.97** | solver-ink-4 | **0.071** | solver-ink-4 | **0.071** |
| peer-4 | #5a61ce | 276.6 | 0.166 | 0.545 | user-ink | **13.75** | user-ink | **0.067** | user-ink | **0.067** |
| peer-5 | #a5439a | 332.2 | 0.166 | 0.545 | solver-ink-1 | **26.77** | solver-ink-1 | **0.088** | solver-ink-1 | **0.088** |

## gate 1 · arm dark
| stick | hex | h | C | L | nearest reserved (deg) | deg | nearest reserved (ΔE) | ΔE | nearest BOARD ink | ΔE(board) |
|---|---|---|---|---|---|---|---|---|---|---|
| peer-1 | #ff9a62 | 48.7 | 0.141 | 0.780 | crayon-orange | **23.04** | crayon-orange | **0.064** | orange-ink | **0.064** |
| peer-2 | #a0c942 | 124.7 | 0.166 | 0.781 | crayon-green | **23.51** | crayon-green | **0.082** | green-ink | **0.082** |
| peer-3 | #00d0d9 | 200.3 | 0.133 | 0.780 | solver-ink-4 | **35.37** | solver-ink-4 | **0.103** | solver-ink-4 | **0.103** |
| peer-4 | #a4b1ff | 276.2 | 0.112 | 0.780 | progress-ink | **16.79** | solver-ink-2 | **0.046** | solver-ink-2 | **0.046** |
| peer-5 | #f48ce6 | 332.1 | 0.167 | 0.780 | solver-ink-1 | **13.87** | solver-ink-1 | **0.079** | solver-ink-1 | **0.079** |

## the corrections
- spec says "every stick >= 13.5deg from all 29 reserved inks" -> MEASURED **13.75deg** (peer-4 light #5a61ce vs --color-user-ink #2563eb)
- chroma light: min **0.093** · mean 0.142 · max 0.166
- chroma dark: min **0.112** · mean 0.144 · max 0.167

## gate 2 · pairwise separation, and AA
- light: min pairwise ΔE **0.145** (peer-2 vs peer-3) · worst AA **4.545:1** over 10 arms
- dark: min pairwise ΔE **0.139** (peer-4 vs peer-5) · worst AA **8.679:1** over 10 arms

## the gamut ceiling, and the 8-bit margin — a table is not a formula
| stick | arm | L | h | C held | chromaAt(L,h) | headroom | byte round trip Δh |
|---|---|---|---|---|---|---|---|
| peer-1 | light | 0.546 | 48.4 | 0.148 | 0.148 | 0.000 | 0.000 |
| peer-2 | light | 0.546 | 124.6 | 0.137 | 0.137 | 0.000 | 0.000 |
| peer-3 | light | 0.545 | 200.6 | 0.093 | 0.093 | 0.000 | 0.000 |
| peer-4 | light | 0.545 | 276.6 | 0.166 | 0.255 | 0.089 | 0.000 |
| peer-5 | light | 0.545 | 332.2 | 0.166 | 0.246 | 0.079 | 0.000 |
| peer-1 | dark | 0.780 | 48.7 | 0.141 | 0.141 | 0.000 | 0.000 |
| peer-2 | dark | 0.781 | 124.7 | 0.166 | 0.196 | 0.029 | 0.000 |
| peer-3 | dark | 0.780 | 200.3 | 0.133 | 0.133 | 0.000 | 0.000 |
| peer-4 | dark | 0.780 | 276.2 | 0.112 | 0.112 | 0.000 | 0.000 |
| peer-5 | dark | 0.780 | 332.1 | 0.167 | 0.202 | 0.035 | 0.000 |

## the incumbent walk (hue = i x 137.5 at C 0.11), painted, against the same set
- light: max byte rotation **0.58deg** · clipped indices 12/40
  - under 12deg of a reserved ink: i=0 h=0 0.55deg from --color-solver-ink-1 (ΔE 0.0969); i=1 h=137.5 9.4deg from --color-crayon-green (ΔE 0.0458); i=3 h=52.5 11.26deg from --color-orange-ink (ΔE 0.048); i=7 h=242.5 9.06deg from --color-crayon-blue (ΔE 0.0822); i=8 h=20 5.49deg from --color-teacher-red (ΔE 0.1023); i=9 h=157.5 7.79deg from --color-solver-ink-4 (ΔE 0.0178); i=10 h=295 1.59deg from --color-solver-ink-2 (ΔE 0.1085); i=11 h=72.5 0.02deg from --color-solver-ink-5 (ΔE 0.0294); i=13 h=347.5 11.66deg from --color-solver-ink-1 (ΔE 0.1021); i=15 h=262.5 0.18deg from --color-user-ink (ΔE 0.0721); i=19 h=92.5 8.93deg from --color-gold-star (ΔE 0.0456); i=21 h=7.5 6.38deg from --color-red-ink (ΔE 0.0994); i=22 h=145 2.04deg from --color-crayon-green (ΔE 0.0398); i=23 h=282.5 9.84deg from --color-progress-ink (ΔE 0.0888); i=24 h=60 4.04deg from --color-orange-ink (ΔE 0.0379); i=28 h=250 1.38deg from --color-crayon-blue (ΔE 0.0786); i=30 h=165 0.82deg from --color-solver-ink-4 (ΔE 0.0071); i=31 h=302.5 9.65deg from --color-solver-ink-2 (ΔE 0.1229); i=32 h=80 2.78deg from --color-gold-ink (ΔE 0.0339); i=34 h=355 3.73deg from --color-solver-ink-1 (ΔE 0.0987); i=36 h=270 7.35deg from --color-user-ink (ΔE 0.0752)
  - under ΔE 0.10 of a reserved ink: **32/40** — i=0 ΔE 0.0969 from --color-solver-ink-1; i=1 ΔE 0.0458 from --color-green-ink; i=2 ΔE 0.0804 from --color-solver-ink-3; i=3 ΔE 0.048 from --color-solver-ink-5; i=4 ΔE 0.0441 from --color-solver-ink-4; i=6 ΔE 0.0584 from --color-gold-ink …
  - N=3: min painted pairwise **84.0deg / ΔE 0.148**
  - N=5: min painted pairwise **51.9deg / ΔE 0.088**
  - N=6: min painted pairwise **31.8deg / ΔE 0.060**
  - N=8: min painted pairwise **31.8deg / ΔE 0.060**
  - N=16: min painted pairwise **12.2deg / ΔE 0.023**
- dark: max byte rotation **0.64deg** · clipped indices 5/40
  - under 12deg of a reserved ink: i=1 h=137.5 10.68deg from --color-crayon-green (ΔE 0.0747); i=6 h=105 9.37deg from --color-solver-ink-5 (ΔE 0.051); i=7 h=242.5 6.68deg from --color-crayon-blue (ΔE 0.0241); i=8 h=20 8.31deg from --color-teacher-red (ΔE 0.0686); i=9 h=157.5 7.26deg from --color-solver-ink-4 (ΔE 0.0526); i=10 h=295 1.59deg from --color-solver-ink-2 (ΔE 0.013); i=11 h=72.5 0.83deg from --color-crayon-orange (ΔE 0.0227); i=13 h=347.5 1.14deg from --color-solver-ink-1 (ΔE 0.0239); i=15 h=262.5 7.82deg from --color-user-ink (ΔE 0.0208); i=19 h=92.5 2.89deg from --color-gold-star (ΔE 0.0459); i=21 h=7.5 4.99deg from --color-teacher-red (ΔE 0.0467); i=22 h=145 3.07deg from --color-crayon-green (ΔE 0.0638); i=23 h=282.5 11.03deg from --color-progress-ink (ΔE 0.0232); i=24 h=60 11.41deg from --color-crayon-orange (ΔE 0.0323); i=26 h=335 11.05deg from --color-solver-ink-1 (ΔE 0.0306); i=28 h=250 0.73deg from --color-crayon-blue (ΔE 0.0131); i=30 h=165 0.05deg from --color-solver-ink-4 (ΔE 0.0502); i=31 h=302.5 8.52deg from --color-solver-ink-2 (ΔE 0.0207); i=32 h=80 8.46deg from --color-crayon-orange (ΔE 0.028); i=34 h=355 9.21deg from --color-solver-ink-1 (ΔE 0.0286)
  - under ΔE 0.10 of a reserved ink: **40/40** — i=0 ΔE 0.0352 from --color-solver-ink-1; i=1 ΔE 0.0747 from --color-solver-ink-4; i=2 ΔE 0.0351 from --color-solver-ink-2; i=3 ΔE 0.0449 from --color-crayon-orange; i=4 ΔE 0.0722 from --color-solver-ink-4; i=5 ΔE 0.0425 from --color-solver-ink-1 …
  - N=3: min painted pairwise **85.0deg / ΔE 0.143**
  - N=5: min painted pairwise **52.4deg / ΔE 0.097**
  - N=6: min painted pairwise **32.0deg / ΔE 0.061**
  - N=8: min painted pairwise **31.9deg / ΔE 0.059**
  - N=16: min painted pairwise **12.1deg / ΔE 0.021**

## the tin against the same demands (the roster is the tie-break past five)
- light N=3: min pairwise **75.9deg / ΔE 0.145**
- light N=5: min pairwise **55.6deg / ΔE 0.145**
  - vs incumbent self #2563eb: peer-1 145.5deg/ΔE 0.347 · peer-2 138.2deg/ΔE 0.330 · peer-3 62.3deg/ΔE 0.191 · peer-4 13.7deg/ΔE 0.067 · peer-5 69.3deg/ΔE 0.221
- dark N=3: min pairwise **75.6deg / ΔE 0.185**
- dark N=5: min pairwise **55.9deg / ΔE 0.139**
  - vs incumbent self #60a5fa: peer-1 154.1deg/ΔE 0.285 · peer-2 129.9deg/ΔE 0.289 · peer-3 54.3deg/ΔE 0.142 · peer-4 21.6deg/ΔE 0.087 · peer-5 77.5deg/ΔE 0.206
