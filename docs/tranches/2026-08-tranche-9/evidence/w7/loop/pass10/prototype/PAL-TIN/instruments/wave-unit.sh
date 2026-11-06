#!/bin/bash
# PAL-TIN pass 10 · the union's useSession unit file, before (the WAVE's own useSession) and after the wash cure
S=${SCRATCH:?set SCRATCH to the lane scratch dir}
W=$S/wave10/web/frontend; cd $W || exit 9
cp src/games/shared/useSession.ts $S/trash/wave10.useSession.cured.ts
cp $S/trash/wave10.useSession.orig.ts src/games/shared/useSession.ts
npx vitest run --maxWorkers=2 src/games/shared/useSession.test.ts src/games/shared/BoardHost.authors.test.ts > $S/logs/wave-unit-before.log 2>&1; echo "before exit $?" > $S/logs/wave-unit.txt
cp $S/trash/wave10.useSession.cured.ts src/games/shared/useSession.ts
npx vitest run --maxWorkers=2 src/games/shared/useSession.test.ts src/games/shared/BoardHost.authors.test.ts > $S/logs/wave-unit-after.log 2>&1; echo "after exit $?" >> $S/logs/wave-unit.txt
echo DONE >> $S/logs/wave-unit.txt
