import json, sys, os
from PIL import Image, ImageDraw, ImageFont
def font(n):
    for p in ("/System/Library/Fonts/Menlo.ttc", "/System/Library/Fonts/SFNSMono.ttf"):
        if os.path.exists(p): return ImageFont.truetype(p, n)
    return ImageFont.load_default()
F = font(11)
def frames_at(run_file, label, times, region):
    J = json.load(open(run_file)); r = next(x for x in J["runs"] if x["label"] == label); act = r["actAt"]
    S = sorted(r["shots"], key=lambda s: s["t"]); tiles = []
    for T in times:
        cand = [s for s in S if s["t"] - act <= T + 0.5] or S[:1]; s = cand[-1]  # the frame ON SCREEN at act+T
        im = Image.open(s["f"]).convert("RGB").crop(region)
        tiles.append((im, round(s["t"] - act)))
    return tiles, r
def strip(rows, out, title):
    W = sum(t.size[0] for t, _ in rows[0][1]) + 6 * (len(rows[0][1]) + 1) + 90
    H = sum(row[1][0][0].size[1] + 22 for row in rows) + 24
    c = Image.new("RGB", (W, H), (255, 255, 255)); d = ImageDraw.Draw(c); d.text((6, 4), title, fill=(0, 0, 0), font=F)
    y = 22
    for name, tiles in rows:
        d.text((6, y + 20), name, fill=(0, 0, 0), font=F); x = 90
        for im, t in tiles:
            c.paste(im, (x, y + 14)); d.text((x, y), (f"+{t}ms" if t >= 0 else f"rest ({t}ms)"), fill=(0, 0, 0), font=F); x += im.size[0] + 6
        y += rows[0][1][0][0].size[1] + 22
    c = c.quantize(colors=96, method=Image.Quantize.MEDIANCUT)
    c.save(out, optimize=True); print(out, os.path.getsize(out), c.size)
if __name__ == "__main__":
    spec = json.loads(sys.argv[1]); rows = []
    for row in spec["rows"]:
        tiles, _ = frames_at(row["file"], row["flip"], spec["times"], tuple(spec["region"])); rows.append((row["name"], tiles))
    strip(rows, spec["out"], spec["title"])
