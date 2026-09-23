import subprocess, shutil, hashlib, os, sys
os.chdir(sys.argv[1])
def sha(p): return hashlib.sha1(open(p,'rb').read()).hexdigest()
G='src/games/shared/gameCell.css'; PI='src/games/shared/playerIdentity.ts'; BH='src/games/shared/BoardHost.vue'; IH='index.html'; GB='src/games/shared/GameBoard.vue'; US='src/games/shared/useSession.ts'
attacks = [
 ("X1 token alias: .game-cell { --color-peer-cursor-ink: var(--color-foreground) } in gameCell.css", G, lambda s: s + "\n.game-cell { --color-peer-cursor-ink: var(--color-foreground); }\n"),
 ("X2 index.html <style>:root{--peer-ring-l:.2}</style>", IH, lambda s: s.replace("</head>", "<style>:root{--peer-ring-l:.2}</style></head>",1)),
 ("X3 computed-name setProperty in useSession.ts", US, lambda s: s + '\nconst bandKey = "--peer-" + "ring-l";\nexport const shade = () => document.documentElement.style.setProperty(bandKey, "0.2");\n'),
 ("X4 inline array at the ring call site in playerIdentity.ts", PI, lambda s: s.replace('at("--peer-ring-l", RING_BANDS)', 'at("--peer-ring-l", [0.2, 0.79])')),
 ("X5 Tailwind arbitrary class [--peer-ring-l:0.2] in GameBoard.vue template", GB, lambda s: s.replace('class="attribution-tape"', 'class="attribution-tape [--peer-ring-l:0.2]"',1)),
 ("X6 color-mix darkening of the consumer token in gameCell.css", G, lambda s: s + "\n.game-cell { --color-peer-cursor-ink: color-mix(in oklch, currentColor 60%, black); }\n"),
 ("X7 ring consumer stroke rebound in gameCell.css (stroke: var(--color-foreground))", G, lambda s: s.replace("stroke: var(--color-peer-cursor-ink, var(--color-user-ink));", "stroke: var(--color-foreground);")),
 ("X8 dark ring arm via @media prefers-color-scheme in gameCell.css (.dark .game-cell{--peer-ring-l:.6})", G, lambda s: s + "\n.dark .game-cell { --peer-ring-l: .6 }\n"),
 ("X9 a one-number band constant (const RING_L = 0.2) fed to at()", PI, lambda s: s.replace('export const RING_BANDS', 'const RING_L = 0.2;\nexport const RING_BANDS').replace('at("--peer-ring-l", RING_BANDS)', 'at("--peer-ring-l", [RING_L, RING_BANDS[1]] as const)')),
]
for name, f, edit in attacks:
    h0 = sha(f); s = open(f).read(); t = edit(s)
    if t == s: print(f"{name}: PLANT DID NOT APPLY"); continue
    open(f,'w').write(t)
    r = subprocess.run(["node","scripts/check-peer-arcs.mjs"],capture_output=True,text=True)
    fails=[l for l in r.stdout.splitlines()+r.stderr.splitlines() if '✗' in l or 'declares' in l or 'second' in l.lower()][:2]
    open(f,'w').write(s); ok = sha(f)==h0
    print(f"{name}: exit {r.returncode} · restored {'sha1-equal' if ok else 'MISMATCH'} · {fails[:1]}")
r = subprocess.run(["node","scripts/check-peer-arcs.mjs"],capture_output=True,text=True); print("control (clean) exit", r.returncode)
