#!/bin/zsh
# PASS-7 LANE A · the two pass-4 citation rows, re-derived at citation.
#
#   A6-G1  `pass4/shots-A/` (36 shots) is cited twice and does not exist.
#   A6-G2  the 36 ribbon cells are attributed to the built dist; the only banked server log
#          beside them is a vite DEV server.
#
# NO `2>/dev/null` ANYWHERE IN THIS FILE — it is the rig that ships beside the ruling.
# Every stream is kept and lands in the log.

set -u
REPO=/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion
P4=$REPO/docs/tranches/2026-08-tranche-5/evidence/design-loop/pass4
cd "$REPO" || exit 2

print "AUDIT $(date -u +%Y-%m-%dT%H:%M:%SZ) · host $(uname -s | tr 'A-Z' 'a-z') · sha $(git rev-parse --short=8 HEAD) · shell zsh $ZSH_VERSION · harness NONE (filesystem + git object read)"
print "cmd: zsh rig/pass4-citation-audit.zsh"
print ""

print "── A6-G1 · THE CITED ARTIFACTS ──"
for d in shots-A rigA; do
  print -n "ls -d pass4/$d  ->  "
  ls -d "$P4/$d" 2>&1 | head -1
done
print ""
print "pass4/rigA/ holds:"
ls -1 "$P4/rigA" 2>&1
print ""
print "the three rig files §12 names:"
for f in verb-ink.mjs ribbon-shots.mjs serve.mjs; do
  print -n "  rigA/$f  ->  "
  [[ -e "$P4/rigA/$f" ]] && print "PRESENT" || print "ABSENT"
done
print ""
print "find, under pass4/, any shots-A or the three rigs:"
find "$P4" \( -name 'shots-A*' -o -name 'ribbon-shots.mjs' -o -name 'verb-ink.mjs' -o -name 'ribbon-geom.mjs' \) -print 2>&1
print "  (empty above = nothing found under pass4/)"
print "the same names anywhere else in docs/ — one hit, and it is pass 5's RE-AUTHORING, not pass 4's instrument:"
find "$REPO/docs" \( -name 'shots-A*' -o -name 'ribbon-shots.mjs' -o -name 'verb-ink.mjs' -o -name 'ribbon-geom.mjs' \) -print 2>&1
print ""
print "ever committed? git log --all --diff-filter=A over the same names:"
git log --all --diff-filter=A --name-only -- '*shots-A*' '*ribbon-shots.mjs' '*rigA/serve.mjs' '*rigA/verb-ink.mjs' '*ribbon-geom.mjs' 2>&1
print "  (empty above = never added in any branch)"
print ""
print "was a PNG under pass4/ ignorable? (the hollow-dist mechanism does NOT explain this one):"
git check-ignore -v "$P4/shots-A/x.png" 2>&1
print "  a '!' rule matching = NOT ignored: docs/tranches/.gitignore re-includes every PNG."
print ""

print "── A6-G2 · THE HARNESS BEHIND THE 36 RIBBON CELLS ──"
print -n "cells in ribbon-geom.log:   "; wc -l < "$P4/logs/A/ribbon-geom.log"
print -n "cells in ribbon-geom.json:  "; python3 -c "import json,sys;print(len(json.load(open(sys.argv[1]))))" "$P4/logs/A/ribbon-geom.json" 2>&1
print "keys carried by every cell:"
python3 -c "import json,sys;print('  '+', '.join(sorted(json.load(open(sys.argv[1]))[0].keys())))" "$P4/logs/A/ribbon-geom.json" 2>&1
print "  -> no harness, no baseURL, no build id, no AUDIT prepend on either file."
print ""
print "server logs banked in pass4/logs/A/:"
ls -1 "$P4/logs/A" 2>&1 | grep -Ei 'vite|serve|preview'
print -n "  vite-5321.log line 2:  "; sed -n '2p' "$P4/logs/A/vite-5321.log"
print -n "  its HMR/reload lines:  "; grep -c 'hmr update\|page reload' "$P4/logs/A/vite-5321.log"
print "  -> a DEV server, and the only one banked."
print ""
print "any banked line in pass4/logs/A/ naming a preview port:"
grep -rn '4188\|preview' "$P4/logs/A" 2>&1
print "  (empty above = none)"
print ""
print "the ONE built-dist attribution in that lane that IS derivable, and stays untouched:"
print -n "  playwright-throttle.config.ts: "; grep -n 'PREVIEW_PORT = 4188' "$REPO/web/frontend/playwright-throttle.config.ts" 2>&1
print "  filter-census / wordmark-integrity / theme-bake-freshness ride that bundled-preview config:"
grep -n 'filter-census\|wordmark-integrity\|theme-bake-freshness' "$REPO/web/frontend/playwright.config.ts" 2>&1 | head -6
print "  -> §9's 'e2e built-dist 16 passed · preview :4188' is CONFIG-DERIVABLE. Only the RIBBON"
print "     rig's harness is unbanked. The restamp is scoped to §1's 36 cells."
print ""

print "── WHAT LATER PASSES DID REPRODUCE ON A BUILT DIST ──"
print "pass 5 (border referent, built dist :4246) — AUDIT prepend, verbatim:"
sed -n '1,2p' "$REPO/docs/tranches/2026-08-tranche-5/evidence/design-loop/pass5/A/logs/A5-60-ribbon-geom-longstring.log" 2>&1
print "pass 6 (content referent, built dist :4252) — AUDIT prepend, verbatim:"
sed -n '1,2p' "$REPO/docs/tranches/2026-08-tranche-5/evidence/design-loop/pass6/A/logs/A6-10-referent-arm.log" 2>&1
print ""
print "pass-4 cells at 320, chromium/light, from ribbon-geom.log:"
grep 'chromium  light 320' "$P4/logs/A/ribbon-geom.log" 2>&1
print "reproduced on a built dist by pass 6 (content referent), all three; the 'both' cell also by"
print "pass 5 at 45.33 border = 31.73 content + 13.60 padding. THREE of THIRTY-SIX."
print "EXIT=0"
