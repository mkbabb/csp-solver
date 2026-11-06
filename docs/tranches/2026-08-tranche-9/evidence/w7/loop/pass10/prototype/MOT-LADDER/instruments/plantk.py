"""critic plants (pass-8 LADDER critique). usage: plantk.py <fe> <plant>; prints touched rels; exit 3 = anchor missing."""
import sys, os
root, name = sys.argv[1], sys.argv[2]
touched = []
def edit(rel, old, new):
    p = os.path.join(root, rel); s = open(p).read()
    if old not in s:
        print(f"ANCHOR MISSING {name}: {rel}: {old[:60]!r}"); sys.exit(3)
    open(p, "w").write(s.replace(old, new, 1)); touched.append(rel)
def append(rel, text):
    p = os.path.join(root, rel); s = open(p).read()
    open(p, "w").write(s + text); touched.append(rel)
CSS = "src/assets/index.css"
APP = "src/App.vue"
BEAT0 = "  }, MOTION.rungs.leave);"
FADE = ".gallery-fade-leave-active {\n  transition: opacity var(--motion-leave) var(--verb-lift-ease);"
ATTR = "duration-[var(--motion-leave)]"
P = {
 "NONE": lambda: None,
 "K1": lambda: edit("src/games/shared/DigitCell.vue", 'if (revealArmed.value) vars["--reveal-delay"] = `${props.noiseDelay}ms`;', 'if (revealArmed.value) vars["--reveal-delay"] = `${props.noiseDelay}ms`;\n  if (revealArmed.value) vars["animation-duration"] = "50ms";'),
 "K2": lambda: append(CSS, "\n.board-cells {\n  --motion-leave: 10ms;\n}\n"),
 "K2b": lambda: append(CSS, "\nhtml {\n  --motion-leave: 10ms !important;\n}\n"),
 "K3": lambda: edit(APP, FADE, ".gallery-fade-leave-active {\n  transition: opacity calc(var(--motion-leave) / 4) var(--verb-lift-ease);"),
 "K4": lambda: edit(APP, FADE, ".gallery-fade-leave-active {\n  transition: opacity min(var(--motion-leave), 20ms) var(--verb-lift-ease);"),
 "K5": lambda: edit("src/pencil/chrome/AttributionCard/AttributionCard.vue", ATTR, "duration-75"),
 "K6": lambda: edit("src/pencil/chrome/AttributionCard/AttributionCard.vue", ATTR, "duration-[20ms]"),
 "K7": lambda: append(CSS, "\n.game-cell {\n  animation-duration: 50ms;\n}\n"),
 "K8": lambda: append(CSS, "\n@supports (display: grid) {\n  html .cell-reveal-animated {\n    animation-duration: 50ms;\n  }\n}\n"),
 "K9": lambda: append(CSS, "\n.board-cells {\n  & .cell-reveal-animated {\n    animation-duration: 50ms;\n  }\n}\n"),
 "K10": lambda: append(CSS, '\n[class~="cell-reveal-animated"] {\n  animation-duration: 50ms;\n}\n'),
 "K11": lambda: edit(APP, BEAT0, "  }, MOTION.rungs.leave && MOTION.rungs.whisper);"),
 "K12": lambda: edit(APP, BEAT0, "  }, (MOTION.rungs.leave, MOTION.rungs.whisper));"),
 "K13": lambda: edit(APP, BEAT0, "  }, (MOTION.rungs.leave) / 4);"),
 "K14": lambda: edit(APP, BEAT0, "  }, Math.min.call(null, MOTION.rungs.leave, 40));"),
 "K15": lambda: append("src/main.ts", '\ndocument.documentElement.style.setProperty("--motion-leave", "10ms");\n'),
 "K18": lambda: append(CSS, "\n@media (min-width: 1px) {\n  html .cell-reveal-animated {\n    animation-duration: 50ms;\n  }\n}\n"),
}

P["K16"] = lambda: edit(APP, BEAT0, "  }, [MOTION.rungs.leave, MOTION.rungs.whisper][1]);")
P["K17"] = lambda: edit(APP, BEAT0, "  }, MOTION.rungs.leave ? MOTION.rungs.whisper : MOTION.rungs.leave);")
P["K23"] = lambda: edit(CSS, "    60% {\n      transform: scale(1.1);\n    }", "    6% {\n      transform: scale(1.1);\n    }\n    10% {\n      transform: scale(1);\n      opacity: 1;\n    }")
if name not in P: print("unknown", name); sys.exit(2)
P[name]()
print(" ".join(touched))
