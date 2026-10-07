#!/bin/bash
# wtree.sh <copy root> <idx name> : write-tree of a scratch copy through a temporary index on the main repo's object store
P=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/ledger8/p8
M=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion
export GIT_DIR=$M/.git GIT_INDEX_FILE=$P/idx-$2
git --work-tree=$1 read-tree 74a2b5d9 && git --work-tree=$1 add -A -- . ':!web/frontend/.ledger8p' ':!web/frontend/dist' && git --work-tree=$1 write-tree
