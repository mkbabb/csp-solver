#!/bin/bash
# NOTE-LEDGER pass 6 — the ARM CENSUS (four values) and every born-RED row this pass ships, each
# with its control in the SAME run. Product files are flipped/broken in place and restored by
# sha1 at the end (cp, never rm). Logs to $S; the summary lines go to stdout.
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-46/web/frontend
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/ledger6/breaks
mkdir -p $S; cd $W
F=src/games/shared/GameBoard.vue; M=src/pencil/chrome/MarginNote.vue; C=scripts/check-font-coverage.mjs
SF=$(shasum $F | cut -d' ' -f1); SM=$(shasum $M | cut -d' ' -f1); SC=$(shasum $C | cut -d' ' -f1)
cp $F $S/gb.vue; cp $M $S/mn.vue; cp $C $S/fc.mjs
T="src/games/shared/GameBoard.receipt.test.ts src/games/shared/GameBoard.notes.test.ts src/pencil/chrome/MarginNote.test.ts"
flip() { sed -i '' "s/^const LEDGER_FULFILLED = \"[a-z]*\" as/const LEDGER_FULFILLED = \"$1\" as/" $F; grep -q "const LEDGER_FULFILLED = \"$1\" as" $F || echo "FLIP FAILED $1"; }
unit() { npx vitest run $T > $S/$1.log 2>&1; local c=$?; echo "$1 exit=$c $(grep -E '^ +Tests ' $S/$1.log | tr -s ' ')"; grep -E '^ +(×)' $S/$1.log | sed 's/^/    /' | head -8; }
restore() { cp $S/gb.vue $F; cp $S/mn.vue $M; cp $S/fc.mjs $C; }
# 1 · the arm census, intact
for a in hold age step tint; do flip $a; unit "census-$a"; done; restore
# 2 · the un-spend clause deleted, per arm that could read it (hold = the vacuous control)
for a in hold step tint; do
  flip $a; perl -0pi -e 's/  else if \(live\.spent\) live\.spent = undefined;\n//' $F
  grep -q "else if (live.spent) live.spent = undefined" $F && echo "PLANT FAILED unspend"
  unit "unspend-deleted-$a"; restore
done
# 3 · the push's painted-ink read reverted to pass 5 (full graphite always)
perl -0pi -e 's/            displacedInk \|\|\n//' $M; grep -q "displacedInk ||" $M && echo "PLANT FAILED kf0"
unit "kf0-reverted"; restore
# 4 · row 7's reserve deleted (the pass-5 critic's plant)
perl -0pi -e 's/  \.margin-note \{\n    min-height: inherit;\n  \}\n//' $M; grep -q "min-height: inherit" $M && echo "PLANT FAILED reserve"
unit "reserve-deleted"; restore
# 5 · the corpus: call site deleted (new gate vs the pass-5 script), declaration deleted
perl -pi -e 's/^\s*setMargin\("solved it!", "gold-star", "empty"\);\n//' $F; grep -q 'setMargin("solved it!"' $F && echo "PLANT FAILED callsite"
node $C > $S/fc-callsite.log 2>&1; echo "font-coverage call-site-deleted (pass 6) exit=$? :: $(grep -o 'declares "solved it!"[^.]*' $S/fc-callsite.log | head -1)"
cp /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/ledger6/orig/check-font-coverage.mjs $C
node $C > $S/fc-callsite-p5.log 2>&1; echo "font-coverage call-site-deleted (pass-5 script, the control) exit=$? :: $(grep -c 'solved it!' $S/fc-callsite-p5.log) departure line(s)"
restore
perl -pi -e 's/^\s*"solved it!",\n//' $C; node $C > $S/fc-declared.log 2>&1; echo "font-coverage declared-deleted exit=$?"; restore
node $C > $S/fc-clean.log 2>&1; echo "font-coverage clean exit=$?"
[ "$(shasum $F | cut -d' ' -f1)" = "$SF" ] && [ "$(shasum $M | cut -d' ' -f1)" = "$SM" ] && [ "$(shasum $C | cut -d' ' -f1)" = "$SC" ] && echo "RESTORED $SF $SM $SC" || echo "RESTORE MISMATCH"
echo BREAKS-DONE
