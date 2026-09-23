# G-TOGGLE frames: strips of screencast crops at named instants (nearest painted frame at or before t).
# python3 frames.py strip <out.png> <box:toggle|board> <instants csv> <label>=<run.json>:<flip> ...
import json, sys
from PIL import Image, ImageDraw, ImageFont

def load(spec):
    label, rest = spec.split("=", 1)
    path, flip = rest.rsplit(":", 1)
    J = json.load(open(path))
    r = next(x for x in J["runs"] if x["label"] == flip)
    act = r["clicks"][0] if r.get("clicks") else r["actAt"]
    return label, J, r, act

def pick(r, act, t):
    cands = [s for s in r["shots"] if s["t"] - act <= t + 4]
    s = max(cands, key=lambda x: x["t"]) if cands else r["shots"][0]
    return s, round(s["t"] - act)

mode, out, boxk, inst = sys.argv[1:5]
instants = [int(x) for x in inst.split(",")]
rows = [load(s) for s in sys.argv[5:]]
try:
    font = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial.ttf", 11)
except Exception:
    font = ImageFont.load_default()
tiles = []
for label, J, r, act in rows:
    vw = int(J["vp"].split("x")[0])
    x, y, w, h = J["toggleBox"] if boxk == "toggle" else J["boardBox"]
    if boxk == "board":  # a 3x3 corner of the board: enough ink and paper to read the crossing
        w, h = w * 0.42, h * 0.42
    m = 6
    row = []
    for t in instants:
        s, dt = pick(r, act, t)
        im = Image.open(s["f"]).convert("RGB")
        sx = im.width / vw
        c = im.crop((int((x - m) * sx), int((y - m) * sx), int((x + w + m) * sx), int((y + h + m) * sx)))
        tw = 104 if boxk == "toggle" else 120
        c = c.resize((tw, int(c.height * tw / c.width)), Image.LANCZOS)
        row.append((c, f"+{t} ({dt})"))
    tiles.append((label, row))
cw = max(c.width for _, row in tiles for c, _ in row)
ch = max(c.height for _, row in tiles for c, _ in row)
LW = 64
W = LW + len(instants) * (cw + 4)
H = len(tiles) * (ch + 18) + 4
sheet = Image.new("RGB", (W, H), (128, 128, 128))
d = ImageDraw.Draw(sheet)
for i, (label, row) in enumerate(tiles):
    y0 = 2 + i * (ch + 18)
    d.text((4, y0 + ch // 2), label, fill=(255, 255, 255), font=font)
    for j, (c, cap) in enumerate(row):
        x0 = LW + j * (cw + 4)
        sheet.paste(c, (x0, y0))
        d.text((x0 + 2, y0 + ch + 2), cap, fill=(255, 255, 255), font=font)
sheet.save(out, quality=84, optimize=True) if out.endswith(".jpg") else sheet.save(out, optimize=True)
import os
print(out, sheet.size, os.path.getsize(out))
