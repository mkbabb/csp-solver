#!/usr/bin/env bash
# MOT-LADDER pass 6 · the bank, cut through a TEMPORARY index (the worktree's own index untouched):
#   T6 = 74a2b5d9 + the tree (tracked + untracked, --binary); pass6-ladder.diff = T6 − 9a5475da (the
#   chair-verified pass-5 bank tree, MOT-VERB/pass5.diff on 74a2b5d9). Apply-verify on 9a5475da.
# Usage: bank-delta.sh <worktree> <scratch> <out diff>
W="$1"; S="$2"; OUT="$3"; cd "$W" || exit 2
GIT_INDEX_FILE="$S/idx" git read-tree 74a2b5d9 && GIT_INDEX_FILE="$S/idx" git add -A && T6=$(GIT_INDEX_FILE="$S/idx" git write-tree)
git diff --binary 9a5475da "$T6" > "$OUT"
GIT_INDEX_FILE="$S/idx2" git read-tree 9a5475da && GIT_INDEX_FILE="$S/idx2" git apply --cached --binary "$OUT" && V=$(GIT_INDEX_FILE="$S/idx2" git write-tree)
echo "T6=$T6 applied=$V"; [ "$T6" = "$V" ]
