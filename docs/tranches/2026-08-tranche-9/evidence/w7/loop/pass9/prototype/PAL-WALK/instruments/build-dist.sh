#!/bin/bash
# Build my tree's dist OUT OF TREE: the temp-index tree archived, node_modules symlinked, a private cacheDir.
S=<lane-scratch>
R=<repo>/.claude/worktrees/wf_308fa864-c94-1
B=$S/build-$1
[ -e $B ] && mv $B $S/trash/build-$1-$(date +%s)
mkdir -p $B
export GIT_INDEX_FILE=$S/idx.build
git -C $R read-tree HEAD; (cd $R && git add -A web/frontend .github)
for p in $(git -C $R diff --cached --name-only HEAD | grep '/\.'); do git -C $R rm -q --cached "$p"; done
T=$(git -C $R write-tree); echo "tree $T" > $B/TREE
git -C $R archive $T web/frontend | tar -x -C $B
ln -sfn <repo>/web/frontend/node_modules $B/web/frontend/node_modules
printf "import base from './vite.config.ts'\nexport default { ...base, cacheDir: '%s/vite-cache-build-%s' }\n" "$S" "$1" > $B/web/frontend/.vite-b.mts
cd $B/web/frontend && npx vite build --config .vite-b.mts > $S/logs/build-$1.log 2>&1
echo "exit=$?" > $S/logs/build-$1.exit
