#!/bin/zsh
# T9-W8 C02 round 3 — NON-AUTHOR VERIFICATION battery. Instruments are the A4/A5 banks as the
# author banked them under C02/instr (each `diff -q` SAME against attribution/A4, A5). Only
# --port differs, a flag they already take. A5's flags are --throttle/--viewport (NOT --cpu/--vp;
# the author's first round-3 attempt tripped on exactly that and discarded those windows).
# Every set interleaves base, cured, base, cured …; loadavg stamped at both ends.
E=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w8/cures/C02
V=$E/verify-r3
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w8-bake/web/frontend
BP=4252; CP=4253
cd $W
mkdir -p $V/raw/{drawer,desk,pi}

echo "=== ARMS, OPEN ==="
echo "base : $(node scripts/dist-identity.mjs --dist dist-base)"
echo "cured: $(node scripts/dist-identity.mjs --dist dist)"
echo "served base : $(curl -s http://127.0.0.1:$BP/ | grep -o 'index-[A-Za-z0-9_-]*\.js' | head -1)"
echo "served cured: $(curl -s http://127.0.0.1:$CP/ | grep -o 'index-[A-Za-z0-9_-]*\.js' | head -1)"
echo "loadavg open: $(sysctl -n vm.loadavg)"

echo "=== SET 1 · THE REPAIRED FINDING — A4 drawer-trace, chromium 6x · mobile 390x844 dpr1 · 6 windows x 3 cycles"
for i in 1 2 3 4 5 6; do
  node $E/instr/drawer-trace.mjs --engine chromium --regime mobile --cpu 6 --cycles 3 --port $BP --out $V/raw/drawer/base-w$i.jsonl > /dev/null 2>&1
  node $E/instr/drawer-trace.mjs --engine chromium --regime mobile --cpu 6 --cycles 3 --port $CP --out $V/raw/drawer/cured-w$i.jsonl > /dev/null 2>&1
  echo "  pair $i loadavg $(sysctl -n vm.loadavg)"
done
node $E/fix-r2/drawer-stats.mjs $V/raw/drawer "VERIFIER r3 · chromium 6x · mobile 390x844 dpr1 (A4 sets no scale factor) · cold · 6 windows x 3 cycles, interleaved" > $V/stats-drawer.txt
echo "  -> stats-drawer.txt"

echo "=== SET 2 · THE MARK — A5 toggle-probe, chromium 4x · Fast-3G · cold · desk 1280x800 dpr2 · 5+5"
for i in 1 2 3 4 5; do
  node $E/instr/toggle-probe.mjs --engine chromium --throttle 4 --net fast3g --viewport desk --port $BP --windows 1 --out $V/raw/desk/base-w$i.jsonl 2>&1 | grep -E "^win " | sed "s/^/  base  w$i: /"
  node $E/instr/toggle-probe.mjs --engine chromium --throttle 4 --net fast3g --viewport desk --port $CP --windows 1 --out $V/raw/desk/cured-w$i.jsonl 2>&1 | grep -E "^win " | sed "s/^/  cured w$i: /"
  echo "  pair $i loadavg $(sysctl -n vm.loadavg)"
done
node $E/instr/toggle-stats.mjs $V/raw/desk > $V/stats-desk.txt 2>&1
echo "  -> stats-desk.txt"

echo "=== SET 3 · PI — per-pose bitmap digests, chromium 4x · Fast-3G · cold · desk dpr2 · 3+3"
: > $V/raw/pi/base.jsonl
: > $V/raw/pi/cured.jsonl
for i in 1 2 3; do
  node $E/instr/pose-hash-toggle.mjs --engine chromium --cpu 4 --net fast3g --cache cold --vp desk --port $BP --windows 1 --out $V/raw/pi/b$i.jsonl > /dev/null 2>&1
  cat $V/raw/pi/b$i.jsonl >> $V/raw/pi/base.jsonl
  node $E/instr/pose-hash-toggle.mjs --engine chromium --cpu 4 --net fast3g --cache cold --vp desk --port $CP --windows 1 --out $V/raw/pi/c$i.jsonl > /dev/null 2>&1
  cat $V/raw/pi/c$i.jsonl >> $V/raw/pi/cured.jsonl
  echo "  pair $i loadavg $(sysctl -n vm.loadavg)"
done
node $E/instr/pi-compare.mjs $V/raw/pi/base.jsonl $V/raw/pi/cured.jsonl > $V/pi-c4x-desk.txt 2>&1
echo "PI-COMPARE EXIT=$?" >> $V/pi-c4x-desk.txt
tail -6 $V/pi-c4x-desk.txt

echo "=== ARMS, CLOSE ==="
echo "base : $(node scripts/dist-identity.mjs --dist dist-base)"
echo "cured: $(node scripts/dist-identity.mjs --dist dist)"
echo "loadavg close: $(sysctl -n vm.loadavg)"
echo "VERIFY BATTERY COMPLETE"
