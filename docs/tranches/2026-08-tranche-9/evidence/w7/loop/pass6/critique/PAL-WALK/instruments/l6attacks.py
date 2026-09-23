import sys, subprocess, hashlib, os, re
F=sys.argv[1]; probe=sys.argv[2]; S=sys.argv[3]
CSS=F+'/src/assets/index.css'; PI=F+'/src/games/shared/playerIdentity.ts'
def l6():
    r=subprocess.run(['node',probe],capture_output=True,text=True,env={**os.environ,'LAW_FE':F})
    o=r.stdout.splitlines(); i=[k for k,l in enumerate(o) if l.startswith('L6 ')]
    return r.returncode, (o[i[0]][:40]+' | '+o[i[0]+2].strip()[:260]) if i else 'no L6 row'
def c4():
    r=subprocess.run(['node','scripts/check-peer-arcs.mjs'],cwd=F,capture_output=True,text=True); return r.returncode
keep={p:open(p).read() for p in (CSS,PI)}
A={
 'LA1 a dark arm on `.dark .game-cell` (0.20)': (CSS, lambda s: s+'\n.dark .game-cell { --peer-ring-l: 0.2; }\n'),
 'LA2 a dark arm on `html.dark` (0.20)': (CSS, lambda s: s+'\nhtml.dark { --peer-ring-l: 0.2; }\n'),
 'LA3 a light arm on `.board-cells` (0.40)': (CSS, lambda s: s+'\n.board-cells { --peer-ring-l: 0.4; }\n'),
 'LA4 inkFor returns a fixed oklch table (formula text left standing)': (PI, lambda s: s.replace('  return { "--color-user-ink": pair[0], "--color-peer-cursor-ink": pair[1] };',
   '  const T = ["oklch(0.44 0.1 20deg)", "oklch(0.44 0.1 140deg)", "oklch(0.44 0.1 260deg)"];\n  return { "--color-user-ink": T[index % 3], "--color-peer-cursor-ink": pair[1] };')),
}
print('clean', l6(), 'check4', c4())
for n,(p,f) in A.items():
    s=keep[p]; t=f(s); assert t!=s; open(p,'w').write(t)
    print(n, 'L6', l6(), 'check4 exit', c4())
    open(p,'w').write(s); assert hashlib.sha1(open(p,'rb').read()).digest()==hashlib.sha1(s.encode()).digest()
print('clean after', l6())
