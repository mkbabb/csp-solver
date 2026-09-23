# PAL-WALK pass 6 · check 4 on the TREE: each plant edited into the real file, the gate run bare, restored by sha1.
import subprocess, hashlib, os, sys, shutil
os.chdir(sys.argv[1]); TRASH=sys.argv[2]
def sha(p): return hashlib.sha1(open(p,'rb').read()).hexdigest()
G='src/games/shared/gameCell.css'; PI='src/games/shared/playerIdentity.ts'; BH='src/games/shared/BoardHost.vue'; IH='index.html'; GB='src/games/shared/GameBoard.vue'; US='src/games/shared/useSession.ts'
NEW='src/games/shared/planted-walk6'
edits = [
 ("X1 .game-cell { --color-peer-cursor-ink: var(--color-foreground) } in gameCell.css", G, lambda s: s + "\n.game-cell { --color-peer-cursor-ink: var(--color-foreground); }\n"),
 ("X2 index.html <style>:root{--peer-ring-l:.2}</style>", IH, lambda s: s.replace("</head>", "<style>:root{--peer-ring-l:.2}</style></head>",1)),
 ("X3 computed-name setProperty in useSession.ts (contrived; not claimed)", US, lambda s: s + '\nconst bandKey = "--peer-" + "ring-l";\nexport const shade = () => document.documentElement.style.setProperty(bandKey, "0.2");\n'),
 ("X4 inline array at the ring call site", PI, lambda s: s.replace('at("--peer-ring-l", RING_BANDS)', 'at("--peer-ring-l", [0.2, 0.79])')),
 ("X5 Tailwind [--peer-ring-l:0.2] on the tape", GB, lambda s: s.replace('class="attribution-tape"', 'class="attribution-tape [--peer-ring-l:0.2]"',1)),
 ("X6 color-mix of the ring ink in gameCell.css", G, lambda s: s + "\n.game-cell { --color-peer-cursor-ink: color-mix(in oklch, currentColor 60%, black); }\n"),
 ("X7 the consumer's stroke rebound (a consumer; out of the claim)", G, lambda s: s.replace("stroke: var(--color-peer-cursor-ink, var(--color-user-ink));", "stroke: var(--color-foreground);")),
 ("X8 .dark .game-cell{--peer-ring-l:.6}", G, lambda s: s + "\n.dark .game-cell { --peer-ring-l: .6 }\n"),
 ("X9 const RING_L = 0.2 fed to at()", PI, lambda s: s.replace('export const RING_BANDS', 'const RING_L = 0.2;\nexport const RING_BANDS').replace('at("--peer-ring-l", RING_BANDS)', 'at("--peer-ring-l", [RING_L, RING_BANDS[1]] as const)')),
 ("C1 export const RING_L = 0.32 (a scalar)", PI, lambda s: s + "\nexport const RING_L = 0.32;\n"),
 ("C2 const cfg = { ringL: { light: 0.32, dark: 0.79 } }", US, lambda s: s + "\nexport const cfg = { ringL: { light: 0.32, dark: 0.79 } };\n"),
 ("C4 setProperty(`--color-peer-${i}-ring`, '#2a3900')", US, lambda s: s + "\nexport const mint = (el: HTMLElement, i: number) => el.style.setProperty(`--color-peer-${i}-ring`, \"#2a3900\");\n"),
 ("C10 style=\"--color-peer-2-ring:#111\" on the tape", GB, lambda s: s.replace('class="attribution-tape"', 'class="attribution-tape" style="--color-peer-2-ring:#111"',1)),
 ("S1 BoardHost's publisher re-valued to a house token", BH, lambda s: s.replace('{ "--color-peer-cursor-ink": ink }', '{ "--color-peer-cursor-ink": "var(--color-foreground)" }')),
 ("S2 the spec's seat writes a literal", 'e2e/peer-walk.spec.ts', lambda s: s.replace('cell.style.setProperty("--color-peer-cursor-ink", ink);', 'cell.style.setProperty("--color-peer-cursor-ink", "#123456");')),
]
def run():
    r = subprocess.run(["node","scripts/check-peer-arcs.mjs"],capture_output=True,text=True)
    f=[l.strip() for l in (r.stdout+r.stderr).splitlines() if l.strip().startswith('•')]
    return r.returncode, f
for name, f, edit in edits:
    h0 = sha(f); s = open(f).read(); t = edit(s)
    if t == s: print(f"{name}: PLANT DID NOT APPLY"); continue
    open(f,'w').write(t); code, fl = run(); open(f,'w').write(s)
    print(f"{name}: exit {code} · restored {'sha1-equal' if sha(f)==h0 else 'MISMATCH'} · {fl[:1]}")
for ext, body, name in [("js", 'document.body.style.setProperty("--peer-ring-l", "0.2");\n', "C7 a .js file setting the band"), ("mjs", 'export const peerInk = { "--color-peer-cursor-ink": "#2a3900" };\n', "C7b a .mjs file declaring a peer ink")]:
    p=f"{NEW}.{ext}"; open(p,'w').write(body); code, fl = run(); shutil.move(p, os.path.join(TRASH, os.path.basename(p)))
    print(f"{name}: exit {code} · moved out {'yes' if not os.path.exists(p) else 'NO'} · {fl[:1]}")

# pass 6, round 2: the index.css ink clause and the Tailwind mint clause, on the tree
TW="[" + "--color-peer-cursor-ink" + ":red]"
more = [
 ("M1 index.css :root { --color-peer-cursor-ink: red } (the band's home is not the ink's)", 'src/assets/index.css', lambda s: s + "\n:root { --color-peer-cursor-ink: red; }\n"),
 ("M2 a Tailwind candidate for the ring ink in README.md (compiles into the shipped CSS)", 'README.md', lambda s: s + "\n<span class=\"" + TW + "\"></span>\n"),
 ("M3 the same candidate in a script under scripts/", 'scripts/check-copy-register.mjs', lambda s: s + "\n// " + TW + "\n"),
]
for name, f, edit in more:
    h0 = sha(f); s = open(f).read(); t = edit(s)
    open(f,'w').write(t); code, fl = run(); open(f,'w').write(s)
    print(f"{name}: exit {code} · restored {'sha1-equal' if sha(f)==h0 else 'MISMATCH'} · {fl[:1]}")
def unit():
    r = subprocess.run(["npx","vitest","run","src/games/shared/useSession.test.ts","-t","no source file spells"],capture_output=True,text=True)
    m=[l.strip() for l in (r.stdout+r.stderr).splitlines() if 'walked ink' in l and ('is 0.' in l or 'from a walked' in l)]
    return r.returncode, m[:1]
for name, f, edit in [
 ("L3 an 8-digit walked digit (i=1, light, #006056ff) in a .vue style", 'src/games/thermo/ThermoTube.vue', lambda s: s.replace("</style>", ".planted { color: #006056ff; }\n</style>",1)),
 ("L1 a walked ring (i=1, light) spelled as a hex in gameCell.css", G, lambda s: s + "\n.x { stroke: #00352e; }\n"),
 ("L2 a walked ring (i=1, dark) as a theme-color in index.html", IH, lambda s: s.replace("</head>", '<meta name="x-ink" content="#95c6bd"></head>',1)),
]:
    h0 = sha(f); s = open(f).read(); open(f,'w').write(edit(s)); code, fl = run(); open(f,'w').write(s)
    print(f"{name}: lint:arcs exit {code} · restored {'sha1-equal' if sha(f)==h0 else 'MISMATCH'} · {fl}")

code, fl = run(); print("control (clean tree) exit", code)
