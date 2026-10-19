#!/bin/bash
S=<lane-scratch>
bash $S/spec.sh A-tree-chromium-2 chromium 2 http://127.0.0.1:4244 "§A"
bash $S/spec.sh A-tree-webkit-2 webkit 2 http://127.0.0.1:4244 "§A"
bash $S/spec.sh A-ctl-chromium-2 chromium 2 http://127.0.0.1:4232 "§A"
bash $S/spec.sh A-ctl-webkit-2 webkit 2 http://127.0.0.1:4232 "§A"
bash $S/spec.sh B-tree-chromium-2 chromium 2 http://127.0.0.1:4244 "§B"
bash $S/spec.sh B-tree-webkit-2 webkit 2 http://127.0.0.1:4244 "§B"
echo ALLDONE > $S/logs/spec-drive.done
