#!/bin/bash
# re-sync lane-only files (spec, node.d.ts already merged) into wavelane, then cut the on-WAVE delta
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/MRK-LIVE
E=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass9/prototype/MRK-LIVE
cd $S || exit 9
out=$E/pass9.delta.on-WAVE.diff
: > $out
while read f; do
  if [ -f wave/$f ]; then git diff --no-index --binary wave/$f wavelane/$f >> $out
  else git diff --no-index --binary /dev/null wavelane/$f >> $out; fi
done < $S/lane-own.txt
sed -i '' -e 's#^diff --git a/wave/\(.*\) b/wavelane/#diff --git a/\1 b/#' -e 's#^diff --git a/wavelane/\(.*\) b/wavelane/#diff --git a/\1 b/#' -e 's#^--- a/wave/#--- a/#' -e 's#^+++ b/wavelane/#+++ b/#' $out
wc -c < $out; shasum $out; grep -c '^diff --git' $out
