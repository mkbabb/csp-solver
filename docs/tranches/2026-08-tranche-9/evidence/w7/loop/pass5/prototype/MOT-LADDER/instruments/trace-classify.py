#!/usr/bin/env python3
"""Classify trace5-<engine>.json: a mover's A-vs-C delta counts only ABOVE its own noise arm
(C-vs-C on the same gesture): rect > 2x noise + 3px, opacity > noise + 0.10. Prints one row per
flagged (gesture, mover) and the clean count."""
import json, sys
for path in sys.argv[1:]:
    rows = json.load(open(path)); flagged = 0; clean = 0
    for r in rows:
        for s, m in r["movers"].items():
            rd, rn = m["rectMaxDelta"]["afterVsControl"], m["rectMaxDelta"]["controlVsControl"]
            od, on = m["opacityMaxDelta"]["afterVsControl"], m["opacityMaxDelta"]["controlVsControl"]
            if rd > 2 * rn + 3 or od > on + 0.10:
                flagged += 1
                print(f'{r["browserName"]:8s} {r["gesture"]:34s} {s:42s} rect A-C {rd:8.2f} (noise {rn:7.2f}) opac A-C {od:.2f} (noise {on:.2f}) travel A {m["travelPx"]["after"]:.1f} C {m["travelPx"]["control"]:.1f}')
            else:
                clean += 1
    print(f"{path.split('/')[-1]}: {flagged} flagged, {clean} within noise, {len(rows)} gestures")
