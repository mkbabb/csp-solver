#!/usr/bin/env python3
"""P1 bank reshape: re-materialize every template file as sparse, puzzle-only,
compact JSON `{"puzzle":{"<pos>":<val>,...}}`.

Deterministic transform of the *existing* proven-correct boards (not a
stochastic regen): drops the never-read `solution`/`backtracks` fields, drops
zero-hole entries, strips pretty-print whitespace. The set of nonzero givens is
preserved byte-for-byte per file, so every board's uniqueness/correctness proof
carries over unchanged. Prints per-file and total before/after byte counts.
"""
import json, glob, os, sys

ROOT = sys.argv[1]  # <worktree>/csp-solver/data/sudoku_puzzles
files = sorted(glob.glob(os.path.join(ROOT, "*/*/*.json")))
assert files, f"no template files under {ROOT}"

def compact(o):
    return json.dumps(o, separators=(",", ":"))

before_total = after_total = 0
n5_after = 0
per_size = {}
for f in files:
    raw = open(f, "rb").read()
    before = len(raw)
    d = json.loads(raw)
    puzzle = d["puzzle"]
    # sparse: nonzero givens only; keys stay strings, values ints
    sparse = {k: int(v) for k, v in puzzle.items() if int(v) > 0}
    out = compact({"puzzle": sparse})  # wrapped form -> the 81,963 B target
    out_bytes = out.encode("utf-8")
    open(f, "wb").write(out_bytes)
    after = len(out_bytes)
    before_total += before
    after_total += after
    # size bucket key = N
    n = f.split(os.sep)[-3]
    ps = per_size.setdefault(n, [0, 0, 0])
    ps[0] += before; ps[1] += after; ps[2] += 1
    if os.sep + "5" + os.sep in f:
        n5_after += after

print(f"files reshaped: {len(files)}")
for n in sorted(per_size):
    b, a, c = per_size[n]
    print(f"  N={n}: {c:3d} files  {b:7d} -> {a:6d} B")
print(f"TOTAL embed: {before_total} -> {after_total} B  "
      f"(-{100*(before_total-after_total)/before_total:.1f}%)")
print(f"N=5 subtree (dies with R1): {n5_after} B")
print(f"surviving embed (excl N=5): {after_total - n5_after} B")
