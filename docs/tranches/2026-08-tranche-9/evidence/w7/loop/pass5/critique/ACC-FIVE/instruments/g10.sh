#!/bin/zsh
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/acc5crit-p5
F=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-41/web/frontend
cd $F
export BASE=http://127.0.0.1:4241 TESTDIR=$S/specs
GP=$F/src/pencil/grid/gridPaths.ts
shasum $GP > $S/gp.sha1
cp $GP $S/gridPaths.ts.orig
trap "cp $S/gridPaths.ts.orig $GP; shasum -c $S/gp.sha1" EXIT
run() { echo "=== $1"; npx playwright test --config .acc5crit/pw.config.mts $2 --project=$3 2>&1 | grep -E "CRITIC|passed|failed|Error:|re-cuts|✘|✓" | head -20; echo "exit ${pipestatus[1]}"; }
echo "##### LANDED"
for e in chromium webkit; do run "landed native $e" front-rate.spec.ts $e; run "landed 60Hz $e" front-rate-60hz.spec.ts $e; done
echo "##### ABLATED FRONT_MIN_MS 16->0"
sed -i '' 's/^export const FRONT_MIN_MS = 16;/export const FRONT_MIN_MS = 0;/' $GP
grep -n "^export const FRONT_MIN_MS" $GP
sleep 3
for e in chromium webkit; do run "ablated native $e" front-rate.spec.ts $e; run "ablated 60Hz $e" front-rate-60hz.spec.ts $e; done
cp $S/../acc5crit-p5/gp.sha1 /dev/null
sed -i '' 's/^export const FRONT_MIN_MS = 0;/export const FRONT_MIN_MS = 16;/' $GP
shasum -c $S/gp.sha1 && echo RESTORED
echo DONE
