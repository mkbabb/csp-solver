"""crit-MOT-LADDER: my own disjunct / threshold mutations on the bank's gate. usage: dsabx.py <gate> <id> ; exit 3 = anchor not unique"""
import sys
p, mid = sys.argv[1], sys.argv[2]
M = {
 "M1-hole": ('(m[1] === "`" && /\\$\\{/.test(body) && TIME_HOLE.test(body));', "false;"),
 "M2-tmpl": ("      if (b.template)\n        for (const m of b.template.text.matchAll(", "      if (false)\n        for (const m of b.template.text.matchAll("),
 "M3-stale": ("  if (!files)\n    for (const [key, n] of Object.entries(roster))\n      if ((found.get(key) ?? 0) < n)", "  if (false)\n    for (const [key, n] of Object.entries(roster))\n      if ((found.get(key) ?? 0) < n)"),
 "M4-owners": ("const owners = universe.scopedSrc?.get(r.file) ?? [r.file];", "const owners = [r.file];"),
 "M5-neg": ("const TIME_TEXT = /^\\s*-?\\s*(?:\\d+\\.?\\d*|\\.\\d+)\\s*m?s\\s*$/;", "const TIME_TEXT = /^\\s*(?:\\d+\\.?\\d*|\\.\\d+)\\s*m?s\\s*$/;"),
 "M7-count": ("    if ((roster[key] ?? 0) < n)\n      bad.push(", "    if ((roster[key] ?? 0) < n - 1)\n      bad.push("),
 "M8-secs": ("const TIME_TEXT = /^\\s*-?\\s*(?:\\d+\\.?\\d*|\\.\\d+)\\s*m?s\\s*$/;", "const TIME_TEXT = /^\\s*-?\\s*(?:\\d+\\.?\\d*|\\.\\d+)\\s*ms\\s*$/;"),
}
a, b = M[mid]
s = open(p).read()
if s.count(a) != 1: print("ANCHOR", mid, s.count(a)); sys.exit(3)
open(p, "w").write(s.replace(a, b, 1)); print("mutated", mid)
