"""critic plants round 2 (rung-valued, so B1 cannot red them incidentally)."""
import sys, os
root, name = sys.argv[1], sys.argv[2]
def append(rel, text):
    p = os.path.join(root, rel); s = open(p).read(); open(p, "w").write(s + text); print(rel)
CSS = "src/assets/index.css"
P = {
 "K7r": lambda: append(CSS, "\n.game-cell {\n  animation-duration: var(--motion-whisper);\n}\n"),
 "K7s": lambda: append(CSS, "\n.board-cells .game-cell {\n  animation-duration: var(--motion-whisper);\n}\n"),
}
P[name]()
