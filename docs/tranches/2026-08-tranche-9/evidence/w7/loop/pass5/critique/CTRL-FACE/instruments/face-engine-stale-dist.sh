#!/bin/zsh
# The stamp binds the census to SRC, not to the artifact the spec measured. Run in a scratch COPY of
# web/frontend (src/ + scripts/) with a copy of .face-engine/ as census/.
# 1 bare on the tree's census -> PASS. 2 plant 6ch in GameControlPanel.vue -> RED (stamp mismatch).
# 3 emulate face-law.spec re-run against the UNREBUILT dist: the spec's ENGINE_STAMP is sha1 over the
#   STAMP_FILES read from src at load time, so it writes the planted digest over the old dist's numbers
#   -> PASS on a tree whose next build paints the 6ch mark.
set -e
G=src/games/shared/GameControlPanel.vue
node scripts/check-face-engine-identity.mjs --dir census; echo "step1 $?"
cp $G $G.bak; perl -pi -e 's/calc\(100% \+ 0\.5rem\)/6ch/' $G
node scripts/check-face-engine-identity.mjs --dir census || echo "step2 RED $?"
node -e '
const fs=require("fs"),crypto=require("crypto");
const list=/const STAMP_FILES = \[([\s\S]*?)\];/.exec(fs.readFileSync("scripts/check-face-engine-identity.mjs","utf8"))[1];
const h=crypto.createHash("sha1"); for (const m of list.matchAll(/"([^"]+)"/g)) h.update(`${m[1]}\n${fs.readFileSync(m[1],"utf8")}\n`);
const st=h.digest("hex"); for (const e of ["chromium","webkit"]) { const f=`census/${e}.json`; const c=JSON.parse(fs.readFileSync(f)); c.stamp=st; fs.writeFileSync(f, JSON.stringify(c,null,2)); }'
node scripts/check-face-engine-identity.mjs --dir census; echo "step3 $?"
cp $G.bak $G
