#!/usr/bin/env python3
import hashlib, os, subprocess, sys, time
FE="/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-52/web/frontend"
C="/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrc7crit"
PM=FE+"/src/pencil/chrome/PlayerMark/PlayerMark.vue"
ARM_C=('const SIX_ARM = "title"','const SIX_ARM = "remainder"')
P6NAME=("? `${stateLine.value}, ${LOBBY_COPY.plus(TALLY_MAX, remainder.value)}`","? `${LOBBY_COPY.count(TALLY_MAX)} ${LOBBY_COPY.more(remainder.value)}`")
# a name that keeps one referent in words but miscounts: the state line of five, then the mark
MISCOUNT=("? `${stateLine.value}, ${LOBBY_COPY.plus(TALLY_MAX, remainder.value)}`","? `${LOBBY_COPY.count(TALLY_MAX)}, ${LOBBY_COPY.plus(TALLY_MAX, remainder.value)}`")
JOBS={"C-cured":[ARM_C],"C-P6NAME":[ARM_C,P6NAME],"C-MISCOUNT":[ARM_C,MISCOUNT]}
sha=lambda f: hashlib.sha1(open(f,"rb").read()).hexdigest()
for name in sys.argv[1:]:
    orig=open(PM).read(); s0=sha(PM)
    try:
        s=orig
        for a,b in JOBS[name]:
            assert s.count(a)==1,(name,a); s=s.replace(a,b)
        open(PM,"w").write(s); time.sleep(3)
        print(f"### {name} {s0[:12]}->{sha(PM)[:12]}",flush=True)
        for spec,g in [("player-mark.spec.ts","never scrolls"),("player-tally.spec.ts","carries every digit")]:
            log=f"{C}/logs/arm-{name}-{spec}.log"
            r=subprocess.run(["npx","playwright","test","-c",".plrc7crit/pw.config.ts",spec,"-g",g],cwd=FE,stdout=open(log,"w"),stderr=subprocess.STDOUT)
            res=[l.strip()[:160] for l in open(log) if " passed" in l or " failed" in l]
            print(f"   {spec} -g '{g}': EXIT={r.returncode} {res}",flush=True)
    finally:
        open(PM,"w").write(orig); time.sleep(3)
    print(f"restored={'OK' if sha(PM)==s0 else 'MISMATCH'} load={os.getloadavg()[0]:.0f}",flush=True)
print("ARMS-DONE",flush=True)
