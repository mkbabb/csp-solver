#!/bin/zsh
# T9-W8 FOLD REFUTER — the cures' own instruments against the folded tree.
# Serial by design: these are timing instruments and must not contend with each other.
# base = :4257 (dist-base, master 74a2b5d9, index-CubiZsMVSwTc.js)
# cured = :4256 (dist, t9/w8-fold 4233baa2, index-ChSrVSqM0j8q.js)
set -u
R=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w8/cures/fold/refute
C=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w8/cures
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w8-fold/web/frontend
mkdir -p $R/raw

say () { echo "\n========== $1 · load $(sysctl -n vm.loadavg) ==========" }

# ── 1. C10 + C07b: boot freight (the SAME instrument, md5 d1317caf…) ───────────────────
say "A · C10/C07b freight — chromium 4x Fast-3G cold desk dpr1, 5+5 interleaved"
node $R/instruments/freight-run.mjs --base 4257 --cured 4256 --engine chromium --cpu 4 \
  --net fast3g --cache cold --vp desk --windows 5 --out $R/raw/freight-cr4x-f3g-cold-desk.jsonl \
  > $R/raw/freight-cr4x-f3g-cold-desk.log 2>&1
echo "exit $?"

say "B · C10/C07b freight — chromium 4x unthrottled link cold desk dpr1, 3+3"
node $R/instruments/freight-run.mjs --base 4257 --cured 4256 --engine chromium --cpu 4 \
  --net none --cache cold --vp desk --windows 3 --out $R/raw/freight-cr4x-none-cold-desk.jsonl \
  > $R/raw/freight-cr4x-none-cold-desk.log 2>&1
echo "exit $?"

say "C · C10/C07b freight — webkit cold desk dpr1 (PROXY, no CDP), 3+3"
node $R/instruments/freight-run.mjs --base 4257 --cured 4256 --engine webkit --cpu 1 \
  --net none --cache cold --vp desk --windows 3 --out $R/raw/freight-wk-cold-desk.jsonl \
  > $R/raw/freight-wk-cold-desk.log 2>&1
echo "exit $?"

# ── 2. C06: the fold geometry ─────────────────────────────────────────────────────────
say "D · C06 fold-geometry — chromium 1x warm desk dpr2"
for arm in base cured; do
  P=4257; [ $arm = cured ] && P=4256
  for i in 1 2 3; do
    node $C/C06/fold-geometry.mjs --engine chromium --throttle 1 --viewport desk --port $P \
      --cycles 2 --out $R/raw/geom-cr1x-desk-$arm-$i.jsonl >> $R/raw/geom-cr1x-desk.log 2>&1
  done
done
echo "exit $?"

say "E · C06 fold-geometry — chromium 1x warm mobile 390x844 dpr3"
for arm in base cured; do
  P=4257; [ $arm = cured ] && P=4256
  for i in 1 2 3; do
    node $C/C06/fold-geometry.mjs --engine chromium --throttle 1 --viewport mobile --port $P \
      --cycles 2 --out $R/raw/geom-cr1x-mob-$arm-$i.jsonl >> $R/raw/geom-cr1x-mob.log 2>&1
  done
done
echo "exit $?"

say "F · C06 fold-geometry — webkit warm desk dpr2 (PROXY)"
for arm in base cured; do
  P=4257; [ $arm = cured ] && P=4256
  for i in 1 2 3; do
    node $C/C06/fold-geometry.mjs --engine webkit --throttle 1 --viewport desk --port $P \
      --cycles 2 --out $R/raw/geom-wk-desk-$arm-$i.jsonl >> $R/raw/geom-wk-desk.log 2>&1
  done
done
echo "exit $?"

# ── 3. 8.3: the readiness A/B — the instrument graded on what it does NOT move ────────
say "G · 8.3 readiness-ab — mob-cr-4x-unthr-cold, 3 windows, no flag"
node $C/8.3/readiness-ab.mjs --base-url http://127.0.0.1:4257 --cured-url http://127.0.0.1:4256 \
  --cells mob-cr-4x-unthr-cold --windows 3 --wait 8000 --out $R/raw/ab-mob4x-noflag.jsonl \
  > $R/raw/ab-mob4x-noflag.log 2>&1
echo "exit $?"

say "H · 8.3 readiness-ab — mob-cr-4x-unthr-cold, 3 windows, ?__probe=1"
node $C/8.3/readiness-ab.mjs --base-url http://127.0.0.1:4257 --cured-url http://127.0.0.1:4256 \
  --cells mob-cr-4x-unthr-cold --windows 3 --wait 8000 --query '?__probe=1' \
  --out $R/raw/ab-mob4x-armed.jsonl > $R/raw/ab-mob4x-armed.log 2>&1
echo "exit $?"

# ── 4. C01: WebKit's board-ready stamp, and the mobile cell ───────────────────────────
say "I · C01 bake-census — webkit cold desk dpr2, 3+3"
zsh $R/interleave.sh wk-cold-desk 3 4257 4256 --engine webkit --cpu 1 --net none --cache cold --vp desk \
  > $R/raw/wk-cold-desk.log 2>&1
echo "exit $?"

say "J · C01 bake-census — chromium 4x Fast-3G cold MOBILE dpr3, 3+3"
zsh $R/interleave.sh cr-4x-f3g-cold-mob 3 4257 4256 --engine chromium --cpu 4 --net fast3g --cache cold --vp mobile \
  > $R/raw/cr-4x-f3g-cold-mob.log 2>&1
echo "exit $?"

say "BATTERY DONE"
