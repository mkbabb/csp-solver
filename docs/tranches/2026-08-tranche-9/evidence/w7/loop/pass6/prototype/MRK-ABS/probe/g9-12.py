import re,sys,os,glob
fe=sys.argv[1]
def files():
    for root,_,fs in os.walk(os.path.join(fe,"src")):
        for f in fs:
            if f.endswith((".css",".vue")): yield os.path.join(root,f)
def strip(s): return re.sub(r"/\*.*?\*/","",s,flags=re.S)
g9=[];g12=[]
for p in files():
    s=open(p).read()
    if p.endswith(".vue"):
        s="\n".join(m.group(1) for m in re.finditer(r"<style[^>]*>(.*?)</style>",s,flags=re.S))
    s=strip(s)
    for m in re.finditer(r"([^{}]*):(focus|focus-within|focus-visible)\b([^{}]*)\{([^{}]*)\}",s):
        if re.search(r"(^|[;\s])border-radius\s*:",m.group(4)): g9.append((os.path.relpath(p,fe),(m.group(1)+":"+m.group(2)+m.group(3)).strip()[:80]))
    for m in re.finditer(r"([^{}]*\.(sudoku|game)-cell:focus-within[^{}]*)\{",s): g12.append((os.path.relpath(p,fe),m.group(1).strip()[:80]))
pc=open(os.path.join(fe,"src/pencil/config/pencilConfig.ts")).read()
rg=re.search(r"export const RING_GEOMETRY = Object\.freeze\(\{(.*?)\}\);",pc,flags=re.S)
keys=re.findall(r"^\s*(\w+):",re.sub(r"/\*\*.*?\*/","",rg.group(1),flags=re.S),flags=re.M) if rg else None
stale=[]
for root,_,fs in os.walk(os.path.join(fe,"src")):
    for f in fs:
        t=open(os.path.join(root,f),errors="ignore").read()
        if re.search(r"kW4|ringSigmaUnits|ringK\b",t): stale.append(f)
print("G-ABS-9 focus rules declaring border-radius:",len(g9),g9)
print("G-ABS-10 RING_GEOMETRY frozen keys:",keys,"| kW4/ringSigmaUnits/ringK in src:",stale)
print("G-ABS-12 cell focus-within rules:",len(g12),g12)
ok = len(g9)==0 and keys==["wanderUnits","inset"] and not stale and len(g12)==0
print("VERDICT", "GREEN" if ok else "RED"); sys.exit(0 if ok else 1)
