#!/bin/bash
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/crit-ladder8
cd $S/btree/web/frontend
npx vite preview --config $S/vite-btree.mts --outDir $S/dist-btree --host 127.0.0.1 --port 4246 --strictPort > $S/serve-tree2.log 2>&1 &
W=$!
for i in 1 2 3 4 5 6 7 8 9 10; do curl -s http://127.0.0.1:4246/ | grep -q index- && break; sleep 1; done
L=$(lsof -nP -iTCP:4246 -sTCP:LISTEN -t); echo "tree2 wrapper $W listener $L id $(curl -s http://127.0.0.1:4246/ | grep -o 'index-[A-Za-z0-9_-]*\.js')" >> $S/pids.txt
for arm in tree:4246 control:4250; do a=${arm%%:*}; p=${arm##*:}
  PLAYWRIGHT_BASE_URL=http://127.0.0.1:$p npx playwright test --config $S/spec/pw-e2e.config.mjs > $S/gc1-$a.log 2>&1; echo "$a exit $?" >> $S/gc1.out
done
CWD=$(lsof -a -p $L -d cwd -Fn | tail -1)
case "$CWD" in n$S/btree/*) kill $L $W; echo "tree2 killed $L $W" >> $S/pids.txt;; *) echo "tree2 NOT KILLED $CWD" >> $S/pids.txt;; esac
echo DONE >> $S/gc1.out
