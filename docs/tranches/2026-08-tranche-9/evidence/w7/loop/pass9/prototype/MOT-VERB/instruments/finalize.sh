#!/bin/bash
# finalize.sh : stop MY listeners (cwd-checked), restore the home to homes v2, move the scratch config to trash,
# re-cut the bank, and prove the tree's own write-tree equals the banked tree.
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/MOT-VERB
T=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-59
O=$S/logs/finalize.txt; : > $O
for port in 4246 4247; do
  L=$(lsof -nP -iTCP:$port -sTCP:LISTEN -t 2>/dev/null | head -1)
  [ -z "$L" ] && { echo "$port: no listener" >> $O; continue; }
  C=$(lsof -a -p $L -d cwd 2>/dev/null | tail -1 | awk '{print $NF}')
  if grep -q "listener $L" $S/pids.txt || grep -q "control $L" $S/pids.txt || grep -q "listeners control $L" $S/pids.txt; then
    P=$(ps -o ppid= -p $L | tr -d ' '); kill $L; kill $P 2>/dev/null; echo "$port: killed MY listener $L (cwd $C) wrapper $P $(date +%T)" >> $O
  else echo "$port: listener $L (cwd $C) NOT recorded as mine: left alone" >> $O; fi
done
sleep 2; for port in 4246 4247; do lsof -nP -iTCP:$port -sTCP:LISTEN -t >/dev/null 2>&1 && echo "$port STILL HELD" >> $O || echo "$port free" >> $O; done
cp $S/homes-v2/postpaint.mjs $T/web/frontend/e2e/lib/postpaint.mjs; cp $S/homes-v2/postpaint.d.mts $T/web/frontend/e2e/lib/postpaint.d.mts
[ -e $T/web/frontend/.vite-verb9.config.mts ] && mv $T/web/frontend/.vite-verb9.config.mts $S/trash/vite-verb9.config.mts.$(date +%s)
$S/bin/bank.sh > $S/logs/bank.run 2>&1; echo "bank.sh exit $?" >> $O
cd $T && GIT_INDEX_FILE=$S/idx.final git read-tree 74a2b5d9 && GIT_INDEX_FILE=$S/idx.final git add -A . && echo "tree write-tree at return $(GIT_INDEX_FILE=$S/idx.final git write-tree)" >> $O
grep '^tree ' /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass9/prototype/MOT-VERB/BANKED.txt >> $O
cd $T && git status --porcelain --untracked-files=all | grep -v '^ M\|^M ' | head >> $O
echo FINALIZE-DONE >> $O
