#!/bin/bash
# ACC-SIX pass 7 · the yield row's negative controls: the same spec against the tree served with ONE in-memory plant each.
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-45/web/frontend
O=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/acc6p7-yield
cd $W
for P in ${PLANTS:-yieldoff pass6 unheight}; do
  PLANT=$P npx vite --config .acc6p7/plant.mts --host 127.0.0.1 --port 4239 --strictPort > $O/plant-$P.log 2>&1 &
  for i in $(seq 1 30); do curl -s -o /dev/null http://127.0.0.1:4239/ && break; sleep 1; done
  LPID=$(lsof -nP -iTCP:4239 -sTCP:LISTEN -t | head -1)
  curl -s "http://127.0.0.1:4239/src/pencil/chrome/MarginNote.vue" | grep -c 'emit("yielded")' | sed "s/^/plant $P emit-sites-left: /"
  for e in chromium webkit; do
    BASE=http://127.0.0.1:4239 PWOUT=$O/pw-$P-$e npx playwright test -c .acc6p7/pw.config.ts e2e/count-yield.spec.ts --project=$e > $O/neg-$P-$e.log 2>&1
    echo "$P $e exit $? :: $(grep -o 'Error: .*' $O/neg-$P-$e.log | head -2 | tr '\n' '|') :: $(grep -A3 'Error: ' $O/neg-$P-$e.log | grep -m1 'Received' | sed 's/^ *//')"
  done
  kill $LPID; sleep 1
  echo "plant $P listener $LPID killed; 4239 now: $(lsof -nP -iTCP:4239 -sTCP:LISTEN -t | head -1)"
done
echo ALLDONE
