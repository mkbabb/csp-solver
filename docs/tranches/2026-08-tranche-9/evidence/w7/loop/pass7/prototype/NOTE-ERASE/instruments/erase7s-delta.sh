#!/bin/bash
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad; R=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion; W=$R/.claude/worktrees/wf_f72f3b5a-83a-47; E=$R/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass6
N=${1:-1}
cd $W; export GIT_INDEX_FILE=$S/erase7s-idx/now$N; git read-tree HEAD; git add -A -- web/frontend/src web/frontend/e2e web/frontend/scripts; NOW=$(git write-tree)
git diff --cached --binary HEAD > $S/erase7s-full$N.diff; FULLSTAT=$(git diff --cached --shortstat HEAD); unset GIT_INDEX_FILE
git diff --binary e1893db9668b0a13a76e84a80770bfdf4f49ece2 $NOW > $S/erase7s-delta$N.U3.diff; git diff --binary -U2 e1893db9668b0a13a76e84a80770bfdf4f49ece2 $NOW > $S/erase7s-delta$N.U2.diff
echo "tree=$NOW full: $FULLSTAT bytes=$(wc -c < $S/erase7s-full$N.diff | tr -d ' ') sha1=$(shasum $S/erase7s-full$N.diff | cut -c1-40)"
echo "delta: $(git diff --shortstat e1893db9668b0a13a76e84a80770bfdf4f49ece2 $NOW)"
B=$S/erase7s-apply-base$N; P=$S/erase7s-apply-p6$N; mkdir -p $B $P; git -C $R archive 74a2b5d9 | tar -x -C $B; git -C $R archive 74a2b5d9 | tar -x -C $P
(cd $B && git init -q . && git apply --check $S/erase7s-full$N.diff; echo "full diff on fresh 74a2b5d9: exit=$?")
(cd $P && git init -q . && git apply $E/prototype/NOTE-ERASE/pass6.diff; echo "pass6.diff on fresh 74a2b5d9: exit=$?"; for u in U3 U2; do git apply --check $S/erase7s-delta$N.$u.diff; echo "  delta $u on 74a2b5d9+pass6: exit=$?"; done)
git diff --binary -U1 e1893db9668b0a13a76e84a80770bfdf4f49ece2 $NOW > $S/erase7s-delta$N.U1.diff; (cd $P && git apply --check $S/erase7s-delta$N.U1.diff; echo "  delta U1 on 74a2b5d9+pass6: exit=$?")
for u in U3 U2 U1; do (cd $S/erase7-union && git apply --check $S/erase7s-delta$N.$u.diff 2> $S/erase7s-logs/apply-union-$u.err; echo "delta $u on 74a2b5d9+s13-s7-s3 (union): exit=$?"; head -4 $S/erase7s-logs/apply-union-$u.err); done
for u in U3 U2 U1; do D=$S/erase7s-delta$N.$u.diff; echo "$u bytes=$(wc -c < $D | tr -d ' ') sha1=$(shasum $D | cut -c1-40)"; done
