#!/usr/bin/env python3
"""PLR-PLACE pass 5 — composite a ballot pair: rows = engines (chromium, webkit), columns = the two
arms (left, right), 8px paper gutters. Usage: compose.py <out.png> <left-ch> <right-ch> <left-wk> <right-wk>"""
import sys
from PIL import Image
out, *paths = sys.argv[1:]
ims = [Image.open(p).convert("RGB") for p in paths]
w = max(i.width for i in ims); h = max(i.height for i in ims); g = 8
canvas = Image.new("RGB", (2 * w + 3 * g, 2 * h + 3 * g), (128, 128, 128))
for k, im in enumerate(ims):
    r, c = divmod(k, 2)
    canvas.paste(im, (g + c * (w + g), g + r * (h + g)))
canvas.save(out)
print(out, canvas.size)
