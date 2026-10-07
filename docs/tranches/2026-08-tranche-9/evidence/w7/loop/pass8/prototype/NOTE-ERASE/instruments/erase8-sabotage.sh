#!/bin/bash
# usage: erase8-sabotage.sh <web/frontend>  — the registration row's clause-sabotage battery (LAWS P7 §F (ii)).
# Clean must exit 0; every clause switched off in turn must make --self-test exit 2 (a plant goes green).
cd "$1" || exit 9
node scripts/check-theme-tokens.mjs --self-test >/dev/null 2>&1; echo "clean exit=$?"
bad=0
for c in script count home depth syntax inherits initial stray unread stale foldname; do
  THEME_SABOTAGE=$c node scripts/check-theme-tokens.mjs --self-test > /dev/null 2>&1; x=$?
  echo "THEME_SABOTAGE=$c exit=$x $([ $x = 2 ] && echo BITES || echo HOLE)"; [ $x = 2 ] || bad=1
done
SHAPE_SABOTAGE=pcss node scripts/check-theme-tokens.mjs --self-test > /dev/null 2>&1; x=$?
echo "SHAPE_SABOTAGE=pcss exit=$x $([ $x = 2 ] && echo BITES || echo HOLE)"; [ $x = 2 ] || bad=1
# register-split is NOT load-bearing here by design: the script clause (C4's shape) reds ANY
# registerProperty( whatever its name, so the split plant stays red with the fold switched off.
SHAPE_SABOTAGE=register-split node scripts/check-theme-tokens.mjs --self-test > /dev/null 2>&1; x=$?
echo "SHAPE_SABOTAGE=register-split exit=$x $([ $x = 0 ] && echo 'NOT LOAD-BEARING (the script clause is name-blind)' || echo UNEXPECTED)"; [ $x = 0 ] || bad=1
SHAPE_SABOTAGE=register-split THEME_SABOTAGE=script node scripts/check-theme-tokens.mjs --self-test > /dev/null 2>&1; x=$?
echo "SHAPE_SABOTAGE=register-split + THEME_SABOTAGE=script exit=$x $([ $x = 2 ] && echo BITES || echo HOLE)"; [ $x = 2 ] || bad=1
echo "battery bad=$bad"
