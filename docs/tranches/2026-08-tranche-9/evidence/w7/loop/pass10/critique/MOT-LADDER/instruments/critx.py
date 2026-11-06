"""crit-MOT-LADDER pass-10 class plants (X*) beside the pass-9 C plants. usage: critx.py <fe> <plant>"""
import sys, os
src = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "plantc.py")).read()
src = src.split('if name not in P:')[0]
exec(src)
OA = lambda v: (lambda: edit(DC, A1, A1 + '\n  if (revealArmed.value) Object.assign(vars, { "animation-duration": ' + v + ' });'))
P["X1"] = OA('"50MS"')          # C21 with an upper-case unit (CSS units are case-insensitive)
P["X2"] = OA('"5e1ms"')         # C21 in e-notation
P["X3"] = OA('"+50ms"')         # C21 with a leading plus
P["X4"] = OA('50 + "ms"')       # C21 built by arithmetic (the author's gap 2)
def x5():  # C23's class through a NUMBER: the parent's noise delay minus 150, the rostered `${props.noiseDelay}ms` text unmoved
    edit(BH, ':noise-delay="s.noiseDelays.get(String(pos)) ?? 0"', ':noise-delay="(s.noiseDelays.get(String(pos)) ?? 0) - 150"')
P["X5"] = x5
P["X6"] = lambda: append(CSS, "\n.game-cell {\n  animation-duration: 150MS;\n}\n")
P["X7"] = lambda: append(CSS, "\n.game-cell {\n  animation-duration: 1.5e2ms;\n}\n")
P["X8"] = lambda: append(CSS, "\n@keyframes cell-pop {\n  0% {\n    transform: scale(0);\n  }\n  10% {\n    transform: scale(1);\n  }\n  100% {\n    transform: scale(1);\n  }\n}\n.game-cell {\n  animation-name: cell-pop;\n}\n")
P["X9"] = lambda: append(CSS, "\n.game-cell {\n  ANIMATION-DURATION: 150ms;\n}\n")
P["X12"] = lambda: append(CSS, "\n.game-cell {\n  animation-iteration-count: 0.5;\n}\n")
P["X13"] = lambda: append(CSS, "\n.game-cell {\n  animation-iteration-count: 0;\n}\n")
P["X15"] = lambda: append(CSS, "\n.game-cell {\n  animation-timeline: --nope;\n}\n")
P["X16"] = lambda: append(CSS, "\n.game-cell {\n  animation-duration: auto;\n}\n")
P["X14"] = lambda: append(CSS, "\n.game-cell {\n  animation: cell-reveal 0.3s var(--ease-anticipatePop) 0s 0.5;\n}\n")
def x17():  # a scoped src stylesheet through the @pencil alias (the gate maps only @/ and relative)
    open(os.path.join(root, "src/pencil/xq.css"), "w").write(".game-cell {\n  animation: cell-reveal var(--motion-whisper) var(--verb-layDown-ease);\n}\n"); touched.append("src/pencil/xq.css")
    edit(BH, SC, '<style scoped src="@pencil/xq.css"></style>\n' + SC)
P["X17"] = x17
P["X18"] = lambda: append(CSS, "\n.game-cell {\n  animation: cell-reveal 0.3s var(--ease-anticipatePop) -.15s;\n}\n")
P["X19"] = lambda: append(CSS, "\n.game-cell {\n  animation: cell-reveal 0.3s var(--ease-anticipatePop) calc(-150ms);\n}\n")
P["X20"] = lambda: append(CSS, "\n.game-cell {\n  animation: cell-reveal 0.3s step-end;\n}\n")
P["X21"] = lambda: append(CSS, "\n.game-cell {\n  animation: cell-reveal 0.3s var(--ease-anticipatePop) -150MS;\n}\n")
P["X22"] = lambda: (edit(DC, "      familyClass,\n", "      familyClass,\n      'cell-' + 'quick',\n"), append(CSS, "\n.cell-quick {\n" + AY + "}\n"))
P["X23"] = lambda: append(CSS, "\n.sudoku-cell {\n" + AY + "}\n")
P["X24"] = lambda: append(CSS, "\n.game-cell {\n  animation-duration: .15s;\n}\n")
P["X25"] = lambda: append(CSS, "\n.game-cell {\n  animation: cell-reveal .15s var(--verb-layDown-ease);\n}\n")
P["X26"] = lambda: append(CSS, "\n.game-cell {\n  animation: cell-reveal 150MS var(--verb-layDown-ease);\n}\n")
P["X27"] = lambda: append(CSS, "\n.game-cell {\n  animation: cell-reveal var(--motion-dusk) var(--verb-layDown-ease);\n  animation-iteration-count: 0.5;\n}\n")
P["X28"] = lambda: append(CSS, "\n.game-cell {\n  animation: cell-reveal var(--motion-dusk) var(--verb-layDown-ease);\n  animation-timeline: --nope;\n}\n")
P["X29"] = lambda: append(CSS, "\n.game-cell {\n  animation: cell-reveal var(--motion-dusk) var(--verb-layDown-ease) -.2s;\n}\n")
P["X31"] = lambda: edit(CSS, "animation: cell-reveal 0.3s var(--ease-anticipatePop);", "animation: cell-reveal .15s var(--ease-anticipatePop);")
P["X32"] = lambda: edit(CSS, "animation: cell-reveal 0.3s var(--ease-anticipatePop);", "animation: cell-reveal 0.3s var(--ease-anticipatePop);\n    animation-iteration-count: 0.5;")
if name not in P: print("unknown", name); sys.exit(2)
P[name]()
print(" ".join(touched))
