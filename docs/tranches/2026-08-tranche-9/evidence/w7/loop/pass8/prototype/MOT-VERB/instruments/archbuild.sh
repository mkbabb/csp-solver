#!/bin/bash
# archbuild.sh <tree-ish> <name> [VAR=value ...] — extract the tree-ish OUTSIDE any worktree and build it (private cacheDir).
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/verb8/r2
T=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-59
SHA=$1; N=$2; shift 2
X=$S/arch-$N; mkdir -p $X
git -C $T archive $SHA web/frontend csp-solver | tar -x -C $X
ln -s $T/web/frontend/node_modules $X/web/frontend/node_modules
printf "import base from '%s/web/frontend/vite.config.ts'\nexport default { ...base, cacheDir: '%s/vcache-arch-%s' }\n" $X $S $N > $S/vite-arch-$N.mts
(cd $X/web/frontend && env "$@" npx vite build --config $S/vite-arch-$N.mts --outDir $S/dist-arch-$N --emptyOutDir > $S/logs/build-arch-$N.log 2>&1)
echo "ARCH $N $SHA $* BUILD $? $(ls $S/dist-arch-$N/assets | grep -E '^index-.*\.(js|css)$' | tr '\n' ' ') @property $(cat $S/dist-arch-$N/assets/index-*.css | grep -o '@property' | wc -l | tr -d ' ')"
