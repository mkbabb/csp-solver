#!/bin/bash
cd $WORKTREES/wf_308fa864-c94-2/web/frontend || exit 9
echo "load $(uptime)"
npx vite build --config $SCRATCH/cfg/vite.lane.mts --outDir $SCRATCH/dist-tree --emptyOutDir > $SCRATCH/logs/build-lane.vite.log 2>&1
echo $? > $SCRATCH/logs/build-lane.exit
echo "BUILD EXIT=$(cat $SCRATCH/logs/build-lane.exit) $(date)"; grep -o 'index-[A-Za-z0-9_-]*\.js' $SCRATCH/dist-tree/index.html
