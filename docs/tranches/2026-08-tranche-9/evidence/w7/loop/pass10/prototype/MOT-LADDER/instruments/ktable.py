import sys
S="/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass10/MOT-LADDER/logs/"
def rd(t):
    d={}
    for l in open(S+f"kb-{t}/battery.tsv"):
        f=l.rstrip("\n").split("\t")
        if len(f)>=7 and f[0]!="plant": d[f[0]]=f
    return d
o,n=rd("open"),rd("new")
print("| plant | open (homes v3, VERB's gate) bands/motion/verbs | pass 10 bands/motion/verbs | plant exit | restored | load (1/5/15) at the pass-10 row |")
print("|---|---|---|---|---|---|")
for k in o:
    a=o[k]; b=n.get(k)
    bb=f"**{b[2]}**/{b[3]}/{b[4]}" if b else "UNREAD"
    print(f"| {k} | {a[2]}/{a[3]}/{a[4]} | {bb} | {b[1] if b else '-'} | {b[5] if b else '-'} | {b[6].strip('{} ') if b else '-'} |")
