import sys
B=sys.argv[1]; p=sys.argv[2]
css=B+"/src/assets/index.css"; typo=B+"/src/assets/typography.css"
if p=="typo_dup_false":
    open(typo,"a").write('\n@property --motion-whisper {\n  syntax: "<time>";\n  inherits: false;\n  initial-value: 0ms;\n}\n')
elif p=="css_var_override":
    open(css,"a").write("\n.margin-note {\n  --motion-whisper: 900ms;\n}\n")
elif p=="global_anim_important":
    open(css,"a").write("\n.margin-note-ink.note-leave-active {\n  animation-duration: 900ms !important;\n}\n")
print("planted",p)
