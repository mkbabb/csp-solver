#!/bin/bash
# run.sh <tag> <engine> <dpr> [grep] — one playwright run of peer-walk.spec.ts, exit recorded.
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_308fa864-c94-1/web/frontend || exit 1
tag=$1 eng=$2 d=$3 g=${4:-}
args=(--config .palwalk6/pw.mts --project $eng)
[ -n "$g" ] && args+=(-g "$g")
PLAYWRIGHT_BASE_URL=${BASE:-http://127.0.0.1:4244} WALK_DPR=$d WALK_OUT=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/palwalk6/tr-$tag-$eng npx playwright test "${args[@]}" > /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/palwalk6/logs/$tag-$eng-dpr$d.log 2>&1
e=$?; echo "EXIT=$e" >> /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/palwalk6/logs/$tag-$eng-dpr$d.log; echo "$tag $eng dpr$d exit $e" >> /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/palwalk6/logs/runs.txt
