#!/bin/bash
# Critic's threshold/disjunct sabotage battery on WALK's pass-9 gate (each plant on its own copy).
# usage: thr.sh NAME OLD NEW   (OLD must occur exactly once in check-peer-arcs.mjs; NAME=clean => no plant)
S=<lane-scratch>
N=$1
D=$S/thr/$N
mkdir -p $D
cp -R $S/tree/web/frontend $D/
F=$D/frontend/scripts/check-peer-arcs.mjs
if [ "$N" != "clean" ]; then
  python3 -I - "$F" "$2" "$3" <<'PY'
import sys
f, old, new = sys.argv[1], sys.argv[2], sys.argv[3]
t = open(f).read()
c = t.count(old)
if c != 1:
    print(f"PLANT-ANCHOR-COUNT {c}"); sys.exit(3)
open(f, "w").write(t.replace(old, new))
print("PLANT OK")
PY
  echo "plant-exit $?" > $D/plant.exit
  grep -n -F -- "$3" $F | head -3 | od -c | head -12 > $D/plant.od
fi
cd $D/frontend
uptime > $D/load.start
node scripts/check-peer-arcs.mjs > $D/bare.log 2>&1
echo $? > $D/bare.exit
node scripts/check-peer-arcs.mjs --self-test > $D/self.log 2>&1
echo $? > $D/self.exit
uptime > $D/load.end
echo done > $D/DONE
