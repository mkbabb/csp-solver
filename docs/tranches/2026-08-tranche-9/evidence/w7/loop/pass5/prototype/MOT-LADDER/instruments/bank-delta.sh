#!/usr/bin/env bash
# Bank LADDER's pass-5 delta: (the tree now) minus (74a2b5d9 + the chair's pass-4 bank of the §13 tree),
# through a TEMPORARY index — the work tree's own index and files are never moved. Scratch excluded.
set -eu
W="$1"; BANK4="$2"; OUT="$3"
cd "$W"
TMP=$(mktemp -d)
export GIT_INDEX_FILE="$TMP/idx"
git read-tree 74a2b5d9
git apply --cached --binary "$BANK4"
T4=$(git write-tree)
git read-tree 74a2b5d9
git add -A -- web/frontend .github ':!web/frontend/.mot-ladder'
T5=$(git write-tree)
git diff --binary "$T4" "$T5" > "$OUT"
git diff --stat "$T4" "$T5" | tail -1
rm -rf "$TMP"
echo "T4 $T4  T5 $T5"
