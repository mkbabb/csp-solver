T=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-33/web/frontend
C=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-control/web/frontend
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/face8
PB=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass6/instruments/check-property-block.mjs
mkdir -p $S/battery
echo "load $(sysctl -n vm.loadavg)"
for g in lint lint:eslint lint:boundary typecheck:e2e typecheck:node lint:knip lint:ink lint:catch lint:theme-selectors lint:theme-tokens lint:lanes lint:sleep lint:motion lint:copy lint:face-engine lint:live-regions lint:tdz test:support-floor test:e2e:projects test:e2e:retries test:font-coverage test:coverage:floor:selftest test:deploy-gate test:edge-probe lint:bands lint:verbs; do
  n=$(echo $g | tr ':' '_')
  (cd $T && npm run -s $g > $S/battery/tree-$n.log 2>&1); te=$?
  (cd $C && npm run -s $g > $S/battery/ctrl-$n.log 2>&1); ce=$?
  echo "$g tree=$te control=$ce"
done
(cd $T && node $PB --fe . > $S/battery/tree-propblock.log 2>&1); te=$?
(cd $C && node $PB --fe . > $S/battery/ctrl-propblock.log 2>&1); ce=$?
echo "check-property-block(source+served) tree=$te control=$ce"
(cd $T && node $PB --fe . --self-test > $S/battery/tree-propblock-st.log 2>&1); te=$?
echo "check-property-block --self-test tree=$te"
echo "load $(sysctl -n vm.loadavg)"
echo DONE
