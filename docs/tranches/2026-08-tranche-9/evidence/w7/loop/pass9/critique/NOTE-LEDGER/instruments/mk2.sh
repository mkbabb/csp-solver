#!/bin/zsh
R=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion
S=$R/.claude/t9-scratch/work/pass9/crit-NOTE-LEDGER
export GIT_CEILING_DIRECTORIES=$S
E=$R/docs/tranches/2026-08-tranche-9/evidence/w7/loop
W=$R/.claude/worktrees/wf_f72f3b5a-83a-46
cp -R $S/base $S/t9; cp -R $S/base $S/t8; cp -R $S/base $S/h2
cd $S/t9 && git apply --binary $E/pass9/prototype/NOTE-LEDGER/pass9.diff; echo "t9 apply $?" > $S/mk2.txt
cd $S/t8 && git apply --binary $E/pass8/prototype/NOTE-LEDGER/pass8.diff; echo "t8 apply $?" >> $S/mk2.txt
cd $S/h2 && git apply --binary $E/pass9/instruments/homes.diff; echo "h2 apply $?" >> $S/mk2.txt
grep '^+++ b/' $E/pass9/prototype/NOTE-LEDGER/pass9.diff | sed 's#^+++ b/##' > $S/p9paths.txt
grep '^+++ b/' $E/pass9/instruments/homes.diff | sed 's#^+++ b/##' > $S/homepaths.txt
eq=0; ne=0; for p in $(cat $S/p9paths.txt); do if cmp -s $W/$p $S/t9/$p; then eq=$((eq+1)); else ne=$((ne+1)); echo "TREE-NE $p" >> $S/mk2.txt; fi; done; echo "tree vs t9: eq $eq ne $ne" >> $S/mk2.txt
eq=0; ne=0; for p in $(cat $S/homepaths.txt); do if cmp -s $S/h2/$p $S/t9/$p; then eq=$((eq+1)); else ne=$((ne+1)); echo "HOME-NE $p" >> $S/mk2.txt; fi; done; echo "homes in t9 vs h2: eq $eq ne $ne" >> $S/mk2.txt
cd $W && git status --porcelain > $S/tree-status.txt 2>&1; echo "tree status lines: $(wc -l < $S/tree-status.txt)" >> $S/mk2.txt
for p in $(cat $S/p9paths.txt); do if ! grep -qx "$p" $S/homepaths.txt; then diff -u $S/t8/$p $S/t9/$p > /dev/null 2>&1; r=$?; echo "INTERDIFF $p rc=$r $(diff $S/t8/$p $S/t9/$p 2>/dev/null | grep -c '^>') + $(diff $S/t8/$p $S/t9/$p 2>/dev/null | grep -c '^<') -" >> $S/mk2.txt; fi; done
echo DONE >> $S/mk2.txt
