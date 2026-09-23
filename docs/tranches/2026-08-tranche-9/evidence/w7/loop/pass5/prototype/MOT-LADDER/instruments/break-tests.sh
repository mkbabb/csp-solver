#!/usr/bin/env bash
# MOT-LADDER pass 5 · BREAK-TESTS on the tree (LAWS: edit the tree, run the LANDED row bare, watch it
# red, restore with sha1). Every row runs CI's exact invocation: MOTION_LADDER_B8_OWNED=1 npm run lint:bands.
# Usage: break-tests.sh <web/frontend dir>
set -u
F="$1"; cd "$F" || exit 2
CSS=src/assets/index.css; CFG=src/pencil/config/pencilConfig.ts; GATE=scripts/check-motion-bands.mjs; CARD=src/pencil/chrome/GameGallery/GameCard.vue
snap() { for f in "$CSS" "$CFG" "$GATE" "$CARD"; do cp "$f" "/tmp/mlb-bt.$(basename "$f")"; done; shasum "$CSS" "$CFG" "$GATE" "$CARD" > /tmp/mlb-bt.sha; }
restore() { for f in "$CSS" "$CFG" "$GATE" "$CARD"; do cp "/tmp/mlb-bt.$(basename "$f")" "$f"; done; shasum -c /tmp/mlb-bt.sha >/dev/null && echo "    restored (sha1 ok)" || echo "    RESTORE FAILED"; }
run() { MOTION_LADDER_B8_OWNED=1 node "$GATE" --self-test --list > /tmp/mlb-bt.out 2>&1; local rc=$?; echo "    exit $rc"; grep -E '^\s+✗' /tmp/mlb-bt.out | sed 's/^/    /'; grep -m2 -E 'newKey|RETUNE|SHORTEN|INSIDE a brace|never registered|live-fit' /tmp/mlb-bt.out | cut -c1-200 | sed 's/^/      /'; }
snap
echo "ROW 0 · the landed tree, CI's invocation"; run
echo "ROW 1 · the critic's four-edit commit, MOVED row with NO newKey"
python3 - <<'PY'
css=open('src/assets/index.css').read()
css=css.replace('  .cell-reveal-animated {\n    animation: cell-reveal 0.3s','  .cell-reveal-anim {\n    animation: cell-reveal 0.15s',1)
open('src/assets/index.css','w').write(css)
g=open('scripts/check-motion-bands.mjs').read()
g=g.replace('    ms: [300],\n    anchor: ".cell-reveal-animated",','    ms: [150],\n    anchor: ".cell-reveal-anim {",',1)
g=g.replace('const ADMITTED = [','const ADMITTED = [\n  { file: "src/assets/index.css", key: "src/assets/index.css :: .cell-reveal-animated :: cell-reveal", cls: "MOVED", why: "renamed; no painted length falls" },',1)
open('scripts/check-motion-bands.mjs','w').write(g)
PY
run
echo "ROW 2 · the same commit, the MOVED row names its newKey (live at 150 < banked 300)"
sed -i '' 's#key: "src/assets/index.css :: .cell-reveal-animated :: cell-reveal", cls: "MOVED"#key: "src/assets/index.css :: .cell-reveal-animated :: cell-reveal", newKey: "src/assets/index.css :: .cell-reveal-anim :: cell-reveal", cls: "MOVED"#' "$GATE"
run
restore
echo "ROW 3 · rise 520 -> 100 behind the valued RETUNE row (to: 520)"
sed -i '' 's/^    rise: 520,$/    rise: 100,/' "$CFG"; run; restore
echo "ROW 4 · rise's RETUNE row loses its value (to: removed)"
sed -i '' '/^    rung: "rise",$/{n;/^    to: 520,$/d;}' "$GATE"; run; restore
echo "ROW 5 · the pass-4 shape: rise's registration nested inside :root {}"
python3 - <<'PY'
import re
css=open('src/assets/index.css').read()
blk=re.search(r'@property --motion-rise \{[^}]*\}\n',css).group(0)
css=css.replace(blk,'',1).replace('  --default-transition-duration: var(--motion-whisper);\n}','  --default-transition-duration: var(--motion-whisper);\n  '+blk+'}',1)
open('src/assets/index.css','w').write(css)
PY
run; restore
echo "ROW 6 · --motion-note's registration deleted (a published rung unregistered)"
python3 - <<'PY'
import re
css=open('src/assets/index.css').read()
css=re.sub(r'@property --motion-note \{[^}]*\}\n','',css,count=1)
open('src/assets/index.css','w').write(css)
PY
run; restore
echo "ROW 7 · GC1: var(--live-fit, 1) returns at GameCard"
sed -i '' 's/scale(var(--live-fit));/scale(var(--live-fit, 1));/' "$CARD"; run; restore
echo "ROW 8 · GC1: --live-fit's initial-value 0 -> 1"
python3 - <<'PY'
import re
css=open('src/assets/index.css').read()
css=re.sub(r'(@property --live-fit \{[^}]*initial-value:\s*)0',r'\g<1>1',css,count=1)
open('src/assets/index.css','w').write(css)
PY
run; restore
echo "ROW 9 · the dock ballot sentence re-priced on chromium's unmatched cell (5411/4739)"
sed -i '' 's#5314px/s over 4607px/s#5411px/s over 4739px/s#' "$CFG"; run; restore
