"""disjunct / threshold / guard sabotage of the pass-9 element-reach clause. usage: dsab.py <gate-path> <id>"""
import sys
p, i = sys.argv[1], sys.argv[2]
s = open(p).read()
M = {
 "D1-bound-eps": ("if (r.ms >= was) continue;\n      const kr = live.get(k);", "if (r.ms >= was - 1) continue;\n      const kr = live.get(k);"),
 "D2-longhand": ("if (!(r.longhand || r.fam === \"animation\" || kr.term === r.term)) continue;", "if (!(r.fam === \"animation\" || kr.term === r.term)) continue;"),
 "D3-famanim": ("if (!(r.longhand || r.fam === \"animation\" || kr.term === r.term)) continue;", "if (!(r.longhand || kr.term === r.term)) continue;"),
 "D4-term": ("if (!(r.longhand || r.fam === \"animation\" || kr.term === r.term)) continue;", "if (!(r.longhand || r.fam === \"animation\")) continue;"),
 "D5-scoped": ("    if (r.scoped && r.file !== file) continue;\n", ""),
 "D6-carried": ("        hit = mayMatch(sel, carried(el), els);", "        hit = mayMatch(sel, el, els);"),
 "D7-catch": ("        hit = true; // a selector the library cannot read may land anywhere", "        hit = false;"),
 "D8-fam": ("      if (!kr || kr.fam !== r.fam) continue;", "      if (!kr) continue;"),
}
a, b = M[i]
n = s.count(a)
if n < 1: print("ANCHOR MISSING", i); sys.exit(3)
open(p, "w").write(s.replace(a, b))
print(i, "replaced", n)
