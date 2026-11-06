#!/bin/bash
# applycheck.sh : every apply --check on a FRESH git archive with its own git init (git dir + path count printed)
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass10/PLR-COUNT
TREE=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-52
O=$S/bank; R=$O/applycheck.txt; : > $R
SELFD=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass10/prototype/PLR-SELF/pass10.delta.on-WAVE.diff
HOMES=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass10/instruments/homes.on-WAVE.diff
mk() { # name tree-ish
  d=$S/acx/$1; [ -d $d ] && mv $d $S/trash/acx-$1-$(date +%s); mkdir -p $d
  (cd $TREE && git archive $2 web/frontend | tar -x -C $d); (cd $d && git init -q && git add -A)
}
chk() { # label dir diff
  (cd $2 && n=$(git apply --numstat $3 2>/dev/null | wc -l | tr -d ' '); git apply --check $3 > $O/ac-$1.log 2>&1; e=$?; echo "$1 | exit $e | paths $n | git dir $(git rev-parse --absolute-git-dir | sed "s|$S|<lane scratch>|") | errors $(grep -c error $O/ac-$1.log)") >> $R
}
mk base 74a2b5d9; chk base-pass10 $S/acx/base $O/pass10.diff
mk bh ac862f1e; chk basehomes-pass10 $S/acx/bh $O/pass10.diff
mk wave 954bbbab; chk wave-delta $S/acx/wave $O/pass10.delta.on-WAVE.diff; chk wave-pass10full $S/acx/wave $O/pass10.diff
mk wh 8c46d9de; chk wavehomes-delta $S/acx/wh $O/pass10.delta.on-WAVE.diff
mk ws 8c46d9de; (cd $S/acx/ws && git apply $SELFD && git add -A); chk stacked-SELF-delta $S/acx/ws $O/pass10.delta.on-WAVE.diff
(cd $S/acx/ws && git apply $O/pass10.delta.on-WAVE.diff && git add -A && echo "stacked result frontend $(git rev-parse "$(git write-tree):web/frontend")" >> $R)
cat $R
