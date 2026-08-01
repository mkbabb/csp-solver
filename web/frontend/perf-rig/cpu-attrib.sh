#!/bin/bash
# cpu-attrib.sh <cell> — process-CPU attribution across a fixed ~20s idle window. WebKit splits
# the work: script/style/layout in com.apple.WebKit.WebContent, RASTER (and therefore filter
# execution) in com.apple.WebKit.GPU. The frame curve says which cell is slow; this says WHERE
# the cycles go. Reported as CPU-seconds consumed per process family over one window.
#
# $TAG — appended to the run id and the snapshot files (P-W4), so a re-measure of the SAME cell
# on a second host/dist does not append onto the banked r2 ledger line. $EXTRA and $PORT pass
# through the environment to run-safari.sh untouched.
set -uo pipefail
RIG="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CELL="${1:?usage: cpu-attrib.sh <cell|base>}"
ID="ca-${CELL}${TAG:+-$TAG}"
SC="idle3s,idle3s,idle3s,idle3s,idle3s,idle3s"
snap(){ ps -Ao pid,time,comm | grep -E "WebKit.GPU|WebKit.WebContent|MacOS/Safari" | awk '{print $1"\t"$2"\t"$3}'; }
snap > "/tmp/ca-before-${ID}.txt"
if [ "${CELL}" = "base" ]; then
  KEEP_SAFARI_FRONT=1 TIMEOUT=200 "${RIG}/run-safari.sh" "${ID}" "${SC}" >/dev/null 2>&1
else
  KEEP_SAFARI_FRONT=1 TIMEOUT=200 "${RIG}/run-safari.sh" "${ID}" "${SC}" "${RIG}/ablations/${CELL}.css" >/dev/null 2>&1
fi
snap > "/tmp/ca-after-${ID}.txt"
python3 - "${ID}" <<'PY'
import sys,collections
cell=sys.argv[1]
def load(p):
    d={}
    for l in open(p):
        pid,t,comm=l.rstrip("\n").split("\t")
        parts=t.split(':')
        secs=float(parts[-1]); 
        if len(parts)>1: secs+=float(parts[-2])*60
        if len(parts)>2: secs+=float(parts[-3])*3600
        d[pid]=(secs,comm)
    return d
b=load(f'/tmp/ca-before-{cell}.txt'); a=load(f'/tmp/ca-after-{cell}.txt')
agg=collections.Counter()
for pid,(s,c) in a.items():
    prev=b.get(pid,(0.0,c))[0]
    key='GPU' if 'GPU' in c else ('WebContent' if 'WebContent' in c else 'Safari')
    agg[key]+=max(0.0,s-prev)
print(f"{cell}\tGPU {agg['GPU']:.2f}s\tWebContent {agg['WebContent']:.2f}s\tSafari {agg['Safari']:.2f}s")
PY
