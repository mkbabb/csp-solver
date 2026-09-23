#!/bin/zsh
# motion-battery.sh <engine> [arms="4253 4254"]  → runs/*.json + runs/summary-<engine>.jsonl
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_3b66f064-970-16/web/frontend/.gmotion
E=$1; ARMS=${2:-"4253 4254"}; S=runs/summary-$E.jsonl; LOG=runs/battery-$E.log
SH=0; [ $E = chromium ] && SH=1
run() { # <scenario> <port> <vp> <scheme> <prm> <touch> <shots> <name>
  local f=runs/$8.json
  timeout 170 node motion.mjs $1 $E $2 $3 $4 $5 $6 $f $7 >> $LOG 2>&1 || { echo "FAIL $8" >> $LOG; return; }
  timeout 170 node analyze.mjs $f >> $S 2>> $LOG
  rm -rf runs/$8-shots
}
for P in ${=ARMS}; do
  A=proto; [ $P = 4254 ] && A=base
  run move $P 1280x800 light 0 0 $SH m-$A-$E-1280-light
  run move $P 1280x800 dark 0 0 $SH m-$A-$E-1280-dark
  run move $P 390x844 light 0 1 $SH m-$A-$E-390-light
  run move $P 390x844 dark 0 1 $SH m-$A-$E-390-dark
  run poster $P 1280x800 light 0 0 0 p-$A-$E-1280-light
  run poster $P 390x844 light 0 1 0 p-$A-$E-390-light
  run toggle $P 1280x800 light 0 0 0 t-$A-$E-1280-lightboot
  run toggle $P 1280x800 dark 0 0 0 t-$A-$E-1280-darkboot
  run togglegallery $P 1280x800 light 0 0 0 tg-$A-$E-1280-light
  run toggle $P 390x844 light 0 1 0 t-$A-$E-390-lightboot
  run move $P 1280x800 light 1 0 0 prm-m-$A-$E-1280
  run toggle $P 1280x800 light 1 0 0 prm-t-$A-$E-1280
  run ga8 $P 390x844 light 0 1 0 ga8-$A-$E-390
  run ga9 $P 1280x800 light 0 0 0 ga9-$A-$E-1280
  run idle $P 1280x800 light 0 0 0 idle-$A-$E-playing-light
  run idle $P 1280x800 dark 0 0 0 idle-$A-$E-playing-dark
  VIEW=gallery run idle $P 1280x800 light 0 0 0 idle-$A-$E-gallery-light
done
NEG=1 run ga8 4253 390x844 light 0 1 0 ga8neg-proto-$E-390
[ $E = chromium ] && run ga7neg 4253 1280x800 light 0 0 1 ga7neg-proto-$E-1280
echo DONE >> $LOG
