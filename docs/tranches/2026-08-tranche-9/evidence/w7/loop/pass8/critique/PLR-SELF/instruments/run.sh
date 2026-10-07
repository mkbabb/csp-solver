#!/bin/bash
# usage: run.sh <tag> <grep> [project...]
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/critic-plrself8
C=$S/ct/web/frontend
tag=$1; g=$2; shift 2
cd $C
echo "START $(date +%T) LOAD $(sysctl -n vm.loadavg) PM $(shasum src/pencil/chrome/PlayerMark/PlayerMark.vue | cut -c1-12)" > $S/logs/$tag.log
proj=""; for p in "$@"; do proj="$proj --project $p"; done
npx playwright test --config $C/.critic8/pw.mts -g "$g" $proj >> $S/logs/$tag.log 2>&1
echo "EXIT $? $(date +%T) LOAD $(sysctl -n vm.loadavg)" >> $S/logs/$tag.log
