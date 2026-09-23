#!/usr/bin/env python3
"""PLR-COUNT pass 6 — drive the owner's forks by flipping ONE const at a time on the work tree,
run the named specs against dev :4242, restore the file and check its sha1.
Usage: arms6.py <job> ; jobs: frames | estate"""
import hashlib, json, os, subprocess, sys, time
FE = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-52/web/frontend"
PM = FE + "/src/pencil/chrome/PlayerMark/PlayerMark.vue"
US = FE + "/src/games/shared/useSession.ts"
R = "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/plrcount6-rig"
PAYLOAD = json.load(open(R + "/payload.json"))["payload"]
env = dict(os.environ, PROTO_DEV="http://127.0.0.1:4242", PAYLOAD=PAYLOAD, CROPS=R + "/crops", PLRC_WORKERS="2")
sha = lambda f: hashlib.sha1(open(f, "rb").read()).hexdigest()
SIX = lambda v: (PM, 'const SIX_ARM = "title" as', f'const SIX_ARM = "{v}" as')
ARMS = {
  "frames": [
    ("title", None, ("inst", "p6-frames.spec.ts", "strip|solo desk")),
    ("heading", SIX("heading"), ("inst", "p6-frames.spec.ts", "strip")),
    ("remainder", SIX("remainder"), ("inst", "p6-frames.spec.ts", "strip")),
    ("gate", (PM, 'const SOLO_ARM: "keep" | "gate-on-a-room" = "keep";', 'const SOLO_ARM: "keep" | "gate-on-a-room" = "gate-on-a-room";'), ("inst", "p6-frames.spec.ts", "solo desk")),
    ("f1false", (US, "export const SELF_TAKES_A_HAND: boolean = true;", "export const SELF_TAKES_A_HAND: boolean = false;"), ("inst", "p6-frames.spec.ts", "strip")),
  ],
  "estate": [
    ("heading", SIX("heading"), ("../e2e", "player-tally.spec.ts", None)),
    ("remainder", SIX("remainder"), ("../e2e", "player-tally.spec.ts|player-mark.spec.ts", None)),
  ],
}
for arm, edit, (tdir, spec, grep) in ARMS[sys.argv[1]]:
    f = edit[0] if edit else None
    before = sha(f) if f else None
    if f:
        src = open(f).read(); assert src.count(edit[1]) == 1, arm
        open(f, "w").write(src.replace(edit[1], edit[2])); time.sleep(3)
    for proj in ("chromium", "webkit"):
        cmd = ["npx", "playwright", "test", "--config", ".plr-count6/pw.config.ts", f"--project={proj}", *spec.split("|")]
        if grep: cmd += ["-g", grep]
        r = subprocess.run(cmd, cwd=FE, env=dict(env, ARM=arm, PLRC_DIR=tdir, PLRC_PWOUT=f"{R}/pw-out-arms-{arm}"), capture_output=True, text=True)
        print(f"### {arm} {proj} {spec} -g '{grep}'")
        for line in r.stdout.splitlines():
            if any(s in line for s in ("✓", "✘", " passed", " failed", " skipped", "Error:", "G7 WIDTHS", "G16 ", "WIDTH TABLE", "LEAVE WHILE")): print("   ", line[:300])
        print(f"EXIT[{arm}/{proj}]={r.returncode}", flush=True)
    if f:
        open(f, "w").write(src); time.sleep(2)
        print(f"RESTORED[{arm}]={'OK' if sha(f) == before else 'MISMATCH'} {os.path.basename(f)} {before[:12]}", flush=True)
print("### DONE")
