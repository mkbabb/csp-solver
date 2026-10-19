# CTRL-FACE pass 9 — row 3 (ADMITTED_COMPUTED by site) and row 2's binding siblings
import sys
name=sys.argv[1]
GCP="src/games/shared/GameControlPanel.vue"
MT="src/main.ts"
IX="src/assets/index.css"
def app(f,s): open(f,"a").write(s)
def sub(f,a,b):
    t=open(f).read(); assert a in t,(f,a); open(f,"w").write(t.replace(a,b,1))
P={
"P3 second computed setProperty in GCP": lambda: sub(GCP,'<script setup lang="ts">','<script setup lang="ts">\nfunction plantFace3(el: HTMLElement, name: string) { el.style.setProperty(name, "Comic Sans MS"); }\nvoid plantFace3;'),
"P3b computed setProperty in a sibling file": lambda: app(MT,'\nexport function plantFace3b(el: HTMLElement, name: string) { el.style.setProperty(name, "Comic Sans MS"); }\n'),
"B2 @font-face Fira Code rebinding url": lambda: app(IX,'\n@font-face { font-family: "Fira Code"; src: url("./fonts/patrickhand-subset.woff2") format("woff2"); }\n'),
"U2 FontFace const-carried family": lambda: app(MT,'\nconst plantFam = "Fraunces";\ndocument.fonts.add(new FontFace(plantFam, "local(\'Comic Sans MS\')"));\n'),
"U3 FontFace computed family": lambda: app(MT,'\nexport function plantU3(n: string) { document.fonts.add(new FontFace(n, "local(\'Comic Sans MS\')")); }\n'),
"H2 setProperty font shorthand, single quotes": lambda: app(MT,"\ndocument.body.style.setProperty('font', 'italic 16px Comic Sans MS');\n"),
"T2 escaped prop name, hex 6": lambda: app(IX,'\n.ctrl-word { font-famil\\000079: "Comic Sans MS"; }\n'),
}
if name=="--list": print("\n".join(P)); sys.exit()
P[name]()
