#!/bin/bash
# serve.sh <plant> : serve dist-<plant> on 4237 after stopping ONLY this critic's recorded 4237 listener; assert identity
S=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/acc6-crit8
if [ -f $S/pid-4237 ]; then old=$(cat $S/pid-4237); lp=$(lsof -nP -tiTCP:4237 -sTCP:LISTEN); if [ -n "$lp" ]; then cwd=$(lsof -a -p $lp -d cwd -Fn | grep '^n' | cut -c2-); case "$cwd" in $S/base/web/frontend) kill $lp; kill $old 2>/dev/null; sleep 1;; *) echo "HELD-BY-SIBLING $lp $cwd"; exit 2;; esac; fi; fi
lp=$(lsof -nP -tiTCP:4237 -sTCP:LISTEN); [ -n "$lp" ] && { echo "HELD $lp"; exit 2; }
want=$(ls $S/dist-$1/assets | grep -E '^index-.*\.js$')
cd $S/base/web/frontend
PLANT=none nohup npx vite preview --config $S/cfg/build.mts --outDir $S/dist-$1 --host 127.0.0.1 --port 4237 --strictPort > $S/logs/serve-$1.log 2>&1 &
echo $! > $S/pid-4237
for i in $(seq 1 40); do got=$(curl -s http://127.0.0.1:4237/ | grep -o 'index-[A-Za-z0-9_-]*\.js' | head -1); [ "$got" = "$want" ] && { echo "SERVING $1 $got"; exit 0; }; sleep 1; done
echo "SERVE-FAILED $1 want $want got $got"; exit 1
