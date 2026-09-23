#!/usr/bin/env python3
"""PLR-PLACE pass 5 — unit break battery. Each break edits THIS tree, runs the LANDED unit file,
records pass/fail per row, restores, and verifies sha1. Usage: unit-breaks.py <frontend dir> <out>"""
import hashlib, subprocess, sys, re, json
FE, OUT = sys.argv[1], sys.argv[2]
MARK = f"{FE}/src/pencil/chrome/PlayerMark/PlayerMark.vue"
LOBBY = f"{FE}/src/pencil/chrome/PlayerMark/PlayerLobby.vue"
GUARD = "    if (id in timers && pending[id] === pos) continue;\n"
WATCH_END = "    settled.value = rest;\n  }\n});\n"
BREAKS = {
  "U0-none": [],
  "U-A guard ablated": [(MARK, GUARD, "")],
  "U-B deep restored": [(MARK, WATCH_END, "    settled.value = rest;\n  }\n}, { deep: true });\n")],
  "U-AB both": [(MARK, GUARD, ""), (MARK, WATCH_END, "    settled.value = rest;\n  }\n}, { deep: true });\n")],
  "U-C open && chart": [(LOBBY, '      v-if="chart"', '      v-if="open && chart"')],
  "U-D ring unfrozen": [(MARK, "    self: selfAt.value,", "    self: props.place?.self ?? null,")],
}
sha = lambda p: hashlib.sha1(open(p, "rb").read()).hexdigest()
lines = []
for name, edits in BREAKS.items():
    files = {p for p, _, _ in edits}
    keep = {p: open(p).read() for p in files}
    before = {p: sha(p) for p in files}
    for p, a, b in edits:
        s = open(p).read(); assert s.count(a) == 1, (name, a); open(p, "w").write(s.replace(a, b))
    r = subprocess.run(["npx", "vitest", "run", "--reporter=verbose", "src/pencil/chrome/PlayerMark/PlayerMark.place.test.ts"], cwd=FE, capture_output=True, text=True)
    for p in files: open(p, "w").write(keep[p])
    ok = all(sha(p) == before[p] for p in files)
    rows = re.findall(r"^\s*([✓×]) .*?> (.+?)(?: \d+ms)?$", r.stdout, re.M)
    summ = re.search(r"Tests\s+(.+)", r.stdout)
    lines.append(f"## {name}  exit={r.returncode}  restored-sha1={'OK' if ok else 'MISMATCH'}  {summ.group(1).strip() if summ else ''}")
    lines += [f"  {m} {t}" for m, t in rows if m == "×" or name == "U0-none"]
open(OUT, "w").write("\n".join(lines) + "\n")
print("\n".join(lines))
