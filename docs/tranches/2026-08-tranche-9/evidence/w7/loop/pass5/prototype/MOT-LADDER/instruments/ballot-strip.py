#!/usr/bin/env python3
"""T9-B11's one crop: two rows (rise 520, rise 600) x six seeked instants, the sheet's band only,
one engine/theme/viewport/pointer/board. Usage: ballot-strip.py <raw dir> <engine> <out.png>"""
import sys
from PIL import Image, ImageDraw
raw, eng, out = sys.argv[1:4]
TIMES = [80, 160, 240, 320, 400, 480]
# the band the sheet crosses at 768x1024 (the dock rises from the foot); scaled to keep the crop small
BOX = (0, 300, 768, 1024)
S = 0.28
rows = []
for clock in (520, 600):
    tiles = [Image.open(f"{raw}/{eng}-{clock}-{t}.png").convert("RGB").crop(BOX) for t in TIMES]
    tiles = [t.resize((int(t.width * S), int(t.height * S)), Image.LANCZOS) for t in tiles]
    rows.append(tiles)
tw, th = rows[0][0].size
pad, lab = 4, 16
W = 44 + len(TIMES) * (tw + pad)
H = lab + 2 * (th + pad)
img = Image.new("RGB", (W, H), "white")
d = ImageDraw.Draw(img)
for j, t in enumerate(TIMES):
    d.text((44 + j * (tw + pad) + 2, 2), f"t={t}ms", fill="black")
for i, (clock, tiles) in enumerate(zip((520, 600), rows)):
    y = lab + i * (th + pad)
    d.text((2, y + th // 2 - 6), f"{clock}", fill="black")
    for j, t in enumerate(tiles):
        img.paste(t, (44 + j * (tw + pad), y))
img.save(out, optimize=True)
print(out, img.size)
