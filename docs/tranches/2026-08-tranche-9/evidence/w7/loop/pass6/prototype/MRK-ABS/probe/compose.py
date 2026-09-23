import sys
from PIL import Image, ImageDraw, ImageFont
raw, out, kind = sys.argv[1], sys.argv[2], sys.argv[3]
try: font = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial.ttf", int(sys.argv[6]) if len(sys.argv) > 6 else 22)
except Exception: font = ImageFont.load_default()
def lab(img, text):
    W, H = img.size; c = Image.new("RGB", (W, H + 30), (255, 255, 255)); c.paste(img, (0, 30))
    ImageDraw.Draw(c).text((6, 4), text, fill=(0, 0, 0), font=font); return c
def grid(rows, gap=8):
    W = sum(i.size[0] for i in rows[0]) + gap * (len(rows[0]) + 1); H = sum(max(i.size[1] for i in r) for r in rows) + gap * (len(rows) + 1)
    c = Image.new("RGB", (W, H), (128, 128, 128)); y = gap
    for r in rows:
        x = gap
        for i in r: c.paste(i, (x, y)); x += i.size[0] + gap
        y += max(i.size[1] for i in r) + gap
    return c
if kind == "ring":
    eng = sys.argv[4]
    names = {"A": "A #3a7bc4 .95", "B": "B #4589d2|#2f68aa .95", "C": "C #4589d2|#2f68aa 1.0"}
    rows = []
    for th in ["light", "dark"]:
        rows.append([lab((lambda im: im.resize((im.size[0] * 2, im.size[1] * 2), Image.NEAREST))(Image.open(f"{raw}/ring-{a}-{th}-{eng}.png").convert("RGB")), f"{names[a]} · {th}") for a in ["A", "B", "C"]])
    grid(rows).save(out)
else:
    eng = sys.argv[4]; off = sys.argv[5]
    rows = [[lab(Image.open(f"{raw}/deck-tree-light-{eng}.png").convert("RGB"), "tree · offset 3"), lab(Image.open(f"{raw}/deck-D-light-{eng}.png").convert("RGB"), f"arm D · offset {off}")]]
    grid(rows).save(out)
