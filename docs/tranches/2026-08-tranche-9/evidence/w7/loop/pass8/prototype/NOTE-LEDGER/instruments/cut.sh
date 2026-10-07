#!/bin/bash
# cut.sh <out.diff> : the work tree's product diff through a TEMPORARY index (GIT_INDEX_FILE), .ledger8 excluded
P=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/ledger8/p8
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-46
cd $W && export GIT_INDEX_FILE=$P/cut-idx && git read-tree HEAD && git add -A -- . ':!web/frontend/.ledger8' && git diff --cached --binary HEAD > $1
echo "cut $(wc -c < $1 | tr -d ' ') B sha1 $(shasum $1 | cut -c1-40) tree $(git write-tree) $(git diff --cached --shortstat HEAD)"
