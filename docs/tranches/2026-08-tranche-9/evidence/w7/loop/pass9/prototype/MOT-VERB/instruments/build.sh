#!/bin/bash
# build.sh <tag> [fe-dir] : build a frontend into $S/dist-<tag> with a private cacheDir; EXIT line in the log
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/MOT-VERB
d=$1; FE=${2:-/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-59/web/frontend}
printf "import base from './vite.config.ts'\nexport default { ...base, cacheDir: '%s' }\n" "$S/vcache-$d" > $FE/.vite-verb9.config.mts
[ -e $S/dist-$d ] && mv $S/dist-$d $S/trash/dist-$d.$(date +%s)
cd $FE && npx vite build --config .vite-verb9.config.mts --outDir $S/dist-$d --emptyOutDir > $S/logs/build-$d.log 2>&1; echo "EXIT $?" >> $S/logs/build-$d.log
