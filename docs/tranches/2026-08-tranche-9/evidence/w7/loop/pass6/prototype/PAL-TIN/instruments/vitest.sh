#!/bin/zsh
# PAL-TIN pass 6 · vitest chunked by directory, each exit logged
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_308fa864-c94-2/web/frontend || exit 1
for d in src/games src/pencil src/composables; do
  n=${d//\//-}
  npx vitest run $d > .paltin6/logs/vitest-$n.log 2>&1
  echo "EXIT=$?" >> .paltin6/logs/vitest-$n.log
done
echo done > .paltin6/logs/vitest.done
# F1's NO arm built: SELF_TAKES_A_HAND = false, the session unit file run bare, restored (sha1)
cp src/games/shared/useSession.ts /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/paltin6-bornred/useSession.ts.orig
S0=$(shasum src/games/shared/useSession.ts)
sed -i '' 's/^export const SELF_TAKES_A_HAND: boolean = true;/export const SELF_TAKES_A_HAND: boolean = false;/' src/games/shared/useSession.ts
grep -c 'SELF_TAKES_A_HAND: boolean = false' src/games/shared/useSession.ts > .paltin6/logs/f1-no.log
npx vue-tsc -b >> .paltin6/logs/f1-no.log 2>&1; echo "VUETSC_NO_ARM=$?" >> .paltin6/logs/f1-no.log
npx vitest run src/games/shared/useSession.test.ts >> .paltin6/logs/f1-no.log 2>&1; echo "EXIT=$?" >> .paltin6/logs/f1-no.log
cp /private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/paltin6-bornred/useSession.ts.orig src/games/shared/useSession.ts
[ "$S0" = "$(shasum src/games/shared/useSession.ts)" ] && echo restored-sha1-equal >> .paltin6/logs/f1-no.log
echo done > .paltin6/logs/f1.done
