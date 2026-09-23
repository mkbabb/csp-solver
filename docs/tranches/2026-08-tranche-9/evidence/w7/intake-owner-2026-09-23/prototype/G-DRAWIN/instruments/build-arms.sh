#!/bin/bash
# Build the three prototype arm dists (A×Q default, F = ruling front, B = crossfade layer).
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_b6676cd9-8c6-13/web/frontend || exit 1
npx vite build --config .drawin/build.mts --outDir dist-aq --logLevel warn > .drawin/build-aq.log 2>&1; echo "aq EXIT $?"
VITE_HAND_ORDER=front npx vite build --config .drawin/build.mts --outDir dist-f --logLevel warn > .drawin/build-f.log 2>&1; echo "f EXIT $?"
VITE_HAND_LAYER=crossfade npx vite build --config .drawin/build.mts --outDir dist-b --logLevel warn > .drawin/build-b.log 2>&1; echo "b EXIT $?"
for d in dist-aq dist-f dist-b; do ls $d/assets | grep '^index-.*js'; done
