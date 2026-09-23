import sys,re
# one line per (log, theme, B id): min spec-vs-ground over the four cells, px under, glyph-text core median min, frac range, noise, worst-at
for f in sys.argv[1:]:
    t=open(f).read(); ex=re.search(r'EXIT=(\d+)',t)
    by={}
    for m in re.finditer(r'\[(\w+)/(\w+)\] B (p-[0-9a-f]+) cell (\d+)[^"]*"([^"]*)" in ([^·]*?)· spec vs painted ground worst ([\d.]+) \((\d+)/(\d+) px < 4.5\) · glyph-text core median ([\d.]+) \((\d+)/(\d+) core px < 4.5\).*?noise (\d+) px · camo (\d+) px(?: · off the ink line \d+ px)? · box (\d+) px · worst at ([^\n]*?)(?: · UNDER ([^\n]*))?$',t,re.M):
        e,th,bid,c,slug,spec,w,u,n,cm,cu,cn,noise,camo,box,wat,und=m.groups()
        by.setdefault((th,slug),[]).append((float(w),int(u),int(n),float(cm),int(cu),int(cn),int(noise),int(camo),c,wat,und))
    print(f.split('/')[-1],'EXIT',ex and ex.group(1))
    for (th,slug),v in by.items():
        w=min(v,key=lambda x:x[0])
        fr=[x[4]/x[5] for x in v if x[5]]
        print(f"   {th:5} {slug:18} min {w[0]:.3f} (cell {w[8]}) {sum(x[1] for x in v)}/{sum(x[2] for x in v)} px<4.5 · gt median {min(x[3] for x in v):.3f} frac {min(fr):.3f}–{max(fr):.3f} · noise {sum(x[6] for x in v)} camo {sum(x[7] for x in v)} · worst {w[9][:95]}" + (f" · UNDER {w[10][:200]}" if w[10] else ""))
