#!/bin/bash
# cy2.sh: the NEW count-yield (SEAT + legs at laid) on the union, the tree, the tree plants, the union plants. no rm, no set -e
S=<SCRATCH>
gate() { for i in $(seq 1 120); do l=$(uptime | sed 's/.*averages: //' | cut -d' ' -f1 | cut -d. -f1); [ "$l" -lt 60 ] && return; echo "wait load $l"; sleep 15; done; }
echo "BUILD union plants $(date +%T)"
cd $S/union/web/frontend
for p in noro overyield; do
  GIT_CEILING_DIRECTORIES=$S PLANT=$p npx vite build --config $S/union-plant-build.mts > $S/logs/ubuild-$p.log 2>&1; echo "ubuild $p exit $? $(ls $S/dist-u-$p/assets | grep '^index-.*\.js$')"
done
gate; $S/serve.sh union; $S/uspec.sh U-cy2 count-yield.spec.ts; $S/stop.sh tree
gate; $S/serve.sh none; $S/spec.sh T-cy2 count-yield.spec.ts; $S/stop.sh tree
for p in noro overyield late150; do gate; $S/serve.sh $p; $S/spec.sh P-cy2-$p count-yield.spec.ts; $S/stop.sh tree; done
for p in noro overyield; do
  gate; cd $S/union/web/frontend
  nohup env GIT_CEILING_DIRECTORIES=$S PLANT=$p npx vite preview --config $S/union-plant-build.mts --outDir $S/dist-u-$p --host 127.0.0.1 --port 4237 --strictPort > $S/serve-u-$p.log 2>&1 &
  echo $! > $S/serve-tree.pid
  for i in $(seq 1 60); do curl -s --max-time 3 http://127.0.0.1:4237/ | grep -q 'index-' && break; sleep 1; done
  echo "serve u-$p served $(curl -s http://127.0.0.1:4237/ | grep -o 'index-[A-Za-z0-9_-]*\.js' | head -1) want $(ls $S/dist-u-$p/assets | grep '^index-.*\.js$')"
  $S/uspec.sh U-cy2-$p count-yield.spec.ts; $S/stop.sh tree
done
echo "CY2-DONE $(date +%T)"
