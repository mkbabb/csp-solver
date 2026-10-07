#!/usr/bin/env python3
# PLR-COUNT pass-8 CRITIC break battery. Each job edits ONE file, runs the named rows, restores by copy,
# sha1-checks. No deletes of any kind.
import hashlib, os, subprocess, sys, time, shutil
FE="/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-52/web/frontend"
C="/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrc8crit"
PL=FE+"/src/pencil/chrome/PlayerMark/PlayerLobby.vue"
SP=FE+"/e2e/player-tally.spec.ts"
G14="quiet lines paint 4.5:1 on it"
Q=".pl-state,\n.pl-qual,\n.pl-more"
HEAD12F="\n.pl-state,\n.pl-more {\n  -webkit-mask-image: linear-gradient(to right, rgba(0, 0, 0, 0.25) 6px, #000 6px);\n  mask-image: linear-gradient(to right, rgba(0, 0, 0, 0.25) 6px, #000 6px);\n}\n.pl-qual {\n  -webkit-mask-image: linear-gradient(to right, rgba(0, 0, 0, 0.25) 2px, #000 2px);\n  mask-image: linear-gradient(to right, rgba(0, 0, 0, 0.25) 2px, #000 2px);\n}\n</style>"
FADE80F="\n"+Q+" {\n  -webkit-text-fill-color: color-mix(in srgb, currentColor 80%, transparent);\n}\n</style>"
COMB="\n"+Q+" {\n  -webkit-mask-image: repeating-linear-gradient(to right, #000 0 1px, rgba(0, 0, 0, 0.25) 1px 2px);\n  mask-image: repeating-linear-gradient(to right, #000 0 1px, rgba(0, 0, 0, 0.25) 1px 2px);\n}\n</style>"
JOBS={
 "HEAD12F-p7file": (PL,"</style>",HEAD12F,G14),
 "FADE80F-file": (PL,"</style>",FADE80F,G14),
 "COMB-file": (PL,"</style>",COMB,G14),
 "OPA80F-file": (PL,"</style>","\n"+Q+" {\n  opacity: 0.8;\n}\n</style>",G14),
 "C5-G5-never-gated": (SP,'    return c !== "G4";','    return c !== "G4" && c !== "G5";',G14),
}
sha=lambda f: hashlib.sha1(open(f,"rb").read()).hexdigest()
for name in sys.argv[1:]:
    F,old,new,grep=JOBS[name]
    orig=open(F).read(); s0=sha(F); shutil.copy(F, f"{C}/bak/orig-{name}-{os.path.basename(F)}")
    log=f"{C}/logs/brk-{name}.log"
    try:
        assert orig.count(old)==1, (name, orig.count(old))
        open(F,"w").write(orig.replace(old,new,1)); time.sleep(5)
        print(f"### {name} {os.path.basename(F)} {s0[:12]}->{sha(F)[:12]} load={os.getloadavg()[0]:.0f}", flush=True)
        r=subprocess.run(["npx","playwright","test","-c",".plrc8crit/pw.config.ts","player-tally.spec.ts","-g",grep],cwd=FE,stdout=open(log,"w"),stderr=subprocess.STDOUT)
    finally:
        open(F,"w").write(orig); time.sleep(5)
    for line in open(log):
        if any(k in line for k in ("✓","✘"," passed"," failed")): print("   ",line.strip()[:170])
    print(f"EXIT[{name}]={r.returncode} restored={'OK' if sha(F)==s0 else 'MISMATCH'} load={os.getloadavg()[0]:.0f}", flush=True)
print("BREAKS-DONE",flush=True)
