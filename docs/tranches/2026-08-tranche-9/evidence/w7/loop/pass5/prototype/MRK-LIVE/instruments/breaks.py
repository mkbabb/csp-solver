# One break per call: python3 breaks.py <name> apply|restore
import sys, hashlib, shutil, os
W="/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-35/web/frontend/"
S=os.path.dirname(os.path.abspath(__file__))
B={
 "B1-publisher": ("src/App.vue", "  --toggle-bleed: calc((var(--toggle-hit) - var(--toggle-size)) / 2);\n", ""),
 "B2-motion-note": ("src/assets/index.css", "@property --motion-note {\n  syntax: \"<time>\";\n  inherits: true;\n  initial-value: 250ms;\n}\n", ""),
 "B3-fallback": ("src/pencil/celestial/DarkModeToggle.vue", "  inset: var(--toggle-bleed);\n", "  inset: var(--toggle-bleed, 0px);\n"),
 "B4-departure": ("src/pencil/chrome/FocusRing.vue", "  const live = document.activeElement;\n  if (el && (!el.isConnected || !live || live === document.body)) {\n    target.value = null;\n    ro?.disconnect();\n    rect.value = null;\n    return;\n  }\n", ""),
 "B5-tier1": ("src/games/shared/gameCell.css", "  stroke-width: 5;\n  stroke-opacity: 0.65;\n", "  stroke-width: 5;\n  stroke-opacity: 0.55;\n"),
 "B6-no-ring": ("src/pencil/chrome/FocusRing.vue", '    v-if="rect && frames.length"\n', '    v-if="rect && frames.length && false"\n'),
 "B8-shadow-note": ("src/assets/index.css", "@layer base {\n  * {\n", ":root {\n  --motion-note: 0ms;\n}\n\n@layer base {\n  * {\n"),
 "B7-dup-reg": ("src/assets/index.css", "@layer base {\n  * {\n", "@property --motion-note {\n  syntax: \"<time>\";\n  inherits: true;\n  initial-value: 250ms;\n}\n\n@layer base {\n  * {\n"),
}
name, act = sys.argv[1], sys.argv[2]
f, old, new = B[name]; p = W + f; bak = f"{S}/{name}.bak"
sha = lambda x: hashlib.sha1(open(x,'rb').read()).hexdigest()
if act == "apply":
    shutil.copy(p, bak); s = open(p).read()
    n = s.count(old); assert n >= 1, f"anchor missing {name}"
    s = s.replace(old, new, 1); open(p,'w').write(s)
    print(f"{name} APPLIED to {f} (anchor x{n}); pre sha1 {sha(bak)}")
else:
    pre = sha(bak); shutil.copy(bak, p); os.remove(bak)
    print(f"{name} RESTORED {f}: sha1 {sha(p)} == pre {pre}: {sha(p)==pre}")
