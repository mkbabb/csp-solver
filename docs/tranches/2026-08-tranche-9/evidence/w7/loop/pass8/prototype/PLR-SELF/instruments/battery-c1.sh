#!/bin/bash
# PLR-SELF pass 8 (resumed) · dev-phase probes on :4241 (the unedited tree): (b)'s loss, row 9's slice; then both builds.
R=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrself8r
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-p4-PLR-SELF/web/frontend
cd $W
echo "LOAD $(sysctl -n vm.loadavg)"
for e in chromium webkit; do
  OUT=$R/readings/loss.jsonl TM=p8-loss npx playwright test --config $R/probe/pw.mts --project $e > $R/logs/loss-$e.log 2>&1; echo "LOSS $e exit $?"
  OUT=$R/readings/slice.jsonl TM=p8-slice npx playwright test --config $R/probe/pw.mts --project $e > $R/logs/slice-$e.log 2>&1; echo "SLICE $e exit $?"
  OUT=$R/readings/ids.jsonl TM=p8-ids npx playwright test --config $R/probe/pw.mts --project $e > $R/logs/ids-$e.log 2>&1; echo "IDS $e exit $?"
done
echo "PM sha $(shasum src/pencil/chrome/PlayerMark/PlayerMark.vue | cut -c1-12) LOAD $(sysctl -n vm.loadavg)"
npx vite build --config $R/vite.build.tree.mts > $R/logs/build-tree.log 2>&1; echo "BUILD tree exit $?"
cd $R/arch/web/frontend && npx vite build --config $R/vite.build.arch.mts > $R/logs/build-arch.log 2>&1; echo "BUILD arch exit $?"
diff -rq $R/dist-tree $R/dist-arch > $R/logs/dist-diff.txt 2>&1; echo "DIST diff -rq exit $? ($(wc -l < $R/logs/dist-diff.txt) lines)"
ls $R/dist-tree/assets | grep -E '^index-' ; shasum $R/dist-tree/assets/index-*.css $R/dist-arch/assets/index-*.css
echo "LOAD $(sysctl -n vm.loadavg)"
echo C1-DONE
