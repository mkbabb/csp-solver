"""pass-10 disjunct / guard / threshold sabotage of every clause MOT-LADDER owns in check-motion-bands.mjs.
usage: dsab10.py <gate-path> <id>   (exit 3 = anchor missing; prints the count replaced)"""
import sys
p, i = sys.argv[1], sys.argv[2]
s = open(p).read()
M = {
 # the pass-9 element clause (the critic's D1-D8, re-anchored on the pass-10 text)
 "D1-bound-eps": ("if (r.ms >= was) continue;\n      const kr = live.get(k);", "if (r.ms >= was - 1) continue;\n      const kr = live.get(k);"),
 "D2-longhand": ('if (!(r.longhand || r.fam === "animation" || kr.term === r.term)) continue;', 'if (!(r.fam === "animation" || kr.term === r.term)) continue;'),
 "D3-famanim": ('if (!(r.longhand || r.fam === "animation" || kr.term === r.term)) continue;', 'if (!(r.longhand || kr.term === r.term)) continue;'),
 "D4-term": ('if (!(r.longhand || r.fam === "animation" || kr.term === r.term)) continue;', 'if (!(r.longhand || r.fam === "animation")) continue;'),
 "D5-root": ("      if (foreign && !deep && !reach.reaches(r.file, file, el)) continue;\n", ""),
 "E27-kf-sig": ("(x) => x.key === `${rel} :: ${k}` && x.sig === now.get(k),", "(x) => x.key === `${rel} :: ${k}`,"),
 "E26-kf-cite": ('if (row && /CHAIR-RULINGS|critique|registry-v\\d|census\\//.test(row.why ?? "")) {', "if (row) {"),
 "E28-kf-terms": ("const hits = [...now.keys()].filter((k) => terms.has(k));", "const hits = [...now.keys()];"),
 "E29-kf-equal": ("if (!then.has(k) || then.get(k) === now.get(k)) continue;", "if (!then.has(k)) continue;"),
 "D5b-noreach": ("    if (foreign && !reach) continue;\n", ""),
 "D6-carried": ("        hit = mayMatch(sel, carried(el), els);", "        hit = mayMatch(sel, el, els);"),
 "D7-catch": ("        hit = true; // a selector the library cannot read may land anywhere", "        hit = false;"),
 "D8-fam": ("      if (!kr || kr.fam !== r.fam) continue;", "      if (!kr) continue;"),
 # the component tree
 "E1-deep-off": ('foreign && /:deep\\(|::v-deep/.test(sel) && reach.deepReaches(r.file, file);', 'false;'),
 "E2-deep-any": ('foreign && /:deep\\(|::v-deep/.test(sel) && reach.deepReaches(r.file, file);', 'foreign && /:deep\\(|::v-deep/.test(sel);'),
 "E3-fallthrough": ("const ft = reach ? reach.fallThrough(rel).map((x) => x.cls) : [];", "const ft = [];"),
 # 2d, the element's clock
 "E5-prm": ("  if (d.prm) return null;\n", ""),
 "E6-house": ("    return rest ? `sets the curve", "    return true ? `sets the curve"),
 "E7-csswide": ("const CSS_WIDE = /^(?:none|initial|unset|revert|revert-layer|inherit)$/;", "const CSS_WIDE = /^(?:none)$/;"),
 "E8-negmul": ("|var\\(|calc\\()|\\*\\s*-\\s*\\d/.test(v)", "|var\\(|calc\\()/.test(v)"),
 "E9-negshort": (": /(?:^|\\s)-\\d+(?:\\.\\d+)?m?s\\b/.test(v);", ": false;"),
 "E11-retune": ("if (!cut || retuned.has(d.key)) continue;", "if (!cut) continue;"),
 "E12-clockfam": ("if (!h || h.fam !== d.fam) continue;", "if (!h) continue;"),
 "E13-keyframes": ('if (sel.startsWith("@") || r.ctx.some((c) => /^@(?:-\\w+-)?keyframes\\b/.test(c)))', 'if (sel.startsWith("@"))'),
 # local token
 "E14-lowest": ("if (!into.has(m[1]) || ms < into.get(m[1])) into.set(m[1], ms);", "if (!into.has(m[1]) || ms > into.get(m[1])) into.set(m[1], ms);"),
 "E14b-own": ("  return timesIn(scan, HERMETIC ? new Map() : new Map(ESTATE_TIMES));", "  return HERMETIC ? new Map() : new Map(ESTATE_TIMES);"),
 # script time
 "E16-count": ("    if ((roster[key] ?? 0) < n)\n", "    if (roster[key] === undefined)\n"),
 "E18-template": ("          parts.push(m[2]);\n    } else parts.push(text);", "          void m;\n    } else parts.push(text);"),
 "E19-stale": ("      if ((found.get(key) ?? 0) < n)\n", "      if (false)\n"),
 "E10-steps": ("    !/-delay$/.test(d.prop) &&\n    /\\bsteps\\(|", "    false &&\n    /\\bsteps\\(|"),
 "E17-hole": ("          TIME_TEXT.test(body) ||\n          (m[1] === \"`\" && /\\$\\{/.test(body) && TIME_HOLE.test(body));", "          TIME_TEXT.test(body);"),
 "E21-consumer": ("!(r.rung || r.key || r.ts || r.consumer))", "!(r.rung || r.key || r.ts))"),
 "E22-fit-row": ('if (!fit || fit.subject !== "--live-fit")', 'if (false)'),
 "E23-dip": ("if (pres[k] !== dip.pin.presets[k])", "if (false)"),
 "E24-door": ("else if (mass < door.mass)", "else if (false)"),
 "E25-types": ('const ms = mon("roster-types") && ROSTER_TYPES[path] ? null : leaves[path];', "const ms = leaves[path];"),
 "E20-neg-text": ("const TIME_TEXT = /^\\s*-?\\s*(?:", "const TIME_TEXT = /^\\s*(?:"),
}
a, b = M[i]
n = s.count(a)
if n < 1:
    print("ANCHOR MISSING", i); sys.exit(3)
open(p, "w").write(s.replace(a, b))
print(i, "replaced", n)
