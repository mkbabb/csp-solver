#!/usr/bin/env python3
# r5cls-orphans.py <tree css> <control css> <tree src dir>: class selectors the tree's served CSS adds over the control's,
# each checked for a consumer in src/ (template class=, :class, or a script string): a class with none is a comment-minted utility
import re,sys,os
def classes(p):
    t=open(p).read()
    t=re.sub(r"/\*.*?\*/","",t,flags=re.S)
    return set(m.replace("\\","") for m in re.findall(r"\.((?:\\.|[A-Za-z0-9_-])+)",t) if not re.match(r"^\d",m))
tree,ctl=classes(sys.argv[1]),classes(sys.argv[2])
src=""
for d,_,fs in os.walk(sys.argv[3]):
    for f in fs:
        if f.endswith((".vue",".ts",".css",".pcss")) and not f.endswith(".test.ts"): src+=open(os.path.join(d,f),errors="replace").read()
added=sorted(tree-ctl)
orph=[c for c in added if not re.search(r"(?<![A-Za-z0-9_-])"+re.escape(c)+r"(?![A-Za-z0-9_-])",src)]
print(f"tree {len(tree)} classes · control {len(ctl)} · added {len(added)} · added with no src consumer {len(orph)}")
print("added:"," ".join(added)); print("ORPHANS:"," ".join(orph) or "none")
