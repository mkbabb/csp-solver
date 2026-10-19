#!/bin/bash
# verify-bank.sh <bank.diff> <expected tree> : apply --check + apply on a FRESH git archive 74a2b5d9, replayed write-tree
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/integrate-s13-s7-s3
R=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion
B=$1; WANT=$2; V=$S/verify-$(date +%H%M%S); mkdir -p $V
git -C $R archive 74a2b5d9 | tar -x -C $V; echo "archive $?"
cd $V; git init -q; echo $R/.git/objects > .git/objects/info/alternates
git add -A; git update-index --add --cacheinfo 160000,8781ebb06c03547f57e33182ec1a970fd96d7069,docs/precepts
echo "base $(git write-tree)"
git apply --check $B; echo "apply-check-worktree $?"
git apply --index $B; echo "apply-index $?"
T=$(git write-tree); echo "replayed $T want $WANT $([ $T = $WANT ] && echo EQUAL || echo DIFFER)"
echo "paths $(git diff --name-only 5fd59288 $T | wc -l)"
echo VERIFY-DONE $V
