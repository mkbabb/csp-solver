# T2-WGATE — GAC timing probe (first-party recertification)

The tranche's last inherited-trust number — the **13.36×-class GAC aggregate**,
which rested on a deleted scratch harness — becomes first-party here or is
struck. Lane P1 authored a **committed** timing probe
(`csp-solver/examples/gac_timing_probe.rs`, keeper, house-idiom sibling of
`gac_ab_corpus`) and ran it. Verdict: the inherited number **survives as
first-party-corroborated** on the corrected-reality 50-board corpus, with two
honest divergences recorded below.

- **Corpus:** 5 named hard 9×9 + the post-W4 template bank (N=3-hard 20 + N=4
  easy/medium/hard 25) = **50 boards** — the same corpus the committed
  `gac_ab_corpus` soundness gate walks, NOT the retired 112-board decision
  corpus.
- **Config:** exact production `Pruning::Ac3 + Ordering::Mrv`; GAC-in-AllDifferent
  toggled via `GAC_IN_ALLDIFF_ENABLED`.
- **Method:** per board, on/off measured **interleaved** (on,off,…) across
  best-of-5 reps, per-state figure = min wall time (least-contended sample).
  Ratios only — wall-clock is this box's regime, never an SLA. Node counts are
  deterministic (host-independent).
- **Stamp:** `ede25188`, Apple M5 Max, 2026-07-10. Box was noisy (a sibling
  repo's Playwright/Chromium lanes lingering) — interleaving + best-of-min is
  the designed defense; the two runs below corroborate.

## Run 1

```
# GAC A/B timing probe — 50 boards (production config: Ac3 + Mrv), best-of-5 interleaved (on,off,…), ratios only
# ratio = off/on wall time; >1 means GAC ON is faster.

## Per-bucket aggregate (Σoff / Σon)
| bucket | boards | wall ratio (off/on) | nodes off→on |
|---|---|---|---|
| hard-9x9 (named) | 5 | 0.94× | 3367 → 702 |
| N3/hard | 20 | 3.01× | 4483 → 1154 |
| N4/easy | 10 | 1.00× | 640 → 640 |
| N4/medium | 10 | 25.65× | 24768 → 1428 |
| N4/hard | 5 | 26.84× | 7255 → 754 |

## Corpus aggregate
wall ratio (Σoff/Σon): 12.58×   |   nodes off→on: 40513 → 4678 (8.66× fewer)

## Named hard 9×9 (individual ratios, minority-cost direction)
| board | wall ratio (off/on) | direction | nodes off→on |
|---|---|---|---|
| Al Escargot | 0.42× | ON SLOWER (2.36× slower) | 105 → 72 |
| Platinum Blonde | 1.84× | ON faster (1.84×) | 489 → 83 |
| Golden Nugget | 0.56× | ON SLOWER (1.77× slower) | 1258 → 369 |
| Inkala 2010 | 0.30× | ON SLOWER (3.29× slower) | 134 → 114 |
| 17-clue minimal | 15.76× | ON faster (15.76×) | 1381 → 64 |
```

## Run 2 (consistency check)

```
## Per-bucket aggregate (Σoff / Σon)
| bucket | boards | wall ratio (off/on) | nodes off→on |
|---|---|---|---|
| hard-9x9 (named) | 5 | 0.94× | 3367 → 702 |
| N3/hard | 20 | 3.00× | 4483 → 1154 |
| N4/easy | 10 | 1.00× | 640 → 640 |
| N4/medium | 10 | 26.03× | 24768 → 1428 |
| N4/hard | 5 | 26.65× | 7255 → 754 |

## Corpus aggregate
wall ratio (Σoff/Σon): 12.73×   |   nodes off→on: 40513 → 4678 (8.66× fewer)

## Named hard 9×9 (individual ratios, minority-cost direction)
| board | wall ratio (off/on) | direction | nodes off→on |
|---|---|---|---|
| Al Escargot | 0.40× | ON SLOWER (2.48× slower) | 105 → 72 |
| Platinum Blonde | 1.77× | ON faster (1.77×) | 489 → 83 |
| Golden Nugget | 0.56× | ON SLOWER (1.78× slower) | 1258 → 369 |
| Inkala 2010 | 0.33× | ON SLOWER (3.00× slower) | 134 → 114 |
| 17-clue minimal | 14.55× | ON faster (14.55×) | 1381 → 64 |
```

## Reading it

- **Corpus aggregate: 12.58× / 12.73× — first-party, NOT materially different
  from the retired 13.36×.** Same class (~12.6–12.7× on the 50-board corpus vs
  ~13.36× on the retired 112-board corpus). The GAC default-ON decision rests on
  a first-party number now. Node counts are byte-identical across runs (40,513 →
  4,678, an 8.66× search reduction) — the deterministic spine under the
  host-dependent wall ratio.
- **The win lives in N=4.** N4/medium ≈25.7–26.0×, N4/hard ≈26.7–26.8×,
  N3/hard ≈3.0×. N4/easy is 1.00× (640 → 640 nodes: forward-checking already
  singleton-propagates these, GAC adds no pruning, ratio pins at unity — the
  probe's honesty check).
- **Divergence 1 — the minority cost is DEEPER than previously disclosed.** The
  old prose said "1.3–2.5× slower" for the three slow named boards. Measured
  first-party: **Al Escargot 0.40–0.42× (≈2.4–2.5× slower), Golden Nugget 0.56×
  (≈1.8× slower), Inkala 2010 0.30–0.33× (≈3.0–3.3× slower)** — i.e. 1.8–3.3×
  slower, not 1.3–2.5×. Inkala in particular is worse ON than the retired figure
  implied. The named-board disclosure in `benchmarks.md` is corrected to these
  measured ratios. Direction is unchanged: 3 of 5 named boards slower ON, the
  aggregate win dominated by N=4.
- **Divergence 2 — corpus is 50, not 112.** The first-party number is measured
  on the corrected-reality post-W4 bank; the 112-board figure and its harness are
  retired to one historical sentence.

## Ledger + doc close

- `docs/benchmarks.md` GAC section re-stamped: 12.6–12.7× (this probe, `ede25188`)
  is the first-party aggregate; the 13.36× / 112-board line becomes one
  historical sentence; the minority-cost row updated to the measured named-board
  ratios.
- `appendices/A-corrections-ledger.md` §5 appends the first-party-probe close and
  the two divergences.
- The probe compiles from a clean checkout (`cargo build --release --example
  gac_timing_probe`), `cargo clippy --release --example gac_timing_probe -- -D
  warnings` is clean, and needs no scratch deps (data is crate-owned
  `include`-adjacent under `csp-solver/data/`).
