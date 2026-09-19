#!/bin/zsh
# T9-W8 §8.2 cure C02, REPAIR ROUND 3 — the whole reading set, serial, one script.
# Instruments are the A4/A5/A6 banks, byte-identical (`diff -q` SAME); only `--port` differs,
# which is a flag they already take. Every set interleaves base, cured, base, cured … so host
# drift falls on both arms, stamps loadavg at both ends, and prints both arms' dist-identity.
E=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w8/cures/C02
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w8-bake/web/frontend
BP=4252; CP=4253
cd $W
mkdir -p $E/fix-r3/raw/{drawer,desk,mob,readiness,pi}

echo "=== ARMS ==="
echo "base : $(node scripts/dist-identity.mjs --dist dist-base)"
echo "cured: $(node scripts/dist-identity.mjs --dist dist)"
echo "loadavg open: $(sysctl -n vm.loadavg)"

echo "=== SET 1 · THE DRAWER'S FIRST GESTURE — A4, chromium 6x · mobile 390x844 · 3 windows x 3 cycles"
for i in 1 2 3; do
  echo "  pair $i loadavg $(sysctl -n vm.loadavg)"
  node $E/instr/drawer-trace.mjs --engine chromium --regime mobile --cpu 6 --cycles 3 --port $BP --out $E/fix-r3/raw/drawer/base-w$i.jsonl > /dev/null 2>&1
  node $E/instr/drawer-trace.mjs --engine chromium --regime mobile --cpu 6 --cycles 3 --port $CP --out $E/fix-r3/raw/drawer/cured-w$i.jsonl > /dev/null 2>&1
done
node $E/fix-r2/drawer-stats.mjs $E/fix-r3/raw/drawer "chromium 6x · mobile 390x844 dpr1 (A4 sets no scale factor) · cold · 3 windows x 3 cycles, interleaved" > $E/fix-r3/stats-drawer.txt
echo "  -> stats-drawer.txt"

echo "=== SET 2 · THE MARK — A5 toggle-probe, chromium 4x · Fast-3G · cold · desk 1280x800 dpr2 · 5+5"
echo "  loadavg $(sysctl -n vm.loadavg)"
for i in 1 2 3 4 5; do
  node $E/instr/toggle-probe.mjs --engine chromium --cpu 4 --net fast3g --cache cold --vp desk --port $BP --windows 1 --out $E/fix-r3/raw/desk/base-w$i.jsonl 2>&1 | grep -E "^win " | sed "s/^/  base  w$i: /"
  node $E/instr/toggle-probe.mjs --engine chromium --cpu 4 --net fast3g --cache cold --vp desk --port $CP --windows 1 --out $E/fix-r3/raw/desk/cured-w$i.jsonl 2>&1 | grep -E "^win " | sed "s/^/  cured w$i: /"
  echo "  pair $i done loadavg $(sysctl -n vm.loadavg)"
done
cat $E/fix-r3/raw/desk/base-w*.jsonl > $E/fix-r3/raw/desk/base.jsonl
cat $E/fix-r3/raw/desk/cured-w*.jsonl > $E/fix-r3/raw/desk/cured.jsonl
node $E/instr/toggle-stats.mjs $E/fix-r3/raw/desk/base.jsonl $E/fix-r3/raw/desk/cured.jsonl > $E/fix-r3/stats-desk.txt 2>&1
echo "  -> stats-desk.txt"

echo "=== SET 3 · THE MOBILE RE-TAKE — A5 toggle-probe, chromium 4x · Fast-3G · cold · 390x844 dpr3 · 3+3"
for i in 1 2 3; do
  node $E/instr/toggle-probe.mjs --engine chromium --cpu 4 --net fast3g --cache cold --vp mobile --port $BP --windows 1 --out $E/fix-r3/raw/mob/base-w$i.jsonl 2>&1 | grep -E "^win " | sed "s/^/  base  w$i: /"
  node $E/instr/toggle-probe.mjs --engine chromium --cpu 4 --net fast3g --cache cold --vp mobile --port $CP --windows 1 --out $E/fix-r3/raw/mob/cured-w$i.jsonl 2>&1 | grep -E "^win " | sed "s/^/  cured w$i: /"
  echo "  pair $i done loadavg $(sysctl -n vm.loadavg)"
