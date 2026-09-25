#!/bin/bash
# cut the §13 tree through temp indexes: T7 (cumulative on 74a2b5d9) and the delta T6→T7; check both applies
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-59
T6=3d25f02a5c919046af23b6b74d97619ae18ac5b5
cd $W
export GIT_INDEX_FILE=$S/ladder7-idx7
git read-tree 74a2b5d9 && git add -A -- web/frontend .github csp-solver scripts .gitignore
T7=$(git write-tree)
git diff --binary 74a2b5d9 $T7 > $S/ladder7-cum.diff
git diff --binary $T6 $T7 > $S/ladder7-delta.diff
echo "T7 $T7"
echo "cum   $(wc -c < $S/ladder7-cum.diff) B  sha1 $(shasum $S/ladder7-cum.diff | cut -c1-40)  $(git diff --shortstat 74a2b5d9 $T7)"
echo "delta $(wc -c < $S/ladder7-delta.diff) B  sha1 $(shasum $S/ladder7-delta.diff | cut -c1-40)  $(git diff --shortstat $T6 $T7)"
unset GIT_INDEX_FILE
cd $S/ladder7-base && git apply --check $S/ladder7-cum.diff; echo "apply cum on 74a2b5d9 archive: $?"
cd $S/ladder7-integ && git apply --check $S/ladder7-delta.diff; echo "apply delta on 74a2b5d9+s13-s7-s3: $?"
