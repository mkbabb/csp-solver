#!/bin/bash
# verify.sh: apply --check every bank on its base through temp indexes AND pass9.diff on a fresh archive. no rm, no set -e
S=<SCRATCH>
W=<TREE>
E=<REPO>/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass9/prototype/ACC-SIX
cd $W
chk() { export GIT_INDEX_FILE=$S/v-$1.index; git read-tree $2; git apply --cached --check $E/$3 > $S/v-$1.log 2>&1; echo $? > $S/v-$1.exit; git apply --cached $E/$3 > /dev/null 2>&1; t=$(git write-tree); echo "$3 on $1 ($2): check $(cat $S/v-$1.exit) -> tree $t"; unset GIT_INDEX_FILE; }
chk base 74a2b5d9 pass9.diff
chk wavehomes acde977b pass9.delta.on-WAVE.diff
chk wavebare acb9c08e pass9.delta.on-WAVE.diff
chk s3h $(cat $S/s3h.tree) pass9.delta.on-s13-s7-s3.diff
chk s3bare f1c9c3fe pass9.delta.on-s13-s7-s3.diff
mkdir -p $S/fresh; d=$S/fresh/base-$(date +%s); mkdir -p $d; git archive 74a2b5d9 | tar -x -C $d
cd $d; GIT_CEILING_DIRECTORIES=$S/fresh git apply --check -v $E/pass9.diff > $S/v-fresh.log 2>&1; echo $? > $S/v-fresh.exit
echo "pass9.diff on a fresh git archive 74a2b5d9: check $(cat $S/v-fresh.exit), paths checked $(grep -c '^Checking patch' $S/v-fresh.log)"
echo VERIFY-DONE
