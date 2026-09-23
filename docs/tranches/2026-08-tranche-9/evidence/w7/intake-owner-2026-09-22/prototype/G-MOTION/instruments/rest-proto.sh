#!/bin/zsh
# A2 re-read: proto-only rest reads (GB3 + GC4) against the banked HEAD reads, both engines → rest/summary-a2.log
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_3b66f064-970-16/web/frontend/.gmotion
L=rest/summary-a2.log; : > $L
for E in chromium webkit; do for vp in 1280x800 390x844; do for sc in light dark; do for view in playing gallery; do
  tag=$E-$vp-$sc-$view
  timeout 150 node rest.mjs $E 4253 $vp $sc $view rest/a2p-$tag >/dev/null 2>>$L || echo "FAIL $tag" >> $L
  if [ $view = playing ]; then
    echo "GB3 grid $tag $(node compare.mjs ink rest/base-$tag-grid.png rest/a2p-$tag-grid.png rest/diff-$tag-grid.png)" >> $L
    echo "GB3 logo $tag $(node compare.mjs ink rest/base-$tag-logo.png rest/a2p-$tag-logo.png rest/diff-$tag-logo.png)" >> $L
  fi
  echo "GC4 pi $tag $(node compare.mjs pi rest/base-$tag-pi.json rest/a2p-$tag-pi.json)" >> $L
done; done; done; done
echo DONE >> $L
