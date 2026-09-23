#!/bin/sh
# The critic's gate-escape plants for check-favicon.mjs (G-TAB-1). Each writes a scratch web/frontend
# root (index.html, index.css, the PNG, icons.mjs re-stamped with the planted SVG's sha as icons.mjs would)
# and runs the gate with --root. usage: sh escape-plants.sh <prototype web/frontend> <scratch dir>
W=$1; S=$2
mk(){ d=$S/$1; mkdir -p $d/public $d/src/assets $d/scripts; cp $W/index.html $d/; cp $W/src/assets/index.css $d/src/assets/; cp $W/public/apple-touch-icon.png $d/public/; }
run(){ d=$S/$1; python3 - "$d" "$W" <<'PY'
import sys,hashlib,re
d,w=sys.argv[1:3]; svg=open(d+'/public/icon.svg','rb').read()
src=re.sub(r'icon\.svg sha256 [0-9a-f]{64}','icon.svg sha256 '+hashlib.sha256(svg).hexdigest(),open(w+'/scripts/icons.mjs').read())
open(d+'/scripts/icons.mjs','w').write(src)
PY
node $W/scripts/check-favicon.mjs --root $d | tail -1; }
ICON=$(cat $W/public/icon.svg)
mk E1; echo "$ICON" | sed 's#path{stroke:\#0a0a0a}#path{stroke:\#0a0a0a;stroke-width:9px}#' > $S/E1/public/icon.svg; printf "E1 CSS stroke-width 9 (the mark's own defect): "; run E1
mk E2; echo "$ICON" | sed 's#</style>#path{stroke:\#e8e6e3}</style>#' > $S/E2/public/icon.svg; printf "E2 FAINT INK by a later rule (A.5.3): "; run E2
mk E3; echo "$ICON" | sed 's#</svg>#<circle cx="16" cy="16" r="12" fill="\#0a0a0a"/></svg>#' > $S/E3/public/icon.svg; printf "E3 a second ink element: "; run E3
mk E4; echo "$ICON" | sed 's#path{stroke:\#0a0a0a}#path{stroke:\#0a0a0a;visibility:hidden}#' > $S/E4/public/icon.svg; printf "E4 the pen hidden: "; run E4
mk E5; cp $W/public/icon.svg $S/E5/public/; python3 -c "
import zlib,struct
def ch(t,d): return struct.pack('>I',len(d))+t+d+struct.pack('>I',zlib.crc32(t+d)&0xffffffff)
raw=b''.join(b'\x00'+b'\xff\x00\x00'*180 for _ in range(180))
open('$S/E5/public/apple-touch-icon.png','wb').write(b'\x89PNG\r\n\x1a\n'+ch(b'IHDR',struct.pack('>IIBBBBB',180,180,8,2,0,0,0))+ch(b'IDAT',zlib.compress(raw))+ch(b'IEND',b''))"; printf "E5 a solid-red 180 PNG: "; run E5
mk E6; echo "$ICON" | sed 's#<rect width="32" height="32"#<rect width="8" height="8"#' > $S/E6/public/icon.svg; printf "E6 paper 8x8: "; run E6
mk E7; echo "$ICON" | sed 's#viewBox="0 0 32 32"#viewBox="0 0 64 64"#' > $S/E7/public/icon.svg; printf "E7 viewBox 64 (ink halves): "; run E7
mk E8; echo "$ICON" | sed 's#path{stroke:\#0a0a0a}#path{stroke:\#0a0a0a;stroke-dasharray:1 6}#' > $S/E8/public/icon.svg; printf "E8 dashed pen: "; run E8
