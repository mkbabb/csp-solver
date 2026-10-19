#!/bin/bash
# final-tree.sh — the tree's drop-clock legs x5 on its FINAL bytes (dist rebuilt after the comment cure), then all servers down
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/NOTE-ERASE; SV=$S/instruments/erase9-serve.sh; O=$S/logs/final-tree.txt
$SV down u9 >> $O 2>&1
$S/instruments/build-dir.sh wtf /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-47/web/frontend; cat $S/logs/build-wtf.exit >> $O
$SV up wtf 4240 /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-47/web/frontend $S/dist-wtf .erase9-build.mts >> $O 2>&1
$S/instruments/run-spec2.sh /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-47/web/frontend 4240 wtf-dropclock-x5 -g "drop clock" --repeat-each 5; cat $S/logs/spec-wtf-dropclock-x5.exit >> $O
$SV down wtf >> $O 2>&1
echo FINAL-TREE-DONE >> $O
