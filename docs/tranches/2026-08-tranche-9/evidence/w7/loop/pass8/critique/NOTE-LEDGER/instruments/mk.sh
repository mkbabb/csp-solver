#!/bin/bash
# mk.sh <dest> <diff>... : git archive 74a2b5d9 + diffs (git apply, bare exit printed); node_modules symlinked
M=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion
D=$1; shift
mkdir -p $D && cd $M && git archive 74a2b5d9 | tar -x -C $D
cd $D; for d in "$@"; do git apply --check "$d"; c=$?; git apply "$d"; echo "apply $(basename $d) check=$c apply=$?"; done
ln -s $M/web/frontend/node_modules $D/web/frontend/node_modules
