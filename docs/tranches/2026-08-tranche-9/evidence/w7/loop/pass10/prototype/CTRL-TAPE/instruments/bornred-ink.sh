#!/bin/zsh
# born-RED: plant the session-log reading (undo depth) in place of boardInk, run the ink file, restore
FE=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-27/web/frontend
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass10/CTRL-TAPE
cd $FE
python3 - <<'PY'
p='src/games/shared/useGameState.ts'
s=open(p).read()
a=s.index("  const boardInk = computed(() => {")
b=s.index("  });\n",a)+len("  });\n")
s=s[:a]+"  const boardInk = computed(() => undoDepth.value > 0); // PLANT: the session log\n"+s[b:]
open(p,'w').write(s)
PY
grep -n 'PLANT: the session log' src/games/shared/useGameState.ts
~/.claude/guard/guarded --light --timeout 10 -- npx vitest run --maxWorkers=2 src/games/shared/useGameState.ink.test.ts > $S/unit-ink.bornred.txt 2>&1
echo "PLANT-EXIT=$?" >> $S/unit-ink.bornred.txt
cp $S/useGameState.ts.live src/games/shared/useGameState.ts
cmp src/games/shared/useGameState.ts $S/useGameState.ts.live && echo RESTORED >> $S/unit-ink.bornred.txt
~/.claude/guard/guarded --light --timeout 10 -- npx vitest run --maxWorkers=2 src/games/shared/useGameState.ink.test.ts > $S/unit-ink.restored.txt 2>&1
echo "RESTORED-EXIT=$?" >> $S/unit-ink.restored.txt
