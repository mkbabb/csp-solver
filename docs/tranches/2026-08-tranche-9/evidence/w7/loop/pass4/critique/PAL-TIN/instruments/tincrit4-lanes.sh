#!/bin/bash
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_308fa864-c94-2/web/frontend
L=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/tincrit4/lanes
mkdir -p $L
for s in lint lint:eslint lint:boundary lint:motion lint:copy lint:tin lint:theme-tokens lint:theme-selectors lint:lanes lint:catch lint:live-regions lint:ink lint:knip typecheck:e2e test:e2e:projects test:e2e:retries lint:tdz lint:sleep; do
  npm run -s $s > $L/$s.log 2>&1; echo "$s EXIT $?"
done
node scripts/check-peer-tin.mjs > $L/peer-tin-bare.log 2>&1; echo "check-peer-tin bare EXIT $?"
node scripts/check-copy-register.mjs > $L/copy-bare.log 2>&1; echo "check-copy-register bare EXIT $?"
npx vue-tsc --noEmit > $L/vuetsc.log 2>&1; echo "vue-tsc EXIT $?"
echo DONE
