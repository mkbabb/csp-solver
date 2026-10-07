#!/bin/bash
# cut.sh <name>: write-tree via temp index; cumulative diff vs 74a2b5d9, delta vs pass-7 bank beecfecc; apply --check each on a fresh archive.
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/graphite8
T=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-40
N=$1; cd $T
export GIT_INDEX_FILE=$S/idx-cut-$N
git read-tree 74a2b5d9 && git add -A web/frontend .github scripts
W=$(git write-tree); unset GIT_INDEX_FILE
git diff --binary 74a2b5d9 $W > $S/cut-$N.cum.diff
git diff --binary beecfeccf7e90b76b7567da113b4be47f4100f9b $W > $S/cut-$N.delta.diff
echo "WRITE-TREE $W"
for k in cum delta; do echo "$k bytes $(wc -c < $S/cut-$N.$k.diff) sha1 $(shasum $S/cut-$N.$k.diff | cut -c1-40) $(git apply --stat $S/cut-$N.$k.diff | tail -1)"; done
for b in 74a2b5d9:cum beecfeccf7e90b76b7567da113b4be47f4100f9b:delta; do base=${b%%:*}; k=${b##*:}; X=$S/chk-$N-$k; mkdir -p $X; git archive $base | tar -x -C $X; (cd $X && git init -q && git apply --check $S/cut-$N.$k.diff); echo "apply --check $k on $base: $?"; done
