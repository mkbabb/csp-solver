# B-FORK composite: row N=6 and row N=16, the three arms side by side (+ five on row 1).
import sys, json
from PIL import Image, ImageDraw, ImageFont
C = sys.argv[1]; out = sys.argv[2]
def im(arm, n): return Image.open(f"{C}/{arm}/chromium/N{n}.png").convert("RGB")
arms = [("title", "(a) title"), ("heading", "(b) heading"), ("remainder", "(c) remainder")]
cw, ch = im("title", 6).size
ch = max(im(a, n).size[1] for a, _ in arms for n in (6, 16))
try: F = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 22); f = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 18)
except Exception: F = f = ImageFont.load_default()
LW, GAP, TOP, CAP = 70, 24, 40, 30
W = LW + (cw + GAP) * 4 + GAP
H = TOP + 2 * (ch + CAP) + 10
bg = im("title", 6).getpixel((2, 2))
c = Image.new("RGB", (W, H), bg); d = ImageDraw.Draw(c)
d.text((12, 8), "B-FORK at six and sixteen (one payload: board ATMuNTMw…MDc5, self p-0000000b0b0b, peers tally-0…14)", fill=(40, 40, 40), font=f)
for r, n in enumerate((6, 16)):
    y = TOP + r * (ch + CAP)
    d.text((12, y + ch // 2 - 12), f"N={n}", fill=(40, 40, 40), font=F)
    x = LW
    if n == 6:
        c.paste(im("title", 5), (x, y)); d.text((x, y + ch + 4), "five (N=5)", fill=(40, 40, 40), font=f)
    x += cw + GAP
    for arm, lab in arms:
        c.paste(im(arm, n), (x, y)); d.text((x, y + ch + 4), lab, fill=(40, 40, 40), font=f); x += cw + GAP
c.save(out, optimize=True)
print(out, c.size)
