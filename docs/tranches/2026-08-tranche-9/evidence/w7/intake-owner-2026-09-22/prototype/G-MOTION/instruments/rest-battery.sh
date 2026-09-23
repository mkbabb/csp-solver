#!/bin/zsh
# GB3 + GC4 battery for one engine: rest-battery.sh <engine>  → rest/summary-<engine>.log
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_3b66f064-970-16/web/frontend/.gmotion
E=$1; L=rest/summary-$E.log; : > $L
for vp in 1280x800 390x844; do for sc in light dark; do for view in playing gallery; do
  tag=$E-$vp-$sc-$view
  timeout 150 node rest.mjs $E 4254 $vp $sc $view rest/base-$tag >/dev/null 2>>$L || echo "FAIL base $tag" >> $L
  timeout 150 node rest.mjs $E 4253 $vp $sc $view rest/proto-$tag >/dev/null 2>>$L || echo "FAIL proto $tag" >> $L
  if [ $view = playing ]; then
    echo "GB3 grid $tag $(node compare.mjs ink rest/base-$tag-grid.png rest/proto-$tag-grid.png rest/diff-$tag-grid.png)" >> $L
    echo "GB3 logo $tag $(node compare.mjs ink rest/base-$tag-logo.png rest/proto-$tag-logo.png rest/diff-$tag-logo.png)" >> $L
  fi
  echo "GC4 pi $tag $(node compare.mjs pi rest/base-$tag-pi.json rest/proto-$tag-pi.json)" >> $L
done; done; done
echo DONE >> $L
