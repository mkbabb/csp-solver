#!/bin/zsh
# brun.sh <engine> <build:0|1> <reveal-arms (comma)> <sg-arms (comma)> : ONE guarded browser run. Control on :4247 for the
# whole run; each tree arm served on :4246 in turn; every listener's PID/cwd/identity recorded; killed by PID after a cwd check.
S=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass10/crit-MOT-LADDER
EN=$1; L=$S/logs/browse; mkdir -p $L; P=$L/pids.txt; X=$L/exits.txt
CD=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-control/web/frontend
SGFE=$S/builds/bt/web/frontend
# the arms may be re-read at start from arms.txt (line 1 reveal arms, line 2 sg arms), so a queued run takes the final list
RA=$3; SA=$4; [ -f $S/arms.txt ] && { RA=$(sed -n 1p $S/arms.txt); SA=$(sed -n 2p $S/arms.txt); }
echo "$EN arms reveal=$RA sg=$SA" >> $L/pids.txt
if [ "$2" = 1 ]; then
  $S/bld.sh $S/bank bt; $S/bld.sh $S/l9src l9
  for a in ${(s:,:)RA}; do case $a in p-*) $S/bld.sh $S/bank $a ${a#p-};; esac; done
fi
[ "$2" = 2 ] && { until grep -q BUILDALL-DONE $S/logs/buildall.txt 2>/dev/null; do sleep 5; done; echo "$EN waited for buildall" >> $P; }
z() { tail -1 ~/.claude/guard/log/zone.log | grep -o 'inuse=[0-9]*'; }
for port in 4246 4247; do lsof -nP -iTCP:$port -sTCP:LISTEN -t >/dev/null 2>&1 && { echo "$EN PORT $port HELD (a sibling) — rows not run" >> $P; exit 2; }; done
up() { for i in $(seq 1 90); do curl -s http://127.0.0.1:$1/ | grep -q 'index-' && return 0; sleep 1; done; return 1; }
idof() { curl -s http://127.0.0.1:$1/ | grep -o 'index-[A-Za-z0-9_-]*\.js' | head -1; }
killck() { c=$(lsof -a -p $2 -d cwd -Fn 2>/dev/null | tail -1); case "$c" in n$3*) kill $2; echo "$EN $1 killed listener $2 (cwd $c)" >> $P;; *) echo "$EN $1 NOT KILLED: $2 cwd $c" >> $P;; esac; }
row() { # row <spec> <arm> <port>
  echo "$1 $2 $EN open load $(sysctl -n vm.loadavg) zone $(z) id $(idof $3)" >> $X
  case $1 in
    reveal) (cd $SGFE && CL9_ARM=$2 CL9_OUT=$L/reveal.jsonl CL9_PWOUT=$L/pwout-$1-$2-$EN PLAYWRIGHT_BASE_URL=http://127.0.0.1:$3 npx playwright test --config $S/pw/reveal.config.mjs --project $EN --workers=1 > $L/$1-$2-$EN.log 2>&1); r=$?;;
    sg) (cd $SGFE && SG_FE=$SGFE SG_OUT=$L/pwout-$1-$2-$EN PLAYWRIGHT_BASE_URL=http://127.0.0.1:$3 npx playwright test --config $S/pw/sg.config.mjs --project $EN --workers=1 > $L/$1-$2-$EN.log 2>&1); r=$?;;
  esac
  echo "$1 $2 $EN exit $r close load $(sysctl -n vm.loadavg) zone $(z)" >> $X
}
(cd $CD && exec npx vite preview --config .vite-control.config.ts --outDir dist --host 127.0.0.1 --port 4247 --strictPort > $L/serve-control-$EN.log 2>&1) &
CW=$!; up 4247; CL=$(lsof -nP -iTCP:4247 -sTCP:LISTEN -t | head -1)
echo "$EN control listener $CL cwd $(lsof -a -p $CL -d cwd -Fn | tail -1) id $(idof 4247) css $(ls $CD/dist/assets/index-*.css | xargs wc -c | tail -1)" >> $P
row reveal control 4247
[[ ",$SA," == *,control,* ]] && row sg control 4247
for a in ${(s:,:)RA} ${(s:,:)SA}; do
  [ "$a" = control ] && continue
  [[ " $done " == *" $a "* ]] && continue; done="$done $a"
  AD=$S/builds/$a/web/frontend
  (cd $AD && exec npx vite preview --config .vite-crit.config.ts --outDir dist --host 127.0.0.1 --port 4246 --strictPort > $L/serve-$a-$EN.log 2>&1) &
  TW=$!; up 4246; TL=$(lsof -nP -iTCP:4246 -sTCP:LISTEN -t | head -1)
  echo "$EN $a listener $TL cwd $(lsof -a -p $TL -d cwd -Fn | tail -1) id $(idof 4246) css $(ls $AD/dist/assets/index-*.css | xargs wc -c | tail -1)" >> $P
  [[ ",$RA," == *,$a,* ]] && row reveal $a 4246
  [[ ",$SA," == *,$a,* ]] && row sg $a 4246
  killck $a $TL $AD; kill $TW 2>/dev/null; wait $TW 2>/dev/null; sleep 1
done
killck control $CL $CD; kill $CW 2>/dev/null; wait
echo "$EN ROWS-DONE" >> $P
