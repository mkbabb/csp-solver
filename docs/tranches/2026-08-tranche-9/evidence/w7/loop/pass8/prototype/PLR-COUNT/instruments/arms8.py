import hashlib, os, subprocess, time, shutil
FE="/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-52/web/frontend"
C="/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrc8"
PM=FE+"/src/pencil/chrome/PlayerMark/PlayerMark.vue"
PAY="ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5"
sha=lambda f: hashlib.sha1(open(f,"rb").read()).hexdigest()
orig=open(PM).read(); s0=sha(PM); shutil.copy(PM, C+"/orig-arms-PlayerMark.vue")
OLD='const SIX_ARM = "title" as'
assert orig.count(OLD)==1
try:
    for arm in ["title","heading","remainder"]:
        open(PM,"w").write(orig.replace(OLD,f'const SIX_ARM = "{arm}" as',1)); time.sleep(4)
        r=subprocess.run(["npx","playwright","test","-c",".plr-count8/pw.config.ts","p8-frames.spec.ts","--project","chromium"],cwd=FE,env=dict(os.environ,PLRC_DIR=".",PAYLOAD=PAY,ARM=arm,CROPS=C+"/frames/crops"),stdout=open(f"{C}/logs/arm-{arm}.log","w"),stderr=subprocess.STDOUT)
        print(arm, "exit", r.returncode, "sha", sha(PM)[:12], flush=True)
finally:
    open(PM,"w").write(orig); time.sleep(3)
print("restored", "OK" if sha(PM)==s0 else "MISMATCH", s0[:12])
