import sys
from PIL import Image, ImageDraw, ImageFont
raw, out, kind = sys.argv[1], sys.argv[2], sys.argv[3]
font = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial.ttf", 15)
def lab(img, text):
    W, H = img.size; c = Image.new("RGB", (max(W, 10), H + 24), (255, 255, 255)); c.paste(img, (0, 24))
    ImageDraw.Draw(c).text((4, 3), text, fill=(0, 0, 0), font=font); return c
def grid(rows, gap=8):
    W = max(sum(i.size[0] for i in r) + gap * (len(r) + 1) for r in rows); H = sum(max(i.size[1] for i in r) for r in rows) + gap * (len(rows) + 1)
    c = Image.new("RGB", (W, H), (128, 128, 128)); y = gap
    for r in rows:
        x = gap
        for i in r: c.paste(i, (x, y)); x += i.size[0] + gap
        y += max(i.size[1] for i in r) + gap
    return c
up = lambda im, k: im.resize((im.size[0] * k, im.size[1] * k), Image.NEAREST)
if kind == "inset":
    rows = [[lab(up(Image.open(f"{raw}/inset-{a}-{th}-chromium.png").convert("RGB"), 2), f"inset {'0.86 tree' if a == 'tree' else '0.90 arm'} · {th}") for a in ["tree", "I90"]] for th in ["light", "dark"]]
else:
    rows = [[lab(Image.open(f"{raw}/tab-{a}-{th}-chromium.png").convert("RGB"), f"{'dashed (tree)' if a == 'tree' else 'token (arm)'} · {th}") for a in ["tree", "L39"] for th in ["light", "dark"]]]
grid(rows).save(out)
