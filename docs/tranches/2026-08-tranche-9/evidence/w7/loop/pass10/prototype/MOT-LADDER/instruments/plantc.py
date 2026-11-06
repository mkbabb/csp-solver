"""pass-9 critic plants on MOT-LADDER. usage: plantc.py <fe> <plant>; prints touched rels; exit 3 = anchor missing."""
import sys, os
root, name = sys.argv[1], sys.argv[2]
touched = []
def edit(rel, old, new):
    p = os.path.join(root, rel); s = open(p).read()
    if old not in s:
        print(f"ANCHOR MISSING {name}: {rel}: {old[:60]!r}"); sys.exit(3)
    open(p, "w").write(s.replace(old, new, 1)); touched.append(rel)
def append(rel, text):
    p = os.path.join(root, rel); s = open(p).read(); open(p, "w").write(s + text); touched.append(rel)
CSS = "src/assets/index.css"; APP = "src/App.vue"; BH = "src/games/shared/BoardHost.vue"; DC = "src/games/shared/DigitCell.vue"
SC = '<style scoped>\n'
FADE = ".gallery-fade-leave-active {\n  transition: opacity var(--motion-leave) var(--verb-lift-ease);"
W = "var(--motion-" + "whisper)"
STY = "          :style=\"{\n            ...model.authorInk.value[String(pos)],"
P = {
 "NONE": lambda: None,
 "C1": lambda: edit(BH, SC, SC + ".game-cell {\n  animation-duration: " + W + ";\n}\n"),
 "C2": lambda: edit(BH, SC, SC + ":deep(.game-cell) {\n  animation-duration: " + W + ";\n}\n"),
 "C3": lambda: append(CSS, "\n.game-cell {\n  animation-delay: -150ms;\n}\n"),
 "C5": lambda: edit("index.html", "  </head>", "    <style>\n      .game-cell {\n        animation-duration: 150ms;\n      }\n    </style>\n  </head>"),
 "C6": lambda: edit(BH, STY, "          :style=\"{\n            'animation-duration': '150ms',\n            ...model.authorInk.value[String(pos)],"),
 "C7": lambda: append("src/main.ts", "\nconst rk = \"leave\";\ndocument.documentElement.style.setProperty(`--motion-${rk}`, \"10ms\");\n"),
 "C8": lambda: append("src/main.ts", "\ndocument.documentElement.style.cssText += \"--motion-" + "leave: 10ms\";\n"),
 "C9": lambda: edit(APP, FADE, ".gallery-fade-leave-active {\n  transition: opacity calc(var(--motion-leave) * 0.25) var(--verb-lift-ease);"),
 "C10": lambda: edit(APP, FADE, ".gallery-fade-leave-active {\n  transition: opacity calc(var(--motion-leave) - 150ms) var(--verb-lift-ease);"),
 "C11a": lambda: append(CSS, "\n.game-cell {\n  animation-duration: 299ms;\n}\n"),
 "C11b": lambda: append(CSS, "\n.game-cell {\n  animation-duration: 300ms;\n}\n"),
 "C13": lambda: append(CSS, "\n.game-cell {\n  animation-timing-function: steps(1, end);\n}\n"),
 "C14": lambda: append(CSS, "\n.game-cell {\n  animation: none;\n}\n"),
 "C17": lambda: (edit(BH, STY, "          class=\"cell-quick\"\n" + STY), append(CSS, "\n.cell-quick {\n  animation-duration: " + W + ";\n}\n")),
 "C18": lambda: append(CSS, "\n.game-cell {\n  --reveal-delay: -150ms;\n}\n"),
 "K7r": lambda: append(CSS, "\n.game-cell {\n  animation-duration: " + W + ";\n}\n"),
}
A1 = 'if (revealArmed.value) vars["--reveal-delay"] = `${props.noiseDelay}ms`;'
P["C19"] = lambda: edit(DC, A1, A1 + '\n  if (revealArmed.value) vars[["animation", "duration"].join("-")] = "50ms";')
P["C21"] = lambda: edit(DC, A1, A1 + '\n  if (revealArmed.value) Object.assign(vars, { "animation-duration": "50ms" });')
P["C22"] = lambda: edit(DC, A1, A1 + '\n  if (revealArmed.value) vars.animationDuration = "50ms";')
P["C23"] = lambda: edit(DC, A1, A1 + '\n  if (revealArmed.value) vars["--reveal-delay"] = "-150ms";')
P["C24"] = lambda: append(CSS, "\n.game-cell {\n  --cq: 150ms;\n  animation-duration: var(--cq);\n}\n")
P["C25"] = lambda: append(CSS, "\n:root {\n  --cq: 150ms;\n}\n.game-cell {\n  animation-duration: var(--cq);\n}\n")
P["C26"] = lambda: append(CSS, "\n.game-cell {\n  animation-duration: var(--cq, 150ms);\n}\n")
VB = "  animation-duration: " + W + ";\n  animation-timing-function: var(--verb-layDown-ease);\n"
P["C1v"] = lambda: edit(BH, SC, SC + ".game-cell {\n" + VB + "}\n")
P["C17v"] = lambda: (edit(BH, STY, "          class=\"cell-quick\"\n" + STY), append(CSS, "\n.cell-quick {\n" + VB + "}\n"))
P["K7rv"] = lambda: append(CSS, "\n.game-cell {\n" + VB + "}\n")
P["C2v"] = lambda: edit(BH, SC, SC + ":deep(.game-cell) {\n" + VB + "}\n")
def c27():
    edit(DC, '<script setup lang="ts">\n', '<script setup lang="ts">\nimport { MOTION } from "@pencil/config/pencilConfig";\n')
    edit(DC, A1, A1 + '\n  if (revealArmed.value) vars["animation-duration"] = `${MOTION.rungs.whisper}ms`;')
