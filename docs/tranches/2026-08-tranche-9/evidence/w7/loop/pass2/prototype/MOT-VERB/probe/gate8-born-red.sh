#!/bin/zsh
# GATE 8, BORN RED ON THE PASS-1 BRANCH. The pass-1 branch carried no beat table at all, so
# "RED" there says only that the fixture is absent. This restores the pass-1 SPELLINGS of the
# toggle's own rows beside the pass-2 table and re-runs the gate, which is the reading the
# spec predicted: the record catching the sweep that moved the beats.
set -e
SC=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad
WT=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_8630d340-e56-64/web/frontend
rm -rf $SC/p1beats
mkdir -p $SC/p1beats
cp -R $WT/src $SC/p1beats/src
F=$SC/p1beats/src/pencil/celestial/DarkModeToggle.vue
perl -0pi -e '
s|  transition: opacity 100ms var\(--ease-standard\) 240ms !important;|  transition: opacity var(--rung-touch) var(--verb-lift-ease) var(--rung-mark) !important;|;
s|  transition: opacity 300ms var\(--ease-standard\) 60ms !important;|  transition: opacity var(--rung-sheet) var(--verb-layDown-ease) var(--rung-touch) !important;|;
s|  transition: transform 340ms var\(--ease-accelIn\) !important;|  transition: transform var(--rung-mark) var(--verb-lift-ease) !important;|;
s|    scale 150ms var\(--ease-anticipatePop\) 560ms,\n    opacity 120ms ease-out 560ms !important;|    scale var(--rung-touch) var(--verb-lift-ease) var(--rung-page),\n    opacity var(--rung-touch) var(--verb-lift-ease) var(--rung-page) !important;|;
' $F
cd $WT
SRC=$SC/p1beats/src node scripts/check-pencil-verbs.mjs 2>&1 | grep -E "beat table|the toggle's|the fence|declarations that name"
