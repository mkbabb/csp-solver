# port.py <tree frontend> <target frontend>: carry NOTE-LEDGER pass-8's script/spec changes onto the union
import sys, os, re, shutil
W, U = sys.argv[1], sys.argv[2]
def rd(p): return open(p).read()
def block(t, a, b, inclusive_b=False):
    i = t.index(a); j = t.index(b, i)
    return t[i:j + (len(b) if inclusive_b else 0)]
# 1. font coverage: deriveGroup extraction + the pin + the self-test, all lifted from the tree
wt, ut = rd(f"{W}/scripts/check-font-coverage.mjs"), rd(f"{U}/scripts/check-font-coverage.mjs")
# the union's check 3 loop body -> the tree's call; the function text from the tree
old3 = block(ut, "  // 3. RENDERED CENSUS ⊆ CORPUS.", "  banked.push(\n")
new3 = block(wt, "  // 3. RENDERED CENSUS ⊆ CORPUS.", "  banked.push(\n")
ut = ut.replace(old3, new3)
fn = block(wt, "/** Check 3 for ONE group:", "const css = readFileSync(join(ROOT, INDEX_CSS), \"utf8\");")
ut = ut.replace("const css = readFileSync(join(ROOT, INDEX_CSS), \"utf8\");", fn + "const css = readFileSync(join(ROOT, INDEX_CSS), \"utf8\");", 1)
oldpin = block(ut, "// THE FLAG IS PINNED (NOTE-LEDGER row 4", "problems.push(...unclosed(FACES));", True)
newpin = block(wt, "// THE FLAG IS PINNED (NOTE-LEDGER, pass-6", "problems.push(...unclosed(FACES));", True)
ut = ut.replace(oldpin, newpin)
oldst = block(ut, "// The flag's own plants (`--self-test`)", "if (problems.length) {")
newst = block(wt, "// The pin's own plants (`--self-test`).", "if (problems.length) {")
ut = ut.replace(oldst, newst)
open(f"{U}/scripts/check-font-coverage.mjs", "w").write(ut)
# 2. ink pressure: the reserve section and its imports, lifted from the tree
wt, ut = rd(f"{W}/scripts/check-ink-pressure.mjs"), rd(f"{U}/scripts/check-ink-pressure.mjs")
oldimp = 'import { reserveLaw } from "./shape/reserve-law.mjs";'
newimp = block(wt, 'import { createHash } from "node:crypto";', '} from "./shape-census.mjs";', True)
assert ut.count(oldimp) == 1; ut = ut.replace(oldimp, newimp)
ut = ut.replace(block(ut, "/* ── the note's reserve (T9-W7 §7", "/* ── closure 5: the cross-theme rank"),
                block(wt, "/* ── the note's reserve (T9-W7 §7", "/* ── closure 5: the cross-theme rank"))
oldcase = block(ut, "    // THE NOTE'S RESERVE, every plant on the SFC's own bytes", "    // CLOSURE 5, three modes.")
ut = ut.replace(oldcase, "")
oldmute = block(ut, "  const mute = [];\n  for (const [name, run] of cases) {", "  }\n", True)
newmute = block(wt, "  const mute = [];\n  for (const [name, run] of cases) {", "  // The fixture's two bad files")
ut = ut.replace(oldmute, newmute)
open(f"{U}/scripts/check-ink-pressure.mjs", "w").write(ut)
# 3. the spec and its manifest row
shutil.copy(f"{W}/e2e/note-reserve.spec.ts", f"{U}/e2e/note-reserve.spec.ts")
pt = rd(f"{U}/scripts/check-pw-projects.mjs")
if '"note-reserve.spec.ts"' not in pt:
    pt = pt.replace('  "multiplayer.spec.ts",\n', '  "multiplayer.spec.ts",\n  "note-reserve.spec.ts",\n', 1)
open(f"{U}/scripts/check-pw-projects.mjs", "w").write(pt)
print("ported")
