import sys
p=sys.argv[1]; s=open(p).read()
def rep(old,new):
    global s
    assert s.count(old)==1, old[:60]; s=s.replace(old,new)
rep('''  "clock-alias":
    "LADDER (pass 8) · a bare alias of a clock (`const W = MOTION.rungs.whisper`; `W >> 2`) is a clock read",''',
'''  "clock-alias":
    "LADDER (pass 8) · a bare alias of a clock (`const W = MOTION.rungs.whisper`; `W >> 2`) is a clock read",
  "clock-context":
    "LADDER (pass 9, PROPOSED) · a clock read in a value-choosing context (`&&`/`||`/`??`, ternary, comma, indexed literal, `.call/.apply`) carries `ctx`",
  "obj-bracket":
    "LADDER (pass 9, PROPOSED) · a bracket write of a literal key on a style object (`vars[\\"animation-duration\\"] = …`) is a write",''')
rep('''  // the chair p9 (typed-om; WALK's fork-parity''','''  // LADDER (pass 9, PROPOSED, K1): a literal-keyed bracket write on ANY object (a `:style` object
  // built in script: `vars["animation-duration"] = "50ms"`) — `.style[…]` is the arm above
  if (on("obj-bracket"))
    for (const m of s.matchAll(
      /([\\w$)\\]]+)\\s*\\[\\s*(['"`])([^'"`$]+)\\2\\s*\\]\\s*=(?!=)\\s*([^;\\n]+)/g,
    ))
      if (!/(?:^|\\.)style$/.test(m[1]) && kebab(m[3]) === prop)
        out.push({ kind: "script-object-bracket", prop, value: carry(m[4]), line: L(m.index) });
  // the chair p9 (typed-om; WALK's fork-parity''')
open(p,'w').write(s); print("ok")
