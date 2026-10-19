#!/usr/bin/env python3
# Overlay this lane's product files onto W1 = WAVE union + homes.on-WAVE + SELF's pass-9 on-WAVE delta,
# file by file: base = SELF's pass-9 tree where SELF touches the file, else 74a2b5d9; ours = W1; theirs =
# this tree. Writes the merged tree under $S/w1 (a copy of $S/wave + SELF's delta), reports conflicts.
import os, subprocess, sys, shutil
S="$LANE"
W="$TREE"
HOMES=set(l.split()[2][2:] for l in open(sys.argv[1]) if l.startswith("diff --git"))
SELF=set(l.split()[2][2:] for l in open(sys.argv[2]) if l.startswith("diff --git"))
MINE=[l.strip() for l in open(sys.argv[3]) if l.strip()]
W1=os.environ["W1"]
def rd(p):
    return open(p,"rb").read() if os.path.exists(p) else None
def base_of(f):
    if f in SELF: return rd(f"{S}/v9/self9/{f}")
    r=subprocess.run(["git","show",f"74a2b5d9:{f}"],cwd=W,capture_output=True)
    return r.stdout if r.returncode==0 else None
out=[]
for f in MINE:
    if f in HOMES: out.append(f"HOME-SKIP {f}"); continue
    base, ours, theirs = base_of(f), rd(f"{W1}/{f}"), rd(f"{W}/{f}")
    if theirs==base: out.append(f"UNCHANGED {f}"); continue
    if theirs is None:
        if ours is not None: os.makedirs(f"{S}/trash/r2w1-deleted/{os.path.dirname(f)}",exist_ok=True); shutil.move(f"{W1}/{f}",f"{S}/trash/r2w1-deleted/{f}")
        out.append(f"DELETE {f}"); continue
    if ours==base or ours is None and base is None:
        os.makedirs(os.path.dirname(f"{W1}/{f}"),exist_ok=True); open(f"{W1}/{f}","wb").write(theirs); out.append(f"TAKE {f}"); continue
    if ours==theirs: out.append(f"SAME {f}"); continue
    for n,b in (("o",ours),("b",base or b""),("t",theirs)): open(f"{S}/merge/m.{n}","wb").write(b)
    r=subprocess.run(["git","merge-file","-p",f"{S}/merge/m.o",f"{S}/merge/m.b",f"{S}/merge/m.t"],capture_output=True)
    open(f"{W1}/{f}","wb").write(r.stdout)
    out.append(f"MERGE{'-CONFLICT('+str(r.returncode)+')' if r.returncode else ''} {f}")
print("\n".join(out))
