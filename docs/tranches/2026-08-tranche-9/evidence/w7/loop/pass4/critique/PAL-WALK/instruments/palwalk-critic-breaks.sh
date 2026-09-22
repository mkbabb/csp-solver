#!/bin/zsh
# PAL-WALK pass-4 critic — try to make check-peer-arcs pass on a broken tree (scratch copy only).
F=$1; cd $F
run() { node scripts/check-peer-arcs.mjs > /dev/null 2>&1; echo "  exit=$?"; }
mut() { # file, perl expr, label
  cp $1 $1.orig; perl -0pi -e "$2" $1; echo "[$3]"; run; mv $1.orig $1; }
echo "[baseline]"; run
mut src/games/shared/gameCell.css 's/\z/\n.game-cell { --peer-ring-l: 0.2; }\n/' "B1 ring band re-bound on .game-cell in gameCell.css"
mut src/assets/index.css 's/\z/\n\@media (prefers-contrast: more) { :root { --peer-ring-l: 0.2; } }\n/' "B2 a prefers-contrast arm in index.css re-binds the ring band"
mut src/games/shared/GameBoard.vue 's/(\.attribution-tape \{)/$1\n  --peer-ring-l: 0.2;/' "B3 the tape anchor re-binds the band in a .vue scoped style"
mut src/assets/index.css 's/--peer-ring-l: 0\.32;/--peer-ring-l: 0.32;\n  --peer-ring-l: 0.2;/' "B4 a second declaration in the same :root block (last wins in the cascade)"
mut src/games/shared/playerIdentity.ts 's/at\("--peer-ring-l", RING_BANDS\)/at("--peer-ring-l", [0.2, 0.79])/' "B5 inline literal table at the call site"
mut src/games/shared/playerIdentity.ts 's/const at = \(v: string, bands: readonly number\[\]\): string =>/const at = (v: string, _b: readonly number[]): string => { const bands = [0.2, 0.79];/; s/(\`oklch\(var\(\$\{v\}\) \$\{chromaAt\(h, bands\)\.toFixed\(4\)\} \$\{h\.toFixed\(2\)\}deg\)\`;)/return $1 };/' "B6 the table shadowed inside the helper"
