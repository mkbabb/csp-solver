#!/bin/sh
# T9-W8 C05 REPAIR ROUND 2 — the re-measure the second REPAIR verdict owes, in ONE sequential
# run so no two of its three censuses ever share the host.
#   A. frames    6 + 6 interleaved windows (A7's fold-frames.mjs, verbatim, only --port differs)
#                — verifier finding (3): the EXIT p95/fps must be restated as medians.
#   B. identity  3 + 3 runs (attrib/fold-identity.mjs, unmodified) — findings (4) and (5): the
#                BASE arm's late logo warm inside the cycle-0 entry window, and the pooled rate
#                of the cured arm's cycle-1 entry encodes.
#   C. label     3 + 3 runs (attrib/label-change.mjs, new) — finding (2): the charter's third
#                Accept clause, "a label change still bakes 4", measured by name.
# Arms: base = dist-base :4252 (index-CS-Vym5OZcaO.js), cured = dist :4253 (index-LjRNU9f7iIUb.js).
# RUN from the worktree's web/frontend.
set -u
EV=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w8/cures/C05
F=$EV/fix-r2
mkdir -p "$F/raw/c4x-desk" "$F/identity" "$F/label"

echo "LOAD START ALL: $(sysctl -n vm.loadavg)" | tee "$F/load.txt"

# ── A. frames, interleaved b,c,b,c…
OUT=$F/raw/c4x-desk
echo "LOAD START frames: $(sysctl -n vm.loadavg)" | tee "$OUT/load.txt"
i=1
while [ "$i" -le 6 ]; do
  node "$EV/fold-frames.mjs" --engine chromium --throttle 4 --viewport desk \
    --cycles 3 --port 4252 --out "$OUT/base-w$i.jsonl" >>"$OUT/console.txt" 2>&1
  echo "base w$i exit=$?" >>"$OUT/console.txt"
  node "$EV/fold-frames.mjs" --engine chromium --throttle 4 --viewport desk \
    --cycles 3 --port 4253 --out "$OUT/cured-w$i.jsonl" >>"$OUT/console.txt" 2>&1
  echo "cured w$i exit=$?" >>"$OUT/console.txt"
  i=$((i + 1))
done
echo "LOAD END frames: $(sysctl -n vm.loadavg)" | tee -a "$OUT/load.txt"

# ── B. capture identity, interleaved
OUT=$F/identity
echo "LOAD START identity: $(sysctl -n vm.loadavg)" | tee "$OUT/load.txt"
i=1
while [ "$i" -le 3 ]; do
  node "$EV/attrib/fold-identity.mjs" --engine chromium --throttle 4 --viewport desk \
    --cycles 3 --port 4252 --out "$OUT/base-$i.jsonl" >"$OUT/base-$i.txt" 2>&1
  echo "base $i exit=$?" >>"$OUT/console.txt"
  node "$EV/attrib/fold-identity.mjs" --engine chromium --throttle 4 --viewport desk \
    --cycles 3 --port 4253 --out "$OUT/cured-$i.jsonl" >"$OUT/cured-$i.txt" 2>&1
  echo "cured $i exit=$?" >>"$OUT/console.txt"
  i=$((i + 1))
done
echo "LOAD END identity: $(sysctl -n vm.loadavg)" | tee -a "$OUT/load.txt"

# ── C. the label change, interleaved
OUT=$F/label
echo "LOAD START label: $(sysctl -n vm.loadavg)" | tee "$OUT/load.txt"
i=1
while [ "$i" -le 3 ]; do
  node "$EV/attrib/label-change.mjs" --engine chromium --throttle 4 --viewport desk \
    --snaps 3 --port 4252 --out "$OUT/base-$i.jsonl" >"$OUT/base-$i.txt" 2>&1
  echo "base $i exit=$?" >>"$OUT/console.txt"
  node "$EV/attrib/label-change.mjs" --engine chromium --throttle 4 --viewport desk \
    --snaps 3 --port 4253 --out "$OUT/cured-$i.jsonl" >"$OUT/cured-$i.txt" 2>&1
  echo "cured $i exit=$?" >>"$OUT/console.txt"
  i=$((i + 1))
done
echo "LOAD END label: $(sysctl -n vm.loadavg)" | tee -a "$OUT/load.txt"

echo "LOAD END ALL: $(sysctl -n vm.loadavg)" | tee -a "$F/load.txt"
echo "BATTERY DONE"
