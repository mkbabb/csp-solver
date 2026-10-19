#!/bin/bash
# clean.sh: the tree (none) both specs both engines; then the w7 plant on wash-step; control rows. no rm, no set -e
S=<SCRATCH>
$S/stop.sh tree 2>&1 | grep -v "WARNING\|Output information\|assuming"; sleep 2
$S/serve.sh none
$S/spec.sh cy-clean count-yield.spec.ts "chromium webkit"
$S/spec.sh ws-clean wash-step.spec.ts "chromium webkit"
$S/spec.sh ws-control wash-step.spec.ts "chromium webkit" 4250
$S/spec.sh cy-control count-yield.spec.ts "chromium webkit" 4250
$S/stop.sh tree 2>&1 | grep -v "WARNING\|Output information\|assuming"; sleep 2
$S/serve.sh w7
$S/spec.sh ws-w7 wash-step.spec.ts "chromium webkit"
echo CLEAN-DONE
