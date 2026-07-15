# T4-W13 · lane P — the two cage primitives (`CageSum` + `CageProduct`)

Base HEAD `38d3f223` (W11 sealed). Rust-only, no port. Both primitives clear the
engine's **n-ary-lambda blindness wall** as devirtualized `ConstraintEnum`
variants with real bounds-propagation `revise_impl`s — never an n-ary lambda.
Additive on `csp-solver` 0.5.x; `traits.rs`, the solver, the domains and every
sibling constraint are byte-untouched. Thermo (T) runs concurrently in the tree;
zero interaction with this surface.

## Footprint

```
?? csp-solver/src/constraint/cage.rs   (CageSum + CageProduct: revise_impl/check_impl + unit oracles)
?? csp-solver/tests/cage.rs            (solver-level brute-force oracle + set-invariance + node-drop)
 M csp-solver/src/constraint.rs        (+2: pub mod cage; pub use CageProduct, CageSum)
 M csp-solver/src/constraint/dispatch.rs (+18: two ConstraintEnum variants + the four match arms)
 M csp-solver/src/csp.rs               (+29: add_cage_sum / add_cage_product on Csp<BitsetDomain>)
```

48 insertions across the three edited files. No shell/solver/trait edit — a
contract drawn right (the W13 discipline: a shell edit means the contract was
drawn wrong; none was needed here).

## 1 — BORN-RED: the n-ary lambda wall is live

`constraint/traits.rs:73-79`, the default `revise`, is verbatim at base:

```rust
match self.scope().len() { 1 => unary, 2 => binary, _ => Revision::Unchanged }
```

The unit probe `n_ary_lambda_cage_sum_does_not_propagate` builds a 3-ary
`LambdaConstraint` for `x+y+z == 6` over three `{1..=9}` cells and calls its
trait `revise` directly:

- **result: `Revision::Unchanged`, every domain still size 9** — zero pruning. A
  bounds propagator would cap each cell at `6 − (1+1) = 4`; the lambda caps
  nothing. The wall is live, and it stays live (`traits.rs` untouched).

The lambda baseline searches blind — the node counts banked in §4.

## 2 — the arithmetic (`csp-solver/src/constraint/cage.rs`)

Both are **bounds-consistency** propagators (the `AllDifferent`/`NotEqual` mold),
iterated to an internal fixpoint because pruning one cell tightens the residual
for the rest. Bounds consistency is *sound* — it never removes a value that
sits in a full solution — but not domain-complete; §3 is the born-RED guard on
exactly that.

**The value seam.** `ConstraintEnum<D>` is domain-generic — its value type ranges
over `u32`, `i32`, `String`, the lattice `BitsetDomain` — so no numeric trait
bound can sit on the shared enum without rejecting the non-numeric domains the
engine already serves. Each cage instead carries its integer reading as *data* —
a `fn(&V) -> i64` pointer set by the `u32` constructor — so the generic
`revise_impl`/`check_impl` compile for every `V` and do real arithmetic for the
one value type a cage is ever built over. The enum's bounds are unchanged; the
variants simply go unconstructed for a non-integer domain.

### CageSum — `Σ xᵢ == target`

With `S_min = Σ min(domⱼ)` and `S_max = Σ max(domⱼ)` over the whole scope, the
residual others-sum for cell *i* is `[S_min − minᵢ, S_max − maxᵢ]`, so

```
xᵢ ∈ [ target − (S_max − maxᵢ),  target − (S_min − minᵢ) ]
```

and every domain value outside that window is pruned. Worked (the unit test):
three `{1..=9}` cells, `target = 6` → `S_max − maxᵢ = 18 − 9 = 9`, so
`allow_hi = 6 − (18 − 9)`… the low residual `S_min − minᵢ = 2 − 1 = 1` gives
`allow_hi = 6 − 1 = 5`? No — the residual uses the *others*, i.e. `S_min − minᵢ =
(1+1+1) − 1 = 2`, `allow_hi = 6 − 2 = 4`. Each cell collapses to `{1,2,3,4}`.
The `17`-over-two-cells case tightens the *low* end symmetrically to `{8,9}`
(`allow_lo = 17 − 9 = 8`).

