#!/bin/bash
# mk-copy.sh <label> <diff>... : git archive 74a2b5d9 under $S/copies/<label>, git init-ed BEFORE any apply; each diff --3way; prints gitdir + paths + exit
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass10/crit-NOTE-ERASE
n=$1; shift; D=$S/copies/$n
[ -e $D ] && mv $D $S/trash/copy-$n-$(date +%s)
mkdir -p $D && tar -xf $S/base74.tar -C $D && cd $D && git init -q && git add -A && echo "init $n gitdir=$(git rev-parse --absolute-git-dir) base-tree=$(git write-tree)"
for d in "$@"; do git apply --3way "$d" > $S/logs/copy-$n-$(basename $d).log 2>&1; x=$?; echo "apply $(basename $d) sha1=$(shasum $d | cut -c1-8) exit=$x gitdir=$(git rev-parse --absolute-git-dir) paths=$(git apply --numstat "$d" 2>/dev/null | wc -l | tr -d ' ')"; git add -A; done
echo "tree $n $(git write-tree)"
ln -s /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules $D/web/frontend/node_modules 2>/dev/null; echo done
