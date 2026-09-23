#!/bin/zsh
# usage: build.sh <outDir> <log>
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_3b66f064-970-16/web/frontend
npx vite build --config /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_3b66f064-970-16/web/frontend/.intake/build.mts --outDir "$1" --logLevel warn > "$2" 2>&1
echo "EXIT $?" >> "$2"
