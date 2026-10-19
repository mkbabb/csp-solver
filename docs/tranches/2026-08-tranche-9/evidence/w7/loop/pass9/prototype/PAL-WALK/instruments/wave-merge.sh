#!/bin/bash
# Build the on-WAVE tree: archive of acde977b (WAVE union + homes v2 on-WAVE), then 3-way merge every
# NON-HOME path of my tree's diff vs 74a2b5d9 onto it (base 74a2b5d9, ours = union, theirs = my tree).
S=<lane-scratch>
R=<repo>/.claude/worktrees/wf_308fa864-c94-1
T=$S/wave-tree-$1
[ -e $T ] && mv $T $S/trash/wave-tree-$1-$(date +%s)
mkdir -p $T $S/merge-$1
git -C $R archive acde977b | tar -x -C $T
ln -sfn <repo>/web/frontend/node_modules $T/web/frontend/node_modules
HOMES='^web/frontend/(e2e/lib/(edge-bands|glyph-pop|paint-lib|postpaint|rest-probes)\.(mjs|d\.mts)|scripts/shape-census\.(mjs|d\.mts)|knip\.json)$'
export GIT_INDEX_FILE=$S/idx.mine
git -C $R read-tree HEAD; (cd $R && git add -A web/frontend .github 2>/dev/null)
for p in $(git -C $R diff --cached --name-only HEAD); do
  if echo "$p" | grep -Eq "$HOMES"; then echo "HOME $p (union's homes v2 kept)"; continue; fi
  case "$p" in */.*) echo "SKIP dot $p"; continue;; esac
  mkdir -p "$(dirname $T/$p)"
  if git -C $R cat-file -e 74a2b5d9:"$p" 2>/dev/null; then
    git -C $R show 74a2b5d9:"$p" > $S/merge-$1/base
    cp "$T/$p" $S/merge-$1/ours
    cp "$R/$p" $S/merge-$1/theirs
    git merge-file -p $S/merge-$1/ours $S/merge-$1/base $S/merge-$1/theirs > $S/merge-$1/out; c=$?
    cp $S/merge-$1/out "$T/$p"; echo "MERGE $p conflicts=$c"
  else
    if [ -e "$T/$p" ]; then echo "ADDBOTH $p"; else echo "ADD $p"; fi
    cp "$R/$p" "$T/$p"
  fi
done
