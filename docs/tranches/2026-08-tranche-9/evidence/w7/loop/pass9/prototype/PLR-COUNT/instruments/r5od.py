#!/usr/bin/env python3
# r5od.py <logdir>: rebuild each b13-*.od (od -c of the planted file) to text and check the plant's bytes are present
import sys,glob,re
L=sys.argv[1]
want={"OPA80F":"opacity: 0.8;","COMB":"repeating-linear-gradient(to right, #000 0 1px, rgba(0, 0, 0, 0.25) 1px 2px)","FADE80F":"color-mix(in srgb, currentColor 80%, transparent)","HEAD12F":"rgba(0, 0, 0, 0.25) 6px, #000 6px","PLUSF2":"{{ LOBBY_COPY.plus(TALLY_MAX, count - TALLY_MAX) }}"}
for f in sorted(glob.glob(L+"/b13-*.od")):
    out=[]
    for line in open(f):
        parts=line.rstrip("\n")[8:]
        for i in range(0,len(parts),4):
            t=parts[i:i+4].strip(); out.append({"\\n":"\n","\\t":"\t","":" "}.get(t,t))
    s="".join(out); name=f.split("b13-")[1].split(".")[0]; w=want.get(name)
    print(name, f.split("/")[-1], "plant bytes present:", (w in s) if w else "n/a", "| \\u escapes:", len(re.findall(r"\\u[0-9a-f]{4}",s)))
