#!/bin/bash
# run-c.sh : the FINAL bytes — cut, fresh tree copy t8 + build (identity), fresh union L8 + port, the on-union delta,
# then the batteries on t8 (tree), L8 (union+Δ), u8 (union base); nothing edits a copy while its battery runs
P=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/ledger8/p8
M=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion; E=$M/docs/tranches/2026-08-tranche-9/evidence/w7/loop
W=$M/.claude/worktrees/wf_f72f3b5a-83a-46/web/frontend
O=$P/q/run-c.txt; echo "start $(date +%T) load $(uptime | sed 's/.*averages: //')" > $O
bash $P/bin/cut.sh $P/cut-final.diff >> $O
bash $P/bin/mkcopy.sh $P/t8 $P/cut-final.diff >> $O 2>&1
echo "t8 write-tree $(bash $P/bin/wtree.sh $P/t8 t8f)" >> $O
bash $P/bin/build.sh $P/t8 $P/dists/tree2 t8f >> $O 2>&1
bash $P/bin/mkcopy.sh $P/L8 $E/pass7/integrate/s13-s7-s3.diff $E/pass8/instruments/homes.on-s13-s7-s3.diff $E/pass8/prototype/NOTE-ERASE/pass8.delta.on-s13-s7-s3.diff >> $O 2>&1
python3 $P/bin/port.py $W $P/L8/web/frontend >> $O 2>&1
mkdir -p $P/../../trash-ledger8-3; mv $P/L8/web/frontend/scripts/shape $P/../../trash-ledger8-3/L8-scripts-shape-$(date +%s)
echo "L8 write-tree $(bash $P/bin/wtree.sh $P/L8 L8f)" >> $O
cd $M && git diff --binary 1f104003f5179edc751add61bed0f07dfcc7ab61 $(tail -1 $O | awk '{print $3}') > $P/on-union.diff
echo "on-union delta $(wc -c < $P/on-union.diff | tr -d ' ') B sha1 $(shasum $P/on-union.diff | cut -c1-40) $(git diff --shortstat 1f104003f5179edc751add61bed0f07dfcc7ab61 $(tail -1 $O | awk '{print $3}'))" >> $O
bash $P/bin/build.sh $P/L8 $P/dists/u-hold2 L8f >> $O 2>&1
for f in e2e/note-reserve.spec.ts scripts/check-pw-projects.mjs; do cmp $W/$f $P/L8/web/frontend/$f && echo "L8 $f = tree" >> $O; done
bash $P/bin/battery.sh t8 $P/dists/tree2
bash $P/bin/battery.sh L8 $P/dists/u-hold2
bash $P/bin/battery.sh u8 $P/dists/u-hold
echo "DONE $(date +%T) load $(uptime | sed 's/.*averages: //')" >> $O
