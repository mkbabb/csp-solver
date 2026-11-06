#!/bin/bash
# plant.sh <label> <plant> <mode> <spec> <grep|-> <proj> [ENV=V..] : plant, od -c read-back, run, restore (sha checked)
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass10/PLR-COUNT
lab=$1; plant=$2; mode=$3; spec=$4; grep=$5; proj=$6; shift 6
case $mode in tree) FE=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-52/web/frontend;; uni) FE=$S/ac/uni/web/frontend;; esac
python3 $S/bin/plants.py apply $plant $FE > $S/logs/$lab.$proj.plant 2>&1 || { echo "exit=PLANTFAIL" > $S/logs/$lab.$proj.exit; exit 0; }
(cd $FE && git diff --no-index $S/plants/$plant.bak $(python3 -c "import sys;print({'TOKENF':'src/assets/index.css','OPA95F':'src/pencil/chrome/PlayerMark/PlayerLobby.vue'}.get('$plant','src/pencil/chrome/PlayerMark/PlayerMark.vue'))") | grep '^[+-][^+-]' | od -c > $S/logs/$lab.$proj.od)
$S/bin/run.sh $lab $mode $spec "$grep" $proj "$@"
python3 $S/bin/plants.py restore $plant $FE >> $S/logs/$lab.$proj.plant 2>&1
