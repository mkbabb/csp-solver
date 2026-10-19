#!/bin/bash
# pp-selftest.sh : the ONE postpaint self-test (with the PROPOSED stale-rebase in the tree) x6 per engine,
# then its sabotage battery per engine; each exit written by the run's own shell line to the TSV.
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/MOT-VERB
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-59/web/frontend
O=$S/logs/pp-selftest.tsv; printf "row\tengine\trun\texit\tload-start\n" > $O
cd $W
for e in chromium webkit; do
  for r in 1 2 3 4 5 6; do
    while :; do l=$(sysctl -n vm.loadavg | awk '{print $2}'); awk "BEGIN{exit !($l < 120)}" && break; sleep 30; done
    node e2e/lib/postpaint.mjs --self-test --engine $e > $S/logs/pp-self-$e-$r.log 2>&1
    printf "self-test\t%s\t%s\t%s\t%s\n" $e $r $? "$l" >> $O
  done
  node e2e/lib/postpaint.mjs --sabotage-battery --engine $e > $S/logs/pp-sab-$e.log 2>&1
  printf "sabotage-battery\t%s\t1\t%s\t%s\n" $e $? "$(sysctl -n vm.loadavg | awk '{print $2}')" >> $O
done
echo DONE >> $O
