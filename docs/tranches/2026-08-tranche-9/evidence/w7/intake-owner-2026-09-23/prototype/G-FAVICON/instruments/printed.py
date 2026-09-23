# B-FAV-1 arm P: the wordmark's Fraunces s, instanced at opsz 52 and a given wght, set in the same
# 32-unit square with the same 24-unit ink height as arm W, same paper, same ink, no filter.
# host python3, fontTools 4.62.1 over web/frontend/src/assets/fonts/fraunces-subset.woff2.
# usage: python3 printed.py <font.woff2> <wght> <out.svg>
import sys
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.transformPen import TransformPen

font, wght, out = sys.argv[1], float(sys.argv[2]), sys.argv[3]
f = instantiateVariableFont(TTFont(font), {"opsz": 52, "wght": wght})
gs = f.getGlyphSet()
name = f.getBestCmap()[ord("s")]
bp = BoundsPen(gs); gs[name].draw(bp); x0, y0, x1, y1 = bp.bounds
H = 24.0; s = H / (y1 - y0)
tx = 16 - s * (x0 + x1) / 2; ty = 16 + s * (y0 + y1) / 2  # y flipped
sp = SVGPathPen(gs, ntos=lambda v: f"{v:.2f}".rstrip("0").rstrip("."))
gs[name].draw(TransformPen(sp, (s, 0, 0, -s, tx, ty)))
d = sp.getCommands()
svg = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><style>rect{fill:#fbfaf9}path{fill:#0a0a0a}'
       '@media(prefers-color-scheme:dark){rect{fill:#110f0e}path{fill:#edece9}}</style>'
       f'<rect width="32" height="32" fill="#fbfaf9"/><path d="{d}" fill="#0a0a0a"/></svg>')
open(out, "w").write(svg + "\n")
print(f"wght {wght:.0f} ink box {s*(x1-x0):.2f} x {H:.2f} units, {len(svg)} B")
