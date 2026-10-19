#!/bin/bash
cd $SCRATCH/rep/web/frontend || exit 9
echo "load $(uptime)"
npx vite build --config $SCRATCH/cfg/vite.build.mts --outDir $SCRATCH/dist-plant --emptyOutDir > $SCRATCH/logs/build-plant.vite.log 2>&1
echo $? > $SCRATCH/logs/build-plant.exit
echo "BUILD EXIT=$(cat $SCRATCH/logs/build-plant.exit) $(date)"
