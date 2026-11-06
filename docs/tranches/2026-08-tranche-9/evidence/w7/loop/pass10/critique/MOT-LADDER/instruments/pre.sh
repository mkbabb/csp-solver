#!/bin/zsh
# pre.sh : the pre-return gates bare on the integrated trees, with and without the delta (exits read from files)
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass10/crit-MOT-LADDER
O=$S/logs/pre; mkdir -p $O; printf 'tree\tgate\texit\tload\n' > $O/pre.tsv
for d in s13h s13h-own waveh waveh-ow; do
  echo /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.git/objects > $S/$d/.git/objects/info/alternates
  ln -sfn /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules $S/$d/web/frontend/node_modules
  cd $S/$d/web/frontend
  for g in bands sleep; do
    case $g in bands) c="node scripts/check-motion-bands.mjs --self-test";; sleep) c="node scripts/check-sleep-lint.mjs --self-test";; esac
    ~/.claude/guard/guarded --light -- zsh -c "$c" > $O/$d.$g.log 2>&1; e=$?
    printf '%s\t%s\t%s\t%s\n' $d $g $e "$(sysctl -n vm.loadavg)" >> $O/pre.tsv
  done
done
echo DONE >> $O/pre.tsv
