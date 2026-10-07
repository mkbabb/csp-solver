#!/bin/bash
# build.sh <name>: (1) the tree's web/frontend built in place (source read from the tree, cacheDir + outDir in scratch)
# (2) a CLEAN out-of-tree extraction of the tree's product write-tree, built the same way; then diff -r.
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/verb8
T=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-59
N=$1; R=$S/r2
cd $T
export GIT_INDEX_FILE=$R/idx-$N
git read-tree 74a2b5d9 && git add -A web/frontend .github scripts
W=$(git write-tree); unset GIT_INDEX_FILE
echo "WRITE-TREE $W"
cat > $R/vite-$N-tree.mts <<EOT
import base from '$T/web/frontend/vite.config.ts'
export default { ...base, cacheDir: '$R/vcache-wf_f72f3b5a-83a-59-$N-tree' }
EOT
(cd $T/web/frontend && npx vite build --config $R/vite-$N-tree.mts --outDir $R/dist-$N-tree --emptyOutDir > $R/logs/build-$N-tree.log 2>&1); echo "BUILD-TREE $?"
X=$R/clean-$N; mkdir -p $X
git archive $W web/frontend csp-solver | tar -x -C $X
ln -s $T/web/frontend/node_modules $X/web/frontend/node_modules
cat > $R/vite-$N-clean.mts <<EOT
import base from '$X/web/frontend/vite.config.ts'
export default { ...base, cacheDir: '$R/vcache-wf_f72f3b5a-83a-59-$N-clean' }
EOT
(cd $X/web/frontend && npx vite build --config $R/vite-$N-clean.mts --outDir $R/dist-$N-clean --emptyOutDir > $R/logs/build-$N-clean.log 2>&1); echo "BUILD-CLEAN $?"
diff -r $R/dist-$N-tree $R/dist-$N-clean > $R/logs/distdiff-$N.log 2>&1; echo "DIST-DIFF $?"
ls $R/dist-$N-tree/assets | grep -E '^index-.*\.(js|css)$'
for f in $R/dist-$N-tree/assets/*.css; do printf "%s @property %s\n" $(basename $f) $(grep -o '@property' $f | wc -l); done
