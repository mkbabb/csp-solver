#!/bin/bash
# chk.sh : every apply --check the bank owes; path counts printed; exits read here, bare
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/NOTE-LEDGER
E=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop
B=$E/pass9/prototype/NOTE-LEDGER; W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-46
export GIT_CEILING_DIRECTORIES=$S/chk; LOG=$S/logs/chk.txt; : > $LOG
fresh() { mkdir -p $S/chk/$1; cp -R $S/base/. $S/chk/$1/; }
ck() { local d=$1 p=$2 lab=$3; cd $S/chk/$d; local o="$S/logs/chk-$(echo "$lab" | tr -c "A-Za-z0-9\n" _).out"; git apply --check --verbose $p > "$o" 2>&1; local e=$?; echo "$lab: exit $e · $(grep -c "^Checking patch" "$o") paths" >> $LOG; }
fresh base; ck base $B/pass9.diff "pass9.diff on 74a2b5d9"
cd $S/chk/base && git apply --binary $B/pass9.diff; echo "pass9.diff applied for real: exit $?" >> $LOG
n=0; m=0; for p in $(grep '^diff --git' $B/pass9.diff | awk '{print substr($3,3)}'); do m=$((m+1)); cmp -s $S/chk/base/$p $W/$p && n=$((n+1)); done; echo "applied bytes = work tree: $n/$m" >> $LOG
fresh wave; cd $S/chk/wave && git apply --binary $E/pass8/integrate/WAVE.diff; echo "WAVE applied $?" >> $LOG; ck wave $B/pass9.delta.on-WAVE.diff "delta on acb9c08e (WAVE)"
cd $S/chk/wave && git apply --binary $E/pass9/instruments/homes.on-WAVE.diff; echo "homes.on-WAVE applied $?" >> $LOG; ck wave $B/pass9.delta.on-WAVE.diff "delta on acde977b (WAVE+homes)"
cd $S/chk/wave && git apply --binary $B/../NOTE-ERASE/pass9.delta.on-WAVE.diff; echo "ERASE9 applied $?" >> $LOG; ck wave $B/pass9.delta.on-WAVE.diff "delta on acde977b+ERASE9"
cd $S/chk/wave && git apply --binary $B/pass9.delta.on-WAVE.diff; echo "delta applied for real $?" >> $LOG
n=0; for f in e2e/note-reserve.spec.ts scripts/check-ink-pressure.mjs src/games/shared/GameBoard.notes.test.ts src/games/shared/GameBoard.vue; do cmp -s $S/chk/wave/web/frontend/$f $S/wL/web/frontend/$f && n=$((n+1)); done; echo "union applied = lane union copy: $n/4" >> $LOG
fresh s13; cd $S/chk/s13 && git apply --binary $E/pass8/integrate/s13-s7-s3.diff; echo "s13-s7-s3 applied $?" >> $LOG; ck s13 $B/pass9.delta.on-WAVE.diff "delta on f1c9c3fe (s13-s7-s3)"
echo DONE >> $LOG
