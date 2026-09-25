# frames.py — TAB-PEN pass 7: the three replacement crops, composed from the painted census's own photographs (shoot7.mjs,
# n1 of each cell; the two photographs of every cell are Δ 0) and touch.mjs's shots. Nearest-neighbour upscale only, no
# resampling of the ink. Labels are drawn outside every photograph.
# usage: python3 frames.py <shots dir> <touch shots dir> <out dir>
import sys, os
from PIL import Image, ImageDraw
SH, TS, OUT = sys.argv[1:4]
os.makedirs(OUT, exist_ok=True)
def cell(en, dpr, strip, arm, size, k):
    im = Image.open(f"{SH}/{en}_dpr{dpr}_{strip}_{arm}_{size}_n1.png").convert("RGB")
    return im.resize((im.width * k, im.height * k), Image.NEAREST)
ROWS = [("chromium", "light-active"), ("chromium", "dark-strip"), ("webkit", "light-active"), ("webkit", "dark-strip")]
def sheet(name, cols, label_h=14):
    # cols: list of (label, fn(en, strip) -> Image)
    ims = [[fn(en, st) for _, fn in cols] for en, st in ROWS]
    cw = [max(r[i].width for r in ims) + 6 for i in range(len(cols))]
    rh = [max(im.height for im in r) + 6 for r in ims]
    W, H = sum(cw) + 150, sum(rh) + label_h
    out = Image.new("RGB", (W, H), (136, 136, 136)); d = ImageDraw.Draw(out)
    x = 150
    for (lab, _), w in zip(cols, cw): d.text((x + 2, 1), lab, fill=(0, 0, 0)); x += w
    y = label_h
    for (en, st), r, h in zip(ROWS, ims, rh):
        d.text((4, y + h // 2 - 5), f"{en} {st}", fill=(0, 0, 0)); x = 150
        for im, w in zip(r, cw): out.paste(im, (x + 3, y + 3)); x += w
        y += h
    out.save(f"{OUT}/{name}")
# f1 · B-TAB-H: W | H | P at 16 px DPR 1 (x4 nearest) and 48 px DPR 2 (native), the two cells where H differs.
arms = ["W", "H", "P"]  # main is f2's control column
sheet("p7-f1-B-TAB-H-W-H-P-16dpr1x4-48dpr2-chromium-webkit-light-active-dark-strip-pointer-na-retires-intake-c4.png",
      [(f"{a} 16/dpr1 x4", (lambda a: lambda en, st: cell(en, 1, st, a, 16, 4))(a)) for a in arms] +
      [(f"{a} 48/dpr2", (lambda a: lambda en, st: cell(en, 2, st, a, 48, 1))(a)) for a in arms])
# f2 · T9-B28: main | A (W, stroke 4) | B (stroke 5) at 16 px DPR 1 (x5 nearest), the tab where the fringe loss lives.
sheet("p7-f2-T9-B28-main-A4-B5-16dpr1x5-chromium-webkit-light-active-dark-strip-pointer-na-retires-intake-c2.png",
      [(f"{lab} 16/dpr1 x5", (lambda a: lambda en, st: cell(en, 1, st, a, 16, 5))(a)) for lab, a in [("main", "main"), ("A=4", "W"), ("B=5", "B")]])
# f3 · the touch icon PHOTOGRAPHED: W | H, each on #ffffff and #000000, 180 px DPR 1, chromium over webkit.
a = Image.open(f"{TS}/touch-chromium-dpr1.png").convert("RGB"); b = Image.open(f"{TS}/touch-webkit-dpr1.png").convert("RGB")
out = Image.new("RGB", (a.width, a.height + b.height + 4), (136, 136, 136)); out.paste(a, (0, 0)); out.paste(b, (0, a.height + 4))
out.save(f"{OUT}/p7-f3-touch-icon-180-W-H-on-white-black-chromium-over-webkit-dpr1-pointer-na-retires-intake-c3.png")
print(sorted(os.listdir(OUT)))
