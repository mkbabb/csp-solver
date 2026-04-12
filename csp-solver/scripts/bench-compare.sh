#!/usr/bin/env bash
# bench-compare.sh — compare criterion benchmarks between two git refs.
#
# Usage: ./scripts/bench-compare.sh <base-ref> <head-ref>
#
# Creates temporary worktrees for each ref, runs `cargo bench` in both,
# then uses criterion's --baseline flag to produce a comparison report.
# Worktrees are cleaned up on exit (success or failure).

set -euo pipefail

BASE_REF="${1:?Usage: bench-compare.sh <base-ref> <head-ref>}"
HEAD_REF="${2:?Usage: bench-compare.sh <base-ref> <head-ref>}"

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BASE_WT="/tmp/bench-compare-base-$$"
HEAD_WT="/tmp/bench-compare-head-$$"

cleanup() {
    cd "$REPO_ROOT"
    git worktree remove "$BASE_WT" --force 2>/dev/null || true
    git worktree remove "$HEAD_WT" --force 2>/dev/null || true
}
trap cleanup EXIT ERR

echo "=== bench-compare: $BASE_REF vs $HEAD_REF ==="

# Create worktrees
cd "$REPO_ROOT"
git worktree add "$BASE_WT" "$BASE_REF" 2>/dev/null
git worktree add "$HEAD_WT" "$HEAD_REF" 2>/dev/null

# Run baseline benchmarks
echo "--- Running baseline ($BASE_REF) ---"
cd "$BASE_WT"
cargo bench -p csp-solver --bench assignment -- --save-baseline base 2>&1 | tail -5
cargo bench -p morph-core --bench align -- --save-baseline base 2>&1 | tail -5 || true
cargo bench -p morph-core --bench primitives -- --save-baseline base 2>&1 | tail -5 || true

# Run head benchmarks with comparison
echo "--- Running head ($HEAD_REF) ---"
cd "$HEAD_WT"
cargo bench -p csp-solver --bench assignment -- --baseline base 2>&1 | tail -20
cargo bench -p morph-core --bench align -- --baseline base 2>&1 | tail -20 || true
cargo bench -p morph-core --bench primitives -- --baseline base 2>&1 | tail -20 || true

echo "=== Comparison complete. HTML reports in target/criterion/ ==="
