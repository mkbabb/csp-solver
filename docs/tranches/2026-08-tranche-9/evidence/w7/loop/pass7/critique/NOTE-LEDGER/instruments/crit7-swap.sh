#!/bin/bash
# the swap on union+ERASE7+LEDGER7 HOLD (:4232) and + swap-fence.PROPOSED (:4233), x3 per engine (critic, pass 7)
C=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass7/critique/NOTE-LEDGER
for eng in chromium webkit; do
  echo "load $(sysctl -n vm.loadavg) procs $(pgrep -f 'node|playwright|vitest' | wc -l)"
  node $C/instruments/critic7.mjs $eng hold http://127.0.0.1:4232 index-BftXARS89UkJ.js swap 2>&1 | grep -E 'ROW|Error'
  node $C/instruments/critic7.mjs $eng fence http://127.0.0.1:4233 index-BY9K6d0U8MrK.js swap 2>&1 | grep -E 'ROW|Error'
done
echo SWAP-DONE
