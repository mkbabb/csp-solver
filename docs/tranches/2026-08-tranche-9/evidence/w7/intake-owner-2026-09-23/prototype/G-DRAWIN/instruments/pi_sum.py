import json, glob, os
D = os.path.dirname(os.path.abspath(__file__))
for f in sorted(glob.glob(os.path.join(D, "pi-*-*.json"))):
    try:
        d = json.load(open(f))
    except Exception as e:
        print(os.path.basename(f), "UNREADABLE", open(f).read()[:300]); continue
    print(os.path.basename(f), "elements", d["elements"], "sigDelta", [(x[0], x[1][:70]) for x in d["sigDelta"]],
          "liveFilters", d["liveFilters"][:2], "poses", [(p["w"], p.get("equalAsSet", p.get("equal"))) for p in d["poseBytes"]])
