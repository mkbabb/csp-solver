#!/bin/bash
# serve.sh <plant|control> : start a preview server detached, record its PID, assert served identity. no rm, no set -e
S=<SCRATCH>
p=$1
if [ "$p" = control ]; then
  port=4250; cd <CONTROL>/web/frontend
  nohup npx vite preview --config .vite-control.config.ts --outDir dist --host 127.0.0.1 --port 4250 --strictPort > $S/serve-control.log 2>&1 &
  echo $! > $S/serve-control.pid; want=$(ls dist/assets | grep '^index-.*\.js$')
elif [ "${p%%-*}" = dev ]; then
  # dev-<plant>: the tree's DEV server (the G10-panel and D10 rows import /src/ modules), private cacheDir
  port=4237; cd <TREE>/web/frontend
  nohup env PLANT=${p#dev-} npx vite --config $S/build.mts --host 127.0.0.1 --port 4237 --strictPort > $S/serve-$p.log 2>&1 &
  echo $! > $S/serve-tree.pid
  for i in $(seq 1 90); do curl -s --max-time 3 http://127.0.0.1:4237/src/pencil/grid/gridPaths.ts | grep -q FRONT_MIN_MS && break; sleep 1; done
  echo "serve $p port 4237 pid $(cat $S/serve-tree.pid) dev $(curl -s --max-time 3 http://127.0.0.1:4237/src/pencil/grid/gridPaths.ts | grep -o 'FRONT_MIN_MS = [^;]*' | head -1)"; exit 0
elif [ "$p" = union ]; then
  port=4237; cd $S/union/web/frontend
  nohup env GIT_CEILING_DIRECTORIES=$S npx vite preview --config $S/union-build.mts --outDir $S/dist-union --host 127.0.0.1 --port 4237 --strictPort > $S/serve-union.log 2>&1 &
  echo $! > $S/serve-tree.pid; want=$(ls $S/dist-union/assets | grep '^index-.*\.js$')
else
  port=4237; cd <TREE>/web/frontend
  nohup env PLANT=$p npx vite preview --config $S/build.mts --outDir $S/dist-$p --host 127.0.0.1 --port 4237 --strictPort > $S/serve-$p.log 2>&1 &
  echo $! > $S/serve-tree.pid; want=$(ls $S/dist-$p/assets | grep '^index-.*\.js$')
fi
for i in $(seq 1 60); do
  got=$(curl -s --max-time 3 http://127.0.0.1:$port/ | grep -o 'index-[A-Za-z0-9_-]*\.js' | head -1)
  [ -n "$got" ] && break; sleep 1
done
echo "serve $p port $port pid $(cat $S/serve-$([ $p = control ] && echo control || echo tree).pid) served $got want $want $([ "$got" = "$want" ] && echo IDENTITY-OK || echo IDENTITY-FAIL)"
