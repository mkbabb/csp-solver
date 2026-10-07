#!/bin/bash
# mkcopy.sh <dest> <diff>... : git archive 74a2b5d9 + the diffs in order; node_modules symlinked (moved aside if dest exists)
P=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/ledger8/p8
M=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion
D=$1; shift
if [ -e "$D" ]; then mkdir -p $P/../../trash-ledger8-2; mv "$D" $P/../../trash-ledger8-2/$(basename $D)-$(date +%s); fi
mkdir -p $D && cd $M && git archive 74a2b5d9 | tar -x -C $D
cd $D; for d in "$@"; do git apply "$d"; echo "apply $(basename $d) exit=$?"; done
ln -s $M/web/frontend/node_modules $D/web/frontend/node_modules
