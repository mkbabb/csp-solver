#!/usr/bin/env python3
# PLR-COUNT pass 8 break battery: each job edits ONE file (a product file or the landed spec),
# runs the named rows, restores by copy, sha1-checks. No deletes of any kind.
import hashlib, os, subprocess, sys, time, shutil, json
FE="/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-52/web/frontend"
C="/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrc8"
PL=FE+"/src/pencil/chrome/PlayerMark/PlayerLobby.vue"
SP=FE+"/e2e/player-tally.spec.ts"
G14="quiet lines paint 4.5:1 on it"; G16="every count from six"
TAIL="\n.pl-state,\n.pl-more {\n  width: fit-content;\n}\n.pl-state,\n.pl-qual,\n.pl-more {\n  -webkit-mask-image: linear-gradient(to left, rgba(0, 0, 0, 0.25) 12%, #000 12%);\n  mask-image: linear-gradient(to left, rgba(0, 0, 0, 0.25) 12%, #000 12%);\n}\n</style>"
HEAD6="\n.pl-state,\n.pl-qual,\n.pl-more {\n  -webkit-mask-image: linear-gradient(to right, rgba(0, 0, 0, 0.25) 6px, #000 6px);\n  mask-image: linear-gradient(to right, rgba(0, 0, 0, 0.25) 6px, #000 6px);\n}\n</style>"
HEAD12F="\n.pl-state,\n.pl-more {\n  -webkit-mask-image: linear-gradient(to right, rgba(0, 0, 0, 0.25) 6px, #000 6px);\n  mask-image: linear-gradient(to right, rgba(0, 0, 0, 0.25) 6px, #000 6px);\n}\n.pl-qual {\n  -webkit-mask-image: linear-gradient(to right, rgba(0, 0, 0, 0.25) 2px, #000 2px);\n  mask-image: linear-gradient(to right, rgba(0, 0, 0, 0.25) 2px, #000 2px);\n}\n</style>"
JOBS={
 "TAIL12-p6file": (PL,"</style>",TAIL,G14),
 "HEAD12F": (PL,"</style>",HEAD12F,G14),
 "HEAD6px": (PL,"</style>",HEAD6,G14),
 "PINKILL": (SP,'sessionStorage.setItem("session-identity-v1"','sessionStorage.setItem("session-identity-vX"',G16),
 "C1-no-added-columns": (SP,"  if (added.length) why.push(","  if (added.length < 0) why.push(",G14),
 "C2-G2-never-gated": (SP,'    if (c === "G2") return floorGated;','    if (c === "G2") return false;',G14+".*dark, dpr 2"),
 "C3-G4-tolerate-all": (SP,"const added = lowsOf(r, \"G4\").filter((k) => !tolerated.has(k));","const added = lowsOf(r, \"G4\").filter(() => false);",G14),
}
sha=lambda f: hashlib.sha1(open(f,"rb").read()).hexdigest()
for name in sys.argv[1:]:
    F,old,new,grep=JOBS[name]
    orig=open(F).read(); s0=sha(F); shutil.copy(F, f"{C}/orig-{name}-{os.path.basename(F)}")
    log=f"{C}/logs/brk-{name}.log"
    try:
        assert orig.count(old)==1, (name, orig.count(old))
        open(F,"w").write(orig.replace(old,new,1)); time.sleep(4)
        print(f"### {name} {os.path.basename(F)} {s0[:12]}->{sha(F)[:12]} load={os.getloadavg()[0]:.0f}", flush=True)
        r=subprocess.run(["npx","playwright","test","-c",".plr-count8/pw.config.ts","player-tally.spec.ts","-g",grep],cwd=FE,env=dict(os.environ,PLRC_DIR="../e2e"),stdout=open(log,"w"),stderr=subprocess.STDOUT)
    finally:
        open(F,"w").write(orig); time.sleep(4)
    for line in open(log):
        if any(k in line for k in ("✓","✘"," passed"," failed")): print("   ",line.strip()[:170])
    print(f"EXIT[{name}]={r.returncode} restored={'OK' if sha(F)==s0 else 'MISMATCH'} load={os.getloadavg()[0]:.0f}", flush=True)
print("BREAKS-DONE",flush=True)
