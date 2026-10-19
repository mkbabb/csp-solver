#!/bin/bash
cd $SCRATCH/rep2/web/frontend || exit 9
echo "load $(uptime)"
npx vite build --config $SCRATCH/cfg/vite.rep2.mts --outDir $SCRATCH/dist-pcss3 --emptyOutDir > $SCRATCH/logs/build-pcss3.vite.log 2>&1
echo $? > $SCRATCH/logs/build-pcss3.exit
echo "BUILD EXIT=$(cat $SCRATCH/logs/build-pcss3.exit) $(date)"
