#!/bin/bash
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-47/web/frontend
F=$W/src/pencil/config/pencilConfig.ts
cd $W
BAK=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/pencilConfig.bak; cp $F $BAK
ORIG=$(shasum $F | cut -c1-40)
echo "orig sha1 $ORIG"
run() { npx vitest run src/pencil/chrome/marginNote.motion.test.ts -t "G5" 2>&1 | grep -E "✓|×|FAIL|Tests |AssertionError|expected" | head -6; echo "exit=${PIPESTATUS[0]}"; }
echo "== A: MINT erase: 125 (the act G5 forbids) — must RED"
perl -0pi -e 's/    rise: 520,\n  \},/    rise: 520,\n    erase: 125,\n  },/' $F; grep -c "erase: 125" $F; run
cp "$BAK" $F
echo "== B: re-word the graft banner to §13's own phrasing — must stay GREEN"
perl -0pi -e 's/THE DURATION LADDER \(T9-W7 §13, MOT-LADDER; NOT NOTE-ERASE.s\)/THE DURATION LADDER (T9-W7 §13 · M09) — a short closed set of LENGTHS, not meanings/' $F; grep -c "M09) — a short closed set" $F; run
cp "$BAK" $F
echo "== C: DROP a rung (§7's fold losing rise) — must RED"
perl -0pi -e 's/\n    rise: 520,\n/\n/' $F; grep -c "rise: 520" $F; run
cp "$BAK" $F
echo "restored sha1 $(shasum $F | cut -c1-40) (want $ORIG)"
echo "== D: control, as built — GREEN"; run
