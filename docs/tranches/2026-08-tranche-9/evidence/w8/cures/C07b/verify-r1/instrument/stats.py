#!/usr/bin/env python3
"""C07b — read one interleaved raw/<tag>.jsonl and print the marks per arm.

Marks: board-ready; TBT (sum of longtask duration over 50 ms); the woff2 requests and wire
bytes that START BEFORE board-ready; and the bake fetch's own start. Tainted windows
(the instrument's own `tainted` flag, or a window that never reached ready) are named and
excluded.  usage: stats.py <path-to-jsonl>
"""
import json
import sys
from statistics import median


def load(path):
    rows, notes = [], []
    for line in open(path):
        line = line.strip()
        if not line or line.startswith("LOADAVG"):
            if line:
                notes.append(line)
            continue
        try:
            rows.append(json.loads(line))
        except json.JSONDecodeError:
            notes.append("UNPARSED " + line[:80])
    return rows, notes


def marks(r):
    ready = r.get("ready")
    lt = r.get("longtasks") or []
    tbt = sum(max(0.0, e["d"] - 50) for e in lt)
    woff = [x for x in r.get("resources", []) if x["name"].endswith(".woff2")]
    pre = [x for x in woff if ready is not None and x["start"] < ready]
    bake = [x for x in woff if x["init"] == "fetch"]
    return {
        "ready": ready,
        "tbt": round(tbt, 1),
        "woff2ReqPreReady": len(pre),
        "woff2BytesPreReady": sum(x["xfer"] for x in pre),
        "bakeStart": bake[0]["start"] if bake else None,
        "bakeXfer": bake[0]["xfer"] if bake else None,
    }


def main():
    rows, notes = load(sys.argv[1])
    for n in notes:
        print(n)
    arms = {"b": [], "c": []}
    for r in rows:
        if r.get("FAILED") or not r.get("readyOk") or r.get("tainted") or r.get("ready") is None:
            print(f"EXCLUDED arm={r.get('arm')} rep={r.get('rep')} "
                  f"readyOk={r.get('readyOk')} tainted={r.get('tainted')}")
            continue
        arms[r["arm"]].append(marks(r))
    keys = ["ready", "tbt", "woff2ReqPreReady", "woff2BytesPreReady", "bakeStart", "bakeXfer"]
    print(f"n: base={len(arms['b'])} cured={len(arms['c'])}")
    print(f"{'mark':<20}{'base median (min-max)':<30}{'cured median (min-max)':<30}{'delta':<12}disjoint")
    for k in keys:
        out = {}
        for a in ("b", "c"):
            vals = [m[k] for m in arms[a] if m[k] is not None]
            out[a] = (median(vals), min(vals), max(vals)) if vals else (None, None, None)
        b, c = out["b"], out["c"]
        if b[0] is None or c[0] is None:
            print(f"{k:<20}{'NOT MEASURED':<60}")
            continue
        disjoint = b[2] < c[1] or c[2] < b[1]
        print(f"{k:<20}{f'{b[0]:.1f} ({b[1]:.1f}-{b[2]:.1f})':<30}"
              f"{f'{c[0]:.1f} ({c[1]:.1f}-{c[2]:.1f})':<30}"
              f"{f'{c[0] - b[0]:+.1f}':<12}{disjoint}")


main()
