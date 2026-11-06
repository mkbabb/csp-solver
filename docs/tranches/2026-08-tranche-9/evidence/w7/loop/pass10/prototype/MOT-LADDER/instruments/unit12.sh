#!/bin/zsh
# usage: unit12.sh <snapdir> -> logs/unit12/unit.tsv : row-12 behavioural plants on bootHand.test.ts
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass10/MOT-LADDER
FE=$1/web/frontend; O=$S/logs/unit12; mkdir -p $O; C=src/pencil/config/pencilConfig.ts; B=src/pencil/composables/bootHand.ts
cp $FE/$C $O/cfg.orig; cp $FE/$B $O/bh.orig
printf 'plant\tsed\tvitest\tfailed-tests\trestored\tload\n' > $O/unit.tsv
for p in NONE window2 cap60 cap100 slack2 partial; do
  cd $FE
  case $p in
    NONE) e=0;;
    window2) python3 -c "import sys;p='$C';s=open(p).read();a='    paceWindow: 5,\n';assert s.count(a)==1;open(p,'w').write(s.replace(a,'    paceWindow: 2,\n'))"; e=$?;;
    cap60) python3 -c "import sys;p='$C';s=open(p).read();a='    maxStepMs: 42,\n';assert s.count(a)==1;open(p,'w').write(s.replace(a,'    maxStepMs: 60,\n'))"; e=$?;;
    cap100) python3 -c "import sys;p='$C';s=open(p).read();a='    maxStepMs: 42,\n';assert s.count(a)==1;open(p,'w').write(s.replace(a,'    maxStepMs: 100,\n'))"; e=$?;;
    slack2) python3 -c "import sys;p='$C';s=open(p).read();a='    paceSlack: 1.5,\n';assert s.count(a)==1;open(p,'w').write(s.replace(a,'    paceSlack: 2,\n'))"; e=$?;;
    partial) python3 -c "import sys;p='$B';s=open(p).read();a='  if (last >= 0) {\n';assert s.count(a)==1;open(p,'w').write(s.replace(a,'  if (last >= 0 || strokes.size > 0) {\n'))"; e=$?;;
  esac
  npx vitest run --maxWorkers=2 src/pencil/composables/bootHand.test.ts > $O/$p.log 2>&1; v=$?
  f=$(grep -c "^ *× \|^ *✗ \|FAIL " $O/$p.log)
  cp $O/cfg.orig $FE/$C; cp $O/bh.orig $FE/$B; cmp -s $O/cfg.orig $FE/$C && cmp -s $O/bh.orig $FE/$B; r=$?
  printf '%s\t%s\t%s\t%s\t%s\t%s\n' $p $e $v $f $r "$(sysctl -n vm.loadavg)" >> $O/unit.tsv
done
echo DONE >> $O/unit.tsv
