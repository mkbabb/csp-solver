import subprocess, shutil, sys, re
S="/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/t9-scratch/work/pass10/crit-NOTE-ERASE"
FE=S+"/copies/sab/web/frontend"; F=FE+"/src/pencil/chrome/MarginNote.vue"
orig=open(F).read(); shutil.copy(F, S+"/MarginNote.sab.orig.vue")
K='''          "animationName" in a &&
          a.playState === "running" &&
          a.timeline === document.timeline,'''
assert orig.count(K)==1
P=[("S0 the pass-9 presence key (pass-9 plant first)", '          "animationName" in a,'),
   ("S1 playState clause cut", '          "animationName" in a &&\n          a.timeline === document.timeline,'),
   ("S2 timeline clause cut", '          "animationName" in a &&\n          a.playState === "running",'),
   ("S3 animationName clause cut", '          a.playState === "running" &&\n          a.timeline === document.timeline,'),
   ("S4 playState !== paused (one species)", '          "animationName" in a &&\n          a.playState !== "paused" &&\n          a.timeline === document.timeline,'),
   ("S5 timeline disjunct: === doc || != null (regex text kept)", '          "animationName" in a &&\n          a.playState === "running" &&\n          (a.timeline === document.timeline || a.timeline != null),'),
   ("S6 playState disjunct: === running || != idle (regex text kept)", '          "animationName" in a &&\n          (a.playState === "running" || a.playState !== "idle") &&\n          a.timeline === document.timeline,'),
]
out=[]
try:
  for name,rep in P:
    open(F,"w").write(orig.replace(K,rep))
    r=subprocess.run(["npx","vitest","run","--maxWorkers=2","src/pencil/chrome/marginNote.motion.test.ts"],cwd=FE,capture_output=True,text=True)
    t=r.stdout+r.stderr
    tests=[l.strip() for l in t.splitlines() if re.search(r'^\s*Tests\s',l)]
    fails=sorted(set(m for m in re.findall(r'FAIL\s+\S+\s+>\s+(.+?)(?:\s\d+ms)?$',t,re.M)))
    out.append(f"{name}: exit {r.returncode} | {tests} | red rows: {fails[:6]}")
finally:
  open(F,"w").write(orig)
print("\n".join(out)); print("restored", open(F).read()==orig)
