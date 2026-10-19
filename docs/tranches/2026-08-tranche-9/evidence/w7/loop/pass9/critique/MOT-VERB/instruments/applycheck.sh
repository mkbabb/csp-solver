#!/bin/bash
# apply-check the banks through temporary indexes in the §13 worktree's repo (read-only on the work tree)
WT=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-59
E=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/crit-MOT-VERB
P=$E/pass9/prototype/MOT-VERB
cd $WT
chk() { # name base-tree diff
  local IDX=$S/idx/$1; GIT_INDEX_FILE=$IDX git read-tree $2
  GIT_INDEX_FILE=$IDX git apply --cached --check --binary $3 2>$S/logs/ac-$1.err; local rc=$?
  local out=-; if [ $rc = 0 ]; then GIT_INDEX_FILE=$IDX git apply --cached --binary $3; out=$(GIT_INDEX_FILE=$IDX git write-tree); fi
  echo "$1 base=$2 rc=$rc -> $out"
}
echo "== $(date) load: $(uptime)"
chk base 74a2b5d9 $P/pass9.diff
chk ladder 74a2b5d9 $E/pass9/prototype/MOT-LADDER/pass9-ladder.diff
LAD=$(GIT_INDEX_FILE=$S/idx/ladder git write-tree)
chk verbOnLadder $LAD $P/pass9-verb-delta.diff
# WAVE union
GIT_INDEX_FILE=$S/idx/wave git read-tree 74a2b5d9; GIT_INDEX_FILE=$S/idx/wave git apply --cached --binary $E/pass8/integrate/WAVE.diff; W=$(GIT_INDEX_FILE=$S/idx/wave git write-tree); echo "wave tree $W"
chk verbOnWaveBare $W $P/pass9.delta.on-WAVE.diff
chk homesOnWave $W $E/pass9/instruments/homes.on-WAVE.diff
WH=$(GIT_INDEX_FILE=$S/idx/homesOnWave git write-tree)
chk s13OnWaveHomes $WH $P/pass9.s13.on-WAVE.diff
chk verbOnWaveHomes $WH $P/pass9.delta.on-WAVE.diff
chk ladderOnWaveHomes $WH $E/pass9/prototype/MOT-LADDER/pass9.delta.on-WAVE.diff
WHL=$(GIT_INDEX_FILE=$S/idx/ladderOnWaveHomes git write-tree)
chk verbOnWaveHomesLadder $WHL $P/pass9.delta.on-WAVE.diff
# s13 integrated
GIT_INDEX_FILE=$S/idx/s13 git read-tree 74a2b5d9; GIT_INDEX_FILE=$S/idx/s13 git apply --cached --binary $E/pass8/integrate/s13-s7-s3.diff; T=$(GIT_INDEX_FILE=$S/idx/s13 git write-tree); echo "s13 tree $T"
chk verbOnS13 $T $P/pass9.delta.on-s13-s7-s3.diff
# work tree state now
GIT_INDEX_FILE=$S/idx/wt git read-tree 74a2b5d9; GIT_INDEX_FILE=$S/idx/wt git add -A >/dev/null 2>&1; echo "worktree now $(GIT_INDEX_FILE=$S/idx/wt git write-tree)"
echo DONE
