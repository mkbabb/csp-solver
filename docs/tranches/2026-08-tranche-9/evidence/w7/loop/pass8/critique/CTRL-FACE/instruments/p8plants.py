import sys
name=sys.argv[1]
OS="src/pencil/chrome/OptionSelector/OptionSelector.vue"
MT="src/main.ts"
IX="src/assets/index.css"
TY="src/assets/typography.css"
SPAN='<span class="ctrl-word">{{ opt.label }}</span>'
def app(f,s): open(f,"a").write(s)
def sub(f,a,b):
    t=open(f).read(); assert a in t,(f,a); open(f,"w").write(t.replace(a,b,1))
CS='"Comic Sans MS"'
P={
"A home value hijack --font-hand": lambda: sub(IX,'--font-hand: "Patrick Hand", cursive;','--font-hand: "Comic Sans MS", cursive;'),
"A2 home value hijack --face-written": lambda: sub(TY,'--face-written: var(--font-hand);','--face-written: "Comic Sans MS";'),
"B @font-face name hijack (css)": lambda: app(IX,'\n@font-face { font-family: "Patrick Hand"; src: local("Comic Sans MS"); }\n'),
"C css nesting": lambda: app(OS,'\n<style scoped>\n.hover-item { & .ctrl-word { font-family: "Comic Sans MS"; } }\n</style>\n'),
"D tw arbitrary property": lambda: sub(OS,SPAN,'<span class="ctrl-word [font-family:Comic_Sans_MS]">{{ opt.label }}</span>'),
"E tw family-name hint": lambda: sub(OS,SPAN,'<span class="ctrl-word font-[family-name:Comic_Sans_MS]">{{ opt.label }}</span>'),
"F Object.assign style": lambda: app(MT,'\nObject.assign(document.body.style, { fontFamily: "Comic Sans MS" });\n'),
"G bracket literal key": lambda: app(MT,'\ndocument.body.style["fontFamily"] = "Comic Sans MS";\n'),
"H setProperty font shorthand": lambda: app(MT,'\ndocument.body.style.setProperty("font", "16px Comic Sans MS");\n'),
"I v-bind in SFC css": lambda: (sub(OS,'<script setup lang="ts">','<script setup lang="ts">\nconst plantFam = "Comic Sans MS";'), app(OS,'\n<style scoped>\n.ctrl-word { font-family: v-bind(plantFam); }\n</style>\n')),
"J :style font shorthand obj": lambda: sub(OS,SPAN,'<span class="ctrl-word" :style="{ font: \'16px Comic Sans MS\' }">{{ opt.label }}</span>'),
"K :style array": lambda: sub(OS,SPAN,'<span class="ctrl-word" :style="[{ fontFamily: \'Comic Sans MS\' }]">{{ opt.label }}</span>'),
"N @layer literal": lambda: app(OS,'\n<style>\n@layer components { .ctrl-word { font-family: "Comic Sans MS"; } }\n</style>\n'),
"O @supports literal": lambda: app(OS,'\n<style scoped>\n@supports (display: grid) { .ctrl-word { font-family: "Comic Sans MS"; } }\n</style>\n'),
"U FontFace JS hijack": lambda: app(MT,'\ndocument.fonts.add(new FontFace("Patrick Hand", "local(\'Comic Sans MS\')"));\n'),
"V h() style string": lambda: app(MT,'\nexport const plantV = { style: "font-family: Comic Sans MS" };\n'),
"W cssText +=": lambda: app(MT,'\ndocument.body.style.cssText += ";font-family: Comic Sans MS";\n'),
"X setProperty template name": lambda: app(MT,'\ndocument.body.style.setProperty(`font-family`, "Comic Sans MS");\n'),
"Z svg inline style": lambda: sub(OS,SPAN,SPAN+'<svg><text style="font-family: Comic Sans MS">x</text></svg>'),
"Q new css file": lambda: open("src/assets/plant-face.css","w").write('.ctrl-word { font-family: "Comic Sans MS"; }\n'),
"R font-family: system-ui keyword": lambda: app(OS,'\n<style scoped>\n.ctrl-word { font-family: system-ui; }\n</style>\n'),
"S font: caption system font": lambda: app(OS,'\n<style scoped>\n.ctrl-word { font: caption; }\n</style>\n'),
"T escaped prop name": lambda: app(OS,'\n<style scoped>\n.ctrl-word { font-famil\\79: "Comic Sans MS"; }\n</style>\n'),
"Y uppercase prop": lambda: app(OS,'\n<style scoped>\n.ctrl-word { FONT-FAMILY: "Comic Sans MS"; }\n</style>\n'),
"CONTROL literal (must red)": lambda: app(OS,'\n<style scoped>\n.ctrl-word { font-family: "Comic Sans MS"; }\n</style>\n'),
}
if name=="--list": print("\n".join(P)); sys.exit()
P[name]()
