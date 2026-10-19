#!/bin/bash
# PAL-WALK pass-9: write BANKED.txt from bank.sh's and applycheck.sh's outputs (no git writes).
S=<lane-scratch>
OUT=<repo>/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass9/prototype/PAL-WALK
B=$OUT/BANKED.txt
{
echo "worktree .claude/worktrees/wf_308fa864-c94-1"
echo "base 74a2b5d9317e7795cee6bf63e861bd44f54ae80e"
echo "tree $(grep '^tree ' $S/logs/bank.log | awk '{print $2}')"
echo "pass9.diff bytes $(wc -c < $OUT/pass9.diff | tr -d ' ')"
echo "pass9.diff sha1 $(shasum $OUT/pass9.diff | awk '{print $1}')"
echo "shortstat $(cat $S/bank.shortstat)"
echo "on-WAVE base acde977b (74a2b5d9 + pass8/integrate/WAVE.diff = acb9c08e, + pass9/instruments/homes.on-WAVE.diff)"
echo "on-WAVE tree $(grep '^wave-tree ' $S/logs/bank.log | awk '{print $2}')"
echo "pass9.delta.on-WAVE.diff bytes $(wc -c < $OUT/pass9.delta.on-WAVE.diff | tr -d ' ')"
echo "pass9.delta.on-WAVE.diff sha1 $(shasum $OUT/pass9.delta.on-WAVE.diff | awk '{print $1}')"
echo "on-WAVE shortstat $(cat $S/bankwave.shortstat)"
echo "stripped dot paths: $(grep -c '^stripped' $S/logs/bank.log) ($(grep '^stripped' $S/logs/bank.log | awk '{print $2}' | tr '\n' ' '))"
echo "git apply --check --binary, each on a fresh git archive of its base (exits read bare):"
sed 's/^/  /' $S/logs/applycheck.txt
echo "  the overlaps, homes aside (the homes v2 files already exist on those bases by design):"
sed 's/^/    /' $S/logs/applycheck-nonhome.txt
echo "the only dot path in either diff is .github/workflows/ci.yml (product, carried since pass 8); grep of both diffs for the four scratch markers the charter names: 0 each"
} > $B
cat $B
