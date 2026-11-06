#!/bin/zsh
# ucrit.sh : row-12 critic plants on bootHand.test.ts (my own plants beside the author's two)
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass10/crit-MOT-LADDER
FE=$S/ux/web/frontend; O=$S/logs/ucrit; mkdir -p $O; C=src/pencil/config/pencilConfig.ts; B=src/pencil/composables/bootHand.ts
cp $FE/$C $O/cfg.orig; cp $FE/$B $O/bh.orig
printf 'plant\tedit\tvitest\tfailed-lines\trestored\tload\n' > $O/unit.tsv
sub() { python3 -c "import sys;p,a,b=sys.argv[1:];s=open(p).read();assert s.count(a)==1;open(p,'w').write(s.replace(a,b))" "$@"; }
for p in NONE window2 window6 slack145 slack155 step25 cap43 partial; do
  cd $FE
  case $p in
    NONE) e=0;;
    window2) sub $C '    paceWindow: 5,' '    paceWindow: 2,'; e=$?;;
    window6) sub $C '    paceWindow: 5,' '    paceWindow: 6,'; e=$?;;
    slack145) sub $C '    paceSlack: 1.5,' '    paceSlack: 1.45,'; e=$?;;
    slack155) sub $C '    paceSlack: 1.5,' '    paceSlack: 1.55,'; e=$?;;
    step25) sub $C '    stepMs: 17,' '    stepMs: 25,'; e=$?;;
    cap43) sub $C '    maxStepMs: 42,' '    maxStepMs: 43,'; e=$?;;
    partial) sub $B '  if (last >= 0) {' '  if (last >= 0 || strokes.size > 0) {'; e=$?;;
  esac
  ~/.claude/guard/guarded --light -- npx vitest run --maxWorkers=2 src/pencil/composables/bootHand.test.ts > $O/$p.log 2>&1; v=$?
  f=$(grep -cE '^ *(×|✗) |FAIL ' $O/$p.log)
  cp $O/cfg.orig $FE/$C; cp $O/bh.orig $FE/$B; cmp -s $O/cfg.orig $FE/$C && cmp -s $O/bh.orig $FE/$B; r=$?
  printf '%s\t%s\t%s\t%s\t%s\t%s\n' $p $e $v $f $r "$(sysctl -n vm.loadavg)" >> $O/unit.tsv
done
echo DONE >> $O/unit.tsv
