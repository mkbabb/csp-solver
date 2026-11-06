#!/bin/bash
# PAL-TIN pass 10 · the WAVE union scratch: 74a2b5d9 archive + WAVE.diff (954bbbab) + homes v3 on-WAVE
W=$SCRATCH/wave10; mkdir -p $W; cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_308fa864-c94-2
git archive 74a2b5d9 | tar -x -C $W; echo archive=$?
cd $W && git init -q && echo init=$?
shasum /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass9/integrate/WAVE.diff
git apply --binary /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass9/integrate/WAVE.diff; echo wave_apply=$?
GIT_INDEX_FILE=$W/../wave10.index git add -A >/dev/null 2>&1; echo wave_tree=$(GIT_INDEX_FILE=$W/../wave10.index git write-tree)
git apply --3way /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass10/instruments/homes.on-WAVE.diff 2>&1 | tail -2; echo homes_apply=${PIPESTATUS[0]}
git apply --check --reverse /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass10/instruments/homes.on-WAVE.diff; echo homes_reverse_check=$?
GIT_INDEX_FILE=$W/../wave10h.index git add -A >/dev/null 2>&1; echo wavehomes_tree=$(GIT_INDEX_FILE=$W/../wave10h.index git write-tree)
ln -s /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules $W/web/frontend/node_modules
echo DONE
