#!/usr/bin/env bash
# MOT-LADDER pass 6 · BREAK-TESTS on the tree through CI's EXACT invocation (`npm run lint:bands`,
# bare — the env-var demotion is deleted). Edit the tree, run the landed gate, watch it red,
# restore by copy and VERIFY by sha1. No rm anywhere (LAWS P5): the snapshot lives under a
# lane-unique scratch dir and is overwritten by redirection.
# Usage: break-tests.sh <web/frontend dir> <scratch dir>
set -u
F="$1"; T="$2"; mkdir -p "$T"; cd "$F" || exit 2
CSS=src/assets/index.css; CFG=src/pencil/config/pencilConfig.ts; GATE=scripts/check-motion-bands.mjs
CARD=src/pencil/chrome/GameGallery/GameCard.vue; BANK=scripts/motion-bank.json; CARET=src/games/futoshiki/CaretOverlay.vue
FILES="$CSS $CFG $GATE $CARD $BANK $CARET"
snap() { for f in $FILES; do cp "$f" "$T/snap.$(basename "$f")"; done; shasum $FILES > "$T/snap.sha"; }
restore() { for f in $FILES; do cp "$T/snap.$(basename "$f")" "$f"; done; shasum -c "$T/snap.sha" >/dev/null && echo "    restored (sha1 ok)" || echo "    RESTORE FAILED"; }
run() { npm run --silent lint:bands > "$T/out.txt" 2>&1; local rc=$?; echo "    exit $rc   (expect $1)"; grep -E '^\s+✗' "$T/out.txt" | sed 's/^/    /'; node "$GATE" --list 2>&1 | grep -E '^      ' | head -3 | cut -c1-220 | sed 's/^/  /'; }
py() { python3 -c "$1"; }
snap
echo "ROW 0 · the landed tree"; run 0
echo "ROW A1 · the critic's A1 verbatim: .cell-reveal-animated 0.3s -> .cell-reveal-anim 0.15s, CHARACTER row [150], MOVED newKey MOTION.characters.refuse (ms 300)"
py "
c=open('$CSS').read(); c=c.replace('  .cell-reveal-animated {\n    animation: cell-reveal 0.3s','  .cell-reveal-anim {\n    animation: cell-reveal 0.15s',1); open('$CSS','w').write(c)
g=open('$GATE').read(); g=g.replace('    ms: [300],\n    anchor: \".cell-reveal-animated\",','    ms: [150],\n    anchor: \".cell-reveal-anim {\",',1)
g=g.replace('const ADMITTED = [','const ADMITTED = [\n  { file: \"src/assets/index.css\", key: \"src/assets/index.css :: .cell-reveal-animated :: cell-reveal\", newKey: \"MOTION.characters.refuse\", ms: 300, cls: \"MOVED\", why: \"renamed\" },',1); open('$GATE','w').write(g)"
run 1
echo "ROW A1b · the same commit, newKey aimed at another BANKED live site (.solve-success :: box-shadow, 500 >= 300)"
sed -i '' 's#newKey: "MOTION.characters.refuse", ms: 300, cls: "MOVED", why: "renamed"#newKey: "src/assets/index.css :: .solve-success :: box-shadow", ms: 300, cls: "MOVED", why: "renamed"#' "$GATE"
run 1
restore
echo "ROW A2 · the critic's A2 verbatim: bank 300 -> 150 + css 0.15s + CHARACTER [150] (four lines)"
py "
c=open('$CSS').read(); c=c.replace('  .cell-reveal-animated {\n    animation: cell-reveal 0.3s','  .cell-reveal-animated {\n    animation: cell-reveal 0.15s',1); open('$CSS','w').write(c)
g=open('$GATE').read(); g=g.replace('    ms: [300],\n    anchor: \".cell-reveal-animated\",','    ms: [150],\n    anchor: \".cell-reveal-animated\",',1); open('$GATE','w').write(g)
b=open('$BANK').read(); b=b.replace('\"src/assets/index.css :: .cell-reveal-animated :: cell-reveal\": 300','\"src/assets/index.css :: .cell-reveal-animated :: cell-reveal\": 150',1); open('$BANK','w').write(b)"
run 1
echo "ROW A2b · the same, and the author RE-STAMPS BANK_SHA256 to the lowered bank (BASE_REF reachable here: the re-derived floor reds)"
D=$(node -e '
const j=require(process.argv[1]);const s=(o={})=>Object.fromEntries(Object.entries(o).sort(([a],[b])=>a<b?-1:a>b?1:0));
console.log(require("crypto").createHash("sha256").update(JSON.stringify({base:j.base,rungs:s(j.rungs),sites:s(j.sites)})).digest("hex"))' "$F/$BANK")
sed -i '' "s/^const BANK_SHA256 = \"[0-9a-f]*\";/const BANK_SHA256 = \"$D\";/" "$GATE"
run 1
restore
echo "ROW A3 · the critic's A3 verbatim: CaretOverlay's one length leaves its file for index.css at whisper, zero ledger rows"
py "
v=open('$CARET').read(); i=v.index('@media (prefers-reduced-motion: no-preference) {\n  .board-leaving .caret-layer'); j=v.index('}\n}\n',i)+4; v=v[:i]+v[j:]; open('$CARET','w').write(v)
c=open('$CSS').read(); c+='\n@media (prefers-reduced-motion: no-preference) {\n  .board-leaving .caret-layer {\n    opacity: 0;\n    transition: opacity var(--motion-whisper) var(--verb-lift-ease);\n  }\n}\n'; open('$CSS','w').write(c)"
run 1
restore
echo "ROW C4 · clause 4: @property --motion-throw { inherits: false }"
py "
import re
c=open('$CSS').read(); c=re.sub(r'(@property --motion-throw \{[^}]*inherits:\s*)true',r'\g<1>false',c,count=1); open('$CSS','w').write(c)"
run 1; restore
echo "ROW C5 · GC1: --live-fit initial-value 0 -> 0.99"
py "
import re
c=open('$CSS').read(); c=re.sub(r'(@property --live-fit \{[^}]*initial-value:\s*)0',r'\g<1>0.99',c,count=1); open('$CSS','w').write(c)"
run 1; restore
echo "ROW C6 · the value law: MOTION.dealStaggerMs 90 -> 10"
sed -i '' 's/^  dealStaggerMs: 90,$/  dealStaggerMs: 10,/' "$CFG"; run 1; restore
echo "ROW C13 · plant P5: --ease-starTuck: ease-in (the keyword written back as the token's value)"
sed -i '' 's/^  --ease-starTuck: cubic-bezier(0.42, 0, 1, 1);$/  --ease-starTuck: ease-in;/' "$CSS"; run 1; restore
echo "ROW P5-3 · rise 520 -> 100 behind the valued RETUNE row (to: 520)"
sed -i '' 's/^    rise: 520,$/    rise: 100,/' "$CFG"; run 1; restore
echo "ROW P5-5 · rise's registration nested inside :root {}"
py "
import re
c=open('$CSS').read(); b=re.search(r'@property --motion-rise \{[^}]*\}\n',c).group(0)
c=c.replace(b,'',1).replace('  --default-transition-duration: var(--motion-whisper);\n}','  --default-transition-duration: var(--motion-whisper);\n  '+b+'}',1); open('$CSS','w').write(c)"
run 1; restore
echo "ROW P5-7 · GC1: var(--live-fit, 1) returns at GameCard"
sed -i '' 's/scale(var(--live-fit));/scale(var(--live-fit, 1));/' "$CARD"; run 1; restore
echo "FINAL · the landed tree again"; run 0
shasum -c "$T/snap.sha" >/dev/null && echo "every file byte-equal to the snapshot"
