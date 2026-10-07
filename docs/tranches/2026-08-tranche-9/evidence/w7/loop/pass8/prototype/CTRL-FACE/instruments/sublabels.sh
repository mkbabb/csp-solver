#!/bin/bash
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-33/web/frontend
Q="size=3&difficulty=MEDIUM&board=ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5"
for eng in chromium webkit; do
for arm in "tree:4234" "control:4251"; do
for sub in ".deal-btn .icon-sublabel" ".action-verbs > .icon-btn:nth-child(1) .icon-sublabel" ".action-verbs > .icon-btn:nth-child(2) .icon-sublabel" ".action-verbs > .icon-btn:nth-child(3) .icon-sublabel" ".action-verbs > .icon-btn:nth-child(4) .icon-sublabel" ".info-btn .icon-sublabel"; do
  out=$(timeout 110 node e2e/lib/glyph-pop.mjs --engine $eng --url "http://127.0.0.1:${arm#*:}/?$Q" --subject "$sub" --payload m17 --dpr 2 --ready "svg.handwritten-logo" 2>&1); ex=$?
  echo "$arm $eng exit=$ex :: $(echo "$out" | grep -v PLANT | grep GLYPH | head -1 | cut -c1-420)"
  echo "$arm $eng plants RED $(echo "$out" | grep PLANT | grep -c '→ RED')/$(echo "$out" | grep -c PLANT)"
done; done; done
echo DONE
