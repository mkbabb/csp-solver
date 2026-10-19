#!/bin/bash
# PAL-WALK pass-9: git apply --check of both banked diffs on fresh archives of their bases (no commit, no rm; exits read bare).
S=<lane-scratch>
R=<repo>/.claude/worktrees/wf_308fa864-c94-1
OUT=<repo>/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass9/prototype/PAL-WALK
GD=$(git -C $R rev-parse --git-dir)
export GIT_CEILING_DIRECTORIES=$S/applychk
A=$S/applychk; mkdir -p $A
LOG=$S/logs/applycheck.txt; : > $LOG
chk () { # $1 label  $2 base-ish  $3 diff
  d=$A/$1; if [ -e $d ]; then mv $d $S/trash/applychk-$1-$(date +%s); fi; mkdir -p $d
  case $2 in
    s10) git --git-dir=$GD archive 74a2b5d9 | tar -x -C $d; (cd $d && git apply --binary <repo>/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass8/integrate/s10.diff); echo "  s10 rebuilt (74a2b5d9 + pass8/integrate/s10.diff; 7d2b1fdc is not in this object store): apply=$?" >> $LOG;;
    *) git --git-dir=$GD archive $2 | tar -x -C $d;;
  esac
  (cd $d && git apply --check --binary $3 > $A/$1.err 2>&1); e=$?
  echo "$1 base=$2 diff=$(basename $3) check=$e numstat_paths=$(cd $d && git apply --numstat $3 2>/dev/null | wc -l | tr -d ' ') errors=$(grep -c '^error' $A/$1.err)" >> $LOG
  grep '^error' $A/$1.err | head -12 | sed 's/^/    /' >> $LOG
}
chk tree   74a2b5d9 $OUT/pass9.diff
chk s10    s10 $OUT/pass9.diff
chk s13    f1c9c3fe $OUT/pass9.diff
chk wave   acb9c08e $OUT/pass9.diff
chk ow     acde977b $OUT/pass9.delta.on-WAVE.diff
chk owwave acb9c08e $OUT/pass9.delta.on-WAVE.diff
echo done >> $LOG
