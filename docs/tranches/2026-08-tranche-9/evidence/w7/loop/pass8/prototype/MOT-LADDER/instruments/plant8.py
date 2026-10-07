"""MOT-LADDER pass 8 plant applier. usage: plant8.py <web/frontend root> <plant>. Exit 3 = anchor missing."""
import sys, os
root, name = sys.argv[1], sys.argv[2]
def edit(rel, old, new, count=1):
    p = os.path.join(root, rel)
    s = open(p).read()
    if old not in s:
        print(f"ANCHOR MISSING {name}: {rel}: {old[:60]!r}"); sys.exit(3)
    open(p, "w").write(s.replace(old, new, count))
def append(rel, text):
    p = os.path.join(root, rel)
    s = open(p).read() if os.path.exists(p) else ""
    open(p, "w").write(s + text)
REVEAL = "animation: cell-reveal 0.3s var(--ease-anticipatePop);"
P = {
 "NONE": lambda: None,
 "L7a": lambda: append("src/assets/index.css", "\nhtml .cell-reveal-animated {\n  animation: cell-reveal var(--motion-whisper) var(--ease-anticipatePop);\n}\n"),
 "L7b": lambda: append("src/games/shared/scene.css", "\n.cell.cell-reveal-animated {\n  animation: cell-reveal var(--motion-whisper) var(--ease-anticipatePop);\n}\n"),
 "L7e": lambda: append("src/games/shared/scene.css", "\n.game-cell.cell-reveal-animated {\n  animation: cell-reveal var(--motion-whisper) var(--ease-anticipatePop);\n}\n"),
 "L7f": lambda: append("src/assets/index.css", "\n.game-cell.cell-reveal-animated {\n  animation: cell-reveal var(--motion-whisper) var(--ease-anticipatePop);\n}\n"),
 "L7c": lambda: append("src/assets/index.css", "\n:is(.board, .cell-reveal-animated) {\n  animation: cell-reveal var(--motion-whisper) var(--ease-anticipatePop);\n}\n"),
 "L7d": lambda: append("src/assets/index.css", "\n* {\n  animation-duration: 50ms;\n}\n"),
 "L4": lambda: edit("index.html", "</head>", "<style>.cell-reveal-animated{animation-duration:50ms;}</style>\n  </head>"),
 "L4p": lambda: append("public/plant-l4p.css", ".cell-reveal-animated{animation-duration:50ms}\n"),
 "L1": lambda: edit("src/assets/index.css", REVEAL, REVEAL + "\n    animation-duration: var(--motion-whisper);"),
 "L2": lambda: append("src/games/shared/scene.css", "\n.cell-reveal-animated {\n  animation-duration: var(--motion-whisper);\n}\n"),
 "L3": lambda: append("src/assets/index.css", "\n.cell-reveal-animated { animation-duration: 50ms }\n"),
 "L5": lambda: edit("src/pencil/sheet/AnswerKeyLaminate.vue", "const LIFT_MS = MOTION.rungs.leave;", "const LIFT_MS = MOTION.rungs.whisper;"),
 "L6": lambda: edit("src/App.vue", "  }, MOTION.rungs.leave);", "  }, MOTION.rungs.whisper);"),
 "M1": lambda: edit("src/pencil/grid/HandDrawnGrid/usePathAnimation.ts", "        duration: MOTION.rungs.whisper,", "        duration: Math.min(MOTION.rungs.whisper, 40),"),
 "M2": lambda: edit("src/pencil/grid/HandDrawnGrid/usePathAnimation.ts", "        duration: MOTION.rungs.whisper,", '        duration: MOTION.rungs["whisper"] / 3,'),
 "M3": lambda: edit("src/pencil/grid/HandDrawnGrid/usePathAnimation.ts", "        duration: MOTION.rungs.whisper,", "        duration: MOTION.rungs.whisper >> 2,"),
 "E1": lambda: append("src/main.ts", '\ndocument.documentElement.style.setProperty("--ease-anticipatePop", "ease-in");\n'),
 "F1": lambda: edit("src/pencil/chrome/GameGallery/GameCard.vue", "\n.live-face-fit {\n  position: absolute;", "\n.live-face-fit {\n  --live-fit: 0.99;\n  position: absolute;"),
 "NN1": lambda: append("src/assets/index.css", "\nhtml .cell-reveal-animated {\n  animation: cell-reveal var(--motion-dusk) var(--ease-anticipatePop);\n}\n"),
}
if name not in P:
    print("unknown plant", name); sys.exit(2)
P[name]()
print("planted", name)
