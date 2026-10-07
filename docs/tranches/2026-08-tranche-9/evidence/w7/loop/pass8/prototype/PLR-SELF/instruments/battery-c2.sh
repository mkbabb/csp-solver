#!/bin/bash
# PLR-SELF pass 8 (resumed) · the dist phase: tree dist :4241 (vite preview of dist-tree) vs control :4250 (w7-control dist).
R=/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrself8r
W=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/w7-p4-PLR-SELF/web/frontend
cd $W
T='http://127.0.0.1:4241/?size=3&difficulty=EASY'; C='http://127.0.0.1:4250/?size=3&difficulty=EASY'
ARMS='{"tree":"http://127.0.0.1:4241","control":"http://127.0.0.1:4250"}'
echo "served tree: $(curl -s http://127.0.0.1:4241/ | grep -oE 'index-[A-Za-z0-9_-]+\.(js|css)' | sort -u | tr '\n' ' ')"
echo "served control: $(curl -s http://127.0.0.1:4250/ | grep -oE 'index-[A-Za-z0-9_-]+\.(js|css)' | sort -u | tr '\n' ' ')"
css=$(curl -s http://127.0.0.1:4241/ | grep -oE 'assets/index-[A-Za-z0-9_-]+\.css' | head -1)
curl -s http://127.0.0.1:4241/$css | shasum | cut -c1-40 | sed 's/^/served tree css sha1 /'
shasum $R/dist-arch/assets/index-*.css | sed 's/^/clean archive css sha1 /'
echo "served @property: tree $(curl -s http://127.0.0.1:4241/$css | grep -o '@property' | wc -l) control $(c2=$(curl -s http://127.0.0.1:4250/ | grep -oE 'assets/index-[A-Za-z0-9_-]+\.css' | head -1); curl -s http://127.0.0.1:4250/$c2 | grep -o '@property' | wc -l)"
echo "LOAD $(sysctl -n vm.loadavg)"
ARMS="$ARMS" OUT=$R/readings/filters.jsonl TM=p8-filters npx playwright test --config $R/probe/pw.mts > $R/logs/filters.log 2>&1; echo "FILTERS exit $?"
ARMS="$ARMS" PAYLOAD="$(cat $R/payload.txt)" OUT=$R/readings/pi.jsonl TM=p8-pi npx playwright test --config $R/probe/pw.mts > $R/logs/pi.log 2>&1; echo "PI exit $?"
for e in chromium webkit; do for sc in light dark; do
  node e2e/lib/edge-bands.mjs --engine $e --scheme $sc --url "$T" --click '.corner-left [data-player-mark]' --subject '.corner-left [data-lobby]' --edge '.corner-left [data-lobby] .head-sheet-edge' --plants > $R/logs/edge-tree-lobby-$e-$sc.log 2>&1; echo "EDGE tree lobby $e $sc exit $?"
  node e2e/lib/edge-bands.mjs --engine $e --scheme $sc --url "$T" --hover '.corner-left .attribution-trigger' --subject '.corner-left .hover-card' --edge '.corner-left .hover-card .head-sheet-edge' --plants > $R/logs/edge-tree-card-$e-$sc.log 2>&1; echo "EDGE tree card $e $sc exit $?"
  node e2e/lib/edge-bands.mjs --engine $e --scheme $sc --url "$C" --hover '.corner-left .attribution-trigger' --subject '.corner-left .hover-card' --plants > $R/logs/edge-control-card-$e-$sc.log 2>&1; echo "EDGE control card $e $sc exit $?"
  node e2e/lib/glyph-pop.mjs --engine $e --scheme $sc --url "$T" --click '.corner-left [data-player-mark]' --subject '.corner-left [data-lobby] .pl-state' --payload 'solo-desk-state-line' > $R/logs/glyph-tree-state-$e-$sc.log 2>&1; echo "GLYPH tree state $e $sc exit $?"
  node e2e/lib/glyph-pop.mjs --engine $e --scheme $sc --url "$C" --hover '.corner-left .attribution-trigger' --subject '.corner-left .hover-card p.italic' --payload 'desk-caption' > $R/logs/glyph-control-caption-$e-$sc.log 2>&1; echo "GLYPH control caption $e $sc exit $?"
  node e2e/lib/glyph-pop.mjs --engine $e --scheme $sc --url "$T" --hover '.corner-left .attribution-trigger' --subject '.corner-left .hover-card p.italic' --payload 'desk-caption' > $R/logs/glyph-tree-caption-$e-$sc.log 2>&1; echo "GLYPH tree caption $e $sc exit $?"
done
  M='[...document.querySelectorAll("[data-player-mark]")].find((e) => e.getBoundingClientRect().width > 0)?.getAttribute("aria-expanded")'
  node e2e/lib/rest-probes.mjs --engine $e --url "$T" --preset touch --target '[data-player-mark]:visible' --state "$M" > $R/logs/rest-touch-$e.log 2>&1; echo "REST touch $e exit $?"
  node e2e/lib/rest-probes.mjs --engine $e --url "$T" --preset touch --target '[data-player-mark]:visible' --state "$M" --plant relabel > $R/logs/rest-touch-relabel-$e.log 2>&1; echo "REST touch relabel $e exit $?"
  node e2e/lib/edge-bands.mjs --sabotage-battery --engine $e > $R/logs/edge-sabotage-$e.log 2>&1; echo "EDGE sabotage-battery $e exit $?"
done
echo "LOAD $(sysctl -n vm.loadavg)"
echo C2-DONE
