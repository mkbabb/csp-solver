# Builds the chair's §2.6 settle plant specs on THIS tree (pass6/instruments/viewport-law-2.6-settle.plants.ts):
# each plant block is inserted into boot() after `await page.addInitScript(installVisFrac);` of the
# settled spec (viewport-law.spec.ts with viewport-law-2.6-settle.diff applied by `patch`).
import re, sys
src = open(sys.argv[1]).read(); pl = open(sys.argv[2]).read(); out = sys.argv[3]
parts = re.split(r'// ── PLANT (\w+) ──\n', pl); anchor = 'await page.addInitScript(installVisFrac);'
for i in range(1, len(parts), 2):
    open(f"{out}/plant-{parts[i]}.spec.ts", 'w').write(src.replace(anchor, anchor + '\n' + parts[i + 1], 1))
