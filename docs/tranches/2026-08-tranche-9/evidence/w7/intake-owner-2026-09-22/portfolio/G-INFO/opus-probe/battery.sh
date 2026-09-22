#!/bin/sh
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/.owner-intake/ginfo-opus
node probe.mjs chromium 1440x900,1280x720 light > c-rest.json 2>c-rest.err; echo "c-rest $?"
node probe.mjs webkit 1280x800,1440x900,1280x720 light > w-all.json 2>w-all.err; echo "w-all $?"
node probe.mjs chromium 1280x800 dark > c-dark.json 2>c-dark.err; echo "c-dark $?"
node probe.mjs webkit 1280x800 dark > w-dark.json 2>w-dark.err; echo "w-dark $?"
node probe.mjs chromium 1280x800 light prm > c-prm.json 2>c-prm.err; echo "c-prm $?"
node probe.mjs webkit 1280x800 light prm > w-prm.json 2>w-prm.err; echo "w-prm $?"
echo DONE > done.flag
