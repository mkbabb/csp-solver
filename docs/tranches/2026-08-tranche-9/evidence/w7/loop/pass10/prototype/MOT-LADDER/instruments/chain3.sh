#!/bin/zsh
# final-gate chain: snapshot the tree as it stands, build it, then the gate batteries on the final bytes
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass10/MOT-LADDER
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-59
STEP=$1
case $STEP in
  build)
    cd $W && T=$(GIT_INDEX_FILE=$S/idx-c3 sh -c 'git read-tree HEAD && git add -A && git write-tree'); echo $T > $S/tree-final.txt
    $S/build-tree.sh $T ksnap-build
    $S/snap.sh $T ksnap-final > $S/logs/ksnap-final.snap.log 2>&1;;
  gates)
    T=$(cat $S/tree-final.txt)
    $S/kbat.sh $S/ksnap-final $T final NONE K23 K7r C1y C17y C1x C6 C13 C14 C3 C19 C21 C22 C23 C24y C27 C28y
    ;;
  unit)
    U=$S/logs/unit; mkdir -p $U; : > $U/exits.txt
    for d in src/games src/pencil src/composables src/lib scripts; do
      t=$(echo $d | tr / _)
      (cd $S/ksnap-final/web/frontend && npx vitest run --maxWorkers=2 $d > $U/$t.log 2>&1); e=$?
      echo "$d exit $e $(grep -E 'Test Files|Tests ' $U/$t.log | tr -s ' ' | tr '\n' ' ') load $(sysctl -n vm.loadavg)" >> $U/exits.txt
    done;;
esac
echo "STEP-DONE $STEP" >> $S/logs/chain3.steps
