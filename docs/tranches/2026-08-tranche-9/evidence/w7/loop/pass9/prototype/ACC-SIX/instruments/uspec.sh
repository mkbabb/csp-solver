#!/bin/bash
# uspec.sh <label> <spec> [engines] [grep]: run a UNION spec against the union served on :4237. no rm, no set -e
S=<SCRATCH>
cd $S/union/web/frontend
for eng in ${3:-chromium webkit}; do
  ld=$(uptime | sed 's/.*averages: //')
  # an empty "$g" is a positional filter that matches EVERY spec (the first union run read "445 tests"): no quoting
  if [ -n "$4" ]; then
    GIT_CEILING_DIRECTORIES=$S BASE=http://127.0.0.1:4237 PWOUT=$S/pw-$1-$eng npx playwright test -c <HELPER>/pw.config.ts e2e/$2 --project=$eng --grep "$4" > $S/logs/$1-$eng.log 2>&1
  else
    GIT_CEILING_DIRECTORIES=$S BASE=http://127.0.0.1:4237 PWOUT=$S/pw-$1-$eng npx playwright test -c <HELPER>/pw.config.ts e2e/$2 --project=$eng > $S/logs/$1-$eng.log 2>&1
  fi
  echo $? > $S/logs/$1-$eng.exit
  echo "$1 $eng exit $(cat $S/logs/$1-$eng.exit) · load at start $ld · at end $(uptime | sed 's/.*averages: //') · served :4237 $(curl -s http://127.0.0.1:4237/ | grep -o 'index-[A-Za-z0-9_-]*\.js' | head -1)"
done
echo USPEC-DONE $1
