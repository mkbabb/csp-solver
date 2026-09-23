import sys, subprocess, hashlib, os, json
F=sys.argv[1]; out=[]
def sha(p): return hashlib.sha1(open(p,'rb').read()).hexdigest() if os.path.exists(p) else None
def run(): 
    r=subprocess.run(['node','scripts/check-peer-arcs.mjs'],cwd=F,capture_output=True,text=True)
    fails=[l.strip() for l in (r.stdout+r.stderr).splitlines() if '✗' in l or 'declares' in l or 'spells' in l or 'carries' in l][:3]
    return r.returncode, fails
GC='src/games/shared/gameCell.css'; IH='index.html'; BH='src/games/shared/BoardHost.vue'; PI='src/games/shared/playerIdentity.ts'; PUB='public/peer.css'
def app(rel, txt):
    def f():
        p=os.path.join(F,rel); open(p,'a').write(txt)
    return [rel], f
def rep(rel, a, b):
    def f():
        p=os.path.join(F,rel); s=open(p).read(); assert s.count(a)==1,(rel,a); open(p,'w').write(s.replace(a,b))
    return [rel], f
def multi(*parts):
    rels=[r for p in parts for r in p[0]]
    def f():
        for p in parts: p[1]()
    return rels, f
HEAD='</head>'
A={
 'X1 alias in gameCell.css': app(GC,'\n.game-cell { --color-peer-cursor-ink: var(--color-foreground); }\n'),
 'X6 color-mix in gameCell.css': app(GC,'\n.game-cell svg { --color-peer-cursor-ink: color-mix(in oklch, currentColor 60%, black); }\n'),
 'X2 :root band in index.html <style>': rep(IH,HEAD,'<style>:root{--peer-ring-l:.2}</style>\n'+HEAD),
 'K1 public/peer.css band + ink alias, linked from index.html': multi(app(PUB,':root{--peer-ring-l:.2}\n.game-cell{--color-peer-cursor-ink:var(--color-foreground)}\n'), rep(IH,HEAD,'<link rel="stylesheet" href="/peer.css">\n'+HEAD)),
 'K6 BoardHost local ink aliased upstream of the admitted site': rep(BH,'const ink = row?.ink["--color-peer-cursor-ink"];','const ink = row && "var(--color-foreground)";'),
 'K6b BoardHost local ink color-mixed upstream of the admitted site': rep(BH,'const ink = row?.ink["--color-peer-cursor-ink"];','const ink = row && `color-mix(in oklch, ${row.ink["--color-peer-cursor-ink"]} 55%, black)`;'),
 'K13 playerIdentity pair[1] re-bound before the return': rep(PI,'  return { "--color-user-ink": pair[0], "--color-peer-cursor-ink": pair[1] };','  pair = [pair[0], `color-mix(in oklch, ${pair[1]} 55%, black)`];\n  return { "--color-user-ink": pair[0], "--color-peer-cursor-ink": pair[1] };'),
 'K12 the digit half aliased (--color-user-ink) on a descendant': app(GC,'\n.game-cell .glyph-svg { --color-user-ink: var(--color-foreground); }\n'),
}
e0,_=run(); out.append(f'clean exit {e0}')
for name,(rels,f) in A.items():
    keep={r:(open(os.path.join(F,r),'rb').read() if os.path.exists(os.path.join(F,r)) else None) for r in rels}
    h={r:sha(os.path.join(F,r)) for r in rels}
    f(); e,fails=run()
    for r,b in keep.items():
        p=os.path.join(F,r)
        if b is None: os.rename(p, p+'.critpw6-removed')  # no rm: moved aside
        else: open(p,'wb').write(b)
    ok=all(sha(os.path.join(F,r))==h[r] for r in rels)
    out.append(f'{name}: exit {e} · restored {"sha1-equal" if ok else "MISMATCH"} · {fails[:1]}')
e1,_=run(); out.append(f'clean after exit {e1}')
print('\n'.join(out))