### CageProduct — `Π xᵢ == target`

Over non-negative integers with a non-zero target, a supported value *x* for
cell *i* must satisfy three necessary conditions:

1. **`x ≠ 0`** — a zero factor forces the whole product to zero.
2. **`x | target`** — every factor divides the target (all factors are positive
   integers, so `target = x · (integer)`).
3. **`target / x ∈ [Π minⱼ, Π maxⱼ]`** over the *other* cells — the required
   cofactor must be reachable by the positive-monotone product bound (product is
   monotone in each non-negative factor, so the extremes are the per-cell
   min/max products).

Worked: three `{1..=6}` cells, `target = 6`, other-max product `6·6 = 36` →
`5` fails (2) and `4` fails (3: `6/4` isn't integral), leaving `{1,2,3,6}`. The
`zero-for-nonzero-target` case drops `0` by (1) and `1` by (3) (`6/1 = 6 > 3`),
leaving `{2,3}`.

A peer still carrying a `0` drags `Π minⱼ` to `0` — a *looser* lower bound, so
still sound; that peer is pruned on its own turn and the fixpoint re-tightens
next pass. The zero-*target* branch is handled soundly for completeness (a cell
whose peers can never be zero is forced to zero). **CageProduct did NOT degrade
to `×`-check-only** — the residual arithmetic admits a clean, sound tightening,
so the spec's graceful-degradation clause was not exercised. KenKen ships `×`
cages with real propagation.

`i64` (not `i128`) is deliberate — see §5.

## 3 — differential oracles (the born-RED soundness guard, `gac_alldiff` pattern)

**Revise-level, randomized (unit, `cage.rs`).** 2 000 iterations each: random
scope (2–4 cells), random non-empty domains (sum over `1..=6`; product over
`0..=6` to exercise zeros), random target. A brute-force cartesian filter
computes every *solution-supported* value per cell; the assert is that each
survives the `revise` (bounds consistency never prunes a supported value) and
that the propagator invents nothing. Both green.

**Solver-level, brute-force oracle (integration, `tests/cage.rs`).** A
`CageSum` CSP (4 all-different cells over `1..=6`, `Σ = 14`) and a `CageProduct`
CSP (3 cells over `1..=6`, `Π = 24`) enumerate exactly the independent
cartesian-filter reference — under **every** `Pruning × Ordering` (4×3), so cage
propagation leaves the enumerate-all invariant untouched (soundness *and*
completeness, set-invariant).

## 4 — the node-count DROP (banked integers)

Same board, once with the `+`/`×` clue as a 3-ary `LambdaConstraint` (the wall —
`Revision::Unchanged`, blind) and once as the devirtualized cage variant.
Identical enumerated solution set both ways (soundness); the cage explores
strictly fewer nodes. `Pruning::Ac3 / Ordering::FailFirst`, enumerate-all:

| board | lambda `nodes_explored` | cage `nodes_explored` | drop |
|---|---|---|---|
| **Killer** (4×4 Sudoku, six cages, four ≥3-cell `CageSum`) | **81** | **19** | 4.3× (−77%) |
| **KenKen** (4×4 Latin, mixed `+ − × ÷`; `+`→`CageSum`, `×`→`CageProduct`, `− ÷`→binary) | **121** | **27** | 4.5× (−78%) |

The `−`/`÷` cages are 2-cell binaries — they propagate via the default binary
revise in both builds, so the delta is purely the n-ary `+`/`×` cages crossing
the wall.

## 5 — the lean band (the W6/T3 lean-erosion discipline: measure, don't assume)

The cages compile into the lean wasm through `ConstraintEnum::{revise,check}`'s
new arms (`CageSum<u32>`/`CageProduct<u32>` monomorphize even though no
Killer/KenKen wasm binding constructs one yet). Measured by isolation — the
`make wasm` lean recipe (`wasm-pack … --profile wasm-release
--no-default-features`, wasm-opt applied) built once with the cage code and once
with it reverted (T's concurrent Thermo held constant in both):

| build | `csp_solver_wasm_bg.wasm` |
|---|---|
| without cages (Thermo present) | 100 004 B |
| **with cages** (i128, `Vec` per pass) | 104 750 B → **+4 746 B** |
| with cages (i64, `Vec` per pass) | 102 911 B → **+2 907 B** |
| **with cages (i64, `Vec`-free)** — shipped | **102 612 B → +2 608 B** |

**Two lean moves, both real:**
- **`i128 → i64`** (−1 839 B): wasm32 emulates 128-bit mul/div/rem in software
  (`__multi3`/`__udivti3`/`__umodti3` — kilobytes of compiler-rt in the lean
  build); it has native 64-bit ops. `i64` is ample — a Killer sum tops near
  1 143, a KenKen product near `9⁹ ≈ 3.8·10⁸`, both dwarfed by `i64::MAX`; the
  product path saturates every multiply so a pathological scope degrades to a
  sound "no upper prune" rather than wrap.
- **`Vec`-free revise** (−299 B): the per-pass `(min,max[,zero])` snapshot `Vec`
  is gone — each cell's bounds recompute inline from `cell_bounds`. Fixpoint and
  propagation are byte-identical (node counts in §4 unchanged), one fewer heap
  path in the hot loop.

**Cage-only delta: +2 608 B.** Against the pristine 90 249 B base this projects
to **92 857 B ≤ 93 000 B** — the cages fit the lean band in isolation.

**Absolute joint figure: 102 612 B (over the 93 000 B ceiling).** The overage is
the concurrent Thermo lane: even with zero cages the tree measures 100 004 B, so
Thermo (+~9 755 B over base) — not the cages — carries the budget past the
ceiling. **Flagged for the joint-seal / WM lean reconciliation**; nothing in this
lane's control closes it.

## 6 — gates

| Gate | Command | Result |
|---|---|---|
| born-RED (wall live) | unit `n_ary_lambda_cage_sum_does_not_propagate` | `Unchanged`, 0 pruned — GREEN |
| fmt | `cargo fmt --check` | clean |
| clippy | `cargo clippy --workspace --all-targets -- -D warnings` | exit 0 (the `proc-macro-error2` future-incompat is pyo3's pre-existing transitive note) |
| tests | `cargo test --workspace` | **197 passed, 0 failed** = 184 baseline UNEDITED + 13 additive (9 cage unit incl. 2×2 000-iter oracles + 4 cage integration) |
| oracles | revise-level randomized soundness ×2 + solver-level brute-force ×2 (set-invariant across 4×3) | GREEN |
| node-drop | `tests/cage.rs`, `--nocapture` | Killer 81→19, KenKen 121→27 — strict, banked |
| lean wasm | `make wasm`, isolation diff | cage delta **+2 608 B**; isolated 92 857 B ≤ 93 000 B; joint 102 612 B flagged |

## 7 — semver posture (additive on 0.5.x)

Every change is a new item or a match-arm extension; no existing pub signature or
behavior changed:

- **NEW** `constraint::{CageSum, CageProduct}` (pub types + re-exports); their
  `revise_impl`/`check_impl` are `pub(crate)` (the sibling-constraint idiom).
- **NEW** `ConstraintEnum::{CageSum, CageProduct}` variants — the four internal
  matches (`Debug`/`scope`/`check`/`revise`) each gain an arm; the enum keeps its
  `D::Value: PartialEq (+ 'static)` bounds unchanged (the value seam, §2). Adding
  variants to a non-`#[non_exhaustive]` pub enum is the wave-sanctioned devirt
  move; the enum is matched only internally (`dispatch.rs`), and the vendored
  bbnf consumer drives the solver rather than matching `ConstraintEnum`.
- **NEW** `Csp<BitsetDomain>::{add_cage_sum, add_cage_product}` — a specialized
  `impl` block; cages are integer arithmetic over the production domain, so they
  home there, not on the generic `impl<D: Domain>`. The generic surface is
  untouched.

The embedded banks, difficulty parity, and enumerate-all semantics are
untouched; the invariant suite passes UNEDITED.
