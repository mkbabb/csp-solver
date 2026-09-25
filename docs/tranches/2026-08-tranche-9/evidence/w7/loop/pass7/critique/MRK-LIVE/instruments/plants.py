import sys
P=sys.argv[1]; name=sys.argv[2]
def edit(f, old, new):
    p=P+"/"+f; s=open(p).read(); assert s.count(old)>=1, (name, f); s=s.replace(old,new,1); open(p,"w").write(s)
def append(f, txt):
    p=P+"/"+f; s=open(p).read(); open(p,"w").write(s+txt)
GC="src/games/shared/gameCell.css"
if name=="X4":   # pass-6 critic's plant
    edit("src/pencil/chrome/FocusRing.vue", "  stroke: var(--ring-ink);\n}", "  stroke: var(--ring-ink);\n  opacity: 0.15;\n}")
elif name=="X4b":
    edit(GC, ".cell-ghost.is-active {", ".cell-ghost.is-active {\n  opacity: 0.2 !important;")
elif name=="X5":
    edit("src/pencil/sheet/AnswerKeyLaminate.vue", "<template>", '<template>\n  <i style="animation-duration: var(--motion-note, 280ms)"></i>')
elif name=="NOPREF":  # the ring faint for every reader who has NOT asked for reduced motion
    append(GC, "\n@media (prefers-reduced-motion: no-preference) {\n  .focus-ring { opacity: 0.15 !important; }\n  .cell-ghost.is-active { opacity: 0.2 !important; }\n}\n")
elif name=="COARSE":  # faint on a coarse primary pointer (a tablet with a keyboard)
    append(GC, "\n@media (pointer: coarse) {\n  .focus-ring { opacity: 0.15 !important; }\n  .cell-ghost.is-active { opacity: 0.2 !important; }\n}\n")
elif name=="MORE":  # faint only in the prefers-contrast: more arm
    append(GC, "\n@media (prefers-contrast: more) {\n  .focus-ring { opacity: 0.15 !important; }\n}\n")
elif name=="DARKX4":
    append(GC, "\n.dark .focus-ring { opacity: 0.15 !important; }\n")
elif name=="FCCLIP":  # forced colours: the outline exists, its paint is clipped away (ABS pass-6 clip-path shape)
    append(GC, "\n@media (forced-colors: active) {\n  .game-card.is-center, .staging-btn { clip-path: inset(0) !important; }\n}\n")
elif name=="X7UPPER":  # CSS function names are ASCII case-insensitive: VAR() is var()
    edit("src/pencil/sheet/AnswerKeyLaminate.vue", "<template>", '<template>\n  <i style="animation-duration: VAR(--motion-note, 280ms)"></i>')
elif name=="X8STEM":  # a var(--stem-${x}) template in a script write (SHAPE law: every stem)
    edit("src/pencil/sheet/AnswerKeyLaminate.vue", '<script setup lang="ts">', '<script setup lang="ts">\nconst rung = "note";\ndocument.body.style.setProperty("animation-duration", `var(--motion-${rung}, 280ms)`);')
elif name=="X9CONCAT":  # a concatenated masked default in a script write
    edit("src/pencil/sheet/AnswerKeyLaminate.vue", '<script setup lang="ts">', '<script setup lang="ts">\ndocument.body.style.setProperty("animation-duration", "var(--motion-note" + ", 280ms)");')
elif name=="NOPREF2":  # global: the chrome ring faint, and tier 2 faint, for every reader who has not asked for reduced motion
    append("src/assets/index.css", "\n@media (prefers-reduced-motion: no-preference) {\n  .focus-ring { opacity: 0.15 !important; }\n}\n")
    append(GC, "\n@media (prefers-reduced-motion: no-preference) {\n  .cell-ghost.is-active { opacity: 0.2 !important; }\n}\n")
elif name=="COARSE2":
    append("src/assets/index.css", "\n@media (pointer: coarse) {\n  .focus-ring { opacity: 0.15 !important; }\n}\n")
    append(GC, "\n@media (pointer: coarse) {\n  .cell-ghost.is-active { opacity: 0.2 !important; }\n}\n")
elif name=="MORE2":
    append("src/assets/index.css", "\n@media (prefers-contrast: more) {\n  .focus-ring { opacity: 0.15 !important; }\n}\n")
elif name=="DARKX4b":
    append("src/assets/index.css", "\n.dark .focus-ring { opacity: 0.15 !important; }\n")
elif name=="FCCLIP2":
    append("src/assets/index.css", "\n@media (forced-colors: active) {\n  .game-card.is-center, .staging-btn { clip-path: inset(0) !important; }\n}\n")
else:
    raise SystemExit("unknown plant "+name)
