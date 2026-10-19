#!/bin/bash
# bands.sh <plant>... : lint:bands (self-test) + lint:copy on ubank under each plant; git objects via the §13 tree's gitdir (read-only)
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/crit-MOT-VERB
U=$S/ubank/web/frontend; B=$S/bank/web/frontend
GD=$(sed 's/gitdir: //' /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-59/.git)
for p in "$@"; do
  cp $B/src/pencil/composables/bootHand.ts $U/src/pencil/composables/bootHand.ts
  cp $B/src/pencil/config/pencilConfig.ts $U/src/pencil/config/pencilConfig.ts
  python3 $S/bin/plant.py $U $p > $S/logs/bands-$p.log 2>&1
  (cd $U && GIT_DIR=$GD node scripts/check-motion-bands.mjs --self-test >> $S/logs/bands-$p.log 2>&1; echo "bands $p $?" >> $S/logs/bands.tsv)
done
cp $B/src/pencil/composables/bootHand.ts $U/src/pencil/composables/bootHand.ts; cp $B/src/pencil/config/pencilConfig.ts $U/src/pencil/config/pencilConfig.ts
(cd $U && node scripts/check-copy-register.mjs --self-test > $S/logs/copy-tree.log 2>&1; echo "copy tree $?" >> $S/logs/bands.tsv)
echo BANDSDONE >> $S/logs/bands.tsv
