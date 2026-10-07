#!/bin/bash
# clause-sabotage battery for SIX's two library consumers (LAWS P7 §F (ii)); no rm, no set -e
cd "$1"
echo "clean: ctt-self $(node scripts/check-theme-tokens.mjs --self-test >/dev/null 2>&1; echo $?) ctt $(node scripts/check-theme-tokens.mjs >/dev/null 2>&1; echo $?) fc-self $(node scripts/check-font-coverage.mjs --self-test >/dev/null 2>&1; echo $?) fc $(node scripts/check-font-coverage.mjs >/dev/null 2>&1; echo $?)"
for c in url-dyn decode const-carried strip-regex sfc-toplevel tag-unresolved h-spread barrel pin-binds alias tok-sites tw-arbitrary at-property-site longhand element-keyed; do
  a=$(SHAPE_SABOTAGE=$c node scripts/check-theme-tokens.mjs --self-test >/dev/null 2>&1; echo $?)
  b=$(SHAPE_SABOTAGE=$c node scripts/check-theme-tokens.mjs >/dev/null 2>&1; echo $?)
  d=$(SHAPE_SABOTAGE=$c node scripts/check-font-coverage.mjs --self-test >/dev/null 2>&1; echo $?)
  e=$(SHAPE_SABOTAGE=$c node scripts/check-font-coverage.mjs >/dev/null 2>&1; echo $?)
  echo "SABOTAGE $c: ctt-self $a ctt $b fc-self $d fc $e"
done
