S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/crit-MOT-LADDER
CT=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-control/web/frontend
L=$S/logs/behave; mkdir -p $L; OUT=$L/behave.jsonl; X=$L/exits.txt; P=$L/pids.txt
serve() { # arm cwd port outdir config
  cd $2; npx vite preview --config $5 --outDir $4 --host 127.0.0.1 --port $3 --strictPort > $L/serve-$1.log 2>&1 &
  WR=$!; echo "$1 wrapper $WR" >> $P
  for i in $(seq 1 90); do curl -s http://127.0.0.1:$3/ | grep -q 'index-' && break; sleep 1; done
  LI=$(lsof -nP -iTCP:$3 -sTCP:LISTEN -t | head -1); echo "$1 listener $LI cwd $(lsof -a -p $LI -d cwd -Fn | tail -1) id $(curl -s http://127.0.0.1:$3/ | grep -o 'index-[A-Za-z0-9_-]*\.js')" >> $P
}
kill_own() { # arm port cwdprefix
  LI=$(grep "^$1 listener" $P | tail -1 | awk "{print \$3}"); WR=$(grep "^$1 wrapper" $P | tail -1 | awk "{print \$3}")
  CWD=$(lsof -a -p $LI -d cwd -Fn | tail -1)
  case "$CWD" in n$3*) kill $LI $WR; echo "$1 killed $LI $WR" >> $P;; *) echo "$1 NOT KILLED cwd $CWD" >> $P;; esac
}
run() { # arm port
  echo "$1 load-open $(sysctl -n vm.loadavg)" >> $X
  (cd $S/btree/web/frontend && CL9_ARM=$1 CL9_OUT=$OUT PLAYWRIGHT_BASE_URL=http://127.0.0.1:$2 npx playwright test --config $S/spec/pw.config.mjs > $L/behave-$1.log 2>&1; echo "$1 spec-exit $? load-close $(sysctl -n vm.loadavg)" >> $X)
}
serve control $CT 4247 dist .vite-control.config.ts; [ -n "$NOCTL" ] || run control 4247
for d in ${ARMS:-btree bc1 bc17 bc3}; do
  serve $d $S/$d/web/frontend 4246 $S/dist-$d .vite-critl9.config.mts; run $d 4246; kill_own $d 4246 $S/$d; sleep 2
done
kill_own control 4247 $CT
echo BEHAVE-DONE >> $X
