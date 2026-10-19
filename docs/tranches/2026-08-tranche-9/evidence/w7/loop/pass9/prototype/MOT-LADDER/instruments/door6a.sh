#!/bin/bash
# door 6a: a consumer swap + --bank + re-stamp. Exits read bare from files.
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/MOT-LADDER
$S/bin/snap.sh snapD > /dev/null 2>&1
FE=$S/snapD/web/frontend; L=$S/logs/door6a; mkdir -p $L; cd $FE
python3 - <<'PY'
p="src/App.vue"; s=open(p).read(); o="  }, MOTION.rungs.leave);"; assert s.count(o)>=1; s=s.replace(o,"  }, MOTION.rungs.whisper);",1); open(p,"w").write(s)
PY
node scripts/check-motion-bands.mjs --list > $L/1-swap.log 2>&1; echo "1-swap $?" > $L/exits.txt
node scripts/check-motion-bands.mjs --bank > $L/2-bank.log 2>&1; echo "2-bank $?" >> $L/exits.txt
node scripts/check-motion-bands.mjs --list > $L/3-after-bank.log 2>&1; echo "3-after-bank $?" >> $L/exits.txt
NEW=$(grep -o 're-stamp: const BANK_SHA256 = "[0-9a-f]*"' $L/2-bank.log | grep -o '[0-9a-f]\{64\}')
sed -i '' "s/^const BANK_SHA256 = \"[0-9a-f]*\";/const BANK_SHA256 = \"$NEW\";/" scripts/check-motion-bands.mjs
node scripts/check-motion-bands.mjs --list > $L/4-restamped.log 2>&1; echo "4-restamped $?" >> $L/exits.txt
echo "stamp $NEW" >> $L/exits.txt
