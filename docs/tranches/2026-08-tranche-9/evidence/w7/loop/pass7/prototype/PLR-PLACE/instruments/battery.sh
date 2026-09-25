#!/bin/bash
# PLR-PLACE pass 7 — the pre-return battery, BARE, on a scratch rsync of the final tree (no .plr-place) and a git archive of 74a2b5d9.
SP=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad
R=$SP/plrplace7c-work; W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-p4-PLR-PLACE/web/frontend
L=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop
T=$SP/plrplace7c-bat/web/frontend; C=$SP/plrplace7c-ctl/web/frontend; TMP=$R/bat.tmp; O=$R/battery.txt
# the copy was cut from the clean final tree before any plant ran (no rsync here: plants run on the tree meanwhile)
echo "sha1 PlayerMark $(shasum $W/src/pencil/chrome/PlayerMark/PlayerMark.vue | cut -c1-12) copy $(shasum $T/src/pencil/chrome/PlayerMark/PlayerMark.vue | cut -c1-12); load $(uptime | sed 's/.*averages: //')" >> $O
for side in tree control; do
  D=$T; [ $side = control ] && D=$C
  cd $D
  run() { local name=$1; shift; "$@" > $TMP 2>&1; local rc=$?; echo "$side | $name | exit=$rc | $(grep -v '^\s*$' $TMP | tail -1 | cut -c1-170)" >> $O; }
  run lint:sleep npm run -s lint:sleep
  run lint:lanes npm run -s lint:lanes
  run lint:theme-tokens npm run -s lint:theme-tokens
  for g in lint:bands lint:verbs; do if grep -q "\"$g\"" package.json; then run $g npm run -s $g; else echo "$side | $g | (no such script)" >> $O; fi; done
  run test:e2e:projects npm run -s test:e2e:projects
  run check-pw-projects node scripts/check-pw-projects.mjs
  run "eslint ." npx eslint .
  run "npm run lint (scoped prettier)" npm run -s lint
  run "check-copy-register bare" node scripts/check-copy-register.mjs
  run test:font-coverage npm run -s test:font-coverage
  run lint:motion npm run -s lint:motion
  run lint:live-regions npm run -s lint:live-regions
  run lint:knip npm run -s lint:knip
  run lint:boundary npm run -s lint:boundary
  run "check-property-block --fe" node $L/pass6/instruments/check-property-block.mjs --fe $D
  FE=$D node $L/pass7/prototype/PLR-SELF/instruments/undefined-token-census.A3.mjs > $TMP 2>&1; ec=$?; echo "$side | undefined-token census (A.3 row) | exit=$ec | $(grep -E 'bare var|STALE|stale:' $TMP | tr '\n' ' ' | tr -s ' ' | cut -c1-200)" >> $O
  FE=$D node $L/pass6/instruments/undefined-token-census.mjs > $TMP 2>&1; ec=$?; echo "$side | undefined-token census (no A.3) | exit=$ec | $(grep -E 'bare var|STALE|stale:' $TMP | tr '\n' ' ' | tr -s ' ' | cut -c1-200)" >> $O
  LAW_FE=$D node $L/pass6/prototype/PLR-PLACE/instruments/law-probe.p6.mjs > $TMP 2>&1; ec=$?; echo "$side | r0 law-probe (FE re-pointed) | exit=$ec | $(grep -cE 'GREEN' $TMP) GREEN lines, $(grep -E 'BROKEN|MOVED' $TMP | wc -l | tr -d ' ') BROKEN/MOVED" >> $O
  cp $TMP $R/lawprobe-$side.txt
  run "L5b" node $L/pass6/instruments/l5b.mjs $D
  run "L5b plants" node $L/pass6/instruments/l5b.plants.mjs $D
  if [ $side = tree ]; then run "vue-tsc -b" npx vue-tsc -b; run "vue-tsc e2e" npx vue-tsc -p tsconfig.e2e.json --noEmit; fi
done
cd $T; grep -rn 'keydown.enter' src | grep -v '^\s*//' | wc -l | sed 's/^/tree | CH-70 probe keydown.enter lines /' >> $O
echo DONE >> $O
