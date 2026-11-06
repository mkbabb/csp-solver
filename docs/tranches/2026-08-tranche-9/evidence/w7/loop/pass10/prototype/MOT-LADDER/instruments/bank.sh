#!/bin/zsh
# MOT-LADDER pass-10 bank. Writes into the evidence dir; every apply line prints its git dir and path count.
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass10/MOT-LADDER
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-59
E=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass10/prototype/MOT-LADDER
H=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass10/instruments/homes.on-WAVE.diff
mkdir -p $E; B=$E/BANKED.txt; : > $B
cd $W; export GIT_INDEX_FILE=$S/idx-bank; git read-tree HEAD; git add -A; T=$(git write-tree); unset GIT_INDEX_FILE
echo "worktree .claude/worktrees/wf_f72f3b5a-83a-59 (the one §13 tree; VERB banked, LADDER alone)" >> $B
echo "base 74a2b5d9317e7795cee6bf63e861bd44f54ae80e" >> $B
echo "opened-at 2b9c277e0733031cea9a4c27cdbf99d1f48f3685 (= VERB's pass-9 BANKED tree; temp-index cut at open, no difference)" >> $B
echo "homes v3 by sha: homes.on-WAVE.diff 0723d508 on 2b9c277e -> bfca19c1c435f8723717a3ab53021cadb739432a (13/13 home paths blob-equal to 74a2b5d9 + homes.diff 07257854 = ac862f1e)" >> $B
echo "tree $T" >> $B
git diff --binary 74a2b5d9 $T > $E/pass10.diff
git diff --binary bfca19c1c435f8723717a3ab53021cadb739432a $T > $E/pass10-ladder-delta.diff
for n in wavef:8c46d9dedc7fe6b726b9b7fdbdfa23e320cff204 s13f:e9e19085820140e02e3c905db50d9f74c33b2cea; do
  d=$S/${n%%:*}; t=${n#*:}; [ -e $d ] && mv $d $S/trash/${n%%:*}.$(date +%s); mkdir -p $d
  git archive $t | tar -x -C $d
  (cd $d && git init -q && echo /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.git/objects > .git/objects/info/alternates && git read-tree $t && git update-index -q --refresh; git apply $E/pass10-ladder-delta.diff; echo "fresh ${n%%:*} ($t) + pass10-ladder-delta apply exit $? gitdir $(git rev-parse --absolute-git-dir) paths $(git diff --name-only | wc -l | tr -d ' ')" >> $B; ln -sfn /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules web/frontend/node_modules)
done
(cd $S/wavef && git diff --binary) > $E/pass10.delta.on-WAVE.diff
(cd $S/s13f && git diff --binary) > $E/own-gate.diff
for f in pass10.diff pass10-ladder-delta.diff pass10.delta.on-WAVE.diff own-gate.diff; do
  echo "$f bytes $(wc -c < $E/$f | tr -d ' ') sha1 $(shasum $E/$f | cut -d' ' -f1) shortstat $(git apply --stat $E/$f | tail -1)" >> $B
done
chk() { # chk <diff> <tree> <label>
  export GIT_INDEX_FILE=$S/idx-chk; git read-tree $2
  git apply --cached --check $E/$1 2>> $S/logs/bank-chk.err; local e=$?
  local n=$(git apply --numstat $E/$1 | wc -l | tr -d ' ')
  local r="-"; if [ $e = 0 ]; then git apply --cached $E/$1; r=$(git write-tree); fi
  unset GIT_INDEX_FILE
  echo "apply --check $1 @ $3 ($2) exit $e paths $n gitdir $(git rev-parse --absolute-git-dir) -> $r" >> $B
}
chk pass10.diff 74a2b5d9317e7795cee6bf63e861bd44f54ae80e base
chk pass10-ladder-delta.diff bfca19c1c435f8723717a3ab53021cadb739432a "VERB-bank+homes-v3 (declared base)"
chk pass10-ladder-delta.diff 2b9c277e0733031cea9a4c27cdbf99d1f48f3685 "VERB-bank bare (needs homes v3 first: the route)"
chk own-gate.diff e9e19085820140e02e3c905db50d9f74c33b2cea "s13-s7-s3+homes-v3 (declared base)"
chk own-gate.diff 2f11714fa68fcf6242acdfa9acac9c743852af3c "s13-s7-s3 bare 2f11714f"
chk pass10.delta.on-WAVE.diff 8c46d9dedc7fe6b726b9b7fdbdfa23e320cff204 "WAVE+homes-v3 (declared base)"
chk pass10.delta.on-WAVE.diff 954bbbabde2933808debbf702e5338bf5856debb "WAVE bare 954bbbab"
chk pass10-ladder-delta.diff 2f11714fa68fcf6242acdfa9acac9c743852af3c "s13 bare, the LADDER delta itself"
chk pass10-ladder-delta.diff 954bbbabde2933808debbf702e5338bf5856debb "WAVE bare, the LADDER delta itself"
echo "contamination grep (scratchpad|/private/tmp|/tmp/|.claude/t9-scratch|+++ dot-path):" >> $B
for f in pass10.diff pass10-ladder-delta.diff pass10.delta.on-WAVE.diff own-gate.diff; do
  echo "  $f $(grep -cE 'scratchpad|/private/tmp|/tmp/|\.claude/t9-scratch|^\+\+\+ b/(.*/)?\.[^/]' $E/$f)" >> $B
done
echo "paths pass10-ladder-delta: $(git apply --numstat $E/pass10-ladder-delta.diff | awk '{print $3}' | tr '\n' ' ')" >> $B
echo BANK-DONE >> $B