P["C27"] = c27
P["C3v"] = lambda: append(CSS, "\n.game-cell {\n  animation-delay: calc(var(--motion-whisper) * -1);\n}\n")
P["C3w"] = lambda: append(CSS, "\n.game-cell {\n  animation-delay: calc(var(--motion-whisper) * -1);\n  animation-timing-function: var(--verb-layDown-ease);\n}\n")
P["C28"] = lambda: append(CSS, "\nhtml .gallery-fade-leave-active {\n  transition: opacity " + W + " var(--verb-layDown-ease);\n}\n")
P["CK7rv"] = P["K7rv"]
AW = "  animation: cell-reveal " + W + " var(--verb-layDown-ease) backwards;\n"
AX = "  animation: cell-reveal " + W + " var(--ease-anticipatePop) backwards;\n"
P["C1w"] = lambda: edit(BH, SC, SC + ".game-cell {\n" + AW + "}\n")
P["C1x"] = lambda: edit(BH, SC, SC + ".game-cell {\n" + AX + "}\n")
P["C17w"] = lambda: (edit(BH, STY, "          class=\"cell-quick\"\n" + STY), append(CSS, "\n.cell-quick {\n" + AW + "}\n"))
P["C17x"] = lambda: (edit(BH, STY, "          class=\"cell-quick\"\n" + STY), append(CSS, "\n.cell-quick {\n" + AX + "}\n"))
P["CK7rw"] = lambda: append(CSS, "\n.game-cell {\n" + AW + "}\n")
AY = "  animation: cell-reveal " + W + " var(--verb-layDown-ease);\n"
P["C1y"] = lambda: edit(BH, SC, SC + ".game-cell {\n" + AY + "}\n")
P["C17y"] = lambda: (edit(BH, STY, "          class=\"cell-quick\"\n" + STY), append(CSS, "\n.cell-quick {\n" + AY + "}\n"))
P["CK7ry"] = lambda: append(CSS, "\n.game-cell {\n" + AY + "}\n")
P["C24y"] = lambda: append(CSS, "\n.game-cell {\n  --cq: 150ms;\n  animation: cell-reveal var(--cq) var(--verb-layDown-ease);\n}\n")
P["C28y"] = lambda: append(CSS, "\nhtml .gallery-fade-leave-active {\n  transition: opacity " + W + " var(--verb-lift-ease);\n}\n")
if name not in P: print("unknown", name); sys.exit(2)
P[name]()
print(" ".join(touched))
