import sys
tree, mine = sys.argv[1], sys.argv[2]
fe = tree + "/web/frontend/"
src = open(mine + "/web/frontend/e2e/zone-grammar.spec.ts").read()
block = src[src.index("\n// PASS 10 · BOARD INK IS THE TRUTH"):]
p = fe + "e2e/zone-grammar.spec.ts"
s = open(p).read()
assert "PASS 10 · BOARD INK IS THE TRUTH" not in s
open(p, "w").write(s.rstrip("\n") + "\n" + block)
print("zone-grammar appended", block.count("\n"), "lines")
p = fe + "src/games/shared/GameControlPanel.vue"
s = open(p).read()
R = [
("""  // arms first, a pristine board acts instantly. PASS 9 (CHAIR-RULINGS p9 §8): dirty is PLAYER
  // INK SINCE THE DEAL (the composable's `inkSinceDeal`), not undo-depth, which counts the deal.""",
"""  // arms first, a pristine board acts instantly. PASS 10 (CHAIR-RULINGS p10 §7): dirty is the
  // PLAYER INK THE BOARD HOLDS (the composable's `boardInk`), across a reload and after a Clear;
  // not undo-depth, which counts the deal, and not the session's log, which a reload empties."""),
("ink is pristine too (pass 9): `isDirty` arrives as `inkSinceDeal`, so it solves on one click.",
 "ink is pristine too (pass 10): `isDirty` arrives as `boardInk`, so it solves on one click."),
("""     the band's edge puts the widest note 1.54 px into them (71 px²). */
  margin-top: calc(7.5rem * sin(1.5deg) + 0.5px);""",
"""     the band's edge puts the widest note 1.54 px into them (71 px²). PASS 10 (CHAIR §8): the
     two literals are the tape seed's frozen inputs, read from their one home in index.css. */
  margin-top: calc(var(--washi-wide-cap) / 2 * sin(var(--washi-tilt-band)) + 0.5px);"""),
]
for a, b in R:
    n = s.count(a)
    print("panel replace count", n, repr(a[:50]))
    assert n == 1
    s = s.replace(a, b, 1)
open(p, "w").write(s)
