#!/bin/bash
# behave.sh : the reveal's computed duration, both engines x 1440/390, on control / tree / K7r. Servers killed by recorded PID after a cwd check.
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass9/MOT-LADDER
CT=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-control/web/frontend
L=$S/logs/behave; mkdir -p $L; OUT=$L/behave.jsonl; X=$L/exits.txt; P=$L/pids.txt
waitload() { for i in $(seq 1 30); do l=$(sysctl -n vm.loadavg | awk '{print $2}'); awk "BEGIN{exit !($l < 120)}" && { echo "$1 load-at-open $l" >> $X; return 0; }; sleep 60; done; echo "$1 load-never-under-120 $l" >> $X; return 1; }
serve() { # $1 arm $2 cwd $3 port $4 outdir $5 config
  cd $2; npx vite preview --config $5 --outDir $4 --host 127.0.0.1 --port $3 --strictPort > $L/serve-$1.log 2>&1 &
  WR=$!; echo "$1 wrapper $WR" >> $P
  for i in $(seq 1 60); do curl -s http://127.0.0.1:$3/ | grep -q 'index-' && break; sleep 1; done
  LI=$(lsof -nP -iTCP:$3 -sTCP:LISTEN -t | head -1); echo "$1 listener $LI cwd $(lsof -a -p $LI -d cwd -Fn | tail -1) id $(curl -s http://127.0.0.1:$3/ | grep -o 'index-[A-Za-z0-9_-]*\.js')" >> $P
}
kill_own() { # $1 arm $2 port $3 expected-cwd-prefix
  LI=$(lsof -nP -iTCP:$2 -sTCP:LISTEN -t | head -1); WR=$(grep "^$1 wrapper" $P | awk '{print $3}')
  CWD=$(lsof -a -p $LI -d cwd -Fn | tail -1)
  case "$CWD" in n$3*) kill $LI $WR; echo "$1 killed $LI $WR" >> $P;; *) echo "$1 NOT KILLED cwd $CWD" >> $P;; esac
}
run() { # $1 arm $2 port
  waitload $1
  (cd $S/bt/web/frontend && L9_ARM=$1 L9_OUT=$OUT PLAYWRIGHT_BASE_URL=http://127.0.0.1:$2 npx playwright test --config $S/spec/pw.config.mjs > $L/behave-$1.log 2>&1; echo "$1 spec-exit $? load-at-close $(sysctl -n vm.loadavg)" >> $X)
}
serve control $CT 4247 dist .vite-control.config.ts; run control 4247; kill_own control 4247 $CT
serve tree $S/bt/web/frontend 4246 $S/dist-bt .vite-ladder9.config.mts; run tree 4246; kill_own tree 4246 $S/bt
sleep 2
serve k7r $S/bk7/web/frontend 4246 $S/dist-bk7 .vite-ladder9.config.mts; run k7r 4246; kill_own k7r 4246 $S/bk7
echo BEHAVE-DONE >> $X
