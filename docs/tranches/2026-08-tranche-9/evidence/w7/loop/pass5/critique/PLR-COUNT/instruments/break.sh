#!/bin/bash
# usage: break.sh <name> <file-rel-to-frontend> <python-edit-script> <grep>
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/crit-count
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-52/web/frontend
NAME="$1"; F="$W/$2"; PY="$3"; G="$4"
B=$S/bak-$(echo $NAME | tr -c 'A-Za-z0-9' '_')
cp "$F" "$B"; before=$(shasum "$F" | cut -c1-12)
python3 "$PY" "$F"; after=$(shasum "$F" | cut -c1-12)
echo "### $NAME :: $2 planted ($before -> $after) :: -g '$G'"
sleep 3
cd $W && CRIT_PWOUT=$S/pw-out-brk npx playwright test -c .plrc-critic/pw.config.ts e2e/player-tally.spec.ts -g "$G" 2>&1 | grep -E "^(G14|G16|PRM MID|TWO MOVERS|ARMC)|✘|✓|passed|failed|Error:" | cut -c1-400
rc=${PIPESTATUS[0]}
cp "$B" "$F"; rest=$(shasum "$F" | cut -c1-12)
[ "$rest" = "$before" ] && echo "restored=OK ($rest)" || echo "restored=MISMATCH ($rest vs $before)"
