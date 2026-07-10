# LANE G5 — the morph census (PASS 3)

**Charter:** the crates.io/npm morph-consumer reality that gates the `hungarian` →
hand-rolled Kuhn-Munkres decision (A20 / synthesis §2.4 / wave T3-W5). Verify against
`mkbabb/morph` HEAD: its csp-solver usage surface, and whether the AssignmentBuilder paths
it exercises would feel the LAP swap.

**Verdict: CLEAN — GREEN. The `hungarian`→hand-rolled KM swap is invisible to morph on two
independent grounds. The W5 gate ("morph census from W0 must be clean") is SATISFIED. No
coordination with morph is required for the swap.**

---

## 1. morph HEAD + the dependency pin

- Cloned `gh repo clone mkbabb/morph` (shallow). **HEAD = `b1192863c6486a979a37e947960a59a21662e04c`**,
  2026-07-06, single commit: *"Import morph-core + morph-wasm from csc411 @ 4568dc7e"*. A fresh
  post-excision import; matches the excision provenance in the project CLAUDE.md.
- `morph-core/Cargo.toml`: **`csp-solver = "0.2"`** — an ordinary crates.io semver range, no path
  key, no git coupling (confirms the README's "consumes the published engine" framing).
- `Cargo.lock`: `csp-solver` resolves to **`0.2.0`** (checksum `88841e47…`), and its **only**
  transitive dependency is `include_dir` — **`hungarian` appears zero times in morph's entire
  lockfile** (`grep -c hungarian Cargo.lock` = 0).

## 2. The usage surface — one call site, group-full

Whole-repo sweep (`grep -rn "assignment()\|solve_lap\|solve_branch_and_bound\|hungarian\|kuhn\|\.solve("`
across every `.rs`, benches included): **exactly one** `assignment()` call and **one** `.solve()`
in all of morph — both in `morph-core/src/align/tier2.rs`:

```rust
// morph-core/src/align/tier2.rs:91-103
let mut builder = csp_solver::assignment()
    .rows(n_src)
    .cols(n_tgt)
    .cost(|i, k| cost_matrix_ref[i * n_tgt + k])
    .row_group(|i| row_groups_ref[i])   // ← ALWAYS set (role tags)
    .col_group(|k| col_groups_ref[k])   // ← ALWAYS set (role tags)
    .unmatch_penalty(UNMATCH_PENALTY);
for &(row, col) in &hint_pairs { builder = builder.pin(row, col); }  // optional pins
let solution = builder.solve().expect("alignment CSP must be solvable");
```

`row_group`/`col_group` are set **unconditionally on every invocation** — the role tag of each
subpath (`source.subpaths[i].role.tag()`, tier2.rs:70-73) is structural to morph's alignment
domain, not optional. Benches (`align.rs`, `primitives.rs`) reach the builder only through
`align_forms` → tier2; no direct call. morph-wasm calls nothing (it wires `PairwiseAlignment`
over the wire).

## 3. Why the swap cannot touch morph — two independent walls

**Wall A — the dispatch guard (structural).** In this repo,
`AssignmentBuilder::solve()` (`csp-solver/src/builder/assignment.rs:340`) routes to the
closed-form `solve_lap()` (the `hungarian::minimize` call at line 411 — the *only* `hungarian`
call site in the whole engine) **only when**:

```rust
if self.pins.is_empty() && self.row_groups.is_empty() && self.col_groups.is_empty() {
    return Ok(self.solve_lap());  // hungarian — the swap target
}
self.solve_csp()                   // B&B — untouched by the swap
```

`row_group(f)` sets `self.row_groups = (0..self.n_rows).map(f).collect()` (assignment.rs:275-276),
so with `n_rows ≥ 1` it is always non-empty; likewise `col_group`. morph's `align_forms`
short-circuits the zero-cardinality case (`if n_src == 0 || n_tgt == 0 { return … }`,
align/mod.rs:60) **before** tier2 is ever reached, so at the call site `n_src ≥ 1 && n_tgt ≥ 1`.
Therefore `self.row_groups.is_empty()` is **always false** for morph → morph **always** takes the
branch-and-bound `solve_csp()` path and **never** reaches `hungarian::minimize`. The swap replaces
code morph never executes.

**Wall B — the version gap (temporal, redundant).** morph's pinned `csp-solver 0.2.0` does not
even contain the LAP dispatch — its lockfile deps are `include_dir` only, no `hungarian`. The
closed-form path was added after 0.2.0 (present at current HEAD 0.3.0; the swap lands in the
ratified **0.4.0**, owner ballot item 2). `csp-solver = "0.2"` is `>=0.2.0, <0.3.0` — it will
**not** auto-resolve to 0.3 or 0.4; morph must manually bump the range to receive any of it, and
even then Wall A holds.

## 4. Tie-break / determinism note

The swap replaces one proven-optimal O(n³) LAP solver with another; the only observable difference a
consumer could see is *which* optimal assignment is returned under cost ties. This is moot for
morph — it never hits the LAP path. The general concern would apply only to a hypothetical
group-free **and** pin-free `assignment()` consumer; morph is structurally group-full, and it is the
only known external consumer of this surface. The in-repo `tests/assignment_proptest.rs` oracle is
the correctness guard for the swap itself (compares hand-rolled KM against the CSP path across
random instances) — independent of the morph census.

## 5. Disposition for the wave plan

- **A20 hungarian→hand-rolled KM (T3-W5): UNBLOCKED from the morph angle.** The synthesis §2.4 gate
  and §4-Q3 open question ("gates three W3–W5 rows") are answered CLEAN. Only the in-repo proptest
  oracle needs to stay green — no external-consumer coordination.
- The morph census also incidentally clears the **other two rows** the synthesis said G5 gates
  (§4): the S9-agg pub sweep and the isomorphic excise. morph's only import surface is
  `csp_solver::assignment()` / `AssignmentBuilder` / `AssignmentSolution` (all `pub`, untouched by
  the demotions) and it never touches `wasm/src/isomorphic.rs` (a wasm-crate module, not on
  morph-core's rlib path). No demoted symbol and no excised isomorphic surface appears anywhere in
  morph's tree.
- **No version-stamp coordination needed:** the 0.4.0 swap reaches morph only on a manual
  `"0.2"`→`"0.4"` bump, and is behavior-invisible to it regardless.

**Evidence banked:** morph HEAD `b1192863`, single `assignment()` call site (tier2.rs:91),
group-full unconditionally, lockfile `hungarian`-count = 0, csp-solver pin 0.2.0 (deps:
`include_dir` only). Engine-side guard at `csp-solver/src/builder/assignment.rs:340,275-276,411`.
