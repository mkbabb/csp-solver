#!/bin/bash
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/accg7
D=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop
R=$S/ap2; mkdir -p $R; cd $R; git clone -q $S/base74 . ; B=$(git rev-parse --abbrev-ref HEAD)
c() { git add -A && git -c user.email=x@x -c user.name=x commit -qm "$1"; }
git apply --check $S/pass7.cum.diff; echo "1 cum --check on fresh 74a2b5d9: $?"
git checkout -q -b r5 $B && git apply $D/pass5/prototype/ACC-GRAPHITE/pass5.diff && c r5
git checkout -q -b r6 $B && git apply $D/pass6/prototype/ACC-GRAPHITE/pass6.diff && c r6
echo "r6 tree $(git rev-parse r6^{tree}) (bank f4d416a69b76)"
git apply --check $S/pass7.delta.diff; echo "2 delta --check on 74a2b5d9+pass6 bank: $?"
git diff --binary r5 r6 > $S/interdiff56.diff; echo "interdiff56: $(git diff --shortstat r5 r6)"
git checkout -q -b integ $B && git apply $D/pass6/integrate/s13-s7-s3.diff && c s13
git apply --check $S/pass7.cum.diff > $S/logs/ap-cum-integ.log 2>&1; echo "3 cum --check on integrated (no A.7): $?"
git apply --3way $S/interdiff56.diff > $S/logs/ap-a7.log 2>&1; echo "4 A.7 re-apply (interdiff56 --3way) on integrated: $?"
git diff --name-only --diff-filter=U | sed 's/^/   conflict: /'
grep -c '^<<<<<<<' $(git diff --name-only --diff-filter=U) 2>/dev/null | sed 's/^/   markers: /'
