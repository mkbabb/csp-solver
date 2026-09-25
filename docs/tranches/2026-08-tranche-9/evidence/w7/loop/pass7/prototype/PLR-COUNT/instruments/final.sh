#!/bin/bash
# PLR-COUNT pass 7: the final-sha1 run — both whole spec files, the chair's glyph probe on the tree, the break battery.
R=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrcount7-rig
FE=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-52/web/frontend
s1() { (cd $FE && shasum src/pencil/chrome/PlayerMark/PlayerMark.vue src/pencil/chrome/PlayerMark/copy.ts src/pencil/chrome/PlayerMark/PlayerLobby.vue src/pencil/chrome/AttributionCard/HeadSheet.vue src/pencil/composables/useTallyStrokes.ts e2e/player-tally.spec.ts e2e/player-mark.spec.ts scripts/check-font-coverage.mjs | cut -c1-12 | tr '\n' ' '); }
echo "SHA1-AT-START $(s1)"; echo "LOAD $(sysctl -n vm.loadavg)"
cd $FE
npx playwright test -c .plr-count7/pw.config.ts player-tally.spec.ts > $R/logs/final-tally.log 2>&1; echo "WHOLE player-tally.spec.ts EXIT $? :: $(grep -E '^\s+[0-9]+ (passed|failed|skipped|flaky)' $R/logs/final-tally.log | tr -s ' ' | tr '\n' ' ')"; echo "LOAD $(sysctl -n vm.loadavg)"
npx playwright test -c .plr-count7/pw.config.ts player-mark.spec.ts > $R/logs/final-mark.log 2>&1; echo "WHOLE player-mark.spec.ts EXIT $? :: $(grep -E '^\s+[0-9]+ (passed|failed|skipped|flaky)' $R/logs/final-mark.log | tr -s ' ' | tr '\n' ' ')"; echo "LOAD $(sysctl -n vm.loadavg)"
$R/glyph-cli-tree.sh > $R/logs/final-glyph-cli-tree.log 2>&1; echo "GLYPH CLI TREE :: $(grep -c '^EXIT' $R/logs/final-glyph-cli-tree.log) runs; exits $(grep '^EXIT' $R/logs/final-glyph-cli-tree.log | awk '{print $NF}' | tr '\n' ' ')"
python3 $R/breaks7.py X1b X2w TAIL12 TAILD35 L1 FAINT30 B16 P6NAME-G7 P6NAME-291 ARM-C-tally ARM-C-291 ARM-B-g16 > $R/logs/final-breaks.log 2>&1; echo "BREAKS :: $(grep '^EXIT' $R/logs/final-breaks.log | tr '\n' ' ')"
echo "SHA1-AT-END $(s1)"; echo "LOAD $(sysctl -n vm.loadavg)"
echo FINAL-DONE
