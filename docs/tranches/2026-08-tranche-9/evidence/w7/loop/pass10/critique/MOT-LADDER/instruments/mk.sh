#!/bin/zsh
# mk.sh <treeish> <dir> : git archive copy with its own .git (no commit)
WT=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-59
mkdir -p "$2" || exit 2
git -C $WT archive "$1" -- web .github .gitignore README.md | tar -x -C "$2" || exit 3
cd "$2" && git init -q && git add -A -f && echo "mk $1 -> $2 gitdir $(git rev-parse --absolute-git-dir) web=$(git write-tree --prefix=web/)"
