import sys
fe = sys.argv[1]
def sub(p, old, new):
    t = open(f"{fe}/{p}").read()
    assert t.count(old) == 1, (p, t.count(old))
    open(f"{fe}/{p}", "w").write(t.replace(old, new))
row = '''  {
    file: "src/pencil/grid/gridPaths.ts",
    expr: "clock += Math.min(dt, Math.max(MOTION.hand.stepMs, panelFrameMs(dt, origin + t)))",'''
t = open(f"{fe}/scripts/check-motion-bands.mjs").read()
i = t.index(row); j = t.index("  },\n", i) + len("  },\n")
open(f"{fe}/scripts/check-motion-bands.mjs", "w").write(t[:i] + t[j:])
d = '// @ts-expect-error — the ONE post-paint recorder is an .mjs home with no declaration (registry-v7 §2.4)\n'
sub("e2e/count-yield.spec.ts", 'import { installTimeline } from "./lib/postpaint.mjs";\n', d + 'import { installTimeline } from "./lib/postpaint.mjs";\n')
sub("e2e/tally-flash.spec.ts", 'import { installTimeline } from "./lib/postpaint.mjs";\n', d + 'import { installTimeline } from "./lib/postpaint.mjs";\n')
sub("src/pencil/chrome/MarginNote.vue", "an author `animation-name: none`, on either line, and a", "an author `animation-name: none`, on both lines, and a")
print("planted 4 edits (J1 row struck, J2 two directives restored, J3 comment restored)")