done
cat $E/fix-r3/raw/mob/base-w*.jsonl > $E/fix-r3/raw/mob/base.jsonl
cat $E/fix-r3/raw/mob/cured-w*.jsonl > $E/fix-r3/raw/mob/cured.jsonl
node $E/instr/toggle-stats.mjs $E/fix-r3/raw/mob/base.jsonl $E/fix-r3/raw/mob/cured.jsonl > $E/fix-r3/stats-mob.txt 2>&1
echo "  -> stats-mob.txt"

echo "=== SET 4 · THE NO-REGRESSION CLAUSE — A6 readiness-timeline, cell mob-cr-4x-f3g-cold · 3+3"
: > $E/fix-r3/raw/readiness/base.jsonl
: > $E/fix-r3/raw/readiness/cured.jsonl
for i in 1 2 3; do
  node $E/instr/readiness-timeline.mjs --base http://127.0.0.1:$BP --windows 1 --cells mob-cr-4x-f3g-cold --out $E/fix-r3/raw/readiness/b$i.jsonl > /dev/null 2>&1
  cat $E/fix-r3/raw/readiness/b$i.jsonl >> $E/fix-r3/raw/readiness/base.jsonl
  node $E/instr/readiness-timeline.mjs --base http://127.0.0.1:$CP --windows 1 --cells mob-cr-4x-f3g-cold --out $E/fix-r3/raw/readiness/c$i.jsonl > /dev/null 2>&1
  cat $E/fix-r3/raw/readiness/c$i.jsonl >> $E/fix-r3/raw/readiness/cured.jsonl
  echo "  pair $i done loadavg $(sysctl -n vm.loadavg)"
done
node $E/instr/summarize-readiness.mjs $E/fix-r3/raw/readiness/base.jsonl > $E/fix-r3/stats-readiness-base.txt 2>&1
node $E/instr/summarize-readiness.mjs $E/fix-r3/raw/readiness/cured.jsonl > $E/fix-r3/stats-readiness-cured.txt 2>&1
echo "  -> stats-readiness-{base,cured}.txt"

echo "=== SET 5 · PI — per-pose bitmap digests, chromium 4x · Fast-3G · cold · desk dpr2 · 3+3"
: > $E/fix-r3/raw/pi/base.jsonl
: > $E/fix-r3/raw/pi/cured.jsonl
for i in 1 2 3; do
  node $E/instr/pose-hash-toggle.mjs --engine chromium --cpu 4 --net fast3g --cache cold --vp desk --port $BP --windows 1 --out $E/fix-r3/raw/pi/b$i.jsonl > /dev/null 2>&1
  cat $E/fix-r3/raw/pi/b$i.jsonl >> $E/fix-r3/raw/pi/base.jsonl
  node $E/instr/pose-hash-toggle.mjs --engine chromium --cpu 4 --net fast3g --cache cold --vp desk --port $CP --windows 1 --out $E/fix-r3/raw/pi/c$i.jsonl > /dev/null 2>&1
  cat $E/fix-r3/raw/pi/c$i.jsonl >> $E/fix-r3/raw/pi/cured.jsonl
  echo "  pair $i done loadavg $(sysctl -n vm.loadavg)"
done
{
  node $E/instr/pi-compare.mjs $E/fix-r3/raw/pi/base.jsonl $E/fix-r3/raw/pi/cured.jsonl
  echo "PI-COMPARE EXIT=$?"
} > $E/fix-r3/pi-c4x-desk.txt 2>&1
echo "  -> pi-c4x-desk.txt"

echo "=== ARMS, CLOSE ==="
echo "base : $(node scripts/dist-identity.mjs --dist dist-base)"
echo "cured: $(node scripts/dist-identity.mjs --dist dist)"
echo "loadavg close: $(sysctl -n vm.loadavg)"
echo "BATTERY COMPLETE"
