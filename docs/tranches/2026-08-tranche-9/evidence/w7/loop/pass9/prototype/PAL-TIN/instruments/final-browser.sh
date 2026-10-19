#!/bin/bash
# PAL-TIN pass 9 · the browser rows on the FINAL spec bytes: clean tree §2b/§2c DPR 1 + DPR 2 both engines, the filter
# census on tree and control (chromium), then the .pcss build swapped onto :4245 for the born-RED, then the clean tree
# served back. A server is killed only by the PID this script recorded, after its cwd is checked. No rm, no set -e.
S=$SCRATCH
FE=$WORKTREES/wf_308fa864-c94-2/web/frontend
L=$S/logs/final-browser.txt
echo "spec $(shasum $FE/e2e/peer-tin.spec.ts | cut -c1-8) · start $(date +%T) · load $(uptime | sed 's/.*averages*: //')" > $L
$S/spec.sh 1 fin; $S/spec.sh 2 fin
for e in chromium webkit; do for d in 1 2; do echo "fin $e dpr$d: $(grep -E '^EXIT' $S/logs/spec-fin-$e-dpr$d.log)" >> $L; done; done
TIN_MATCH='filter-census\.spec\.ts$' ENGINES=chromium $S/spec.sh 1 census-tree
TIN_MATCH='filter-census\.spec\.ts$' ENGINES=chromium BASE=http://127.0.0.1:4239 $S/spec.sh 1 census-control
echo "census tree: $(grep -E '^EXIT' $S/logs/spec-census-tree-chromium-dpr1.log) · control: $(grep -E '^EXIT' $S/logs/spec-census-control-chromium-dpr1.log)" >> $L
swap() { local dist=$1 tag=$2; local pid=$(lsof -nP -t -iTCP:4245 -sTCP:LISTEN 2>/dev/null); local cwd=$(lsof -a -p $pid -d cwd -Fn 2>/dev/null | grep ^n | cut -c2-)
  if [ "$cwd" = "$FE" ]; then kill $pid; echo "stopped :4245 pid $pid (cwd ours)" >> $L; else echo "REFUSED: :4245 pid $pid cwd $cwd is not ours" >> $L; return 1; fi
  for i in 1 2 3 4 5 6 7 8 9 10; do lsof -nP -t -iTCP:4245 -sTCP:LISTEN >/dev/null 2>&1 || break; sleep 1; done
  (cd $FE && nohup npx vite preview --config $S/cfg/vite.preview.mts --outDir $dist --host 127.0.0.1 --port 4245 --strictPort > $S/logs/serve-$tag.log 2>&1 &)
  for i in $(seq 1 60); do curl -s http://127.0.0.1:4245/ | grep -q 'index-' && break; sleep 1; done
  echo ":4245 now $tag pid $(lsof -nP -t -iTCP:4245 -sTCP:LISTEN) serves $(curl -s http://127.0.0.1:4245/ | grep -o 'index-[A-Za-z0-9_-]*\.js')" >> $L; }
swap $S/dist-pcss pcss-fin && $S/spec.sh 1 born-fin '§2[bc]'
for e in chromium webkit; do echo "born-fin $e dpr1: $(grep -E '^EXIT' $S/logs/spec-born-fin-$e-dpr1.log)" >> $L; done
swap $S/dist-tree tree-fin
echo "end $(date +%T)" >> $L; echo done > $S/logs/final-browser.done
