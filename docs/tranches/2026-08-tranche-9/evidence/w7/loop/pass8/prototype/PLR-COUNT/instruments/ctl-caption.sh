#!/bin/bash
# The ONE glyph-pop at its home, run from the lane tree against the CONTROL dist :4250: the @mbabb caption.
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-52/web/frontend
curl -s http://127.0.0.1:4250/ | grep -o 'index-[A-Za-z0-9_-]*\.js'
for e in chromium webkit; do for sc in light dark; do for d in 1 2; do
  node e2e/lib/glyph-pop.mjs --engine $e --scheme $sc --dpr $d --viewport 1280x720 --url 'http://127.0.0.1:4250/?size=3&difficulty=EASY' --hover '.corner-left .attribution-trigger' --subject '.corner-left .hover-card p.italic' --payload "control-caption-$sc-$d" 2>&1 | grep -E "CLEAN|LOAD"; echo "EXIT caption control $e $sc dpr$d ${PIPESTATUS[0]}"
done; done; done
echo CTL-DONE
