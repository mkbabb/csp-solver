#!/bin/bash
# regbat9.sh — the registration row's battery (pass 9): A tree (homes v2) · B each ERASE clause of the ONE library
# sabotaged · C homes v1 library (born-RED) · D the row's own clauses (THEME_SABOTAGE) · E the union + delta (u9).
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/NOTE-ERASE
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-47/web/frontend
L=$S/logs/regbat9.txt; : > $L
echo "load $(uptime | sed 's/.*averages: //')" >> $L
echo "== A tree (homes v2)" >> $L; node $S/instruments/plants9b.mjs $W regA >> $L 2>&1; echo "plants exit $?" >> $L
for c in register-any prop-escape module-graph register-script; do
  echo "== B SHAPE_SABOTAGE=$c" >> $L; SHAPE_SABOTAGE=$c node $S/instruments/plants9b.mjs $W regB-$c >> $L 2>&1; echo "plants exit $?" >> $L
done
[ -e $S/treev1 ] && mv $S/treev1 $S/trash/treev1-$(date +%s)
mkdir -p $S/treev1 && cp -R $W/src $W/scripts $W/public $W/index.html $W/package.json $S/treev1/
cp $S/v1/web/frontend/scripts/shape-census.mjs $S/treev1/scripts/shape-census.mjs
echo "== C homes v1 library (born-RED; shape-census sha1 $(shasum $S/treev1/scripts/shape-census.mjs | cut -c1-8), v2 $(shasum $W/scripts/shape-census.mjs | cut -c1-8))" >> $L
node $S/instruments/plants9b.mjs $S/treev1 regC >> $L 2>&1; echo "plants exit $?" >> $L
(cd $S/treev1 && node scripts/check-theme-tokens.mjs --self-test > $S/logs/ctt-selftest-v1.txt 2>&1); echo "C' row self-test on homes v1 exit $?" >> $L; grep FAILED $S/logs/ctt-selftest-v1.txt | cut -c1-200 >> $L
for c in script count home depth syntax inherits initial stray unread stale foldname; do
  (cd $W && THEME_SABOTAGE=$c node scripts/check-theme-tokens.mjs --self-test > $S/logs/ctt-sab-$c.txt 2>&1); x=$?
  echo "D THEME_SABOTAGE=$c self-test exit=$x $(grep -m1 FAILED $S/logs/ctt-sab-$c.txt | cut -c1-160)" >> $L
done
for c in register-any prop-escape module-graph register-script; do
  (cd $W && SHAPE_SABOTAGE=$c node scripts/check-theme-tokens.mjs --self-test > $S/logs/ctt-shsab-$c.txt 2>&1); x=$?
  echo "D' SHAPE_SABOTAGE=$c row self-test exit=$x $(grep -m1 FAILED $S/logs/ctt-shsab-$c.txt | cut -c1-160)" >> $L
done
echo "== E u9 (union + homes on-WAVE + delta)" >> $L; node $S/instruments/plants9b.mjs $S/u9/web/frontend regE >> $L 2>&1; echo "plants exit $?" >> $L
echo "load $(uptime | sed 's/.*averages: //')" >> $L; echo REG-BATTERY-DONE >> $L
