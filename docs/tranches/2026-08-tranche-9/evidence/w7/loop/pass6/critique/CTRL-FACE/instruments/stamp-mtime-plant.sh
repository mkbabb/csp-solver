#!/bin/zsh
# The engine stamp's freshness is mtime. Scratch COPY (cp -Rp src scripts dist; census/ = .face-engine/*.json).
# step3: the pass-5 plant by perl (new mtime) + restamp -> EXIT 1 (cured). step4: the SAME plant arriving by
# `cp -p` with the pre-build mtime + restamp -> EXIT 0 on a dist that predates the plant.
G=src/games/shared/GameControlPanel.vue
restamp() { node -e '
const fs=require("fs"),crypto=require("crypto");
const list=/const STAMP_FILES = \[([\s\S]*?)\];/.exec(fs.readFileSync("scripts/check-face-engine-identity.mjs","utf8"))[1];
const h=crypto.createHash("sha1"); for (const m of list.matchAll(/"([^"]+)"/g)) h.update(`${m[1]}\n${fs.readFileSync(m[1],"utf8")}\n`);
const st=h.digest("hex"); for (const e of ["chromium","webkit"]) { const f=`census/${e}.json`; const c=JSON.parse(fs.readFileSync(f)); c.stamp=st; fs.writeFileSync(f, JSON.stringify(c,null,2)); }'; }
node scripts/check-face-engine-identity.mjs --dir census --dist dist >/dev/null 2>&1; echo "step1 clean EXIT $?"
cp -p $G /tmp/g.orig.$$; perl -pi -e 's/calc\(100% \+ 0\.5rem\)/6ch/' $G; restamp
node scripts/check-face-engine-identity.mjs --dir census --dist dist >/dev/null 2>&1; echo "step3 perl plant EXIT $?"
cp $G /tmp/g.pl.$$; touch -r /tmp/g.orig.$$ /tmp/g.pl.$$; cp -p /tmp/g.pl.$$ $G; restamp
node scripts/check-face-engine-identity.mjs --dir census --dist dist >/dev/null 2>&1; echo "step4 cp -p plant EXIT $?"
cp -p /tmp/g.orig.$$ $G; restamp
