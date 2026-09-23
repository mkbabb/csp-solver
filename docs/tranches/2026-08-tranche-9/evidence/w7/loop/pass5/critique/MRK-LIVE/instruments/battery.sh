#!/bin/zsh
cd "$1"
for c in "npm run -s lint" "npm run -s lint:copy" "npm run -s lint:theme-tokens" "npm run -s lint:lanes" "npm run -s lint:sleep" "npm run -s lint:motion" "npm run -s test:e2e:projects" "node scripts/check-pw-projects.mjs" "npx eslint . --ignore-pattern .mrklive-crit/**"; do
  eval "$c" > /tmp/.x.$$ 2>&1; rc=$?
  echo "== $c :: EXIT $rc"; tail -4 /tmp/.x.$$
done
rm -f /tmp/.x.$$
echo BATTERY-DONE
