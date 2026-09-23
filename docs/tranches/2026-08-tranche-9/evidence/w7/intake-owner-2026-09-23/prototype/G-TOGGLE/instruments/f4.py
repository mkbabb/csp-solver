# f4: the hand-off pair at identity — rest pose 0 | live | |live − rest0|×4 | |rest1 − rest0|×4 (one boil step)
import sys, os
from PIL import Image, ImageChops, ImageDraw, ImageFont
out = sys.argv[1]
rows = [("main · chromium · light", "ho-base", "chromium", "light"), ("K · chromium · light", "ho-K2", "chromium", "light"),
        ("main · webkit · dark", "ho-base", "webkit", "dark"), ("K · webkit · dark", "ho-K2", "webkit", "dark")]
try:
    font = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial.ttf", 11)
except Exception:
    font = ImageFont.load_default()
S = 132
tiles = []
for label, d, e, t in rows:
    r0 = Image.open(f"{d}/{e}-{t}-rest0.png").convert("RGB")
    r1 = Image.open(f"{d}/{e}-{t}-rest1.png").convert("RGB")
    lv = Image.open(f"{d}/{e}-{t}-live.png").convert("RGB")
    amp = lambda im: im.point(lambda v: min(255, v * 4))
    tiles.append((label, [r0, lv, amp(ImageChops.difference(lv, r0)), amp(ImageChops.difference(r1, r0))]))
caps = ["rest pose 0", "live at identity", "|live − rest0| ×4", "|rest1 − rest0| ×4"]
LW = 130
sheet = Image.new("RGB", (LW + 4 * (S + 4), 16 + len(tiles) * (S + 4)), (128, 128, 128))
d = ImageDraw.Draw(sheet)
for j, c in enumerate(caps):
    d.text((LW + j * (S + 4) + 2, 2), c, fill=(255, 255, 255), font=font)
for i, (label, ims) in enumerate(tiles):
    y = 16 + i * (S + 4)
    d.text((4, y + S // 2), label, fill=(255, 255, 255), font=font)
    for j, im in enumerate(ims):
        sheet.paste(im.resize((S, S), Image.LANCZOS), (LW + j * (S + 4), y))
sheet.save(out, quality=86, optimize=True)
print(out, sheet.size, os.path.getsize(out))
