#!/bin/zsh
# T9-W8 C02 repair round 2 — the reading battery, after the perf rig's six runs.
# Every set is INTERLEAVED base/cured on the same host, with loadavg stamped per pair.
# Sequential by design: ten sibling lanes share this box and two sets at once measure each other.
E=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w8/cures/C02
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w8-bake/web/frontend
cd $W
BP=4252; CP=4253

echo "=== SET 1 · the charter's cell — chromium 4x · Fast-3G · cold · desk 1280x800 dpr2 · 5+5"
zsh $E/fix-r2/interleave.sh c4x-f3g-cold-desk 5 $BP $CP --engine chromium --throttle 4 --net fast3g --viewport desk
node $E/instr/toggle-stats.mjs $E/fix-r2/raw/c4x-f3g-cold-desk > $E/fix-r2/stats-c4x-f3g-cold-desk.txt

echo "=== SET 2 · TBT(3000) where the repair lives — A6 readiness, mob-cr-4x-f3g-cold · 5+5"
zsh $E/fix-r2/interleave-readiness.sh readiness-mob 5 $BP $CP mob-cr-4x-f3g-cold
node $E/instr/summarize-readiness.mjs $E/fix-r2/raw/readiness-mob/base.jsonl > $E/fix-r2/stats-readiness-base.txt
node $E/instr/summarize-readiness.mjs $E/fix-r2/raw/readiness-mob/cured.jsonl > $E/fix-r2/stats-readiness-cured.txt

echo "=== SET 3 · the mobile toggle the charter ordered re-taken — chromium 4x · mobile 390x844 dpr3 · 3+3"
zsh $E/fix-r2/interleave.sh c4x-f3g-cold-mob 3 $BP $CP --engine chromium --throttle 4 --net fast3g --viewport mobile
node $E/instr/toggle-stats.mjs $E/fix-r2/raw/c4x-f3g-cold-mob > $E/fix-r2/stats-c4x-f3g-cold-mob.txt

echo "=== SET 4 · the drawer's first gesture with the warm in flight — A4, chromium 6x · mobile · 3+3"
mkdir -p $E/fix-r2/raw/drawer
for i in 1 2 3; do
  echo "  pair $i loadavg: $(sysctl -n vm.loadavg)"
  node $E/instr/drawer-trace.mjs --engine chromium --regime mobile --cpu 6 --cycles 3 --port $BP --out $E/fix-r2/raw/drawer/base-w$i.jsonl > /dev/null 2>&1
  node $E/instr/drawer-trace.mjs --engine chromium --regime mobile --cpu 6 --cycles 3 --port $CP --out $E/fix-r2/raw/drawer/cured-w$i.jsonl > /dev/null 2>&1
done
node $E/fix-r2/drawer-stats.mjs $E/fix-r2/raw/drawer "chromium 6x · mobile 390x844 dpr1 (A4 sets no scale factor) · cold · 3 windows x 3 cycles, interleaved" > $E/fix-r2/stats-drawer.txt

echo "=== SET 5 · pi — per-pose bitmap digests across the flip, 3+3"
mkdir -p $E/fix-r2/raw/pi
: > $E/fix-r2/raw/pi/base.jsonl
: > $E/fix-r2/raw/pi/cured.jsonl
for i in 1 2 3; do
  node $E/instr/pose-hash-toggle.mjs --engine chromium --cpu 4 --net fast3g --cache cold --vp desk --port $BP --windows 1 --out $E/fix-r2/raw/pi/b$i.jsonl > /dev/null 2>&1
  cat $E/fix-r2/raw/pi/b$i.jsonl >> $E/fix-r2/raw/pi/base.jsonl
  node $E/instr/pose-hash-toggle.mjs --engine chromium --cpu 4 --net fast3g --cache cold --vp desk --port $CP --windows 1 --out $E/fix-r2/raw/pi/c$i.jsonl > /dev/null 2>&1
  cat $E/fix-r2/raw/pi/c$i.jsonl >> $E/fix-r2/raw/pi/cured.jsonl
done
{
  echo "base  : chromium · 4x · fast3g · cold · desk dpr2 · http://127.0.0.1:$BP/"
  echo "cured : chromium · 4x · fast3g · cold · desk dpr2 · http://127.0.0.1:$CP/"
  echo "load  : $(sysctl -n vm.loadavg)"
  node $E/instr/pi-compare.mjs $E/fix-r2/raw/pi/base.jsonl $E/fix-r2/raw/pi/cured.jsonl
  echo "PI-EXIT=$?"
} > $E/fix-r2/pi-c4x-desk.txt 2>&1

echo "BATTERY2 COMPLETE $(sysctl -n vm.loadavg)"
