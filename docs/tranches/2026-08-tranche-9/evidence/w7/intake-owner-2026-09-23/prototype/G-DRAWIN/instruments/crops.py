"""Cut the four cited crops (≤150 KB each) from the frozen photographs."""
import json, os
from PIL import Image, ImageDraw

P = os.path.join(os.path.dirname(os.path.abspath(__file__)), "photos", "r1")
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "crops"); os.makedirs(OUT, exist_ok=True)

def shots(name):
    return {s["cond"]: s for s in json.load(open(os.path.join(P, name))) if not s.get("miss")}

def label(im, text):
    d = ImageDraw.Draw(im); d.rectangle([0, 0, im.size[0], 26], fill=(255, 255, 255)); d.text((6, 6), text, fill=(0, 0, 0)); return im

def box_around(cx, cy, w, h, dpr):
    return (int((cx - w / 2) * dpr), int((cy - h / 2) * dpr), int((cx + w / 2) * dpr), int((cy + h / 2) * dpr))

def save(im, name):
    path = os.path.join(OUT, name); q = 88
    while True:
        im.convert("RGB").save(path, quality=q)
        if os.path.getsize(path) <= 150_000 or q <= 40: break
        q -= 8
    print(name, os.path.getsize(path), "B q", q)

# c1 — chromium light 1280 fine: the frame mid-side, arm A×Q (bead) beside HEAD at the same fraction
a = shots("AQ-chromium-light-d.json")["frame375"]; b = shots("BASE-chromium-light-d.json")["frame375"]
fa = next(l for l in a["lines"] if l["i"] == 0)["front"]; fb = next(l for l in b["lines"] if l["i"] == 0)["front"]
A = Image.open(a["file"]).crop(box_around(fa[0], fa[1], 260, 180, 2)); B = Image.open(b["file"]).crop(box_around(fb[0], fb[1], 260, 180, 2))
c1 = Image.new("RGB", (A.size[0] * 2 + 8, A.size[1]), (255, 255, 255)); c1.paste(A, (0, 0)); c1.paste(B, (A.size[0] + 8, 0))
label(c1, f"c1 chromium light 1280x800 DPR2 fine | left A×Q frame p={next(l for l in a['lines'] if l['i']==0)['pr']} (bead) t={a['hit']['t']}ms | right HEAD p={next(l for l in b['lines'] if l['i']==0)['pr']} t={b['hit']['t']}ms")
save(c1.resize((c1.size[0] * 3 // 4, c1.size[1] * 3 // 4)), "c1-chromium-light-1280x800-fine-frame-midside-AQ-vs-HEAD.jpg")

# c2 — WebKit dark 1280 fine: two fronts at a lift-and-land (arm Q), with the drying nub
s = shots("AQ-webkit-dark-d.json")["twofronts"]; parts = [l for l in s["lines"] if 0.001 < l["pr"] < 0.999]
cx = sum(l["front"][0] for l in parts) / len(parts); cy = sum(l["front"][1] for l in parts) / len(parts)
c2 = Image.open(s["file"]).crop(box_around(cx, cy, 420, 300, 2))
label(c2, "c2 webkit dark 1280x800 DPR2 fine | A×Q two fronts " + " ".join(f"L{l['i']} p={l['pr']}" for l in parts) + f" t={s['hit']['t']}ms")
save(c2.resize((c2.size[0] * 3 // 4, c2.size[1] * 3 // 4)), "c2-webkit-dark-1280x800-fine-two-fronts-lift-and-land-AQ.jpg")

# c3 — chromium light 390 coarse: the rubbing mid-word (105° feathered front), beside the word at rest
m = shots("AQ-chromium-light-m.json"); r = m["rub50"]; rest = m["rest"]; x, y, w, h = rest["logo"]
A = Image.open(r["file"]).crop((int(x * 3) - 12, int(y * 3) - 12, int((x + w) * 3) + 12, int((y + h) * 3) + 12))
B = Image.open(rest["file"]).crop((int(x * 3) - 12, int(y * 3) - 12, int((x + w) * 3) + 12, int((y + h) * 3) + 12))
c3 = Image.new("RGB", (A.size[0], A.size[1] * 2 + 34), (255, 255, 255)); c3.paste(A, (0, 30)); c3.paste(B, (0, A.size[1] + 34))
label(c3, f"c3 chromium light 390x844 DPR3 coarse(hasTouch) | top: rubbing mid-word t={r['hit']['t']}ms  bottom: at rest")
save(c3.resize((c3.size[0] * 2 // 3, c3.size[1] * 2 // 3)), "c3-chromium-light-390x844-coarse-rubbing-midword-AQ.jpg")

# c4 — chromium light 1280 fine: last drawing frame vs first settled frame, |Δ|×8 (inverted), a corner
d = shots("AQ-chromium-light-d.json"); pd = d["predrawn"]; x, y, w, h = pd["board"]
diff = Image.open(pd["file"].replace("-predrawn.png", "-handoff-diff-x8.png"))
A = Image.open(pd["file"]).crop((int(x * 2) - 16, int(y * 2) - 16, int(x * 2) + 360, int(y * 2) + 300))
D = diff.crop((0, 0, 376, 316))
c4 = Image.new("RGB", (A.size[0] * 2 + 8, A.size[1] + 30), (255, 255, 255)); c4.paste(A, (0, 30)); c4.paste(D, (A.size[0] + 8, 30))
label(c4, "c4 chromium light 1280x800 DPR2 fine | left: last drawing frame (A×Q)  right: |last drawing - first settled| x8 (band median 0/255, p95 29/255)")
save(c4, "c4-chromium-light-1280x800-fine-handoff-diff-AQ.jpg")
