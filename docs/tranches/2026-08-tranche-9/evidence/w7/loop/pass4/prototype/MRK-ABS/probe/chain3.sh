#!/bin/zsh
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-39/web/frontend
S=.p4-mrkabs
ARM=one npx playwright test -c $S/pw.config.ts $S/p4-census.spec.ts -g "G-ABS-4" > $S/routes-final.log 2>&1; echo "EXIT $?" >> $S/routes-final.log
npx vite build --config $S/vite.build.mts --outDir $S/dist --emptyOutDir > $S/build.log 2>&1; echo "EXIT $?" >> $S/build.log
npx vite preview --config $S/vite.build.mts --outDir $S/dist --host 127.0.0.1 --port 4241 --strictPort > $S/preview.log 2>&1 &
echo $! > $S/preview.pid; sleep 4
curl -s http://127.0.0.1:4241/ | grep -o "index-[A-Za-z0-9_-]*\.js" > $S/preview.hash; ls $S/dist/assets | grep "^index-.*\.js$" >> $S/preview.hash
npx playwright test -c $S/pw.filter.config.ts > $S/filter.log 2>&1; echo "EXIT $?" >> $S/filter.log
lsof -nP -iTCP:4241 -sTCP:LISTEN | awk 'NR>1{print $2}' > $S/preview.listen.pid
echo CHAIN3-DONE >> $S/filter.log
