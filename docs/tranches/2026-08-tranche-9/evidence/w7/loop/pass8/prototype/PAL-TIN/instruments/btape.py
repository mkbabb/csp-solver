# PAL-TIN pass 8 · B-TAPE's ink half: every name-arm row (B's tape) against HEAD's SAME-INDEX ink and pass 7's best hue
import re,sys,glob
rows=[]
for f in sys.argv[1:]:
    for l in open(f, errors='replace'):
        m=re.search(r'TAPE (\w+)·dpr(\d)·(light|dark)·B·cell(\d+).*? name peer-(\d) (rgb\([^)]*\)).*?pop (\d+) median ([\d.]+) <4\.5 ([\d.]+).*?HEAD same-index \(i=(\d), (oklch\([^)]*\))\) ([\d.]+) Δ (-?[\d.]+) · vs HEAD best-hue ([\d.]+) Δ (-?[\d.]+)', l)
        if m: rows.append((f.split('/')[-1],)+m.groups())
LOSERS={('chromium','2','dark','5',c) for c in ('11','12','8')}|{('chromium','1','dark','5',c) for c in ('11','12','8')}
print("log | engine·dpr·theme·cell | arm | name ink | pop | median | <4.5 | HEAD same-index (i, ink) | same-index median | Δ same | HEAD best-hue median | Δ best")
for r in rows:
    f,eng,dpr,th,cell,k,ink,pop,med,fr,i,hink,hs,ds,hb,db=r
    print(f"{f} | {eng}·dpr{dpr}·{th}·cell{cell} | peer-{k} | {ink} | {pop} | {med} | {fr} | i={i} {hink} | {hs} | {ds} | {hb} | {db}")
