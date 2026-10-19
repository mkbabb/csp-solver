#!/bin/bash
# cut.sh <out.diff> [base]  — cut the work tree's diff through a temporary index
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-47
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/NOTE-ERASE
OUT=$1; BASE=${2:-74a2b5d9317e7795cee6bf63e861bd44f54ae80e}
cd "$W" || exit 9
export GIT_INDEX_FILE=$S/tmp.index.$$
git read-tree "$BASE"
git add -A -- . ':(exclude).erase9' ':(exclude)web/frontend/.erase9*' ':(exclude)*.erase9.*'
TREE=$(git write-tree)
git diff --cached --binary "$BASE" > "$OUT"
echo "tree $TREE"
echo "bytes $(wc -c < "$OUT")"
echo "sha1 $(shasum -a 1 "$OUT" | cut -d' ' -f1)"
echo "shortstat $(git diff --cached --shortstat "$BASE")"
git diff --cached --name-status "$BASE" > "$OUT.names"
mv "$GIT_INDEX_FILE" $S/trash/ 2>/dev/null
