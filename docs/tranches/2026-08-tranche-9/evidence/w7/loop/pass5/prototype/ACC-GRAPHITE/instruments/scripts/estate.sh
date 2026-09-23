#!/bin/bash
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-40/web/frontend
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/accg5
until grep -q ALLDONE $S/batch3.done; do sleep 5; done
: > $S/estate.tsv
spec() { name=$1; dir=$2; base=$3; match=$4; to=$5; for proj in chromium webkit; do TESTDIR=$dir PLAYWRIGHT_BASE_URL=$base MATCH=$match TIMEOUT=$to PWOUT=$S/pw-$name-$proj npx playwright test --config .accg5/pw.estate.config.ts --project $proj > $S/estate-$name-$proj.log 2>&1; echo -e "$name\t$proj\t$?\t$(grep -E '[0-9]+ (passed|failed|skipped|flaky)' $S/estate-$name-$proj.log | tr -s ' ' | tr '\n' ' ')" >> $S/estate.tsv; done; }
spec vr-tree /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-40/web/frontend/e2e http://127.0.0.1:4237 'visual-regression\.spec\.ts$' 30000
spec vr-ctrl /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-control/web/frontend/e2e http://127.0.0.1:4236 'visual-regression\.spec\.ts$' 30000
spec fc-tree /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-40/web/frontend/e2e http://127.0.0.1:4237 'filter-census\.spec\.ts$' 90000
spec fc-ctrl /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-control/web/frontend/e2e http://127.0.0.1:4236 'filter-census\.spec\.ts$' 90000
spec fc-treegate-on-ctrl /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-40/web/frontend/e2e http://127.0.0.1:4236 'filter-census\.spec\.ts$' 90000
spec mp-tree /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-40/web/frontend/e2e http://127.0.0.1:4235 'multiplayer\.spec\.ts$' 30000
spec mp-ctrl /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-control/web/frontend/e2e http://127.0.0.1:4238 'multiplayer\.spec\.ts$' 30000
echo ALLDONE >> $S/estate.tsv
