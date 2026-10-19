#!/bin/bash
# stage3.sh : postpaint self-test x6 + sabotage (both engines), the control's boot rows, pi (tree vs control,
# tree vs the pass-8 bytes), and row 16 on both arms. Every exit is the run's own file / TSV line.
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/MOT-VERB
T=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-59/web/frontend
$S/bin/rows.sh frame2-t3 4246 'frame-halfstroke\.spec\.ts' chromium webkit
$S/bin/rows.sh frame2-ctl 4247 'frame-halfstroke\.spec\.ts' chromium webkit
$S/bin/pp-selftest.sh
$S/bin/rows.sh boot-ctl 4247 'boot-hand\.spec\.ts' chromium webkit
PI_A=4246 PI_B=4247 VERB_TESTDIR=$S/spec $S/bin/rows.sh pi-t3-ctl 4246 'pi-rest\.spec\.ts' chromium webkit
# 4247: my control listener (cwd = w7-control) -> the pass-8 bytes (LADDER's clean build of 8c12b15c's tree, dist-bt)
L=$(lsof -nP -iTCP:4247 -sTCP:LISTEN -t | head -1); C=$(lsof -a -p $L -d cwd | tail -1 | awk '{print $NF}')
if [ "$C" = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-control/web/frontend" ] && grep -q "listeners control $L" $S/pids.txt; then
  P=$(ps -o ppid= -p $L | tr -d ' '); kill $L; kill $P 2>/dev/null; echo "killed control listener $L wrapper $P $(date +%T)" >> $S/pids.txt; sleep 2
  cd $T && nohup npx vite preview --config .vite-verb9.config.mts --outDir /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/MOT-LADDER/dist-bt --host 127.0.0.1 --port 4247 --strictPort > $S/logs/serve-bt.log 2>&1 &
  W=$!; sleep 4; N=$(lsof -nP -iTCP:4247 -sTCP:LISTEN -t | head -1); echo "bt wrapper $W listener $N $(date +%T)" >> $S/pids.txt
  echo "4247 serves $(curl -s http://127.0.0.1:4247/ | grep -o 'index-[A-Za-z0-9_-]*\.js')" >> $S/logs/rows.tsv
  PI_A=4246 PI_B=4247 VERB_TESTDIR=$S/spec $S/bin/rows.sh pi-t3-bt 4246 'pi-rest\.spec\.ts' chromium webkit
else echo "4247 NOT MINE ($L $C) - pi-t3-bt not run" >> $S/logs/rows.tsv; fi
$S/bin/swap.sh tc > $S/logs/swap-tc.log 2>&1
ROW16_ARM=b VERB_TESTDIR=$S/spec $S/bin/rows.sh row16-b 4246 'theme-color\.spec\.ts' chromium webkit
$S/bin/swap.sh t3 > $S/logs/swap-t3c.log 2>&1
ROW16_ARM=a VERB_TESTDIR=$S/spec $S/bin/rows.sh row16-a 4246 'theme-color\.spec\.ts' chromium webkit
echo STAGE3-DONE >> $S/logs/rows.tsv
