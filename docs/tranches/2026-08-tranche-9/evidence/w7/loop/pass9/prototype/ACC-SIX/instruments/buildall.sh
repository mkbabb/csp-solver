#!/bin/bash
# ACC-SIX pass 9: build the tree once per plant; exits written per plant; no rm, no set -e
S=<SCRATCH>
cd <TREE>/web/frontend
for p in "$@"; do
  if [ -d $S/dist-$p ]; then mkdir -p $S/trash/dist-old; mv $S/dist-$p $S/trash/dist-old/dist-$p-$(date +%s); fi
  echo "build $p start $(date +%T) load $(uptime | sed 's/.*averages: //')"
  PLANT=$p npx vite build --config $S/build.mts > $S/build-$p.log 2>&1
  echo $? > $S/build-$p.exit
  echo "build $p exit $(cat $S/build-$p.exit) $(ls $S/dist-$p/assets 2>/dev/null | grep '^index-.*\.js$')"
done
echo BUILD-DONE
