#!/usr/bin/env python3
import hashlib, os, subprocess, sys, time, shutil
FE="/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-52/web/frontend"
C="/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrc7crit"
PL=FE+"/src/pencil/chrome/PlayerMark/PlayerLobby.vue"
TAIL="\n.pl-state,\n.pl-more {\n  width: fit-content;\n}\n.pl-state,\n.pl-qual,\n.pl-more {\n  -webkit-mask-image: linear-gradient(to left, rgba(0, 0, 0, 0.25) 12%, #000 12%);\n  mask-image: linear-gradient(to left, rgba(0, 0, 0, 0.25) 12%, #000 12%);\n}\n</style>"
HEAD6="\n.pl-state,\n.pl-qual,\n.pl-more {\n  -webkit-mask-image: linear-gradient(to right, rgba(0, 0, 0, 0.25) 6px, #000 6px);\n  mask-image: linear-gradient(to right, rgba(0, 0, 0, 0.25) 6px, #000 6px);\n}\n</style>"
HEAD12F="\n.pl-state,\n.pl-more {\n  -webkit-mask-image: linear-gradient(to right, rgba(0, 0, 0, 0.25) 6px, #000 6px);\n  mask-image: linear-gradient(to right, rgba(0, 0, 0, 0.25) 6px, #000 6px);\n}\n.pl-qual {\n  -webkit-mask-image: linear-gradient(to right, rgba(0, 0, 0, 0.25) 2px, #000 2px);\n  mask-image: linear-gradient(to right, rgba(0, 0, 0, 0.25) 2px, #000 2px);\n}\n</style>"
JOBS={"TAIL12-p6file":TAIL,"HEAD6px":HEAD6,"HEAD12F":HEAD12F}
sha=lambda f: hashlib.sha1(open(f,"rb").read()).hexdigest()
for name in sys.argv[1:]:
    orig=open(PL).read(); s0=sha(PL); shutil.copy(PL, C+"/PlayerLobby.vue.orig")
    log=f"{C}/logs/brk-{name}.log"
    try:
        assert orig.count("</style>")==1
        open(PL,"w").write(orig.replace("</style>", JOBS[name],1)); time.sleep(3)
        print(f"### {name} {s0[:12]}->{sha(PL)[:12]} load={os.getloadavg()[0]:.0f}", flush=True)
        r=subprocess.run(["npx","playwright","test","-c",".plrc7crit/pw.config.ts","player-tally.spec.ts","-g","quiet lines paint 4.5:1 on it"],cwd=FE,stdout=open(log,"w"),stderr=subprocess.STDOUT)
    finally:
        open(PL,"w").write(orig); time.sleep(3)
    for line in open(log):
        if any(k in line for k in ("✓","✘"," passed"," failed")): print("   ",line.strip()[:200])
    print(f"EXIT[{name}]={r.returncode} restored={'OK' if sha(PL)==s0 else 'MISMATCH'} load={os.getloadavg()[0]:.0f}", flush=True)
print("BREAKS-DONE",flush=True)
