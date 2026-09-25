#!/bin/bash
# the tree's DEV server on :4249 (private cacheDir outside the root) beside the control's pre-built dist on :4248
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-46/web/frontend
C=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-control/web/frontend
LOG=$S/ledger7-logs/probe-tree.log; : > $LOG
(cd $W && exec npx vite --config .note-ledger7/dev.mts --host 127.0.0.1 --port 4249 --strictPort > $S/ledger7-logs/serve-tree-dev.log 2>&1) & WT=$!
(cd $C && exec npx vite preview --config .vite-control.config.ts --outDir dist --host 127.0.0.1 --port 4248 --strictPort > $S/ledger7-logs/serve-ctrl.log 2>&1) & WC=$!
for i in $(seq 1 90); do LT=$(lsof -nP -iTCP:4249 -sTCP:LISTEN -t | head -1); LC=$(lsof -nP -iTCP:4248 -sTCP:LISTEN -t | head -1); [ -n "$LT" ] && [ -n "$LC" ] && break; sleep 0.5; done
echo "tree dev wrapper $WT listener $LT · control wrapper $WC listener $LC" >> $LOG
echo "control serves $(curl -s http://127.0.0.1:4248/ | grep -o 'index-[A-Za-z0-9_-]*\.js' | head -1)" >> $LOG
curl -s http://127.0.0.1:4249/ > /dev/null
for eng in chromium webkit; do
  node $S/ledger7-probe/ledger7.mjs $eng tree-dev http://127.0.0.1:4249 dev sixteen,land,reserve >> $LOG 2>&1; echo "probe tree $eng exit=$?" >> $LOG
  node $S/ledger7-probe/ledger7.mjs $eng control http://127.0.0.1:4248 index-CubiZsMVSwTc.js sixteen,reserve >> $LOG 2>&1; echo "probe control $eng exit=$?" >> $LOG
done
kill $LT $LC 2>/dev/null; kill $WT $WC 2>/dev/null; sleep 1
for p in 4248 4249; do lsof -nP -iTCP:$p -sTCP:LISTEN -t >/dev/null && echo "PORT $p STILL HELD" >> $LOG; done
echo RUN-DONE >> $LOG
