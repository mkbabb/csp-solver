#!/bin/bash
# NOTE-LEDGER pass 6 — charter row 7: the wire probe on the tree's DEV server (:4243) with the token
# at STEP, then at HOLD, and on the control's DEV server (:4242, root = the read-only control, its
# cacheDir in the lane scratch). GameBoard.vue is flipped in place and restored by sha1 (cp, never
# rm). Servers killed by RECORDED PID (the npx wrapper and the listener).
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-46/web/frontend
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/ledger6b/wire
mkdir -p $S; cd $W
F=src/games/shared/GameBoard.vue; SHA=$(shasum $F | cut -d' ' -f1); cp $F $S/gb.vue
flip() { sed -i '' "s/^const LEDGER_FULFILLED = \"[a-z]*\" as/const LEDGER_FULFILLED = \"$1\" as/" $F; grep -q "const LEDGER_FULFILLED = \"$1\" as" $F && echo "token=$1" || echo "FLIP FAILED $1"; }
serve() { # name port config
  nohup npx vite --config $3 --host 127.0.0.1 --port $2 --strictPort > $S/srv-$1.log 2>&1 &
  echo $! > $S/srv-$1.pid
  for i in $(seq 1 90); do curl -s http://127.0.0.1:$2/ | grep -q '<div id="app"' && break; sleep 1; done
  lsof -nP -iTCP:$2 -sTCP:LISTEN -t > $S/srv-$1.lpid
  echo "$1 :$2 pid $(cat $S/srv-$1.pid) listener $(cat $S/srv-$1.lpid) cwd $(lsof -a -p $(cat $S/srv-$1.lpid) -d cwd -Fn | grep ^n)"
}
for p in 4242 4243; do lsof -nP -iTCP:$p -sTCP:LISTEN -t >/dev/null && { echo "PORT $p HELD"; exit 3; }; done
flip step
serve proto 4243 .note-ledger/vite.dev.mts
serve control 4242 .note-ledger/vite.ctrl-dev.mts
DEV_URL=http://127.0.0.1:4243 TAG=step npx playwright test --config .note-ledger/pw.wire.config.ts > $S/pw-step.log 2>&1; echo "step exit=$? $(grep -cE '✓|ok ' $S/pw-step.log) passed-lines"
DEV_URL=http://127.0.0.1:4242 TAG=control npx playwright test --config .note-ledger/pw.wire.config.ts > $S/pw-control.log 2>&1; echo "control exit=$? $(grep -cE '✓|ok ' $S/pw-control.log) passed-lines"
flip hold; sleep 3
DEV_URL=http://127.0.0.1:4243 TAG=hold npx playwright test --config .note-ledger/pw.wire.config.ts > $S/pw-hold.log 2>&1; echo "hold exit=$? $(grep -cE '✓|ok ' $S/pw-hold.log) passed-lines"
for n in proto control; do kill $(cat $S/srv-$n.lpid) $(cat $S/srv-$n.pid) 2>/dev/null; done
sleep 2; for p in 4242 4243; do lsof -nP -iTCP:$p -sTCP:LISTEN -t >/dev/null && echo "PORT $p STILL HELD" || echo "port $p free"; done
cp $S/gb.vue $F; [ "$(shasum $F | cut -d' ' -f1)" = "$SHA" ] && echo "RESTORED sha1 $SHA" || echo "RESTORE MISMATCH"
echo WIRE-DONE
