#!/usr/bin/env bash
# One probe across both dists and both engines. Usage: run-probe.sh <probe>
set -u
P=${1:?probe}
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_8630d340-e56-60/web/frontend || exit 2
R=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/mot-ladder-runtime.mjs
E=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass2/prototype/MOT-LADDER/readings

for pair in "after:4246" "control:4247"; do
  name=${pair%%:*}; port=${pair##*:}
  for eng in chromium webkit; do
    echo "=== ${P} ${name} ${eng} ==="
    node "$R" --probe="$P" --engine="$eng" --base="http://127.0.0.1:${port}/" \
      --out="${E}/${P}-${name}-${eng}.json"
    echo "exit=$?"
  done
done
