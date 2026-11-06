#!/bin/bash
# applycheck.sh <bankdir> - every apply --check of the bank, each in a git init-ed archive copy, printing its git dir and path count.
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass10/NOTE-ERASE
B=$1; O=$S/logs/applycheck.txt; : > $O
chk() { local label=$1 dir=$2 diff=$3; shift 3; (cd $dir && git apply --check "$@" $diff > $S/logs/ac-$label.log 2>&1; x=$?; echo "$label: exit=$x gitdir=$(git rev-parse --absolute-git-dir) paths=$(git apply --numstat $diff | wc -l | tr -d ' ') $(head -c 160 $S/logs/ac-$label.log | tr '\n' ' ')" >> $O); }
chk pass10-on-74a2b5d9 $S/copies/b0 $B/pass10.diff
# the run route: 74a2b5d9 + homes.diff (07257854) by sha, then pass10.diff; on a temporary index in b0's repo
(cd $S/copies/b0 && export GIT_INDEX_FILE=$S/ac-b0h.index && git read-tree 243fbf573f125376314dbc88e55dfba0376e3936 && git apply --cached $S/homes.v3.diff && echo "b0+homes tree $(git write-tree)" >> $O && git apply --cached --check $B/pass10.diff; echo "pass10-on-74a2b5d9+homes.diff (index): exit=$? gitdir=$(git rev-parse --absolute-git-dir) paths=$(git apply --numstat $B/pass10.diff | wc -l | tr -d ' ')" >> $O; git apply --cached $B/pass10.diff && echo "applied -> tree $(git write-tree) (want the bank tree)" >> $O)
chk onWAVE-on-WAVE+homes-v3 $S/copies/waveh $B/pass10.delta.on-WAVE.diff
chk onWAVE-on-s13-s7-s3+homes-v3 $S/copies/s13h $B/pass10.delta.on-WAVE.diff
# the bare WAVE (no homes) and the bare s13: the four paths are off the homes, so the delta needs no homes to apply
(cd $S/copies/waveh && export GIT_INDEX_FILE=$S/ac-wbare.index && git read-tree 243fbf573f125376314dbc88e55dfba0376e3936 && git apply --cached $S/WAVE9.diff && echo "bare WAVE tree $(git write-tree)" >> $O && git apply --cached --check $B/pass10.delta.on-WAVE.diff; echo "onWAVE-on-bare-WAVE (index): exit=$? gitdir=$(git rev-parse --absolute-git-dir)" >> $O)
(cd $S/copies/s13h && export GIT_INDEX_FILE=$S/ac-s13bare.index && git read-tree 243fbf573f125376314dbc88e55dfba0376e3936 && git apply --cached $S/s13.diff && echo "bare s13 tree $(git write-tree)" >> $O && git apply --cached --check $B/pass10.delta.on-WAVE.diff; echo "onWAVE-on-bare-s13 (index): exit=$? gitdir=$(git rev-parse --absolute-git-dir)" >> $O)
chk pass10-on-WAVE+homes-v3 $S/copies/waveh $B/pass10.diff
echo FIN >> $O
