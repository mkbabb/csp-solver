#!/bin/bash
# serve each built arm on :4249 (prod preview), verify by asset hash, run the probe in both engines, kill by recorded PID
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad
T=$S/ledger7-unionEL/web/frontend; LOG=$S/ledger7-logs/probe-arms.log
export PANELS=$S/ledger7-panels
PORT=4249
serve() { # $1 dist dir
  (cd $T && exec npx vite preview --config .ledger7/build.mts --outDir $1 --host 127.0.0.1 --port $PORT --strictPort > $S/ledger7-logs/serve-$PORT.log 2>&1) &
  WRAP=$!
  for i in $(seq 1 60); do L=$(lsof -nP -iTCP:$PORT -sTCP:LISTEN -t 2>/dev/null | head -1); [ -n "$L" ] && break; sleep 0.5; done
  echo "serve $1 wrapper $WRAP listener $L" >> $LOG
}
kill_srv() { [ -n "$L" ] && kill $L 2>/dev/null; kill $WRAP 2>/dev/null; sleep 1; lsof -nP -iTCP:$PORT -sTCP:LISTEN -t >/dev/null 2>&1 && echo "PORT $PORT STILL HELD" >> $LOG; L=; }
for spec in ${SPECS:-"hold:settle,frames,glyph,swap" "age:settle,frames" "step:settle,frames" "tint:settle,frames,glyph" "fence:swap" "union-hold:swap"}; do
  arm=${spec%%:*}; modes=${spec#*:}
  dist=$S/ledger7-dists/$arm; id=$(ls $dist/assets | grep -E '^index-.*\.js$')
  serve $dist
  got=$(curl -s http://127.0.0.1:$PORT/ | grep -o 'index-[A-Za-z0-9_-]*\.js' | head -1)
  echo "== $arm id=$id served=$got" >> $LOG
  if [ "$got" = "$id" ]; then
    for eng in chromium webkit; do node $S/ledger7-probe/ledger7.mjs $eng $arm http://127.0.0.1:$PORT $id $modes >> $LOG 2>&1; echo "probe $arm $eng exit=$?" >> $LOG; done
  else echo "IDENTITY MISMATCH, skipped" >> $LOG; fi
  kill_srv
done
echo RUN-DONE >> $LOG
