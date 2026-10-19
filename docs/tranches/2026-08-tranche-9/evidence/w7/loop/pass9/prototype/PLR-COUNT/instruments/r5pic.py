#!/usr/bin/env python3
# r5pic.py <pi9 log>: bucket the π delta rows (PI9D) by where they sit: the head corners (the mark, the card), or elsewhere
import re,sys,collections
b=collections.Counter(); other=[]
for l in open(sys.argv[1],errors="replace"):
    if not l.startswith("PI9D "): continue
    eng,theme,vp,rest=l.split(" ",4)[1:5]
    key=rest[2:].split(" :: ")[0]
    head=re.search(r"corner-left|corner-right|player|attribution|head-sheet|mobile-attribution|pt-|pl-",key)
    b[(eng,theme,vp,"head" if head else "ELSEWHERE")]+=1
    if not head: other.append(f"{eng} {theme} {vp} {rest[:260].strip()}")
for k,v in sorted(b.items()): print(k,v)
print("ELSEWHERE rows:",len(other))
for o in other[:12]: print("  ",o)
