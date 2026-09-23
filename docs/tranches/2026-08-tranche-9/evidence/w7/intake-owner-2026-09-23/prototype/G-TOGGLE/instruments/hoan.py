import json, itertools, sys
D = sys.argv[1]
from PIL import Image, ImageChops, ImageStat
def mad(a, b):
    d = ImageChops.difference(a.convert("RGB"), b.convert("RGB")).convert("L"); h = d.histogram(); n = sum(h)
    return {"mean": round(ImageStat.Stat(d).mean[0], 2), "pctOver16": round(sum(h[17:]) / n * 100, 2), "pctOver64": round(sum(h[65:]) / n * 100, 2)}
out = {}
for e in ("chromium", "webkit"):
    for s in ("light", "dark"):
        p = lambda k: Image.open(f"{D}/{e}-{s}-{k}.png")
        rest = [p(f"rest{i}") for i in range(4)]
        live = p("live")
        pair = [mad(rest[i], rest[j]) for i, j in itertools.combinations(range(4), 2)]
        lv = [mad(live, rest[i]) for i in range(4)]
        best = min(range(4), key=lambda i: lv[i]["mean"])
        out[f"{e}-{s}"] = {"restPoseToPose": {"meanMin": min(x["mean"] for x in pair), "meanMax": max(x["mean"] for x in pair), "over16Min": min(x["pctOver16"] for x in pair), "over16Max": max(x["pctOver16"] for x in pair)}, "liveVsNearestRest": {"pose": best, **lv[best]}, "liveVsAll": [x["mean"] for x in lv], "state": json.load(open(f"{D}/{e}-{s}-state.json"))}
json.dump(out, open(f"{D}.json", "w"), indent=1)
for k, v in out.items(): print(k, json.dumps(v))
