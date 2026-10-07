#!/bin/bash
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/verbcrit8
swap() { # kill MY lane listener by recorded pid (cwd checked), serve dist-$1 on 4247
  for p in $(cat $S/lane.pids 2>/dev/null); do
    c=$(lsof -a -p $p -d cwd -Fn 2>/dev/null | grep '^n' | cut -c2-)
    case "$c" in $S/*) kill $p && echo "killed $p ($c)";; *) echo "NOT MINE $p ($c) — left";; esac
  done
  sleep 2
  if lsof -nP -iTCP:4247 -sTCP:LISTEN >/dev/null; then echo "4247 HELD by a sibling — stop"; exit 3; fi
  cd $S/arch/web/frontend && (nohup npx vite preview --config $S/vite-tree.mts --outDir $S/dist-$1 --host 127.0.0.1 --port 4247 --strictPort > $S/logs/serve-4247-$1.log 2>&1 & echo $! > $S/wrap.pid)
  for i in $(seq 1 20); do id=$(curl -s http://127.0.0.1:4247/ | grep -o 'index-[A-Za-z0-9_-]*\.js' | head -1); [ -n "$id" ] && break; sleep 1; done
  L=$(lsof -nP -iTCP:4247 -sTCP:LISTEN -t | head -1); echo "$(cat $S/wrap.pid) $L" > $S/lane.pids
  echo "SERVING $1 on 4247: $id (pids $(cat $S/lane.pids))"
}
swap p7clock
for e in chromium webkit; do W=1 $S/pw.sh p7clock-boot-$e http://127.0.0.1:4247 $e boot-hand.spec.ts; echo "p7clock-boot-$e $(tail -1 $S/logs/pw-p7clock-boot-$e.log)"; done
swap wall
for e in chromium webkit; do W=1 $S/pw.sh wall-boot-$e http://127.0.0.1:4247 $e boot-hand.spec.ts; echo "wall-boot-$e $(tail -1 $S/logs/pw-wall-boot-$e.log)"; done
swap ypad3
for e in chromium webkit; do $S/pw.sh ypad3-frame-$e http://127.0.0.1:4247 $e frame-halfstroke.spec.ts; echo "ypad3-frame-$e $(tail -1 $S/logs/pw-ypad3-frame-$e.log)"; done
swap tree
$S/pw.sh tree-fold-chromium http://127.0.0.1:4247 chromium fold-verb.spec.ts; echo "tree-fold-chromium $(tail -1 $S/logs/pw-tree-fold-chromium.log)"
REPEAT=3 $S/pw.sh tree-fold-webkit http://127.0.0.1:4247 webkit fold-verb.spec.ts; echo "tree-fold-webkit $(tail -1 $S/logs/pw-tree-fold-webkit.log)"
echo BATB-DONE
