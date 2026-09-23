#!/bin/zsh
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/acc5crit-p5
F=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-41/web/frontend
V=$F/src/pencil/grid/HandDrawnGrid/HandDrawnGrid.vue
cd $F
shasum $V > $S/hdg.sha1; cp $V $S/hdg.orig
trap "cp $S/hdg.orig $V; shasum -c $S/hdg.sha1" EXIT
export BASE=http://127.0.0.1:4241; unset TESTDIR
echo "=== join-language whole, LANDED, chromium"
npx playwright test --config .acc5crit/pw.config.mts join-language.spec.ts --project=chromium --reporter=list 2>&1 | grep -E "✓|✘|passed|failed" | sed 's#.*›##' | head -12; echo "exit ${pipestatus[1]}"
sed -i '' 's/^const joinGate = frontGate((v) => (joinFraction.value = v));/const joinGate = frontGate((v) => (joinFraction.value = Math.min(v, 0.99)));/' $V
grep -c "Math.min(v, 0.99)" $V
sleep 3
echo "=== join-language whole, ABLATED (the ring never stands whole: fraction capped 0.99), chromium"
npx playwright test --config .acc5crit/pw.config.mts join-language.spec.ts --project=chromium --reporter=list 2>&1 | grep -E "✓|✘|passed|failed|Error:" | sed 's#.*›##' | head -14; echo "exit ${pipestatus[1]}"
echo DONE
