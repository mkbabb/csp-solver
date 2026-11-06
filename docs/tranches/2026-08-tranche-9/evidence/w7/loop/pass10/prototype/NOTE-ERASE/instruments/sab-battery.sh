#!/bin/bash
# sab-battery.sh <project> <port> - the drop-clock teeth battery on copy t10s, one guarded call (the caller's), serial.
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass10/NOTE-ERASE
proj=$1 port=$2; F=$S/copies/t10s/web/frontend; SP=$F/e2e/affordances.spec.ts; O=$S/logs/sab-$proj.txt; : > $O
cp $S/spec-t10s.orig.ts $SP.base; cat $S/bin/sab-append.ts >> $SP.base
run() { local name=$1 grep=$2; (cd $F && PLAYWRIGHT_BASE_URL=http://127.0.0.1:$port npx playwright test --config .erase10/pw.ws.config.ts --project=$proj --workers=1 --reporter=list -g "$grep" > $S/logs/sab-$proj-$name.log 2>&1); echo "$name exit=$? $(grep -E '[0-9]+ (passed|failed)' $S/logs/sab-$proj-$name.log | tr '\n' ' ')" >> $O; }
cp $SP.base $SP; run clean "SAB|zero-length bound"
sed 's/^const ZERO_LEAVE_FRAMES = 2;/const ZERO_LEAVE_FRAMES = 3;/' $SP.base > $SP; grep -c "ZERO_LEAVE_FRAMES = 3" $SP >> $O; run T-frames3 "zero-length bound"
sed 's/^const ZERO_LEAVE_FRAMES = 2;/const ZERO_LEAVE_FRAMES = 1;/' $SP.base > $SP; grep -c "ZERO_LEAVE_FRAMES = 1" $SP >> $O; run T-frames1 "zero-length bound"
sed "s/  leave.animationDuration === '0s' \&\& leave.painted <= ZERO_LEAVE_FRAMES;/  leave.painted <= ZERO_LEAVE_FRAMES;/" $SP.base > $SP; grep -c "^  leave.painted <= ZERO_LEAVE_FRAMES;" $SP >> $O; run C-no0s "zero-length bound|SAB near-bound write 17ms|SAB near-bound write 33ms"
sed "s/  leave.animationDuration === '0s' \&\& leave.painted <= ZERO_LEAVE_FRAMES;/  leave.animationDuration === '0s';/" $SP.base > $SP; grep -c "^  leave.animationDuration === '0s';$" $SP >> $O; run C-noframes "zero-length bound"
cp $SP.base $SP; echo "FIN $(date +%T)" >> $O
