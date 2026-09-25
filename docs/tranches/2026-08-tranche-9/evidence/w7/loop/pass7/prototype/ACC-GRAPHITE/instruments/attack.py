#!/usr/bin/env python3
"""ACC-GRAPHITE pass 7 — the pass-6 critic's escapes, ON DISK, against both trees in the same run:
the pass-6 bank's scripts (the negative control: they must pass = the holes were real) and this
tree's (they must red). Each plant is written to the file, both gates run bare, the file is restored
from its saved bytes and its sha1 re-checked. Usage: attack.py <atk web/frontend> <p6 web/frontend> <r1p6.mjs> <r1p7.mjs> <lib>"""
import sys, subprocess, hashlib, os
ATK, P6, R1P6, R1P7, LIB = sys.argv[1:6]
def sha(p): return hashlib.sha1(open(p,'rb').read()).hexdigest()
def run(cmd, cwd, env=None):
    e = dict(os.environ); e.update(env or {})
    r = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True, env=e); return r.returncode, (r.stdout + r.stderr)
URL = ".x { background: url(//a.b/c.png); --color-crayon-blue: #4a90d9; }"
W3 = "color-mix(in srgb, var(--color-pencil-graphite) 3%, transparent)"
PLANTS = [
  ("RETIRED quoted-key :style object", "retired", "src/games/shared/DigitCell.vue", ("replace", "<template>", "<template>\n  <i :style=\"{ '--color-crayon-blue': '#4a90d9' }\" />")),
  ("RETIRED TS style object", "retired", "src/games/shared/playerIdentity.ts", ("append", '\nexport const plant = { "--color-crayon-blue": "#4a90d9" };\n')),
  ("RETIRED same-line url(//) in SFC <style>", "retired", "src/games/shared/DigitCell.vue", ("append", "\n<style>\n" + URL + "\n</style>\n")),
  ("WASH .dark .cell-peer", "wash", "src/assets/index.css", ("append", "\n.dark .cell-peer { --ground-wash-unit: " + W3 + "; }\n")),
  ("WASH more html:is(.dark)", "wash", "src/assets/index.css", ("append", "\n@media (prefers-contrast: more) {\n  html:is(.dark) { --ground-wash-unit: " + W3 + "; }\n}\n")),
  ("WASH more .dark body", "wash", "src/assets/index.css", ("append", "\n@media (prefers-contrast: more) {\n  .dark body { --ground-wash-unit: " + W3 + "; }\n}\n")),
  ("R1 retrace-hex", "r1", "src/games/shared/gameCell.css", ("append", "\n.game-cell:has(input:focus-visible) .cell-ghost-retrace { stroke: #3a7bc4; }\n")),
  ("R1 ring literal royalblue", "r1", "src/games/shared/gameCell.css", ("append", "\n.game-cell:has(input:focus-visible) .cell-ghost-path { stroke: royalblue; }\n")),
  ("R1 ring token lch()", "r1", "src/games/shared/gameCell.css", ("append", "\n:root { --color-ring-plant: lch(50% 60 250); }\n.game-cell:has(input:focus-visible) .cell-ghost-path { stroke: var(--color-ring-plant); }\n")),
]
GATES = {
  "retired": [("pass6", P6, ["node", "scripts/check-theme-tokens.mjs"], {}), ("pass7", ATK, ["node", "scripts/check-theme-tokens.mjs"], {})],
  "wash": [("pass6", P6, ["node", "scripts/check-ink-pressure.mjs"], {}), ("pass7", ATK, ["node", "scripts/check-ink-pressure.mjs"], {})],
  "r1": [("pass6", P6, ["node", R1P6, P6], {}), ("pass7", ATK, ["node", R1P7, ATK], {"LIB": LIB})],
}
bad = 0
print("clean trees first:")
for kind, gates in GATES.items():
    for name, root, cmd, env in gates:
        rc, _ = run(cmd, root, env); print(f"  {kind:8s} {name}: exit {rc}")
for label, kind, rel, (op, *args) in PLANTS:
    row = []
    for name, root, cmd, env in GATES[kind]:
        p = os.path.join(root, rel); orig = open(p).read(); h = sha(p)
        open(p, "w").write(orig.replace(args[0], args[1], 1) if op == "replace" else orig + args[0])
        rc, out = run(cmd, root, env)
        open(p, "w").write(orig); assert sha(p) == h
        row.append((name, rc))
    ok = row[0][1] == 0 and row[1][1] != 0
    bad += not ok
    print(f"{label:44s} pass6 exit {row[0][1]} · pass7 exit {row[1][1]} → {'hole closed' if ok else 'UNEXPECTED'}")
sys.exit(1 if bad else 0)
