# Changelog — morph-core

Form-alignment + landmark-matching primitives built on `csp-solver`. Versioned
in lockstep with `@mkbabb/morph` (the `wasm-morph` bindings), and **independently
of `csp-solver`** — which is an ordinary crates.io dependency pinned by a semver
range, not a version this crate tracks.

Staged for the morph excision (`github.com/mkbabb/morph`): on excision day this
file moves to `morph-core/CHANGELOG.md` in the new repo verbatim. See
`csp-solver/CHANGELOG.md` in csc411 for the workspace-level 0.1.0 publish record.

## Unreleased

Landed in csc411 ahead of the excision (grand-uplift W11) so the decomposition
and its coverage travel with the crate rather than needing a cold-CI follow-up
in the new repo.

### Changed

- **`align.rs` (512 L) decomposed** into `align/{mod,tier1,tier2,pairwise}.rs`:
  the Tier-1 signature fast path, the Tier-2 CSP path (via the native
  `AssignmentBuilder`), and the shared per-pair geometry pipeline are now
  separate cohesive modules behind the single `align_forms` entry point.
- **Lazy Tier-2 cost matrix**: the cost matrix is scored with the O(1)
  topology+centroid metric only; the resample+rotate+Procrustes per-pair
  pipeline runs O(n) times over the solver's winning pairs instead of O(n²)
  over every cost-matrix cell.
- **Centroid memoization**: `Subpath` gains a precomputed `centroid` field
  (symmetric with `bbox`/`signed_area`), read by the cost matrix and the
  per-pair pipeline in place of re-densifying the contour on every call.
- **Scratch arena**: `PairScratch` owns the per-pair geometry buffers, reused
  across every materialized pair; the equal-anchor-count path allocates only the
  two segment vectors that escape into the returned `SubpathPair`.

### Removed

- `AlignInternalResult` and the Tier-2 residual cache: the cached
  residual/shift/Procrustes fields were write-only once scoring stopped reading
  the residual term.

## 0.1.0 — 2026-05-28

First crates.io publish from csc411 (workspace release G.W5). Ported from
`bbnf-buddy/src/forms/*` and `src/geometry/*`: geometry primitives (bezier,
contour, resample, procrustes), the signature + two-tier align orchestration
built on the native `csp_solver::AssignmentBuilder`, proptest coverage, and
criterion benches. Depends on `csp-solver` via a version-pinned dependency
(`csp-solver = { version = "0.1.0", path = ".." }` — the path resolves local
builds, the version resolves the crates.io edge).
