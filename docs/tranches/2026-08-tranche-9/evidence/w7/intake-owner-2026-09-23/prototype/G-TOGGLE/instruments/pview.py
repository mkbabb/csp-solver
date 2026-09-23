import sys, json
# pipe paint.py output: one summary line per flip, and (with -s) the per-frame grid-window series
show = "-s" in sys.argv
for l in sys.stdin:
    d = json.loads(l)
    s = d.pop("series")
    print(d["file"][:34], d["flip"], d["dir"], "| board p99.8 min", d["min_p998"], "u3", d["under3_p998"], "| grid-window", d["grid"], "| gaps", d["gap"])
    if show:
        print("    ", " ".join(f"{t}:{g}" for t, c, g in s[:40]))
