#!/bin/bash
# MOT-VERB pass-4 replay: merge VERB's pass-3 delta onto LADDER's pass-4 tree.
WT=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-59
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/verb-merge
DIFF=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass3/prototype/MOT-VERB/pass3.diff

rm -rf "$S/merged"; mkdir -p "$S/merged"
FILES=$(grep -E '^diff --git' "$DIFF" | sed 's|diff --git a/||;s| b/.*||')
CONF=0; OK=0; NEW=0
for f in $FILES; do
  if [ ! -f "$S/base/$f" ]; then
    printf 'NEWFILE   %s\n' "$f"; NEW=$((NEW+1)); continue
  fi
  mkdir -p "$S/merged/$(dirname "$f")"
  cp "$WT/$f" "$S/merged/$f"
  git merge-file -L LADDER-p4 -L base-74a2b5d9 -L VERB-p3 "$S/merged/$f" "$S/base/$f" "$S/theirs/$f"
  rc=$?
  if [ "$rc" -eq 0 ]; then
    printf 'CLEAN     %s\n' "$f"; OK=$((OK+1))
  else
    n=$(grep -c '^<<<<<<<' "$S/merged/$f")
    printf 'CONFLICT  %-70s hunks=%s\n' "$f" "$n"; CONF=$((CONF+1))
  fi
done
printf '=== clean=%s conflicted=%s newfile=%s ===\n' "$OK" "$CONF" "$NEW"
