#!/bin/bash
# G-DRAWIN battery for one arm × one engine. usage: battery.sh <TAG> <port> <engine> <full|lite>
# Raw per-frame JSON lands in .drawin/series/raw (summarised by an3.mjs, never banked whole).
cd /Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_b6676cd9-8c6-13/web/frontend/.drawin || exit 1
TAG=$1; BASE=http://127.0.0.1:$2; E=$3; MODE=$4
export SP=$PWD/series
r() { timeout 300 node run3.mjs "$E" "$@" 2>&1 | grep -v '^$'; }
echo "== $TAG $E $MODE start $(date +%T) load $(sysctl -n vm.loadavg)"
r d cold 5 "$BASE" light motion "$TAG"
INJ=150,200 r d cold 5 "$BASE" light motion "$TAG-INJ150"
r d cold 3 "$BASE" dark motion "$TAG"
if [ "$MODE" = full ]; then
  r d warm 3 "$BASE" light motion "$TAG"
  r m cold 3 "$BASE" light motion "$TAG"
  r d cold 2 "$BASE" light prm "$TAG"
  r m cold 1 "$BASE" light prm "$TAG"
  INJ=300,200 r d cold 2 "$BASE" light motion "$TAG-INJ300"
  QS="" r d cold 3 "$BASE" light motion "$TAG-DEF"
fi
echo "== $TAG $E done $(date +%T) load $(sysctl -n vm.loadavg)"
