#!/usr/bin/env python3
# plant.py <fe-dir> <plant> : one-edit plants on bootHand.ts / pencilConfig.ts; asserts each edit hit once
import sys, pathlib
fe = pathlib.Path(sys.argv[1]); p = sys.argv[2]
bh = fe / "src/pencil/composables/bootHand.ts"; cfg = fe / "src/pencil/config/pencilConfig.ts"
def sub(f, a, b):
    t = f.read_text(); n = t.count(a)
    assert n == 1, f"{p}: {a!r} hits {n} in {f.name}"
    f.write_text(t.replace(a, b)); print(f"PLANT {p} {f.name} ok")
if p == "tree": print("PLANT tree none")
elif p == "wall":   # the pre-M20 hand: clock += dt, no pace
    sub(bh, "clock += Math.min(dt, pace(dt));", "clock += dt; void pace;")
elif p == "p8hand": # pass 8's hand: median of a seeded window, cap 34
    sub(bh, "const intervals: number[] = [];", "const intervals: number[] = [MOTION.hand.stepMs, MOTION.hand.stepMs];")
    sub(bh, "  const shortest = Math.min(...intervals);\n  const floored = Math.max(shortest * MOTION.hand.paceSlack, MOTION.hand.stepMs);\n  return Math.min(floored, MOTION.hand.maxStepMs);",
            "  const sorted = [...intervals].sort((a, b) => a - b);\n  return Math.min(sorted[sorted.length >> 1], MOTION.hand.maxStepMs);")
    sub(cfg, "    maxStepMs: 42,", "    maxStepMs: 34,")
elif p == "slack3": # a lost frame travels 3 frames (inside L's 4x)
    sub(cfg, "    paceSlack: 1.5,", "    paceSlack: 3,")
elif p == "p7clock": # pass 7: flat 17 ms step
    sub(bh, "clock += Math.min(dt, pace(dt));", "clock += Math.min(dt, MOTION.hand.stepMs); void pace;")
elif p.startswith("cap"):   # maxStepMs threshold plants: cap60, cap100, cap37
    sub(cfg, "    maxStepMs: 42,", f"    maxStepMs: {p[3:]},")
elif p.startswith("window"): # paceWindow plants
    sub(cfg, "    paceWindow: 5,", f"    paceWindow: {p[6:]},")
elif p.startswith("slackx"): # paceSlack plants, e.g. slackx2
    sub(cfg, "    paceSlack: 1.5,", f"    paceSlack: {p[6:]},")
else: sys.exit(f"unknown plant {p}")
