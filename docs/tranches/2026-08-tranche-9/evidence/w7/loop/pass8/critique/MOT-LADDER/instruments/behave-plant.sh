#!/bin/bash
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/crit-ladder8
for d in bA bB; do
  cd $S/$d/web/frontend
  npx vite preview --config $S/vite-$d.mts --outDir $S/dist-$d --host 127.0.0.1 --port 4246 --strictPort > $S/serve-$d.log 2>&1 &
  W=$!; echo "$d wrapper $W" >> $S/pids.txt
  for i in 1 2 3 4 5 6 7 8 9 10; do curl -s http://127.0.0.1:4246/ | grep -q index- && break; sleep 1; done
  L=$(lsof -nP -iTCP:4246 -sTCP:LISTEN -t); echo "$d listener $L id $(curl -s http://127.0.0.1:4246/ | grep -o 'index-[A-Za-z0-9_-]*\.js')" >> $S/pids.txt
  cd $S/btree/web/frontend
  C8_ARM=$d C8_OUT=$S/behave.jsonl PLAYWRIGHT_BASE_URL=http://127.0.0.1:4246 npx playwright test --config $S/spec/pw.config.mjs > $S/behave-$d.log 2>&1
  echo "$d exit $?" >> $S/behave.out
  CWD=$(lsof -a -p $L -d cwd -Fn | tail -1)
  case "$CWD" in n$S/$d/*) kill $L $W; echo "$d killed $L $W" >> $S/pids.txt;; *) echo "$d NOT KILLED cwd $CWD" >> $S/pids.txt;; esac
  sleep 2
done
echo DONE2 >> $S/behave.out
