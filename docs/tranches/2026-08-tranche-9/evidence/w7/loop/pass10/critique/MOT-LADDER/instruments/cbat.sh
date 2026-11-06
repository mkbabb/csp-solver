#!/bin/zsh
# cbat.sh <tag> <plants...> : critic's K battery on $S/kx (bank 83964fd2 web dc580ec4)
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass10/crit-MOT-LADDER
FE=$S/kx/web/frontend; TAG=$1; shift; O=$S/logs/cb-$TAG; mkdir -p $O/bak
FILES="src/assets/index.css src/App.vue src/games/shared/BoardHost.vue src/games/shared/DigitCell.vue src/main.ts index.html"
for f in ${=FILES}; do mkdir -p $O/bak/${f:h}; cp $FE/$f $O/bak/$f; done
printf 'plant\tplantexit\tbands\tmotion\tverbs\trestored\tload\n' > $O/battery.tsv
for p in "$@"; do
  cd $FE
  python3 $S/inst/critx.py $FE $p > $O/$p.plant 2>&1; pe=$?
  /Users/mkbabb/.claude/guard/guarded --light -- node scripts/check-motion-bands.mjs --self-test > $O/$p.bands 2>&1; b=$?
  /Users/mkbabb/.claude/guard/guarded --light -- node scripts/check-motion-contract.mjs --self-test > $O/$p.motion 2>&1; m=$?
  /Users/mkbabb/.claude/guard/guarded --light -- zsh -c 'node scripts/publish-verbs.mjs --check && node scripts/check-pencil-verbs.mjs --self-test' > $O/$p.verbs 2>&1; v=$?
  [ -e $FE/src/pencil/xq.css ] && mv $FE/src/pencil/xq.css $S/trash/xq.css.$p.$(date +%s)
  r=0; for f in ${=FILES}; do cp $O/bak/$f $FE/$f; cmp -s $O/bak/$f $FE/$f || r=1; done
  printf '%s\t%s\t%s\t%s\t%s\t%s\t%s\n' $p $pe $b $m $v $r "$(sysctl -n vm.loadavg)" >> $O/battery.tsv
done
cd $S/kx && GIT_INDEX_FILE=$O/idx git add -A -f web 2>/dev/null; echo "final web $(GIT_INDEX_FILE=$O/idx git write-tree --prefix=web/) (bank dc580ec4 + node_modules link)" >> $O/battery.tsv
echo DONE >> $O/battery.tsv
