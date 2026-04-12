# Benchmark Fixtures

## Pre-migration baseline

The pre-C12 Hungarian baseline (before the CSP migration deleted
`bbnf-buddy/src/geometry/hungarian.ts`) can be reconstructed by:

1. Find the pre-C12 commit: `cd /Users/mkbabb/Programming/bbnf-buddy && git log --oneline | grep "delete hungarian"` — the parent of that commit is the baseline SHA.
2. Create a worktree: `git worktree add /tmp/bbnf-pre-c12 <SHA>~1`
3. The pre-migration code doesn't have a bench file. Cherry-pick the bench from the current `tests/forms/align.bench.ts` into the worktree, adapting imports to use the old `alignForms` (which calls Hungarian instead of WASM).
4. Run `npm install && npm run bench` in the worktree.
5. Capture the output JSON and commit it here as `pre-c12-baseline.json`.

## Post-migration numbers (reference)

Measured on the current Rust morph-core pipeline via `vitest bench`:
- Tier 1 (canonical match, lowercase-b ↔ uppercase-b): ~10,900 ops/s (~92 µs/op)
- Tier 2 (hint-forced CSP path): ~10,900 ops/s (~92 µs/op)
- Identity (alignForms(form, form)): ~19,600 ops/s (~51 µs/op)

These numbers include the full serde-wasm-bindgen round-trip cost.
The Rust-native criterion benches in `morph-core/benches/` measure the
pure Rust pipeline without WASM overhead.

## Comparative harness

`csp-solver/scripts/bench-compare.sh <base-ref> <head-ref>` automates
cross-commit criterion comparison using git worktrees. Produces HTML
reports in `target/criterion/`.
