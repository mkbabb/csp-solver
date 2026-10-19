#!/bin/bash
# share-truth unit rows: cured; the guard deleted (born-RED); the condition-only "cure" (re-deal arm priced)
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/NOTE-LEDGER
FE=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-46/web/frontend
G=$FE/src/games/shared/GameBoard.vue; B=$S/GameBoard.cured.vue; cp $G $B
cd $FE; echo "load $(uptime | sed 's/.*averages: //')"
npx vitest run src/games/shared/GameBoard.notes.test.ts > $S/logs/st-unit-cured.txt 2>&1; echo "cured exit $?"
sed -i '' 's/if (props.dealt \&\& !spokeThisFlush)/if (props.dealt)/' $G; echo "guard sites left $(grep -c '!spokeThisFlush' $G)"
npx vitest run src/games/shared/GameBoard.notes.test.ts > $S/logs/st-unit-guardless.txt 2>&1; echo "guard deleted exit $?"
cp $B $G
perl -0pi -e 's/if \(props\.dealt && !spokeThisFlush\)\n        setMargin\(props\.freshBoardCopy\(\), "graphite", "empty"\);/if (props.dealt) {\n        const l = props.freshBoardCopy();\n        if (l) setMargin(l, "graphite", "empty");\n      }/' $G; echo "condition-only sites $(grep -c 'if (l) setMargin' $G)"
npx vitest run src/games/shared/GameBoard.notes.test.ts > $S/logs/st-unit-condonly.txt 2>&1; echo "condition-only exit $?"
cp $B $G; cmp -s $B $G && echo "restored equal"; echo DONE
