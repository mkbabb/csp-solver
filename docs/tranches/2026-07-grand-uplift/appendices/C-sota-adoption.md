# Appendix C — SOTA adoption matrix, final verdicts

Pass-1 §6's matrix (5 surveys, verdicts tied to the three real workloads: sudoku demo, BBNF lattice propagation, bbnf-buddy morph) amended by Pass-2 measurements and Pass-3 critiques. **Final verdict** column is what this tranche ships; changed verdicts are bolded with the evidence that moved them.

## CP/CSP core

| Technique | Pass-1 | Final | What moved it |
|---|---|---|---|
| CHS / dynamic wdeg | ADOPT (P1) | **ADAPT — opt-in only, never the sudoku default** | Measured net-negative on 4/5 puzzles under the production config (Minimal17 +419%); the pathology cure was the binary-NotEqual encoding, not CHS (Pass-2 D2). Blame signal adopted unconditionally as substrate |
| Luby restarts + phase saving | ADOPT (P2) | **ADAPT — substrate landed, driver deferred** | `SearchParams` drops `restarts` on the floor; driver = distinct optional engineering with green canaries that invert (Pass-3 #4) — W2 |
| Restart nogoods | ADAPT (wire-or-excise) | **WIRED-as-substrate + canaries; driver deferred** | Sound in isolation (mutation-tested); no producer/consumer until the driver (Pass-3 #4) |
| Event-lite propagation | ADAPT (last) | **HELD, still last** — change-mask default `revise()` landed via zero-alloc; the full priority model stays booked | Pass-2 prototype 4 |
| Value ordering (phase memory) | ADAPT (light) | **DEFERRED with the driver** | rides restarts, which are deferred |
| Trail restoration (keep trailing) | ADAPT | **ADOPTED — amended shape**: touched-VarId trail over the unchanged per-var log + O(1) bitset `restrict_to` (the spec'd replacement trail would've broken the bbnf vendor) | Pass-2 D5; the P0 fix itself lives in this machinery ([`kernel-soundness-closure.md`](../evidence/kernel-soundness-closure.md)) |
| Shaving/SAC presolve | ADAPT (gated) | **REMAINS BOOKED** — no benchmark trigger fired | — |
| ABS/IBS · LDS/ILDS · Compact-Table · LCG/Chuffed · sparse-set · LNS/portfolio | REJECT ×7 | **REJECT stands** | no pass produced contrary evidence |
| GAC (Régin) on AllDifferent | ADOPT (sudoku survey) | **ADOPTED, default ON, `GAC_MIN_PARTICIPANTS=3`** — with the minority cost disclosed (3/5 named hard 9×9 1.3–2.5× slower; 13.36× corpus aggregate) | Pass-2 prototype 2 + Pass-3 #2; W2 |

## Rust performance engineering

| Technique | Pass-1 | Final | What moved it |
|---|---|---|---|
| `lto=fat`/`cu=1`/`strip` | ADOPT ("unconditionally safe") | **REJECT** | quiet-host rerun: **+16–17% slower** alone; combined package ≈0% — the 10–25% band was load-average-50 noise (Pass-3 #14, T15 refuted); W3 |
| `panic="abort"` split profiles | ADAPT | **posture retained, profiles not shipped** — the panic contract tests (both directions) land in W0; no split profile ships on the refuted numbers | Pass-2 prototype 7 (contract verified) + Pass-3 #14 |
| mimalloc | ADOPT (native+py) | **GATED** — the only positive lever (every per-puzzle line faster), but ships only behind a real-workload A/B **and** the `alloc_count.rs` global-allocator conflict fix (compile error once composed) | Pass-3 #14; W3 |
| `target-cpu` (Docker only) | ADAPT | **REMAINS BOOKED** — moot until profiles ship anywhere | — |
| PGO | ADAPT (Docker) | **DEFERRED** — mechanism proven; wiring vapor; re-measure after the mimalloc decision | Pass-2 prototype 7, Pass-3 #14 |
| BOLT · portable_simd · const-generic domains | REJECT / defer ×3 | **stand** | — |
| iai-callgrind CI gate | ADOPT | **REMAINS BOOKED** — no pass executed it; not in the W0 gate set; candidate for post-tranche CI hardening | — |

## Wasm

| Technique | Pass-1 | Final | What moved it |
|---|---|---|---|
| Typed-array views for bulk numerics | ADOPT/ADAPT | **split**: the solver wire shipped flat `Uint32Array` (prototype 6, W6); the morph `Float64Array` wire is **DEFERRED past the excision** — unbuilt, unmeasured; first post-excision PR under the new repo's CI ([`morph-excision-spec.md`](../evidence/morph-excision-spec.md) §3.1, R7) |
| twiggy + CI size budget | ADOPT | **ADOPTED** — W0 lanes (240/215 KB full, ~93 KB lean); morph repo gets its own first-run baseline +10% (W11) |
| JSON round-trip · SIMD128 · allocator swap · threads/SAB · Component Model | REJECT ×5 | **stand** | — |
| wasm-opt per-module split | ADAPT (after crate split) | **partially executed**: the three-file atomicity + `-Oz` + `≥0.14` floor landed as the verified recipe (Pass-2 D9, W0); per-module `-O3`/`-Oz` split still awaits the repo split | — |

## Sudoku domain

| Technique | Pass-1 | Final | What moved it |
|---|---|---|---|
| DLX/tdoku fork | REJECT | **stands** — the generalized `Csp<D>` premise held: the same kernel now provably serves Sudoku + Futoshiki + COP + BBNF (the P0 fix made the enumerate path sound for all four) | Pass-4 closure |
| Symmetry-transform generation | KEEP | **stands** | — |
| Technique-based difficulty rating | ADAPT | **narrowed**: the honor-mechanism (R13) + hardened parity test shipped; a full SE/HoDoKu-class rater remains unbooked—Futoshiki v1 ships **no tiers** rather than fabricate bands (F3) | prototype 13; W10 G2 |
| 25×25 (N=5) | ADAPT-or-bound | **BOUNDED**: Easy pregenerate (9/9 @ 610–627 ms GAC-on); Medium/Hard rejected at the API with the do-not-reopen clause (propagation strength alone can't move the uniqueness wall) | `pass3/n5-rejection-staleness.md`; W4 |

## SVG animation

| Technique | Pass-1 | Final | What moved it |
|---|---|---|---|
| Path-swap boil @6.7 fps, singleton rAF, PRM/visibility gates | KEEP | **stands** — now the *only* discipline (W8) | — |
| Grain hoist off the animating group | ADAPT (P1) | **ADOPTED — filtered-sibling-layers shape** (−72.9% RasterTask), with the honest SSIM envelope: thin pass at spec (0.983–0.985), 6/36 failures at DPR1/mid-phase, geometric bake held as the escape hatch | prototypes 9 + D10e; Pass-3 #9; W8/W9 |
| Shared frame-index scheduler | ADAPT (P1) | **ADOPTED** — chains 83–444 → exactly 1; centralized PRM gate is the required design | prototype 10; W8 |
| Filter ticks → shared rAF | ADAPT (P2) | **ADOPTED** — same scheduler | — |
| `will-change` promotion | ADAPT (measure) | **ANSWERED**: real but secondary (−45.7% task count, +8.6 pts beyond the architecture's −70.3%) | prototype 9 |
| `<use>` instancing · SMIL · Canvas · Houdini · `@property` turbulence | REJECT ×5 | **stand** | — |

**Net honesty note**: two Pass-1 ADOPTs reversed outright under load-controlled measurement (`lto=fat` package, CHS-as-default), one ADOPT stayed unexecuted (iai-callgrind), and every REJECT survived. The matrix moved *toward* fewer, better-evidenced adoptions—the direction a hardening campaign should move it.
