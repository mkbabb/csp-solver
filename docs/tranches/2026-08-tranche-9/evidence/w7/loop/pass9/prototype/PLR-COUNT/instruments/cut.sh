#!/bin/bash
# cut.sh <outdir>: the tree's product diff vs 74a2b5d9 through a temporary index (--binary), plus name-status, shortstat, write-tree
S=$LANE
W=$TREE
O=$1; mkdir -p $O
cd $W || exit 9
export GIT_INDEX_FILE=$O/idx
git read-tree HEAD
git add -A web/frontend
git write-tree > $O/tree.txt
git diff --cached --binary 74a2b5d9 -- web/frontend > $O/pass9.diff; echo "exit=$?" > $O/diff.exit
git diff --cached --shortstat 74a2b5d9 -- web/frontend > $O/shortstat.txt
git diff --cached --name-status 74a2b5d9 -- web/frontend > $O/names.txt
git diff --cached --name-status 74a2b5d9 > $O/names-all.txt
shasum $O/pass9.diff > $O/sha.txt; wc -c < $O/pass9.diff > $O/bytes.txt
echo CUT-DONE
