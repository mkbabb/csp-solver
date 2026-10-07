#!/bin/bash
# PAL-TIN pass-8 CRITIC · the critic's probes (head-real on control and tree; π). No rm, no set -e.
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/critic-tin8
cd $S/cfg || exit 9
run() { # tag arm port grep engine
  local lg=$S/logs/crit-$1-$5.log
  echo "critic spec sha1 $(shasum $S/cspec/headreal.spec.ts | cut -c1-8) · port $3 $(curl -s http://127.0.0.1:$3/ | grep -o 'index-[A-Za-z0-9_-]*\.js') · load $(uptime | sed 's/.*averages*: //')" > $lg
  CRIT_ARM=$2 PLAYWRIGHT_BASE_URL=http://127.0.0.1:$3 TIN_DIR=$S/cspec TIN_MATCH='headreal\.spec\.ts$' TIN_OUT=$S/pw-out/crit-$1-$5 npx playwright test --config $S/cfg/pw.mts --project $5 -g "$4" >> $lg 2>&1
  echo "EXIT=$? · load after $(uptime | sed 's/.*averages*: //')" >> $lg
}
for e in chromium webkit; do
  run hr-control control 4251 "head-real" $e
  run hr-tree tree 4245 "head-real" $e
  run pi tree 4245 "pi solo" $e
done
echo done > $S/logs/crit.done
