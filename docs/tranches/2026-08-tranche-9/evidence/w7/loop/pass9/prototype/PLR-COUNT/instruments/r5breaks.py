#!/usr/bin/env python3
# PLR-COUNT pass-9 (attempt 4) FILE-plant + clause/threshold sabotage battery. One edit per job (a product file, or
# an env switch), the named rows run, the file restored by copy and sha1-checked. Exits written bare.
import hashlib, os, subprocess, sys, time, shutil
FE="$TREE/web/frontend"
S="$LANE"
PL=FE+"/src/pencil/chrome/PlayerMark/PlayerLobby.vue"
PM=FE+"/src/pencil/chrome/PlayerMark/PlayerMark.vue"
G14="quiet lines paint no worse"
PROJS=os.environ.get("B13_PROJS","chromium,webkit").split(",")
TAG="+".join(PROJS)
PLUSROW="reaches only the mark's accessible name"
WIDEROW="laps no cell"
SP=FE+"/e2e/player-tally.spec.ts"
Q=".pl-state,\n.pl-qual,\n.pl-more"
def css(body): return "\n"+Q+" {\n"+body+"}\n</style>"
HEAD12F="\n.pl-state,\n.pl-more {\n  -webkit-mask-image: linear-gradient(to right, rgba(0, 0, 0, 0.25) 6px, #000 6px);\n  mask-image: linear-gradient(to right, rgba(0, 0, 0, 0.25) 6px, #000 6px);\n}\n.pl-qual {\n  -webkit-mask-image: linear-gradient(to right, rgba(0, 0, 0, 0.25) 2px, #000 2px);\n  mask-image: linear-gradient(to right, rgba(0, 0, 0, 0.25) 2px, #000 2px);\n}\n</style>"
STRIPE="repeating-linear-gradient(to right, #000 0 1px, rgba(0, 0, 0, 0.25) 1px 2px)"
JOBS={
 # file plants (product CSS written into the sheet's own file)
 "OPA80F": (PL,"</style>",css("  opacity: 0.8;\n"),G14,{}),
 "COMB": (PL,"</style>",css(f"  -webkit-mask-image: {STRIPE};\n  mask-image: {STRIPE};\n"),G14,{}),
 "FADE80F": (PL,"</style>",css("  -webkit-text-fill-color: color-mix(in srgb, currentColor 80%, transparent);\n"),G14,{}),
 "HEAD12F": (PL,"</style>",HEAD12F,G14,{}),
 # the plus line painted in the mark's own template (the `{{ markName }}` shape)
 "PLUSF": (PM,'      <g v-if="remainder" class="pt-plus"','      <text x="0" y="0" font-size="1">{{ LOBBY_COPY.plus(TALLY_MAX, 1) }}</text>\n      <g v-if="remainder" class="pt-plus"',PLUSROW,{}),
 # PLUSF re-placed (run 1's text sat in the tally's <svg>, which N=6/16 under arm (title) never renders):
 # the plus line written beside the count the mark DOES render at six and sixteen
 "PLUSF2": (PM,"      >{{ count }}</span\n","      >{{ count }} {{ LOBBY_COPY.plus(TALLY_MAX, count - TALLY_MAX) }}</span\n",PLUSROW,{}),
 # PLACE's graft, the per-conjunct battery on the widest board's lap predicate (x-overlap AND y-overlap): each conjunct
 # deleted from the SPEC must red the row in some cell, or the clause is unpinned
 "LAPX": (SP,"                Math.min(a.right, b.right) - Math.max(a.left, b.left) > 0.5 &&\n","                true &&\n",WIDEROW,{}),
 "LAPY": (SP,"                Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 0.5\n","                true\n",WIDEROW,{}),
 # clause sabotage: each clause deleted from the verdict (C1..C5); threshold sabotage on the slack
 "C1": (None,None,None,G14,{"G14_DROP":"G1"}),
 "C2": (None,None,None,G14,{"G14_DROP":"G2"}),
 "C3": (None,None,None,G14,{"G14_DROP":"G3"}),
 "C4": (None,None,None,G14,{"G14_DROP":"G4"}),
 "C5": (None,None,None,G14,{"G14_DROP":"G5"}),
 "SLACK-eps": (None,None,None,G14,{"G14_SLACK":"-0.005"}),
 "SLACK+eps": (None,None,None,G14,{"G14_SLACK":"0.005"}),
}
sha=lambda f: hashlib.sha1(open(f,"rb").read()).hexdigest()
for name in sys.argv[1:]:
    F,old,new,grep,env=JOBS[name]
    log=f"{S}/logs/r5/b13-{name}.{TAG}.all.log"
    s0=None
    while os.getloadavg()[0] > 120:  # LAWS P8 §B: no battery opens above 200; a row read above 120 is printed, never a verdict
        print(f"... {name} waits: load {os.getloadavg()[0]:.0f}", flush=True); time.sleep(60)
    try:
        if F:
            orig=open(F).read(); s0=sha(F); shutil.copy(F, f"{S}/bak/r5-orig-{name}-{os.path.basename(F)}")
            assert orig.count(old)==1, (name, orig.count(old))
            open(F,"w").write(orig.replace(old,new,1)); time.sleep(5)
            subprocess.run(["od","-c",F],stdout=open(f"{S}/logs/r5/b13-{name}.{TAG}.od","w"))
        print(f"### {name} {os.path.basename(F) if F else 'env '+str(env)} {(s0 or '')[:12]}->{(sha(F) if F else '')[:12]} load={os.getloadavg()[0]:.0f}", flush=True)
        open(f"{S}/logs/r5/PLANTED","w").write(f"{name} {F}\n")
        rc={}
        for proj in PROJS:  # each project its own guarded call (webkit --exclusive webkit), via r5run.sh
            subprocess.run([f"{S}/bin/r5run.sh",f"b13-{name}","player-tally.spec.ts",grep,proj]+[f"{k}={v}" for k,v in env.items()])
            rc[proj]=open(f"{S}/logs/r5/b13-{name}.{proj}.exit").read().strip()
        open(log,"w").write("".join(open(f"{S}/logs/r5/b13-{name}.{p}.log").read() for p in PROJS))
        r=type("R",(),{"returncode":0 if all(v=="exit=0" for v in rc.values()) else 1})()
    finally:
        if F: open(F,"w").write(orig); time.sleep(5)
        os.replace(f"{S}/logs/r5/PLANTED", f"{S}/trash/PLANTED-{name}-{int(time.time())}") if os.path.exists(f"{S}/logs/r5/PLANTED") else None
    open(f"{S}/logs/r5/b13-{name}.{TAG}.all.exit","w").write(f"exit={r.returncode} {rc}\n")
    for line in open(log):
        if any(k in line for k in ("✓","✘"," passed"," failed")): print("   ",line.strip()[:170])
    print(f"EXIT[{name}]={r.returncode} restored={'OK' if (not F or sha(F)==s0) else 'MISMATCH'} load={os.getloadavg()[0]:.0f}", flush=True)
print("BREAKS-DONE",flush=True)
