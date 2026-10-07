import sys, os
W, S = sys.argv[1], sys.argv[2]
t = open(W + "/e2e/zone-grammar.spec.ts").read()
a = t.index('test.describe("the foot stands on the safe-area inset (chair §6.1)", () => {')
b = t.index('/** The standing question over the WHOLE case')
block = t[a:b].rstrip() + "\n"
s10 = open(S + "/s10/web/frontend/e2e/zone-grammar.spec.ts").read()
first = 'import { test, expect, devices, type Page } from "@playwright/test";\n'
assert s10.startswith(first)
imports = '''import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
// CTRL-RULE pass 8 (portable rows) — the ONE shape library at its product home (registry-v7 §2.4).
// @ts-expect-error — the ONE shape library is an .mjs product home with no declaration (registry-v7 §2.4)
import { elementSites, REGIMES, effectiveAt, sabotage } from "../scripts/shape-census.mjs";

/** The package root, for the browserless source arm (it reads the tree, not the page). */
const FE = join(fileURLToPath(new URL(".", import.meta.url)), "..");
'''
head = '''
/** CTRL-RULE pass 8 · INTAKE-22 row 28's inset law, PORTED onto the merged §10 page (its foot is
 *  TAPE's flex-column foot, `calc(0.75rem + env())` at the dock; the rail's hover-note berth
 *  `max(3.5rem, env())` is one of the source arm's decoys, since at the rail the case stands clear
 *  of the screen's edge). The three arms are the ruled page's rows by sha, keyed on `#card-foot`
 *  and nothing of the ruled page's own. */
'''
new = s10.replace(first, first + imports, 1).rstrip() + "\n" + head + block
for d in ("s10-orig", "s10-new"):
    os.makedirs(S + "/" + d + "/web/frontend/e2e", exist_ok=True)
open(S + "/s10-orig/web/frontend/e2e/zone-grammar.spec.ts", "w").write(s10)
open(S + "/s10-new/web/frontend/e2e/zone-grammar.spec.ts", "w").write(new)
print(len(block), block.count("  test("))
