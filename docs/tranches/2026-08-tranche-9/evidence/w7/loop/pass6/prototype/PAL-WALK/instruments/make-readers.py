# PAL-WALK pass 6: the §C READER used on the control and on PAL-TIN's tree (namectl.spec.ts) is
# e2e/peer-walk.spec.ts with every `expect(t.…)` line stripped and the ring's computed colour
# printed beside the name's; diag.spec.ts adds the bare-only disagreement column. Generated, not banked.
import sys, re
W = sys.argv[1]
s = open(W + "/e2e/peer-walk.spec.ts").read()
s = re.sub(r"      expect\(t\.[^\n]*\n", "", s)
s = s.replace('"${await label.textContent()}" in ${t.spec}', '"${await label.textContent()}" in ${t.spec} (ring ${ring})')
open(W + "/.palwalk6/inst/namectl.spec.ts", "w").write(s)
