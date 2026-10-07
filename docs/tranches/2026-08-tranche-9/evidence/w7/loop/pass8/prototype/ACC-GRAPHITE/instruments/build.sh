#!/bin/bash
# build.sh <name>: tree's write-tree via temp index; in-tree build (scratch cacheDir/outDir) + CLEAN out-of-tree extraction build; diff -r.
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/graphite8
T=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-40
N=$1
cd $T
export GIT_INDEX_FILE=$S/idx-$N
git read-tree 74a2b5d9 && git add -A web/frontend .github scripts
W=$(git write-tree); unset GIT_INDEX_FILE
echo "WRITE-TREE $W load $(sysctl -n vm.loadavg)"
printf "import base from '%s/web/frontend/vite.config.ts'\nexport default { ...base, cacheDir: '%s/vcache-wf_f72f3b5a-83a-40-%s-tree' }\n" $T $S $N > $S/vite-$N-tree.mts
(cd $T/web/frontend && npx vite build --config $S/vite-$N-tree.mts --outDir $S/dist-$N-tree --emptyOutDir > $S/logs/build-$N-tree.log 2>&1); echo "BUILD-TREE $?"
X=$S/clean-$N; mkdir -p $X
git archive $W web/frontend csp-solver | tar -x -C $X
ln -s $T/web/frontend/node_modules $X/web/frontend/node_modules
printf "import base from '%s/web/frontend/vite.config.ts'\nexport default { ...base, cacheDir: '%s/vcache-wf_f72f3b5a-83a-40-%s-clean' }\n" $X $S $N > $S/vite-$N-clean.mts
(cd $X/web/frontend && npx vite build --config $S/vite-$N-clean.mts --outDir $S/dist-$N-clean --emptyOutDir > $S/logs/build-$N-clean.log 2>&1); echo "BUILD-CLEAN $?"
diff -r $S/dist-$N-tree $S/dist-$N-clean > $S/logs/distdiff-$N.log 2>&1; echo "DIST-DIFF $?"
ls $S/dist-$N-tree/assets | grep -E '^index-.*\.(js|css)$'
for f in $S/dist-$N-tree/assets/index-*.css; do printf "%s @property %s\n" $(basename $f) $(grep -o '@property' $f | wc -l); done
echo "DONE load $(sysctl -n vm.loadavg)"
