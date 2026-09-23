import sys,re
B=sys.argv[1]; p=sys.argv[2]
cfg=B+"/src/pencil/config/pencilConfig.ts"; sfc=B+"/src/pencil/chrome/MarginNote.vue"; css=B+"/src/assets/index.css"
def ed(f,fn):
    s=open(f).read(); t=fn(s)
    assert t!=s, "plant did not change "+f
    open(f,"w").write(t)
if p=="whisper125": ed(cfg,lambda s:s.replace("whisper: 150,","whisper: 125,",1))
elif p=="rise600": ed(cfg,lambda s:re.sub(r"rise: 520,","rise: 600,",s,1))
elif p=="step1": ed(cfg,lambda s:s.replace("step: 440,","step: 1,",1))
elif p=="swap": ed(cfg,lambda s:s.replace("whisper: 150,","whisper: 350,",1).replace("dusk: 350,","dusk: 150,",1))
elif p=="deadhook": ed(sfc,lambda s:s.replace("function stopTheClock(el: Element): void {\n","function stopTheClock(el: Element): void {\n  if (el) return;\n",1))
elif p=="noimportant": ed(sfc,lambda s:s.replace('setProperty("transition", "none", "important")','setProperty("transition", "none")',1))
elif p=="durimportant": ed(sfc,lambda s:s.replace('setProperty("transition", "none", "important")','setProperty("transition-duration", "0s", "important")',1))
elif p=="del_whisper": ed(css,lambda s:re.sub(r"@property --motion-whisper \{[^}]*\}\n","",s,1))
elif p=="del_rise": ed(css,lambda s:re.sub(r"@property --motion-rise \{[^}]*\}\n","",s,1))
elif p=="nest7": ed(css,lambda s:re.sub(r"(@property --motion-whisper[\s\S]*?@property --motion-rise \{[^}]*\})",r":root {\n\1\n}",s,1))
elif p=="inhfalse": ed(css,lambda s:re.sub(r"(@property --motion-whisper \{[^}]*?)inherits: true",r"\1inherits: false",s,1))
elif p=="sfc_dup_false": ed(sfc,lambda s:s.replace("<style scoped>","<style>\n@property --motion-whisper {\n  syntax: \"<time>\";\n  inherits: false;\n  initial-value: 0ms;\n}\n</style>\n<style scoped>",1) if "<style scoped>" in s else s.replace("<style>","<style>\n@property --motion-whisper {\n  syntax: \"<time>\";\n  inherits: false;\n  initial-value: 0ms;\n}\n",1))
elif p=="css_var_override": ed(css,lambda s:s+"\n.margin-note { --motion-whisper: 900ms; }\n")
elif p=="anim_dur_important": ed(sfc,lambda s:s.replace("</style>","\n.margin-note-ink.note-leave-active { animation-duration: 900ms !important; }\n</style>",1))
else: sys.exit("unknown plant")
print("planted",p)
