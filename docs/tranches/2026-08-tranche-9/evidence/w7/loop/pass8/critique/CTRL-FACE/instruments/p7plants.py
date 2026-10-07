import sys,re
name=sys.argv[1]
OS="src/pencil/chrome/OptionSelector/OptionSelector.vue"
MT="src/main.ts"
HL="src/pencil/chrome/HandwrittenLogo/HandwrittenLogo.vue"
def app(f,s):
    open(f,"a").write(s)
def sub(f,a,b):
    t=open(f).read(); assert a in t,(f,a); open(f,"w").write(t.replace(a,b,1))
if name=="mint-face-token": app(OS,'\n<style scoped>\n.ctrl-word { --face-plant: "Comic Sans MS", cursive; font-family: var(--face-plant); }\n</style>\n')
elif name=="shadow-face-token-scoped": app(OS,'\n<style scoped>\n.ctrl-word { --face-printed: "Comic Sans MS", cursive; }\n</style>\n')
elif name=="shadow-font-token-root": app(OS,'\n<style>\n:root { --font-display: "Comic Sans MS"; }\n</style>\n')
elif name=="script-style-string": sub(HL,"text{font-family:'FrauncesBake',Georgia,serif;","text{font-family:'Comic Sans MS',cursive;")
elif name=="ts-style-string": app(MT,'\nexport const PLANT_CSS = `<style>.ctrl-word{font-family:"Comic Sans MS"}</style>`;\n')
elif name=="cssText": app(MT,'\ndocument.body.style.cssText = "font-family: Comic Sans MS";\n')
elif name=="setAttribute-style": app(MT,'\ndocument.body.setAttribute("style", "font-family: Comic Sans MS");\n')
elif name=="style.font shorthand": app(MT,'\ndocument.body.style.font = "16px Comic Sans MS";\n')
elif name=="ts h() style object": app(MT,'\nexport const plantVNode = { style: { fontFamily: "Comic Sans MS" } };\n')
elif name=="svg font-family attr": sub(OS,'<span class="ctrl-word">{{ opt.label }}</span>','<span class="ctrl-word">{{ opt.label }}</span><svg><text font-family="Comic Sans MS">x</text></svg>')
elif name=="tailwind font-(--var)": 
    sub(OS,'<span class="ctrl-word">{{ opt.label }}</span>','<span class="ctrl-word font-(--plant-lit)">{{ opt.label }}</span>'); app(OS,'\n<style>\n:root { --plant-lit: "Comic Sans MS"; }\n</style>\n')
elif name=="tailwind :class object": sub(OS,'<span class="ctrl-word">{{ opt.label }}</span>','<span class="ctrl-word" :class="{ \'font-serif\': true }">{{ opt.label }}</span>')
elif name=="tailwind :class string": sub(OS,'<span class="ctrl-word">{{ opt.label }}</span>','<span class="ctrl-word" :class="\'font-serif\'">{{ opt.label }}</span>')
elif name=="style template literal": sub(OS,'<span class="ctrl-word">{{ opt.label }}</span>','<span class="ctrl-word" :style="`font-family: Comic Sans MS`">{{ opt.label }}</span>')
elif name=="font-family var fallback-only (undeclared face)": app(OS,'\n<style scoped>\n.ctrl-word { font-family: var(--face-nope, "Comic Sans MS"); }\n</style>\n')
elif name=="CONTROL literal (must red)": app(OS,'\n<style scoped>\n.ctrl-word { font-family: "Comic Sans MS"; }\n</style>\n')
else: raise SystemExit("unknown "+name)
