import sys
P=sys.argv[1]; name=sys.argv[2]
def edit(f, old, new):
    p=P+"/"+f; s=open(p).read(); assert s.count(old)>=1, (name, f); s=s.replace(old,new,1); open(p,"w").write(s)
if name=="X4":
    edit("src/pencil/chrome/FocusRing.vue", "  stroke: var(--ring-ink);\n}", "  stroke: var(--ring-ink);\n  opacity: 0.15;\n}")
elif name=="X4b":
    edit("src/games/shared/gameCell.css", ".cell-ghost.is-active {", ".cell-ghost.is-active {\n  opacity: 0.2 !important;")
elif name=="CLIP0":
    edit("src/pencil/chrome/FocusRing.vue", "  stroke: var(--ring-ink);\n}", "  stroke: var(--ring-ink);\n  clip-path: inset(50%);\n}")
elif name=="X5":
    edit("src/pencil/sheet/AnswerKeyLaminate.vue", "<template>", '<template>\n  <i style="animation-duration: var(--motion-note, 280ms)"></i>')
