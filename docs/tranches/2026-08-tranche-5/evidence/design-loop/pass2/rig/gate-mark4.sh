#!/bin/zsh
# MARK-4 GATE + LOC ledger. The diff is tracked-modifications PLUS the two new files in full
# (a `git diff` alone would silently exempt every untracked line — the gate has to see them).
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_6e1b18f4-0f2-1
OUT=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/design-loop/pass2/rig
NEW1=web/frontend/src/games/shared/useStagingBridge.ts
NEW2=web/frontend/src/pencil/chrome/GameGallery/StagingBand.vue

git --no-pager diff -U0 | grep '^+' | grep -v '^+++' | sed 's/^+//' > $OUT/added.txt
cat $NEW1 $NEW2 >> $OUT/added.txt

echo "added lines total: $(wc -l < $OUT/added.txt)"
echo "MARK-4  'filter:' in added lines: $(grep -c 'filter:' $OUT/added.txt)  (gate: 0)"
echo "NEG CTL 'flex' in added lines:    $(grep -c 'flex' $OUT/added.txt)  (proves the grep fires)"
echo "NEG CTL 'url(#' in added lines:   $(grep -c 'url(#' $OUT/added.txt)"
echo
echo "--- LOC by file (added / removed) ---"
git --no-pager diff --numstat
echo "$(wc -l < $NEW1)	0	$NEW1 (new)"
echo "$(wc -l < $NEW2)	0	$NEW2 (new)"
