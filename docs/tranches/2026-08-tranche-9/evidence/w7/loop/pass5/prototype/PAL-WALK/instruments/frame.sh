#!/bin/zsh
# one frame run: frame.sh <mode> <tag> <base> <engine> <dpr> [extra env as K=V ...]
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_308fa864-c94-1/web/frontend || exit 1
mode=$1 tag=$2 base=$3 eng=$4 d=$5; shift 5
env "$@" FRAME_MODE=$mode FRAME_TAG=$tag FRAME_OUT=$PWD/.palwalk5/frames PLAYWRIGHT_BASE_URL=$base WALK_DPR=$d WALK_DIR=./inst WALK_MATCH='frames\.spec\.ts$' \
  WALK_OUT=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/palwalk5/tr-frame-$tag \
  npx playwright test --config .palwalk5/pw.mts --project $eng > .palwalk5/logs/frame-$tag-$eng.log 2>&1
e=$?; echo "EXIT=$e" >> .palwalk5/logs/frame-$tag-$eng.log; grep FRAME .palwalk5/logs/frame-$tag-$eng.log; echo "frame $tag $eng exit $e"
