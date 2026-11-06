# CTRL-FACE pass 10 - CHECK 7 at class: the pass-9 critic's eleven sibling shapes S1-S11
# (critique/CTRL-FACE/README.md gap 3), re-authored from its descriptions (its scratch is gone).
# Each plant is one tail appended to one product file; the runner restores the tree between plants.
import sys
name = sys.argv[1]
MT = "src/main.ts"
IX = "src/assets/index.css"
def app(f, s): open(f, "a").write(s)
CS = '"Comic Sans MS"'
P = {
"S1 Typed OM attributeStyleMap.set font-family": lambda: app(MT, "\ndocument.body.attributeStyleMap.set('font-family', 'Comic Sans MS');\n"),
"S2 insertRule string rule (escaped quotes)": lambda: app(MT, '\ndocument.styleSheets[0]?.insertRule(".ctrl-word { font-family: \\"Comic Sans MS\\"; }");\n'),
"S3 replaceSync + adoptedStyleSheets": lambda: app(MT, "\nconst plantS3 = new CSSStyleSheet();\nplantS3.replaceSync(\".ctrl-word { font-family: 'Comic Sans MS'; }\");\ndocument.adoptedStyleSheets = [...document.adoptedStyleSheets, plantS3];\n"),
"S4 <style>.textContent": lambda: app(MT, "\nconst plantS4 = document.createElement('style');\nplantS4.textContent = \".ctrl-word { font-family: 'Comic Sans MS'; }\";\ndocument.head.appendChild(plantS4);\n"),
"S5 style.fontFamily =": lambda: app(MT, "\ndocument.body.style.fontFamily = 'Comic Sans MS';\n"),
"S6 style.font =": lambda: app(MT, "\ndocument.body.style.font = '16px Comic Sans MS';\n"),
"S7 remote @import + Comic Neue": lambda: app(IX, "\n@import url(\"https://fonts.googleapis.com/css2?family=Comic+Neue\");\n.ctrl-word { font-family: \"Comic Neue\", cursive; }\n"),
"S8 font-family: revert-layer": lambda: app(IX, "\n.ctrl-word { font-family: revert-layer; }\n"),
"S9 font-family: initial": lambda: app(IX, "\n.ctrl-word { font-family: initial; }\n"),
"S10 font: initial": lambda: app(IX, "\n.ctrl-word { font: initial; }\n"),
"S11 --k: revert; font-family: var(--k)": lambda: app(IX, "\n.ctrl-word { --plant-k: revert; font-family: var(--plant-k); }\n"),
"S12 font-family: revert": lambda: app(IX, "\n.ctrl-word { font-family: revert; }\n"),
"S13 var(--undeclared, initial) fallback": lambda: app(IX, "\n.ctrl-word { font-family: var(--plant-none, initial); }\n"),
"N1 NEG font-family: inherit (lawful: the voice cascades)": lambda: app(IX, "\n.ctrl-word { font-family: inherit; }\n"),
"N2 NEG font-family: unset (lawful: inherits)": lambda: app(IX, "\n.ctrl-word { font-family: unset; }\n"),
}
if name == "--list": print("\n".join(P)); sys.exit()
P[name]()
